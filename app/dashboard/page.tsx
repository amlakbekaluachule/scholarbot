import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'

async function getUserStats(userId: string) {
  const [enrollments, progress] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
    }),
    prisma.progress.findMany({
      where: { userId, completed: true },
      include: {
        lesson: {
          select: { courseId: true },
        },
      },
    }),
  ])

  const totalLessons = enrollments.reduce(
    (sum, e) => sum + e.course._count.lessons,
    0
  )
  const completedLessons = progress.length
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const courseProgressMap = new Map<string, { completed: number; total: number }>()
  
  enrollments.forEach((enrollment) => {
    courseProgressMap.set(enrollment.courseId, {
      completed: 0,
      total: enrollment.course._count.lessons,
    })
  })

  progress.forEach((p) => {
    if (p.lesson?.courseId) {
      const courseProgress = courseProgressMap.get(p.lesson.courseId)
      if (courseProgress) {
        courseProgress.completed++
      }
    }
  })

  const completedCourses = Array.from(courseProgressMap.values()).filter(
    (cp) => cp.total > 0 && cp.completed === cp.total
  ).length

  const enrollmentsWithProgress = enrollments.map((enrollment) => {
    const courseProgress = courseProgressMap.get(enrollment.courseId) || { completed: 0, total: 0 }
    const courseProgressPercentage = courseProgress.total > 0
      ? Math.round((courseProgress.completed / courseProgress.total) * 100)
      : 0
    return {
      ...enrollment,
      progress: courseProgressPercentage,
      completedLessons: courseProgress.completed,
    }
  })

  return {
    enrollments: enrollmentsWithProgress,
    totalLessons,
    completedLessons,
    progressPercentage,
    completedCourses,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const stats = await getUserStats(session.user.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || 'Student'}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enrollments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedLessons}</div>
              <p className="text-xs text-muted-foreground">
                of {stats.totalLessons} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.progressPercentage}%</div>
              <Progress value={stats.progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCourses}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          {stats.enrollments.length === 0 ? (
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
              {stats.enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {enrollment.course.title}
                    </CardTitle>
                    <CardDescription>
                      {enrollment.course.description.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
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
        </div>
      </main>
    </div>
  )
}

