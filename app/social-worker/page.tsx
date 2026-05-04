import Link from "next/link"
import { Users, BookOpen, Wrench, Calendar, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const resources = [
  {
    href: "/events",
    title: "社工培訓課程",
    description: "學習如何協助個案處理財務問題",
    icon: Calendar,
  },
  {
    href: "/toolbox",
    title: "財務評估工具",
    description: "使用各項工具協助個案評估財務狀況",
    icon: Wrench,
  },
  {
    href: "/content/articles",
    title: "教育資源",
    description: "適合分享給個案的文章和教材",
    icon: BookOpen,
  },
  {
    href: "#",
    title: "個案管理系統",
    description: "追蹤個案進度和服務紀錄",
    icon: FileText,
  },
]

const stats = [
  { number: "500+", label: "服務社工" },
  { number: "10,000+", label: "協助個案" },
  { number: "50+", label: "合作機構" },
]

export default function SocialWorkerPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">社工專區</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            為社工夥伴準備的資源和工具，幫助你更有效地協助個案
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-card rounded-xl border border-border">
              <p className="text-2xl font-bold text-primary mb-1">{stat.number}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">資源與工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon
            return (
              <Link key={resource.title} href={resource.href} className="group">
                <Card className="h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      前往 <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">需要協助？</h2>
          <p className="text-muted-foreground mb-4">
            如果你在使用平台時遇到問題，或有任何建議，歡迎聯繫我們的支援團隊。
          </p>
          <Link 
            href="/toolbox/consultation" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            聯繫支援團隊 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
