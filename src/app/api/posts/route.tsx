import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';
import multer, { StorageEngine } from 'multer';
import { promisify } from 'util';
import { Request } from 'express';

const prisma = new PrismaClient();

// Multer configuration
const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, './public/uploads/'); // Folder to store uploaded files
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const uploadMiddleware = promisify(upload.array('img', 10)); // Handle up to 10 images

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); // Set this to your frontend domain
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// Handle OPTIONS requests for CORS preflight
export function OPTIONS(): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Handle GET requests to fetch all posts
export async function GET(): Promise<NextResponse> {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        type: true,
        Detail: true,
        DateReserve: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      datePost: post.datePost.toISOString().split('T')[0],
    }));

    const response = NextResponse.json(formattedPosts, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching posts:', message);
    const response = NextResponse.json(
      { error: 'Error fetching posts', details: message },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

// Handle POST requests to create a new post
export async function POST(req: NextRequest): Promise<NextResponse> {
  const tempRes = NextResponse.next();

  // Process file uploads using multer middleware
  await uploadMiddleware(req as unknown as Request, tempRes as any);

  // Extract form data and files from request
  const { datePost, lat, lon, prix, adress, ville, status, title, categoryId, typeId, Detail } = (req as any).body;

  const missingFields = [];
  if (!(req as any).files || ((req as any).files as Express.Multer.File[]).length === 0) missingFields.push('img');
  if (!datePost) missingFields.push('datePost');
  if (!lat) missingFields.push('lat');
  if (!lon) missingFields.push('lon');
  if (!prix) missingFields.push('prix');
  if (!adress) missingFields.push('adress');
  if (!ville) missingFields.push('ville');
  if (!status) missingFields.push('status');
  if (!title) missingFields.push('title');

  if (missingFields.length > 0) {
    const response = NextResponse.json(
      { error: 'Missing required fields', fields: missingFields },
      { status: 400 }
    );
    return setCorsHeaders(response);
  }

  try {
    const formattedDatePost = new Date(datePost);
    formattedDatePost.setUTCHours(0, 0, 0, 0);

    if (!Object.values(Status).includes(status as Status)) {
      const response = NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      return setCorsHeaders(response);
    }

    // Convert file paths for storage in the database
    const imagePaths = ((req as any).files as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`);

    // Create a new post record in the database
    const post = await prisma.post.create({
      data: {
        img: imagePaths,
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
        Detail: Detail
          ? {
              create: {
                ...Detail,
              },
            }
          : undefined,
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating post:', message);
    const response = NextResponse.json(
      { error: 'Error creating post', details: message },
      { status: 400 }
    );
    return setCorsHeaders(response);
  }
}
