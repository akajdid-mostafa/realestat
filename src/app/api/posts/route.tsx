import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

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
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
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

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error.message || error);
    return NextResponse.json({ error: 'Error fetching posts', details: error.message || error }, { status: 500 });
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error.message || error);
    return NextResponse.json({ error: 'Error creating post', details: error.message || error }, { status: 400 });
  }
}