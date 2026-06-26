import Link from "next/link"
import { Banknote, Calculator, FileText, MessageSquare, Target } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

const financialCalculatorBase = externalLinks.financialCalculator

const debtToolLink = (tool: string, debtTab: number) =>
  `${financialCalculatorBase}?tab=financial-calculator&subTab=debt&debtTab=${debtTab}&tool=${tool}`

const accountingToolLink = (tool: string, accountingTab: number) =>
  `${financialCalculatorBase}?tab=financial-calculator&subTab=accounting&accountingTab=${accountingTab}&tool=${tool}`

const categories = [
  {
    id: "accounting-assistant",
    title: "日常整理",
    tools: [
      {
        href: `${financialCalculatorBase}/basic-accounting`,
        title: "記帳助理",
        description: "輸入日常收支、分類與備註，逐步整理每月金流與生活支出。",
        icon: Calculator,
      },
      {
        href: accountingToolLink("monthly-financial-report", 1),
        title: "財務月報表",
        description: "彙整收入、支出與結餘，快速看懂每月財務狀況。",
        icon: Banknote,
      },
      {
        href: accountingToolLink("financial-health-dashboard", 3),
        title: "財務健康儀表板",
        description: "檢視收入、支出、負債與資產，掌握整體財務健康。",
        icon: Target,
      },
    ],
  },
  {
    id: "goal-planning",
    title: "目標規劃",
    tools: [
      {
        href: externalLinks.financialPlanning,
        title: "生活目標財務規劃",
        description: "依照人生目標整理金額、時間與行動計畫。",
        icon: Target,
      },
      {
        href: "/toolbox/simulator",
        title: "儲蓄目標試算",
        description: "輸入目標金額與每月可存金額，估算達成時間。",
        icon: Calculator,
      },
    ],
  },
  {
    id: "risk-handling",
    title: "風險處理",
    tools: [
      {
        href: debtToolLink("debt-warning-tool", 3),
        title: "債務警示工具",
        description: "檢測 DBR、月負債比與資產負債率，取得風險評估。",
        icon: FileText,
      },
      {
        href: debtToolLink("interest-calculator", 1),
        title: "債務利率試算",
        description: "輸入本金、利率與期數，初步估算利息與還款壓力。",
        icon: Calculator,
      },
      {
        href: accountingToolLink("debt-assessment", 1),
        title: "債務盤點表",
        description: "整理債務項目、金額與還款狀態，先看清楚整體壓力。",
        icon: FileText,
      },
    ],
  },
  {
    id: "debt-calculation",
    title: "債務試算",
    tools: [
      {
        href: "/toolbox/credit-card",
        title: "信用卡",
        description: "分析信用卡債務、利息與最低還款額，降低卡債壓力。",
        icon: Banknote,
      },
      {
        href: "/toolbox/personal-loan",
        title: "信貸",
        description: "試算信貸月付金、利息與還款期數，評估每月負擔。",
        icon: Calculator,
      },
      {
        href: "/toolbox/car-loan",
        title: "車貸",
        description: "比較車貸利率與條件，找出符合預算的貸款方案。",
        icon: Banknote,
      },
      {
        href: debtToolLink("mortgage", 2),
        title: "房貸",
        description: "試算房貸月付金、利息總額與攤還表，規劃長期房貸。",
        icon: Target,
      },
      {
        href: debtToolLink("new-youth-loan", 2),
        title: "新青安",
        description: "試算新青安貸款利率、補貼與月付金，掌握購屋壓力。",
        icon: Target,
      },
      {
        href: debtToolLink("aid-association", 2),
        title: "標會",
        description: "計算標會投資報酬與風險，了解不同制度下的收益情況。",
        icon: MessageSquare,
      },
      {
        href: debtToolLink("pawn-shop", 2),
        title: "當鋪",
        description: "試算當鋪借款利息與還款成本，避免高成本借貸風險。",
        icon: Banknote,
      },
    ],
  },
  {
    id: "rights-calculation",
    title: "權益試算",
    tools: [
      {
        href: accountingToolLink("severance-calculator", 2),
        title: "資遣費試算",
        description: "依勞基法與勞退條例試算資遣費，支援多種年資情境。",
        icon: FileText,
      },
      {
        href: accountingToolLink("overtime-calculator", 2),
        title: "加班費試算",
        description: "依勞基法試算平日、休息日與國定假日加班費。",
        icon: Calculator,
      },
      {
        href: accountingToolLink("annual-leave-calculator", 2),
        title: "特休假試算",
        description: "依勞基法第 38 條試算特休天數與不同給假方式。",
        icon: Target,
      },
    ],
  },
]

export default function ToolboxPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 text-center">
          <h1 className="mb-3 text-3xl font-bold text-foreground">財務工具</h1>
          <p className="text-lg text-muted-foreground">
            如果你想先自己整理，可以從記帳、規劃、風險與試算工具開始。
          </p>
        </div>

        <div className="space-y-7">
          {categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <h2 className="mb-3 px-1 text-lg font-semibold text-foreground">{category.title}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => {
                  const Icon = tool.icon

                  return (
                    <Link key={tool.href} href={tool.href} className="group">
                      <Card className="h-full border-border transition-all duration-200 hover:border-primary/35 hover:bg-primary/5">
                        <CardContent className="flex gap-3 p-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="mb-1 font-semibold leading-5 text-foreground">{tool.title}</h3>
                            <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{tool.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
