import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to set CORS headers (if needed)
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust according to your needs
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Handle OPTIONS method for CORS preflight (if needed)
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(req: Request) {
  const {
    constructionyear,
    surface,
    rooms,
    bedromms,  // Ensure this field matches your schema
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

  // Validate required fields
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
  } catch (error) {
    console.error('Error creating detail:', error.message || error);  // Log the actual error for debugging
    const response = NextResponse.json({ error: 'Error creating detail', details: error.message || error }, { status: 400 });
    return setCorsHeaders(response);
  }
}
