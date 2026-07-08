"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Heart,
  Landmark,
  Mic,
  PiggyBank,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  WalletCards,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
})

const emergencyGoalHref = "/toolbox/planning"

const quickInputs = [
  { label: "每月收入", value: "42000" },
  { label: "每月支出", value: "29000" },
  { label: "每月債務還款", value: "13800" },
  { label: "可動用存款", value: "70000" },
  { label: "資產總額", value: "156000" },
  { label: "負債總額", value: "188000" },
]

const scoreCards = [
  {
    title: "財務健康",
    score: 68,
    label: "尚可",
    description: "收支還能維持，但現金流彈性偏小。",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-l-emerald-600",
    icon: TrendingUp,
    checks: [
      { label: "月收支大致平衡", ok: true },
      { label: "資產仍大於短期可動用負債", ok: true },
      { label: "債務還款壓縮生活彈性", ok: false },
    ],
  },
  {
    title: "財務安全",
    score: 46,
    label: "需要補強",
    description: "預備金與保障資料不足，遇到突發狀況時較脆弱。",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-l-sky-600",
    icon: ShieldCheck,
    checks: [
      { label: "緊急預備金未達 3 個月", ok: false },
      { label: "保險保障資料尚未完整", ok: false },
      { label: "已有初步財務規劃方向", ok: true },
    ],
  },
]

const dimensions = [
  {
    title: "收支平衡",
    status: "需要留意",
    value: "-800",
    description: "收入扣掉生活支出與債務還款後，本月略為不足。",
    progress: 44,
    icon: WalletCards,
  },
  {
    title: "資產負債",
    status: "尚可",
    value: "-32,000",
    description: "目前示意資料中負債高於資產，需補齊資產後再判斷。",
    progress: 48,
    icon: Landmark,
  },
  {
    title: "緊急預備金",
    status: "不足",
    value: "1.6 個月",
    description: "目前還不到 3 個月必要支出，可先設定預備金目標，再拆成每月可存金額。",
    progress: 35,
    icon: PiggyBank,
    href: emergencyGoalHref,
    action: "設定預備金目標",
  },
  {
    title: "收入穩定",
    status: "可再確認",
    value: "1-2 種來源",
    description: "若收入浮動或仰賴補助，預備金需要抓得更保守。",
    progress: 58,
    icon: BarChart3,
  },
  {
    title: "保障缺口",
    status: "資料不足",
    value: "待補",
    description: "需補保險與照顧責任，才能判斷風險缺口。",
    progress: 25,
    icon: Heart,
  },
]

const strengths = ["已開始整理收入與支出", "有可動用存款作為短期緩衝", "願意把債務還款放進整體財務一起看"]

const improvements = ["每月債務還款偏高，需確認是否壓縮生活費", "緊急預備金尚未達 3 個月必要支出", "保障與家庭責任資料不足，安全判斷可能偏粗略"]

const stats = [
  { title: "月收支狀況", rows: [
    { label: "月收入", value: money.format(42000), tone: "good" },
    { label: "月支出", value: money.format(29000), tone: "normal" },
    { label: "債務還款", value: money.format(13800), tone: "risk" },
    { label: "月結餘", value: money.format(-800), tone: "risk" },
  ] },
  { title: "資產負債狀況", rows: [
    { label: "總資產", value: money.format(156000), tone: "good" },
    { label: "總負債", value: money.format(188000), tone: "risk" },
    { label: "淨資產", value: money.format(-32000), tone: "risk" },
    { label: "負債資產比", value: "120.5%", tone: "risk" },
  ] },
  { title: "緊急預備金", rows: [
    { label: "目前預備金", value: money.format(70000), tone: "normal" },
    { label: "3 個月標準", value: money.format(128400), tone: "normal" },
    { label: "6 個月較安心", value: money.format(256800), tone: "good" },
    { label: "目前可支撐", value: "1.6 個月", tone: "risk" },
  ] },
]

const advice = [
  {
    title: "先把必要支出和債務還款分開看",
    text: "目前月結餘偏緊，建議先確認生活支出、債務還款是否有重複記錄，並看哪些固定支出可以調整。",
    href: "/toolbox/monthly-report",
    action: "查看月報表",
  },
  {
    title: "補完整債務盤點，找出優先處理順序",
    text: "如果有信用卡、信貸或親友借款，建議一起看利率、剩餘金額、每月還款與逾期狀態。",
    href: "/toolbox/debt",
    action: "補債務盤點",
  },
  {
    title: "把緊急預備金變成一個可執行的目標",
    text: "不用一次存到位，可以先用 3 個月必要生活費當第一階段，估算每月要存多少、多久可以達成。",
    href: emergencyGoalHref,
    action: "設定預備金目標",
  },
]

