import Link from "next/link"
import { ArrowRight, Award, ExternalLink, Shield, Heart, TrendingUp, Headphones, BookOpen, Newspaper } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    title: "新聞報導",
    description: "查看好理家在獲得各界媒體關注與肯定的完整列表。",
    href: externalLinks.mediaReports,
    cta: "查看報導",
    previewTitle: "媒體報導",
    previewText: "42 篇媒體收錄",
    icon: Newspaper,
  },
  {
    title: "商周採訪",
    description: "商業周刊專訪財務社工如何陪伴家庭脫困。",
    href: externalLinks.businessWeeklyInterview,
    cta: "閱讀採訪",
    previewTitle: "商業周刊",
    previewText: "讓金錢不再是陷阱的人",
    icon: BookOpen,
  },
  {
    title: "台北之音訪問",
    description: "透過訪談了解好理家在推動財務健康的理念。",
    href: externalLinks.taipeiRadioInterview,
    cta: "觀看訪問",
    previewTitle: "YouTube Live",
    previewText: "台北之音訪問",
    icon: Headphones,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
              你現在想處理哪一件事？
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-balance">
              不用懂理財，先從最接近你的狀況開始
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {heroCards.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.href} href={card.href} className="group">
                  <Card className={`h-full border-border/70 bg-card/90 shadow-[0_18px_45px_oklch(0.78_0.08_42_/_0.12)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_22px_55px_oklch(0.74_0.12_34_/_0.2)] group-hover:-translate-y-1 ${card.highlight ? "ring-2 ring-accent/20" : ""}`}>
                    <CardContent className="p-6">
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
      <section id="trust" className="px-4 py-12 bg-card/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">
              已經有超過 101,000 人開始整理自己的財務
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              目前已有 101,121 位不重複訪客造訪好理家在，透過檢測、工具與內容開始整理自己的財務狀態。
            </p>
          </div>

          <Card className="mb-4 border-primary/30 bg-gradient-to-br from-primary/15 via-card to-secondary/80 shadow-[0_18px_45px_oklch(0.78_0.08_42_/_0.14)]">
            <CardContent className="p-6">
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
                  <Card key={item.title} className="h-full overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-primary/30 via-secondary to-accent/20 p-4">
                      <div className="h-full rounded-2xl border border-background/70 bg-background/85 p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-xs font-medium text-muted-foreground">{item.previewTitle}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground line-clamp-2">{item.previewText}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
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
