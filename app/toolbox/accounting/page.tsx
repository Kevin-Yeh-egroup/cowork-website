"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Calculator,
  ClipboardList,
  Landmark,
  Mic,
  PencilLine,
  ReceiptText,
  RotateCcw,
  Sparkles,
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
  { id: "food", label: "食", description: "三餐、宵夜、零食、飲品、買菜及其他個人或家庭飲食費用。", reportField: "生活支出 - 食" },
  { id: "clothing", label: "衣", description: "衣褲、帽子、鞋子、包包、飾品、剪髮、燙染髮、保養品及其他穿著或個人照護費用。", reportField: "生活支出 - 衣" },
  { id: "housing", label: "住", description: "房租、管理費、家用水電、瓦斯、家具、家電、生活用品，以及居家修繕與裝修費用。", reportField: "生活支出 - 住" },
  { id: "transport", label: "行", description: "大眾運輸、悠遊卡儲值、計程車、汽機車油料、停車、維修及保養等交通費用。", reportField: "生活支出 - 行" },
  { id: "education", label: "育", description: "本人或子女的學雜費、補習費、課程費、書籍、教材、文具、制服，以及子女生活費與零用錢。", reportField: "生活支出 - 育" },
  { id: "recreation", label: "樂", description: "電影、展覽、遊樂園、旅遊、節慶活動、生日、週年紀念、公益彩券及其他休閒娛樂費用。", reportField: "生活支出 - 樂" },
  { id: "telecom", label: "電信", description: "手機月租費、家用電話、網路、第四台及其他個人或家庭通訊服務費用。", reportField: "生活支出 - 電信" },
  { id: "insurance", label: "保險", description: "本人或家人的健保、壽險、醫療險、儲蓄險、防癌險、意外險及其他保險費用，不區分繳費週期。", reportField: "生活支出 - 保險" },
  { id: "medical", label: "醫療", description: "看診、掛號、藥品、醫療器材、眼鏡及其他治療、保健或健康照護費用。", reportField: "生活支出 - 醫療" },
  { id: "savings", label: "儲蓄", description: "存入銀行或郵局的儲蓄、基金與其他投資、子女教育基金及退休準備金；這類屬於資金配置，並非實際消費。", reportField: "儲蓄與目標準備" },
  { id: "debt", label: "還款", description: "信用卡、車貸、房貸、信貸、當鋪借款及其他債務的本金、利息與手續費；信用卡消費若已記錄，繳卡費時不應重複計入。", reportField: "債務還款" },
  { id: "otherExpense", label: "其他", description: "個人稅金與規費、紅白包、請客、父母生活費、慈善捐款、宗教奉獻、郵資、意外損失，以及無法歸入其他類別的生活支出。", reportField: "生活支出 - 其他" },
]

const incomeSources: Option[] = [
  { id: "salary", label: "工作與薪酬收入", description: "因受僱工作所獲得的薪資、津貼、加班費、年終獎金、績效獎金及其他工作相關報酬。", reportField: "生活收入 - 工作與薪酬" },
  { id: "side", label: "非主要工作收入", description: "透過兼職、打工、零工或偶發性個人接案所獲得的收入；若接案已形成持續經營的事業，應改列為生意收入。", reportField: "生活收入 - 非主要工作" },
  { id: "rent", label: "個人租賃收入", description: "出租個人持有的房屋、土地、車位、車輛或其他資產所獲得的收入。", reportField: "生活收入 - 個人租賃" },
  { id: "investment", label: "投資收益", description: "運用個人資金進行存款、股票、基金、債券或其他投資所獲得的利息、股息、配息及資本利得。", reportField: "生活收入 - 投資收益" },
  { id: "pension", label: "退休金/年金", description: "因退休、保險、職業年資或年金制度所領取的一次性或定期給付。", reportField: "生活收入 - 退休金/年金" },
  { id: "subsidy", label: "個人政府補助", description: "政府提供給個人的生活補助、社會福利、育兒津貼、就業補助或其他福利性給付。", reportField: "生活收入 - 個人政府補助" },
  { id: "support", label: "親友贈與與繼承", description: "由家人或朋友贈與，或因遺產繼承而取得的金錢、財產及其他具有經濟價值的資產。", reportField: "生活收入 - 親友贈與與繼承" },
  { id: "assetSale", label: "個人資產出售收入", description: "出售個人持有的房屋、土地、車輛、收藏品或其他資產所取得的款項；若計算實際所得，應扣除原始成本及相關費用。", reportField: "生活收入 - 個人資產出售" },
  { id: "prize", label: "非工作獎金與獎項", description: "透過抽獎、中獎、競賽、評選或其他非受僱工作活動所獲得的獎金、獎品或獎勵。", reportField: "生活收入 - 非工作獎金與獎項" },
  { id: "otherIncome", label: "其他生活收入", description: "與個人生活相關，但無法歸入上述類別的其他收入。", reportField: "生活收入 - 其他" },
]

