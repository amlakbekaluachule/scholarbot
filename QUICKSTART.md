# Quick Start Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL database running
- OpenAI API key

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/scholarbot?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
OPENAI_API_KEY="your-openai-api-key"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Sample Accounts (after seeding)

- **Admin**: admin@scholarbot.com / admin123
- **Instructor**: instructor@scholarbot.com / instructor123
- **Student**: student@scholarbot.com / student123

## Key Features to Test

1. **Sign Up/Login**: Create a new account or use sample accounts
2. **Browse Courses**: View available courses on `/courses`
3. **Enroll**: Enroll in a course from the course detail page
4. **Learn**: Access lessons and mark them as complete
5. **AI Tutor**: Ask questions in the AI tutor sidebar during lessons
6. **Dashboard**: View your progress and enrolled courses

## Database Management

- **View data**: `npm run db:studio` (opens Prisma Studio)
- **Reset database**: Delete and recreate your database, then run `npm run db:push`
- **Seed data**: `npm run db:seed`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set environment variables in your hosting platform

3. Run migrations:
```bash
npm run db:push
```

4. Start the server:
```bash
npm start
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

### AI Features Not Working
- Verify OPENAI_API_KEY is set correctly
- Check API key has sufficient credits
- Review API rate limits

