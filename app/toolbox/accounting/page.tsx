"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Calculator,
  ClipboardList,
  Landmark,
  PencilLine,
  ReceiptText,
  RotateCcw,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SaveToProfilePrompt } from "@/app/toolbox/_components/save-to-profile-prompt"
import { currentMemberId } from "@/lib/achievements-data"
import { recordAchievementEvent } from "@/lib/achievements-service"

type EntryType = "income" | "expense"
type AccountScope = "personal" | "business"

type Option = {
  id: string
  label: string
  description?: string
  reportField?: string
}

type Entry = {
  type: EntryType
  amount: number
  category: string
  categoryLabel: string
  note: string
  date: string
  paymentMethod: string
  accountScope: AccountScope
  frequency: string
}

const expenseCategories: Option[] = [
  { id: "food", label: "飲食", description: "三餐、飲料、外食、食材、孩子餐費。", reportField: "食" },
  { id: "clothing", label: "衣著", description: "衣服、鞋子、制服、換季衣物、洗衣或修補。", reportField: "衣" },
  { id: "transport", label: "交通", description: "捷運、公車、油錢、停車、計程車、通勤費。", reportField: "行" },
  { id: "housing", label: "居住與家庭", description: "房租、管理費、水電瓦斯、修繕、家具家電。", reportField: "住" },
  { id: "child", label: "孩子與教育", description: "托育、學費、安親、才藝、教材、接送。", reportField: "育兒與教育支出" },
  { id: "medical", label: "醫療與保險", description: "掛號、藥費、保費、健檢、照護用品。", reportField: "醫療保險支出" },
  { id: "care", label: "家庭照顧", description: "長輩照顧、家人生活費、固定支援或看護。", reportField: "照顧責任支出" },
  { id: "debt", label: "債務與帳單", description: "信用卡、貸款、分期、水電帳單、電信帳單。", reportField: "債務月付與固定帳單" },
  { id: "tax", label: "稅金與規費", description: "綜所稅、牌照稅、燃料費、房屋稅、地價稅、政府規費。", reportField: "稅金與規費支出" },
  { id: "communication", label: "通訊與網路", description: "手機費、網路費、串流訂閱、軟體月費。", reportField: "通訊支出" },
  { id: "learning", label: "休閒與學習", description: "娛樂、課程、書籍、運動、旅遊、社交活動。", reportField: "休閒學習支出" },
  { id: "otherExpense", label: "其他支出", description: "暫時找不到合適類別時先放這裡，之後再整理。", reportField: "其他支出" },
]

const incomeSources: Option[] = [
  { id: "salary", label: "薪資收入", description: "固定薪水、津貼、固定工作收入。", reportField: "本月收入" },
  { id: "side", label: "副業收入", description: "接案、兼職、工作室或小生意收入。", reportField: "本月收入" },
  { id: "temporary", label: "臨時性工作", description: "短期打工、臨時工、一次性工作收入。", reportField: "本月收入" },
  { id: "bonus", label: "獎金或加班費", description: "年終、績效獎金、加班費、分紅。", reportField: "本月收入" },
  { id: "subsidy", label: "政府定期補助", description: "育兒津貼、租金補貼、生活補助等。", reportField: "補助收入" },
  { id: "support", label: "親友贈與", description: "家人支持、親友協助、紅包或生活支援。", reportField: "家人支持" },
  { id: "rent", label: "租金收入", description: "房屋、車位或其他出租收入。", reportField: "其他收入" },
  { id: "interest", label: "利息收入", description: "存款利息、投資配息或定期收益。", reportField: "其他收入" },
  { id: "pension", label: "退休金/年金", description: "勞退、國民年金、退休金、保險年金。", reportField: "退休收入" },
  { id: "otherIncome", label: "其他生活收入", description: "暫時無法歸類的收入先放這裡。", reportField: "其他收入" },
]

const businessExpenseCategories: Option[] = [
  { id: "businessRent", label: "租金與場地", description: "辦公室、店面、倉庫、共同工作空間租金。", reportField: "公司固定支出" },
  { id: "businessUtilities", label: "水電與網路", description: "公司用水電、電話、網路、雲端服務。", reportField: "公司營運支出" },
  { id: "businessPurchase", label: "進貨與材料", description: "商品進貨、原物料、包材、耗材。", reportField: "公司營業成本" },
  { id: "businessSalary", label: "薪資與勞健保", description: "員工薪資、勞健保、退休金提繳。", reportField: "人事支出" },
  { id: "businessMarketing", label: "行銷與廣告", description: "廣告投放、設計、印刷、活動宣傳。", reportField: "行銷支出" },
  { id: "businessTax", label: "稅費與手續費", description: "營業稅、所得稅、平台費、銀行手續費。", reportField: "稅費支出" },
  { id: "businessTravel", label: "交通與差旅", description: "拜訪客戶、出差、停車、油資、車資。", reportField: "差旅支出" },
  { id: "businessOtherExpense", label: "其他公司支出", description: "暫時無法歸類的公司支出先放這裡。", reportField: "其他公司支出" },
]

