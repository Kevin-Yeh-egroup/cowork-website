"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  Mic,
  NotebookPen,
  ReceiptText,
  Search,
  ShieldCheck,
  ShieldAlert,
  Users,
  Wrench,
} from "lucide-react"
import { AchievementSummary } from "@/components/achievement-summary"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { currentSocialWorkerId, type AchievementEventType } from "@/lib/achievements-data"
import {
  getAchievementState,
  recordAchievementEvent,
  resetUserAchievementState,
  type UserAchievementState,
} from "@/lib/achievements-service"
import { externalLinks } from "@/lib/external-links"

const resources = [
  {
    href: externalLinks.voiceToText,
    title: "語音轉文字",
    description: "將會談語音快速轉成文字紀錄",
    icon: Mic,
  },
  {
    href: externalLinks.financeScreening,
    title: "財務風險快篩",
    description: "協助社工快速掌握個案財務風險",
    icon: ShieldCheck,
  },
  {
    href: "/toolbox",
    title: "財務評估工具",
    description: "使用各項工具協助個案評估財務狀況",
    icon: Wrench,
  },
  {
    href: "/content/articles",
    title: "教育資源",
    description: "適合分享給個案的文章和教材",
    icon: BookOpen,
  },
  {
    href: "/events#social-worker",
    title: "社工培訓課程",
    description: "學習如何協助個案處理財務問題",
    icon: Calendar,
  },
]

const cases = [
  {
    id: "C-001",
    name: "林 O 芬",
    family: "單親家庭，2 名子女",
    status: "需要追蹤",
    risk: "中高風險",
    lastContact: "2026/05/03",
    note: "收入不穩，近期有信用卡循環與租金壓力。",
  },
  {
    id: "C-002",
    name: "陳 O 豪",
    family: "三代同住",
    status: "穩定輔導",
    risk: "中風險",
    lastContact: "2026/05/01",
    note: "主要壓力來自照顧支出，已開始記錄日常收支。",
  },
  {
    id: "C-003",
    name: "王 O 婷",
    family: "新住民家庭",
    status: "初評中",
    risk: "待快篩",
    lastContact: "2026/04/29",
    note: "需先完成風險快篩，釐清債務與詐騙疑慮。",
  },
  {
    id: "C-004",
    name: "張 O 明",
    family: "獨居長者",
    status: "密集追蹤",
    risk: "高風險",
    lastContact: "2026/05/04",
    note: "疑似遭遇投資詐騙，已安排下一次會談。",
  },
  {
    id: "C-005",
    name: "黃 O 珊",
    family: "雙薪家庭",
    status: "目標規劃",
    risk: "低風險",
    lastContact: "2026/04/26",
    note: "正在建立緊急預備金，需追蹤每月儲蓄進度。",
  },
]

const caseActions = [
  {
    label: "個案總覽",
    description: "查看家庭結構、財務狀態與服務摘要",
    icon: LayoutDashboard,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "會談紀錄",
    description: "記錄會談重點、服務目標與下次追蹤事項",
    icon: NotebookPen,
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    label: "風險快篩",
    description: "整理財務壓力、債務、詐騙與急迫需求",
    icon: ShieldAlert,
    color: "bg-destructive/10 text-destructive",
  },
  {
    label: "記帳紀錄",
    description: "查看個案收支紀錄與近期財務變化",
    icon: ReceiptText,
    color: "bg-secondary text-secondary-foreground",
  },
]

const caseOverviewTabs = ["個案總覽", "財務韌性", "詐騙防禦能力", "財務焦慮", "服務目標管理"]

const serviceStatuses = ["需要追蹤", "穩定輔導", "初評中", "密集追蹤", "目標規劃"]

const financeScreeningRecords = cases.reduce<Record<string, {
  date: string
  risk: string
  score: number | null
  summary: string
}[]>>((records, caseItem) => {
  records[caseItem.id] = [
    {
      date: caseItem.lastContact,
      risk: caseItem.risk,
      score: caseItem.risk === "待快篩" ? null : caseItem.risk === "低風險" ? 82 : caseItem.risk === "中風險" ? 64 : caseItem.risk === "中高風險" ? 48 : 32,
      summary: caseItem.risk === "待快篩" ? "尚未完成財務風險快篩。" : `最近一次快篩結果為${caseItem.risk}，建議依風險項目安排追蹤。`,
    },
  ]

  return records
}, {})

type CaseRecord = {
  status: string
  note: string
  history: {
    date: string
    type: string
    title: string
    status?: string
    risk?: string
    note: string
  }[]
}

