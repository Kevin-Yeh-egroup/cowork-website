"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Cloud,
  Download,
  FileSpreadsheet,
  ListChecks,
  Printer,
  ReceiptText,
  User,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const memberMenuItems = [
  {
    href: "#member-recent-actions",
    title: "最近接續整理",
    description: "回到上次留下的地方",
    icon: User,
  },
  {
    href: "#member-accounting",
    title: "我的財務紀錄",
    description: "記帳、試算與工具資料",
    icon: Calculator,
  },
  {
    href: "#member-monthly-report",
    title: "財務月報表",
    description: "現金流、債務與匯出",
    icon: ReceiptText,
  },
  {
    href: "#member-data-summary",
    title: "家庭財務全貌",
    description: "收入、支出、債務與保障",
    icon: ListChecks,
  },
  {
    href: "#member-articles",
    title: "我的訂閱內容",
    description: "主題、文章與收藏",
    icon: BookOpen,
  },
]

const quickTopics = ["課程推薦", "關係與人際", "親密關係", "信貸", "同志領域", "詐騙", "親子領域", "專案知能"]

const recentActions = [
  { title: "信用卡試算", summary: "未繳金額 80,000 元，已試算還款時間", updatedAt: "今天 09:20", href: "/toolbox/credit-card" },
  { title: "記帳紀錄", summary: "本週已記 5 筆，餐飲與交通支出較常出現", updatedAt: "昨天 21:10", href: "/toolbox/accounting" },
  { title: "房貸負擔整理", summary: "已填寫必要生活費與買房準備預算", updatedAt: "6/28", href: "/toolbox/mortgage" },
]

const dataProgressItems = [
  { label: "家庭成員", value: "已填", description: "家庭人數、扶養或照顧對象" },
  { label: "收入來源", value: "待補", description: "薪資、兼職、補助或家人支持" },
  { label: "每月支出", value: "待補", description: "必要生活費、固定支出與彈性支出" },
  { label: "債務與貸款", value: "部分已填", description: "信用卡、信貸、房貸、車貸或其他債務" },
  { label: "儲蓄與預備金", value: "待補", description: "存款、緊急預備金與可動用資金" },
  { label: "保險與風險", value: "待補", description: "醫療、壽險、失能、照顧與突發風險" },
  { label: "資產與投資", value: "待補", description: "房產、投資、退休金或其他資產" },
  { label: "生活目標", value: "待補", description: "還款、買房、育兒、退休或其他目標" },
]

const missingDataItems = ["收入來源", "每月必要支出", "儲蓄與預備金", "保險與風險", "生活目標"]

const changeReminders = [
  {
    title: "家庭成員資料有變動",
    description: "若近期有新生兒、同住家人變動或家人離世，建議同步更新必要支出、保險與照顧責任。",
    action: "更新家庭成員",
  },
  {
    title: "收入來源待重新確認",
    description: "收入資料超過 3 個月未更新，建議確認薪資、兼職、補助或家人支持是否有變化。",
    action: "確認收入來源",
  },
  {
    title: "月現金流仍為正數",
    description: "目前月現金流為正，但若育兒、照顧或貸款支出增加，建議重新檢查下個月現金流。",
    action: "查看月報表",
  },
]

const savedToolRecords = [
  {
    title: "記帳工具",
    status: "登入前可先記，登入後保存到個人資料",
    detail: "目前暫存 3 筆，可同步到我的財務與生活。",
    href: "/toolbox/accounting",
  },
  {
    title: "信用卡工具",
    status: "已保存上次試算",
    detail: "可回來修改未繳金額、利率或每月還款金額。",
    href: "/toolbox/credit-card",
  },
  {
    title: "房貸與新青安",
    status: "家庭負擔資料待補",
    detail: "補上家庭成員與生活費後，能看見更完整的負擔輪廓。",
    href: "/toolbox/mortgage",
  },
]

const monthlyReportSummary = [
  { label: "本月收入", value: "$58,000", description: "薪資與其他收入" },
  { label: "本月支出", value: "$49,200", description: "生活費、帳單與貸款" },
  { label: "月現金流", value: "+$8,800", description: "收入扣除支出後仍為正數" },
  { label: "債務月付", value: "$16,500", description: "信用卡、信貸與房貸" },
]