const businessIncomeSources: Option[] = [
  { id: "businessSales", label: "銷售收入", description: "商品、服務、課程、方案銷售收入。", reportField: "公司營業收入" },
  { id: "businessProject", label: "專案或接案收入", description: "顧問、設計、服務案、階段性款項。", reportField: "公司營業收入" },
  { id: "businessPlatform", label: "平台入帳", description: "電商、外送、平台合作或代收撥款。", reportField: "平台收入" },
  { id: "businessSubsidy", label: "公司補助或補貼", description: "政府補助、創業補助、租金補貼。", reportField: "公司補助收入" },
  { id: "businessRefund", label: "退費或折讓收回", description: "退款、押金退回、折讓或費用返還。", reportField: "公司其他收入" },
  { id: "businessOtherIncome", label: "其他公司收入", description: "暫時無法歸類的公司收入先放這裡。", reportField: "其他公司收入" },
]

const paymentMethods = ["現金", "信用卡", "簽帳金融卡", "轉帳 / 匯款", "LINE Pay", "其他電子支付", "其他"]
const frequencyOptions = ["單次", "每週", "每月", "每季", "半年", "每年"]

const today = () => new Date().toISOString().slice(0, 10)

const draftEntries: Entry[] = [
  {
    type: "income",
    amount: 58000,
    category: "salary",
    categoryLabel: "薪資收入",
    note: "本月薪資",
    date: today(),
    paymentMethod: "轉帳 / 匯款",
    accountScope: "personal",
    frequency: "每月",
  },
  {
    type: "expense",
    amount: 3200,
    category: "child",
    categoryLabel: "孩子與教育",
    note: "安親班",
    date: today(),
    paymentMethod: "轉帳 / 匯款",
    accountScope: "personal",
    frequency: "每月",
  },
  {
    type: "expense",
    amount: 180,
    category: "food",
    categoryLabel: "飲食",
    note: "早餐與交通",
    date: today(),
    paymentMethod: "現金",
    accountScope: "personal",
    frequency: "單次",
  },
]

function currency(value: number) {
  return `$${value.toLocaleString()}`
}

function categoryOptionsFor(type: EntryType, scope: AccountScope) {
  if (scope === "business") {
    return type === "income" ? businessIncomeSources : businessExpenseCategories
  }

  return type === "income" ? incomeSources : expenseCategories
}

export default function AccountingPage() {
  const [entryType, setEntryType] = useState<EntryType>("expense")
  const [selectedCategoryId, setSelectedCategoryId] = useState(expenseCategories[0].id)
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [entryDate, setEntryDate] = useState(today())
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0])
  const [accountScope, setAccountScope] = useState<AccountScope>("personal")
  const [frequency, setFrequency] = useState(frequencyOptions[0])
  const [entries, setEntries] = useState<Entry[]>(draftEntries)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const categories = categoryOptionsFor(entryType, accountScope)
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId) ?? categories[0]
  const inputAmount = Number(amount || 0)

  const totals = useMemo(() => {
    const income = entries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + entry.amount, 0)
    const expense = entries.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + entry.amount, 0)
    const periodicEntries = entries.filter((entry) => entry.frequency !== "單次")
    const personalTotal = entries.filter((entry) => entry.accountScope === "personal").reduce((sum, entry) => sum + (entry.type === "income" ? entry.amount : -entry.amount), 0)
    const businessTotal = entries.filter((entry) => entry.accountScope === "business").reduce((sum, entry) => sum + (entry.type === "income" ? entry.amount : -entry.amount), 0)

    return {
      income,
      expense,
      periodicCount: periodicEntries.length,
      personalTotal,
      businessTotal,
      cashFlow: income - expense,
    }
  }, [entries])

  const selectType = (type: EntryType) => {
    setEntryType(type)
    setSelectedCategoryId(categoryOptionsFor(type, accountScope)[0].id)
    setPaymentMethod(type === "income" ? "轉帳 / 匯款" : paymentMethods[0])
  }

  const selectAccountScope = (scope: AccountScope) => {
    setAccountScope(scope)
    setSelectedCategoryId(categoryOptionsFor(entryType, scope)[0].id)
  }