const socialWorkerAchievementActions: {
  label: string
  eventType: AchievementEventType
  module: string
  metadata?: Record<string, string | number | boolean>
}[] = [
  {
    label: "登錄新個案",
    eventType: "case_created",
    module: "case_history",
    metadata: { case_status: "初評中" },
  },
  {
    label: "完成追蹤紀錄",
    eventType: "case_followup_completed",
    module: "case_history",
    metadata: { followup_type: "monthly" },
  },
  {
    label: "協助完成健檢",
    eventType: "case_health_check_assisted",
    module: "case_history",
    metadata: { assisted_item: "health_check" },
  },
  {
    label: "完成資源轉介",
    eventType: "case_referral_completed",
    module: "case_history",
    metadata: { referral_type: "welfare_resource" },
  },
  {
    label: "完成專業學習",
    eventType: "social_worker_learning_completed",
    module: "social_worker",
    metadata: { topic: "financial_counseling" },
  },
]

const initialCaseRecords = cases.reduce<Record<string, CaseRecord>>((records, caseItem) => {
  const latestScreening = financeScreeningRecords[caseItem.id][0]

  records[caseItem.id] = {
    status: caseItem.status,
    note: caseItem.note,
    history: [
      {
        date: latestScreening.date,
        type: "財務風險快篩",
        title: "完成快篩紀錄",
        risk: latestScreening.risk,
        note: latestScreening.summary,
      },
      {
        date: caseItem.lastContact,
        type: "個案簡述",
        title: "建立初始個案簡述",
        status: caseItem.status,
        note: caseItem.note,
      },
    ],
  }

  return records
}, {})

