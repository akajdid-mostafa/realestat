import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get a specific DateReserve entry by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Find the DateReserve entry by ID
    const dateReserve = await prisma.dateReserve.findUnique({
      where: { id },
      include: {
        post: true, // Include related post information
      },
    });

    if (!dateReserve) {
      return NextResponse.json({ error: 'DateReserve not found' }, { status: 404 });
    }

    // Return the found DateReserve entry
    return NextResponse.json(dateReserve, { status: 200 });
  } catch (error) {
    console.error('Error fetching DateReserve by ID:', error);
    return NextResponse.json({ error: `Error fetching DateReserve: ${error.message}` }, { status: 500 });
  }
}
