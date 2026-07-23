"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowRight,
  FileText,
  Landmark,
  Mic,
  PencilLine,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  ShieldAlert,
  Trash2,
} from "lucide-react"

import { SaveToProfilePrompt } from "@/app/toolbox/_components/save-to-profile-prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type DebtStatus = "normal" | "late" | "negotiating" | "legal" | "paused"
type SortKey = "annualRate" | "remainingAmount" | "monthlyPayment" | "status"
type SortDirection = "asc" | "desc"
type DebtStep = "form" | "results" | "save"

type DebtItem = {
  id: number
  debtor: string
  debtType: string
  creditorType: string
  creditor: string
  reason: string
  borrowedAt: string
  totalAmount: number
  actualAmount: number
  feeAmount: number
  remainingAmount: number
  annualRate: number
  rateNote: string
  repaymentTerm: string
  paymentFrequency: string
  monthlyPayment: number
  deadline: string
  stoppedAt: string
  status: DebtStatus
}

const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat("zh-TW", {
  maximumFractionDigits: 1,
})

const debtStepItems: { id: DebtStep; title: string; description: string }[] = [
  { id: "form", title: "1 填寫債務資料", description: "先把每一筆債務加進來" },
  { id: "results", title: "2 查看盤點結果", description: "看排序、壓力與警示" },
  { id: "save", title: "3 儲存與下一步", description: "留下紀錄或預約諮詢" },
]

const reasonOptions = ["生活費", "醫療", "教育或學費", "房租或搬家", "交通或車輛", "生意週轉", "借新還舊", "家人急用", "其他"]

const paymentFrequencyOptions = ["每月", "每兩週", "每週", "每日", "不固定", "只還利息", "無固定約定"]

const borrowedAtOptions = ["最近 1 個月", "1-3 個月前", "3-6 個月前", "6-12 個月前", "1-3 年前", "3 年以上", "記不清楚", "自行輸入"]

const creditorNameOptions = ["A 銀行", "信用卡公司", "融資公司", "當鋪", "親友", "民間借貸", "法院或執行程序", "自行輸入"]

const rateNoteOptions = ["循環信用利率", "固定年利率", "免息", "只收手續費", "每月固定費用", "不確定，待確認", "自行輸入"]

const repaymentTermOptions = ["12 期", "24 期", "36 期", "剩 6 期內", "剩 12 期內", "無固定期數", "記不清楚", "自行輸入"]

const deadlineOptions = ["3 個月內", "6 個月內", "1 年內", "2 年內", "3 年以上", "無固定期限", "記不清楚", "自行輸入"]

const stoppedAtOptions = ["尚未停止", "最近 1 個月", "1-3 個月前", "3-6 個月前", "6 個月以上", "記不清楚", "自行輸入"]

const customOption = "自行輸入"

function getSelectValue(value: string, options: string[], fallback: string) {
  if (!value) return fallback
  return options.includes(value) ? value : customOption
}

function shouldShowCustomInput(value: string, options: string[]) {
  return value === customOption || Boolean(value && !options.includes(value))
}

function isCustomSelectValue(value: string, options: string[], fallback: string) {
  return getSelectValue(value, options, fallback) === customOption
}

function getCustomInputValue(value: string, options: string[]) {
  return value && !options.includes(value) ? value : ""
}

const debtorOptions = ["本人", "配偶", "父母", "子女", "其他家人", "共同債務", "其他"]

const debtTypeOptions = ["信用卡", "信貸", "車貸", "房貸", "學貸", "分期付款", "親友借款", "標會", "當鋪", "其他"]

const creditorTypeOptions = ["銀行", "信用卡公司", "融資公司", "當鋪", "親友", "民間借貸", "法院/執行程序", "其他"]

const statusOptions: { id: DebtStatus; label: string; description: string }[] = [
  { id: "normal", label: "正常繳款", description: "目前還能照約定繳款。" },
  { id: "late", label: "已逾期", description: "有遲繳、催收或違約紀錄。" },
  { id: "negotiating", label: "協商中", description: "正在和銀行、債權人或家人討論還款方式。" },
  { id: "legal", label: "法律程序中", description: "已進入法院、強制執行、支付命令或調解程序。" },
  { id: "paused", label: "暫停繳款", description: "目前先暫停繳款，需要重新確認處理方式。" },
]

const sourceCards = [
  {
    title: "銀行或信用卡 App",
    text: "可找貸款餘額、信用卡未繳金額、年利率、最低應繳、每月應繳與繳款紀錄。",
  },
  {
    title: "帳單、契約或催收通知",
    text: "可找債權人、債務總額、剩餘金額、還款期限、逾期狀況與是否有法律程序。",
  },
  {
    title: "家人、朋友或民間借款紀錄",
    text: "可先把債務人、債權人、約定還款方式、是否免息與目前還欠多少寫下來。",
  },
]

