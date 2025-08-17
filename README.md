# TakeNotes

A modern, full-stack note-taking application built with Vue.js/Nuxt.js frontend and Node.js/Express.js backend.

## �� Features

### Core Functionality

- **User Authentication**: Secure registration and login with JWT tokens
- **Rich Text Editor**: TipTap-based editor with formatting options (bold, italic, underline, headings, lists)
- **CRUD Operations**: Create, read, update, and delete notes
- **User-specific Notes**: Each user can only access their own notes
- **Responsive Design**: Modern UI built with Tailwind CSS

### Technical Features

- **TypeScript**: Full TypeScript support for both frontend and backend
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **State Management**: Pinia for frontend state management with persistence
- **Security**: JWT authentication, password hashing, input validation, and security middleware
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Centralized error handling and validation

## ��️ Architecture

### Frontend (Nuxt.js 3)

- **Framework**: Nuxt.js 3 with Vue 3
- **Styling**: Tailwind CSS
- **State Management**: Pinia with persisted state
- **Rich Text Editor**: TipTap with multiple extensions
- **Authentication**: JWT token management with automatic refresh

### Backend (Express.js)

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Validation**: Express-validator for input validation
- **Security**: Helmet for security headers, CORS configuration
- **Logging**: Winston for structured logging

## 📁 Project Structure

```
takenotes/
├── package.json            # Root package.json with development scripts
├── backend/                # Express.js API server
│   ├── src/
│   │   ├── routes/         # API routes (auth, notes)
│   │   ├── middleware/     # Authentication and error handling
│   │   ├── utils/          # Logger utility
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema and migrations
│   └── package.json        # Backend dependencies and scripts
├── frontend/               # Nuxt.js 3 application
│   ├── pages/             # Application pages
│   ├── components/        # Reusable components
│   ├── stores/            # Pinia stores
│   ├── composables/       # Vue composables
│   ├── server/api/        # Nuxt server API routes
│   └── package.json       # Frontend dependencies and scripts
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Quick Start (Recommended)

1. **Clone the repository and install all dependencies**:

   ```bash
   git clone <repository-url>
   cd takenotes
   npm run install:all
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/takenotes"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   FRONTEND_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

3. **Set up database**:

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start both development servers**:

   ```bash
   npm run dev
   ```

   This will start:

   - Backend on `http://localhost:3001`
   - Frontend on `http://localhost:3000`

### Individual Setup (Alternative)

If you prefer to work on individual services:

#### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/takenotes"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   FRONTEND_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

4. **Set up database**:

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database (development)
   npm run db:push

   # Or run migrations (production)
   npm run db:migrate
   ```

5. **Start development server**:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

#### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure API base URL** (optional):

   - Default: `http://localhost:3001`
   - Set `NUXT_PUBLIC_API_BASE_URL` environment variable to change

4. **Start development server**:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Notes Endpoints (Protected)

#### Get All Notes

```http
GET /api/notes
Authorization: Bearer <jwt-token>
```

#### Get Single Note

```http
GET /api/notes/:id
Authorization: Bearer <jwt-token>
```

#### Create Note

```http
POST /api/notes
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Note Title",
  "content": "Note content with rich text formatting"
}
```

#### Update Note

```http
PUT /api/notes/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note

```http
DELETE /api/notes/:id
Authorization: Bearer <jwt-token>
```

## ️ Database Schema

### User Table

```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  notes     Note[]
}
```

### Note Table

```sql
model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🚀 Deployment

### Backend Deployment (Railway)

1. **Install Railway CLI**:

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:

   ```bash
   railway login
   ```

3. **Deploy**:

   ```bash
   railway up
   ```

4. **Set environment variables** in Railway dashboard:

   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

5. **Run database migrations**:
   ```bash
   railway run npm run db:migrate:deploy
   ```

### Frontend Deployment (NuxtHub)

1. Push your repository to GitHub
2. Connect to [NuxtHub](https://nuxthub.com/)
3. Set `NUXT_PUBLIC_API_BASE_URL` environment variable
4. Deploy automatically

## ️ Available Scripts

### Root Level Scripts (Recommended)

- `npm run dev` - Start both backend and frontend development servers
- `npm run dev:backend` - Start only backend development server
- `npm run dev:frontend` - Start only frontend development server
- `npm run install:all` - Install dependencies for all projects
- `npm run build` - Build both backend and frontend
- `npm run start` - Start both production servers
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run clean` - Clean all build artifacts and node_modules
- `npm run clean:install` - Clean and reinstall all dependencies
- `npm run lint` - Run linting for both projects
- `npm run test` - Run tests for both projects

### Backend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## 🔧 Development

### Development Workflow

#### Starting Development

The easiest way to start development is from the root directory:

```bash
# Start both servers simultaneously
npm run dev
```

This will start both the backend (port 3001) and frontend (port 3000) with colored output and proper process management.

#### Working on Individual Services

If you need to work on only one service:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

#### Database Operations

All database operations can be run from the root:

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

### Key Components

#### TipTap Editor

The rich text editor component (`TipTapEditor.vue`) provides:

- Text formatting (bold, italic, underline)
- Headings (H1, H2)
- Lists (bullet and numbered)
- Real-time content updates

#### Authentication Middleware

- JWT token validation
- Automatic token refresh
- Protected route handling

#### State Management

- **Auth Store**: Manages user authentication state
- **Notes Store**: Handles notes CRUD operations with API integration

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for all inputs
- **Security Headers**: Helmet middleware
- **CORS Configuration**: Proper cross-origin settings
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm run install:all`
4. Set up environment variables (see Installation section)
5. Start development: `npm run dev`
6. Make your changes
7. Add tests if applicable
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the existing documentation
- Review the code comments
- Open an issue on GitHub

---

**TakeNotes** - A modern note-taking experience built with Vue.js and Node.js

```

This comprehensive README file covers:

1. **Project Overview**: Clear description of what TakeNotes is and its key features
2. **Architecture**: Detailed breakdown of frontend and backend technologies
3. **Installation**: Step-by-step setup instructions for both frontend and backend
4. **API Documentation**: Complete API reference with examples
5. **Database Schema**: Clear representation of the data models
6. **Deployment**: Instructions for deploying to Railway and NuxtHub
7. **Development**: Information about key components and development workflow
8. **Security**: Overview of security features implemented
9. **Project Structure**: Visual representation of the codebase organization

The README is based on the actual implementation I analyzed, including the specific technologies used (Nuxt.js 3, Express.js, Prisma, TipTap, etc.), the database schema, API endpoints, and deployment configurations.

```
