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

    const now = new Date();
    // const dateDebutDate = new Date(dateDebut);

    // if (now >= dateDebut) {
    //   // If the current date is on or past the dateDebut, change the status to 'taken'
    //   await prisma.post.update({
    //     where: { id: postId },
    //     data: { status: 'taken' }, // Change to 'taken' after dateDebut is passed
    //   });
    // } else {
    //   // If the dateDebut is in the future, keep the status 'available'
    //   await prisma.post.update({
    //     where: { id: postId },
    //     data: { status: 'available' }, // Ensure it stays 'available' if in the future
    //   });
    // }

    const dateReserveData = {
      dateDebut,
      dateFine,
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
