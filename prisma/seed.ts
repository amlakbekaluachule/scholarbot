import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scholarbot.com' },
    update: {},
    create: {
      email: 'admin@scholarbot.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  const instructorPassword = await bcrypt.hash('instructor123', 10)
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@scholarbot.com' },
    update: {},
    create: {
      email: 'instructor@scholarbot.com',
      name: 'John Instructor',
      password: instructorPassword,
      role: 'instructor',
    },
  })

  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'student@scholarbot.com' },
    update: {},
    create: {
      email: 'student@scholarbot.com',
      name: 'Jane Student',
      password: studentPassword,
      role: 'student',
    },
  })

  const course = await prisma.course.upsert({
    where: { id: 'sample-course-1' },
    update: {},
    create: {
      id: 'sample-course-1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to building your first web applications.',
      instructorId: instructor.id,
      category: 'Web Development',
      level: 'beginner',
      duration: 40,
      price: 0,
      isPublished: true,
    },
  })

  const lessons = [
    {
      title: 'Getting Started with HTML',
      description: 'Learn the basics of HTML structure and tags',
      content: `
        <h2>What is HTML?</h2>
        <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages.</p>
        <h3>Basic Structure</h3>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello World&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
      `,
      order: 1,
      duration: 30,
      isFree: true,
    },
    {
      title: 'CSS Fundamentals',
      description: 'Master CSS styling and layout',
      content: `
        <h2>Introduction to CSS</h2>
        <p>CSS (Cascading Style Sheets) is used to style HTML elements.</p>
        <h3>Basic Syntax</h3>
        <pre><code>selector {
  property: value;
}</code></pre>
        <p>CSS allows you to control colors, fonts, spacing, and layout of your web pages.</p>
      `,
      order: 2,
      duration: 45,
      isFree: true,
    },
    {
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming',
      content: `
        <h2>JavaScript Fundamentals</h2>
        <p>JavaScript is a programming language that adds interactivity to web pages.</p>
        <h3>Variables</h3>
        <pre><code>let name = "ScholarBot";
const age = 2024;
var isActive = true;</code></pre>
        <p>JavaScript variables can hold different types of data including strings, numbers, and booleans.</p>
      `,
      order: 3,
      duration: 60,
      isFree: false,
    },
  ]

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `lesson-${course.id}-${lesson.order}`,
      },
      update: {},
      create: {
        id: `lesson-${course.id}-${lesson.order}`,
        courseId: course.id,
        ...lesson,
      },
    })
  }

  console.log('Seed data created successfully!')
  console.log('Admin:', admin.email, '/ admin123')
  console.log('Instructor:', instructor.email, '/ instructor123')
  console.log('Student:', student.email, '/ student123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

