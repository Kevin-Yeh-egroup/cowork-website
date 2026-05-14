"use client"

import { Award, CheckCircle2, Circle, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { BadgeWithStatus, MissionWithProgress, TitleWithStatus } from "@/lib/achievements-service"

type AchievementSummaryProps = {
  title: string
  description: string
  badges: BadgeWithStatus[]
  missions: MissionWithProgress[]
  currentTitle?: TitleWithStatus
  nextTitle?: TitleWithStatus
  recentEventCount: number
  onReset?: () => void
}

function formatEarnedDate(earnedAt?: string) {
  if (!earnedAt) return "尚未取得"

  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(earnedAt))
}

export function AchievementSummary({
  title,
  description,
  badges,
  missions,
  currentTitle,
  nextTitle,
  recentEventCount,
  onReset,
}: AchievementSummaryProps) {
  const earnedBadges = badges.filter((badge) => badge.isEarned)
  const nextBadges = badges.filter((badge) => !badge.isEarned).slice(0, 3)
  const visibleBadges = [...earnedBadges.slice(0, 6), ...nextBadges].slice(0, 8)

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-card px-3 py-1 text-sm font-medium text-primary">
              已取得 {earnedBadges.length} / {badges.length}
            </span>
            {onReset && (
              <Button type="button" variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
                重置
              </Button>
            )}
          </div>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-primary/20 bg-card p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {currentTitle?.iconLabel ?? "起"}
              </span>
              <div>
                <p className="text-xs font-medium text-primary">目前稱號</p>
                <h3 className="text-lg font-semibold text-foreground">{currentTitle?.name ?? "尚未取得稱號"}</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {currentTitle?.description ?? "完成第一個關鍵任務後，系統會依照整體成長自動授予稱號。"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">
                {nextTitle ? `距離「${nextTitle.name}」` : "已達目前最高稱號"}
              </h3>
            </div>
            {nextTitle ? (
              <>
                <Progress value={nextTitle.progressPercent} className="mb-3" />
                <div className="space-y-2">
                  {nextTitle.criteria.map((criterion) => (
                    <div key={criterion.label} className="flex items-start gap-2 text-sm">
                      {criterion.isCompleted ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="text-muted-foreground">
                        {criterion.label}
                        {criterion.required !== undefined && (
                          <span className="text-foreground">
                            {" "}
                            ({Math.min(criterion.current ?? 0, criterion.required)} / {criterion.required})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">你已完成第一版稱號系統中的所有階段。</p>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleBadges.map((badge) => (
            <div
              key={badge.code}
              className={`rounded-2xl border p-4 ${
                badge.isEarned ? "border-primary/30 bg-card" : "border-border bg-card/60 opacity-75"
              }`}
            >
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-semibold ${
                  badge.isEarned
                    ? "border-primary/30 bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground"
                }`}
              >
                {badge.iconLabel}
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{badge.name}</h3>
                {badge.isEarned ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{badge.description}</p>
              <p className="mt-3 text-xs font-medium text-primary">{formatEarnedDate(badge.earnedAt)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {missions.map((mission) => (
            <div key={mission.code} className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{mission.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{mission.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {mission.completedSteps} / {mission.totalSteps}
                </span>
              </div>
              <Progress value={mission.progressPercent} className="mb-4" />
              <div className="space-y-2">
                {mission.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 rounded-xl bg-secondary/50 px-3 py-2">
                    {step.isCompleted ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {step.currentCount} / {step.requiredCount} · {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">本機已記錄 {recentEventCount} 筆成就事件，重新整理後仍會保留。</p>
      </CardContent>
    </Card>
  )
}
