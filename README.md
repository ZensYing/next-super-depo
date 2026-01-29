# Super Depo Frontend ()

This is the web frontend for the Super Depo platform, built with [Next.js](https://nextjs.org/) and [Shadcn UI](https://ui.shadcn.com/).

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Installation

```bash
npm install
# or
yarn install
```

## Environment Configuration

Create a `.env.local` file in the root directory to configure the API connection:

```env
# URL of the backend API (e.g., http://localhost:8000 or https://api.superdepo.com)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the app

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: Radix UI / Shadcn UI
- **Forms**: React Hook Form + Zod validation
- **API Integration**: Axios with centralized configuration (`src/lib/api.ts`)
- **Global Config**: centralized env validation in `src/config/env.ts`
