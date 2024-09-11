import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const dateReserve = await prisma.dateReserve.findUnique({
      where: { id },
      include: {
        post: true, 
      },
    });

    if (!dateReserve) {
      return NextResponse.json({ error: 'DateReserve not found' }, { status: 404 });
    }

    return NextResponse.json(dateReserve, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching DateReserve by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Error fetching DateReserve: ${errorMessage}` }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const dateReserve = await prisma.dateReserve.delete({
      where: { id },
    });

    return NextResponse.json(dateReserve, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting DateReserve by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Error deleting DateReserve: ${errorMessage}` }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const {
      dateDebut,
      dateFine,
      fullName,
      price,
      CIN,
    } = await req.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const parsedDateDebut = dateDebut ? new Date(dateDebut) : null;
    const parsedDateFine = dateFine ? new Date(dateFine) : null;

    if (parsedDateDebut && parsedDateFine && parsedDateDebut >= parsedDateFine) {
      throw new Error('dateDebut must be less than dateFine');
    }
    const updatedDateReserve = await prisma.dateReserve.update({
      where: { id },
      data: {
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFine: dateFine ? new Date(dateFine) : undefined,
        fullName,
        price,
        CIN,
      },
    });

    return NextResponse.json(updatedDateReserve, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating DateReserve by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Error updating DateReserve: ${errorMessage}` }, { status: 500 });
  }
}


