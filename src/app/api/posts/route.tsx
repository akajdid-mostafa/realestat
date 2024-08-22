import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { img, datePost, lat, lon, prix, adress, ville, status, title, categoryId, typeId } = await req.json();

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
        category: { connect: { id: categoryId } },
        type: { connect: { id: typeId } },
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating post' }, { status: 400 });
  }
}