export default function SocialWorkerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isToolsCollapsed, setIsToolsCollapsed] = useState(false)
  const [caseRecords, setCaseRecords] = useState(initialCaseRecords)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [achievementState, setAchievementState] = useState<UserAchievementState | null>(null)
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(false)
  const [draftCaseRecord, setDraftCaseRecord] = useState({
    status: "",
    note: "",
  })
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredCases = cases.filter((caseItem) => {
    const caseRecord = caseRecords[caseItem.id]
    const latestScreening = financeScreeningRecords[caseItem.id][0]
    const searchableText = [
      caseItem.id,
      caseItem.name,
      caseItem.family,
      caseRecord.status,
      latestScreening.risk,
      caseRecord.note,
    ]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(normalizedSearchTerm)
  })
  const selectedCase = cases.find((caseItem) => caseItem.id === selectedCaseId) ?? null
  const selectedCaseRecord = selectedCase ? caseRecords[selectedCase.id] : null
  const selectedLatestScreening = selectedCase ? financeScreeningRecords[selectedCase.id][0] : null

  useEffect(() => {
    setAchievementState(getAchievementState(currentSocialWorkerId, "social_worker"))
  }, [])

  const openCaseOverview = (caseItem: (typeof cases)[number]) => {
    const caseRecord = caseRecords[caseItem.id]

    setSelectedCaseId(caseItem.id)
    setDraftCaseRecord({
      status: caseRecord.status,
      note: caseRecord.note,
    })
  }

  const saveCaseRecord = () => {
    if (!selectedCase) return

    const savedAt = new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

    setCaseRecords((currentRecords) => ({
      ...currentRecords,
      [selectedCase.id]: {
        ...draftCaseRecord,
        history: [
          {
            date: savedAt,
            type: "個案簡述",
            title: "更新個案簡述與服務狀態",
            status: draftCaseRecord.status,
            note: draftCaseRecord.note,
          },
          ...currentRecords[selectedCase.id].history,
        ],
      },
    }))
    setAchievementState(
      recordAchievementEvent({
        userId: currentSocialWorkerId,
        role: "social_worker",
        eventType: "case_note_created",
        module: "case_history",
        objectType: "case_note",
        objectId: `${selectedCase.id}-${Date.now()}`,
        caseId: selectedCase.id,
        metadata: {
          note_type: "case_summary",
          case_status: draftCaseRecord.status,
        },
      }),
    )
  }

  const recordSocialWorkerEvent = (action: (typeof socialWorkerAchievementActions)[number]) => {
    setAchievementState(
      recordAchievementEvent({
        userId: currentSocialWorkerId,
        role: "social_worker",
        eventType: action.eventType,
        module: action.module,
        metadata: action.metadata,
        caseId: selectedCase?.id,
      }),
    )
  }

  const resetSocialWorkerAchievements = () => {
    resetUserAchievementState(currentSocialWorkerId, "social_worker")
    setAchievementState(getAchievementState(currentSocialWorkerId, "social_worker"))
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">社工專區</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            為社工夥伴準備的資源和工具，幫助你更有效地協助個案
          </p>
        </div>

        <div className={`grid gap-6 lg:items-start ${isToolsCollapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[320px_1fr]"}`}>
          <aside className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-24">
            <div className={`mb-3 flex items-center ${isToolsCollapsed ? "justify-center" : "justify-between gap-3"}`}>
              {!isToolsCollapsed && <h2 className="text-lg font-semibold text-foreground">資源與工具</h2>}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsToolsCollapsed(!isToolsCollapsed)}
                aria-label={isToolsCollapsed ? "展開資源與工具" : "收合資源與工具"}
              >
                {isToolsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            <nav className="flex flex-col gap-2">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <Link
                    key={resource.title}
                    href={resource.href}
                    title={isToolsCollapsed ? resource.title : undefined}
                    className={`group flex rounded-lg p-3 transition-colors hover:bg-secondary focus:bg-secondary focus:outline-none ${
                      isToolsCollapsed ? "justify-center" : "items-start gap-3"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    {!isToolsCollapsed && (
                      <>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-foreground">{resource.title}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {resource.description}
                          </span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                    {isToolsCollapsed && (
                      <span className="sr-only">
                        {resource.title}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div className="min-w-0">
            {achievementState && (
              <section className="mb-10 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10">
                <button
                  type="button"
                  className="flex w-full flex-col gap-4 p-5 text-left md:flex-row md:items-center md:justify-between"
                  onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
                  aria-expanded={isAchievementsExpanded}
                >
                  <span className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Award className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="text-sm font-medium text-primary">社工成就與獎章</span>
                      <span className="mt-1 block text-xl font-semibold text-foreground">
                        {achievementState.currentTitle?.name ?? "陪伴歷程起步中"}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        已取得 {achievementState.earnedBadges.length} 枚獎章、完成{" "}
                        {achievementState.missions.reduce((total, mission) => total + mission.completedSteps, 0)} 個任務項目。
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground">
                    {isAchievementsExpanded ? "收合成就" : "展開成就"}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isAchievementsExpanded ? "rotate-180" : ""}`} />
                  </span>
                </button>

                {isAchievementsExpanded && (
                  <div className="border-t border-primary/10 p-5">
                    <AchievementSummary
                      title="社工服務成就"
                      description="集中查看社工稱號、服務獎章、追蹤任務與專業學習進度。"
                      badges={achievementState.badges}
                      missions={achievementState.missions}
                      currentTitle={achievementState.currentTitle}
                      nextTitle={achievementState.nextTitle}
                      recentEventCount={achievementState.events.length}
                      onReset={resetSocialWorkerAchievements}
                    />
                    <Card className="mt-4 border-border">
                      <CardContent className="p-5">
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold text-foreground">服務任務操作區</h2>
                          <p className="text-sm text-muted-foreground">
                            儲存個案簡述會自動記錄歷程事件，也可用下方操作補登本月服務任務。
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {socialWorkerAchievementActions.map((action) => (
                            <Button
                              key={action.label}
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => recordSocialWorkerEvent(action)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </section>
            )}

            <div className="mb-10 bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">社工工作提醒</h2>
              <p className="text-muted-foreground mb-4">
                若個案尚未使用系統，仍可先由社工建立會談紀錄與風險快篩，後續再邀請個案使用記帳或檢測工具補齊資料。
              </p>
              <Link
                href="/online-consultation/referral"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                聯繫支援團隊 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">個案數</p>
            </div>
            <p className="text-3xl font-bold text-primary">{cases.length}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">需優先追蹤</p>
            </div>
            <p className="text-3xl font-bold text-primary">2</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">本週會談</p>
            </div>
            <p className="text-3xl font-bold text-primary">4</p>
          </div>
            </div>

            {selectedCase && selectedCaseRecord && selectedLatestScreening ? (
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mb-3 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      onClick={() => setSelectedCaseId(null)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      回到個案列表
                    </Button>
                    <p className="text-sm font-medium text-primary mb-1">個案總覽</p>
                    <h2 className="text-xl font-semibold text-foreground">{selectedCase.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedCase.id} · {selectedCase.family} · 最近聯繫 {selectedCase.lastContact}
                    </p>
                  </div>
                  <div className="grid gap-3 md:min-w-[260px]">
                    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                      <p className="text-sm text-muted-foreground mb-2">目前服務狀態</p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-foreground">{selectedCaseRecord.status}</span>
                        <span className="rounded-full bg-card px-3 py-1 text-xs text-foreground">{selectedLatestScreening.risk}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 overflow-x-auto border-b border-border px-5">
                  {caseOverviewTabs.map((tab, index) => (
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

                <div className="grid gap-4 p-5 xl:grid-cols-[0.9fr_1.3fr]">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border p-5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Gauge className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-foreground mb-3">財務風險狀態</p>
                      <p className="text-3xl font-bold text-foreground mb-2">{selectedLatestScreening.risk}</p>
                      <p className="text-sm text-muted-foreground">
                        依個案最近一次財務風險快篩紀錄更新，社工不可手動覆寫。
                      </p>
                      <div className="mt-4 rounded-xl bg-secondary/50 p-3 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">最近快篩：{selectedLatestScreening.date}</p>
                        <p>{selectedLatestScreening.score === null ? "尚無分數" : `快篩分數 ${selectedLatestScreening.score} 分`}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground">
                      <span className="inline-flex rounded-full bg-background/20 px-3 py-1 text-xs font-medium mb-3">
                        社工視角
                      </span>
                      <h3 className="text-lg font-semibold mb-2">個案服務摘要</h3>
                      <p className="text-sm leading-relaxed text-primary-foreground/85">{selectedCaseRecord.note}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-border">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground mb-1">編輯個案簡述</h3>
                        <p className="text-sm text-muted-foreground mb-5">社工可調整服務狀態與簡述；風險狀態會由財務風險快篩紀錄同步更新。</p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="space-y-2">
                            <span className="text-sm font-medium text-foreground">服務狀態</span>
                            <select
                              value={draftCaseRecord.status}
                              onChange={(event) => setDraftCaseRecord({ ...draftCaseRecord, status: event.target.value })}
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              {serviceStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </label>
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-foreground">風險狀態</span>
                            <div className="flex h-10 items-center rounded-md border border-border bg-secondary/50 px-3 text-sm text-muted-foreground">
                              {selectedLatestScreening.risk}，來自 {selectedLatestScreening.date} 快篩
                            </div>
                          </div>
                        </div>
                        <label className="mt-4 block space-y-2">
                          <span className="text-sm font-medium text-foreground">個案簡述</span>
                          <Textarea
                            value={draftCaseRecord.note}
                            onChange={(event) => setDraftCaseRecord({ ...draftCaseRecord, note: event.target.value })}
                            className="min-h-32"
                            placeholder="輸入本次服務觀察、財務壓力來源或後續追蹤重點"
                          />
                        </label>
                        <div className="mt-5 flex justify-end">
                          <Button type="button" onClick={saveCaseRecord}>
                            儲存並留下紀錄
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-foreground mb-4">歷史紀錄</h3>
                        <div className="space-y-3">
                          {selectedCaseRecord.history.map((record, index) => (
                            <div key={`${record.date}-${index}`} className="rounded-xl border border-border p-4">
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-medium text-foreground">{record.date}</span>
                                <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">{record.type}</span>
                                {record.status && <span className="rounded-full bg-card px-2 py-1 text-xs text-foreground">{record.status}</span>}
                                {record.risk && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{record.risk}</span>}
                              </div>
                              <p className="mb-1 text-sm font-medium text-foreground">{record.title}</p>
                              <p className="text-sm leading-relaxed text-muted-foreground">{record.note}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
            ) : (
              <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">個案列表</h2>
              <p className="text-sm text-muted-foreground">快速進入個案總覽、會談紀錄、風險快篩與記帳紀錄。</p>
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="搜尋個案名稱、編號或關鍵字"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredCases.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  找不到符合「{searchTerm}」的個案，請換個關鍵字試試。
                </CardContent>
              </Card>
            )}

            {filteredCases.map((caseItem) => {
              const caseRecord = caseRecords[caseItem.id]
              const latestScreening = financeScreeningRecords[caseItem.id][0]

              return (
                <Card key={caseItem.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col xl:flex-row gap-6">
                      <div className="xl:w-72 shrink-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{caseItem.id}</p>
                            <h3 className="text-lg font-semibold text-foreground">{caseItem.name}</h3>
                          </div>
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                            {caseRecord.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{caseItem.family}</p>
                        <p className="text-sm text-foreground mb-2">風險狀態：{latestScreening.risk}</p>
                        <p className="text-sm text-muted-foreground mb-3">最近聯繫：{caseItem.lastContact}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{caseRecord.note}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {caseActions.map((action) => {
                          const Icon = action.icon
                          return (
                            <Button
                              key={`${caseItem.id}-${action.label}`}
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (action.label === "個案總覽") {
                                  openCaseOverview(caseItem)
                                }
                              }}
                              className="h-full min-h-28 min-w-0 items-start justify-start whitespace-normal p-4 text-left"
                            >
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                                <Icon className="h-5 w-5" />
                              </span>
                              <span className="min-w-0">
                                <span className="block font-medium text-foreground">{action.label}</span>
                                <span className="mt-2 block break-words text-sm text-muted-foreground font-normal leading-relaxed">
                                  {action.description}
                                </span>
                              </span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
            </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
