# ScholarBot - AI-Powered Learning Platform

A modern, production-ready educational platform built with Next.js, TypeScript, and AI integration. ScholarBot provides a Coursera-style learning experience with personalized AI tutoring.

## Features

- 🎓 **Course Management**: Browse, enroll, and learn from expert courses
- 🤖 **AI Tutor**: 24/7 AI-powered tutoring with context-aware responses
- 📊 **Progress Tracking**: Monitor your learning progress with detailed analytics
- 👤 **User Authentication**: Secure signup and login system
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎯 **Interactive Lessons**: Video and text-based lesson content
- 📈 **Dashboard**: Comprehensive overview of your learning journey

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-3.5 Turbo
- **UI Components**: Radix UI, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scholarbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/scholarbot?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
OPENAI_API_KEY="your-openai-api-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
scholarbot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course pages
│   ├── dashboard/        # User dashboard
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Feature components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema
│   └── schema.prisma    # Prisma schema
└── types/               # TypeScript type definitions
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Course**: Course information and metadata
- **Lesson**: Individual lessons within courses
- **Enrollment**: User course enrollments
- **Progress**: Learning progress tracking
- **AIChat**: AI conversation history

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/courses/enroll` - Enroll in a course
- `POST /api/progress/complete` - Mark lesson as complete
- `POST /api/ai/chat` - AI tutor chat (lesson context)
- `POST /api/ai/chat-general` - General AI tutor chat

## Features in Detail

### Course Management
- Browse all published courses
- View course details and lessons
- Enroll in courses
- Track progress through lessons

### AI Tutor
- Context-aware responses based on current lesson
- General learning assistance
- Conversation history
- Real-time chat interface

### Progress Tracking
- Lesson completion tracking
- Course progress percentage
- Dashboard with statistics
- My Courses page with progress bars

## Development

### Database Management

Generate Prisma client:
```bash
npm run db:generate
```

Push schema changes:
```bash
npm run db:push
```

Open Prisma Studio:
```bash
npm run db:studio
```

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Application URL |
| `NEXTAUTH_SECRET` | Secret for JWT encryption |
| `OPENAI_API_KEY` | OpenAI API key for AI features |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

