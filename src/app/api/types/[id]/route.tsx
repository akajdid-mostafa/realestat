
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { type } = await req.json();

  try {
    const updatedType = await prisma.type.update({
      where: { id: Number(params.id) },
      data: {
        type,
      },
    });
    return NextResponse.json(updatedType, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating type' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.type.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Type deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting type' }, { status: 400 });
  }
}
