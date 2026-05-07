import Link from "next/link"
import { ArrowRight, Award, ExternalLink, Shield, Heart, TrendingUp, Headphones, BookOpen, Star, Newspaper } from "lucide-react"
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
    color: "bg-primary/10 text-primary",
    highlight: false,
  },
  {
    href: assessmentLinks.financialAnxiety,
    title: "我最近有點焦慮",
    description: "看看金錢壓力對生活的影響",
    cta: "先了解",
    icon: Heart,
    color: "bg-accent/30 text-accent-foreground",
    highlight: false,
  },
  {
    href: assessmentLinks.fraudDefense,
    title: "檢查詐騙風險",
    description: "確認自己是否容易遇到金融風險",
    cta: "試試看",
    icon: TrendingUp,
    color: "bg-secondary text-secondary-foreground",
    highlight: false,
  },
  {
    href: externalLinks.emergencySupport,
    title: "急難救助專區",
    description: "遇到急難狀況時，協助整理需求並連結資源",
    cta: "前往申請",
    icon: Heart,
    color: "bg-primary text-primary-foreground",
    highlight: true,
  },
]

const exploreItems = [
  {
    href: "/content/podcast",
    title: "聽一集",
    description: "為什麼明明有收入，還是存不到錢？",
    icon: Headphones,
  },
  {
    href: "/content/articles",
    title: "看一篇",
    description: "錢不夠用，其實不只是你不夠努力",
    icon: BookOpen,
  },
  {
    href: "/content/column",
    title: "看專欄",
    description: "多多益善：從生活重新看懂金錢",
    icon: Star,
  },
]

const mediaLinks = [
  {
    title: "媒體報導與採訪彙整",
    description: "查看好理家在獲得各界媒體關注與肯定的完整列表。",
    href: "https://www.familyfinhealth.com/",
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
                  <Card className={`h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${card.highlight ? "ring-2 ring-primary/20" : ""}`}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                      <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
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
      <section className="px-4 py-12 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">
              已經有超過 84,000 人開始整理自己的財務
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              目前已有 84,642 位使用者造訪好理家在，透過檢測、工具與內容開始整理自己的財務狀態。
            </p>
          </div>

          <Card className="mb-4 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
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

          <div className="grid md:grid-cols-1 gap-4">
            {mediaLinks.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <Newspaper className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    前往查看 <ExternalLink className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">如果你還想多了解</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {exploreItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="group">
                  <Card className="h-full border-border hover:border-primary/30 hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
