"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NextSteps } from "@/components/next-steps"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface Question {
  id: number
  question: string
  options: { value: number; label: string }[]
}

interface AssessmentFlowProps {
  title: string
  description: string
  questions: Question[]
  getResult: (score: number) => { status: string; message: string; level: "good" | "medium" | "warning" }
}

export function AssessmentFlow({ title, description, questions, getResult }: AssessmentFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0)
  }

  if (isCompleted) {
    const score = calculateScore()
    const result = getResult(score)
    
    const levelColors = {
      good: "text-primary bg-primary/10",
      medium: "text-accent-foreground bg-accent/30",
      warning: "text-destructive bg-destructive/10",
    }

    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full ${levelColors[result.level]} flex items-center justify-center mx-auto mb-4`}>
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">檢測完成</h1>
            <p className="text-muted-foreground">{title}</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <p className={`text-3xl font-bold mb-2 ${levelColors[result.level].split(" ")[0]}`}>
                {result.status}
              </p>
              <p className="text-muted-foreground">{result.message}</p>
            </CardContent>
          </Card>

          <NextSteps />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            第 {currentQuestion + 1} 題，共 {questions.length} 題
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-foreground mb-6">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    answers[currentQ.id] === option.value
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-primary/30 text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> 上一題
          </Button>
          <Button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            className="flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? "完成" : "下一題"}{" "}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
