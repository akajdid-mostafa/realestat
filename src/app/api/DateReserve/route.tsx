import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new DateReserve entry
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { DATEDEBU, dateFin, fullname, CIN, postId } = await req.json();

    // Validate required fields
    if (!DATEDEBU || !dateFin || !fullname || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    // Ensure that postId exists in the Post table
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      throw new Error('Post with the given ID does not exist');
    }

    // Create the DateReserve entry
    const dateReserve = await prisma.dateReserve.create({
      data: {
        DATEDEBU: new Date(DATEDEBU),
        dateFin: new Date(dateFin),
        fullname,
        CIN,
        post: { connect: { id: postId } }, // Connect the DateReserve to the Post
      },
    });

    // Return the created DateReserve as a JSON response
    return NextResponse.json(dateReserve, { status: 201 });

  } catch (error) {
    // Log and return error
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error creating DateReserve: ${error.message}` }, { status: 400 });
  }
}

// Get all DateReserve entries
export async function GET(req: Request) {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true, // Include related post information
      },
    });

    // Return all DateReserve entries as a JSON response
    return NextResponse.json(dateReserves, { status: 200 });
  } catch (error) {
    // Log and return error
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error fetching DateReserves: ${error.message}` }, { status: 500 });
  }
}
