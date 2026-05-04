"use client"

import Link from "next/link"
import { User, ClipboardCheck, TrendingUp, Wrench, Lightbulb, ArrowRight, Calculator, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// This would come from a database in a real app
const mockUserData = {
  hasAssessments: false,
  hasFinancialData: false,
  hasUsedTools: false,
}

const emptyStateActions = [
  {
    href: "/assessment",
    title: "做檢測",
    description: "了解你的財務狀況",
    icon: ClipboardCheck,
  },
  {
    href: "/toolbox/accounting",
    title: "開始記帳",
    description: "追蹤你的收支",
    icon: Calculator,
  },
]

const sections = [
  {
    id: "assessments",
    title: "我的檢測紀錄",
    icon: ClipboardCheck,
    emptyMessage: "還沒有做過檢測",
    ctaHref: "/assessment",
    ctaLabel: "開始檢測",
  },
  {
    id: "financial",
    title: "我的財務變化",
    icon: TrendingUp,
    emptyMessage: "還沒有財務資料",
    ctaHref: "/toolbox/accounting",
    ctaLabel: "開始記帳",
  },
  {
    id: "tools",
    title: "我的工具",
    icon: Wrench,
    emptyMessage: "還沒有使用過工具",
    ctaHref: "/toolbox",
    ctaLabel: "瀏覽工具",
  },
  {
    id: "recommendations",
    title: "下一步建議",
    icon: Lightbulb,
    emptyMessage: "完成檢測後會有建議",
    ctaHref: "/assessment",
    ctaLabel: "開始檢測",
  },
]

export default function PersonalCenterPage() {
  const isEmpty = !mockUserData.hasAssessments && !mockUserData.hasFinancialData && !mockUserData.hasUsedTools

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">個人中心</h1>
            <p className="text-muted-foreground">追蹤你的財務旅程</p>
          </div>
        </div>

        {isEmpty ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">開始你的財務旅程</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              你還沒有任何紀錄。從檢測或記帳開始，我們會幫你追蹤進度。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {emptyStateActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href} className="group">
                    <Card className="h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                    </div>
                    <div className="text-center py-6 bg-secondary/50 rounded-lg mb-4">
                      <p className="text-muted-foreground">{section.emptyMessage}</p>
                    </div>
                    <Button asChild variant="secondary" className="w-full">
                      <Link href={section.ctaHref}>
                        {section.ctaLabel} <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