const businessExpenseCategories: Option[] = [
  { id: "businessMaterials", label: "原料", description: "購買製作商品所需的原料、準備轉售的商品、材料、食材或其他進貨成本。", reportField: "變動生意支出 - 原料" },
  { id: "businessPackaging", label: "包裝", description: "外帶盒、瓶罐、塑膠袋、標籤、貼紙、免洗餐具、夾鏈袋及其他包裝材料。", reportField: "變動生意支出 - 包裝" },
  { id: "businessSupplies", label: "營業耗材", description: "收據、文具、影印用品、清潔用品及其他會在營業過程中持續消耗的用品。", reportField: "變動生意支出 - 營業耗材" },
  { id: "businessLogistics", label: "物流與營業交通", description: "商品宅配、郵資、快遞，以及進貨、擺攤或拜訪客戶產生的交通、油料及運輸費用。", reportField: "變動生意支出 - 物流與營業交通" },
  { id: "businessVariableOther", label: "其他變動生意支出", description: "會隨營業活動增減，但無法歸入上述類別的支出。", reportField: "變動生意支出 - 其他" },
  { id: "businessRent", label: "場地租賃", description: "店面、攤位、倉庫、辦公空間及其他營業場所的租金。", reportField: "固定生意支出 - 場地租賃" },
  { id: "businessLabor", label: "人力", description: "員工、助理、工讀生、臨時人員、計件人員及其他營業人力的薪資、津貼與相關費用。", reportField: "固定生意支出 - 人力" },
  { id: "businessProfessional", label: "專業服務與會費", description: "會計師、記帳士、律師、顧問等專業服務費，以及工會或協會會費。", reportField: "固定生意支出 - 專業服務與會費" },
  { id: "businessUtilities", label: "水電、能源與通訊", description: "營業場所使用的水費、電費、瓦斯費、電話費及網路費。", reportField: "固定生意支出 - 水電、能源與通訊" },
  { id: "businessTax", label: "稅金與政府規費", description: "營業稅、營利事業所得稅，以及其他營業相關稅金、登記費與政府規費。", reportField: "固定生意支出 - 稅金與政府規費" },
  { id: "businessInsurance", label: "商業保險", description: "商業火災險、公共意外責任險、產品責任險及其他事業保險費用。", reportField: "固定生意支出 - 商業保險" },
  { id: "businessDebt", label: "借款償還與融資成本", description: "事業借款的本金、利息及手續費。", reportField: "固定生意支出 - 借款償還與融資成本" },
  { id: "businessFixedOther", label: "其他固定生意支出", description: "維持營業所需，但無法歸入上述類別的固定支出。", reportField: "固定生意支出 - 其他" },
  { id: "businessEquipment", label: "新設備購置", description: "購買新的營業設備、器材、工具、機器或包裝設備的費用。", reportField: "額外生意支出 - 新設備購置" },
  { id: "businessRepair", label: "設備升級與修繕", description: "汰換、升級、維修或保養營業設備、器材、工具及機器的費用。", reportField: "額外生意支出 - 設備升級與修繕" },
  { id: "businessMarketing", label: "行銷與推廣", description: "廣告投放、DM、名片、招牌、紅布條、活動宣傳及設計製作費。", reportField: "額外生意支出 - 行銷與推廣" },
  { id: "businessTraining", label: "員工福利與訓練", description: "年終或績效獎金、員工旅遊、團體活動及教育訓練費用。", reportField: "額外生意支出 - 員工福利與訓練" },
  { id: "businessLoss", label: "存貨損耗與營業損失", description: "商品過期、損壞、遺失、盤點差異或其他營業事件造成的損失。", reportField: "額外生意支出 - 存貨損耗與營業損失" },
  { id: "businessProjectExpense", label: "特殊專案支出", description: "執行非日常或一次性事業計畫所產生的費用。", reportField: "額外生意支出 - 特殊專案" },
  { id: "businessExtraOther", label: "其他額外生意支出", description: "無法歸入上述類別的額外或臨時性事業支出。", reportField: "額外生意支出 - 其他" },
]

