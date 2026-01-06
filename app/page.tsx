import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { BookOpen, Users, Award, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Learning</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Learn Anything with
              <span className="text-primary"> ScholarBot</span>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Personalized education powered by AI. Master new skills with interactive courses,
              real-time tutoring, and adaptive learning paths.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-24 md:py-32">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Expert Courses</CardTitle>
                <CardDescription>
                  Access thousands of courses taught by industry experts and top universities.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Tutor</CardTitle>
                <CardDescription>
                  Get instant help from our AI tutor, available 24/7 to answer questions and guide your learning.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Earn certificates upon course completion to showcase your new skills.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-muted/50">
          <div className="container py-24 md:py-32">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Expert Instructors</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

