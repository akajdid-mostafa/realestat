import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'a5f719ac8b4b73f2a620fd73c85a7d5f79b52fcfcdc5d57c8e8f749ad7e315c47230483d7db1525f20c5c4fd65423e9c9c8244d4f7bc9cfd5753fbb4f8439f60';

// CORS is handled centrally by src/app/middleware.ts (Sprint 1).
// No-op so route handlers do not override the middleware's origin echo.
function setCorsHeaders(response) {
  return response;
}

// Handle OPTIONS request
// Handle OPTIONS request
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 204,
  });
}


// Handle POST request
export async function POST(req) {
  try {
    const { email, password ,} = await req.json();

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

    let response = NextResponse.json(
      { token, user: { email } }, 
      { status: 200 }
    );
   
    // Set CORS headers
   response = setCorsHeaders(response);

    return response;

  } catch (error) {
    console.error('Error during login:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Unknown error');

    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