const monthlyReportSources = [
  {
    title: "記帳工具",
    status: "已帶入本月 5 筆",
    affects: "收入、生活支出、分類支出",
    action: "繼續記帳",
    href: "/toolbox/accounting",
  },
  {
    title: "信用卡工具",
    status: "已保存 1 筆試算",
    affects: "未繳金額、每月還款、利息壓力",
    action: "更新信用卡資料",
    href: "/toolbox/credit-card",
  },
  {
    title: "貸款工具",
    status: "信貸與車貸待補",
    affects: "債務月付、剩餘本金、還款壓力",
    action: "補上貸款資料",
    href: "/toolbox/personal-loan",
  },
  {
    title: "房貸與新青安",
    status: "已帶入家庭負擔",
    affects: "房貸月付、買房預算、長期負擔",
    action: "更新房貸資料",
    href: "/toolbox/mortgage",
  },
  {
    title: "家庭財務全貌",
    status: "必要支出待補",
    affects: "家庭人數、照顧責任、必要生活費",
    action: "補家庭財務資料",
    href: "/personal-center#member-data-summary",
  },
]

const lifeProfileItems = [
  { label: "家庭成員", status: "已填 2/4", description: "本人、同住家人、扶養或照顧對象", href: "/personal-center#member-data-summary" },
  { label: "收入來源", status: "待補", description: "薪資、兼職、補助或家人支持", href: "/personal-center#member-data-summary" },
  { label: "每月必要支出", status: "待補", description: "食、衣、住、行、育、樂、通訊、保險", href: "/personal-center#member-data-summary" },
  { label: "照顧責任", status: "已填 1/3", description: "家人生活費、醫療、長照或育兒支出", href: "/personal-center#member-data-summary" },
]

const subscriptionGroups = [
  { title: "電子報", value: "已訂閱", description: "可接收最新文章、活動與家庭財務整理提醒。" },
  { title: "已訂閱主題", value: "10 個", description: "包含信貸、詐騙、親子、關係與人際等主題。" },
  { title: "最新內容", value: "8 篇", description: "依照訂閱主題整理最近更新文章。" },
  { title: "已收藏", value: "3 篇", description: "想回頭再看的文章會集中保存在這裡。" },
]

const subscriptionArticles = [
  { title: "建立記帳習慣的 5 個技巧", topic: "收支整理", href: "/content/articles" },
  { title: "信用卡循環利息要怎麼看", topic: "信貸與卡債", href: "/content/articles" },
  { title: "遇到疑似詐騙時先做這幾件事", topic: "詐騙防禦", href: "/content/articles" },
]

