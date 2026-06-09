# Todo App

A fullstack todo application with AI-powered suggestions, built with Next.js and Prisma.

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4           |
| Backend  | Next.js API Routes (Route Handlers)                         |
| Database | PostgreSQL via Prisma 7 (ORM)                               |
| AI       | Google Gemini API (free tier) for todo suggestions          |
| Icons    | Lucide React                                                |

## Project Structure

```
todoapp/
├── prisma/
│   └── schema.prisma           # Todo model definition
├── prisma.config.ts            # Prisma configuration
├── app/
│   ├── api/
│   │   ├── todos/
│   │   │   ├── route.ts        # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts    # PATCH (toggle), DELETE
│   │   └── suggestions/
│   │       └── route.ts        # GET ?topic= (Gemini AI suggestions)
│   ├── components/
│   │   ├── TodoForm.tsx        # Add todo input
│   │   ├── TodoList.tsx        # Todo list with toggle/delete
│   │   └── Suggestions.tsx     # AI suggestion panel
│   ├── globals.css             # Tailwind imports
│   ├── layout.tsx              # Root layout with fonts
│   └── page.tsx                # Main page (client component)
├── lib/
│   └── prisma.ts               # Prisma client singleton
├── .env                        # Environment variables (gitignored)
└── PROJECT.md
```

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** instance (local or cloud)
- **Gemini API Key** (optional — falls back to predefined suggestions)

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Environment

Copy `.env` and fill in your credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/todoapp?schema=public"
GEMINI_API_KEY="your_gemini_api_key_here"
```

> Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/apikey). The app works without it using built-in fallback suggestions.

### 3. Generate Prisma Client & Migrate

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/todos`           | List all todos (desc by date) |
| POST   | `/api/todos`           | Create a todo `{ title }`    |
| PATCH  | `/api/todos/[id]`      | Toggle `{ completed }`       |
| DELETE | `/api/todos/[id]`      | Delete a todo                |
| GET    | `/api/suggestions?topic=` | Get AI suggestions (optional topic) |

## Features

- Add, complete, and delete todos
- AI-powered todo suggestions by topic (work, health, learning, etc.)
- Works offline with fallback suggestions when no API key is configured

## Scripts

| Command              | Action           |
| -------------------- | ---------------- |
| `npm run dev`        | Start dev server |
| `npm run build`      | Build for production |
| `npm start`          | Start production server |
| `npx prisma migrate` | Run database migrations |
