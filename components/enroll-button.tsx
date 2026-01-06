'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string
  isEnrolled: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) {
        throw new Error('Failed to enroll')
      }

      toast({
        title: 'Success',
        description: 'You have been enrolled in this course!',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEnrolled) {
    return (
      <Button disabled>
        Already Enrolled
      </Button>
    )
  }

  return (
    <Button onClick={handleEnroll} disabled={isLoading}>
      {isLoading ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  )
}

