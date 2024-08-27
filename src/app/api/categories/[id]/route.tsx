import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        posts: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('Error fetching category by ID:', error.message || error);
    return NextResponse.json({ error: 'Error fetching category by ID', details: error.message || error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const { name } = await req.json();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error.message || error);
    return NextResponse.json({ error: 'Error updating category', details: error.message || error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error.message || error);
    return NextResponse.json({ error: 'Error deleting category', details: error.message || error }, { status: 500 });
  }
}