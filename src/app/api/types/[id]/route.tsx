import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust to allow specific origins
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Handle OPTIONS method for CORS preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Get type by ID
export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const type = await prisma.type.findUnique({
      where: { id: Number(id) },
      include: {
        posts: true, // Include posts related to the type
      },
    });

    if (!type) {
      const response = NextResponse.json({ error: 'Type not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(type, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching type by ID:', error instanceof Error ? error.message : 'Unknown error');
    const response = NextResponse.json({ error: 'Error fetching type by ID', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// Update type by ID
export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const { type } = await req.json();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const updatedType = await prisma.type.update({
      where: { id: Number(id) },
      data: { type },
    });

    const response = NextResponse.json(updatedType, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error updating type:',error instanceof Error ? error.message : 'Unknown error');
    const response = NextResponse.json({ error: 'Error updating type', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// Delete type by ID
export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    await prisma.type.delete({
      where: { id: Number(id) },
    });

    const response = NextResponse.json({ message: 'Type deleted successfully' }, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error deleting type:', error instanceof Error ? error.message : 'Unknown error');
    const response = NextResponse.json({ error: 'Error deleting type', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    return setCorsHeaders(response);
  }
}
