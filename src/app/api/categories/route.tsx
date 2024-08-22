import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name } = await req.json();

  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating category' }, { status: 400 });
  }
}
