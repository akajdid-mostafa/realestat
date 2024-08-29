import { NextResponse } from 'next/server';
import { PrismaClient, CategoryName } from '@prisma/client';

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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryName = url.searchParams.get('name') as CategoryName;

  if (!categoryName) {
    const response = NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
      include: {
        posts: true,
      },
    });

    if (!category) {
      const response = NextResponse.json({ error: 'Category not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const response = NextResponse.json(category.posts, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching posts by category:', error.message || error);
    const response = NextResponse.json({ error: 'Error fetching posts by category', details: error.message || error }, { status: 500 });
    return setCorsHeaders(response);
  }
}

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name) {
    const response = NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });

    const response = NextResponse.json(newCategory, { status: 201 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error creating category:', error.message || error);
    const response = NextResponse.json({ error: 'Error creating category', details: error.message || error }, { status: 500 });
    return setCorsHeaders(response);
  }
}
