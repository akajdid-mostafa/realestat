import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to format Date to YYYY-MM-DD
function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Create a new DateReserve entry
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { dateDebut, dateFine, fullName, price, CIN, postId } = await req.json();

    // Validate required fields
    if (!dateDebut || !fullName || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    // Ensure that postId exists in the Post table
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      throw new Error('Post with the given ID does not exist');
    }

    // Parse and format the dateDebut to exclude time
    const formattedDateDebut = new Date(dateDebut);
    formattedDateDebut.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00

    let formattedDateFine: Date | null = null;
    if (dateFine) {
      formattedDateFine = new Date(dateFine);
      formattedDateFine.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00
    }

    // Create the data object with conditional assignment for dateFine
    const dateReserveData: {
      dateDebut: Date;
      dateFine?: Date; // Make dateFine optional
      fullName: string;
      price: string;
      CIN: string;
      post: { connect: { id: number } };
    } = {
      dateDebut: formattedDateDebut,
      fullName,
      price,
      CIN,
      post: { connect: { id: postId } },
    };

    // Conditionally add dateFine if it is not null
    if (formattedDateFine) {
      dateReserveData.dateFine = formattedDateFine;
    }

    // Create the DateReserve entry
    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

    // Format dates before sending the response
    const formattedDateReserve = {
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date), // Format dateDebut
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null, // Ensure dateFine is a Date
    };

    // Return the created DateReserve as a JSON response
    return NextResponse.json(formattedDateReserve, { status: 201 });

  } catch (error) {
    // Log and return error
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error creating DateReserve: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 400 });
  }
}

// Get all DateReserve entries
export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true, // Include related post information
      },
    });

    // Format dates before sending the response
    const formattedDateReserves = dateReserves.map(dateReserve => ({
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date), // Format dateDebut
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null, // Ensure dateFine is a Date
    }));

    // Return all DateReserve entries as a JSON response
    return NextResponse.json(formattedDateReserves, { status: 200 });
  } catch (error) {
    // Log and return error
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error fetching DateReserves: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}
