"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarClock,
  FileText,
  HelpCircle,
  Home,
  ListChecks,
  PiggyBank,
  Printer,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type MortgageMode = "standard" | "youth"

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

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value))
}

function sumRecord(values: Record<string, string>) {
  return Object.values(values).reduce((sum, value) => sum + toPositiveNumber(value), 0)
}

const livingCostFields = [
  { key: "food", label: "食", hint: "餐費、食材、外食" },
  { key: "clothing", label: "衣", hint: "衣物、日用品" },
  { key: "housing", label: "住", hint: "租金、管理費、水電瓦斯" },
  { key: "transport", label: "行", hint: "通勤、油錢、停車" },
  { key: "education", label: "育", hint: "學費、補習、照顧" },
  { key: "leisure", label: "樂", hint: "休閒、娛樂、聚餐" },
  { key: "telecom", label: "通訊", hint: "手機、網路、串流" },
  { key: "insurance", label: "保險", hint: "保費、醫療保障" },
] as const

const debtPaymentFields = [
  { key: "personalLoan", label: "信貸", hint: "信用貸款月付" },
  { key: "carLoan", label: "車貸", hint: "車貸月付" },
  { key: "creditCard", label: "信用卡", hint: "固定還款或最低應繳" },
  { key: "studentLoan", label: "學貸", hint: "就學貸款月付" },
  { key: "installment", label: "分期", hint: "消費分期、零卡分期" },
  { key: "other", label: "其他", hint: "其他固定債務" },
] as const

const purchaseCostFields = [
  { key: "renovation", label: "裝潢", hint: "裝修、隔間、油漆" },
  { key: "utilities", label: "水電", hint: "水電、瓦斯、管線整理" },
  { key: "furniture", label: "家具家電", hint: "床、沙發、冰箱、冷氣" },
  { key: "taxFees", label: "稅費代書", hint: "契稅、規費、代書費" },
  { key: "moving", label: "搬家", hint: "搬運、清潔、整理" },
  { key: "insurance", label: "保險", hint: "火險、地震險等" },
  { key: "emergency", label: "預備金", hint: "入住後緊急支出" },
  { key: "other", label: "其他", hint: "其他一次性成本" },
] as const

