import Link from "next/link"
import { ArrowRight, Award, ExternalLink, Shield, Heart, Headphones, BookOpen, Newspaper, Wrench, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

const audienceRoutes = [
  {
    href: "/assessment",
    title: "我想整理自己的狀況",
    description: "不知道從檢測、諮詢還是工具開始也沒關係，先用最接近生活的方式整理。",
    cta: "從自己的狀況開始",
    icon: Heart,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/social-worker",
    title: "我正在協助個案或家庭",
    description: "保留給社工與助人工作者的工作入口，接續整理、判斷、轉介與追蹤。",
    cta: "前往助人工作入口",
    icon: Users,
    color: "bg-accent/10 text-accent",
  },
]

const serviceLinks = [
  {
    href: "/assessment",
    label: "先看看目前狀況",
    helper: "檢測",
    icon: Shield,
  },
  {
    href: externalLinks.onlineConsultation,
    label: "找人一起整理",
    helper: "諮詢",
    icon: Headphones,
  },
  {
    href: "/toolbox",
    label: "整理收支、債務與規劃",
    helper: "工具",
    icon: Wrench,
  },
  {
    href: "/content",
    label: "先了解相關知識",
    helper: "內容",
    icon: BookOpen,
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
            <h1 className="mx-auto max-w-[19rem] text-2xl sm:max-w-none sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-4 text-balance">
              你現在比較接近哪一種狀況？
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[21rem] sm:max-w-xl mx-auto text-balance">
              檢測、諮詢、工具、內容和社工服務都在這裡；先選最接近現在的下一步。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {audienceRoutes.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.href} href={card.href} className="group">
                  <Card className="h-full border-border/80 bg-card/95 shadow-[0_16px_40px_oklch(0.62_0.05_180_/_0.12)] transition-all duration-300 hover:border-primary/45 hover:shadow-[0_22px_55px_oklch(0.56_0.08_180_/_0.18)] group-hover:-translate-y-1">
                    <CardContent className="p-6 sm:p-7">
                      <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{card.description}</p>
                      <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        {card.cta} <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {serviceLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm transition-all hover:border-primary/35 hover:bg-card"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.helper}</span>
                  </div>
                  <p className="font-medium text-foreground">{item.label}</p>
                </Link>
              )
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-destructive/20 bg-card/80 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <Heart className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">已經遇到急難狀況？</p>
                  <p className="text-sm text-muted-foreground">先到急難救助專區整理需求並連結資源。</p>
                </div>
              </div>
              <Link
                href={externalLinks.emergencySupport}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                前往急難救助 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-12 bg-card/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">
              已經有超過 97,000 人開始整理自己的財務
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              目前已有 97,278 位使用者造訪好理家在，透過檢測、工具與內容開始整理自己的財務狀態。
            </p>
          </div>

          <Card className="mb-4 border-primary/25 bg-gradient-to-br from-primary/10 via-card to-secondary/70 shadow-[0_18px_45px_oklch(0.62_0.05_180_/_0.14)]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-14 h-14 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
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
                    <div className="h-32 bg-gradient-to-br from-primary/18 via-secondary/80 to-accent/12 p-4">
                      <div className="h-full rounded-xl border border-background/70 bg-background/90 p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/12 flex items-center justify-center">
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
