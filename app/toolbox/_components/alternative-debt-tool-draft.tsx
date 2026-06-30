"use client"

import Link from "next/link"
import type React from "react"
import { useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarClock,
  FileText,
  HandCoins,
  HelpCircle,
  ListChecks,
  Printer,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ToolKind = "association" | "pawn"

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

function ResultTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-4">
      <p className="mb-1 text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</p>
    </div>
  )
}

export function AidAssociationDraft() {
  const inputSectionRef = useRef<HTMLElement>(null)
  const [monthlyContribution, setMonthlyContribution] = useState("10000")
  const [memberCount, setMemberCount] = useState("24")
  const [bidAmount, setBidAmount] = useState("1200")
  const [targetPeriod, setTargetPeriod] = useState("8")
  const [paidPeriods, setPaidPeriods] = useState("3")

  const values = useMemo(() => {
    const contribution = toPositiveNumber(monthlyContribution)
    const members = toPositiveNumber(memberCount)
    const bid = toPositiveNumber(bidAmount)
    const target = Math.min(toPositiveNumber(targetPeriod), members || 1)
    const paid = Math.min(toPositiveNumber(paidPeriods), members || 1)
    const grossPool = contribution * members
    const estimatedDiscount = bid * Math.max(0, members - target)
    const estimatedReceive = Math.max(0, grossPool - estimatedDiscount)
    const remainingPeriods = Math.max(0, members - paid)
    const futurePayment = contribution * remainingPeriods
    const urgentCashRatio = grossPool ? (estimatedReceive / grossPool) * 100 : 0

    return {
      contribution,
      members,
      bid,
      target,
      paid,
      grossPool,
      estimatedDiscount,
      estimatedReceive,
      remainingPeriods,
      futurePayment,
      urgentCashRatio,
    }
  }, [bidAmount, memberCount, monthlyContribution, paidPeriods, targetPeriod])

  const reset = () => {
    setMonthlyContribution("10000")
    setMemberCount("24")
    setBidAmount("1200")
    setTargetPeriod("8")
    setPaidPeriods("3")
  }

  const scrollToInputs = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const printResult = () => {
    window.print()
  }

  return (
    <AlternativeDebtLayout
      kind="association"
      eyebrow="標會工具草稿"
      title="標會現金流與風險試算"
      description="輸入會款、人數與標金，先看可能拿到多少、後續還要繳多少，以及倒會或資訊不清楚時的風險。"
      inputSectionRef={inputSectionRef}
      onScrollToInputs={scrollToInputs}
      onPrint={printResult}
      onReset={reset}
      resultIntro={`若第 ${number.format(values.target)} 期得標，估計可拿到約 ${money.format(values.estimatedReceive)}。`}
      sourceTitle="會單、LINE 群組或會首提供的資料"
      sourceDescription="先找會款、人數、起會日、標金規則、已標會員與未標會員名單。"
      sourceItems={[
        { title: "會款", text: "每期要繳多少錢" },
        { title: "總人數 / 總期數", text: "這個會共有幾個會員、跑幾期" },
        { title: "起會日", text: "每月哪一天繳款、哪一天開標" },
        { title: "標金規則", text: "標金怎麼出、得標後怎麼繳" },
        { title: "已標 / 未標名單", text: "誰已拿到合會金、誰還沒拿" },
      ]}
      knowledgeCards={[
        {
          title: "合會最好要有會單",
          text: "會單可列出會首、會員、會款、期數與標金規則，日後比較容易釐清權利義務。",
        },
        {
          title: "得標不是收入全部入袋",
          text: "標金越高，代表折讓越多，實際拿到的合會金可能低於直覺想像。",
        },
        {
          title: "倒會風險要先想",
          text: "若會首或會員無法持續繳款，後續追討可能很麻煩，不能只看短期可拿現金。",
        },
      ]}
      nextTips={[
        "先確認會單：會首、會員、會款、期數、標金規則是否寫清楚。",
        "急需現金時：比較標會折讓、信貸、親友借款等不同成本。",
        "已經擔心倒會：先保存會單、匯款紀錄、對話紀錄，再找可信任的人協助判斷。",
      ]}
    >
      <section ref={inputSectionRef} className="scroll-mt-24 space-y-5">
        <Card className="border-border bg-card/95">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">先整理這個會的資料</h2>
                <p className="text-sm text-muted-foreground">用會單或群組資料，把規則先寫成數字。</p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">每期會款</span>
                <Input inputMode="numeric" value={monthlyContribution} onChange={(event) => setMonthlyContribution(event.target.value)} className="h-12 text-base" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">總人數 / 總期數</span>
                <Input inputMode="numeric" value={memberCount} onChange={(event) => setMemberCount(event.target.value)} className="h-12 text-base" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">預估標金 / 折讓金額</span>
                <Input inputMode="numeric" value={bidAmount} onChange={(event) => setBidAmount(event.target.value)} className="h-12 text-base" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">想在第幾期得標</span>
                  <Input inputMode="numeric" value={targetPeriod} onChange={(event) => setTargetPeriod(event.target.value)} className="h-12 text-base" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">目前已繳幾期</span>
                  <Input inputMode="numeric" value={paidPeriods} onChange={(event) => setPaidPeriods(event.target.value)} className="h-12 text-base" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-primary/25 bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <ResultHeader intro={`若第 ${number.format(values.target)} 期得標，估計可拿到約 ${money.format(values.estimatedReceive)}。`} />
          <div className="grid gap-3 sm:grid-cols-3">
            <ResultTile label="合會總額" value={money.format(values.grossPool)} hint="每期會款乘以總人數。" />
            <ResultTile label="估計折讓" value={money.format(values.estimatedDiscount)} hint="用標金粗估可能少拿的金額。" />
            <ResultTile label="後續還要繳" value={money.format(values.futurePayment)} hint={`以目前還有 ${number.format(values.remainingPeriods)} 期估算。`} />
          </div>
          <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-foreground">需要留意的訊號</h3>
            </div>
            <p className="text-sm leading-6 text-sky-950">
              若會單不清楚、會員彼此不熟、或會首要求用現金交付，建議先停下來確認紀錄與風險。
            </p>
          </div>
        </CardContent>
      </Card>
    </AlternativeDebtLayout>
  )
}

