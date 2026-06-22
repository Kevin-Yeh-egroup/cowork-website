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
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>

            <p className="text-sm font-medium text-primary mb-2">{eyebrow}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
              {title}
            </h1>
            <p className="mb-5 text-sm leading-snug text-muted-foreground sm:text-base">{description}</p>

            <div className="mb-5 grid gap-2.5">
              {details.map((detail) => (
                <div key={detail} className="rounded-xl bg-card border border-border px-4 py-3 text-sm text-foreground">
                  {detail}
                </div>
              ))}
            </div>

            {notice && (
              <p className="mb-5 rounded-xl border border-border bg-card/70 p-3.5 text-sm leading-snug text-muted-foreground">
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
