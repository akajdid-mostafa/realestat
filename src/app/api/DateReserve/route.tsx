import cron from 'node-cron';
import { NextResponse } from 'next/server';
import { PrismaClient, CategoryName, Status } from '@prisma/client';

const prisma = new PrismaClient();

function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function POST(req: Request) {
  try {
    const { dateDebut, dateFine, fullName, price, CIN, postId } = await req.json();

    if (!fullName || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    const post = await prisma.post.findUnique({
      where: { id: postId ?? undefined }, // Convert null to undefined
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
      price,
      CIN,
      post: { connect: { id: postId ?? undefined } }, // Convert null to undefined
    };

    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

    // Update status if the post category is 'Vente' and both dates are null
    if (post.category?.name === CategoryName.Vente && isDateNull) {
      await prisma.post.update({
        where: { id: postId ?? undefined }, // Convert null to undefined
        data: { status: Status.taken },
      });
    }

    // Update status if the post category is 'Location'
    if (post.category?.name === CategoryName.Location) {
      await prisma.post.update({
        where: { id: postId ?? undefined }, // Convert null to undefined
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

export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true,
      },
    });

    // Check if current date is past dateFine and update status to 'available'
    const currentDate = new Date();
    for (const dateReserve of dateReserves) {
      if (dateReserve.dateFine && new Date(dateReserve.dateFine) < currentDate) {
        // If dateFine has passed, set status to 'available'
        await prisma.post.update({
          where: { id: dateReserve.postId ?? undefined }, // Convert null to undefined
          data: { status: Status.available },
        });
      }
    }

    const formattedDateReserves = dateReserves.map(dateReserve => ({
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date),
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null,
    }));

    return NextResponse.json(formattedDateReserves, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error fetching DateReserves: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}

// Schedule a cron job to run every hour
cron.schedule('0 * * * *', async () => {
  try {
  
    const locationReserves = await prisma.dateReserve.findMany({
      where: {
        post: {
          category: {
            name: CategoryName.Location,
          },
          status: {
            not: Status.taken, // Only update if not already taken
          },
        },
        dateDebut: {
          not: null,
        },
        dateFine: {
          not: null,
        },
      },
      include: {
        post: true,
      },
    });

    // Update all relevant posts to 'taken'
    for (const reserve of locationReserves) {
      await prisma.post.update({
        where: { id: reserve.postId ?? undefined }, // Convert null to undefined
        data: { status: Status.taken },
      });
      console.log(`Post ID ${reserve.postId} status updated to 'taken'.`);
    }

    // Update status to 'available' for posts where dateFine has passed
    const expiredReserves = await prisma.dateReserve.findMany({
      where: {
        dateFine: {
          lt: new Date(), // Date has passed
        },
      },
      include: {
        post: true,
      },
    });

    // Update all relevant posts to 'available'
    for (const reserve of expiredReserves) {
      await prisma.post.update({
        where: { id: reserve.postId ?? undefined }, // Convert null to undefined
        data: { status: Status.available },
      });
      console.log(`Post ID ${reserve.postId} status updated to 'available'.`);
    }

    console.log('Cron job executed successfully.');
  } catch (error) {
    console.error('Error executing cron job:', error);
  }
});
