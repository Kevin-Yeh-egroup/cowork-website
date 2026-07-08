"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flag,
  PiggyBank,
  Plus,
  Save,
  ShieldCheck,
  Target,
} from "lucide-react"

import { SaveToProfilePrompt } from "@/app/toolbox/_components/save-to-profile-prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

type PlanningMode = "goal" | "quick"

type GoalDraft = {
  type: string
  name: string
  targetAmount: number
  currentAmount: number
  deadlineMonths: number
  monthlyPlan: number
  income: number
  necessaryExpense: number
  debtPayment: number
  upcomingExpense: number
}

type SavedGoal = GoalDraft & {
  id: number
}

const money = new Intl.NumberFormat("zh-TW", {
  currency: "TWD",
  maximumFractionDigits: 0,
  style: "currency",
})

const goalTypes = [
  { id: "emergency", label: "緊急預備金", hint: "先準備 3 個月必要生活費", icon: ShieldCheck },
  { id: "education", label: "孩子教育費", hint: "學費、補習、才藝或升學準備", icon: Flag },
  { id: "moving", label: "租屋或搬家", hint: "押金、家具、搬家與裝修", icon: CalendarDays },
  { id: "repayment", label: "還款準備", hint: "提前準備一次性還款或協商金", icon: PiggyBank },
  { id: "learning", label: "進修或證照", hint: "課程費、考照費與交通費", icon: Target },
  { id: "other", label: "其他生活目標", hint: "先用自己的話寫下來", icon: Plus },
]

