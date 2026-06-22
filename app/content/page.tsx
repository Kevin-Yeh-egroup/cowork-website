import Link from "next/link"
import { BookOpen, Headphones, Star, ArrowRight, PenLine } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

const contentTypes = [
  {
    href: "/content/articles",
    title: "看看文章",
    description: "了解財務知識，找到解決方案",
    icon: BookOpen,
    color: "bg-primary/10 text-primary",
  },
  {
    href: externalLinks.callForArticles,
    title: "投稿分享",
    description: "分享你的經驗與觀點，讓更多家庭找到前進方向",
    icon: PenLine,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/content/podcast",
    title: "聽聽 Podcast",
    description: "用聽的方式學習財務觀念",
    icon: Headphones,
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    href: "/content/column",
    title: "專欄（多多益善）",
    description: "真實故事，深度分享",
    icon: Star,
    color: "bg-secondary text-secondary-foreground",
  },
]

export default function ContentPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-foreground mb-3">知識與內容</h1>
          <p className="text-muted-foreground text-lg">
            如果你還不確定自己的狀況，可以先從這裡了解
          </p>
        </div>

        <div className="space-y-4">
          {contentTypes.map((content) => {
            const Icon = content.icon
            return (
              <Link key={content.href} href={content.href} className="block group">
                <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${content.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1">{content.title}</h3>
                      <p className="text-muted-foreground">{content.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
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
