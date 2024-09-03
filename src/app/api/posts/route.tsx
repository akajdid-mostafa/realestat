import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); 

const prisma = new PrismaClient();


cloudinary.config({ 
  cloud_name: 'dab60xyhf', 
  api_key: '141321481661693', 
  api_secret: 'T9zFUC5NdH51iFiSeOpyfGUlO1I' 
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { datePost, lat, lon, prix, adress, ville, status, title, categoryId, typeId, Detail, img } = body;

    console.log('Received data:', body);

    if (!img || !Array.isArray(img) || img.length === 0) {
      console.error('Missing required fields: img');
      return NextResponse.json({ error: 'Missing required fields', fields: ['img'] }, { status: 400 });
    }

    const missingFields = [];
    if (!datePost) missingFields.push('datePost');
    if (!lat) missingFields.push('lat');
    if (!lon) missingFields.push('lon');
    if (!prix) missingFields.push('prix');
    if (!adress) missingFields.push('adress');
    if (!ville) missingFields.push('ville');
    if (!status) missingFields.push('status');
    if (!title) missingFields.push('title');
    if (!categoryId) missingFields.push('categoryId');
    if (!typeId) missingFields.push('typeId');

    if (missingFields.length > 0) {
      console.error('Missing Fields:', missingFields);
      return NextResponse.json({ error: 'Missing required fields', fields: missingFields }, { status: 400 });
    }

    if (!Object.values(Status).includes(status as Status)) {
      console.error('Invalid status value:', status);
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

      const uploadedImages = await Promise.all(
      img.map(async (imageUrl: string) => {
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder: 'your_folder_name',
        });
        return result.secure_url; 
      })
    );

    const post = await prisma.post.create({
      data: {
        img: uploadedImages, 
        datePost: new Date(datePost),
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        prix: parseFloat(prix),
        adress,
        ville,
        status: status as Status,
        title,
        category: categoryId ? { connect: { id: parseInt(categoryId) } } : undefined,
        type: typeId ? { connect: { id: parseInt(typeId) } } : undefined,
        Detail: Detail ? { create: JSON.parse(Detail) } : undefined,
      },
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating post:', errorMessage);
    return NextResponse.json({ error: 'Error creating post', details: errorMessage }, { status: 500 });
  }
}


export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error retrieving posts:', errorMessage);
    return NextResponse.json({ error: 'Error retrieving posts', details: errorMessage }, { status: 500 });
  }
}
