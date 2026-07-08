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
    title: "下一步",
    description: "今天可以接著做",
    icon: User,
  },
  {
    href: "#member-accounting",
    title: "我的財務紀錄",
    description: "已保存的資料櫃",
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

const nextStepTasks = [
  {
    title: "繼續補信用卡資料",
    summary: "還差每月想還多少與是否有其他卡債。",
    status: "還差 2 個欄位",
    effort: "約 3 分鐘",
    href: "/toolbox/credit-card",
  },
  {
    title: "回到上次記帳",
    summary: "本週已完成 5 筆，今天先記一筆收入或支出就好。",
    status: "可接續",
    effort: "約 1 分鐘",
    href: "/toolbox/accounting",
  },
  {
    title: "補家庭房貸資料",
    summary: "還差生活費資料，補上後比較能看出每月壓力。",
    status: "還差生活費",
    effort: "之後也可以",
    href: "/toolbox/mortgage",
  },
  {
    title: "看看緊急預備金",
    summary: "目前約完成 54%，這個月有餘裕再放一點就好。",
    status: "正在前進",
    effort: "不用急",
    href: "/toolbox/planning",
  },
]

const dataProgressItems = [
  { label: "家庭成員", value: "已整理", description: "家庭人數、扶養或照顧對象" },
  { label: "收入來源", value: "下次可補", description: "薪資、兼職、補助或家人支持" },
  { label: "每月支出", value: "慢慢累積", description: "必要生活費、固定支出與彈性支出" },
  { label: "債務與貸款", value: "已整理一部分", description: "信用卡、信貸、房貸、車貸或其他債務" },
  { label: "儲蓄與預備金", value: "正在前進", description: "存款、緊急預備金與可動用資金" },
  { label: "保險與風險", value: "有空再看", description: "醫療、壽險、失能、照顧與突發風險" },
  { label: "資產與投資", value: "之後再補", description: "房產、投資、退休金或其他資產" },
  { label: "生活目標", value: "已開始", description: "還款、買房、育兒、退休或其他目標" },
]

const gentleNextTopics = ["收入來源", "每月必要支出", "預備金", "生活目標"]

const familySummaryItems = [
  { label: "家庭成員", value: "3 人", description: "本人、配偶與 1 名子女" },
  { label: "收入來源", value: "2 個", description: "薪資收入與兼職收入" },
  { label: "主要壓力", value: "債務還款", description: "信用卡與房貸需要一起看" },
  { label: "正在準備", value: "教育費", description: "孩子教育與緊急預備金" },
]

const familyChangeItems = [
  { label: "財務完整度", before: "25%", after: "45%", description: "比上次多補了房貸與記帳資料" },
  { label: "緊急預備金", before: "$0", after: "$70,000", description: "已開始累積第一階段預備金" },
  { label: "債務資料", before: "1 筆", after: "3 筆", description: "信用卡、房貸與家庭支出已開始串起來" },
]

const changeReminders = [
  {
    title: "孩子教育支出可能快變動",
    description: "若近期有開學、升學或補習安排，可以先把教育費放進生活目標或每月支出裡。",
    action: "整理教育費",
    href: "/toolbox/planning",
  },
  {
    title: "收入資料已 3 個月未更新",
    description: "如果近期有加班、轉職、兼職或補助變動，月報表和 AI 建議也會跟著更準。",
    action: "更新收入",
    href: "/toolbox/accounting",
  },
  {
    title: "房貸利率或月付可再確認",
    description: "如果最近利率調整、寬限期快結束，建議回到房貸工具重看下個月的負擔。",
    action: "查看月報表",
    href: "/toolbox/mortgage",
  },
]

const savedFinancialRecords = [
  {
    title: "收入",
    source: "來自：記帳工具、房貸家庭收入欄位",
    updatedAt: "最近更新：昨天",
    count: "已整理 2 個來源",
    detail: "薪資收入與兼職收入已可帶入月報表。",
    href: "/toolbox/accounting",
  },
  {
    title: "支出",
    source: "來自：記帳工具、房貸家庭負擔資料",
    updatedAt: "最近更新：昨天",
    count: "已保存 5 筆",
    detail: "餐飲、交通、帳單與貸款月付已開始累積。",
    href: "/toolbox/accounting",
  },
  {
    title: "資產",
    source: "來自：目標規劃、未來資產盤點",
    updatedAt: "持續整理",
    count: "已建立 1 個目標",
    detail: "緊急預備金已完成約 54%，之後可加入存款、房產或其他資產。",
    href: "/toolbox/planning",
  },
  {
    title: "負債",
    source: "來自：信用卡試算、債務盤點、房貸與新青安",
    updatedAt: "最近更新：今天",
    count: "已整理 3 筆",
    detail: "信用卡、房貸與其他債務會一起帶入月報表與家庭全貌。",
    href: "/toolbox/debt",
  },
]

const monthlyReportSummary = [
  { label: "本月收入", value: "$58,000", description: "薪資與其他收入" },
  { label: "本月支出", value: "$49,200", description: "生活費、帳單與貸款" },
  { label: "本月儲蓄", value: "$3,000", description: "可先放進緊急預備金" },
  { label: "月現金流", value: "+$8,800", description: "收入扣除支出後仍為正數" },
  { label: "債務月付", value: "$16,500", description: "信用卡、信貸與房貸" },
]

const monthlyReportSections = [
  {
    title: "收入明細",
    summary: "先列出這個月已保存的收入來源。",
    rows: [
      { name: "薪資收入", amount: "$42,000", note: "來自記帳助理" },
      { name: "兼職收入", amount: "$10,000", note: "來自記帳助理" },
      { name: "其他收入", amount: "$6,000", note: "可再確認是否固定" },
    ],
  },
  {
    title: "支出明細",
    summary: "把生活支出與固定支出分開看，比較容易知道哪裡能調整。",
    rows: [
      { name: "食、交通與日常生活", amount: "$18,700", note: "來自記帳助理" },
      { name: "房租、水電與通訊", amount: "$14,000", note: "固定支出" },
      { name: "保險與照顧支出", amount: "$0", note: "尚未補齊" },
    ],
  },
  {
    title: "儲蓄與預備金",
    summary: "看本月是否有餘裕留給未來，不用每個月都完美。",
    rows: [
      { name: "本月可儲蓄", amount: "$3,000", note: "可放入緊急預備金" },
      { name: "緊急預備金累積", amount: "$70,000", note: "約完成 54%" },
      { name: "生活目標準備金", amount: "$0", note: "可之後再補" },
    ],
  },
  {
    title: "負債月付",
    summary: "只放每月會影響現金流的金額，細項回到債務盤點看。",
    rows: [
      { name: "信用卡還款", amount: "$4,500", note: "來自信用卡工具" },
      { name: "房貸或新青安", amount: "$12,000", note: "來自房貸工具" },
      { name: "其他貸款", amount: "$0", note: "尚未補齊" },
    ],
  },
  {
    title: "資產與負債總覽",
    summary: "總額先放在月報表，細項之後回到資產盤點或債務盤點看。",
    rows: [
      { name: "資產總額", amount: "$70,000", note: "目前以可動用資金為主" },
      { name: "負債總額", amount: "$1,380,000", note: "含信用卡與房貸" },
      { name: "淨資產", amount: "-$1,310,000", note: "之後可隨資料補齊更新" },
    ],
  },
]

const monthlyDataSources = ["記帳助理", "債務盤點表", "信用卡工具", "房貸與新青安工具", "生活目標財務規劃"]

const monthlyMissingItems = ["保險保障", "資產與投資", "部分固定支出"]

const lifeProfileItems = [
  { label: "家庭成員", status: "已填 2/4", description: "本人、同住家人、扶養或照顧對象", href: "/personal-center#member-data-summary" },
  { label: "收入來源", status: "下次可補", description: "薪資、兼職、補助或家人支持", href: "/personal-center#member-data-summary" },
  { label: "每月必要支出", status: "慢慢累積", description: "食、衣、住、行、育、樂、通訊、保險", href: "/personal-center#member-data-summary" },
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

    if (authState.isLoggedIn && authState.role && authState.role !== "member") {
      router.replace(getRoleHomePath(authState.role))
    }
  }, [authState, isReady, router])

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

        <style>{`
          .member-panel {
            display: none;
          }

          .member-panels:has(.member-panel:target) > .member-panel:target {
            display: block;
          }

          .member-panels:not(:has(.member-panel:target)) > #member-recent-actions {
            display: block;
          }

          .member-shell:not(:has(.member-panel:target)) .member-nav-link[href="#member-recent-actions"],
          .member-shell:has(#member-recent-actions:target) .member-nav-link[href="#member-recent-actions"],
          .member-shell:has(#member-accounting:target) .member-nav-link[href="#member-accounting"],
          .member-shell:has(#member-monthly-report:target) .member-nav-link[href="#member-monthly-report"],
          .member-shell:has(#member-data-summary:target) .member-nav-link[href="#member-data-summary"],
          .member-shell:has(#member-articles:target) .member-nav-link[href="#member-articles"] {
            background: hsl(var(--primary) / 0.1);
          }
        `}</style>

        <section className="member-shell grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
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
                    className="member-nav-link flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-secondary/70"
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

          <div className="member-panels space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <Card id="member-recent-actions" className="member-panel scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary">今天要做什麼？</p>
                      <h2 className="mt-1 text-2xl font-semibold text-foreground">下一步</h2>
                      <p className="mt-1 text-sm text-muted-foreground">上次做到這裡，今天可以挑一件最順手的事繼續。</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                      還有 4 件事情可以慢慢完成
                    </div>
                  </div>

                  <div className="space-y-3">
                    {nextStepTasks.map((task, index) => (
                      <Link key={task.title} href={task.href} className="group flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/40 hover:bg-primary/10 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                            {index + 1}
                          </span>
                          <span>
                            <span className="block font-semibold text-foreground">{task.title}</span>
                            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{task.summary}</span>
                            <span className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-primary">{task.status}</span>
                              <span className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">{task.effort}</span>
                            </span>
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all group-hover:gap-2 sm:self-center">
                          繼續整理 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
            </Card>

            <Card id="member-accounting" className="member-panel scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary">以前做過什麼？</p>
                      <h2 className="mt-1 text-2xl font-semibold text-foreground">我的財務紀錄</h2>
                      <p className="mt-1 text-sm text-muted-foreground">以前整理過的資料都先放在這裡，需要時可以回來查看或修改。</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
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

                  <div className="grid gap-3 lg:grid-cols-2">
                    {savedFinancialRecords.map((record) => (
                      <Link key={record.title} href={record.href} className="group rounded-2xl border border-border bg-background/60 p-4 transition-colors hover:border-primary/30 hover:bg-card">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="block text-lg font-semibold text-foreground">{record.title}</span>
                            <span className="mt-1 block text-sm text-muted-foreground">{record.source}</span>
                          </div>
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{record.count}</span>
                        </div>
                        <div className="mt-4 rounded-2xl border border-border bg-card p-3">
                          <p className="text-sm font-medium text-foreground">{record.updatedAt}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{record.detail}</p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-all group-hover:gap-2 group-hover:text-primary">
                          查看資料 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
            </Card>

            <Card id="member-monthly-report" className="member-panel scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary">我的報告書</p>
                      <h2 className="mt-1 text-2xl font-semibold text-foreground">我的財務月報表</h2>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        這份報表會整理你在記帳、債務盤點、信用卡、房貸等工具留下的資料。先看目前已有的版本，之後資料越完整，報表也會越接近真實生活。
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

                  <div className="mb-4 rounded-2xl border border-border bg-background/75 p-4">
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">目前可產出的完整月報表</p>
                        <p className="text-sm text-muted-foreground">資料不足的地方先標出來，不需要在這裡重新填一次。</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">初步版</span>
                    </div>
                    <div className="space-y-3">
                      {monthlyReportSections.map((section) => (
                        <details key={section.title} className="group overflow-hidden rounded-2xl border border-border bg-card open:border-primary/30" open={section.title === "收入明細" || section.title === "支出明細"}>
                          <summary className="flex cursor-pointer list-none flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                              <span className="block font-semibold text-foreground">{section.title}</span>
                              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{section.summary}</span>
                            </span>
                            <span className="text-sm font-medium text-primary">展開 / 收合</span>
                          </summary>
                          <div className="border-t border-border">
                            {section.rows.map((row) => (
                              <div key={`${section.title}-${row.name}`} className="grid gap-2 border-b border-border p-4 last:border-b-0 sm:grid-cols-[1fr_120px_180px] sm:items-center">
                                <p className="font-medium text-foreground">{row.name}</p>
                                <p className="font-semibold text-foreground">{row.amount}</p>
                                <p className="text-sm text-muted-foreground">{row.note}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="font-semibold text-foreground">資料來源</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        月報表會從已保存的工具資料帶入，不用在這裡重新填一次。
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {monthlyDataSources.map((source) => (
                          <span key={source} className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/75 p-4">
                      <p className="font-semibold text-foreground">目前尚缺</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        補齊後，月報表和家庭全貌會更貼近真實狀況。
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {monthlyMissingItems.map((item) => (
                          <span key={item} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                            {item}
                          </span>
                        ))}
                      </div>
                      <Button asChild variant="link" size="sm" className="mt-3 px-0 text-primary">
                        <Link href="/personal-center#member-accounting">
                          回到財務紀錄補資料 <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <div className="grid gap-3 lg:grid-cols-[1fr_240px] lg:items-center">
                      <div>
                        <p className="font-semibold text-foreground">看完這份月報表，可以先做一件事</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          目前月現金流仍為正，可以先確認是否要把一部分放進緊急預備金，或留給孩子教育費、搬家準備金等生活目標。
                        </p>
                      </div>
                      <Button asChild className="justify-center">
                        <Link href="/toolbox/planning">
                          設定生活目標 <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/75 p-4">
                    <p className="font-semibold text-foreground">月報表會自己更新</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      這份月報表會依照「我的財務紀錄」自動更新。想補資料時，可以回到「下一步」或「我的財務紀錄」。
                    </p>
                  </div>
                </CardContent>
            </Card>

            <Card id="member-data-summary" className="member-panel scroll-mt-24 border-border">
                <CardContent className="p-5">
                  <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_260px] lg:items-start">
                    <div>
                      <p className="text-sm font-medium text-primary">家庭財務全貌</p>
                      <h2 className="mt-1 text-2xl font-semibold text-foreground">我們家現在走到哪裡了？</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        這裡不是要你一次填完所有資料，而是把已經留下的紀錄整理成家庭樣貌。今天只看一眼，也算是有往前。
                      </p>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                      <p className="text-sm font-medium text-primary">目前已整理出的樣貌</p>
                      <div className="mt-2 flex items-end gap-2">
                        <p className="text-4xl font-bold text-foreground">45%</p>
                        <p className="pb-1 text-sm text-muted-foreground">已完成 3 / 8</p>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                        <div className="h-full w-[45%] rounded-full bg-primary" />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">已經看得出一部分輪廓，之後有空再慢慢補也可以。</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {familySummaryItems.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-border bg-background/75 p-4">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                    <p className="font-semibold text-foreground">目前整理出的生活輪廓</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      目前看起來，你比較關心的是債務還款、每月支出和家庭現金流。等補齊收入資料與必要生活費後，建議會更貼近你們家的生活。
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["債務還款", "每月支出", "家庭現金流"].map((item) => (
                        <span key={item} className="rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                    <div className="mb-3">
                      <p className="font-semibold text-foreground">近期提醒</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        這裡提醒的是生活可能正在變動的地方，不一定要馬上填表，但適合回來重新看一次。
                      </p>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {changeReminders.map((item) => (
                        <Link key={item.title} href={item.href} className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                            {item.action} <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="font-semibold text-foreground">我的變化</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">登入後最大的價值，是看見自己和家人正在慢慢整理起來。</p>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {familyChangeItems.map((item) => (
                        <div key={item.label} className="rounded-2xl bg-card/90 p-4">
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                            <span>{item.before}</span>
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span className="text-primary">{item.after}</span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">我的家庭地圖</p>
                        <p className="text-sm text-muted-foreground">需要細看的資料放在這裡，想到哪一塊再慢慢整理。</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {gentleNextTopics.slice(0, 3).map((item) => (
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
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {dataProgressItems.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-border bg-card p-4">
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="font-semibold text-foreground">不用一次填完</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      家庭全貌會隨著你在「我的財務紀錄」累積資料而變完整，不需要一次填完。真的想繼續整理時，回到「下一步」或「我的財務紀錄」就好。
                    </p>
                  </div>
                </CardContent>
            </Card>

            <Card id="member-articles" className="member-panel scroll-mt-24 border-border">
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
