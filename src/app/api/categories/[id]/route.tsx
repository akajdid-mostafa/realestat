import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CORS is handled centrally by src/app/middleware.ts (Sprint 1).
// No-op so route handlers do not override the middleware's origin echo.
function setCorsHeaders(response: NextResponse) {
  return response;
}

// Handle OPTIONS method for CORS preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        posts: true,
      },
    });

    if (!category) {
      const response = NextResponse.json({ error: 'Category not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(category, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching category by ID:', errorMessage);
    const response = NextResponse.json({ error: 'Error fetching category by ID', details: errorMessage }, { status: 500 });
    return setCorsHeaders(response);
  }
}

export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const { name } = await req.json();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    const response = NextResponse.json(updatedCategory, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating category:', errorMessage);
    const response = NextResponse.json({ error: 'Error updating category', details: errorMessage }, { status: 500 });
    return setCorsHeaders(response);
  }
}

export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    const response = NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting category:', errorMessage);
    const response = NextResponse.json({ error: 'Error deleting category', details: errorMessage }, { status: 500 });
    return setCorsHeaders(response);
  }
}
