import { NextResponse } from 'next/server';
import { PrismaClient, TypeName } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust according to your needs
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Handle OPTIONS method for CORS preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Fetch posts by type
export async function GET(req: Request) {
  const url = new URL(req.url);
  const typeName = url.searchParams.get('name') as TypeName;

  if (!typeName) {
    // If no type name is provided, display all types
    try {
      const types = await prisma.type.findMany({
        include: {
          posts: true,
        },
      });

      const response = NextResponse.json(types, { status: 200 });
      return setCorsHeaders(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching all types:', errorMessage);
      const response = NextResponse.json(
        { error: 'Error fetching all types', details: errorMessage },
        { status: 500 }
      );
      return setCorsHeaders(response);
    }
  }

  try {
    const type = await prisma.type.findFirst({
      where: { type: typeName },
      include: {
        posts: true,
      },
    });

    if (!type) {
      const response = NextResponse.json({ error: 'Type not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(type.posts, { status: 200 });
    return setCorsHeaders(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching posts by type:', errorMessage);
    const response = NextResponse.json(
      { error: 'Error fetching posts by type', details: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

// Create a new type
export async function POST(req: Request) {
  const { type } = await req.json();

  if (!type) {
    const response = NextResponse.json({ error: 'Type name is required' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const newType = await prisma.type.create({
      data: { type },
    });

    const response = NextResponse.json(newType, { status: 201 });
    return setCorsHeaders(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating type:', errorMessage);
    const response = NextResponse.json(
      { error: 'Error creating type', details: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
