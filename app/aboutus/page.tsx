import Link from "next/link"
import { ArrowRight, Heart, Users, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { assessmentLinks } from "@/lib/assessment-links"
import { audienceStats, serviceStats, websiteStats } from "@/lib/impact-data"

const values = [
  {
    title: "以家為本",
    description: "從家庭生活與財務樣態出發，協助及早看見壓力與支持點。",
    icon: Heart,
  },
  {
    title: "社工導向",
    description: "把第一線服務經驗整理成可操作的工具，讓助人工作更有力量。",
    icon: Users,
  },
  {
    title: "資源連結",
    description: "串起知識、工具與諮詢資源，陪使用者一步步整理現況。",
    icon: Wrench,
  },
]

export default function AboutUsPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">關於我們</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            馴錢師財商研究中心
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            我們致力於以科技賦能社會工作，打造更有力的家庭財務支持系統，讓每個需要幫助的家庭都能獲得專業、即時且適切的支援。
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">使命</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                運用創新科技解決社工在家庭經濟個案處理上的實務痛點，提升服務效能與品質。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">願景</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                建構以家為本、社工導向、資源連結的綜合服務生態系統，讓「好好理財，家才會在」成為可實踐的支持。
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">核心價值</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">成果展現</h2>
            <p className="text-sm text-muted-foreground">受眾、服務觸及與網站使用概況</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {audienceStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...serviceStats, ...websiteStats].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  {"note" in stat && stat.note && <p className="text-xs text-muted-foreground mt-1">{stat.note}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">先確認現在的位置，再慢慢想接下來的事</h2>
            <p className="text-muted-foreground mb-6">從一份簡單檢測開始，整理目前的財務狀態。</p>
            <Button asChild>
              <Link href={assessmentLinks.financialResilience}>
                開始檢視 <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
