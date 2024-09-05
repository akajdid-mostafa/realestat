import { NextResponse } from 'next/server';
import { PrismaClient, CategoryName, Status } from '@prisma/client';

const prisma = new PrismaClient();

function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function POST(req: Request) {
  try {
    const { dateDebut, dateFine, fullName, price, CIN, postId } = await req.json();

    if (!fullName || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { category: true },
    });

    if (!post) {
      throw new Error('Post with the given ID does not exist');
    }

    const isDateNull = dateDebut === null && dateFine === null;

    const dateReserveData = {
      dateDebut: dateDebut ? new Date(dateDebut) : null,
      dateFine: dateFine ? new Date(dateFine) : null,
      fullName,
      price,
      CIN,
      post: { connect: { id: postId } },
    };

    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

    if (post.category?.name === CategoryName.Location) {
      if (dateFine) {
        await prisma.post.update({
          where: { id: postId },
          data: { status: Status.available },
        });
      } else {
        await prisma.post.update({
          where: { id: postId },
          data: { status: Status.taken },
        });
      }
    } else if (post.category?.name === CategoryName.Vente && isDateNull) {
      await prisma.post.update({
        where: { id: postId },
        data: { status: Status.taken },
      });
    }

    const formattedDateReserve = {
      ...dateReserve,
      dateDebut: dateReserve.dateDebut ? formatDateToYYYYMMDD(dateReserve.dateDebut) : null,
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine) : null,
    };

    return NextResponse.json(formattedDateReserve, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: `Error creating DateReserve: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true,
      },
    });

    const formattedDateReserves = dateReserves.map(dateReserve => ({
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date),
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null,
    }));

    return NextResponse.json(formattedDateReserves, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error fetching DateReserves: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}
