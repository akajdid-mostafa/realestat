// /app/api/partennaire/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, logo } = await req.json();

  try {
    const updatedPartennaire = await prisma.partennaire.update({
      where: { id: Number(params.id) },
      data: {
        name,
        logo,
      },
    });
    return NextResponse.json(updatedPartennaire, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating partennaire' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.partennaire.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Partennaire deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting partennaire' }, { status: 400 });
  }
}