const defaultDebt: Omit<DebtItem, "id"> = {
  debtor: "本人",
  debtType: "信用卡",
  creditorType: "信用卡公司",
  creditor: "信用卡 A 銀行",
  reason: "生活費",
  borrowedAt: "6-12 個月前",
  totalAmount: 90000,
  actualAmount: 90000,
  feeAmount: 0,
  remainingAmount: 80000,
  annualRate: 15,
  rateNote: "循環信用利率",
  repaymentTerm: "18 期",
  paymentFrequency: "每月",
  monthlyPayment: 6000,
  deadline: "2027-12",
  stoppedAt: "",
  status: "normal",
}

function createEmptyDebt(): Omit<DebtItem, "id"> {
  return {
    debtor: "本人",
    debtType: "信用卡",
    creditorType: "銀行",
    creditor: "",
    reason: "生活費",
    borrowedAt: "記不清楚",
    totalAmount: 0,
    actualAmount: 0,
    feeAmount: 0,
    remainingAmount: 0,
    annualRate: 0,
    rateNote: "",
    repaymentTerm: "",
    paymentFrequency: "每月",
    monthlyPayment: 0,
    deadline: "",
    stoppedAt: "",
    status: "normal",
  }
}

const importedToolDebts: DebtItem[] = [
  {
    id: 9001,
    debtor: "本人",
    debtType: "信用卡",
    creditorType: "信用卡公司",
    creditor: "信用卡工具帶入",
    reason: "生活費",
    borrowedAt: "6-12 個月前",
    totalAmount: 80000,
    actualAmount: 80000,
    feeAmount: 0,
    remainingAmount: 80000,
    annualRate: 15,
    rateNote: "循環信用利率，仍需對照帳單確認",
    repaymentTerm: "期限待補",
    paymentFrequency: "每月",
    monthlyPayment: 6000,
    deadline: "期限待補",
    stoppedAt: "",
    status: "normal",
  },
  {
    id: 9002,
    debtor: "本人",
    debtType: "車貸",
    creditorType: "融資公司",
    creditor: "車貸工具帶入",
    reason: "交通或車輛",
    borrowedAt: "1-3 年前",
    totalAmount: 360000,
    actualAmount: 360000,
    feeAmount: 0,
    remainingAmount: 320000,
    annualRate: 4.5,
    rateNote: "車貸年利率，仍需確認剩餘期數",
    repaymentTerm: "36 期",
    paymentFrequency: "每月",
    monthlyPayment: 9800,
    deadline: "2028-06",
    stoppedAt: "",
    status: "normal",
  },
]

function getStatusLabel(status: DebtStatus) {
  return statusOptions.find((item) => item.id === status)?.label ?? "未確認"
}

function getSignalTone(value: number, thresholds: { watch: number; high: number }) {
  if (!Number.isFinite(value) || value <= 0) return { label: "待補資料", className: "border-border bg-background/70" }
  if (value >= thresholds.high) return { label: "建議找人一起整理", className: "border-destructive/30 bg-destructive/10" }
  if (value >= thresholds.watch) return { label: "需要留意", className: "border-amber-200 bg-amber-50" }
  return { label: "目前先觀察", className: "border-emerald-100 bg-emerald-50" }
}

function getRateTone(rate: number) {
  if (rate >= 12) {
    return {
      label: "成本較高",
      className: "border-destructive/25 bg-destructive/10",
      description: "先確認是否還在累積高成本利息，並評估是否能調整還款方式。",
    }
  }

  if (rate >= 5) {
    return {
      label: "中等",
      className: "border-amber-200 bg-amber-50",
      description: "除了利率，也要看剩餘期數、月付金與提前清償條件。",
    }
  }

  return {
    label: "低利或免息",
    className: "border-emerald-100 bg-emerald-50",
    description: "利率較低不代表完全沒有壓力，也要看期限、關係與每月現金流。",
  }
}

