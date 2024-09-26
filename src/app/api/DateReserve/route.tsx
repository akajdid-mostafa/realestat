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

    const parsedDateDebut = dateDebut ? new Date(dateDebut) : null;
    const parsedDateFine = dateFine ? new Date(dateFine) : null;

    const isDateNull = parsedDateDebut === null && parsedDateFine === null;

    // Check if current date is greater than or equal to the dateDebut
    const now = new Date();
    if (parsedDateDebut && now >= parsedDateDebut) {
      // If current date is on or past dateDebut, change the status to 'taken'
      await prisma.post.update({
        where: { id: postId },
        data: { status: Status.taken },
      });
    } else if (post.category?.name === CategoryName.Location && parsedDateDebut) {
      // Keep status available if the dateDebut is in the future
      await prisma.post.update({
        where: { id: postId },
        data: { status: Status.available },
      });
    }

    const dateReserveData = {
      dateDebut: parsedDateDebut,
      dateFine: parsedDateFine,
      fullName,
      price: parseFloat(price),
      CIN,
      post: { connect: { id: postId } },
    };

    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

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

// GET
export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
  
    const formattedDateReserves = dateReserves.map(dateReserve => ({
      ...dateReserve,
      dateDebut: dateReserve.dateDebut ? formatDateToYYYYMMDD(dateReserve.dateDebut) : null,
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine) : null,
    }));

    return NextResponse.json(formattedDateReserves, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: `Error fetching DateReserves: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
