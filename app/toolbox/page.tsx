import Link from "next/link"
import { Calculator, FileText, Target, Banknote, MessageSquare, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    title: "日常整理",
    tools: [
      {
        href: "/toolbox/accounting",
        title: "記帳助理",
        description: "輕鬆記錄每日收支",
        icon: Calculator,
      },
    ],
  },
  {
    title: "目標規劃",
    tools: [
      {
        href: "/toolbox/planning",
        title: "財務規劃",
        description: "設定並追蹤你的財務目標",
        icon: Target,
      },
    ],
  },
  {
    title: "問題處理",
    tools: [
      {
        href: "/toolbox/debt",
        title: "債務盤點",
        description: "整理並了解你的債務狀況",
        icon: FileText,
      },
      {
        href: "/toolbox/simulator",
        title: "財務試算",
        description: "計算還款、儲蓄方案",
        icon: Banknote,
      },
      {
        href: "/toolbox/consultation",
        title: "線上諮詢",
        description: "預約專人協助你",
        icon: MessageSquare,
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

        <div className="space-y-8">
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