export function PawnShopDraft() {
  const inputSectionRef = useRef<HTMLElement>(null)
  const [borrowAmount, setBorrowAmount] = useState("50000")
  const [annualRate, setAnnualRate] = useState("30")
  const [storageFeeRate, setStorageFeeRate] = useState("5")
  const [months, setMonths] = useState("3")
  const [itemValue, setItemValue] = useState("90000")

  const values = useMemo(() => {
    const principal = toPositiveNumber(borrowAmount)
    const rate = toPositiveNumber(annualRate)
    const storageRate = toPositiveNumber(storageFeeRate)
    const duration = toPositiveNumber(months)
    const collateral = toPositiveNumber(itemValue)
    const monthlyInterest = Math.ceil((principal * rate) / 100 / 12)
    const totalInterest = monthlyInterest * duration
    const storageFee = Math.ceil((principal * storageRate) / 100)
    const totalCost = principal + totalInterest + storageFee
    const loanToValue = collateral ? (principal / collateral) * 100 : 0
    const rateWarning = rate > 30
    const storageWarning = storageRate > 5

    return {
      principal,
      rate,
      storageRate,
      duration,
      collateral,
      monthlyInterest,
      totalInterest,
      storageFee,
      totalCost,
      loanToValue,
      rateWarning,
      storageWarning,
    }
  }, [annualRate, borrowAmount, itemValue, months, storageFeeRate])

  const reset = () => {
    setBorrowAmount("50000")
    setAnnualRate("30")
    setStorageFeeRate("5")
    setMonths("3")
    setItemValue("90000")
  }

  const scrollToInputs = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const printResult = () => {
    window.print()
  }

  return (
    <AlternativeDebtLayout
      kind="pawn"
      eyebrow="當鋪工具草稿"
      title="當鋪借款成本試算"
      description="輸入借款金額、利率、倉棧費與典當期間，先看每月利息、總成本與法規上需要留意的地方。"
      inputSectionRef={inputSectionRef}
      onScrollToInputs={scrollToInputs}
      onPrint={printResult}
      onReset={reset}
      resultIntro={`借 ${money.format(values.principal)}、典當 ${number.format(values.duration)} 個月，估計總成本約 ${money.format(values.totalCost)}。`}
      sourceTitle="當票、當舖契約或店家費用說明"
      sourceDescription="找借款金額、月息或年利率、倉棧費、滿當日與流當規則。"
      sourceItems={[
        { title: "收當金額", text: "實際借到多少錢" },
        { title: "利息", text: "月息或年利率，建議換成年利率比較" },
        { title: "倉棧費", text: "保管典當品可能收取的費用" },
        { title: "滿當日", text: "到期前何時要取贖或展延" },
        { title: "典當物", text: "品項、估價與取贖方式" },
      ]}
      knowledgeCards={[
        {
          title: "利率要看年利率",
          text: "當舖業收取利息依法不得超過年率 30%，看到月息時要換算成年率再比較。",
        },
        {
          title: "倉棧費另有上限",
          text: "收取倉棧費依法不得超過收當金額 5%，也不應再用其他名目收費。",
        },
        {
          title: "流當期限要看清楚",
          text: "若到期未取贖，典當品可能依法處理，務必確認滿當日、展延與取贖方式。",
        },
      ]}
      nextTips={[
        "先看當票：利息、倉棧費、滿當日、取贖方式是否寫清楚。",
        "比較總成本：不要只看借得到多少，也要看幾個月後總共要還多少。",
        "如果是生活費缺口：先評估是否有其他低成本資源或諮詢協助。",
      ]}
    >
      <section ref={inputSectionRef} className="scroll-mt-24 space-y-5">
        <Card className="border-border bg-card/95">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <HandCoins className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">先整理當鋪借款條件</h2>
                <p className="text-sm text-muted-foreground">用當票或費用說明，把利息與費用拆開看。</p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">借款金額</span>
                <Input inputMode="numeric" value={borrowAmount} onChange={(event) => setBorrowAmount(event.target.value)} className="h-12 text-base" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">年利率</span>
                <Input inputMode="decimal" value={annualRate} onChange={(event) => setAnnualRate(event.target.value)} className="h-12 text-base" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">倉棧費比例</span>
                <Input inputMode="decimal" value={storageFeeRate} onChange={(event) => setStorageFeeRate(event.target.value)} className="h-12 text-base" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">預計典當幾個月</span>
                  <Input inputMode="numeric" value={months} onChange={(event) => setMonths(event.target.value)} className="h-12 text-base" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-foreground">典當物估計價值</span>
                  <Input inputMode="numeric" value={itemValue} onChange={(event) => setItemValue(event.target.value)} className="h-12 text-base" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-primary/25 bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <ResultHeader intro={`借 ${money.format(values.principal)}、典當 ${number.format(values.duration)} 個月，估計總成本約 ${money.format(values.totalCost)}。`} />
          <div className="grid gap-3 sm:grid-cols-3">
            <ResultTile label="每月利息" value={money.format(values.monthlyInterest)} hint={`以年利率 ${values.rate}% 粗估。`} />
            <ResultTile label="倉棧費" value={money.format(values.storageFee)} hint={`以借款金額 ${values.storageRate}% 粗估。`} />
            <ResultTile label="借款成數" value={`${number.format(values.loanToValue)}%`} hint="借款金額占典當物估值比例。" />
          </div>
          <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">法規提醒</h3>
            </div>
            <div className="grid gap-2">
              <p className={`rounded-lg px-3 py-2 text-sm leading-6 ${values.rateWarning ? "bg-destructive/10 text-destructive" : "bg-card text-muted-foreground"}`}>
                年利率不得超過 30%。目前填寫：{values.rate}%。
              </p>
              <p className={`rounded-lg px-3 py-2 text-sm leading-6 ${values.storageWarning ? "bg-destructive/10 text-destructive" : "bg-card text-muted-foreground"}`}>
                倉棧費不得超過收當金額 5%。目前填寫：{values.storageRate}%。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AlternativeDebtLayout>
  )
}

