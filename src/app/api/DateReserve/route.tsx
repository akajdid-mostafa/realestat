import { NextResponse } from 'next/server';
import { PrismaClient, CategoryName, Status } from '@prisma/client';

const prisma = new PrismaClient();

function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Function to get all dates between dateDebut and dateFine
function getDatesInRange(dateDebut: Date, dateFine: Date): Date[] {
  const dates: Date[] = [];
  
  let currentDate = new Date(dateDebut);

  while (currentDate <= dateFine) {
    dates.push(new Date(currentDate)); // Push a copy of the current date to avoid mutation issues
    currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
  }

  return dates;
}

export async function POST(req: Request) {
  try {
    const { dateDebut, dateFine, fullName, price, CIN, postId } = await req.json();

    if (!fullName || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { category: true },
    });

    if (!post) {
      throw new Error('Post with the given ID does not exist');
    }

    const isDateNull = dateDebut === null && dateFine === null;

    const dateReserveData = {
      dateDebut: dateDebut ? new Date(dateDebut) : null,
      dateFine: dateFine ? new Date(dateFine) : null,
      fullName,
      price: parseFloat(price),
      CIN,
      post: { connect: { id: postId } },
    };

    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

    if (dateDebut && dateFine) {
      const datesInRange = getDatesInRange(new Date(dateDebut), new Date(dateFine));
      console.log('Dates in range:', datesInRange);
    }

    if (post.category?.name === CategoryName.Location) {
      if (dateFine) {
        await prisma.post.update({
          where: { id: postId },
          data: { status: Status.available },
        });
      } else {
        await prisma.post.update({
          where: { id: postId },
          data: { status: Status.taken },
        });
      }
    } else {
      await prisma.post.update({
        where: { id: postId },
        data: { status: Status.taken },
      });
    }

    const formattedDateReserve = {
      ...dateReserve,
      dateDebut: dateReserve.dateDebut ? formatDateToYYYYMMDD(dateReserve.dateDebut) : null,
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine) : null,
    };

    return NextResponse.json(formattedDateReserve, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: `Error creating DateReserve: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 400 }
    );
  }
}

// GET
export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
  
    const formattedDateReserves = dateReserves.map(dateReserve => ({
      ...dateReserve,
      dateDebut: dateReserve.dateDebut ? formatDateToYYYYMMDD(dateReserve.dateDebut) : null,
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine) : null,
    }));

    return NextResponse.json(formattedDateReserves, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: `Error fetching DateReserves: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
