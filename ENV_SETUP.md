# Environment Variables Setup Guide

This document lists all the environment variables required for this real estate project.

## Required Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

### 1. Database Configuration (PostgreSQL)

```env
POSTGRES_PRISMA_URL="postgresql://username:password@host:port/database?schema=public&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:port/database?schema=public"
```

**Description:**
- `POSTGRES_PRISMA_URL`: Used by Prisma for connection pooling (better performance)
- `POSTGRES_URL_NON_POOLING`: Direct database connection (used for migrations)

#### Option A: Using Neon Tech (Recommended for Serverless)

**Yes, you can use Neon Tech!** Neon is a serverless PostgreSQL platform that works perfectly with Prisma.

**Setup Steps:**

1. **Sign up for Neon:**
   - Go to [neon.tech](https://neon.tech)
   - Create a free account (generous free tier available)

2. **Create a new project:**
   - Click "Create Project"
   - Choose a project name and region
   - Select PostgreSQL version (14+ recommended)

3. **Get your connection strings:**
   - In your Neon dashboard, go to your project
   - Click on "Connection Details"
   - You'll see two connection strings:
     - **Pooled connection** (for `POSTGRES_PRISMA_URL`)
     - **Direct connection** (for `POSTGRES_URL_NON_POOLING`)

4. **Configure your `.env` file:**
   ```env
   # Use the pooled connection from Neon (includes connection pooling)
   POSTGRES_PRISMA_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true"
   
   # Use the direct connection from Neon (for migrations)
   POSTGRES_URL_NON_POOLING="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
   ```

   **Important:** Neon provides both connection strings in their dashboard. Make sure to:
   - Use the **pooled connection** for `POSTGRES_PRISMA_URL` (it will have `pgbouncer=true` or similar)
   - Use the **direct connection** for `POSTGRES_URL_NON_POOLING`

5. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```

**Neon Benefits:**
- ✅ Free tier with generous limits
- ✅ Serverless (auto-scales)
- ✅ Built-in connection pooling
- ✅ Branching support (like Git for databases)
- ✅ Easy to use with Prisma

#### Option B: Local PostgreSQL

**Example for local development:**
```env
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/realestate_db?schema=public&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/realestate_db?schema=public"
```

#### Option C: Other PostgreSQL Hosting

You can use any PostgreSQL provider:
- **Supabase** (similar setup to Neon)
- **Railway**
- **Render**
- **AWS RDS**
- **DigitalOcean Managed Databases**
- Any other PostgreSQL-compatible service

### 2. JWT Secret Key (Authentication)

```env
JWT_SECRET="your-secret-jwt-key-here"
```

**Description:** Used for signing and verifying JWT tokens for user authentication.

**How to generate a secure key:**
```bash
openssl rand -hex 32
```

**Note:** The code has a fallback default, but you should always set this in production.

### 3. Cloudinary Configuration (Image Uploads)

```env
CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

**Description:** Cloudinary is used for uploading and managing property images.

**How to get these values:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy the Cloud Name, API Key, and API Secret

## Setup Instructions

1. **Create a `.env` file** in the root directory:
   ```bash
   touch .env
   ```

2. **Copy the template above** and fill in your actual values

3. **Never commit `.env` to git** - it should already be in `.gitignore`

4. **For production**, set these variables in your hosting platform's environment settings:
   - Vercel: Project Settings → Environment Variables
   - Heroku: Settings → Config Vars
   - Other platforms: Check their documentation

## Important Notes

⚠️ **Security Warning:**
- Never share your `.env` file or commit it to version control
- Use different credentials for development and production
- Rotate secrets regularly, especially if they're exposed

⚠️ **Current Issues Found:**
- Some API routes have hardcoded Cloudinary credentials. These should be moved to environment variables for better security.

## Optional Environment Variables

If you need to add Google Maps API in the future:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

Currently, the project uses OpenStreetMap (Leaflet) which doesn't require an API key.

