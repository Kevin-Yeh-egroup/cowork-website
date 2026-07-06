"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CreditCard,
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
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SaveToProfilePrompt } from "@/app/toolbox/_components/save-to-profile-prompt"

type PaymentMode = "minimum" | "fixed" | "target"

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

function calculateMonthsToPayOff(balance: number, annualRate: number, monthlyPayment: number) {
  if (!balance || !monthlyPayment) return null

  const monthlyRate = annualRate / 100 / 12
  let remaining = balance
  let totalInterest = 0
  let months = 0

  while (remaining > 0 && months < 600) {
    const interest = remaining * monthlyRate
    const principalPayment = monthlyPayment - interest

    if (principalPayment <= 0) {
      return { months: 600, totalInterest, cannotPayOff: true }
    }

    totalInterest += interest
    remaining = Math.max(0, remaining - principalPayment)
    months += 1
  }

  return {
    months,
    totalInterest: Math.round(totalInterest),
    cannotPayOff: months >= 600,
  }
}

function calculatePaymentForTarget(balance: number, annualRate: number, targetMonths: number) {
  if (!balance || !targetMonths) return 0

  const monthlyRate = annualRate / 100 / 12
  if (!monthlyRate) return Math.ceil(balance / targetMonths)

  const payment =
    (balance * monthlyRate * Math.pow(1 + monthlyRate, targetMonths)) /
    (Math.pow(1 + monthlyRate, targetMonths) - 1)

  return Math.ceil(payment)
}

