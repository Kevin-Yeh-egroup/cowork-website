import Link from "next/link"
import { ArrowRight, Award, ExternalLink, Shield, Heart, TrendingUp, Headphones, BookOpen, Newspaper } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { HomeSituationIllustration } from "@/components/context-illustration"
import { assessmentLinks } from "@/lib/assessment-links"
import { externalLinks } from "@/lib/external-links"

const heroCards = [
  {
    href: assessmentLinks.financialResilience,
    title: "看看我的財務狀態",
    description: "了解目前的收支與承受能力",
    cta: "開始看看",
    icon: Shield,
    color: "bg-[#fff0d6] text-[#d96b27]",
    highlight: false,
  },
  {
    href: assessmentLinks.financialAnxiety,
    title: "我最近有點焦慮",
    description: "看看金錢壓力對生活的影響",
    cta: "先了解",
    icon: Heart,
    color: "bg-[#ffe4ef] text-[#c81f72]",
    highlight: false,
  },
  {
    href: assessmentLinks.fraudDefense,
    title: "檢查詐騙風險",
    description: "確認自己是否容易遇到金融風險",
    cta: "試試看",
    icon: TrendingUp,
    color: "bg-[#f0e7ff] text-[#7b4bd8]",
    highlight: false,
  },
  {
    href: externalLinks.emergencySupport,
    title: "急難救助專區",
    description: "遇到急難狀況時，協助整理需求並連結資源",
    cta: "前往申請",
    icon: Heart,
    color: "bg-gradient-to-br from-[#ff78ad] to-[#e6005c] text-white shadow-lg shadow-[#e6005c]/20",
    highlight: true,
  },
]

const aboutLinks = [
  {
    title: "媒體報導",
    description: "查看好理家在獲得各界媒體關注與肯定的完整列表。",
    href: externalLinks.mediaReports,
    cta: "查看報導",
    icon: Newspaper,
  },
  {
    title: "商周採訪",
    description: "商業周刊專訪財務社工如何陪伴家庭脫困。",
    href: externalLinks.businessWeeklyInterview,
    cta: "閱讀採訪",
    icon: BookOpen,
  },
  {
    title: "台北之音訪問",
    description: "透過訪談了解好理家在推動財務健康的理念。",
    href: externalLinks.taipeiRadioInterview,
    cta: "觀看訪問",
    icon: Headphones,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-10 sm:py-12">
        <div className="absolute inset-x-0 top-0 h-80 bg-secondary/35" aria-hidden="true" />
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-6 grid overflow-hidden rounded-lg border border-border/70 bg-card/90 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.8fr)] lg:items-center lg:gap-8 lg:px-10">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-medium text-primary">好理家在</p>
              <h1 className="text-2xl font-bold text-foreground text-balance sm:text-3xl lg:text-4xl">
                先把生活裡的財務壓力，整理成可以開始的下一步
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                不必一次把所有問題想清楚。從現在最接近你的生活狀況開始，慢慢看見能先處理的順序。
              </p>
            </div>
            <HomeSituationIllustration className="mt-6 h-72 sm:h-80 lg:mt-0 lg:h-72" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroCards.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.href} href={card.href} className="group">
                  <Card className={`h-full border-border/70 bg-card/90 shadow-[0_18px_45px_oklch(0.78_0.08_42_/_0.12)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_22px_55px_oklch(0.74_0.12_34_/_0.2)] group-hover:-translate-y-1 ${card.highlight ? "ring-2 ring-accent/20" : ""}`}>
                    <CardContent className="p-5">
                      <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                      <span className="text-sm text-accent font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        {card.cta} <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="px-4 py-10 bg-card/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">
              已經有超過 104,000 人開始整理自己的財務
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              目前已有 104,216 位不重複訪客造訪好理家在，透過檢測、工具與內容開始整理自己的財務狀態。
            </p>
          </div>

          <Card className="mb-4 border-primary/30 bg-gradient-to-br from-primary/15 via-card to-secondary/80 shadow-[0_18px_45px_oklch(0.78_0.08_42_/_0.14)]">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary mb-2">2025 IT Matters Awards</p>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    AI Selected 社會影響力獎
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    馴錢師以「好理家在–財務健檢網」獲頒第三屆 IT Matters Awards「AI Selected 社會影響力獎」，代表家庭財務與社會福利已成為 AI 社會影響力的重要議題。
                  </p>
                  <Link
                    href="https://www.familyfinhealth.com/news/1"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    2025 IT Matters Awards 完整獲獎報導 <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 text-center">關於我們</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aboutLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="h-full border-border/70 bg-card/90">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                      >
                        {item.cta} <ExternalLink className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
