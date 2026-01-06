import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Users, BookOpen } from 'lucide-react'

async function getCourses() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      instructor: {
        select: { name: true },
      },
      _count: {
        select: { enrollments: true, lessons: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return courses
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Courses</h1>
          <p className="text-muted-foreground">
            Discover courses from expert instructors
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}h
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course._count.enrollments}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{course.instructor.name}</span>
                    <span className="text-sm font-bold text-primary">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}

