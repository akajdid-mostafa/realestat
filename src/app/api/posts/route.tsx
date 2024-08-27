import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all posts with full details
export async function GET(req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true, // Include related category
        type: true, // Include related type
        Detail: true, // Include related detail information
        DateReserve: true, // Include related date reservations
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error.message || error);
    return NextResponse.json({ error: 'Error fetching posts', details: error.message || error }, { status: 500 });
  }
}

// Create a new post
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error.message || error);
    return NextResponse.json({ error: 'Error creating post', details: error.message || error }, { status: 400 });
  }
}
