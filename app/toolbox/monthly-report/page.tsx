"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Download,
  FileText,
  Printer,
  Save,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VoiceInputDraft } from "@/app/toolbox/_components/voice-input-draft"

type ReportMode = "family" | "personal" | "business"
type ReportPeriod = "month" | "halfYear" | "year"

type ReportRow = {
  label: string
  amount: number
  source?: string
  href?: string
  actionLabel?: string
}

const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
})

const periodMultiplier: Record<ReportPeriod, number> = {
  month: 1,
  halfYear: 6,
  year: 12,
}

const periodLabels: Record<ReportPeriod, string> = {
  month: "月報",
  halfYear: "半年報",
  year: "年報",
}

const healthDashboardHref = "/toolbox/financial-health-dashboard"

const baseReports = {
  family: {
    title: "家庭財務報表",
    dateLabel: "2026 年 7 月",
    income: [
      { label: "工作與薪酬收入", amount: 58000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "非主要工作收入", amount: 5000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "個人租賃收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "投資收益", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "退休金/年金", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "個人政府補助", amount: 5000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "親友贈與與繼承", amount: 4000, source: "記帳助理 / 家庭資料", href: "/personal-center#member-data-summary" },
      { label: "個人資產出售收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "非工作獎金與獎項", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "其他生活收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    livingExpense: [
      { label: "食", amount: 12800, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "衣", amount: 2600, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "住", amount: 10800, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "行", amount: 5400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "育", amount: 4200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "樂", amount: 2500, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "電信", amount: 2100, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "保險", amount: 3400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "醫療", amount: 1500, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "其他", amount: 2500, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    debtPayment: [
      { label: "信用卡每月還款", amount: 5000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "信貸每月還款", amount: 3800, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "房貸每月還款", amount: 0, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "車貸每月還款", amount: 3200, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "親友借款每月還款", amount: 2600, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他還款", amount: 2200, source: "債務盤點", href: "/toolbox/debt" },
    ],
    savings: [
      { label: "緊急預備金", amount: 3000, source: "生活目標財務規劃", href: "/toolbox/planning" },
      { label: "孩子教育費準備", amount: 2000, source: "生活目標財務規劃", href: "/toolbox/planning" },
      { label: "一般儲蓄", amount: 1500, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    businessIncome: [
      { label: "商品銷售收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "服務與專案收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "租賃收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "合作與分潤收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "事業資產出售收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "企業補助收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "企業投資收益", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "其他生意收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    businessExpense: [
      { label: "變動生意支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "固定生意支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "額外生意支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    assets: [
      { label: "現金", amount: 18000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "活存／薪轉帳戶", amount: 116000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "定存", amount: 80000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "保單價值／儲蓄險", amount: 92000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "投資現值", amount: 30000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "房屋／土地", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "汽機車估值", amount: 50000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "互助會活會", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "其他資產", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
    ],
    liabilities: [
      { label: "信用卡未繳餘額", amount: 48000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "信貸未還餘額", amount: 158000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "房貸未還餘額", amount: 0, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "車貸未還餘額", amount: 168000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "親友借款未還餘額", amount: 86000, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他負債", amount: 182000, source: "債務盤點", href: "/toolbox/debt" },
    ],
  },
  personal: {
    title: "個人財務報表",
    dateLabel: "2026 年 7 月",
    income: [
      { label: "工作與薪酬收入", amount: 39000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "非主要工作收入", amount: 3000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "個人租賃收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "投資收益", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "退休金/年金", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "個人政府補助", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "親友贈與與繼承", amount: 0, source: "記帳助理 / 家庭資料", href: "/personal-center#member-data-summary" },
      { label: "個人資產出售收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "非工作獎金與獎項", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "其他生活收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    livingExpense: [
      { label: "食", amount: 8200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "衣", amount: 1600, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "住", amount: 6200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "行", amount: 3400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "育", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "樂", amount: 1800, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "電信", amount: 1200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "保險", amount: 2400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "醫療", amount: 900, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "其他", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    debtPayment: [
      { label: "信用卡每月還款", amount: 3000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "信貸每月還款", amount: 4800, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "房貸每月還款", amount: 0, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "車貸每月還款", amount: 0, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "親友借款每月還款", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他還款", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
    ],
    savings: [
      { label: "緊急預備金", amount: 3000, source: "生活目標財務規劃", href: "/toolbox/planning" },
      { label: "一般儲蓄", amount: 1000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "進修或證照準備", amount: 0, source: "生活目標財務規劃", href: "/toolbox/planning" },
    ],
    businessIncome: [
      { label: "商品銷售收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "服務與專案收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "租賃收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "合作與分潤收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "事業資產出售收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "企業補助收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "企業投資收益", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "其他生意收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    businessExpense: [
      { label: "變動生意支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "固定生意支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "額外生意支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    assets: [
      { label: "現金", amount: 12000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "活存／薪轉帳戶", amount: 74000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "定存", amount: 30000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "保單價值／儲蓄險", amount: 26000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "投資現值", amount: 14000, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "房屋／土地", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "汽機車估值", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "互助會活會", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
      { label: "其他資產", amount: 0, source: "月報表資產欄位", href: "/toolbox/monthly-report#monthly-assets", actionLabel: "修改" },
    ],
    liabilities: [
      { label: "信用卡未繳餘額", amount: 28000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "信貸未還餘額", amount: 160000, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "房貸未還餘額", amount: 0, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "車貸未還餘額", amount: 0, source: "債務盤點表", href: "/toolbox/debt" },
      { label: "親友借款未還餘額", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他負債", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
    ],
  },
}

export default function MonthlyReportPage() {
  const [mode, setMode] = useState<ReportMode>(() => getInitialMode())
  const [period, setPeriod] = useState<ReportPeriod>("month")
  const report = mode === "business" ? baseReports.family : baseReports[mode]
  const multiplier = periodMultiplier[period]
  const isBusinessMode = mode === "business"
  const subjectLabel = mode === "personal" ? "個人" : "家庭"
  const assetRows = useMemo(
    () =>
      report.assets.map((row) => ({
        ...row,
        href: `/toolbox/monthly-report?mode=${mode}&period=${period}&asset=${encodeURIComponent(row.label)}#monthly-assets`,
    })),
    [mode, period, report.assets],
  )

  const totals = useMemo(() => {
    const income = sum(report.income) * multiplier
    const livingExpense = sum(report.livingExpense) * multiplier
    const debtPayment = sum(report.debtPayment) * multiplier
    const savings = sum(report.savings) * multiplier
    const businessIncome = sum(report.businessIncome) * multiplier
    const businessExpense = sum(report.businessExpense) * multiplier
    const assets = sum(report.assets)
    const liabilities = sum(report.liabilities)
    const cashBeforeSavings = income - livingExpense - debtPayment
    const cashFlow = cashBeforeSavings - savings

    return {
      income,
      livingExpense,
      debtPayment,
      savings,
      businessIncome,
      businessExpense,
      assets,
      liabilities,
      cashBeforeSavings,
      cashFlow,
      netWorth: assets - liabilities,
    }
  }, [multiplier, report])

  useEffect(() => {
    const syncFromUrl = () => {
      setMode(getInitialMode())
      setPeriod(getInitialPeriod())
    }

    syncFromUrl()
    window.addEventListener("popstate", syncFromUrl)
    return () => window.removeEventListener("popstate", syncFromUrl)
  }, [])

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{report.dateLabel}</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">
                {periodLabels[period]}｜{isBusinessMode ? "公司帳財務報表" : report.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                {isBusinessMode
                  ? "公司帳先獨立看營業收入與營業支出，再視需要帶回家庭現金流一起整理。"
                  : "這份報表整理生活收入、支出、債務還款、儲蓄目標、資產與負債，讓你看見這段時間的現金流與財務全貌。"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SegmentedControl
                value={mode}
                fieldName="mode"
                hiddenFieldName="period"
                hiddenFieldValue="month"
                options={[
                  { value: "family", label: "家庭" },
                  { value: "personal", label: "個人" },
                  { value: "business", label: "公司帳" },
                ]}
                onChange={(value) => setMode(value as ReportMode)}
              />
              <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                月報
              </span>
              <div className="hidden">
                <SegmentedControl
                value={period}
                fieldName="period"
                hiddenFieldName="mode"
                hiddenFieldValue={mode}
                options={[
                  { value: "month", label: "月報" },
                ]}
                onChange={(value) => setPeriod(value as ReportPeriod)}
              />
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/login?role=member&next=%2Fpersonal-center%23member-monthly-report">
                  登入看半年／年報
                </Link>
              </Button>
            </div>
          </div>
          <MonthlyReportSwitchScript />
        </section>

        <VoiceInputDraft
          title="先用一句話補月報表資料"
          description="如果還沒有完整紀錄，可以先用口述方式補上大方向，之後再回到記帳、債務或目標工具確認細項。"
          placeholder="我這個月薪水 58,000 元，兼職 5,000 元，房租 10,000 元，餐費大約 12,000 元，信用卡還款 5,000 元，另外存 3,000 元當預備金。"
          examples={[
            "我這個月收入大約 63,000 元，生活支出約 42,000 元，貸款還 8,000 元",
            "這個月有存 3,000 元緊急預備金，還有孩子教育費準備 2,000 元",
            "家裡收入主要是薪水和補助，支出最大是房租、餐費和交通",
          ]}
        />

        <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {isBusinessMode ? (
              <>
                <ReportSectionIntro
                  eyebrow="公司帳"
                  title="營業收入與營業支出"
                  description="這裡只看自營、接案或小生意的收支，避免和家庭生活費混在一起。"
                />
                <ReportTable title="營業收入" rows={scaleRows(report.businessIncome, multiplier)} total={totals.businessIncome} />
                <ReportTable title="營業支出" rows={scaleRows(report.businessExpense, multiplier)} total={totals.businessExpense} />
              </>
            ) : (
              <>
                <ReportSectionIntro
                  eyebrow="現金流量表"
                  title="這段時間的錢怎麼進來、怎麼出去"
                  description={`先看${subjectLabel}生活收入，再把本月現金流出分成生活支出、債務還款、儲蓄與目標準備，知道這段時間最後留下多少現金。`}
                />
                <ReportTable title={`${subjectLabel}生活收入`} rows={scaleRows(report.income, multiplier)} total={totals.income} />
                <OutflowGuide
                  livingExpense={totals.livingExpense}
                  debtPayment={totals.debtPayment}
                  savings={totals.savings}
                />
                <ReportTable
                  title="生活支出"
                  description="日常生活真的花掉的錢，例如食、衣、住、行、育、樂、電信、保險與醫療。"
                  rows={scaleRows(report.livingExpense, multiplier)}
                  total={totals.livingExpense}
                />
                <ReportTable
                  title="債務還款"
                  description="每月用來降低負債或維持還款的金額，會同時影響現金流與負債餘額。"
                  rows={scaleRows(report.debtPayment, multiplier)}
                  total={totals.debtPayment}
                />
                <ReportTable
                  title="儲蓄與目標準備"
                  description="不是消費，而是把錢先留給未來，例如預備金、教育費、搬家或退休準備。"
                  rows={scaleRows(report.savings, multiplier)}
                  total={totals.savings}
                />

                <ReportSectionIntro
                  eyebrow="資產負債表"
                  title="目前累積了什麼，也還欠多少"
                  description="資產可以先在月報表裡用大概金額整理；負債則回到債務盤點確認細項。"
                />
                <ReportTable
                  id="monthly-assets"
                  title="資產"
                  description="目前手上或名下累積的錢與資源，例如現金、存款、保險、投資、車輛或其他可估算價值的資產。"
                  rows={assetRows}
                  total={totals.assets}
                  tableActionLabel="新增資產項目"
                  tableActionHref="/toolbox/monthly-report#monthly-assets"
                />
                <ReportTable
                  title="負債"
                  description="目前還需要慢慢還的金額，例如信用卡、信貸、房貸、車貸、親友借款或其他債務餘額。"
                  rows={report.liabilities}
                  total={totals.liabilities}
                />
              </>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-border">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-foreground">{isBusinessMode ? "公司帳摘要" : "報表摘要"}</h2>
                <div className="mt-4 space-y-3">
                  {isBusinessMode ? (
                    <>
                      <AmountLine label="營業收入" value={totals.businessIncome} />
                      <AmountLine label="營業支出" value={totals.businessExpense} />
                      <AmountLine
                        label="公司帳結餘"
                        value={totals.businessIncome - totals.businessExpense}
                        strong
                      />
                    </>
                  ) : (
                    <>
                      <AmountLine label="收入合計" value={totals.income} />
                      <AmountLine label="現金流出合計" value={totals.livingExpense + totals.debtPayment + totals.savings} />
                      <AmountLine label="其中：生活支出" value={totals.livingExpense} />
                      <AmountLine label="其中：債務還款" value={totals.debtPayment} />
                      <AmountLine label="儲蓄前現金流" value={totals.cashBeforeSavings} />
                      <AmountLine label="其中：儲蓄與目標準備" value={totals.savings} />
                      <AmountLine label="儲蓄後現金流" value={totals.cashFlow} strong />
                      <AmountLine label="資產總額" value={totals.assets} />
                      <AmountLine label="負債總額" value={totals.liabilities} />
                      <AmountLine label="淨值" value={totals.netWorth} strong />
                    </>
                  )}
                </div>
                {!isBusinessMode && (
                  <Button asChild className="mt-5 w-full">
                    <Link href={healthDashboardHref}>
                      <ShieldCheck className="h-4 w-4" />
                      查看財務健康安全儀表板
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-foreground">匯出報表</h2>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4" />
                    列印
                  </Button>
                </div>
                <Button className="mt-3 w-full">
                  <Save className="h-4 w-4" />
                  保存到我的財務與生活
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-foreground">接著可以看</h2>
                <div className="mt-4 space-y-2">
                  <SideLink href="/toolbox/accounting" label="修改記帳紀錄" />
                  <SideLink href="/toolbox/debt" label="查看債務盤點" />
                  <SideLink href="/personal-center#member-data-summary" label="補家庭資料" />
                  <SideLink href="/online-consultation" label="預約免費諮詢" />
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
      <AssetEditDialog />
      <AssetEditDialogScript />
    </main>
  )
}

function sum(rows: ReportRow[]) {
  return rows.reduce((total, row) => total + row.amount, 0)
}

function getInitialMode(): ReportMode {
  if (typeof window === "undefined") return "family"
  const mode = new URLSearchParams(window.location.search).get("mode")
  return mode === "personal" || mode === "business" ? mode : "family"
}

function getInitialPeriod(): ReportPeriod {
  return "month"
}

function scaleRows(rows: ReportRow[], multiplier: number) {
  return rows.map((row) => ({ ...row, amount: row.amount * multiplier }))
}

function SegmentedControl({
  value,
  fieldName,
  hiddenFieldName,
  hiddenFieldValue,
  options,
  onChange,
}: {
  value: string
  fieldName: string
  hiddenFieldName: string
  hiddenFieldValue: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex rounded-full border border-border bg-muted/40 p-1">
      {options.map((option) => (
        <a
          key={option.value}
          href={`/toolbox/monthly-report?${fieldName}=${option.value}&${hiddenFieldName}=${hiddenFieldValue}`}
          data-monthly-report-switch="true"
          data-monthly-report-field={fieldName}
          data-monthly-report-value={option.value}
          data-monthly-report-hidden-field={hiddenFieldName}
          data-monthly-report-hidden-value={hiddenFieldValue}
          onClick={() => {
            onChange(option.value)
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === option.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          {option.label}
        </a>
      ))}
    </div>
  )
}

function MonthlyReportSwitchScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (() => {
            if (window.__monthlyReportSwitchReady) return;
            window.__monthlyReportSwitchReady = true;
            document.addEventListener("click", (event) => {
              const link = event.target.closest("[data-monthly-report-switch='true']");
              if (!link) return;
              event.preventDefault();
              const params = new URLSearchParams();
              params.set(link.dataset.monthlyReportField, link.dataset.monthlyReportValue);
              params.set(link.dataset.monthlyReportHiddenField, link.dataset.monthlyReportHiddenValue);
              window.location.href = "/toolbox/monthly-report?" + params.toString();
            }, true);
          })();
        `,
      }}
    />
  )
}

function ReportSectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function OutflowGuide({
  livingExpense,
  debtPayment,
  savings,
}: {
  livingExpense: number
  debtPayment: number
  savings: number
}) {
  const items = [
    {
      title: "生活支出",
      value: livingExpense,
    },
    {
      title: "債務還款",
      value: debtPayment,
    },
    {
      title: "儲蓄與目標準備",
      value: savings,
    },
  ]

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">本月現金流出</p>
          <h3 className="text-lg font-bold text-foreground">錢出去，但用途不一樣</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          合計 {money.format(livingExpense + debtPayment + savings)}
        </p>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{money.format(item.value)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportTable({
  id,
  title,
  rows,
  total,
  description = "展開查看細項，或回到原工具修改。",
  tableActionLabel,
  tableActionHref,
}: {
  id?: string
  title: string
  rows: ReportRow[]
  total: number
  description?: string
  tableActionLabel?: string
  tableActionHref?: string
}) {
  return (
    <Card id={id} className="scroll-mt-24 border-border">
      <CardContent className="p-0">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-foreground">{money.format(total)}</span>
              <span className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-primary group-open:bg-primary group-open:text-primary-foreground">
                明細
              </span>
            </div>
          </summary>
          <div className="overflow-x-auto border-t border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-muted/35 text-left text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">項目</th>
                  <th className="px-5 py-3 text-right font-semibold">金額</th>
                  <th className="px-5 py-3 text-right font-semibold">查看／修改</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-border/70">
                    <td className="px-5 py-3 font-medium text-foreground">{row.label}</td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">{money.format(row.amount)}</td>
                    <td className="px-5 py-3 text-right">
                      {row.actionLabel ? (
                        <button
                          type="button"
                          data-asset-edit="true"
                          data-asset-label={row.label}
                          data-asset-amount={row.amount}
                          className="font-semibold text-primary"
                        >
                          {row.actionLabel || "修改"}
                        </button>
                      ) : (
                        <Link href={row.href || "/personal-center#member-data-summary"} className="font-semibold text-primary">
                          {row.actionLabel || "修改"}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {tableActionLabel && tableActionHref && (
                  <tr className="border-t border-border">
                    <td className="px-5 py-3" colSpan={3}>
                      <Link href={tableActionHref} className="inline-flex items-center gap-1 font-semibold text-primary">
                        {tableActionLabel} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                )}
                <tr className="border-t border-border bg-muted/25">
                  <td className="px-5 py-3 font-bold text-foreground">小計</td>
                  <td className="px-5 py-3 text-right font-bold text-foreground">{money.format(total)}</td>
                  <td className="px-5 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}

const assetEditDialogScript = [
  '(() => {',
  '  if (window.__assetEditDialogReady) return;',
  '  window.__assetEditDialogReady = true;',
  '  const findDialog = () => document.getElementById("asset-edit-dialog");',
  '  const setValue = (selector, value) => {',
  '    const element = document.querySelector(selector);',
  '    if (element) element.value = value || "";',
  '  };',
  '  const setText = (selector, value) => {',
  '    const element = document.querySelector(selector);',
  '    if (element) element.textContent = value || "\u8cc7\u7522\u9805\u76ee";',
  '  };',
  '  const updateAssetParam = (label) => {',
  '    const params = new URLSearchParams(window.location.search);',
  '    if (label) params.set("asset", label);',
  '    else params.delete("asset");',
  '    const query = params.toString();',
  '    window.history.replaceState(null, "", "/toolbox/monthly-report" + (query ? "?" + query : "") + "#monthly-assets");',
  '  };',
  '  const openDialog = (label, amount, updateUrl = true) => {',
  '    const dialog = findDialog();',
  '    if (!dialog) return;',
  '    setText("[data-asset-dialog-title]", label);',
  '    setValue("[data-asset-dialog-name]", label);',
  '    setValue("[data-asset-dialog-amount]", amount);',
  '    dialog.classList.remove("hidden");',
  '    dialog.classList.add("flex");',
  '    dialog.setAttribute("aria-hidden", "false");',
  '    document.body.style.overflow = "hidden";',
  '    if (updateUrl) updateAssetParam(label);',
  '  };',
  '  const closeDialog = () => {',
  '    const dialog = findDialog();',
  '    if (!dialog) return;',
  '    dialog.classList.add("hidden");',
  '    dialog.classList.remove("flex");',
  '    dialog.setAttribute("aria-hidden", "true");',
  '    document.body.style.overflow = "";',
  '    updateAssetParam(null);',
  '  };',
  '  document.addEventListener("click", (event) => {',
  '    const editButton = event.target.closest("[data-asset-edit=\'true\']");',
  '    if (editButton) {',
  '      event.preventDefault();',
  '      openDialog(editButton.dataset.assetLabel, editButton.dataset.assetAmount);',
  '      return;',
  '    }',
  '    if (event.target.closest("[data-asset-dialog-close=\'true\']")) {',
  '      event.preventDefault();',
  '      closeDialog();',
  '    }',
  '  }, true);',
  '  document.addEventListener("keydown", (event) => {',
  '    if (event.key === "Escape") closeDialog();',
  '  });',
  '  const initialAsset = new URLSearchParams(window.location.search).get("asset");',
  '  if (initialAsset) {',
  '    const buttons = Array.from(document.querySelectorAll("[data-asset-edit=\'true\']"));',
  '    const matchedButton = buttons.find((button) => button.dataset.assetLabel === initialAsset);',
  '    openDialog(initialAsset, matchedButton?.dataset.assetAmount || "", false);',
  '  }',
  '})();',
].join("\n")

function AssetEditDialog() {
  return (
    <div
      id="asset-edit-dialog"
      className="fixed inset-0 z-50 hidden items-center justify-center bg-foreground/35 px-4"
      aria-hidden="true"
    >
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">{"\u4fee\u6539\u8cc7\u7522\u9805\u76ee"}</p>
            <h2 data-asset-dialog-title className="mt-1 text-2xl font-bold text-foreground">
              {"\u8cc7\u7522\u9805\u76ee"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {"\u5982\u679c\u73fe\u5728\u9084\u4e0d\u78ba\u5b9a\u7cbe\u6e96\u91d1\u984d\uff0c\u5148\u586b\u5927\u6982\u6578\u5b57\u4e5f\u53ef\u4ee5\uff0c\u4e4b\u5f8c\u518d\u56de\u4f86\u8abf\u6574\u3002"}
            </p>
          </div>
          <button
            type="button"
            data-asset-dialog-close="true"
            className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            {"\u95dc\u9589"}
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground">{"\u9805\u76ee\u540d\u7a31"}</span>
            <input
              data-asset-dialog-name
              readOnly
              className="mt-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-foreground"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">{"\u76ee\u524d\u91d1\u984d\uff08NT$\uff09"}</span>
            <input
              data-asset-dialog-amount
              inputMode="numeric"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">{"\u5099\u8a3b"}</span>
            <input
              placeholder={"\u4f8b\u5982\uff1a\u85aa\u8f49\u5e33\u6236\u3001\u4fdd\u55ae\u89e3\u7d04\u91d1\u3001\u8eca\u8f1b\u4f30\u503c\u4f86\u6e90"}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" data-asset-dialog-close="true">
            {"\u53d6\u6d88"}
          </Button>
          <Button type="button" data-asset-dialog-close="true">
            {"\u5132\u5b58\u4fee\u6539"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function AssetEditDialogScript() {
  return <script dangerouslySetInnerHTML={{ __html: assetEditDialogScript }} />
}

function AmountLine({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-2 last:border-0 last:pb-0">
      <span className={strong ? "font-semibold text-foreground" : "text-sm text-muted-foreground"}>{label}</span>
      <span className={strong ? "text-lg font-bold text-foreground" : "text-sm font-semibold text-foreground"}>
        {money.format(value)}
      </span>
    </div>
  )
}

function SideLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" className="w-full justify-between">
      <Link href={href}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}