function ResultHeader({ intro }: { intro: string }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <p className="mb-1 text-sm font-medium text-primary">試算結果摘要</p>
        <h2 className="text-2xl font-bold leading-tight text-foreground">{intro}</h2>
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <CalendarClock className="h-6 w-6 text-primary" />
      </div>
    </div>
  )
}

function AlternativeDebtLayout({
  kind,
  eyebrow,
  title,
  description,
  sourceTitle,
  sourceDescription,
  sourceItems,
  resultIntro: _resultIntro,
  inputSectionRef: _inputSectionRef,
  onScrollToInputs,
  onPrint,
  onReset,
  knowledgeCards,
  nextTips,
  children,
}: {
  kind: ToolKind
  eyebrow: string
  title: string
  description: string
  sourceTitle: string
  sourceDescription: string
  sourceItems: { title: string; text: string }[]
  resultIntro: string
  inputSectionRef: React.RefObject<HTMLElement | null>
  onScrollToInputs: () => void
  onPrint: () => void
  onReset: () => void
  knowledgeCards: { title: string; text: string }[]
  nextTips: string[]
  children: React.ReactNode
}) {
  const ToolIcon = kind === "association" ? Users : HandCoins
  const childArray = Array.isArray(children) ? children : [children]

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 rounded-2xl border border-border bg-card/85 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <ToolIcon className="h-4 w-4" />
                {eyebrow}
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{title}</h1>
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
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
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">{sourceDescription}</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{sourceTitle}</h3>
                  <p className="text-sm text-muted-foreground">{sourceDescription}</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{kind === "association" ? "會單示意" : "當票示意"}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {kind === "association" ? "填寫前先看會單或群組公告" : "填寫前先看當票或費用說明"}
                    </p>
                  </div>
                  {kind === "association" ? (
                    <Users className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <HandCoins className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="grid gap-2">
                  {sourceItems.map((item) => (
                    <div key={item.title} className="flex items-start justify-between gap-3 rounded-lg bg-primary/10 px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs leading-5 text-muted-foreground">{item.text}</p>
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                  <Scale className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">法規與小常識</h3>
                  <p className="text-sm text-muted-foreground">先把規則看懂，再決定要不要使用這類工具。</p>
                </div>
              </div>
              <div className="grid gap-3">
                {knowledgeCards.map((card) => (
                  <div key={card.title} className="rounded-lg border border-border bg-card px-4 py-3">
                    <p className="mb-1 text-sm font-semibold text-foreground">{card.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {childArray[0]}
          <section>{childArray[1]}</section>
        </div>

        <section className="mt-5 rounded-2xl border border-border bg-card/95 p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">接下來可以做什麼</h2>
                <p className="text-sm text-muted-foreground">看完結果後，可以用下面幾個方向決定下一步。</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={onScrollToInputs} className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5">
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">換一個金額再試一次</span>
                </button>
                <Link href="/toolbox#debt-calculation" className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5">
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">把其他債務也一起整理</span>
                </Link>
                <button type="button" onClick={onPrint} className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5">
                  <Printer className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">列印或另存 PDF，和家人或社工討論</span>
                </button>
                <Link href="/online-consultation" className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5">
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">預約諮詢</span>
                </Link>
              </div>
              <div className="mt-4">
                <Button type="button" variant="outline" onClick={onReset} className="sm:w-auto">
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
                {nextTips.map((item) => (
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
