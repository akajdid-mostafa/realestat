import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, logo } = await req.json();

  try {
    const partennaire = await prisma.partennaire.create({
      data: {
        name,
        logo,
      },
    });
    return NextResponse.json(partennaire, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating partennaire' }, { status: 400 });
  }
}
