import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cors from 'cors';

// Initialize Prisma Client
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'a5f719ac8b4b73f2a620fd73c85a7d5f79b52fcfcdc5d57c8e8f749ad7e315c47230483d7db1525f20c5c4fd65423e9c9c8244d4f7bc9cfd5753fbb4f8439f60';

// Initialize the CORS middleware
const cors = Cors({
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  methods: ['POST'], // Allow POST method
  credentials: true, // Allow cookies and credentials to be sent
});

export async function POST(req: Request) {
  // Handle CORS manually (since req is not NextApiRequest)
  const origin = req.headers.get('Origin');

  if (origin && origin !== 'http://localhost:3000') {  // Replace with your frontend's origin
    return new NextResponse(null, {
      status: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      },
    });
  }

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

    // Add CORS headers to the response
    const response = NextResponse.json({ token }, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}