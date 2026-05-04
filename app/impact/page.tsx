import Link from "next/link"
import { ArrowRight, Users, Building, Mic, Award, TrendingUp, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  { number: "60,000+", label: "使用者", icon: Users },
  { number: "11,000+", label: "家庭經濟案例", icon: Heart },
  { number: "50+", label: "合作社福單位", icon: Building },
]

const partnerships = [
  {
    title: "星展基金會 DBS Foundation",
    description: "支持合作計畫，共同推動家庭財務韌性發展",
  },
  {
    title: "全台社福單位",
    description: "與多個社會福利機構、社工體系建立長期合作關係",
  },
  {
    title: "教育與金融機構",
    description: "跨領域合作推廣財務教育與資源整合",
  },
]

const mediaFeatures = [
  {
    title: "商業周刊專訪",
    subtitle: "從補助到韌性，重新理解家庭經濟",
    icon: Award,
  },
  {
    title: "Podcast / 電台訪談",
    subtitle: "家庭財務與生活壓力的真實樣貌",
    icon: Mic,
  },
  {
    title: "公開分享與論壇",
    subtitle: "社工、教育、金融領域交流",
    icon: TrendingUp,
  },
]

export default function ImpactPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">
            我們的成果與影響
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-balance">
            好理家在致力於幫助每個家庭建立財務韌性，以下是我們共同創造的改變
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Partnerships */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">合作夥伴</h2>
          <div className="grid gap-4">
            {partnerships.map((partner) => (
              <Card key={partner.title}>
                <CardContent className="p-6">
                  <h3 className="font-medium text-foreground mb-1">{partner.title}</h3>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Media */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">媒體報導</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {mediaFeatures.map((media) => {
              const Icon = media.icon
              return (
                <Card key={media.title}>
                  <CardContent className="p-6">
                    <Icon className="h-6 w-6 text-primary mb-3" />
                    <h3 className="font-medium text-foreground mb-1">{media.title}</h3>
                    <p className="text-sm text-muted-foreground">{media.subtitle}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">想成為改變的一份子？</h3>
            <p className="text-muted-foreground mb-6">無論你是個人、社工或機構，都歡迎一起加入</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/financial-resilience">
                  開始檢測 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/social-worker">社工專區</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
