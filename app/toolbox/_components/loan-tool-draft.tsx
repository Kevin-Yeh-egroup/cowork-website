"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarClock,
  Car,
  FileText,
  HelpCircle,
  Lightbulb,
  ListChecks,
  PiggyBank,
  Printer,
  RotateCcw,
  Search,
  Smartphone,
  TrendingDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type LoanMode = "current" | "remaining" | "target"

interface LoanToolConfig {
  kind: "personal" | "car"
  eyebrow: string
  title: string
  description: string
  sourceTitle: string
  sourceDescription: string
  appTitle: string
  appDescription: string
  appPrimaryPath: string
  appSecondaryPath: string
  balanceLabel: string
  rateLabel: string
  monthsLabel: string
  paymentLabel: string
  targetLabel: string
  exampleBalance: string
  exampleRate: string
  exampleMonths: string
  examplePayment: string
  exampleTargetMonths: string
  firstStepLabel: string
  cautionText: string
  nextStepTips: string[]
}

const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat("zh-TW", {
  maximumFractionDigits: 0,
})

function toPositiveNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function calculatePayment(principal: number, annualRate: number, months: number) {
  if (!principal || !months) return 0

  const monthlyRate = annualRate / 100 / 12
  if (!monthlyRate) return Math.ceil(principal / months)

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)

  return Math.ceil(payment)
}

function calculatePayoff(principal: number, annualRate: number, monthlyPayment: number) {
  if (!principal || !monthlyPayment) return null

  const monthlyRate = annualRate / 100 / 12
  let remaining = principal
  let totalInterest = 0
  let months = 0

  while (remaining > 0 && months < 720) {
    const interest = remaining * monthlyRate
    const principalPayment = monthlyPayment - interest

    if (principalPayment <= 0) {
      return { months: 720, totalInterest: Math.round(totalInterest), cannotPayOff: true }
    }

    totalInterest += interest
    remaining = Math.max(0, remaining - principalPayment)
    months += 1
  }

  return {
    months,
    totalInterest: Math.round(totalInterest),
    cannotPayOff: months >= 720,
  }
}

