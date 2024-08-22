import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cors } from '../../lib/init-middleware';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Run the CORS middleware
  await cors(req, {} as any);

  const { email, password, phone, name } = await req.json();

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Error creating user' }, { status: 400 });
  }
}
