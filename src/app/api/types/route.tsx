import { NextResponse } from 'next/server';
import { PrismaClient, TypeName } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const typeName = url.searchParams.get('name') as TypeName;

  if (!typeName) {
    return NextResponse.json({ error: 'Type name is required' }, { status: 400 });
  }

  try {
    const type = await prisma.type.findFirst({
      where: { type: typeName },
      include: {
        posts: true,
      },
    });

    if (!type) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json(type.posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts by type:', error.message || error);
    return NextResponse.json({ error: 'Error fetching posts by type', details: error.message || error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { type } = await req.json();

  if (!type) {
    return NextResponse.json({ error: 'Type name is required' }, { status: 400 });
  }

  try {
    const newType = await prisma.type.create({
      data: { type },
    });

    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    console.error('Error creating type:', error.message || error);
    return NextResponse.json({ error: 'Error creating type', details: error.message || error }, { status: 500 });
  }
}