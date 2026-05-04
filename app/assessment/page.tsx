import Link from "next/link"
import { Shield, Heart, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const assessments = [
  {
    href: "/financial-resilience",
    title: "財務韌性檢測",
    description: "看看你的生活承受能力",
    icon: Shield,
    color: "bg-primary/10 text-primary",
    cta: "開始測試",
  },
  {
    href: "/financial-anxiety",
    title: "財務焦慮檢測",
    description: "了解壓力對你的影響",
    icon: Heart,
    color: "bg-accent/30 text-accent-foreground",
    cta: "開始測試",
  },
  {
    href: "/fraud-defense",
    title: "詐騙防禦檢測",
    description: "檢查你的風險意識",
    icon: AlertTriangle,
    color: "bg-secondary text-secondary-foreground",
    cta: "開始測試",
  },
]

export default function AssessmentPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">開始檢測</h1>
          <p className="text-muted-foreground text-lg">選擇適合你的檢測，了解自己的財務狀況</p>
        </div>

        <div className="space-y-4">
          {assessments.map((assessment) => {
            const Icon = assessment.icon
            return (
              <Link key={assessment.href} href={assessment.href} className="block group">
                <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-xl ${assessment.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1">{assessment.title}</h3>
                      <p className="text-muted-foreground">{assessment.description}</p>
                    </div>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all shrink-0">
                      {assessment.cta} <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
