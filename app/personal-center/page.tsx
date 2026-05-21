"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  Calculator,
  ClipboardCheck,
  Heart,
  ShieldAlert,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react"
import { AchievementSummary } from "@/components/achievement-summary"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { currentMemberId, type AchievementEventType } from "@/lib/achievements-data"
import {
  getAchievementState,
  recordAchievementEvent,
  resetUserAchievementState,
  type UserAchievementState,
} from "@/lib/achievements-service"
import { getRoleHomePath, useDemoAuth } from "@/lib/demo-auth"

const emptyStateActions = [
  {
    href: "/assessment",
    title: "做檢測",
    description: "了解你的財務狀況",
    icon: ClipboardCheck,
  },
  {
    href: "/toolbox/accounting",
    title: "開始記帳",
    description: "追蹤你的收支",
    icon: Calculator,
  },
]

const profileStats = [
  { label: "財務韌性", value: "100 分", tone: "text-primary" },
  { label: "已訂閱文章", value: "40 篇", tone: "text-foreground" },
  { label: "最後更新", value: "2026/04/15", tone: "text-foreground" },
]

const overviewTabs = ["總覽", "財務韌性", "詐騙防禦能力", "財務焦慮", "夢想達成財務管理"]

const financeHighlights = [
  {
    title: "財務韌性",
    value: "100 分",
    description: "較上次 +0 分",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "詐騙防禦能力",
    value: "待檢測",
    description: "完成檢測後會顯示風險提醒",
    icon: ShieldAlert,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "財務焦慮",
    value: "待檢測",
    description: "了解金錢壓力對生活的影響",
    icon: Heart,
    color: "bg-accent/30 text-accent-foreground",
  },
]

const quickTopics = ["課程推薦", "關係與人際", "親密關係", "信貸", "同志領域", "詐騙", "手小孩領域", "關係人失蹤/死亡", "親子領域", "專案知能"]

const sections = [
  {
    title: "我的檢測紀錄",
    href: "/assessment",
    icon: ClipboardCheck,
  },
  {
    title: "我的財務變化",
    href: "/toolbox/accounting",
    icon: TrendingUp,
  },
  {
    title: "我的工具",
    href: "/toolbox",
    icon: Wrench,
  },
  {
    title: "我的訂閱文章",
    href: "/content/articles",
    icon: BookOpen,
  },
]

const learningTask = {
  id: "budget-habit",
  title: "建立記帳習慣的 5 個技巧",
  topic: "budget",
  category: "收支",
  readTime: "4 分鐘",
  content: [
    "先從每天一筆開始，不需要一開始就追求完整分類。",
    "把常見支出分成固定支出、彈性支出與臨時支出，月底比較容易回顧。",
    "每週花 5 分鐘看一次紀錄，找出下一週最想調整的一個地方。",
  ],
}

const externalActionCards = [
  {
    href: "/financial-resilience",
    title: "完成財務韌性檢測",
    description: "進入檢測頁完成所有題目後，才會記錄健檢事件並取得初次健檢章。",
    icon: ClipboardCheck,
  },
  {
    href: "/toolbox/accounting",
    title: "完成一筆記帳",
    description: "走完記帳助理的收入/支出、金額與備註步驟後，才會記錄記帳事件。",
    icon: Calculator,
  },
  {
    href: "/toolbox/simulator",
    title: "使用債務試算",
    description: "選擇貸款還款試算並輸入金額、利率與期數後，會推進債務看清章。",
    icon: Calculator,
  },
  {
    href: "/toolbox/planning",
    title: "建立財務目標",
    description: "走完目標規劃流程，設定金額與每月投入後，會取得目標起步章。",
    icon: TrendingUp,
  },
]

const seasonalTasks: {
  code: string
  title: string
  description: string
  placeholder: string
  eventType: AchievementEventType
}[] = [
  {
    code: "red_envelope_plan",
    title: "紅包準備任務",
    description: "輸入今年預計紅包總額，完成春節前的人情支出預算。",
    placeholder: "例如：6000",
    eventType: "red_envelope_plan_completed",
  },
  {
    code: "tax_ready_badge",
    title: "稅務安心任務",
    description: "寫下本次已整理的報稅資料，例如扣繳憑單、扶養或扣除額。",
    placeholder: "例如：扣繳憑單、醫療收據",
    eventType: "tax_ready_completed",
  },
  {
    code: "year_end_review_badge",
    title: "年末回顧任務",
    description: "記錄今年最想保留的一個財務整理收穫，完成年度回顧。",
    placeholder: "例如：每月固定回顧支出",
    eventType: "year_end_review_completed",
  },
]

