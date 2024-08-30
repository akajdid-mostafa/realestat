import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); // Use a single domain for testing or '*'
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

// Display all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        type: true,
        Detail: true,
        DateReserve: true,
      },
    });

    const response = NextResponse.json(posts, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const message = (error instanceof Error) ? error.message : 'Unknown error';
    console.error('Error fetching posts:', message);
    const response = NextResponse.json({ error: 'Error fetching posts', details: message }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// Create a new post with optional details
export async function POST(req: Request) {
  const {
    img,
    datePost,
    lat,
    lon,
    prix,
    adress,
    ville,
    status,
    title,
    categoryId,
    typeId,
    Detail
  } = await req.json();

  // Validate required fields
  if (!img  || !lat || !lon || !prix || !adress || !ville || !status || !title) {
    const response = NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    // Ensure status is cast correctly
    const post = await prisma.post.create({
      data: {
        img,
        datePost: new Date(datePost),
        lat,
        lon,
        prix,
        adress,
        ville,
        status: status as Status, // Cast status to enum
        title,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        type: typeId ? { connect: { id: typeId } } : undefined,
        Detail: Detail ? {
          create: {
            ...Detail,
          }
        } : undefined,
      },
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
    });

    const response = NextResponse.json(post, { status: 201 });
    return setCorsHeaders(response);
  } catch (error) {
    const message = (error instanceof Error) ? error.message : 'Unknown error';
    console.error('Error creating post:', message);
    const response = NextResponse.json({ error: 'Error creating post', details: message }, { status: 400 });
    return setCorsHeaders(response);
  }
}
