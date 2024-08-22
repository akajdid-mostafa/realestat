import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    CONSTRUCTIONYEAR,
    SURFACEm2,
    ROOMS,
    bedromms,  // Updated to match the schema
    livingRooms,
    kitchen,
    bathrooms,
    FURNISHED,
    FLOOR,
    ELEVATOR,
    PARKING,
    BALCONY,
    POOL,
    FACADE,
    DOCUMENTS,
    postId
  } = await req.json();

  try {
    const detail = await prisma.detail.create({
      data: {
        CONSTRUCTIONYEAR,
        SURFACEm2,
        ROOMS,
        bedromms,  // Updated to match the schema
        livingRooms,
        kitchen,
        bathrooms,
        FURNISHED,
        FLOOR,
        ELEVATOR,
        PARKING,
        BALCONY,
        POOL,
        FACADE,
        DOCUMENTS,
        post: { connect: { id: postId } },
      },
    });
    return NextResponse.json(detail, { status: 201 });
  } catch (error) {
    console.error(error);  // Log the actual error for debugging
    return NextResponse.json({ error: 'Error creating detail' }, { status: 400 });
  }
}
