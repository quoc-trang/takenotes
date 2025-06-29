# TakeNotes Backend

A Node.js/Express.js backend API for the TakeNotes application with TypeScript, PostgreSQL, and Prisma ORM.

## Features

- User authentication with JWT
- CRUD operations for notes
- PostgreSQL database with Prisma ORM
- TypeScript support
- Input validation
- Error handling
- Security middleware

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database URL and JWT secret.

4. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

5. Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Notes (Protected)

- `GET /api/notes` - Get all notes for authenticated user
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Database Schema

### User

- `id` (String, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Note

- `id` (String, Primary Key)
- `title` (String)
- `content` (String)
- `userId` (String, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Deployment to Railway

1. Connect your repository to Railway
2. Set environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
3. Railway will automatically detect the Node.js app and deploy it
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