export default function PersonalCenterPage() {
  const router = useRouter()
  const { authState, isReady } = useDemoAuth()
  const [achievementState, setAchievementState] = useState<UserAchievementState | null>(null)
  const [isLearningExpanded, setIsLearningExpanded] = useState(false)
  const [budgetDraft, setBudgetDraft] = useState({
    income: "",
    fixedExpense: "",
    flexibleExpense: "",
  })
  const [budgetCalculated, setBudgetCalculated] = useState(false)
  const [seasonalDraft, setSeasonalDraft] = useState<Record<string, string>>({})

  useEffect(() => {
    setAchievementState(getAchievementState(currentMemberId, "member"))
  }, [])

  useEffect(() => {
    if (!isReady) return

    if (!authState.isLoggedIn || !authState.role) {
      router.replace("/login")
      return
    }

    if (authState.role !== "member") {
      router.replace(getRoleHomePath(authState.role))
    }
  }, [authState, isReady, router])

  const resetMemberAchievements = () => {
    resetUserAchievementState(currentMemberId, "member")
    setAchievementState(getAchievementState(currentMemberId, "member"))
    setBudgetCalculated(false)
    setSeasonalDraft({})
  }

  const recordArticleRead = () => {
    setAchievementState(
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: "article_read",
        module: "knowledge_base",
        objectType: "article",
        objectId: learningTask.id,
        metadata: {
          topic: learningTask.topic,
          category: learningTask.category,
        },
      }),
    )
  }

  const recordArticleFavorite = () => {
    setAchievementState(
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: "article_favorited",
        module: "knowledge_base",
        objectType: "article",
        objectId: learningTask.id,
        metadata: {
          topic: learningTask.topic,
        },
      }),
    )
  }

  const calculateBudget = () => {
    if (!budgetDraft.income || !budgetDraft.fixedExpense || !budgetDraft.flexibleExpense) return

    setBudgetCalculated(true)
    setAchievementState(
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: "tool_used",
        module: "tool_library",
        objectType: "tool",
        objectId: "budget-planner",
        metadata: {
          tool_code: "budget",
          tool_category: "budgeting",
        },
      }),
    )
  }

  const saveBudgetResult = () => {
    if (!budgetCalculated) return

    setAchievementState(
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: "tool_result_saved",
        module: "tool_library",
        objectType: "tool_result",
        objectId: "budget-planner-result",
        metadata: {
          tool_code: "budget",
          has_goal_created: Number(budgetDraft.income) > Number(budgetDraft.fixedExpense) + Number(budgetDraft.flexibleExpense),
        },
      }),
    )
  }

  const completeSeasonalTask = (task: (typeof seasonalTasks)[number]) => {
    const note = seasonalDraft[task.code]?.trim()

    if (!note) return

    setAchievementState(
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: task.eventType,
        module: "seasonal_calendar",
        objectType: "seasonal_task",
        objectId: task.code,
        metadata: {
          task_code: task.code,
          note,
        },
      }),
    )
  }

  const monthlyBalance =
    Number(budgetDraft.income || 0) - Number(budgetDraft.fixedExpense || 0) - Number(budgetDraft.flexibleExpense || 0)

  if (!isReady || !authState.isLoggedIn || authState.role !== "member") {
    return (
      <div className="min-h-screen px-4 py-12">
        <Card className="mx-auto max-w-xl border-border">
          <CardContent className="p-6 text-center text-muted-foreground">正在確認登入狀態...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/20 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">個人中心</h1>
              <p className="text-muted-foreground mb-6">集中管理你的財務旅程、更新進度與重要提醒。</p>
              <div className="rounded-2xl bg-card/90 border border-border p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">一般民眾專屬</p>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">開始你的財務旅程</h2>
                    <p className="text-muted-foreground">
                      從檢測或記帳開始，我們會幫你追蹤進度，逐步整理財務狀態。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:w-56">
                    {emptyStateActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button key={action.href} asChild variant="secondary" className="justify-start">
                          <Link href={action.href}>
                            <Icon className="h-4 w-4" />
                            {action.title}
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border bg-card/95 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">一般使用者</h2>
                    <p className="text-sm text-muted-foreground">member@example.com</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {profileStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between rounded-full bg-secondary/60 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className={`font-semibold ${stat.tone}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex gap-6 overflow-x-auto border-b border-border px-5">
            {overviewTabs.map((tab, index) => (
              <button
                key={tab}
                className={`shrink-0 border-b-2 py-4 text-sm font-medium ${
                  index === 0 ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {financeHighlights.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="border-border">
                    <CardContent className="p-5">
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-foreground mb-3">{item.title}</p>
                      <p className="text-3xl font-bold text-foreground mb-2">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {achievementState && (
              <div className="space-y-4">
                <AchievementSummary
                  title="我的財務成長"
                  description="用事件紀錄追蹤獎章、任務與下一步財務行動。"
                  badges={achievementState.badges}
                  missions={achievementState.missions}
                  currentTitle={achievementState.currentTitle}
                  nextTitle={achievementState.nextTitle}
                  recentEventCount={achievementState.events.length}
                  onReset={resetMemberAchievements}
                />
                <Card className="border-border">
                  <CardContent className="p-5">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground">本月任務操作區</h2>
                      <p className="text-sm text-muted-foreground">完成實際操作後才會記錄事件，獎章卡片本身只負責顯示狀態。</p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {externalActionCards.map((action) => {
                        const Icon = action.icon

                        return (
                          <Link key={action.href} href={action.href} className="group rounded-2xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="block font-semibold text-foreground">{action.title}</span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{action.description}</span>
                            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                              前往操作 <ArrowRight className="h-4 w-4" />
                            </span>
                          </Link>
                        )
                      })}

                      <div className="rounded-2xl border border-border p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">閱讀任務：{learningTask.title}</h3>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {learningTask.readTime} · 展開文章、讀完重點後，再按完成閱讀。
                        </p>
                        {isLearningExpanded && (
                          <div className="mb-4 space-y-2 rounded-xl bg-secondary/50 p-3 text-sm leading-relaxed text-foreground">
                            {learningTask.content.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="secondary" size="sm" onClick={() => setIsLearningExpanded(!isLearningExpanded)}>
                            {isLearningExpanded ? "收合文章" : "展開文章"}
                          </Button>
                          <Button type="button" size="sm" disabled={!isLearningExpanded} onClick={recordArticleRead}>
                            我已讀完
                          </Button>
                          <Button type="button" variant="outline" size="sm" disabled={!isLearningExpanded} onClick={recordArticleFavorite}>
                            收藏文章
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">預算試算任務</h3>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">輸入本月收入與支出，完成試算後再儲存結果。</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <Input
                            type="number"
                            placeholder="收入"
                            value={budgetDraft.income}
                            onChange={(event) => setBudgetDraft({ ...budgetDraft, income: event.target.value })}
                          />
                          <Input
                            type="number"
                            placeholder="固定支出"
                            value={budgetDraft.fixedExpense}
                            onChange={(event) => setBudgetDraft({ ...budgetDraft, fixedExpense: event.target.value })}
                          />
                          <Input
                            type="number"
                            placeholder="彈性支出"
                            value={budgetDraft.flexibleExpense}
                            onChange={(event) => setBudgetDraft({ ...budgetDraft, flexibleExpense: event.target.value })}
                          />
                        </div>
                        {budgetCalculated && (
                          <div className="mt-3 rounded-xl bg-secondary/50 p-3 text-sm text-foreground">
                            本月預估結餘：
                            <span className={monthlyBalance >= 0 ? "font-semibold text-primary" : "font-semibold text-destructive"}>
                              {" "}${monthlyBalance.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={!budgetDraft.income || !budgetDraft.fixedExpense || !budgetDraft.flexibleExpense}
                            onClick={calculateBudget}
                          >
                            完成試算
                          </Button>
                          <Button type="button" size="sm" disabled={!budgetCalculated} onClick={saveBudgetResult}>
                            儲存結果
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border p-4 lg:col-span-2">
                        <div className="mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">生活財務行事曆任務</h3>
                        </div>
                        <div className="grid gap-3 lg:grid-cols-3">
                          {seasonalTasks.map((task) => (
                            <div key={task.code} className="rounded-xl bg-secondary/40 p-3">
                              <p className="font-medium text-foreground">{task.title}</p>
                              <p className="mt-1 min-h-12 text-sm leading-relaxed text-muted-foreground">{task.description}</p>
                              <Input
                                className="mt-3"
                                placeholder={task.placeholder}
                                value={seasonalDraft[task.code] ?? ""}
                                onChange={(event) =>
                                  setSeasonalDraft({
                                    ...seasonalDraft,
                                    [task.code]: event.target.value,
                                  })
                                }
                              />
                              <Button
                                type="button"
                                size="sm"
                                className="mt-3 w-full"
                                disabled={!seasonalDraft[task.code]?.trim()}
                                onClick={() => completeSeasonalTask(task)}
                              >
                                完成任務
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Link href="/toolbox/accounting" className="group block rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-background/20 px-3 py-1 text-xs font-medium mb-3">全新上線</span>
                  <h2 className="text-xl font-semibold mb-2">財務生活記帳助理</h2>
                  <p className="text-sm text-primary-foreground/85">
                    AI 輔助的個人記帳體驗，自動分析收支模式，讓財務管理更輕鬆。
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">我的訂閱文章</h2>
                    <p className="text-sm text-muted-foreground">已訂閱 40 個標籤，顯示最新 8 篇文章</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Bell className="h-4 w-4" />
                    管理訂閱
                  </Button>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-sm font-medium text-foreground mb-3">快速查看你關注的主題</p>
                  <div className="flex flex-wrap gap-2">
                    {quickTopics.map((topic) => (
                      <span key={topic} className="rounded-full bg-card px-3 py-1 text-xs text-foreground">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section) => {
              const Icon = section.icon
              return (
                  <Link key={section.title} href={section.href} className="group">
                    <Card className="h-full border-border transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          查看 <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
              )
            })}
          </div>
          </div>
        </section>
      </div>
    </div>
  )
}
