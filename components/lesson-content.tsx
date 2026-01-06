'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface LessonContentProps {
  lesson: {
    id: string
    title: string
    description: string
    content: string
    videoUrl: string | null
  }
  courseId: string
  userId: string
  isCompleted: boolean
}

export function LessonContent({ lesson, courseId, userId, isCompleted }: LessonContentProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const { toast } = useToast()

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId,
          lessonId: lesson.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark as complete')
      }

      setCompleted(true)
      toast({
        title: 'Success',
        description: 'Lesson marked as complete!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {lesson.videoUrl && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">About this lesson</h2>
        <p className="text-muted-foreground mb-4">{lesson.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      </div>

      <div className="pt-6 border-t">
        {completed ? (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">You've completed this lesson</span>
          </div>
        ) : (
          <Button onClick={handleComplete} size="lg">
            Mark as Complete
          </Button>
        )}
      </div>
    </div>
  )
}

