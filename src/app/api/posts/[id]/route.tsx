import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dtcfvpu6n',
  api_key: '813952658855993',
  api_secret: '813952658855993',
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

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  if (!datePost || !lat || !lon || !prix || !adress || !ville || !status || !title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!Object.values(Status).includes(status as Status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
  }

  try {
    // Check if categoryId exists
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    // Check if typeId exists
    if (typeId) {
      const typeExists = await prisma.type.findUnique({
        where: { id: typeId },
      });

      if (!typeExists) {
        return NextResponse.json({ error: 'Type not found' }, { status: 404 });
      }
    }

    // Find existing post
    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let uploadedImages = existingPost.img as string[]; // Typecast to string array for JSON[]

    // Handle image uploads
    if (img && Array.isArray(img) && img.length > 0) {
      // Optionally delete old images from Cloudinary (if required)
      if (existingPost.img && Array.isArray(existingPost.img)) {
        await Promise.all(
          existingPost.img.map(async (image) => {
            if (typeof image === 'string') { // Check if image is a string
              const publicId = image.split('/').pop()?.split('.')[0]; // Extract public_id from URL safely
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
              }
            }
          })
        );
      }

      // Upload new images to Cloudinary
      uploadedImages = await Promise.all(
        img.map(async (imageUrl: string) => {
          const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'your_folder_name', // Update with your desired folder
          });
          return result.secure_url;
        })
      );
    }

    // Update the post with new data and images
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        img: uploadedImages, // Update images
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
export async function GET(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        type: true,
        Detail: true,
        DateReserve: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching post:', errorMessage);
    return NextResponse.json({ error: 'Error fetching post', details: errorMessage }, { status: 500 });
  }
}export async function DELETE(req: Request) {
  const id = req.url.split('/').pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    
    if (post.img && Array.isArray(post.img)) {
      await Promise.all(
        post.img.map(async (image) => {
          if (image) {
            const publicId = image.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          }
        })
      );
    }

    
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting post:', errorMessage);
    return NextResponse.json({ error: 'Error deleting post', details: errorMessage }, { status: 500 });
  }
}

