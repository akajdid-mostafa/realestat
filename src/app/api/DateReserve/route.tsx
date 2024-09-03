import { NextResponse } from 'next/server';
import { PrismaClient, CategoryName, Status } from '@prisma/client';

const prisma = new PrismaClient();

function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function POST(req: Request) {
  try {
    const { dateDebut, dateFine, fullName, price, CIN, postId } = await req.json();

    // Check required fields
    if (!dateDebut || !fullName || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { category: true }, // Include category to check CategoryName
    });

    if (!post) {
      throw new Error('Post with the given ID does not exist');
    }

    // Format dates
    const formattedDateDebut = new Date(dateDebut);
    formattedDateDebut.setUTCHours(0, 0, 0, 0);

    let formattedDateFine: Date | null = null;
    if (dateFine) {
      formattedDateFine = new Date(dateFine);
      formattedDateFine.setUTCHours(0, 0, 0, 0);
    }

    // Prepare data for creating DateReserve
    const dateReserveData = {
      dateDebut: formattedDateDebut,
      dateFine: formattedDateFine || undefined, // Optional field
      fullName,
      price,
      CIN,
      post: { connect: { id: postId } },
    };

    // Create DateReserve entry
    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

    // Check if the category is 'Vente' and update the status
    if (post.category?.name === CategoryName.Vente) {
      await prisma.post.update({
        where: { id: postId },
        data: { status: Status.taken },
      });
    }

    // Format response
    const formattedDateReserve = {
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date),
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null,
    };

    return NextResponse.json(formattedDateReserve, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error creating DateReserve: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 400 });
  }
}

export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true,
      },
    });

    // Format the dates in the response
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
