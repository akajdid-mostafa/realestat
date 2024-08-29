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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get('categoryId');
  const typeId = url.searchParams.get('typeId');
  const statusParam = url.searchParams.get('status');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');

  let status: Status | undefined;
  if (statusParam) {
    if (Object.values(Status).includes(statusParam as Status)) {
      status = statusParam as Status;
    } else {
      const response = NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      return setCorsHeaders(response);
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(typeId && { typeId: Number(typeId) }),
        ...(status && { status }),
        ...(minPrice && { prix: { gte: Number(minPrice) } }),
        ...(maxPrice && { prix: { lte: Number(maxPrice) } }),
      },
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
    console.error('Error fetching posts:', error.message || error);
    const response = NextResponse.json({ error: 'Error fetching posts', details: error.message || error }, { status: 500 });
    return setCorsHeaders(response);
  }
}

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
    typeId
  } = await req.json();

  try {
    const post = await prisma.post.create({
      data: {
        img,
        datePost,
        lat,
        lon,
        prix,
        adress,
        ville,
        status,
        title,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        type: typeId ? { connect: { id: typeId } } : undefined,
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
    console.error('Error creating post:', error.message || error);
    const response = NextResponse.json({ error: 'Error creating post', details: error.message || error }, { status: 400 });
    return setCorsHeaders(response);
  }
}
