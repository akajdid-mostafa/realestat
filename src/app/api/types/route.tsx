import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { type } = await req.json();

  try {
    const newType = await prisma.type.create({
      data: {
        type,
      },
    });
    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating type' }, { status: 400 });
  }
}
