import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    constructionyear,
    surface,
    rooms,
    bedromms,  // Updated to match the schema
    livingrooms,
    kitchen,
    bathrooms,
    furnished,
    floor,
    elevator,
    parking,
    balcony,
    pool,
    facade,
    documents,
    postId
  } = await req.json();

  try {
    const detail = await prisma.detail.create({
      data: {
        constructionyear,
        surface,
        rooms,
        bedromms, 
        livingrooms,
        kitchen,
        bathrooms,
        furnished,
        floor,
        elevator,
        parking,
        balcony,
        pool,
        facade,
        documents,
        post: { connect: { id: postId } },
      },
    });
    return NextResponse.json(detail, { status: 201 });
  } catch (error) {
    console.error(error);  // Log the actual error for debugging
    return NextResponse.json({ error: 'Error creating detail' }, { status: 400 });
  }
}
