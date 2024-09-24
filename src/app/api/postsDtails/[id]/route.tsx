import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();
const prisma = new PrismaClient();

cloudinary.v2.config({
    cloud_name: 'dab60xyhf',
    api_key: '141321481661693',
    api_secret: 'T9zFUC5NdH51iFiSeOpyfGUlO1I',
});

  
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function PUT(req: NextRequest) {
  const id = req.url.split('/').pop();
  const {
    // Post 
    img,
    
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
    comment,

    // Detail 
    constructionyear,
    surface,
    rooms,
    bedromms,
    livingrooms,
    kitchen,
    bathrooms,
    furnished,
    floor,
    elevator,
    parking,
    balcony,
    pool,
    facade,
    documents,
    postId,
    Guard,
  } = await req.json();

  if (!id || isNaN(Number(id))) {
    return setCorsHeaders(NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 }));
  }
  try {
    if (lat || lon || prix || adress || ville || status || title || img) {
      const existingPost = await prisma.post.findUnique({ where: { id: Number(id) } });

      if (!existingPost) {
        return setCorsHeaders(NextResponse.json({ error: 'Post not found' }, { status: 404 }));
      }

      let uploadedImages: string[] = existingPost.img as string[];

      if (img && Array.isArray(img) && img.length > 0) {
        if (existingPost.img && Array.isArray(existingPost.img)) {
          await Promise.all(
            (existingPost.img as string[]).map(async (image) => {
              if (image) { 
                const publicId = image.split('/').pop()?.split('.')[0]; 
                if (publicId) {
                  await cloudinary.v2.uploader.destroy(publicId);
                }
              }
            })
          );
        }
  
        uploadedImages = await Promise.all(
          img.map(async (imageUrl: string) => {
            const result = await cloudinary.v2.uploader.upload(imageUrl, {
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
          // datePost: datePost ? new Date(datePost) : existingPost.datePost,
          lat: lat !== undefined ? parseFloat(lat) : existingPost.lat,
          lon: lon !== undefined ? parseFloat(lon) : existingPost.lon,
          prix,
          adress,
          ville,
          status: status as Status,
          title,
          youtub,
          comment,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          type: typeId ? { connect: { id: typeId } } : undefined,
        },
        include: { category: true, type: true, Detail: true, DateReserve: true },
      });

      console.log('Post updated:', updatedPost);
    }

   
    if (
        constructionyear ||
        surface ||
        rooms ||
        bedromms ||
        livingrooms ||
        kitchen ||
        bathrooms ||
        furnished ||
        floor ||
        elevator ||
        parking ||
        balcony ||
        pool ||
        facade ||
        documents ||
        Guard
      ) {
        // Fetch Detail by the postId
        const existingDetail = await prisma.detail.findUnique({
          where: { postId: Number(id) },  // Use postId to get the correct Detail
        });
      
        if (!existingDetail) {
          return setCorsHeaders(NextResponse.json({ error: 'Detail not found' }, { status: 404 }));
        }
      
        const updatedDetail = await prisma.detail.update({
          where: { id: existingDetail.id },  // Use Detail's own id to update the correct record
          data: {
            constructionyear,
            surface,
            rooms,
            bedromms,
            livingrooms,
            kitchen,
            bathrooms,
            furnished,
            floor,
            elevator,
            parking,
            balcony,
            pool,
            facade,
            documents,
            Guard,
          },
        });
      
        console.log('Detail updated:', updatedDetail);
      }
    return setCorsHeaders(NextResponse.json({ message: 'Update successful' }, { status: 200 }));
  } catch (error) {
    console.error('Error updating post or detail:', error);
    return setCorsHeaders(NextResponse.json({ error: 'Error updating post or detail' }, { status: 500 }));
  }
}