const initialGoal: GoalDraft = {
  type: "emergency",
  name: "緊急預備金",
  targetAmount: 90000,
  currentAmount: 15000,
  deadlineMonths: 12,
  monthlyPlan: 5000,
  income: 42000,
  necessaryExpense: 26000,
  debtPayment: 6000,
  upcomingExpense: 2000,
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function PlanningTool({ initialMode = "goal" }: { initialMode?: PlanningMode }) {
  const [mode, setMode] = useState<PlanningMode>(() => {
    if (typeof window === "undefined") return initialMode

    return new URLSearchParams(window.location.search).get("mode") === "quick" ? "quick" : initialMode
  })
  const [goal, setGoal] = useState<GoalDraft>(initialGoal)
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>([
    {
      ...initialGoal,
      id: 1,
      name: "緊急預備金",
      currentAmount: 15000,
      targetAmount: 90000,
      monthlyPlan: 5000,
    },
  ])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setMode(params.get("mode") === "quick" || initialMode === "quick" ? "quick" : "goal")
  }, [initialMode])

  const selectedGoalType = goalTypes.find((item) => item.id === goal.type) ?? goalTypes[0]
  const SelectedGoalIcon = selectedGoalType.icon
  const progress = goal.targetAmount > 0 ? clampPercent((goal.currentAmount / goal.targetAmount) * 100) : 0
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)
  const requiredMonthly = goal.deadlineMonths > 0 ? Math.ceil(remaining / goal.deadlineMonths) : 0
  const monthsByCurrentPlan = goal.monthlyPlan > 0 ? Math.ceil(remaining / goal.monthlyPlan) : 0
  const monthlyCashLeft = goal.income - goal.necessaryExpense - goal.debtPayment - goal.upcomingExpense
  const canCoverTarget = monthlyCashLeft >= requiredMonthly
  const planGap = goal.monthlyPlan - requiredMonthly

  const resultTone = useMemo(() => {
    if (remaining === 0) {
      return {
        label: "已經達成",
        className: "border-emerald-200 bg-emerald-50 text-emerald-900",
        text: "這個目標已經準備完成，可以接著想這筆錢要不要分帳戶保留。",
      }
    }

    if (mode === "quick") {
      return {
        label: monthsByCurrentPlan > 0 ? `約 ${monthsByCurrentPlan} 個月` : "先填每月可存",
        className: "border-amber-200 bg-amber-50 text-amber-900",
        text:
          monthsByCurrentPlan > 0
            ? "這是快速試算結果，只看目標金額、目前已有與每月可存金額；若要看生活壓力，可以切換到生活目標規劃。"
            : "填入每月可存金額後，就能先估算大約多久可以達成。",
      }
    }

    if (requiredMonthly <= 0) {
      return {
        label: "先補期限",
        className: "border-amber-200 bg-amber-50 text-amber-900",
        text: "填入希望完成的時間後，就能估算每月需要準備多少。",
      }
    }

    if (canCoverTarget && planGap >= 0) {
      return {
        label: "目前可行",
        className: "border-emerald-200 bg-emerald-50 text-emerald-900",
        text: "照目前設定，每月準備金額大致能跟上目標，不過仍要留意臨時支出。",
      }
    }

    if (canCoverTarget) {
      return {
        label: "可以微調",
        className: "border-amber-200 bg-amber-50 text-amber-900",
        text: "家庭現金流看起來還有空間，但目前每月準備金額可能不足，可以調整時間或金額。",
      }
    }

    return {
      label: "壓力偏高",
      className: "border-rose-200 bg-rose-50 text-rose-900",
      text: "若硬要照這個時間完成，可能會壓縮生活費。可以延長時間、降低金額，或先把必要支出與債務一起整理。",
    }
  }, [canCoverTarget, mode, monthsByCurrentPlan, planGap, remaining, requiredMonthly])

  const updateGoalType = (type: string) => {
    const selected = goalTypes.find((item) => item.id === type)
    setGoal((current) => ({
      ...current,
      type,
      name: selected?.label ?? current.name,
    }))
  }

  const addGoal = () => {
    setSavedGoals((items) => [{ ...goal, id: Date.now() }, ...items])
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 rounded-2xl border border-border bg-card/90 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-sm font-semibold text-primary">生活目標財務規劃</p>
              <h1 className="text-2xl font-bold tracking-normal text-foreground sm:text-3xl">
                把想做的事，換算成每月可以準備的金額
              </h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                可以用完整規劃看生活承受度，也可以只做快速儲蓄試算。兩個入口會到同一頁，但會依照需求切到不同模式。
              </p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-6 text-muted-foreground lg:max-w-xs">
              從「儲蓄目標試算」進來會直接看到快速試算；從「生活目標財務規劃」進來會先看到引導式規劃。
            </div>
          </div>
        </section>

        <section className="mb-7 rounded-2xl border border-border bg-card/90 p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href="/toolbox/planning"
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === "goal" ? "border-primary bg-primary/10" : "border-border bg-background/70 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <span className="block text-base font-semibold text-foreground">我有一個生活目標</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                適合準備搬家、教育費、緊急預備金，也會一起看生活承受度。
              </span>
            </Link>
            <Link
              href="/toolbox/planning/quick"
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === "quick" ? "border-primary bg-primary/10" : "border-border bg-background/70 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <span className="block text-base font-semibold text-foreground">我只是想快速試算存錢</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                只填目標金額、目前已有與每月可存，先看大約多久能達成。
              </span>
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            {mode === "goal" ? (
              <Card className="border-border bg-card/90">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">先選一個目標</p>
                      <h2 className="text-xl font-semibold text-foreground">你想先準備哪一件事？</h2>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {goalTypes.map((type) => {
                      const Icon = type.icon
                      const selected = goal.type === type.id

                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => updateGoalType(type.id)}
                          className={`rounded-2xl border p-4 text-left transition-colors ${
                            selected ? "border-primary bg-primary/10" : "border-border bg-background/70 hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          <Icon className="mb-3 h-5 w-5 text-primary" />
                          <span className="block font-semibold text-foreground">{type.label}</span>
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">{type.hint}</span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card/90">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <PiggyBank className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">快速試算</p>
                      <h2 className="text-xl font-semibold text-foreground">先算這筆錢大概多久存得到</h2>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/75 p-4 text-sm leading-6 text-muted-foreground">
                    這個模式不需要先分類生活目標，也不會要求填收入支出。適合只是想快速知道：「我每月存這些，大概多久可以達成？」
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{mode === "goal" ? "輸入目標與目前狀況" : "輸入快速試算資料"}</p>
                    <h2 className="text-xl font-semibold text-foreground">{mode === "goal" ? "不用精準，先抓一個方向" : "只要三個數字就可以先估"}</h2>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {mode === "goal" ? (
                    <label className="grid gap-2 text-sm font-medium text-foreground">
                      目標名稱
                      <Input value={goal.name} onChange={(event) => setGoal({ ...goal, name: event.target.value })} />
                    </label>
                  ) : null}
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    目標金額
                    <Input
                      inputMode="numeric"
                      value={goal.targetAmount || ""}
                      onChange={(event) => setGoal({ ...goal, targetAmount: Number(event.target.value) || 0 })}
                      placeholder="例如：50000"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    目前已有
                    <Input
                      inputMode="numeric"
                      value={goal.currentAmount || ""}
                      onChange={(event) => setGoal({ ...goal, currentAmount: Number(event.target.value) || 0 })}
                      placeholder="例如：10000"
                    />
                  </label>
                  {mode === "goal" ? (
                    <label className="grid gap-2 text-sm font-medium text-foreground">
                      希望多久完成
                      <select
                        value={goal.deadlineMonths}
                        onChange={(event) => setGoal({ ...goal, deadlineMonths: Number(event.target.value) })}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus:border-primary"
                      >
                        <option value={3}>3 個月內</option>
                        <option value={6}>6 個月內</option>
                        <option value={12}>1 年內</option>
                        <option value={24}>2 年內</option>
                        <option value={36}>3 年內</option>
                        <option value={60}>5 年內</option>
                      </select>
                    </label>
                  ) : null}
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    每月可存
                    <Input
                      inputMode="numeric"
                      value={goal.monthlyPlan || ""}
                      onChange={(event) => setGoal({ ...goal, monthlyPlan: Number(event.target.value) || 0 })}
                      placeholder="例如：3000"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {mode === "goal" ? (
              <Card className="border-border bg-card/90">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">再看生活能不能承受</p>
                      <h2 className="text-xl font-semibold text-foreground">不要只看目標，也看接下來幾個月</h2>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-foreground">
                      每月收入
                      <Input inputMode="numeric" value={goal.income || ""} onChange={(event) => setGoal({ ...goal, income: Number(event.target.value) || 0 })} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-foreground">
                      每月必要支出
                      <Input inputMode="numeric" value={goal.necessaryExpense || ""} onChange={(event) => setGoal({ ...goal, necessaryExpense: Number(event.target.value) || 0 })} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-foreground">
                      每月債務還款
                      <Input inputMode="numeric" value={goal.debtPayment || ""} onChange={(event) => setGoal({ ...goal, debtPayment: Number(event.target.value) || 0 })} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-foreground">
                      近期會發生的大支出
                      <Input inputMode="numeric" value={goal.upcomingExpense || ""} onChange={(event) => setGoal({ ...goal, upcomingExpense: Number(event.target.value) || 0 })} />
                      <span className="text-xs leading-5 text-muted-foreground">例如保費、開學、醫療、搬家、家電或交通費。</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card className={`border ${resultTone.className}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{mode === "goal" ? "試算結果摘要" : "快速試算結果"}</p>
                    <h2 className="mt-1 text-2xl font-bold text-foreground">{resultTone.label}</h2>
                  </div>
                  <SelectedGoalIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="mt-3 text-sm leading-6">{resultTone.text}</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">{mode === "goal" ? "目前進度" : "還差多少"}</p>
                    <h2 className="text-xl font-semibold text-foreground">{mode === "goal" ? goal.name || selectedGoalType.label : "儲蓄目標試算"}</h2>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progress} className="h-3" />

                <div className="mt-5 grid gap-3">
                  <div className="rounded-xl border border-border bg-background/75 p-4">
                    <p className="text-sm text-muted-foreground">還需要準備</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{money.format(remaining)}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {mode === "goal" ? (
                      <div className="rounded-xl border border-border bg-background/75 p-4">
                        <p className="text-sm text-muted-foreground">期限內，每月約需</p>
                        <p className="mt-1 text-xl font-bold text-foreground">{money.format(requiredMonthly)}</p>
                      </div>
                    ) : null}
                    <div className="rounded-xl border border-border bg-background/75 p-4">
                      <p className="text-sm text-muted-foreground">照目前存法，約需要</p>
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {monthsByCurrentPlan > 0 ? `${monthsByCurrentPlan} 個月` : "待補"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {mode === "goal" ? (
              <Card className="border-border bg-card/90">
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-primary">生活壓力檢查</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">先看每月還剩多少空間</h2>
                  <div className="mt-4 rounded-xl border border-border bg-background/75 p-4">
                    <p className="text-sm text-muted-foreground">收入扣掉必要支出、債務與近期大支出後</p>
                    <p className={`mt-1 text-2xl font-bold ${monthlyCashLeft >= 0 ? "text-foreground" : "text-destructive"}`}>
                      {money.format(monthlyCashLeft)}
                    </p>
                  </div>
                  <div className="mt-4 rounded-xl border border-border bg-background/75 p-4 text-sm leading-6 text-muted-foreground">
                    {canCoverTarget
                      ? "這個金額目前看起來可以支應目標準備，但仍建議保留一點彈性，不要把每月剩餘全部存進同一個目標。"
                      : "如果目標很重要，可以先延長期限、降低每月準備金額，或回到記帳助理確認有哪些支出可以調整。"}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card/90">
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-primary">想再看仔細一點？</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">可以轉成生活目標</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    如果這筆錢會影響生活安排，可以切換成生活目標規劃，再補收入、支出與近期大支出。
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/toolbox/planning">
                      轉成生活目標規劃 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.78fr]">
          <Card className="border-border bg-card/90">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Flag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">我的生活目標</p>
                  <h2 className="text-xl font-semibold text-foreground">可以先放多個目標，再慢慢排序</h2>
                </div>
              </div>

              <div className="mb-4 flex justify-end">
                <Button type="button" onClick={addGoal}>
                  <Plus className="h-4 w-4" /> 加入目標清單
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {savedGoals.map((item) => {
                  const itemProgress = item.targetAmount > 0 ? clampPercent((item.currentAmount / item.targetAmount) * 100) : 0
                  const itemRemaining = Math.max(item.targetAmount - item.currentAmount, 0)

                  return (
                    <div key={item.id} className="rounded-2xl border border-border bg-background/75 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">每月準備 {money.format(item.monthlyPlan)}</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <Progress value={itemProgress} className="h-2" />
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        還差 {money.format(itemRemaining)}，希望 {item.deadlineMonths} 個月內完成。
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/90">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Save className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">保存到我的財務與生活</p>
                  <h2 className="text-xl font-semibold text-foreground">讓月報表一起看見目標</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                生活目標不一定是每月支出，但會影響可用現金與未來安排。保存後，之後可以在財務月報表與家庭財務全貌中一起檢視。
              </p>
              <SaveToProfilePrompt
                toolPath={`/toolbox/planning?mode=${mode}`}
                title="留下這次生活目標規劃"
                description="登入後可保存目標、每月準備金額與目前進度，之後回到我的財務與生活繼續更新。"
                buttonLabel="儲存生活目標"
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default function PlanningPage() {
  return <PlanningTool initialMode="goal" />
}
