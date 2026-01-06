import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { EnrollButton } from '@/components/enroll-button'
import { Clock, Users, BookOpen, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

async function getCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: {
        select: { name: true, email: true },
      },
      lessons: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  })
  return course
}

async function getUserEnrollment(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  })
  return enrollment
}

async function getUserProgress(userId: string, courseId: string) {
  const progress = await prisma.progress.findMany({
    where: {
      userId,
      courseId,
      completed: true,
    },
    include: {
      lesson: {
        select: { id: true },
      },
    },
  })
  return progress
}

export default async function CoursePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const course = await getCourse(params.id)

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Course not found</h1>
            <Link href="/courses" className="text-primary hover:underline">
              Back to courses
            </Link>
          </div>
        </main>
      </div>
    )
  }

  let enrollment = null
  let progress = []
  let progressPercentage = 0

  if (session?.user?.id) {
    enrollment = await getUserEnrollment(session.user.id, course.id)
    progress = await getUserProgress(session.user.id, course.id)
    progressPercentage =
      course.lessons.length > 0
        ? Math.round((progress.length / course.lessons.length) * 100)
        : 0
  }

  const isEnrolled = !!enrollment

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-muted/50">
          <div className="container py-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {course._count.enrollments} students
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {course.duration} hours
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons.length} lessons
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm text-muted-foreground">Instructor:</span>
                  <span className="font-medium">{course.instructor.name}</span>
                </div>
                {isEnrolled && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} />
                  </div>
                )}
                {session ? (
                  <EnrollButton courseId={course.id} isEnrolled={isEnrolled} />
                ) : (
                  <Button asChild>
                    <Link href="/auth/signin">Sign in to enroll</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Section */}
        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const isCompleted = progress.some((p) => p.lessonId === lesson.id)
              return (
                <Card key={lesson.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{lesson.duration} min</span>
                          {lesson.isFree && <span className="text-primary">Free</span>}
                        </div>
                      </div>
                      {isEnrolled && (
                        <Button asChild variant="outline">
                          <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                            {isCompleted ? 'Review' : 'Start'}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