const businessIncomeSources: Option[] = [
  { id: "businessSales", label: "商品銷售收入", description: "銷售實體商品、數位商品、產品或材料所獲得的收入。", reportField: "生意收入 - 商品銷售" },
  { id: "businessService", label: "服務與專案收入", description: "提供專業服務、技術、顧問、設計、施工或執行各類專案所獲得的收入，包含單次專案及長期服務合約。", reportField: "生意收入 - 服務與專案" },
  { id: "businessLease", label: "租賃收入", description: "出租事業持有或使用的場地、設備、工具及其他營業資產所獲得的收入。", reportField: "生意收入 - 租賃" },
  { id: "businessRevenueShare", label: "合作與分潤收入", description: "透過品牌合作、通路合作、聯盟行銷、授權或收益分成所獲得的收入。", reportField: "生意收入 - 合作與分潤" },
  { id: "businessAssetSale", label: "事業資產出售收入", description: "出售二手設備、營業工具或其他閒置事業資產所取得的款項；若計算實際所得，應扣除資產成本及相關費用。", reportField: "生意收入 - 事業資產出售" },
  { id: "businessSubsidy", label: "企業補助收入", description: "企業因創業、研發、創新、轉型、人才培育或其他事業計畫所獲得的政府或民間補助。", reportField: "生意收入 - 企業補助" },
  { id: "businessInvestment", label: "企業投資收益", description: "運用企業資金進行存款、股票、基金或其他投資所獲得的利息、股息、配息及資本利得。", reportField: "生意收入 - 企業投資收益" },
  { id: "businessOtherIncome", label: "其他生意收入", description: "與事業經營直接相關，但無法歸入上述類別的其他收入。", reportField: "生意收入 - 其他" },
]