export default function FinancialHealthDashboardPage() {
  const [voiceText, setVoiceText] = useState(
    "我每月收入大約 4 萬 2，生活費約 2 萬 9，信用卡和信貸每月要還 1 萬 3，存款大約 7 萬。",
  )

  const confidence = 52

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-primary">財務健康安全儀表板</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">先看健檢結果，再決定下一步</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                可以先用粗略數字或語音描述產出快速檢視；想看更接近真實生活的完整結果，登入後可帶入記帳、債務盤點、月報表與家庭資料。
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button asChild>
                <Link href="/login?role=member&next=%2Ftoolbox%2Ffinancial-health-dashboard">
                  登入看完整結果
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/personal-center#member-data-summary">
                  補齊我的財務與生活
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <div className="space-y-5">
            <Card className="border-border">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-foreground">快速填一版</h2>
                <div className="mt-4 grid gap-3">
                  {quickInputs.map((input) => (
                    <label key={input.label} className="block">
                      <span className="mb-1 block text-sm font-medium text-foreground">{input.label}</span>
                      <Input defaultValue={input.value} inputMode="numeric" />
                    </label>
                  ))}
                </div>
                <Button className="mt-4 w-full">
                  <RefreshCw className="h-4 w-4" />
                  更新初步結果
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">語音或文字補充</h2>
                  <Button size="icon" variant="outline" aria-label="語音輸入">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea value={voiceText} onChange={(event) => setVoiceText(event.target.value)} rows={5} />
                <Button variant="outline" className="mt-4 w-full">
                  解析這段描述
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">快速檢視結果</p>
                    <h2 className="text-2xl font-bold text-foreground">目前建議：先穩住現金流，再補齊安全網</h2>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/20 p-4 md:w-56">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">結果可信度</span>
                      <span className="font-bold text-primary">{confidence}%</span>
                    </div>
                    <Progress value={confidence} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {scoreCards.map((card) => {
                const Icon = card.icon

                return (
                  <Card key={card.title} className={`border-border border-l-4 ${card.border}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-3 ${card.bg}`}>
                            <Icon className={`h-5 w-5 ${card.color}`} />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">{card.title}</h2>
                            <p className="text-sm text-muted-foreground">{card.description}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${card.bg} ${card.color}`}>
                          {card.label}
                        </span>
                      </div>
                      <div className="mt-5 text-center">
                        <span className={`text-6xl font-bold ${card.color}`}>{card.score}</span>
                        <span className={`ml-1 text-2xl font-bold ${card.color}`}>分</span>
                      </div>
                      <Progress value={card.score} className="mt-4" />
                      <div className="mt-4 space-y-2">
                        {card.checks.map((check) => (
                          <div key={check.label} className="flex items-center gap-2 text-sm">
                            {check.ok ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span className="text-foreground">{check.label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-5">
          {dimensions.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.title} className="border-border">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
                  <Progress value={item.progress} className="mt-3" />
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <ResultList
            title="優勢項目"
            tone="good"
            items={strengths}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-700" />}
          />
          <ResultList
            title="改善重點"
            tone="risk"
            items={improvements}
            icon={<AlertCircle className="h-5 w-5 text-destructive" />}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {stats.map((group) => (
            <Card key={group.title} className="border-border">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-foreground">{group.title}</h2>
                <div className="mt-4 space-y-3">
                  {group.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border/70 pb-2 last:border-0">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span
                        className={`font-bold ${
                          row.tone === "good"
                            ? "text-emerald-700"
                            : row.tone === "risk"
                              ? "text-destructive"
                              : "text-foreground"
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <Card className="border-border bg-primary/5">
            <CardContent className="p-5">
              <div className="mb-5 flex items-start gap-3">
                <Heart className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">給你的貼心建議</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    目前財務基礎正在整理中，先不用一次做到完美，先從最影響生活壓力的地方開始。
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {advice.map((item, index) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                        <Link href={item.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          {item.action}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">下一步</h2>
              </div>
              <div className="space-y-3">
                <ActionLink href="/toolbox/monthly-report" label="查看完整財務月報表" />
                <ActionLink href="/toolbox/debt" label="補完整債務盤點" />
                <ActionLink href={emergencyGoalHref} label="設定預備金目標" />
                <ActionLink href="/personal-center#member-data-summary" label="補家庭與保障資料" />
                <ActionLink href="/online-consultation" label="預約免費諮詢" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

function ResultList({
  title,
  items,
  icon,
  tone,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
  tone: "good" | "risk"
}) {
  return (
    <Card className={`border-border ${tone === "good" ? "bg-emerald-50/70" : "bg-destructive/5"}`}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-foreground">
              <span className={tone === "good" ? "text-emerald-700" : "text-destructive"}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" className="w-full justify-between">
      <Link href={href}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}