export default function DebtPage() {
  const [activeStep, setActiveStep] = useState<DebtStep>("form")
  const [debts, setDebts] = useState<DebtItem[]>([{ ...defaultDebt, id: 1 }])
  const [form, setForm] = useState<Omit<DebtItem, "id">>(createEmptyDebt())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>("annualRate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [monthlyIncome, setMonthlyIncome] = useState("45000")
  const [assets, setAssets] = useState("120000")
  const [voiceText, setVoiceText] = useState("我有一張信用卡還欠八萬元，每個月大概繳六千，利率十五趴，還有一筆朋友借款三萬元，沒有算利息。")

  useEffect(() => {
    const syncStepFromHash = () => {
      const step = window.location.hash.replace("#debt-step-", "") as DebtStep
      if (step === "form" || step === "results" || step === "save") {
        setActiveStep(step)
      }
    }

    syncStepFromHash()
    window.addEventListener("hashchange", syncStepFromHash)

    return () => window.removeEventListener("hashchange", syncStepFromHash)
  }, [])

  const totals = useMemo(() => {
    const totalRemaining = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
    const totalMonthly = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
    const income = Number(monthlyIncome) || 0
    const assetTotal = Number(assets) || 0
    const dbr = income ? totalRemaining / income : 0
    const monthlyDebtRatio = income ? (totalMonthly / income) * 100 : 0
    const assetLiabilityRatio = assetTotal ? (totalRemaining / assetTotal) * 100 : 0

    return {
      totalRemaining,
      totalMonthly,
      income,
      assetTotal,
      dbr,
      monthlyDebtRatio,
      assetLiabilityRatio,
    }
  }, [assets, debts, monthlyIncome])

  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => {
      const statusA = statusOptions.findIndex((status) => status.id === a.status)
      const statusB = statusOptions.findIndex((status) => status.id === b.status)
      const valueA = sortKey === "status" ? statusA : a[sortKey]
      const valueB = sortKey === "status" ? statusB : b[sortKey]
      const direction = sortDirection === "desc" ? -1 : 1

      if (valueA === valueB) return b.remainingAmount - a.remainingAmount

      return valueA > valueB ? direction : -direction
    })
  }, [debts, sortDirection, sortKey])

  const addOrUpdateDebt = () => {
    if (!form.remainingAmount) return

    const nextDebt = {
      ...form,
      creditor: form.creditor || form.creditorType || form.debtType,
    }

    if (editingId) {
      setDebts((current) => current.map((debt) => (debt.id === editingId ? { ...nextDebt, id: editingId } : debt)))
      setEditingId(null)
    } else {
      setDebts((current) => [...current, { ...nextDebt, id: Date.now() }])
    }

    setForm(createEmptyDebt())
  }

  const editDebt = (debt: DebtItem) => {
    const { id: _id, ...rest } = debt
    setEditingId(debt.id)
    setForm(rest)
  }

  const removeDebt = (id: number) => {
    setDebts((current) => current.filter((debt) => debt.id !== id))
  }

  const importDebt = (debt: DebtItem) => {
    setDebts((current) => {
      const alreadyImported = current.some((item) => item.creditor === debt.creditor)

      if (alreadyImported) return current

      return [...current, { ...debt, id: Date.now() + debt.id }]
    })
  }

  const removeImportedDebt = (debt: DebtItem) => {
    setDebts((current) => current.filter((item) => item.creditor !== debt.creditor))
  }

  const toggleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "desc" ? "asc" : "desc"))
      return
    }

    setSortKey(nextKey)
    setSortDirection("desc")
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(createEmptyDebt())
  }

  const addVoiceDraft = () => {
    if (!voiceText.trim()) return

    setForm({
      debtor: "本人",
      debtType: "信用卡",
      creditorType: "信用卡公司",
      creditor: "口述待確認",
      reason: "生活費",
      borrowedAt: "記不清楚",
      totalAmount: 80000,
      actualAmount: 80000,
      feeAmount: 0,
      remainingAmount: 80000,
      annualRate: 15,
      rateNote: "由口述內容先暫填，仍需對照帳單確認",
      repaymentTerm: "",
      paymentFrequency: "每月",
      monthlyPayment: 6000,
      deadline: "",
      stoppedAt: "",
      status: "normal",
    })
  }

  const dbrTone = getSignalTone(totals.dbr, { watch: 12, high: 22 })
  const monthlyTone = getSignalTone(totals.monthlyDebtRatio, { watch: 35, high: 50 })
  const assetTone = getSignalTone(totals.assetLiabilityRatio, { watch: 60, high: 90 })

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="debt-tool-shell mx-auto max-w-6xl">
        <style>{`
          .debt-tool-shell .debt-step-section {
            display: none;
          }

          .debt-tool-shell #debt-step-form-section {
            display: block;
          }

          .debt-tool-shell:has(#debt-step-results:target) #debt-step-form-section,
          .debt-tool-shell:has(#debt-step-save:target) #debt-step-form-section {
            display: none;
          }

          .debt-tool-shell:has(#debt-step-results:target) #debt-step-results-section,
          .debt-tool-shell:has(#debt-step-save:target) #debt-step-save-section {
            display: block;
          }
        `}</style>
        <section className="mb-7 rounded-2xl border border-border bg-card/85 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <FileText className="h-4 w-4" />
                債務整理工具草稿
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">債務盤點表</h1>
              <p className="text-base leading-7 text-muted-foreground">
                先把每一筆債務整理出來，再一起看利率成本、每月還款壓力與幾個需要留意的財務訊號。利率或指標不是用來判斷好壞，而是幫你看見下一步該先確認什麼。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-border bg-background/75 p-4">
                <p className="text-sm text-muted-foreground">已盤點</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{debts.length} 筆</p>
                <p className="mt-1 text-xs text-muted-foreground">目前列入整理的債務筆數</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <p className="text-sm text-muted-foreground">剩餘債務</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{money.format(totals.totalRemaining)}</p>
                <p className="mt-1 text-xs text-muted-foreground">尚未清償的估計金額</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/75 p-4">
                <p className="text-sm text-muted-foreground">月付合計</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{money.format(totals.totalMonthly)}</p>
                <p className="mt-1 text-xs text-muted-foreground">每月要繳的債務金額</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7 rounded-2xl border border-border bg-card/90 p-3 shadow-sm sm:p-4">
          <div className="grid gap-2 md:grid-cols-3">
            {debtStepItems.map((step) => {
              const isActive = activeStep === step.id

              return (
                <a
                  key={step.id}
                  href={`#debt-step-${step.id}`}
                  onClick={() => setActiveStep(step.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background/70 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <span className="block text-sm font-semibold">{step.title}</span>
                  <span className="mt-1 block text-xs leading-5">{step.description}</span>
                </a>
              )
            })}
          </div>
        </section>

        <div id="debt-step-form" className="scroll-mt-24" />
        <div id="debt-step-form-section" className="debt-step-section">
        <section className="mb-7 rounded-2xl border border-border bg-card/90 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                <ReceiptText className="h-4 w-4" />
                先找資料，再開始盤點
              </div>
              <h2 className="text-2xl font-bold text-foreground">這些數字通常在哪裡看得到？</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              不用一次填到很完整，可以先填知道的資料；之後再用帳單、App 或契約慢慢補齊。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {sourceCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-background/75 p-4">
                <Landmark className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="space-y-5">
            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Save className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">已帶入的工具資料</p>
                    <h2 className="text-xl font-semibold text-foreground">可以先把其他工具的結果併進來</h2>
                  </div>
                </div>
                <p className="mb-3 text-sm leading-6 text-muted-foreground">
                  這裡先做示意：之後使用者若已保存信用卡、車貸、信貸或房貸工具結果，可以直接帶入盤點表，再補上還款期限與還款狀況。
                </p>
                <div className="grid gap-3">
                  {importedToolDebts.map((debt) => {
                    const alreadyImported = debts.some((item) => item.creditor === debt.creditor)

                    return (
                      <div key={debt.id} className="flex flex-col gap-3 rounded-xl border border-border bg-background/75 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{debt.debtType}｜{debt.creditor}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            剩餘 {money.format(debt.remainingAmount)} · 年利率 {number.format(debt.annualRate)}% · {debt.paymentFrequency}還 {money.format(debt.monthlyPayment)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={alreadyImported ? "outline" : "default"}
                          onClick={() => (alreadyImported ? removeImportedDebt(debt) : importDebt(debt))}
                        >
                          {alreadyImported ? "取消併入" : "併入盤點"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PencilLine className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">依照欄位新增一筆</p>
                    <h2 className="text-xl font-semibold text-foreground">{editingId ? "修改債務資料" : "新增債務資料"}</h2>
                  </div>
                </div>

                <datalist id="creditor-name-options">
                  {creditorNameOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <datalist id="borrowed-at-options">
                  {borrowedAtOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <datalist id="rate-note-options">
                  {rateNoteOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <datalist id="repayment-term-options">
                  {repaymentTermOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <datalist id="deadline-options">
                  {deadlineOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                <datalist id="stopped-at-options">
                  {stoppedAtOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-primary">1. 這筆債一開始怎麼來的</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">先回想當時是誰借、向誰借、為什麼借，以及一開始拿到多少錢。</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    債務人
                    <select
                      value={form.debtor}
                      onChange={(event) => setForm({ ...form, debtor: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {debtorOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    債務類型
                    <select
                      value={form.debtType}
                      onChange={(event) => setForm({ ...form, debtType: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {debtTypeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    債務時間
                    <select
                      value={getSelectValue(form.borrowedAt, borrowedAtOptions, "記不清楚")}
                      onChange={(event) => setForm({ ...form, borrowedAt: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {borrowedAtOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {isCustomSelectValue(form.borrowedAt, borrowedAtOptions, "記不清楚") ? (
                      <Input
                        value={getCustomInputValue(form.borrowedAt, borrowedAtOptions)}
                        onChange={(event) => setForm({ ...form, borrowedAt: event.target.value })}
                        placeholder="請輸入實際借款時間，例如 2025/06"
                      />
                    ) : null}
                    <span className="text-xs leading-5 text-muted-foreground">先抓大概時間即可，用來看債務是近期發生，還是已累積一段時間。</span>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    借錢原因
                    <select
                      value={form.reason}
                      onChange={(event) => setForm({ ...form, reason: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {reasonOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <span className="text-xs leading-5 text-muted-foreground">可以先大略分類，之後會幫助判斷是不是生活費不足、借新還舊或突發支出。</span>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    債權人類型
                    <select
                      value={form.creditorType}
                      onChange={(event) => setForm({ ...form, creditorType: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {creditorTypeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    債權人名稱
                    <select
                      value={getSelectValue(form.creditor, creditorNameOptions, customOption)}
                      onChange={(event) => setForm({ ...form, creditor: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {creditorNameOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {isCustomSelectValue(form.creditor, creditorNameOptions, customOption) ? (
                      <Input
                        value={getCustomInputValue(form.creditor, creditorNameOptions)}
                        onChange={(event) => setForm({ ...form, creditor: event.target.value })}
                        placeholder="請輸入債權人名稱，例如 A 銀行、某某親友"
                      />
                    ) : null}
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    債務總額
                    <Input inputMode="numeric" value={form.totalAmount || ""} onChange={(event) => setForm({ ...form, totalAmount: Number(event.target.value) || 0 })} placeholder="一開始借了多少" />
                    <span className="text-xs leading-5 text-muted-foreground">名目借款金額，不一定等於實際拿到手的金額。</span>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    實拿金額
                    <Input inputMode="numeric" value={form.actualAmount || ""} onChange={(event) => setForm({ ...form, actualAmount: Number(event.target.value) || 0 })} placeholder="實際拿到多少錢" />
                    <span className="text-xs leading-5 text-muted-foreground">若有先扣手續費、代辦費或其他費用，這裡會比債務總額少。</span>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    開辦費／手續費
                    <Input inputMode="numeric" value={form.feeAmount || ""} onChange={(event) => setForm({ ...form, feeAmount: Number(event.target.value) || 0 })} placeholder="沒有可填 0" />
                    <span className="text-xs leading-5 text-muted-foreground">利率不高也可能有其他費用，先記下來比較看得出真實成本。</span>
                  </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-primary">2. 當初約定怎麼還</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">再整理利率、期數、頻率和每期金額，這些會影響後面的成本排序。</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    年利率
                    <Input inputMode="decimal" value={form.annualRate || ""} onChange={(event) => setForm({ ...form, annualRate: Number(event.target.value) || 0 })} placeholder="若免息可填 0" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    利率或免息說明
                    <select
                      value={getSelectValue(form.rateNote, rateNoteOptions, "不確定，待確認")}
                      onChange={(event) => setForm({ ...form, rateNote: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {rateNoteOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {isCustomSelectValue(form.rateNote, rateNoteOptions, "不確定，待確認") ? (
                      <Input
                        value={getCustomInputValue(form.rateNote, rateNoteOptions)}
                        onChange={(event) => setForm({ ...form, rateNote: event.target.value })}
                        placeholder="請輸入利率或費用說明"
                      />
                    ) : null}
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    還款期數
                    <select
                      value={getSelectValue(form.repaymentTerm, repaymentTermOptions, "記不清楚")}
                      onChange={(event) => setForm({ ...form, repaymentTerm: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {repaymentTermOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {isCustomSelectValue(form.repaymentTerm, repaymentTermOptions, "記不清楚") ? (
                      <Input
                        value={getCustomInputValue(form.repaymentTerm, repaymentTermOptions)}
                        onChange={(event) => setForm({ ...form, repaymentTerm: event.target.value })}
                        placeholder="請輸入還款期數，例如 48 期、剩 8 期"
                      />
                    ) : null}
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    約定還款頻率
                    <select
                      value={form.paymentFrequency}
                      onChange={(event) => setForm({ ...form, paymentFrequency: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {paymentFrequencyOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    每期還款金額
                    <Input inputMode="numeric" value={form.monthlyPayment || ""} onChange={(event) => setForm({ ...form, monthlyPayment: Number(event.target.value) || 0 })} placeholder="每月或每期大約繳多少" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    還款期限
                    <select
                      value={getSelectValue(form.deadline, deadlineOptions, "記不清楚")}
                      onChange={(event) => setForm({ ...form, deadline: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {deadlineOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {isCustomSelectValue(form.deadline, deadlineOptions, "記不清楚") ? (
                      <Input
                        value={getCustomInputValue(form.deadline, deadlineOptions)}
                        onChange={(event) => setForm({ ...form, deadline: event.target.value })}
                        placeholder="請輸入還款期限，例如 2027/12"
                      />
                    ) : null}
                  </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-primary">3. 現在還到哪裡</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">最後看目前剩多少、是否正常還款，才知道下一步要先處理哪一筆。</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    目前剩餘金額
                    <Input inputMode="numeric" value={form.remainingAmount || ""} onChange={(event) => setForm({ ...form, remainingAmount: Number(event.target.value) || 0 })} placeholder="目前還欠多少" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    還款狀況
                    <select
                      value={form.status}
                      onChange={(event) => setForm({ ...form, status: event.target.value as DebtStatus })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {statusOptions.find((status) => status.id === form.status)?.description}
                    </span>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    何時停止還款或最後一次還款
                    <select
                      value={getSelectValue(form.stoppedAt, stoppedAtOptions, "尚未停止")}
                      onChange={(event) => setForm({ ...form, stoppedAt: event.target.value })}
                      className="h-12 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none focus:border-primary"
                    >
                      {stoppedAtOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {isCustomSelectValue(form.stoppedAt, stoppedAtOptions, "尚未停止") ? (
                      <Input
                        value={getCustomInputValue(form.stoppedAt, stoppedAtOptions)}
                        onChange={(event) => setForm({ ...form, stoppedAt: event.target.value })}
                        placeholder="請輸入停止還款或最後一次還款時間"
                      />
                    ) : null}
                    <span className="text-xs leading-5 text-muted-foreground">若已停繳或只偶爾還，這個時間會影響風險提醒。</span>
                  </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  {editingId ? (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <RotateCcw className="h-4 w-4" /> 取消修改
                    </Button>
                  ) : null}
                  <Button type="button" onClick={addOrUpdateDebt} disabled={!form.remainingAmount}>
                    {editingId ? "儲存修改" : "新增這一筆債務"} <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">語音輸入草稿</p>
                    <h2 className="text-xl font-semibold text-foreground">也可以先把債務用說的講出來</h2>
                  </div>
                </div>
                <textarea
                  value={voiceText}
                  onChange={(event) => setVoiceText(event.target.value)}
                  className="min-h-28 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 outline-none focus:border-primary"
                  placeholder="例如：我有一張信用卡還欠八萬元，每個月繳六千，利率十五趴..."
                />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-muted-foreground">之後可接語音轉文字，再協助拆成債務人、債權人、金額、利率、每月還款與還款狀況。</p>
                  <Button type="button" variant="outline" onClick={addVoiceDraft}>
                    將口述內容帶入欄位 <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm font-medium text-primary">可以這樣說</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                    <li>「我有一張信用卡還欠八萬元，每個月繳六千，利率十五趴。」</li>
                    <li>「我跟朋友借三萬元，沒有利息，約定每月還兩千。」</li>
                    <li>「車貸還剩十六萬八千，每月繳三千二，還有大概四年。」</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setActiveStep("results")
                window.location.hash = "debt-step-results"
              }}
              disabled={!debts.length}
            >
              下一步：查看盤點結果 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        </div>

        <div id="debt-step-results" className="scroll-mt-24" />
        <section id="debt-step-results-section" className="debt-step-section space-y-5">
            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ArrowDownUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">盤點結果</p>
                    <h2 className="text-xl font-semibold text-foreground">利率與成本排序</h2>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-6 text-muted-foreground">
                  利率高不一定代表一定最糟，但通常代表資金成本較高；還要一起看金額、月付、逾期與生活費是否被壓縮。
                </p>

                <div className="hidden overflow-hidden rounded-xl border border-border md:block">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="px-3 py-3 font-medium">排序</th>
                        <th className="px-3 py-3 font-medium">債務</th>
                        <th className="px-3 py-3 font-medium">
                          <button type="button" onClick={() => toggleSort("annualRate")} className="inline-flex items-center gap-1 text-left hover:text-foreground">
                            年利率 <ArrowDownUp className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-3 py-3 font-medium">
                          <button type="button" onClick={() => toggleSort("remainingAmount")} className="inline-flex items-center gap-1 text-left hover:text-foreground">
                            剩餘金額 <ArrowDownUp className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-3 py-3 font-medium">
                          <button type="button" onClick={() => toggleSort("monthlyPayment")} className="inline-flex items-center gap-1 text-left hover:text-foreground">
                            每月還款 <ArrowDownUp className="h-3.5 w-3.5" />
                          </button>
                        </th>
                        <th className="px-3 py-3 font-medium">
                          <button type="button" onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 text-left hover:text-foreground">
                            狀況 <ArrowDownUp className="h-3.5 w-3.5" />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedDebts.map((debt, index) => {
                        const rateTone = getRateTone(debt.annualRate)

                        return (
                          <tr key={debt.id} className="border-t border-border bg-background/60 align-top">
                            <td className="px-3 py-3 text-muted-foreground">{index + 1}</td>
                            <td className="px-3 py-3">
                              <p className="font-semibold text-foreground">{debt.debtType}｜{debt.creditor}</p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">{rateTone.label}：{rateTone.description}</p>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                原因：{debt.reason || "待補"} · 實拿 {money.format(debt.actualAmount || debt.totalAmount)} · 手續費 {money.format(debt.feeAmount || 0)}
                              </p>
                            </td>
                            <td className="px-3 py-3 font-semibold text-foreground">{number.format(debt.annualRate)}%</td>
                            <td className="px-3 py-3 text-foreground">{money.format(debt.remainingAmount)}</td>
                            <td className="px-3 py-3 text-foreground">{money.format(debt.monthlyPayment)}</td>
                            <td className="px-3 py-3 text-muted-foreground">{getStatusLabel(debt.status)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="border-t border-border bg-primary/10">
                      <tr>
                        <td className="px-3 py-3 font-semibold text-foreground" colSpan={3}>加總</td>
                        <td className="px-3 py-3 font-semibold text-foreground">{money.format(totals.totalRemaining)}</td>
                        <td className="px-3 py-3 font-semibold text-foreground">{money.format(totals.totalMonthly)}</td>
                        <td className="px-3 py-3 text-xs leading-5 text-muted-foreground">合計不代表還款順序，仍需看生活費、逾期與法律程序。</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="space-y-3 md:hidden">
                  {sortedDebts.map((debt) => {
                    const rateTone = getRateTone(debt.annualRate)

                    return (
                      <div key={debt.id} className={`rounded-xl border p-4 ${rateTone.className}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="mb-2 inline-flex rounded-full bg-card px-2 py-1 text-xs font-medium text-muted-foreground">
                              {rateTone.label}
                            </div>
                            <p className="font-semibold text-foreground">{debt.debtType}｜{debt.creditor}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {getStatusLabel(debt.status)} · 剩餘 {money.format(debt.remainingAmount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{number.format(debt.annualRate)}%</p>
                            <p className="text-xs text-muted-foreground">年利率</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{rateTone.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-card px-2 py-1">月付 {money.format(debt.monthlyPayment)}</span>
                          <span className="rounded-full bg-card px-2 py-1">{debt.paymentFrequency || "頻率待補"}</span>
                          <span className="rounded-full bg-card px-2 py-1">{debt.repaymentTerm || "期數待補"}</span>
                          <span className="rounded-full bg-card px-2 py-1">{debt.deadline || "期限待補"}</span>
                          {debt.stoppedAt ? <span className="rounded-full bg-card px-2 py-1">停繳/最後還款：{debt.stoppedAt}</span> : null}
                          <span className="rounded-full bg-card px-2 py-1">{debt.rateNote || "利率說明待補"}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button type="button" variant="ghost" size="sm" className="px-0 text-primary" onClick={() => editDebt(debt)}>
                            <PencilLine className="h-4 w-4" /> 修改
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="px-0 text-destructive" onClick={() => removeDebt(debt.id)}>
                            <Trash2 className="h-4 w-4" /> 刪除
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">先看這三個訊號</p>
                    <h2 className="text-xl font-semibold text-foreground">債務警示摘要</h2>
                  </div>
                </div>
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    家庭月收入
                    <Input inputMode="numeric" value={monthlyIncome} onChange={(event) => setMonthlyIncome(event.target.value)} />
                    <span className="text-xs leading-5 text-muted-foreground">可先自己填；登入後可從記帳紀錄、財務月報表或家庭資料帶入。</span>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    可估算資產
                    <Input inputMode="numeric" value={assets} onChange={(event) => setAssets(event.target.value)} />
                    <span className="text-xs leading-5 text-muted-foreground">可先填存款、可動用資金或其他可估算資產；之後可由我的財務與生活彙整。</span>
                  </label>
                </div>
                <details className="mt-4 rounded-xl border border-border bg-background/70 px-4">
                  <summary className="cursor-pointer py-4 text-left font-semibold text-foreground">
                    查看債務警示與白話說明
                  </summary>
                  <div className="space-y-3 pb-4">
                        <div className={`rounded-xl border p-4 ${dbrTone.className}`}>
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <p className="font-semibold text-foreground">債務收入比 DBR</p>
                            <span className="rounded-full bg-card px-2 py-1 text-xs text-muted-foreground">{dbrTone.label}</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">{number.format(totals.dbr)} 倍</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            DBR 是把所有債務總額拿來和月收入比較。它不是每月要繳這麼多，而是用來看整體債務量是否偏重。
                          </p>
                          <p className="mt-2 rounded-lg bg-card px-3 py-2 text-xs leading-5 text-muted-foreground">
                            參考：金融機構常用 DBR 22 倍概念看無擔保債務。低於參考值不代表完全沒壓力，仍要一起看月付金、收入穩定度與是否逾期。
                          </p>
                        </div>
                        <div className={`rounded-xl border p-4 ${monthlyTone.className}`}>
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <p className="font-semibold text-foreground">月負債比</p>
                            <span className="rounded-full bg-card px-2 py-1 text-xs text-muted-foreground">{monthlyTone.label}</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">{number.format(totals.monthlyDebtRatio)}%</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            這比較接近每個月真正感受到的壓力，因為它看的是每月還款占收入多少。
                          </p>
                          <p className="mt-2 rounded-lg bg-card px-3 py-2 text-xs leading-5 text-muted-foreground">
                            參考：30% 以下先觀察，30% 到 50% 需要留意，50% 以上建議找人一起整理。若生活費已被壓縮，即使比例較低也要注意。
                          </p>
                        </div>
                        <div className={`rounded-xl border p-4 ${assetTone.className}`}>
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <p className="font-semibold text-foreground">資產負債率</p>
                            <span className="rounded-full bg-card px-2 py-1 text-xs text-muted-foreground">{assetTone.label}</span>
                          </div>
                          <p className="text-2xl font-bold text-foreground">{number.format(totals.assetLiabilityRatio)}%</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            資產負債率是看負債和資產相比的壓力；如果資產不容易變現，也不能只看比例漂亮。
                          </p>
                          <p className="mt-2 rounded-lg bg-card px-3 py-2 text-xs leading-5 text-muted-foreground">
                            參考：60% 以下先觀察，60% 到 90% 需要留意，90% 以上建議找人一起整理。也要看資產是否真的能動用。
                          </p>
                        </div>

                        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            <p className="font-semibold text-foreground">這些情況要特別注意</p>
                          </div>
                          <p className="text-sm leading-6 text-muted-foreground">
                            如果月付已壓縮生活費，或有逾期、催收、法律程序，建議不要只比較利率，也要一起看生活費、可用支持與還款順序。
                          </p>
                        </div>
                  </div>
                </details>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActiveStep("form")
                      window.location.hash = "debt-step-form"
                    }}
                  >
                    回上一頁修改資料
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setActiveStep("save")
                      window.location.hash = "debt-step-save"
                    }}
                  >
                    下一步：儲存與下一步 <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

        <div id="debt-step-save" className="scroll-mt-24" />
        <section id="debt-step-save-section" className="debt-step-section space-y-5">
            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Save className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">儲存與下一步</p>
                    <h2 className="text-xl font-semibold text-foreground">留下這次債務盤點</h2>
                  </div>
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-background/75 p-4">
                    <p className="text-sm text-muted-foreground">已盤點</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{debts.length} 筆</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/75 p-4">
                    <p className="text-sm text-muted-foreground">剩餘總額</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{money.format(totals.totalRemaining)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/75 p-4">
                    <p className="text-sm text-muted-foreground">每期還款</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{money.format(totals.totalMonthly)}</p>
                  </div>
                </div>

                <SaveToProfilePrompt
                  toolPath="/toolbox/debt"
                  title="留下這次債務盤點"
                  description="登入後可保存到「我的財務與生活」，之後帶入財務月報表、家庭財務全貌與後續諮詢討論。"
                  buttonLabel="儲存債務盤點"
                />

                <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                  <p className="font-semibold text-foreground">需要時，也可以找我們一起看還款順序</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    如果已有逾期、催收、法律程序，或每月還款已經壓縮生活費，建議不要自己硬撐，可以預約免費諮詢。
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setActiveStep("results")
                        window.location.hash = "debt-step-results"
                      }}
                    >
                      回到盤點結果
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <Link href="/online-consultation">
                        預約免費諮詢 <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        </section>
      </div>
    </main>
  )
}