export function LoanToolDraft({ config }: { config: LoanToolConfig }) {
  const inputSectionRef = useRef<HTMLElement>(null)
  const [balance, setBalance] = useState(config.exampleBalance)
  const [annualRate, setAnnualRate] = useState(config.exampleRate)
  const [remainingMonths, setRemainingMonths] = useState(config.exampleMonths)
  const [monthlyPayment, setMonthlyPayment] = useState(config.examplePayment)
  const [targetMonths, setTargetMonths] = useState(config.exampleTargetMonths)
  const [mode, setMode] = useState<LoanMode>("remaining")

  const values = useMemo(() => {
    const principal = toPositiveNumber(balance)
    const rate = toPositiveNumber(annualRate)
    const months = toPositiveNumber(remainingMonths)
    const currentPayment = toPositiveNumber(monthlyPayment)
    const target = toPositiveNumber(targetMonths)
    const paymentForRemainingMonths = calculatePayment(principal, rate, months)
    const paymentForTarget = calculatePayment(principal, rate, target)
    const selectedPayment =
      mode === "current" ? currentPayment : mode === "target" ? paymentForTarget : paymentForRemainingMonths
    const selectedPlan = calculatePayoff(principal, rate, selectedPayment)
    const extraPlan = calculatePayoff(principal, rate, selectedPayment + 1000)
    const savedInterest =
      selectedPlan && extraPlan
        ? Math.max(0, (selectedPlan.totalInterest ?? 0) - (extraPlan.totalInterest ?? 0))
        : 0
    const savedMonths = selectedPlan && extraPlan ? Math.max(0, selectedPlan.months - extraPlan.months) : 0

    return {
      principal,
      rate,
      months,
      currentPayment,
      target,
      paymentForRemainingMonths,
      paymentForTarget,
      selectedPayment,
      selectedPlan,
      savedInterest,
      savedMonths,
    }
  }, [annualRate, balance, mode, monthlyPayment, remainingMonths, targetMonths])

  const reset = () => {
    setBalance(config.exampleBalance)
    setAnnualRate(config.exampleRate)
    setRemainingMonths(config.exampleMonths)
    setMonthlyPayment(config.examplePayment)
    setTargetMonths(config.exampleTargetMonths)
    setMode("remaining")
  }

  const scrollToInputs = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const printResult = () => {
    window.print()
  }

  const ToolIcon = config.kind === "car" ? Car : Banknote

  const resultIntro = values.selectedPlan?.cannotPayOff
    ? "這個每月還款金額可能不夠抵掉利息，需要重新調整。"
    : `照目前設定，約 ${values.selectedPlan?.months ?? 0} 個月可以還清。`

  const modeDescription =
    mode === "current"
      ? `目前試算方式：依照每月固定還 ${money.format(values.currentPayment)} 估算`
      : mode === "target"
        ? `目前試算方式：想在 ${number.format(values.target)} 個月內還完`
        : `目前試算方式：依剩餘 ${number.format(values.months)} 個月估算月付金`

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 rounded-2xl border border-border bg-card/85 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <ToolIcon className="h-4 w-4" />
                {config.eyebrow}
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {config.title}
              </h1>
              <p className="text-base leading-7 text-muted-foreground">{config.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/70 p-2 text-center">
              <div className="min-w-20 px-2 py-2">
                <p className="text-xs text-muted-foreground">餘額</p>
                <p className="text-sm font-semibold text-foreground">{money.format(values.principal)}</p>
              </div>
              <div className="min-w-20 border-x border-border px-2 py-2">
                <p className="text-xs text-muted-foreground">年利率</p>
                <p className="text-sm font-semibold text-foreground">{values.rate}%</p>
              </div>
              <div className="min-w-20 px-2 py-2">
                <p className="text-xs text-muted-foreground">月付金</p>
                <p className="text-sm font-semibold text-foreground">{money.format(values.selectedPayment)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7 rounded-2xl border border-border bg-card/90 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Search className="h-4 w-4" />
                先找資料，再開始試算
              </div>
              <h2 className="text-2xl font-bold text-foreground">這些數字通常在哪裡看得到？</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              每家銀行或融資公司名稱會不太一樣，可以從合約、繳款通知、銀行 APP 或網路銀行找起。
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{config.sourceTitle}</h3>
                  <p className="text-sm text-muted-foreground">{config.sourceDescription}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">資料來源示意</p>
                    <p className="text-sm font-semibold text-foreground">貸款資訊摘要</p>
                  </div>
                  <ToolIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">目前貸款餘額</span>
                    <span className="text-sm font-bold text-foreground">{money.format(values.principal)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">每月應繳金額</span>
                    <span className="text-sm font-bold text-foreground">{money.format(values.currentPayment)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">年利率 / 剩餘期數</span>
                    <span className="text-sm font-bold text-foreground">
                      {values.rate}% / {number.format(values.months)} 期
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                  <Smartphone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{config.appTitle}</h3>
                  <p className="text-sm text-muted-foreground">{config.appDescription}</p>
                </div>
              </div>

              <div className="mx-auto max-w-xs rounded-[1.75rem] border border-border bg-foreground p-2 shadow-sm">
                <div className="rounded-[1.35rem] bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">貸款</p>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">APP 示意</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                      首頁
                    </div>
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">{config.appPrimaryPath}</p>
                      <p className="text-xs text-muted-foreground">看餘額、期數、月付金</p>
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">{config.appSecondaryPath}</p>
                      <p className="text-xs text-muted-foreground">看利率與提前清償資訊</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-background/80 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">填寫前先懂 3 個名詞</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "貸款餘額",
                  text: "目前還沒還完的本金，可用來估每月壓力與剩餘利息。",
                },
                {
                  title: "年利率",
                  text: "利率越高，還款中分到利息的比例通常越多，總成本也會增加。",
                },
                {
                  title: "剩餘期數",
                  text: "還有幾個月要還，會影響月付金高低與總利息。",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card px-4 py-3">
                  <p className="mb-1 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section ref={inputSectionRef} className="scroll-mt-24 space-y-5">
            <Card className="border-border bg-card/95">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <ToolIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{config.firstStepLabel}</h2>
                    <p className="text-sm text-muted-foreground">先填手邊最容易找到的貸款數字。</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{config.balanceLabel}</span>
                    <Input
                      inputMode="numeric"
                      value={balance}
                      onChange={(event) => setBalance(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{config.rateLabel}</span>
                    <Input
                      inputMode="decimal"
                      value={annualRate}
                      onChange={(event) => setAnnualRate(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{config.monthsLabel}</span>
                    <Input
                      inputMode="numeric"
                      value={remainingMonths}
                      onChange={(event) => setRemainingMonths(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/95">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                    <PiggyBank className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">選一種還款想法</h2>
                    <p className="text-sm text-muted-foreground">比較目前月付、剩餘期數或想提早還完的情境。</p>
                  </div>
                </div>

                <div className="mb-5 grid gap-2 sm:grid-cols-3">
                  {[
                    { id: "current", label: "照目前月付" },
                    { id: "remaining", label: "照剩餘期數" },
                    { id: "target", label: "想提早還完" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setMode(option.id as LoanMode)}
                      className={`min-h-11 rounded-lg border px-3 text-sm font-medium transition ${
                        mode === option.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{config.paymentLabel}</span>
                    <Input
                      inputMode="numeric"
                      value={monthlyPayment}
                      onChange={(event) => setMonthlyPayment(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">{config.targetLabel}</span>
                    <Input
                      inputMode="numeric"
                      value={targetMonths}
                      onChange={(event) => setTargetMonths(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="border-primary/25 bg-card shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-primary">試算結果摘要</p>
                    <h2 className="text-2xl font-bold leading-tight text-foreground">{resultIntro}</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CalendarClock className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mb-4 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-foreground">
                  {modeDescription}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">每月還款</p>
                    <p className="text-xl font-bold text-foreground">{money.format(values.selectedPayment)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">還清時間</p>
                    <p className="text-xl font-bold text-foreground">
                      {values.selectedPlan?.cannotPayOff ? "需調整" : `${number.format(values.selectedPlan?.months ?? 0)} 個月`}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">估計利息</p>
                    <p className="text-xl font-bold text-foreground">
                      {money.format(values.selectedPlan?.totalInterest ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">看結果時留意 2 件事</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-card px-3 py-3">
                      <p className="mb-1 text-sm font-semibold text-foreground">期數拉長</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        月付金可能比較低，但總利息通常會增加，需要看長期成本。
                      </p>
                    </div>
                    <div className="rounded-lg bg-card px-3 py-3">
                      <p className="mb-1 text-sm font-semibold text-foreground">提早還款</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        提早還清可能省利息，但要留意是否有手續費或違約金。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-semibold text-foreground">多還一點的差別</h3>
                    </div>
                    <p className="text-sm leading-6 text-emerald-950">
                      每月多還 1,000 元，可能少繳 {money.format(values.savedInterest)} 利息，提早{" "}
                      {number.format(values.savedMonths)} 個月還清。
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-foreground">需要留意的訊號</h3>
                    </div>
                    <p className="text-sm leading-6 text-sky-950">{config.cautionText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section className="mt-5 rounded-2xl border border-border bg-card/95 p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">接下來可以做什麼</h2>
                <p className="text-sm text-muted-foreground">看完結果後，可以用下面幾個方向決定下一步。</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={scrollToInputs}
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">換一個還款設定再試一次</span>
                </button>
                <Link
                  href="/toolbox#debt-calculation"
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">把其他貸款也一起整理</span>
                </Link>
                <button
                  type="button"
                  onClick={printResult}
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <Printer className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">列印或另存 PDF，和家人或社工討論</span>
                </button>
                <Link
                  href="/online-consultation"
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">預約諮詢</span>
                </Link>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="sm:w-auto"
                  onClick={() => setMonthlyPayment(String(values.selectedPayment + 1000))}
                >
                  每月多還 1,000 元試試 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={reset} className="sm:w-auto">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  回到範例數字
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/70 p-4">
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">下一步怎麼選</h3>
              </div>
              <div className="grid gap-3">
                {config.nextStepTips.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg bg-card px-3 py-3">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
