import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { redirect } from 'next/navigation'

async function getEnrollments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: {
            select: { name: true },
          },
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const completedLessons = await prisma.progress.count({
        where: {
          userId,
          courseId: enrollment.courseId,
          completed: true,
        },
      })

      const totalLessons = enrollment.course._count.lessons
      const progress = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0

      return {
        ...enrollment,
        progress,
        completedLessons,
      }
    })
  )

  return enrollmentsWithProgress
}

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const enrollments = await getEnrollments(session.user.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Continue your learning journey
          </p>
        </div>

        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="flex flex-col">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="line-clamp-2">
                    {enrollment.course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {enrollment.course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <Progress value={enrollment.progress} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {enrollment.completedLessons} of {enrollment.course._count.lessons} lessons completed
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {enrollment.course.duration}h
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {enrollment.course._count.lessons} lessons
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Instructor: </span>
                      <span className="font-medium">{enrollment.course.instructor.name}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${enrollment.course.id}`}>
                      {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

