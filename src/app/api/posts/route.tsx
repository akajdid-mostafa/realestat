import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, CategoryName, Status } from '@prisma/client';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); 
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}
const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: 'dtcfvpu6n',
  api_key: '813952658855993',
  api_secret: '41BFZx9tensYKPnhu3CppsmU9Ng',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {  lat, lon, prix, adress, ville, status, title, categoryId, typeId, Detail, img, youtub, comment  } = body;

    console.log('Received data:', body);

    const missingFields = [];
    if (!img || !Array.isArray(img) || img.length === 0) missingFields.push('img');
   
    if (!lat) missingFields.push('lat');
    if (!lon) missingFields.push('lon');
    if (!prix ) missingFields.push('prix'); 
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
        const result = await cloudinary.v2.uploader.upload(imageUrl, {
          folder: 'your_folder_name',
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        };
      })
    );


  
    const post = await prisma.post.create({
      data: {
        img: uploadedImages.map((image) => image.url),
        
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        prix,  
        adress,
        ville,
        status: status as Status,
        title,
        youtub,
        comment,
        category: { connect: { id: parseInt(categoryId) } },
        type: { connect: { id: parseInt(typeId) } },
        Detail: Detail ? { create: JSON.parse(Detail) } : undefined,
      },
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
    });

    // Include the `id` of the created post in the response
    return NextResponse.json({ id: post.id, post }, { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating post:', errorMessage);
    return NextResponse.json({ error: 'Error creating post', details: errorMessage }, { status: 500 });
  }
}
// GET
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get('id');

    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId, 10) },
        include: {
          category: true,
          type: true,
          DateReserve: true,
          Detail: true,
        },
      });

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const formattedPost = {
        ...post,
        youtub: post.youtub,
      };

      return NextResponse.json(formattedPost, { status: 200 });
    }

    const posts = await prisma.post.findMany({
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
      where: {
        OR: [
          { DateReserve: null },
          { DateReserve: { NOT: { dateDebut: null, dateFine: null } } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const currentDate = new Date();

    await Promise.all(
      posts.map(async (post) => {
        if (post.category?.name === CategoryName.Location && post.DateReserve) {
          const dateDebut = post.DateReserve.dateDebut ? new Date(post.DateReserve.dateDebut) : null;
          const dateFine = post.DateReserve.dateFine ? new Date(post.DateReserve.dateFine) : null;
    
          if (dateFine && dateFine < currentDate) {
            await prisma.post.update({
              where: { id: post.id },
              data: { status: Status.available },
            });
          } else if (dateDebut && dateDebut > currentDate) {
            await prisma.post.update({
              where: { id: post.id },
              data: { status: Status.available },
            });
          } else if (dateDebut && dateDebut <= currentDate) {
            await prisma.post.update({
              where: { id: post.id },
              data: { status: Status.taken },
            });
          }
        }
      })
    );
    

    const formattedPosts = posts.map((post) => {
      return {
        ...post,
        youtub: post.youtub,
      };
    });

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error retrieving posts:', errorMessage);
    return NextResponse.json({ error: 'Error retrieving posts', details: errorMessage }, { status: 500 });
  }
}