const categoryConfig = {
  personal: {
    expense: expenseCategories,
    income: incomeSources,
  },
  business: {
    expense: businessExpenseCategories,
    income: businessIncomeSources,
  },
}

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
  const categoryHintStyles = categories
    .map((category) => `.category-field:has(select option[value="${category.id}"]:checked) [data-category-hint="${category.id}"] { display: block; }`)
    .join("\n")

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

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
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

        <section className="mb-6">
          <Card className="border-border bg-card/90">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">語音輸入</p>
                  <h2 className="text-xl font-semibold text-foreground">也可以先用說的記一筆</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    之後可接語音轉文字，先把一句話拆成日期、收入或支出、類別、金額與備註。
                  </p>
                </div>
              </div>

              <textarea
                defaultValue="今天午餐 120 元，捷運 40 元；薪水入帳 38,000 元；轉 3,000 元到緊急預備金。"
                className="min-h-28 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 outline-none focus:border-primary"
              />

              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  可以這樣說
                </div>
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>「今天早餐 60 元、午餐 120 元，都是現金支付」</li>
                  <li>「本月薪水入帳 38,000 元，轉帳進來」</li>
                  <li>「轉 3,000 元到緊急預備金，算儲蓄」</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
                        data-account-toggle="personal"
                        onPointerDown={() => selectAccountScope("personal")}
                        onMouseDown={() => selectAccountScope("personal")}
                        onClick={() => selectAccountScope("personal")}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                          accountScope === "personal" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        個人帳
                      </button>
                      <button
                        type="button"
                        data-account-toggle="business"
                        onPointerDown={() => selectAccountScope("business")}
                        onMouseDown={() => selectAccountScope("business")}
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
                        data-entry-toggle="expense"
                        onPointerDown={() => selectType("expense")}
                        onMouseDown={() => selectType("expense")}
                        onClick={() => selectType("expense")}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                          entryType === "expense" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        支出
                      </button>
                      <button
                        type="button"
                        data-entry-toggle="income"
                        onPointerDown={() => selectType("income")}
                        onMouseDown={() => selectType("income")}
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
                  <label className="category-field space-y-2 text-sm font-medium text-foreground">
                    <span>{entryType === "income" ? "收入來源" : "支出類別"}</span>
                    <style>{`.category-field [data-category-hint] { display: none; }\n${categoryHintStyles}`}</style>
                    <select
                      data-category-select
                      value={selectedCategoryId}
                      onInput={(event) => selectCategory(event.currentTarget.value)}
                      onChange={(event) => selectCategory(event.target.value)}
                      onBlur={(event) => selectCategory(event.currentTarget.value)}
                      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <span className="sr-only" aria-live="polite">{selectedCategory.description}</span>
                    <div className="rounded-xl bg-secondary/70 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                      <span data-category-description>{selectedCategory.description}</span>
                    </div>
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
                    <span data-category-report-note>
                      你目前選的是「{selectedCategory.label}」，會更新財務月報表中的「{selectedCategory.reportField}」。
                    </span>
                    {selectedCategory.id === "savings"
                      ? "這筆錢會放在儲蓄與目標準備，並用來計算儲蓄後現金流。"
                      : "這筆資料也會進入收入、支出與月現金流計算。"}
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  const categoryConfig = ${JSON.stringify(categoryConfig)};
  const root = document.currentScript?.closest('.mx-auto') || document;
  const select = root.querySelector('[data-category-select]');
  const description = root.querySelector('[data-category-description]');
  const reportNote = root.querySelector('[data-category-report-note]');
  let accountScope = 'personal';
  let entryType = 'expense';

  function setActive(selector, activeValue, activeClasses, inactiveClasses) {
    root.querySelectorAll(selector).forEach((button) => {
      const value = button.getAttribute(selector.includes('account') ? 'data-account-toggle' : 'data-entry-toggle');
      button.classList.remove(...activeClasses, ...inactiveClasses);
      button.classList.add(...(value === activeValue ? activeClasses : inactiveClasses));
    });
  }

  function currentOptions() {
    return categoryConfig[accountScope][entryType] || [];
  }

  function updateCategorySelect() {
    if (!select) return;
    const options = currentOptions();
    select.innerHTML = options.map((item) => '<option value="' + item.id + '">' + item.label + '</option>').join('');
    updateCategoryText();
  }

  function updateCategoryText() {
    if (!select) return;
    const options = currentOptions();
    const selected = options.find((item) => item.id === select.value) || options[0];
    if (!selected) return;
    if (description) description.textContent = selected.description || '';
    if (reportNote) {
      reportNote.textContent = '你目前選的是「' + selected.label + '」，會更新財務月報表中的「' + (selected.reportField || '月報表') + '」。';
    }
  }

  root.querySelectorAll('[data-account-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      accountScope = button.getAttribute('data-account-toggle') || 'personal';
      setActive('[data-account-toggle]', accountScope, ['bg-primary', 'text-primary-foreground'], ['text-muted-foreground', 'hover:text-foreground']);
      updateCategorySelect();
    });
  });

  root.querySelectorAll('[data-entry-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      entryType = button.getAttribute('data-entry-toggle') || 'expense';
      setActive('[data-entry-toggle]', entryType, ['bg-primary', 'text-primary-foreground'], ['text-muted-foreground', 'hover:text-foreground']);
      updateCategorySelect();
    });
  });

  select?.addEventListener('change', updateCategoryText);
  updateCategorySelect();
})();
            `,
          }}
        />
      </div>
    </div>
  )
}