export function MortgageToolDraft({ initialMode = "standard" }: { initialMode?: MortgageMode }) {
  const inputSectionRef = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<MortgageMode>(initialMode)
  const [homePrice, setHomePrice] = useState(initialMode === "youth" ? "12000000" : "15000000")
  const [downPayment, setDownPayment] = useState(initialMode === "youth" ? "2400000" : "3000000")
  const [annualRate, setAnnualRate] = useState(initialMode === "youth" ? "1.775" : "2.2")
  const [subsidyRate, setSubsidyRate] = useState("0.375")
  const [loanYears, setLoanYears] = useState(initialMode === "youth" ? "40" : "30")
  const [graceYears, setGraceYears] = useState(initialMode === "youth" ? "5" : "2")
  const [monthlyIncome, setMonthlyIncome] = useState("90000")
  const [livingCosts, setLivingCosts] = useState({
    food: "18000",
    clothing: "3000",
    housing: "0",
    transport: "6000",
    education: "5000",
    leisure: "3000",
    telecom: "2000",
    insurance: "5000",
  })
  const [debtPayments, setDebtPayments] = useState({
    personalLoan: "8000",
    carLoan: "0",
    creditCard: "0",
    studentLoan: "0",
    installment: "0",
    other: "0",
  })
  const [purchaseCosts, setPurchaseCosts] = useState({
    renovation: "300000",
    utilities: "80000",
    furniture: "150000",
    taxFees: "70000",
    moving: "30000",
    insurance: "30000",
    emergency: "100000",
    other: "0",
  })

  const values = useMemo(() => {
    const price = toPositiveNumber(homePrice)
    const selfFund = toPositiveNumber(downPayment)
    const principal = Math.max(0, price - selfFund)
    const rate = toPositiveNumber(annualRate)
    const subsidy = mode === "youth" ? toPositiveNumber(subsidyRate) : 0
    const effectiveRate = Math.max(0, rate - subsidy)
    const years = toPositiveNumber(loanYears)
    const grace = Math.min(toPositiveNumber(graceYears), years)
    const income = toPositiveNumber(monthlyIncome)
    const costs = sumRecord(livingCosts)
    const debts = sumRecord(debtPayments)
    const purchaseCost = sumRecord(purchaseCosts)
    const totalMonths = years * 12
    const graceMonths = grace * 12
    const repaymentMonths = Math.max(1, totalMonths - graceMonths)
    const gracePayment = Math.ceil((principal * (effectiveRate / 100)) / 12)
    const postGracePayment = calculatePayment(principal, effectiveRate, repaymentMonths)
    const noSubsidyPayment = calculatePayment(principal, rate, repaymentMonths)
    const monthlyPressure = income ? clampPercent((postGracePayment / income) * 100) : 0
    const cashAfterMortgage = income - costs - debts - postGracePayment
    const estimatedTotalInterest = Math.max(0, postGracePayment * repaymentMonths + gracePayment * graceMonths - principal)
    const totalPrepare = selfFund + purchaseCost
    const loanRatio = price ? clampPercent((principal / price) * 100) : 0
    const subsidyDifference = Math.max(0, noSubsidyPayment - postGracePayment)

    return {
      price,
      selfFund,
      principal,
      rate,
      subsidy,
      effectiveRate,
      years,
      grace,
      income,
      costs,
      debts,
      purchaseCost,
      repaymentMonths,
      gracePayment,
      postGracePayment,
      noSubsidyPayment,
      monthlyPressure,
      cashAfterMortgage,
      estimatedTotalInterest,
      totalPrepare,
      loanRatio,
      subsidyDifference,
    }
  }, [
    annualRate,
    debtPayments,
    downPayment,
    graceYears,
    homePrice,
    livingCosts,
    loanYears,
    mode,
    monthlyIncome,
    purchaseCosts,
    subsidyRate,
  ])

  const reset = () => {
    const isYouth = mode === "youth"
    setHomePrice(isYouth ? "12000000" : "15000000")
    setDownPayment(isYouth ? "2400000" : "3000000")
    setAnnualRate(isYouth ? "1.775" : "2.2")
    setSubsidyRate("0.375")
    setLoanYears(isYouth ? "40" : "30")
    setGraceYears(isYouth ? "5" : "2")
    setMonthlyIncome("90000")
    setLivingCosts({
      food: "18000",
      clothing: "3000",
      housing: "0",
      transport: "6000",
      education: "5000",
      leisure: "3000",
      telecom: "2000",
      insurance: "5000",
    })
    setDebtPayments({
      personalLoan: "8000",
      carLoan: "0",
      creditCard: "0",
      studentLoan: "0",
      installment: "0",
      other: "0",
    })
    setPurchaseCosts({
      renovation: "300000",
      utilities: "80000",
      furniture: "150000",
      taxFees: "70000",
      moving: "30000",
      insurance: "30000",
      emergency: "100000",
      other: "0",
    })
  }

  const switchMode = (nextMode: MortgageMode) => {
    setMode(nextMode)
    if (nextMode === "youth") {
      setHomePrice("12000000")
      setDownPayment("2400000")
      setAnnualRate("1.775")
      setLoanYears("40")
      setGraceYears("5")
    } else {
      setHomePrice("15000000")
      setDownPayment("3000000")
      setAnnualRate("2.2")
      setLoanYears("30")
      setGraceYears("2")
    }
  }

  const scrollToInputs = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const printResult = () => {
    window.print()
  }

  const resultIntro =
    mode === "youth"
      ? `補貼期間估計月付約 ${money.format(values.postGracePayment)}，補貼結束後可能增加約 ${money.format(values.subsidyDifference)}。`
      : `寬限期後每月約需繳 ${money.format(values.postGracePayment)}，約占家庭月收入 ${number.format(values.monthlyPressure)}%。`

  const nextStepTips =
    mode === "youth"
      ? [
          "先確認資格：名下是否有自有住宅、是否曾使用相關專案，需請承辦銀行確認。",
          "不要只看補貼期間：補貼結束後、寬限期結束後，月付都可能上升。",
          "把買房準備預算一次列出：頭期款、稅費、裝修、搬家與保險都要放進準備金。",
        ]
      : [
          "準備買房：先看頭期款外的預算，再看寬限期後月付是否可承受。",
          "已有房貸：確認目前利率、剩餘期數與轉貸費用，再比較是否值得調整。",
          "已有其他債務：把信貸、車貸、信用卡月付一起算進家庭現金流。",
        ]

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 rounded-2xl border border-border bg-card/85 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Home className="h-4 w-4" />
                {mode === "youth" ? "新青安情境草稿" : "房貸工具草稿"}
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {mode === "youth" ? "新青安與房貸負擔試算" : "房貸月付與家庭負擔試算"}
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                輸入房價、自備款、利率與家庭收支，看看月付金、寬限期後壓力，以及生活預算是否還留得住。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/70 p-2 text-center">
              <div className="min-w-20 px-2 py-2">
                <p className="text-xs text-muted-foreground">貸款額</p>
                <p className="text-sm font-semibold text-foreground">{money.format(values.principal)}</p>
              </div>
              <div className="min-w-20 border-x border-border px-2 py-2">
                <p className="text-xs text-muted-foreground">利率</p>
                <p className="text-sm font-semibold text-foreground">{values.effectiveRate}%</p>
              </div>
              <div className="min-w-20 px-2 py-2">
                <p className="text-xs text-muted-foreground">月付</p>
                <p className="text-sm font-semibold text-foreground">{money.format(values.postGracePayment)}</p>
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
              <h2 className="text-2xl font-bold text-foreground">買房或房貸資料通常在哪裡看？</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              可以從銀行房貸試算、貸款合約、建案估價單、銀行 APP 或網路銀行找起。
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">合約、估價單或銀行試算</h3>
                  <p className="text-sm text-muted-foreground">找房價、自備款、貸款成數、利率、年限與寬限期。</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">房貸資料示意</p>
                    <p className="text-sm font-semibold text-foreground">買房與貸款摘要</p>
                  </div>
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">房屋總價</span>
                    <span className="text-sm font-bold text-foreground">{money.format(values.price)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">自備款 / 貸款成數</span>
                    <span className="text-sm font-bold text-foreground">
                      {money.format(values.selfFund)} / {number.format(values.loanRatio)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">利率 / 年限 / 寬限期</span>
                    <span className="text-sm font-bold text-foreground">
                      {values.effectiveRate}% / {number.format(values.years)} 年 / {number.format(values.grace)} 年
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
                  <h3 className="font-semibold text-foreground">銀行 APP 或網路銀行</h3>
                  <p className="text-sm text-muted-foreground">已有房貸時，可查餘額、利率、剩餘期數與繳款紀錄。</p>
                </div>
              </div>

              <div className="mx-auto max-w-xs rounded-[1.75rem] border border-border bg-foreground p-2 shadow-sm">
                <div className="rounded-[1.35rem] bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">房貸</p>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">APP 示意</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">首頁</div>
                    <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">房貸 / 帳務查詢</p>
                      <p className="text-xs text-muted-foreground">看本金餘額、利率、期數</p>
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">繳款明細 / 提前清償</p>
                      <p className="text-xs text-muted-foreground">看轉貸或提前還款資訊</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-background/80 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">填寫前先懂 3 件事</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "寬限期不是不用繳",
                  text: "寬限期多半只繳利息，寬限期後月付金可能明顯上升。",
                },
                {
                  title: "頭期款外還有預算",
                  text: "稅費、代書、仲介、裝修、搬家與保險，都會影響買房準備金。",
                },
                {
                  title: "看家庭現金流",
                  text: "房貸不是只看買不買得起，也要看扣掉生活費後還剩多少。",
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
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">先選試算情境</h2>
                      <p className="text-sm text-muted-foreground">一般房貸與新青安用同一套欄位比較。</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { id: "standard", label: "一般房貸" },
                    { id: "youth", label: "新青安" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => switchMode(option.id as MortgageMode)}
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

                {mode === "youth" && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">我是否符合基本條件？</h3>
                    </div>
                    <div className="grid gap-2">
                      {[
                        "借款人已成年。",
                        "本人、配偶與未成年子女名下沒有自有住宅。",
                        "購買標的通常需為住宅成屋，預售屋適用性要再確認。",
                        "是否曾使用過青安或新青安相關專案，需請銀行確認。",
                      ].map((item) => (
                        <div key={item} className="flex gap-2 rounded-lg bg-card px-3 py-2">
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      這裡先做自我檢核，實際資格、額度與利率仍要以財政部國庫署及承辦銀行最新公告為準。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/95">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                    <Banknote className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">買房與貸款資料</h2>
                    <p className="text-sm text-muted-foreground">先填房價、自備款、利率與貸款年限。</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">房屋總價</span>
                    <Input inputMode="numeric" value={homePrice} onChange={(event) => setHomePrice(event.target.value)} className="h-12 text-base" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">自備款 / 頭期款</span>
                    <Input inputMode="numeric" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} className="h-12 text-base" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">房貸年利率</span>
                    <Input inputMode="decimal" value={annualRate} onChange={(event) => setAnnualRate(event.target.value)} className="h-12 text-base" />
                  </label>
                  {mode === "youth" && (
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-foreground">新青安補貼利率</span>
                      <Input inputMode="decimal" value={subsidyRate} onChange={(event) => setSubsidyRate(event.target.value)} className="h-12 text-base" />
                    </label>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-foreground">貸款年限</span>
                      <Input inputMode="numeric" value={loanYears} onChange={(event) => setLoanYears(event.target.value)} className="h-12 text-base" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-foreground">寬限期（年）</span>
                      <Input inputMode="numeric" value={graceYears} onChange={(event) => setGraceYears(event.target.value)} className="h-12 text-base" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/95">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <PiggyBank className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">家庭負擔資料</h2>
                    <p className="text-sm text-muted-foreground">看房貸會不會壓縮生活與其他債務。</p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-foreground">家庭每月收入</span>
                    <Input inputMode="numeric" value={monthlyIncome} onChange={(event) => setMonthlyIncome(event.target.value)} className="h-12 text-base" />
                  </label>

                  <Accordion type="multiple" defaultValue={["living"]} className="grid gap-3">
                    <AccordionItem value="living" className="rounded-xl border border-border bg-background/70 px-4">
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex w-full flex-col gap-1 pr-3 text-left sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">每月必要生活費</h3>
                            <p className="text-sm leading-6 text-muted-foreground">先把食、衣、住、行、育、樂等固定支出拆開看。</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">小計 {money.format(values.costs)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {livingCostFields.map((field) => (
                            <label key={field.key} className="grid gap-1.5 rounded-lg bg-card px-3 py-3">
                              <span className="text-sm font-medium text-foreground">{field.label}</span>
                              <span className="text-xs text-muted-foreground">{field.hint}</span>
                              <Input
                                inputMode="numeric"
                                value={livingCosts[field.key]}
                                onChange={(event) =>
                                  setLivingCosts((current) => ({ ...current, [field.key]: event.target.value }))
                                }
                                className="h-10 text-base"
                              />
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="debt" className="rounded-xl border border-border bg-background/70 px-4">
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex w-full flex-col gap-1 pr-3 text-left sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">其他債務月付金</h3>
                            <p className="text-sm leading-6 text-muted-foreground">房貸之外，信貸、車貸、信用卡也要一起算。</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">小計 {money.format(values.debts)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {debtPaymentFields.map((field) => (
                            <label key={field.key} className="grid gap-1.5 rounded-lg bg-card px-3 py-3">
                              <span className="text-sm font-medium text-foreground">{field.label}</span>
                              <span className="text-xs text-muted-foreground">{field.hint}</span>
                              <Input
                                inputMode="numeric"
                                value={debtPayments[field.key]}
                                onChange={(event) =>
                                  setDebtPayments((current) => ({ ...current, [field.key]: event.target.value }))
                                }
                                className="h-10 text-base"
                              />
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="purchase" className="rounded-xl border border-border bg-background/70 px-4">
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <div className="flex w-full flex-col gap-1 pr-3 text-left sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">買房準備預算</h3>
                            <p className="text-sm leading-6 text-muted-foreground">把頭期款之外，入住前後要準備的預算先列出來。</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">預算小計 {money.format(values.purchaseCost)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {purchaseCostFields.map((field) => (
                            <label key={field.key} className="grid gap-1.5 rounded-lg bg-card px-3 py-3">
                              <span className="text-sm font-medium text-foreground">{field.label}</span>
                              <span className="text-xs text-muted-foreground">{field.hint}</span>
                              <Input
                                inputMode="numeric"
                                value={purchaseCosts[field.key]}
                                onChange={(event) =>
                                  setPurchaseCosts((current) => ({ ...current, [field.key]: event.target.value }))
                                }
                                className="h-10 text-base"
                              />
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
                  目前試算方式：{mode === "youth" ? "新青安情境" : "一般房貸情境"}，貸款金額 {money.format(values.principal)}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">寬限期月付</p>
                    <p className="text-xl font-bold text-foreground">{money.format(values.gracePayment)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">寬限期後月付</p>
                    <p className="text-xl font-bold text-foreground">{money.format(values.postGracePayment)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">估計總利息</p>
                    <p className="text-xl font-bold text-foreground">{money.format(values.estimatedTotalInterest)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">房貸占收入比例</p>
                    <p className="text-2xl font-bold text-foreground">{number.format(values.monthlyPressure)}%</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">比例越高，生活費和緊急預備金越容易被壓縮。</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">每月剩餘現金</p>
                    <p className="text-2xl font-bold text-foreground">{money.format(values.cashAfterMortgage)}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">收入扣掉生活費、其他債務和房貸後的估計金額。</p>
                  </div>
                </div>

                {mode === "youth" && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">新青安要多看這幾個時間點</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-card px-3 py-3">
                        <p className="mb-1 text-sm font-semibold text-foreground">補貼期間</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          用補貼後利率估算，月付約 {money.format(values.postGracePayment)}。
                        </p>
                      </div>
                      <div className="rounded-lg bg-card px-3 py-3">
                        <p className="mb-1 text-sm font-semibold text-foreground">補貼結束後</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          若回到原利率，月付可能增加約 {money.format(values.subsidyDifference)}。
                        </p>
                      </div>
                      <div className="rounded-lg bg-card px-3 py-3">
                        <p className="mb-1 text-sm font-semibold text-foreground">寬限期後</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          從只繳息變成本息攤還，月付會從 {money.format(values.gracePayment)} 變高。
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-primary">
                      不要只看前幾年月付比較低，也要一起看補貼結束、寬限期結束後，家庭現金流還撐不撐得住。
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">買房前要一起看的預算</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-card px-3 py-3">
                      <p className="mb-1 text-sm font-semibold text-foreground">準備金額</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        自備款加上買房準備預算，約需 {money.format(values.totalPrepare)}。
                      </p>
                    </div>
                    <div className="rounded-lg bg-card px-3 py-3">
                      <p className="mb-1 text-sm font-semibold text-foreground">寬限期後</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        寬限期後從只繳息轉為本息攤還，月付可能明顯上升。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-semibold text-foreground">多準備一點的差別</h3>
                    </div>
                    <p className="text-sm leading-6 text-emerald-950">
                      若提高自備款，貸款額會下降，月付金和總利息也會跟著下降。
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold text-foreground">需要留意的訊號</h3>
                    </div>
                    <p className="text-sm leading-6 text-sky-950">
                      如果房貸占收入比例偏高，或每月剩餘現金太少，可以先調整房價、自備款或年限。
                    </p>
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
                  <span className="text-sm font-medium text-foreground">換一個房價或自備款再試</span>
                </button>
                <Link
                  href="/toolbox#debt-calculation"
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">把其他債務也一起整理</span>
                </Link>
                <button
                  type="button"
                  onClick={printResult}
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <Printer className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">列印或另存 PDF，和家人討論</span>
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
                <Button className="sm:w-auto" onClick={() => setDownPayment(String(values.selfFund + 500000))}>
                  自備款多 50 萬試試 <ArrowRight className="ml-2 h-4 w-4" />
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
                {nextStepTips.map((item) => (
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
