import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); // Use a single domain for testing or '*'
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}


export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        type: true,
        Detail: true,
        DateReserve: true,
      },
    });

    
    const formattedPosts = posts.map(post => ({
      ...post,
      datePost: post.datePost.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    }));

    const response = NextResponse.json(formattedPosts, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const message = (error instanceof Error) ? error.message : 'Unknown error';
    console.error('Error fetching posts:', message);
    const response = NextResponse.json({ error: 'Error fetching posts', details: message }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// Create a new post with optional details
export async function POST(req: Request) {
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
    Detail
  } = await req.json();

  
  const missingFields = [];
  if (!img) missingFields.push('img');
  if (!datePost) missingFields.push('datePost');
  if (!lat) missingFields.push('lat');
  if (!lon) missingFields.push('lon');
  if (!prix) missingFields.push('prix');
  if (!adress) missingFields.push('adress');
  if (!ville) missingFields.push('ville');
  if (!status) missingFields.push('status');
  if (!title) missingFields.push('title');

  if (missingFields.length > 0) {
    const response = NextResponse.json({ error: 'Missing required fields', fields: missingFields }, { status: 400 });
    return setCorsHeaders(response);
  }

  try {
    
    const formattedDatePost = new Date(datePost);
    formattedDatePost.setUTCHours(0, 0, 0, 0); 

    
    if (!Object.values(Status).includes(status as Status)) {
      const response = NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      return setCorsHeaders(response);
    }

  
    const post = await prisma.post.create({
      data: {
        img,
        datePost: formattedDatePost, 
        lat,
        lon,
        prix,
        adress,
        ville,
        status: status as Status, 
        title,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        type: typeId ? { connect: { id: typeId } } : undefined,
        Detail: Detail ? {
          create: {
            ...Detail,
          }
        } : undefined,
      },
      include: {
        category: true,
        type: true,
        DateReserve: true,
        Detail: true,
      },
    });

    
    const formattedPost = {
      ...post,
      datePost: post.datePost.toISOString().split('T')[0], 
    };

    const response = NextResponse.json(formattedPost, { status: 201 });
    return setCorsHeaders(response);
  } catch (error) {
    const message = (error instanceof Error) ? error.message : 'Unknown error';
    console.error('Error creating post:', message);
    const response = NextResponse.json({ error: 'Error creating post', details: message }, { status: 400 });
    return setCorsHeaders(response);
  }
}
