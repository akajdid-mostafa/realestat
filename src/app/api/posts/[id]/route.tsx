import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: 'dab60xyhf',
  api_key: '141321481661693',
  api_secret: 'T9zFUC5NdH51iFiSeOpyfGUlO1I',
});

export async function PUT(req: Request) {
  const id = req.url.split('/').pop();
  const {
    img,
    datePost,
    lat,
    lon,
    prix,
    adress,
    ville,
    status,
    title,
    categoryId,
    typeId,
    youtub,
  } = await req.json();

  if (typeof id !== 'string' || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  if (!datePost || !lat || !lon || !prix || !adress || !ville || !status || !title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!Object.values(Status).includes(status as Status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
  }

  try {
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    if (typeId) {
      const typeExists = await prisma.type.findUnique({
        where: { id: typeId },
      });

      if (!typeExists) {
        return NextResponse.json({ error: 'Type not found' }, { status: 404 });
      }
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let uploadedImages: string[] = existingPost.img as string[]; // Ensure `img` is an array of strings

    if (img && Array.isArray(img) && img.length > 0) {
      if (existingPost.img && Array.isArray(existingPost.img)) {
        await Promise.all(
          (existingPost.img as string[]).map(async (image) => {
            if (image) { 
              const publicId = image.split('/').pop()?.split('.')[0]; 
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
              }
            }
          })
        );
      }

      uploadedImages = await Promise.all(
        img.map(async (imageUrl: string) => {
          const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'your_folder_name',
          });
          return result.secure_url;
        })
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        img: uploadedImages, 
        datePost: datePost ? new Date(datePost) : existingPost.datePost,
        lat: lat !== undefined ? parseFloat(lat) : existingPost.lat,
        lon: lon !== undefined ? parseFloat(lon) : existingPost.lon,
        prix: prix !== undefined ? parseFloat(prix) : existingPost.prix,
        adress,
        ville,
        status: status as Status,
        title,
        youtub,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        type: typeId ? { connect: { id: typeId } } : undefined,
      },
      include: {
        category: true,
        type: true,
        Detail: true,
        DateReserve: true,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating post:', errorMessage);
    return NextResponse.json({ error: 'Error updating post', details: errorMessage }, { status: 500 });
  }
}
