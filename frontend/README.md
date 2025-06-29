# TakeNotes Frontend

A Nuxt.js 3 + TypeScript + Tailwind CSS frontend for the TakeNotes application.

## Features

- User authentication (login, register, logout)
- Protected routes for notes dashboard
- Create, edit, view, and delete notes
- Rich text editor (TipTap)
- Responsive design with Tailwind CSS
- State management with Pinia
- API integration with Express.js backend

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure API base URL (optional):

- By default, the frontend expects the backend at `http://localhost:3001`.
- To change, set the `API_BASE` environment variable or edit `nuxt.config.ts`.

4. Start the development server:

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Deployment to NuxtHub

1. Push your repository to GitHub.
2. Go to [NuxtHub](https://nuxthub.com/) and connect your repository.
3. Set the `API_BASE` environment variable to your backend URL in NuxtHub dashboard.
4. Deploy!

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## Directory Structure

- `pages/` - Application pages (login, register, notes, etc.)
- `components/` - Reusable components (TipTap editor, etc.)
- `stores/` - Pinia stores for auth and notes
- `assets/css/` - Tailwind CSS styles
