import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, CategoryName, Status } from '@prisma/client';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust according to your needs
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Handle OPTIONS method for CORS preflight
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

// POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { datePost, lat, lon, prix, adress, ville, status, title, categoryId, typeId, Detail, img, youtub } = body;

    console.log('Received data:', body);

    // Validate required fields
    const missingFields = [];
    if (!img || !Array.isArray(img) || img.length === 0) missingFields.push('img');
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

    // Validate status
    if (!Object.values(Status).includes(status as Status)) {
      console.error('Invalid status value:', status);
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Upload images to Cloudinary
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

    const date = new Date(datePost);
    date.setHours(0, 0, 0, 0);

    // Create the post in the database
    const post = await prisma.post.create({
      data: {
        img: uploadedImages.map((image) => image.url),
        datePost: date,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        prix: parseFloat(prix),
        adress,
        ville,
        status: status as Status,
        title,
        youtub,
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

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating post:', errorMessage);
    return NextResponse.json({ error: 'Error creating post', details: errorMessage }, { status: 500 });
  }
}

// GET handler
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

      const date = new Date(post.datePost);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const formattedPost = {
        ...post,
        datePost: `${day}-${month}-${year}`,
        youtub: post.youtub,
      };

      if (post.category?.name === CategoryName.Location) {
        if (post.DateReserve?.dateFine) {
          await prisma.post.update({
            where: { id: post.id },
            data: { status: Status.available },
          });
        } else {
          await prisma.post.update({
            where: { id: post.id },
            data: { status: Status.taken },
          });
        }
      }

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
    });

    const currentDate = new Date();

    await Promise.all(
      posts.map(async (post) => {
        if (post.category?.name === CategoryName.Location && post.DateReserve) {
          const dateFine = post.DateReserve.dateFine;
          if (dateFine && new Date(dateFine) < currentDate) {
            await prisma.post.update({
              where: { id: post.id },
              data: { status: Status.available },
            });
          } else {
            await prisma.post.update({
              where: { id: post.id },
              data: { status: Status.taken },
            });
          }
        } 
      })
    );

    const formattedPosts = posts.map((post) => {
      const date = new Date(post.datePost);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return {
        ...post,
        datePost: `${day}-${month}-${year}`,
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
