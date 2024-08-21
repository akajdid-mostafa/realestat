import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error logging in' }, { status: 400 });
  }
}