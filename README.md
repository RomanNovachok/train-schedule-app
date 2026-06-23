# Train Schedule App

A simple full-stack train schedule application built for a Full Stack internship test task. The app allows guests to view the schedule, users to manage train records, and admins to perform full CRUD.

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database, local or cloud such as Neon

### Backend setup

1. From the project root, go to the backend folder:

   ```powershell
   cd backend
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create `.env` from `.env.example`.
4. Set `DATABASE_URL`, `JWT_SECRET`, and `PORT`.
5. Generate Prisma client:

   ```powershell
   npm run prisma:generate
   ```

6. Run migrations:

   ```powershell
   npm run prisma:migrate
   ```

7. Seed the database:

   ```powershell
   npm run prisma:seed
   ```

8. Start the backend:

   ```powershell
   npm run dev
   ```

The backend runs on: [https://train-schedule-app-7yzy.onrender.com](https://train-schedule-app-7yzy.onrender.com)

### Frontend setup

1. If you are still inside the backend folder, run:

   ```powershell
   cd ../frontend
   ```

   Otherwise, from the project root run:

   ```powershell
   cd frontend
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create `.env.local` from `.env.local.example`.
4. Set `NEXT_PUBLIC_API_URL` to `http://localhost:3333`.
5. Start the frontend:

   ```powershell
   npm run dev
   ```

The frontend runs on: [https://train-schedule-app-omega.vercel.app/](https://train-schedule-app-omega.vercel.app/)

## Test Credentials

- Admin: `admin@mail.com` / `admin`
- User: `user@mail.com` / `user`

## Features

- Public train schedule view
- User registration and login
- JWT authentication
- PostgreSQL persistence
- Train create/edit/delete functionality
- Role-based access control

## Roles

- Guest: can only view the schedule
- User: can view, create, and edit train records
- Admin: can view, create, edit, and delete train records

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT, bcrypt
- Styling: CSS

## API Overview

- `POST /auth/register`
- `POST /auth/login`
- `GET /trains`
- `POST /trains`
- `PATCH /trains/:id`
- `DELETE /trains/:id`

Protected routes require `Authorization: Bearer <token>`.

## Project Structure

- `backend/` — NestJS API
- `frontend/` — Next.js client

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

Frontend URL: https://train-schedule-app-omega.vercel.app/
Backend URL: https://train-schedule-app-7yzy.onrender.com

## Notes

- `.env` and `.env.local` should not be committed.
- Persistent data is stored in PostgreSQL through Prisma.
- The frontend communicates only with the backend API.
