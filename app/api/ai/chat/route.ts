import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, lessonId, message, history } = await request.json()

    if (!message || !courseId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, description: true },
    })

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { title: true, description: true, content: true },
    })

    if (!course || !lesson) {
      return NextResponse.json(
        { error: 'Course or lesson not found' },
        { status: 404 }
      )
    }

    const systemPrompt = `You are an AI tutor helping a student learn. The student is currently studying:
    
Course: ${course.title}
${course.description}

Current Lesson: ${lesson.title}
${lesson.description}

Lesson Content:
${lesson.content.substring(0, 2000)}

Your role is to:
1. Answer questions about the lesson content clearly and concisely
2. Help explain concepts in simple terms
3. Provide examples when helpful
4. Encourage the student's learning
5. If asked about something not in the lesson, politely redirect to the lesson content

Keep responses concise and focused on helping the student understand the material.`

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ]

    const recentHistory = history.slice(-10)
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })
    }

    messages.push({ role: 'user', content: message })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

