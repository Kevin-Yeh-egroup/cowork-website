import Link from "next/link"
import {
  ArrowRight,
  Award,
  ExternalLink,
  Shield,
  Heart,
  Headphones,
  BookOpen,
  Newspaper,
  Wrench,
  Users,
  BriefcaseBusiness,
  WalletCards,
  ShieldQuestion,
  HeartPulse,
  Home as HomeIcon,
  ClipboardCheck,
  HandCoins,
  Bot,
  Calendar,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

const scenarioGroups = [
  {
    href: "/scenarios#debt",
    category: "債務與財務壓力",
    title: "帳單快繳不出來，卡費只能繳最低",
    description: "卡債、貸款、房車貸、強制執行或入不敷出。",
    nextStep: "先排急迫程度",
    icon: WalletCards,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    href: "/scenarios#fraud",
    category: "詐騙與金融風險",
    title: "收到投資、代操或 LINE 群訊息",
    description: "投資、網購、交友、求職、人頭帳戶或個資外洩。",
    nextStep: "先看風險紅旗",
    icon: ShieldQuestion,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/scenarios#care",
    category: "生病與照顧",
    title: "家人生病，照顧費和醫療費變多",
    description: "重大傷病、長照、照顧離職或醫療支出增加。",
    nextStep: "先盤點資源",
    icon: HeartPulse,
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/scenarios#income",
    category: "工作與收入問題",
    title: "收入不穩、剛失業，接下來怎麼撐過去",
    description: "剛工作、轉職、失業、斜槓或退休準備。",
    nextStep: "先看現金流",
    icon: BriefcaseBusiness,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/scenarios#family",
    category: "家庭與生活變故",
    title: "家庭變故後，錢和生活都要重排",
    description: "結婚、生育、單親、離婚、搬家或親人過世。",
    nextStep: "先整理決定",
    icon: HomeIcon,
    color: "bg-accent/10 text-accent",
  },
]

const startingPoints = [
  {
    href: "/ask-ai",
    label: "不確定，先問問看",
    helper: "不用完整說明，先把混亂的狀況整理成下一步。",
    icon: Bot,
  },
  {
    href: "/assessment",
    label: "3 分鐘看看目前壓力",
    helper: "不是信用評分，只是幫你看現在比較需要注意什麼。",
    icon: ClipboardCheck,
  },
  {
    href: externalLinks.onlineConsultation,
    label: "找人一起整理",
    helper: "如果你願意，可以把整理好的狀況帶去和真人討論。",
    icon: HandCoins,
  },
]

const platformModules = [
  {
    href: "/assessment",
    title: "開始檢測",
    description: "先看目前狀況，不必一開始就完整交代所有細節。",
    items: ["財務韌性", "財務焦慮", "詐騙防禦"],
    icon: ClipboardCheck,
  },
  {
    href: externalLinks.onlineConsultation,
    title: "免費諮詢",
    description: "一般民眾可以申請，社工也能協助個案轉介。",
    items: ["個人申請", "社工轉介"],
    icon: HandCoins,
  },
  {
    href: "/toolbox",
    title: "財務工具",
    description: "把生活記帳、規劃、試算和債務盤點放在一起。",
    items: ["記帳助理", "財務規劃", "財務試算", "債務盤點"],
    icon: Wrench,
  },
  {
    href: "/content",
    title: "知識與內容",
    description: "讓使用者先讀、先聽、先理解，再決定下一步。",
    items: ["文章", "Podcast", "多多益善專欄", "投稿分享"],
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
              好理家在先陪你整理財務壓力、風險與可用資源。選一個像的狀況就好，選錯也可以再換。
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/scenarios"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                先選最像的情境 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ask-ai"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
              >
                不確定，先問問看
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["不用先填真名", "不做信用評分", "不推銷貸款", "AI 不替你做重大決定"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/80 bg-card/75 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            <Link
              href="/social-worker"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
            >
              社工／助人工作者請進社工專區 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">常見情境入口</p>
                <h2 className="text-xl font-semibold text-foreground">先找像你現在遇到的狀況</h2>
              </div>
              <div className="sm:max-w-md">
                <p className="text-sm text-muted-foreground">
                  先選最像你現在的情況；不需要先輸入金額或個資，選到不精準也可以再換。
                </p>
                <Link
                  href="/scenarios"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  查看完整情境專區 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
              {scenarioGroups.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.category}
                    href={item.href}
                    className="group rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm transition-all hover:border-primary/35 hover:bg-card"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-primary">{item.category}</span>
                        <h3 className="mt-1 font-semibold leading-snug text-foreground">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    <p className="mt-2 text-sm font-medium text-primary">{item.nextStep}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3">
              <p className="text-sm font-medium text-primary">很多人從這裡開始</p>
              <h2 className="text-xl font-semibold text-foreground">先做一個不會太重的下一步</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {startingPoints.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm transition-all hover:border-primary/35 hover:bg-card"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.helper}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">想直接找服務</p>
                <h2 className="text-xl font-semibold text-foreground">情境之外，也可以直接從服務開始</h2>
              </div>
              <p className="text-sm text-muted-foreground sm:max-w-md">
                這裡保留一般民眾會自己使用的入口；社工請從專區進入工作台。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platformModules.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm transition-all hover:border-primary/35 hover:bg-card"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold leading-snug text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.items.map((subItem) => (
                        <span
                          key={subItem}
                          className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {subItem}
                        </span>
                      ))}
                    </div>
                  </Link>
                )
              })}
            </div>
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
              已經有超過 100,000 人開始整理自己的財務
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              目前已有 100,497 位不重複訪客造訪好理家在，透過檢測、工具與內容開始整理自己的財務狀態。
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
