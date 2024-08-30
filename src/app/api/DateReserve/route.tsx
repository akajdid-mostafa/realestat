import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}


export async function POST(req: Request) {
  try {
   
    const { dateDebut, dateFine, fullName, price, CIN, postId } = await req.json();

    
    if (!dateDebut || !fullName || !CIN || !postId) {
      throw new Error('Missing required fields');
    }

    
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      throw new Error('Post with the given ID does not exist');
    }

    
    const formattedDateDebut = new Date(dateDebut);
    formattedDateDebut.setUTCHours(0, 0, 0, 0); 

    let formattedDateFine: Date | null = null;
    if (dateFine) {
      formattedDateFine = new Date(dateFine);
      formattedDateFine.setUTCHours(0, 0, 0, 0); 
    }

   
    const dateReserveData: {
      dateDebut: Date;
      dateFine?: Date; 
      fullName: string;
      price: string;
      CIN: string;
      post: { connect: { id: number } };
    } = {
      dateDebut: formattedDateDebut,
      fullName,
      price,
      CIN,
      post: { connect: { id: postId } },
    };

    
    if (formattedDateFine) {
      dateReserveData.dateFine = formattedDateFine;
    }

    
    const dateReserve = await prisma.dateReserve.create({
      data: dateReserveData,
    });

   
    const formattedDateReserve = {
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date),
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null, // Ensure dateFine is a Date
    };

   
    return NextResponse.json(formattedDateReserve, { status: 201 });

  } catch (error) {
    
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error creating DateReserve: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 400 });
  }
}


export async function GET() {
  try {
    const dateReserves = await prisma.dateReserve.findMany({
      include: {
        post: true,
      },
    });

    
    const formattedDateReserves = dateReserves.map(dateReserve => ({
      ...dateReserve,
      dateDebut: formatDateToYYYYMMDD(dateReserve.dateDebut as Date), 
      dateFine: dateReserve.dateFine ? formatDateToYYYYMMDD(dateReserve.dateFine as Date) : null, // Ensure dateFine is a Date
    }));

   
    return NextResponse.json(formattedDateReserves, { status: 200 });
  } catch (error) {
    
    console.error('Detailed error:', error);
    return NextResponse.json({ error: `Error fetching DateReserves: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}
