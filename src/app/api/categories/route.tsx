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


export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}


export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryName = url.searchParams.get('name') as CategoryName;

  if (!categoryName) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          posts: true,
        },
      });

      const response = NextResponse.json(categories, { status: 200 });
      return setCorsHeaders(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching all categories:', errorMessage);
      const response = NextResponse.json(
        { error: 'Error fetching all categories', details: errorMessage },
        { status: 500 }
      );
      return setCorsHeaders(response);
    }
  }

  // Fetch specific category by name
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching posts by category:', errorMessage);
    const response = NextResponse.json(
      { error: 'Error fetching posts by category', details: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

// Create a new category
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating category:', errorMessage);
    const response = NextResponse.json(
      { error: 'Error creating category', details: errorMessage },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
