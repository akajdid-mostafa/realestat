import { NextResponse } from 'next/server';
import { PrismaClient, CategoryName } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryName = url.searchParams.get('name') as CategoryName;

  if (!categoryName) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  try {
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
      include: {
        posts: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category.posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts by category:', error.message || error);
    return NextResponse.json({ error: 'Error fetching posts by category', details: error.message || error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error.message || error);
    return NextResponse.json({ error: 'Error creating category', details: error.message || error }, { status: 500 });
  }
}