export default function CreditCardToolDraftPage() {
  const inputSectionRef = useRef<HTMLElement>(null)
  const [balance, setBalance] = useState("80000")
  const [annualRate, setAnnualRate] = useState("15")
  const [monthlyPayment, setMonthlyPayment] = useState("6000")
  const [minimumPayment, setMinimumPayment] = useState("3000")
  const [targetMonths, setTargetMonths] = useState("18")
  const [mode, setMode] = useState<PaymentMode>("fixed")

  const values = useMemo(() => {
    const cardBalance = toPositiveNumber(balance)
    const rate = toPositiveNumber(annualRate)
    const fixedPayment = toPositiveNumber(monthlyPayment)
    const minimum = toPositiveNumber(minimumPayment)
    const target = toPositiveNumber(targetMonths)
    const paymentForTarget = calculatePaymentForTarget(cardBalance, rate, target)

    const selectedPayment =
      mode === "minimum" ? minimum : mode === "target" ? paymentForTarget : fixedPayment

    const selectedPlan = calculateMonthsToPayOff(cardBalance, rate, selectedPayment)
    const fixedPlan = calculateMonthsToPayOff(cardBalance, rate, fixedPayment)
    const boostedPlan = calculateMonthsToPayOff(cardBalance, rate, fixedPayment + 1000)
    const minimumPlan = calculateMonthsToPayOff(cardBalance, rate, minimum)

    const savedInterest =
      fixedPlan && boostedPlan
        ? Math.max(0, (fixedPlan.totalInterest ?? 0) - (boostedPlan.totalInterest ?? 0))
        : 0

    const savedMonths =
      fixedPlan && boostedPlan ? Math.max(0, fixedPlan.months - boostedPlan.months) : 0

    return {
      cardBalance,
      rate,
      fixedPayment,
      minimum,
      target,
      paymentForTarget,
      selectedPayment,
      selectedPlan,
      fixedPlan,
      boostedPlan,
      minimumPlan,
      savedInterest,
      savedMonths,
    }
  }, [annualRate, balance, minimumPayment, mode, monthlyPayment, targetMonths])

  const reset = () => {
    setBalance("80000")
    setAnnualRate("15")
    setMonthlyPayment("6000")
    setMinimumPayment("3000")
    setTargetMonths("18")
    setMode("fixed")
  }

  const scrollToInputs = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const printResult = () => {
    window.print()
  }

  const resultIntro = values.selectedPlan?.cannotPayOff
    ? "這個還款金額可能不夠抵掉每月利息，需要調整還款金額或尋求協助。"
    : `照目前設定，約 ${values.selectedPlan?.months ?? 0} 個月可以還清。`

  const modeDescription =
    mode === "minimum"
      ? `目前試算方式：只繳帳單最低應繳 ${money.format(values.minimum)}`
      : mode === "target"
        ? `目前試算方式：想在 ${number.format(values.target)} 個月內還完`
        : `目前試算方式：每月固定還 ${money.format(values.fixedPayment)}`

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 rounded-2xl border border-border bg-card/85 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <CreditCard className="h-4 w-4" />
                信用卡小工具草稿
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                信用卡還款壓力試算
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                輸入目前卡費與每月可還金額，先看懂還清時間、利息壓力，以及多還一點可能帶來的差別。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/70 p-2 text-center">
              <div className="min-w-20 px-2 py-2">
                <p className="text-xs text-muted-foreground">欠款</p>
                <p className="text-sm font-semibold text-foreground">{money.format(values.cardBalance)}</p>
              </div>
              <div className="min-w-20 border-x border-border px-2 py-2">
                <p className="text-xs text-muted-foreground">年利率</p>
                <p className="text-sm font-semibold text-foreground">{values.rate}%</p>
              </div>
              <div className="min-w-20 px-2 py-2">
                <p className="text-xs text-muted-foreground">月還款</p>
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
              每家銀行名稱和位置會不太一樣，可以先從「信用卡帳單」、「銀行 APP」或「網路銀行」找起。
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">紙本或電子帳單</h3>
                  <p className="text-sm text-muted-foreground">找「應繳金額」、「最低應繳」和「循環信用利率」。</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">信用卡帳單示意</p>
                    <p className="text-sm font-semibold text-foreground">本期帳單明細</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">本期應繳總金額</span>
                    <span className="text-sm font-bold text-foreground">$80,000</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">最低應繳金額</span>
                    <span className="text-sm font-bold text-foreground">$3,000</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">循環信用年利率</span>
                    <span className="text-sm font-bold text-foreground">15%</span>
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
                  <h3 className="font-semibold text-foreground">銀行 APP 或網路銀行</h3>
                  <p className="text-sm text-muted-foreground">常見路徑是信用卡、帳單、繳款或費率說明。</p>
                </div>
              </div>

              <div className="mx-auto max-w-xs rounded-[1.75rem] border border-border bg-foreground p-2 shadow-sm">
                <div className="rounded-[1.35rem] bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">信用卡</p>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">APP 示意</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                      首頁
                    </div>
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">帳單與繳款</p>
                      <p className="text-xs text-muted-foreground">看本期應繳、最低應繳</p>
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">利率與費用</p>
                      <p className="text-xs text-muted-foreground">看循環信用利率</p>
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
                  title: "本期應繳總金額",
                  text: "這期帳單需要處理的總金額，可先當成目前卡費壓力來估。",
                },
                {
                  title: "最低應繳金額",
                  text: "這是避免逾期的最低門檻，不代表只欠這麼多，也不代表還款最划算。",
                },
                {
                  title: "循環信用利率",
                  text: "如果沒有一次繳清，剩下的金額可能會用這個利率計算利息。",
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
                    <WalletCards className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">先整理卡費狀況</h2>
                    <p className="text-sm text-muted-foreground">填民眾手邊最容易找到的數字。</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">目前信用卡未繳金額</span>
                    <Input
                      inputMode="numeric"
                      value={balance}
                      onChange={(event) => setBalance(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">循環信用年利率</span>
                    <Input
                      inputMode="decimal"
                      value={annualRate}
                      onChange={(event) => setAnnualRate(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">帳單最低應繳金額</span>
                    <Input
                      inputMode="numeric"
                      value={minimumPayment}
                      onChange={(event) => setMinimumPayment(event.target.value)}
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
                    <p className="text-sm text-muted-foreground">讓結果像生活決策，而不是只有公式答案。</p>
                  </div>
                </div>

                <div className="mb-5 grid gap-2 sm:grid-cols-3">
                  {[
                    { id: "minimum", label: "只繳最低" },
                    { id: "fixed", label: "固定每月還" },
                    { id: "target", label: "想期限內還完" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setMode(option.id as PaymentMode)}
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
                    <span className="text-sm font-medium text-foreground">每月可以固定還多少</span>
                    <Input
                      inputMode="numeric"
                      value={monthlyPayment}
                      onChange={(event) => setMonthlyPayment(event.target.value)}
                      className="h-12 text-base"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">希望幾個月內還完</span>
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
                      <p className="mb-1 text-sm font-semibold text-foreground">還清時間很長</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        通常代表每月還款有不少被利息吃掉，本金下降得比較慢。
                      </p>
                    </div>
                    <div className="rounded-lg bg-card px-3 py-3">
                      <p className="mb-1 text-sm font-semibold text-foreground">每月付款太低</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        如果還款金額低於每月利息，卡費可能不會變少，甚至愈滾愈大。
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
                    <p className="text-sm leading-6 text-sky-950">
                      如果只繳最低會讓時間拉很長，或已影響生活費，可以先盤點債務再安排順序。
                    </p>
                  </div>
                </div>

                <SaveToProfilePrompt toolPath="/toolbox/credit-card" />
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
                  <span className="text-sm font-medium text-foreground">換一個每月還款金額再試一次</span>
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
                  onClick={() => setMonthlyPayment(String(values.fixedPayment + 1000))}
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
                {[
                  "只有一張卡：先試幾個每月還款金額，看哪個比較接近生活能力。",
                  "有多張卡：先整理每張卡的金額、利率和最低應繳，再比較優先順序。",
                  "已經影響生活費：先保住房租、餐費和必要支出，再找人一起討論還款安排。",
                ].map((item) => (
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
