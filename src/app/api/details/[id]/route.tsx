import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const detail = await prisma.detail.findUnique({
      where: { id: Number(id) },
    });

    if (!detail) {
      return NextResponse.json({ error: 'Detail not found' }, { status: 404 });
    }

    return NextResponse.json(detail, { status: 200 });
  } catch (error) {
    console.error('Error fetching detail:', error);
    return NextResponse.json({ error: 'Error fetching detail' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const {
    CONSTRUCTIONYEAR,
    SURFACE,
    ROOMS,
    bedromms,
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
    postId,
  } = await req.json();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const existingDetail = await prisma.detail.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDetail) {
      return NextResponse.json({ error: 'Detail not found' }, { status: 404 });
    }

    const updatedDetail = await prisma.detail.update({
      where: { id: Number(id) },
      data: {
        CONSTRUCTIONYEAR,
        SURFACE,
        ROOMS,
        bedromms,
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
    return NextResponse.json(updatedDetail, { status: 200 });
  } catch (error) {
    console.error('Error updating detail:', error);
    return NextResponse.json({ error: 'Error updating detail' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    await prisma.detail.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Detail deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting detail:', error);
    return NextResponse.json({ error: 'Error deleting detail' }, { status: 500 });
  }
}