const resetForm = () => {
    setEntryType("expense")
    setAmount("")
    setNote("")
    setEntryDate(today())
    setPaymentMethod(paymentMethods[0])
    setAccountScope("personal")
    setSelectedCategoryId(expenseCategories[0].id)
    setFrequency(frequencyOptions[0])
    setEditingIndex(null)
  }

  const editEntry = (entry: Entry, index: number) => {
    setEntryType(entry.type)
    setSelectedCategoryId(entry.category)
    setAmount(String(entry.amount))
    setNote(entry.note)
    setEntryDate(entry.date)
    setPaymentMethod(entry.paymentMethod)
    setAccountScope(entry.accountScope)
    setFrequency(entry.frequency)
    setEditingIndex(index)
  }

  const addEntry = () => {
    if (!inputAmount || inputAmount <= 0) return

    const nextEntry: Entry = {
      type: entryType,
      amount: inputAmount,
      category: selectedCategory.id,
      categoryLabel: selectedCategory.label,
      note: note.trim() || selectedCategory.label,
      date: entryDate,
      paymentMethod,
      accountScope,
      frequency,
    }

    if (editingIndex !== null) {
      setEntries(entries.map((entry, index) => (index === editingIndex ? nextEntry : entry)))
    } else {
      setEntries([nextEntry, ...entries])
    }

    resetForm()

    recordAchievementEvent({
      userId: currentMemberId,
      role: "member",
      eventType: "daily_accounting_completed",
      module: "accounting",
      objectType: "accounting_entry",
      objectId: `${nextEntry.type}-${Date.now()}`,
      metadata: {
        entry_type: nextEntry.type,
        category: nextEntry.category,
        account_scope: nextEntry.accountScope,
        payment_method: nextEntry.paymentMethod,
        frequency: nextEntry.frequency,
      },
    })
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-3xl border border-border bg-card/80 p-5 shadow-sm lg:p-7">
          <p className="mb-2 text-sm font-medium text-primary">日常整理</p>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">記帳助理</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            先記一筆收入或支出，不用一次整理完整。登入後可以保存到「我的財務與生活」，並帶入財務月報表與家庭財務全貌。
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-start">
          <section className="space-y-5">
            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">先選帳戶與收支</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">先分清楚是個人帳或公司帳，再選收入或支出，下面的類別會跟著改變。</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">帳戶類型</p>
                    <div className="inline-grid grid-cols-2 rounded-full border border-border bg-background p-1">
                      <button
                        type="button"
                        onClick={() => selectAccountScope("personal")}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                          accountScope === "personal" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        個人帳
                      </button>
                      <button
                        type="button"
                        onClick={() => selectAccountScope("business")}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                          accountScope === "business" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        公司帳
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {accountScope === "personal" ? "用來記錄家庭生活、個人收入與日常支出。" : "用來記錄營業收入、進貨、人事、稅費與公司營運支出。"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">收入或支出</p>
                    <div className="inline-grid grid-cols-2 rounded-full border border-border bg-background p-1">
                      <button
                        type="button"
                        onClick={() => selectType("expense")}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                          entryType === "expense" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        支出
                      </button>
                      <button
                        type="button"
                        onClick={() => selectType("income")}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                          entryType === "income" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        收入
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {entryType === "income"
                        ? accountScope === "business"
                          ? "公司帳收入會顯示銷售、專案、平台入帳等選項。"
                          : "個人帳收入會顯示薪資、補助、親友支持等選項。"
                        : accountScope === "business"
                          ? "公司帳支出會顯示進貨、租金、人事、稅費等選項。"
                          : "個人帳支出會顯示飲食、交通、孩子教育、照顧等選項。"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">填寫這筆資料</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">日期預設為今天；類別與付款方式先用下拉選單，減少畫面長度。</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    <span>{entryType === "income" ? "收入來源" : "支出類別"}</span>
                    <select
                      value={selectedCategoryId}
                      onChange={(event) => setSelectedCategoryId(event.target.value)}
                      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.description ? `${category.label} - ${category.description}` : category.label}
                        </option>
                      ))}
                    </select>
                    {selectedCategory.description ? (
                      <span className="block text-xs leading-relaxed text-muted-foreground">{selectedCategory.description}</span>
                    ) : null}
                  </label>

                  <label className="space-y-2 text-sm font-medium text-foreground">
                    <span>日期</span>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="date" value={entryDate} onChange={(event) => setEntryDate(event.target.value)} className="h-12 pl-9" />
                    </div>
                  </label>

                  <label className="space-y-2 text-sm font-medium text-foreground">
                    <span>金額</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="輸入金額"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="h-12 text-lg"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-foreground">
                    <span>付款方式</span>
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-medium text-foreground">
                    <span>發生頻率</span>
                    <select
                      value={frequency}
                      onChange={(event) => setFrequency(event.target.value)}
                      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block space-y-2 text-sm font-medium text-foreground">
                  <span>備註</span>
                  <Input
                    placeholder={entryType === "income" ? "例如：本月薪資、育兒津貼、案子尾款" : "例如：安親班、晚餐、信用卡帳單"}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="h-12"
                  />
                </label>

                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm font-medium text-primary">這筆資料會帶到哪裡？</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {selectedCategory.label}會更新「{selectedCategory.reportField}」，也會進入財務月報表的收入、支出與月現金流計算。
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {editingIndex !== null ? (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <RotateCcw className="h-4 w-4" /> 取消修改
                      </Button>
                    ) : null}
                    <Button type="button" onClick={addEntry} disabled={!inputAmount || inputAmount <= 0}>
                      {editingIndex !== null ? "儲存修改" : "新增這一筆"} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">本次整理摘要</p>
                    <h2 className="text-xl font-semibold text-foreground">目前已記 {entries.length} 筆</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">收入</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{currency(totals.income)}</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">支出</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{currency(totals.expense)}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="text-sm text-muted-foreground">月現金流</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{currency(totals.cashFlow)}</p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">週期性收支</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{totals.periodicCount} 筆</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-border bg-background/75 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <UserRound className="h-4 w-4 text-primary" />
                      個人帳戶淨額
                    </div>
                    <p className="mt-2 text-xl font-semibold text-foreground">{currency(totals.personalTotal)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/75 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Landmark className="h-4 w-4 text-primary" />
                      公司帳戶淨額
                    </div>
                    <p className="mt-2 text-xl font-semibold text-foreground">{currency(totals.businessTotal)}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                  <p className="font-semibold text-foreground">看結果時可以留意</p>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <p>若長期記錄頻率，之後可以看出哪些是每月固定、每季、半年或年度才會出現的收支。</p>
                    <p>公司帳戶與個人帳戶分開記，之後比較能看出生活收支與生意收支是否混在一起。</p>
                  </div>
                </div>

                <SaveToProfilePrompt
                  toolPath="/toolbox/accounting"
                  title="留下這次記帳紀錄"
                  description="登入後可保存到「我的財務與生活」，之後帶入財務月報表與家庭財務全貌，也能回來修改完整紀錄。"
                  buttonLabel="保存記帳紀錄"
                />

                <div className="mt-4 rounded-2xl border border-border bg-background/75 p-4">
                  <p className="font-semibold text-foreground">需要時，也可以找我們一起整理</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    如果整理後發現每月都入不敷出，或不知道哪些支出可以先調整，可以預約免費諮詢。
                  </p>
                  <Button asChild variant="outline" className="mt-3 justify-start">
                    <Link href="/online-consultation">
                      預約免費諮詢 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/personal-center#member-monthly-report">
                      查看財務月報表 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/personal-center#member-data-summary">
                      查看家庭財務全貌 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">最近幾筆</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  這裡先顯示本次與近期紀錄；完整過往紀錄會放在登入後的我的財務與生活。
                </p>
                <div className="mt-3 space-y-3">
                  {entries.slice(0, 4).map((entry, index) => (
                    <div key={`${entry.type}-${entry.amount}-${entry.date}-${index}`} className="rounded-2xl border border-border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-foreground">{entry.note}</p>
                        <p className={entry.type === "income" ? "font-semibold text-primary" : "font-semibold text-foreground"}>
                          {entry.type === "income" ? "+" : "-"}
                          {currency(entry.amount)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {entry.date} · {entry.categoryLabel} · {entry.paymentMethod} · {entry.frequency} · {entry.accountScope === "personal" ? "個人帳戶" : "公司帳戶"}
                      </p>
                      <Button type="button" variant="ghost" size="sm" className="mt-2 px-0 text-primary" onClick={() => editEntry(entry, index)}>
                        <PencilLine className="h-4 w-4" /> 修改這筆
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
