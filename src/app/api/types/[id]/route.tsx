import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get type by ID
export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const type = await prisma.type.findUnique({
      where: { id: Number(id) },
      include: {
        posts: true, // Include posts related to the type
      },
    });

    if (!type) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json(type, { status: 200 });
  } catch (error) {
    console.error('Error fetching type by ID:', error.message || error);
    return NextResponse.json({ error: 'Error fetching type by ID', details: error.message || error }, { status: 500 });
  }
}

// Update type by ID
export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const { type } = await req.json();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const updatedType = await prisma.type.update({
      where: { id: Number(id) },
      data: { type },
    });

    return NextResponse.json(updatedType, { status: 200 });
  } catch (error) {
    console.error('Error updating type:', error.message || error);
    return NextResponse.json({ error: 'Error updating type', details: error.message || error }, { status: 500 });
  }
}

// Delete type by ID
export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    await prisma.type.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Type deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting type:', error.message || error);
    return NextResponse.json({ error: 'Error deleting type', details: error.message || error }, { status: 500 });
  }
}
