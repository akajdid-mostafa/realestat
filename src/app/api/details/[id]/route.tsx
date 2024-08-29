import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins or specify your allowed origins
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

export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const detail = await prisma.detail.findUnique({
      where: { id: Number(id) },
    });

    if (!detail) {
      const response = NextResponse.json({ error: 'Detail not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(detail, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching detail:', error);
    const response = NextResponse.json({ error: 'Error fetching detail' }, { status: 500 });
    return setCorsHeaders(response);
  }
}

export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const {
    constructionyear,
    surface,
    rooms,
    bedromms, 
    livingrooms,
    kitchen,
    bathrooms,
    furnished,
    floor,
    elevator,
    parking,
    balcony,
    pool,
    facade,
    documents,
    postId,
  } = await req.json();

  if (!id || isNaN(Number(id))) {
    const response = NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const existingDetail = await prisma.detail.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDetail) {
      const response = NextResponse.json({ error: 'Detail not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const updatedDetail = await prisma.detail.update({
      where: { id: Number(id) },
      data: {
        constructionyear,
        surface,
        rooms,
        bedromms, 
        livingrooms,
        kitchen,
        bathrooms,
        furnished,
        floor,
        elevator,
        parking,
        balcony,
        pool,
        facade,
        documents,
        post: { connect: { id: postId } },
      },
    });

    const response = NextResponse.json(updatedDetail, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error updating detail:', error);
    const response = NextResponse.json({ error: 'Error updating detail' }, { status: 500 });
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
    await prisma.detail.delete({
      where: { id: Number(id) },
    });

    const response = NextResponse.json({ message: 'Detail deleted successfully' }, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error deleting detail:', error);
    const response = NextResponse.json({ error: 'Error deleting detail' }, { status: 500 });
    return setCorsHeaders(response);
  }
}
