# Assignment 2 Backend

This project is a TypeScript/Express backend for an issue tracking app. It supports user registration and login, JWT-based authentication, role-based access control, and CRUD operations for issues stored in PostgreSQL.

## Features

- User registration and login
- JWT authentication with access and refresh tokens
- Role-based authorization for `contributor` and `maintainer`
- Create, read, update, and delete issues
- PostgreSQL-backed persistence with automatic table initialization on startup

## Tech Stack

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- JSON Web Tokens
- bcryptjs

## Project Structure

- `src/server.ts` starts the server and initializes the database
- `src/app.ts` configures middleware and routes
- `src/config` loads environment variables
- `src/db` creates the PostgreSQL pool and tables
- `src/modules/auth` contains registration and login logic
- `src/modules/issues` contains issue management logic
- `src/middlewares` contains authentication, authorization, and global error handling
- `src/utils` contains shared helpers and response classes

## Prerequisites

- Node.js installed locally
- `pnpm` installed locally
- A PostgreSQL database

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in the project root with the required values:

   ```env
   PORT=8000
   DATABASE_URL=postgresql://user:password@localhost:5432/assignment_2
   CORS_ORIGIN=http://localhost:3000
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

The app initializes the database tables automatically on startup.

## Scripts

- `pnpm dev` - run the server in watch mode with `tsx`
- `pnpm build` - build the project with `tsup`
- `pnpm start` - run the production build from `dist/server.js`

## Environment Variables

- `PORT` - server port
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - allowed frontend origin
- `ACCESS_TOKEN_SECRET` - JWT secret used for access tokens
- `REFRESH_TOKEN_SECRET` - JWT secret used for refresh tokens

## API Overview

Base path: `/api`

### Auth

- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - log in and receive tokens

Register payload:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "contributor"
}
```

Login payload:

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

### Issues

- `GET /api/issues` - list issues
- `GET /api/issues/:id` - get a single issue
- `POST /api/issues` - create an issue, requires authentication and `contributor` or `maintainer`
- `PATCH /api/issues/:id` - update an issue, requires authentication and `contributor` or `maintainer`
- `DELETE /api/issues/:id` - delete an issue, requires authentication and `maintainer`

List query parameters:

- `sort` - `newest` or `oldest`
- `type` - `bug` or `feature_request`
- `status` - `open`, `in_progress`, or `resolved`

Create or update issue payload:

```json
{
  "title": "Login button not working",
  "description": "Clicking the login button does nothing",
  "type": "bug"
}
```

## Database Schema

The app creates two tables automatically:

- `users` - stores name, email, password, role, and timestamps
- `issues` - stores title, description, type, status, reporter reference, and timestamps

## Authentication Notes

- Login returns the access token in the JSON response and also sets `access_token` and `refresh_token` cookies.
- Protected routes expect the access token in the `Authorization: Bearer <token>` header.
- Cookies are configured as `httpOnly` and `secure`.

## License

ISC
