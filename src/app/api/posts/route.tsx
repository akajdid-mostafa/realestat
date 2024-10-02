import { NextResponse, NextRequest } from 'next/server';
import {Prisma , PrismaClient, CategoryName, Status} from '@prisma/client';
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

console.log("dw")
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lat, lon, prix, adress, ville, status, categoryId, typeId, Detail, img, youtub, comment } = body;

    
    let parsedDetail;
    if (Detail) {
      try {
        parsedDetail = JSON.parse(Detail);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid Detail format' }, { status: 400 });
      }
    }

    const missingFields = [];
    if (!img || !Array.isArray(img) || img.length === 0) missingFields.push('img');
    if (!lat) missingFields.push('lat');
    if (!lon) missingFields.push('lon');
    if (!prix) missingFields.push('prix');
    if (!adress) missingFields.push('adress');
    if (!ville) missingFields.push('ville');
    if (!status) missingFields.push('status');
    if (!categoryId) missingFields.push('categoryId');
    if (!typeId) missingFields.push('typeId');

    if (missingFields.length > 0) {
      return NextResponse.json({ error: 'Missing required fields', fields: missingFields }, { status: 400 });
    }

   
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
      select: { name: true },
    });

    const type = await prisma.type.findUnique({
      where: { id: parseInt(typeId) },
      select: { type: true },
    });

    if (!category || !type) {
      return NextResponse.json({ error: 'Invalid categoryId or typeId' }, { status: 400 });
    }

    
    const uploadedImages = await Promise.all(
      img.map(async (imageUrl: string) => {
        const result = await cloudinary.v2.uploader.upload(imageUrl, {
          folder: 'your_folder_name',
        });
        return result.secure_url;
      })
    );

    
    const post = await prisma.post.create({
      data: {
        img: uploadedImages,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        prix,
        adress,
        ville,
        status: status as Status,
        title: '', 
        youtub,
        comment,
        category: { connect: { id: parseInt(categoryId) } },
        type: { connect: { id: parseInt(typeId) } },
      },
      include: {
        category: true,
        type: true,
      },
    });

 
    let createdDetail = null;
    if (parsedDetail) {
      createdDetail = await prisma.detail.create({
        data: {
          ...parsedDetail,
          postId: post.id, 
        },
      });
    }

    
    const updatedTitle =`${post.type?.type ?? ''} a ${post.category?.name ?? ''} # ${post.id} ${createdDetail?.surface ? `/ surface: ${createdDetail.surface}m `: ''}`;

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { title: updatedTitle },
      include: {
        category: true,
        type: true,
        Detail: true, 
      },
    });

    return NextResponse.json({ id: updatedPost.id, post: updatedPost }, { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating post:', errorMessage);
    return NextResponse.json({ error: 'Error creating post', details: errorMessage }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    const postId = url.searchParams.get('id');
    const status = url.searchParams.get('status');   
    const categoryId = url.searchParams.get('categoryId');  
    const ville = url.searchParams.get('ville');
    const typeId = url.searchParams.get('typeId');    
    const search = url.searchParams.get('search');    
    const bedromms = url.searchParams.get('bedromms');
    const rooms = url.searchParams.get('rooms');
    const parsedBedromms = bedromms ? parseInt(bedromms, 10) : null;
    const parsedRooms = rooms ? parseInt(rooms, 10) : null;

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

   
    // const filters = {
    //   ...(status && { status: status as Status }),
    //   ...(categoryId && { categoryId: parseInt(categoryId, 10) }),
    //   ...(typeId && { typeId: parseInt(typeId, 10) }),
    //   ...(bedromms || rooms ? { 
    //     Detail: { 
    //       ...(bedromms && { bedromms:bedromms }), 
    //       ...(rooms && { rooms: rooms })
    //     }
    //   } : {}),
    //   ...(search
    //     ? {
    //         OR: [
    //           {
    //             ville: {
    //               contains: search, 
    //               mode: 'insensitive',
    //             },
    //           },
    //           {
    //             adress: {
    //               contains: search, 
    //               mode: 'insensitive',
    //             },
    //           },
    //         ],
    //       }
    //     : {}), 
    // };

    const filters: Prisma.PostWhereInput = {
      ...(status && { status: status as Status }),
      ...(categoryId && { categoryId: parseInt(categoryId, 10) }),
      ...(typeId && { typeId: parseInt(typeId, 10) }),
      ...(ville && { ville:ville }),
      // ...(bedromms || rooms
      //   ? {
      //       Detail: {
      //         ...(bedromms && { bedromms: bedromms }),
      //         ...(rooms && { rooms: rooms }),
      //       },
      //     }
      //   : {}),
      ...(parsedBedromms !== null
        ? {
            Detail: {
              bedromms: parsedBedromms <= 4
                ? parsedBedromms 
                : { gte: 5 }, 
            },
          }
        : {}),
      
      
      ...(parsedRooms !== null
        ? {
            Detail: {
              rooms: parsedRooms <= 4
                ? parsedRooms 
                : { gte: 5 }, 
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                ville: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive, 
                },
              },
              {
                adress: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive, 
                },
              },
            ],
          }
        : {}),
    };
    
    const posts = await prisma.post.findMany({
      where: {
        ...filters,
        
      },
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const currentDate = new Date();

      function isSameDay(date1: Date, date2: Date): boolean {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      }

      // await Promise.all(
      //   posts.map(async (post) => {
      //     if (post.category?.name === CategoryName.Location && post.DateReserve?.length > 0) {

      //       const earliestDateFine = post.DateReserve
      //         .map((reserve) => reserve.dateFine)
      //         .filter((dateFine): dateFine is Date => dateFine !== null) 
      //         .reduce((minDate, currDate) => {
      //           return new Date(currDate) < new Date(minDate) ? currDate : minDate;
      //         });

      //       const earliestDateDebut = post.DateReserve
      //         .map((reserve) => reserve.dateDebut)
      //         .filter((dateDebut): dateDebut is Date => dateDebut !== null) 
      //         .reduce((minDate, currDate) => {
      //           return new Date(currDate) < new Date(minDate) ? currDate : minDate;
      //         });

      //       if (earliestDateFine && new Date(earliestDateFine) < currentDate) {
      //         await prisma.post.update({
      //           where: { id: post.id },
      //           data: { status: Status.available },
      //         });
      //       } 
            
      //       else if (earliestDateDebut && isSameDay(new Date(earliestDateDebut), currentDate)) {
      //         await prisma.post.update({
      //           where: { id: post.id },
      //           data: { status: Status.taken },
      //         });
      //       }
      //     } else if (!post.DateReserve || post.DateReserve.length === 0) {
      //       await prisma.post.update({
      //         where: { id: post.id },
      //         data: { status: Status.available },
      //       });
      //     }
      //   })
      // );
      await Promise.all(
        posts.map(async (post) => {
          if (post.category?.name === CategoryName.Location && post.DateReserve?.length > 0) {
            const earliestDateFine = post.DateReserve
              .map((reserve) => reserve.dateFine)
              .filter((dateFine): dateFine is Date => dateFine !== null)
              .reduce((minDate, currDate) => {
                return new Date(currDate) < new Date(minDate) ? currDate : minDate;
              });
      
            const earliestDateDebut = post.DateReserve
              .map((reserve) => reserve.dateDebut)
              .filter((dateDebut): dateDebut is Date => dateDebut !== null)
              .reduce((minDate, currDate) => {
                return new Date(currDate) < new Date(minDate) ? currDate : minDate;
              });
      
            if (earliestDateFine && new Date(earliestDateFine) < currentDate) {
              await prisma.post.update({
                where: { id: post.id },
                data: { status: Status.available },
              });
            } 
            
            else if (
              earliestDateDebut &&
              earliestDateFine &&
              new Date(earliestDateDebut) <= currentDate &&
              new Date(earliestDateFine) >= currentDate
            ) {
              await prisma.post.update({
                where: { id: post.id },
                data: { status: Status.taken },
              });
            }
          } else if (!post.DateReserve || post.DateReserve.length === 0) {
            await prisma.post.update({
              where: { id: post.id },
              data: { status: Status.available },
            });
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