export default function PersonalCenterPage() {
  const router = useRouter()
  const { authState, isReady } = useDemoAuth()

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
          <div className="rounded-2xl bg-card/90 border border-border p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-primary mb-2">我的財務與生活</p>
                <h1 className="text-3xl font-bold text-foreground mb-2">回來接續整理你的財務生活</h1>
                <p className="max-w-3xl text-muted-foreground">
                  你在工具中填過的資料、看過的內容與補上的家庭生活資訊，都會慢慢累積成更完整的個人紀錄。
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:min-w-56">
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
        </section>

        <section className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
          <aside className="rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-24">
            <div className="mb-4">
              <p className="text-sm font-medium text-primary">一般會員</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">我的財務與生活</h2>
            </div>
            <nav className="space-y-1">
              {memberMenuItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-secondary/70"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                    </span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="space-y-4">
              <Card id="member-recent-actions" className="scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">最近接續整理</h2>
                      <p className="text-sm text-muted-foreground">回來後不用從頭開始，可以從上次留下的資料繼續。</p>
                    </div>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {recentActions.map((action) => (
                      <Link key={action.title} href={action.href} className="group rounded-2xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                        <span className="block text-sm font-medium text-primary">{action.updatedAt}</span>
                        <span className="mt-2 block font-semibold text-foreground">{action.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{action.summary}</span>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                          接著整理 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card id="member-accounting" className="scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">我的財務紀錄</h2>
                      <p className="text-sm text-muted-foreground">
                        外層工具可以先使用；登入後可以保存到這裡，下次換手機或電腦也能接續查看。
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link href="/toolbox/accounting">
                        今天記一筆 <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <div className="flex gap-3">
                      <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">未登入可暫存在這台裝置，登入後才會保存到帳號</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          如果只是暫存在瀏覽器，換裝置就看不到；登入後保存，資料才會進入「我的財務與生活」並支援跨裝置接續。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-3">
                    {savedToolRecords.map((record) => (
                      <Link key={record.title} href={record.href} className="group rounded-2xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                        <span className="block font-semibold text-foreground">{record.title}</span>
                        <span className="mt-2 block text-sm font-medium text-primary">{record.status}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{record.detail}</span>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                          查看或修改 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card id="member-monthly-report" className="scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">財務月報表</h2>
                      <p className="text-sm text-muted-foreground">
                        把記帳、試算與家庭資料彙整成每月報表，看見月現金流是正數或負數。
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="inline-flex rounded-full border border-border bg-background p-1">
                        <button type="button" className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                          只看我自己
                        </button>
                        <button type="button" className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground">
                          包含家庭一起看
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          <FileSpreadsheet className="h-4 w-4" />
                          Excel
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          <Printer className="h-4 w-4" />
                          列印
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {monthlyReportSummary.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-border p-4">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="font-semibold text-foreground">補齊月報表資料</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      月報表會從各項財務工具帶入數字。資料不完整時，可以直接回到對應工具補上。
                    </p>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {monthlyReportSources.map((source) => (
                        <Link key={source.title} href={source.href} className="group rounded-2xl bg-card/90 p-4 transition-colors hover:bg-card">
                          <div className="flex gap-3">
                            <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <p className="font-semibold text-foreground">{source.title}</p>
                              <p className="mt-1 text-sm font-medium text-primary">{source.status}</p>
                              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">會影響：{source.affects}</p>
                              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                                {source.action} <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="member-data-summary" className="scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_220px] lg:items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">家庭財務全貌</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        這裡會整理家庭成員、收入、支出、債務、儲蓄、保險風險與生活目標，幫你看見比較完整的家庭財務樣貌。
                      </p>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                      <p className="text-sm font-medium text-primary">家庭財務完整度</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">45%</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                        <div className="h-full w-[45%] rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {dataProgressItems.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-border p-4">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                    <p className="font-semibold text-foreground">建議優先補上</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {missingDataItems.map((item) => (
                        <Link
                          key={item}
                          href="/personal-center#member-data-summary"
                          className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="font-semibold text-foreground">目前整理出的生活輪廓</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      目前已知道你近期關注債務與房貸壓力，並有固定家庭支出。若再補上收入來源與每月必要支出，後續建議會更貼近你的情況。
                    </p>
                  </div>
                  <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                    <div className="mb-3">
                      <p className="font-semibold text-foreground">近期變化與提醒</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        當家庭成員、收入或支出改變時，系統會提醒你哪些資料也需要跟著更新；右下角 AI 也可以依這些變化給更貼近的建議。
                      </p>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {changeReminders.map((item) => (
                        <Link key={item.title} href="/personal-center#member-data-summary" className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                            {item.action} <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {lifeProfileItems.map((item) => (
                      <Link key={item.label} href={item.href} className="group rounded-2xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                        <p className="text-sm font-medium text-primary">{item.status}</p>
                        <p className="mt-2 text-lg font-semibold text-foreground">{item.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                          補資料 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card id="member-articles" className="scroll-mt-24 border-border">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">我的訂閱內容</h2>
                    <p className="text-sm text-muted-foreground">集中查看訂閱主題、最新文章與已收藏內容。</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Bell className="h-4 w-4" />
                    管理訂閱
                  </Button>
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                  {subscriptionGroups.map((group) => (
                    <div key={group.title} className="rounded-2xl border border-border p-4">
                      <p className="text-sm text-muted-foreground">{group.title}</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">{group.value}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-secondary/50 p-4">
                  <p className="text-sm font-medium text-foreground mb-3">已訂閱主題</p>
                  <div className="flex flex-wrap gap-2">
                    {quickTopics.map((topic) => (
                      <span key={topic} className="rounded-full bg-card px-3 py-1 text-xs text-foreground">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {subscriptionArticles.map((article) => (
                    <Link key={article.title} href={article.href} className="group rounded-2xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                      <span className="text-sm font-medium text-primary">{article.topic}</span>
                      <p className="mt-2 font-semibold leading-snug text-foreground">{article.title}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        查看文章 <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </div>
    </div>
  )
}
