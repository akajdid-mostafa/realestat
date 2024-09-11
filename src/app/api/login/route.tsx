import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'a5f719ac8b4b73f2a620fd73c85a7d5f79b52fcfcdc5d57c8e8f749ad7e315c47230483d7db1525f20c5c4fd65423e9c9c8244d4f7bc9cfd5753fbb4f8439f60';

// export function setCorsHeaders(response: NextResponse): NextResponse {
//   response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
//   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
//   response.headers.set('Access-Control-Allow-Credentials', 'true'); // Allow credentials
//   return response;
// }

export async function OPTIONS(req: Request) {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

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

    const response = NextResponse.json(
      { token, user: { email, password } }, 
      { status: 200 }
    );

    // Use setCorsHeaders utility or set headers manually
    return response;  // Applying CORS headers
  } catch (error) {
    console.error('Error during login:',  error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:',  error instanceof Error ? error.message : 'Unknown error');

    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
