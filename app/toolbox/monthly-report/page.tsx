"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Download,
  FileText,
  Landmark,
  PiggyBank,
  Printer,
  ReceiptText,
  Save,
  ShieldCheck,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ReportMode = "family" | "personal"
type ReportPeriod = "month" | "halfYear" | "year"

type ReportRow = {
  label: string
  amount: number
  source?: string
  href?: string
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

const healthDashboardHref =
  "https://www.familyfinhealth.com/toolbox/financial-calculator?tab=financial-calculator&subTab=accounting&accountingTab=3&tool=financial-health-dashboard"

const baseReports = {
  family: {
    title: "家庭財務報表",
    dateLabel: "2026 年 7 月",
    income: [
      { label: "工資收入", amount: 58000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "非工資收入", amount: 5000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "家人提供", amount: 4000, source: "家庭資料", href: "/personal-center#member-data-summary" },
      { label: "低收、身障或其他補助", amount: 5000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "借款收入", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
      { label: "其他收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    livingExpense: [
      { label: "食", amount: 12800, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "衣", amount: 2600, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "住", amount: 10800, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "行", amount: 5400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "育", amount: 4200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "樂", amount: 2500, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "通訊", amount: 2100, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "保險", amount: 3400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "醫療", amount: 1500, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "孝養與照顧支出", amount: 2500, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    debtPayment: [
      { label: "信用卡每月還款", amount: 5000, source: "信用卡工具 / 債務盤點", href: "/toolbox/credit-card" },
      { label: "信貸每月還款", amount: 3800, source: "信貸工具 / 債務盤點", href: "/toolbox/personal-loan" },
      { label: "房貸每月還款", amount: 0, source: "房貸工具 / 債務盤點", href: "/toolbox/mortgage" },
      { label: "車貸每月還款", amount: 3200, source: "車貸工具 / 債務盤點", href: "/toolbox/car-loan" },
      { label: "親友借款每月還款", amount: 2600, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他還款", amount: 2200, source: "債務盤點", href: "/toolbox/debt" },
    ],
    savings: [
      { label: "緊急預備金", amount: 3000, source: "生活目標財務規劃", href: "/toolbox/planning" },
      { label: "孩子教育費準備", amount: 2000, source: "生活目標財務規劃", href: "/toolbox/planning" },
      { label: "一般儲蓄", amount: 1500, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    businessIncome: [
      { label: "營業額", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "其他營業收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    businessExpense: [
      { label: "營業固定支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "店租、水電與固定成本", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "進貨、原物料與變動成本", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    assets: [
      { label: "現金", amount: 18000, source: "資產資料" },
      { label: "活存", amount: 116000, source: "資產資料" },
      { label: "定存", amount: 80000, source: "資產資料" },
      { label: "壽險與儲蓄險", amount: 92000, source: "資產資料" },
      { label: "投資現值", amount: 30000, source: "資產資料" },
      { label: "汽機車估值", amount: 50000, source: "資產資料" },
      { label: "互助會活會", amount: 0, source: "債務盤點" },
      { label: "其他資產", amount: 0, source: "資產資料" },
    ],
    liabilities: [
      { label: "信用卡未繳餘額", amount: 48000, source: "信用卡工具 / 債務盤點", href: "/toolbox/credit-card" },
      { label: "信貸未還餘額", amount: 158000, source: "信貸工具 / 債務盤點", href: "/toolbox/personal-loan" },
      { label: "房貸未還餘額", amount: 0, source: "房貸工具 / 債務盤點", href: "/toolbox/mortgage" },
      { label: "車貸未還餘額", amount: 168000, source: "車貸工具 / 債務盤點", href: "/toolbox/car-loan" },
      { label: "親友借款未還餘額", amount: 86000, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他負債", amount: 182000, source: "債務盤點", href: "/toolbox/debt" },
    ],
  },
  personal: {
    title: "個人財務報表",
    dateLabel: "2026 年 7 月",
    income: [
      { label: "工資收入", amount: 39000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "非工資收入", amount: 3000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "家人提供", amount: 0, source: "家庭資料", href: "/personal-center#member-data-summary" },
      { label: "低收、身障或其他補助", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "借款收入", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
      { label: "其他收入", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    livingExpense: [
      { label: "食", amount: 8200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "衣", amount: 1600, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "住", amount: 6200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "行", amount: 3400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "育", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "樂", amount: 1800, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "通訊", amount: 1200, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "保險", amount: 2400, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "醫療", amount: 900, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "孝養與照顧支出", amount: 0, source: "記帳助理", href: "/toolbox/accounting" },
    ],
    debtPayment: [
      { label: "信用卡每月還款", amount: 3000, source: "信用卡工具 / 債務盤點", href: "/toolbox/credit-card" },
      { label: "信貸每月還款", amount: 4800, source: "信貸工具 / 債務盤點", href: "/toolbox/personal-loan" },
      { label: "房貸每月還款", amount: 0, source: "房貸工具 / 債務盤點", href: "/toolbox/mortgage" },
      { label: "車貸每月還款", amount: 0, source: "車貸工具 / 債務盤點", href: "/toolbox/car-loan" },
      { label: "親友借款每月還款", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他還款", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
    ],
    savings: [
      { label: "緊急預備金", amount: 3000, source: "生活目標財務規劃", href: "/toolbox/planning" },
      { label: "一般儲蓄", amount: 1000, source: "記帳助理", href: "/toolbox/accounting" },
      { label: "進修或證照準備", amount: 0, source: "生活目標財務規劃", href: "/toolbox/planning" },
    ],
    businessIncome: [
      { label: "營業額", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "其他營業收入", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    businessExpense: [
      { label: "營業固定支出", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "店租、水電與固定成本", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
      { label: "進貨、原物料與變動成本", amount: 0, source: "記帳助理-公司帳", href: "/toolbox/accounting" },
    ],
    assets: [
      { label: "現金", amount: 12000, source: "資產資料" },
      { label: "活存", amount: 74000, source: "資產資料" },
      { label: "定存", amount: 30000, source: "資產資料" },
      { label: "壽險與儲蓄險", amount: 26000, source: "資產資料" },
      { label: "投資現值", amount: 14000, source: "資產資料" },
      { label: "汽機車估值", amount: 0, source: "資產資料" },
      { label: "互助會活會", amount: 0, source: "債務盤點" },
      { label: "其他資產", amount: 0, source: "資產資料" },
    ],
    liabilities: [
      { label: "信用卡未繳餘額", amount: 28000, source: "信用卡工具 / 債務盤點", href: "/toolbox/credit-card" },
      { label: "信貸未還餘額", amount: 160000, source: "信貸工具 / 債務盤點", href: "/toolbox/personal-loan" },
      { label: "房貸未還餘額", amount: 0, source: "房貸工具 / 債務盤點", href: "/toolbox/mortgage" },
      { label: "車貸未還餘額", amount: 0, source: "車貸工具 / 債務盤點", href: "/toolbox/car-loan" },
      { label: "親友借款未還餘額", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
      { label: "當鋪、標會或其他負債", amount: 0, source: "債務盤點", href: "/toolbox/debt" },
    ],
  },
}

export default function MonthlyReportPage() {
  const [mode, setMode] = useState<ReportMode>("family")
  const [period, setPeriod] = useState<ReportPeriod>("month")
  const report = baseReports[mode]
  const multiplier = periodMultiplier[period]

  const totals = useMemo(() => {
    const income = sum(report.income) * multiplier
    const livingExpense = sum(report.livingExpense) * multiplier
    const debtPayment = sum(report.debtPayment) * multiplier
    const savings = sum(report.savings) * multiplier
    const businessIncome = sum(report.businessIncome) * multiplier
    const businessExpense = sum(report.businessExpense) * multiplier
    const assets = sum(report.assets)
    const liabilities = sum(report.liabilities)
    const cashBeforeSavings = income + businessIncome - livingExpense - debtPayment - businessExpense
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

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">{report.dateLabel}</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">{periodLabels[period]}｜{report.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                這份報表彙整收入、支出、債務還款、儲蓄目標、資產與負債，讓你一次看見本月現金流與家庭財務全貌。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SegmentedControl
                value={mode}
                options={[
                  { value: "family", label: "家庭" },
                  { value: "personal", label: "個人" },
                ]}
                onChange={(value) => setMode(value as ReportMode)}
              />
              <SegmentedControl
                value={period}
                options={[
                  { value: "month", label: "月報" },
                  { value: "halfYear", label: "半年" },
                  { value: "year", label: "年報" },
                ]}
                onChange={(value) => setPeriod(value as ReportPeriod)}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard icon={WalletCards} label="總收入" value={totals.income + totals.businessIncome} />
            <SummaryCard icon={ReceiptText} label="總支出" value={totals.livingExpense + totals.businessExpense} />
            <SummaryCard icon={Landmark} label="債務還款" value={totals.debtPayment} />
            <SummaryCard icon={PiggyBank} label="儲蓄準備" value={totals.savings} />
            <SummaryCard icon={PiggyBank} label="儲蓄後現金流" value={totals.cashFlow} highlight={totals.cashFlow >= 0} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <ReportTable title="家庭收入" rows={scaleRows(report.income, multiplier)} total={totals.income} />
            <ReportTable title="生活支出" rows={scaleRows(report.livingExpense, multiplier)} total={totals.livingExpense} />
            <ReportTable title="債務還款" rows={scaleRows(report.debtPayment, multiplier)} total={totals.debtPayment} />
            <ReportTable title="儲蓄與目標準備" rows={scaleRows(report.savings, multiplier)} total={totals.savings} />
            <ReportTable title="營業收入" rows={scaleRows(report.businessIncome, multiplier)} total={totals.businessIncome} />
            <ReportTable title="營業支出" rows={scaleRows(report.businessExpense, multiplier)} total={totals.businessExpense} />
            <ReportTable title="資產" rows={report.assets} total={totals.assets} />
            <ReportTable title="負債" rows={report.liabilities} total={totals.liabilities} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-border">
              <CardContent className="p-5">
                <h2 className="text-xl font-bold text-foreground">報表摘要</h2>
                <div className="mt-4 space-y-3">
                  <AmountLine label="收入合計" value={totals.income + totals.businessIncome} />
                  <AmountLine label="支出合計" value={totals.livingExpense + totals.businessExpense} />
                  <AmountLine label="債務還款" value={totals.debtPayment} />
                  <AmountLine label="儲蓄前現金流" value={totals.cashBeforeSavings} />
                  <AmountLine label="儲蓄與目標準備" value={totals.savings} />
                  <AmountLine label="儲蓄後現金流" value={totals.cashFlow} strong />
                  <AmountLine label="資產總額" value={totals.assets} />
                  <AmountLine label="負債總額" value={totals.liabilities} />
                  <AmountLine label="淨值" value={totals.netWorth} strong />
                </div>
                <Button asChild className="mt-5 w-full">
                  <Link href={healthDashboardHref}>
                    <ShieldCheck className="h-4 w-4" />
                    查看財務健康安全儀表板
                  </Link>
                </Button>
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
    </main>
  )
}

function sum(rows: ReportRow[]) {
  return rows.reduce((total, row) => total + row.amount, 0)
}

function scaleRows(rows: ReportRow[], multiplier: number) {
  return rows.map((row) => ({ ...row, amount: row.amount * multiplier }))
}

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex rounded-full border border-border bg-muted/40 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === option.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  highlight = true,
}: {
  icon: typeof WalletCards
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Icon className={`mb-3 h-5 w-5 ${highlight ? "text-primary" : "text-destructive"}`} />
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-foreground" : "text-destructive"}`}>
        {money.format(value)}
      </p>
    </div>
  )
}

function ReportTable({ title, rows, total }: { title: string; rows: ReportRow[]; total: number }) {
  return (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <span className="text-lg font-bold text-foreground">{money.format(total)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/35 text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">項目</th>
                <th className="px-5 py-3 text-right font-semibold">金額</th>
                <th className="px-5 py-3 font-semibold">資料來源</th>
                <th className="px-5 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border/70">
                  <td className="px-5 py-3 font-medium text-foreground">{row.label}</td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">{money.format(row.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.source || "手動補齊"}</td>
                  <td className="px-5 py-3 text-right">
                    {row.href ? (
                      <Link href={row.href} className="font-semibold text-primary">
                        查看
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">補資料</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/25">
                <td className="px-5 py-3 font-bold text-foreground">小計</td>
                <td className="px-5 py-3 text-right font-bold text-foreground">{money.format(total)}</td>
                <td className="px-5 py-3" />
                <td className="px-5 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
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
