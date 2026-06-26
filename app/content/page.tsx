import Link from "next/link"
import { BookOpen, Headphones, Star, ArrowRight, PenLine } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

const contentTypes = [
  {
    href: "/content/articles",
    title: "看看文章",
    description: "了解財務知識，找到解決方案",
    cta: "閱讀文章",
    icon: BookOpen,
    color: "bg-[#fff0d6] text-[#d96b27]",
  },
  {
    href: externalLinks.callForArticles,
    title: "投稿分享",
    description: "分享你的經驗與觀點，讓更多家庭找到前進方向",
    cta: "前往投稿",
    icon: PenLine,
    color: "bg-[#ffe4ef] text-[#c81f72]",
  },
  {
    href: "/content/podcast",
    title: "聽聽 Podcast",
    description: "用聽的方式學習財務觀念",
    cta: "開始收聽",
    icon: Headphones,
    color: "bg-[#f0e7ff] text-[#7b4bd8]",
  },
  {
    href: "/content/column",
    title: "專欄（多多益善）",
    description: "真實故事，深度分享",
    cta: "看看專欄",
    icon: Star,
    color: "bg-[#e7f7ef] text-[#237a56]",
  },
]

export default function ContentPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-foreground mb-3">知識與內容</h1>
          <p className="text-muted-foreground text-lg">
            如果你還不確定自己的狀況，可以先從這裡了解
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contentTypes.map((content) => {
            const Icon = content.icon
            return (
              <Link key={content.href} href={content.href} className="group">
                <Card className="h-full border-border/70 bg-card/90 shadow-[0_18px_45px_oklch(0.78_0.08_42_/_0.12)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_22px_55px_oklch(0.74_0.12_34_/_0.2)] group-hover:-translate-y-1">
                  <CardContent className="p-5">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${content.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">{content.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{content.description}</p>
                    <span className="flex items-center gap-1 text-sm font-medium text-accent transition-all group-hover:gap-2">
                      {content.cta} <ArrowRight className="h-4 w-4" />
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
