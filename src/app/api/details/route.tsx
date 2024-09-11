import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(req: Request) {
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
    postId
  } = await req.json();

  if (!postId) {
    const response = NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const detail = await prisma.detail.create({
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

    const response = NextResponse.json(detail, { status: 201 });
    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error('Error creating detail:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const response = NextResponse.json({ error: 'Error creating detail', details: errorMessage }, { status: 400 });
    return setCorsHeaders(response);
  }
}

export async function GET() {
  try {
    const details = await prisma.detail.findMany({
      include: {
        post: true,
      },
    });

    const response = NextResponse.json(details, { status: 200 });
    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error('Error fetching details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const response = NextResponse.json({ error: 'Error fetching details', details: errorMessage }, { status: 500 });
    return setCorsHeaders(response);
  }
}

export async function GET() {
  try {
    const details = await prisma.detail.findMany({
      include: {
        post: true,
      },
    });

    const response = NextResponse.json(details, { status: 200 });
    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error('Error fetching details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const response = NextResponse.json({ error: 'Error fetching details', details: errorMessage }, { status: 500 });
    return setCorsHeaders(response);
  }
}