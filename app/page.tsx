import Link from "next/link"
import { ArrowRight, Shield, Heart, TrendingUp, MessageCircle, Headphones, BookOpen, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const heroCards = [
  {
    href: "/financial-resilience",
    title: "看看我的財務狀態",
    description: "了解目前的收支與承受能力",
    cta: "開始看看",
    icon: Shield,
    color: "bg-primary/10 text-primary",
    highlight: false,
  },
  {
    href: "/financial-anxiety",
    title: "我最近有點焦慮",
    description: "看看金錢壓力對生活的影響",
    cta: "先了解",
    icon: Heart,
    color: "bg-accent/30 text-accent-foreground",
    highlight: false,
  },
  {
    href: "/fraud-defense",
    title: "檢查詐騙風險",
    description: "確認自己是否容易遇到金融風險",
    cta: "試試看",
    icon: TrendingUp,
    color: "bg-secondary text-secondary-foreground",
    highlight: false,
  },
  {
    href: "/ask-ai",
    title: "不確定從哪開始？",
    description: "把你的狀況打出來，我幫你整理",
    cta: "先問看看",
    icon: MessageCircle,
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
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">
              已經有超過 60,000 人開始整理自己的財務
            </h2>
          </div>
          
          {/* Row 1 - 成果與合作 */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">成果與合作</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-foreground">星展基金會（DBS Foundation）支持合作計畫</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-foreground">與全台多個社福單位、社工體系合作</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-foreground">累積服務超過 11,000 個家庭經濟案例</p>
              </div>
            </div>
          </div>

          {/* Row 2 - 媒體怎麼看我們 */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">媒體怎麼看我們</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-foreground">商業周刊專訪：從補助到韌性，重新理解家庭經濟</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-foreground">Podcast / 電台訪談：家庭財務與生活壓力的真實樣貌</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-foreground">多場公開分享與論壇交流（社工、教育、金融領域）</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/impact">
                查看更多成果 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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
