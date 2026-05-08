import Link from "next/link"
import { Calculator, FileText, Target, Banknote, MessageSquare, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

const financialCalculatorBase = externalLinks.financialCalculator

const debtToolLink = (tool: string, debtTab: number) =>
  `${financialCalculatorBase}?tab=financial-calculator&subTab=debt&debtTab=${debtTab}&tool=${tool}`

const accountingToolLink = (tool: string, accountingTab: number) =>
  `${financialCalculatorBase}?tab=financial-calculator&subTab=accounting&accountingTab=${accountingTab}&tool=${tool}`

const categories = [
  {
    title: "日常整理",
    tools: [
      {
        href: `${financialCalculatorBase}/basic-accounting`,
        title: "財務生活記帳助理",
        description: "智慧分類、月度分析、視覺化圖表，協助整理日常收支。",
        icon: Calculator,
      },
      {
        href: accountingToolLink("monthly-financial-report", 1),
        title: "財務月報表",
        description: "分析收支、資產負債與現金流，掌握整體財務狀況。",
        icon: Banknote,
      },
      {
        href: accountingToolLink("financial-health-dashboard", 3),
        title: "財務健康與安全儀表板",
        description: "評估收支平衡、資產負債、緊急預備金與保障指標。",
        icon: Target,
      },
    ],
  },
  {
    title: "目標規劃",
    tools: [
      {
        href: externalLinks.financialPlanning,
        title: "夢想達成財務規劃",
        description: "透過互動式步驟整理目標、金額與行動計畫。",
        icon: Target,
      },
      {
        href: "/toolbox/simulator",
        title: "存錢試算小工具",
        description: "輸入目標金額與每月可存金額，估算達成時間。",
        icon: Calculator,
      },
    ],
  },
  {
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
        description: "整合還款方式、寬限期與法定利率檢測，掌握借貸成本。",
        icon: Calculator,
      },
      {
        href: accountingToolLink("debt-assessment", 1),
        title: "債務盤點表",
        description: "整理債權人、金額與利率，協助建立還款計畫。",
        icon: FileText,
      },
    ],
  },
  {
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
        description: "依勞基法試算平日、休息日與休假日出勤費用。",
        icon: Calculator,
      },
      {
        href: accountingToolLink("annual-leave-calculator", 2),
        title: "特休假試算",
        description: "依勞基法第 38 條試算特休天數與不同給假方式。",
        icon: Target,
      },
      {
        href: debtToolLink("credit-card", 2),
        title: "信用卡",
        description: "分析信用卡債務、利息與最低還款額，降低卡債壓力。",
        icon: Banknote,
      },
      {
        href: debtToolLink("loan-calculator", 2),
        title: "信貸",
        description: "計算每月還款金額、寬限期與額外費用，掌握貸款成本。",
        icon: Calculator,
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
        description: "試算青年安心成家優惠貸款方案與長期付款規劃。",
        icon: Target,
      },
      {
        href: debtToolLink("car-loan", 2),
        title: "車貸",
        description: "比較車貸利率與條件，找出符合預算的貸款方案。",
        icon: Banknote,
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
        description: "試算質押借款的利息與費用，了解借款價值與成本。",
        icon: Banknote,
      },
    ],
  },
]

export default function ToolboxPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">財務工具</h1>
          <p className="text-muted-foreground text-lg">選擇適合你的工具，一步步改善財務狀況</p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category.title}>
              <h2 className="text-lg font-semibold text-foreground mb-4 px-1">{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link key={tool.href} href={tool.href} className="group">
                      <Card className="h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">{tool.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                          <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            開始使用 <ArrowRight className="h-4 w-4" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
