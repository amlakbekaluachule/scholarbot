import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LessonContent } from '@/components/lesson-content'
import { AITutorSidebar } from '@/components/ai-tutor-sidebar'
import { CheckCircle2, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function getCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  })
  return course
}

async function getLesson(courseId: string, lessonId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      courseId,
    },
  })
  return lesson
}

async function checkEnrollment(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  })
  return !!enrollment
}

async function getProgress(userId: string, lessonId: string) {
  const progress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  })
  return progress
}

export default async function LessonPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const session = await getServerSession(authOptions)
  const course = await getCourse(params.id)
  const lesson = await getLesson(params.id, params.lessonId)

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
            <Link href={`/courses/${params.id}`} className="text-primary hover:underline">
              Back to course
            </Link>
          </div>
        </main>
      </div>
    )
  }

  let isEnrolled = false
  let progress = null

  if (session?.user?.id) {
    isEnrolled = await checkEnrollment(session.user.id, course.id)
    progress = await getProgress(session.user.id, lesson.id)
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">You need to enroll in this course</h1>
            <Link href={`/courses/${params.id}`} className="text-primary hover:underline">
              Back to course
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const currentLessonIndex = course.lessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = course.lessons[currentLessonIndex + 1]
  const prevLesson = course.lessons[currentLessonIndex - 1]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex">
        <div className="flex-1 container py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href={`/courses/${course.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>{course.title}</span>
              <span>•</span>
              <span>Lesson {currentLessonIndex + 1} of {course.lessons.length}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson.duration} min
              </div>
              {progress?.completed && (
                <div className="flex items-center gap-1 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </div>
              )}
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <LessonContent
                lesson={lesson}
                courseId={course.id}
                userId={session!.user!.id}
                isCompleted={progress?.completed || false}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link href={`/courses/${course.id}/lessons/${prevLesson.id}`}>
                  Previous Lesson
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Button asChild>
                <Link href={`/courses/${course.id}/lessons/${nextLesson.id}`}>
                  Next Lesson
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/courses/${course.id}`}>Back to Course</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="w-96 border-l bg-muted/30">
          <AITutorSidebar courseId={course.id} lessonId={lesson.id} />
        </div>
      </main>
    </div>
  )
}

