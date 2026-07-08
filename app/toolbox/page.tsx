import Link from "next/link"
import { Banknote, Calculator, FileText, MessageSquare, Target } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "accounting-assistant",
    title: "日常整理",
    tools: [
      {
        href: "/toolbox/accounting",
        title: "記帳助理",
        description: "記錄收入與支出，協助整理每月現金流。",
        icon: Calculator,
      },
      {
        href: "/toolbox/monthly-report",
        title: "財務月報表",
        description: "彙整收入、支出、資產與負債，看見財務全貌。",
        icon: Banknote,
      },
      {
        href: "/toolbox/financial-health-dashboard",
        title: "財務健康儀表板",
        description: "用指標檢視收支、預備金、負債與保障狀況。",
        icon: Target,
      },
    ],
  },
  {
    id: "goal-planning",
    title: "目標規劃",
    tools: [
      {
        href: "/toolbox/planning",
        title: "生活目標財務規劃",
        description: "依照生活目標整理金額、時間與每月準備方式。",
        icon: Target,
      },
      {
        href: "/toolbox/planning/quick",
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
        href: "/toolbox/debt",
        title: "債務盤點表",
        description: "整理每一筆債務，查看利率排序、壓力與警示。",
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
        description: "試算信用卡還款時間、利息與每月負擔。",
        icon: Banknote,
      },
      {
        href: "/toolbox/personal-loan",
        title: "信貸",
        description: "試算信貸月付、利息與還款壓力。",
        icon: Calculator,
      },
      {
        href: "/toolbox/car-loan",
        title: "車貸",
        description: "整理車貸金額、利率、期數與每月負擔。",
        icon: Banknote,
      },
      {
        href: "/toolbox/mortgage",
        title: "房貸",
        description: "試算房貸月付，也一起檢視家庭負擔。",
        icon: Target,
      },
      {
        href: "/toolbox/new-youth-loan",
        title: "新青安",
        description: "檢視補貼期、寬限期與補貼結束後的月付變化。",
        icon: Target,
      },
      {
        href: "/toolbox/aid-association",
        title: "標會",
        description: "整理會款、標金與可能風險，先看清楚再決定。",
        icon: MessageSquare,
      },
      {
        href: "/toolbox/pawn-shop",
        title: "當鋪",
        description: "整理借款、利息、倉棧費與流當風險。",
        icon: Banknote,
      },
    ],
  },
  {
    id: "rights-calculation",
    title: "權益試算",
    tools: [
      {
        href: "https://calcr2.mol.gov.tw/SeverancePay",
        title: "資遣費試算",
        description: "連至勞動部官方試算頁，建議以政府單位資料為準。",
        icon: FileText,
      },
      {
        href: "https://calcr2.mol.gov.tw/Index",
        title: "加班費試算",
        description: "連至勞動部官方試算頁，協助確認加班費權益。",
        icon: Calculator,
      },
      {
        href: "https://calcr2.mol.gov.tw/RestDays",
        title: "特休假試算",
        description: "連至勞動部官方試算頁，方便核對特休假天數。",
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
            先從最需要整理的地方開始，工具可以單獨使用，也可以登入後慢慢累積成自己的財務紀錄。
          </p>
        </div>

        <div className="space-y-7">
          {categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <h2 className="mb-3 px-1 text-lg font-semibold text-foreground">{category.title}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => {
                  const Icon = tool.icon
                  const isExternal = tool.href.startsWith("http")

                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group"
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                    >
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
