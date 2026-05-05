"use client"

import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface IntroStepProps {
  eyebrow?: string
  title: string
  description: string
  details: string[]
  notice?: string
  startLabel?: string
  icon: LucideIcon
  onStart: () => void
}

export function IntroStep({
  eyebrow = "開始前先看一下",
  title,
  description,
  details,
  notice,
  startLabel = "開始",
  icon: Icon,
  onStart,
}: IntroStepProps) {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 sm:p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Icon className="h-7 w-7 text-primary" />
            </div>

            <p className="text-sm font-medium text-primary mb-2">{eyebrow}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
              {title}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

            <div className="grid gap-3 mb-6">
              {details.map((detail) => (
                <div key={detail} className="rounded-xl bg-card border border-border px-4 py-3 text-sm text-foreground">
                  {detail}
                </div>
              ))}
            </div>

            {notice && (
              <p className="text-sm text-muted-foreground bg-card/70 border border-border rounded-xl p-4 mb-6">
                {notice}
              </p>
            )}

            <Button onClick={onStart} className="w-full sm:w-auto">
              {startLabel} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
