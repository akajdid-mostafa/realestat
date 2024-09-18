import { NextResponse } from 'next/server';
import { PrismaClient, TypeName } from '@prisma/client';

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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const typeName = url.searchParams.get('name') as TypeName;

  if (!typeName) {
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
