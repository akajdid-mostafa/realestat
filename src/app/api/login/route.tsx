import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins or specify your domain
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return NextResponse.json({}, { headers, status: 204 }); // 204 No Content
}

export async function POST(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins or specify your domain
  };

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400, headers });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401, headers });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401, headers });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token }, { status: 200, headers });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 400, headers });
  }
}
