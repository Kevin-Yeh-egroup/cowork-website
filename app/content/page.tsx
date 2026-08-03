import Link from "next/link"
import { ArrowRight, BookOpen, Headphones, Mail, PenLine, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { categoryTone } from "@/lib/design-system"
import { externalLinks } from "@/lib/external-links"

const contentTypes = [
  {
    href: "/content/articles",
    title: "看看文章",
    description: "依生活情境找文章，先找到和自己現在最接近的內容。",
    cta: "閱讀文章",
    icon: BookOpen,
    color: categoryTone.warm,
  },
  {
    href: "/content/newsletters",
    title: "電子報",
    description: "瀏覽好理生活週報與過往期數，從每週整理裡慢慢接住生活。",
    cta: "查看期數",
    icon: Mail,
    color: categoryTone.sky,
  },
  {
    href: "/content/podcast",
    title: "Podcast",
    description: "用聽的陪你整理財務、家庭與生活壓力。",
    cta: "開始收聽",
    icon: Headphones,
    color: categoryTone.violet,
  },
  {
    href: "/content/column",
    title: "專欄",
    description: "從案例與專題觀點，看見更多可以前進的方法。",
    cta: "查看專欄",
    icon: Star,
    color: categoryTone.mint,
  },
  {
    href: externalLinks.callForArticles,
    title: "投稿分享",
    description: "分享你的經驗與觀點，讓更多家庭找到前進方向。",
    cta: "前往投稿",
    icon: PenLine,
    color: categoryTone.rose,
  },
]

export default function ContentPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 text-center">
          <h1 className="mb-3 text-3xl font-bold text-foreground">知識與內容</h1>
          <p className="text-lg text-muted-foreground">
            用文章、電子報、聲音與專欄，陪你從生活裡遇到的問題開始整理。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
