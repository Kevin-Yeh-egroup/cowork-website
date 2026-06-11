import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  HandCoins,
  HeartPulse,
  Home,
  ShieldQuestion,
  WalletCards,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"
import { scenarioCategories } from "@/lib/scenarios-data"

export const metadata: Metadata = {
  title: "情境專區 - 好理家在",
  description: "從工作收入、債務壓力、詐騙風險、生病照顧、家庭變故等生活情境，找到適合的檢測、工具、內容或諮詢入口。",
}

const iconMap: Record<string, LucideIcon> = {
  "work-income": BriefcaseBusiness,
  "debt-pressure": WalletCards,
  "fraud-risk": ShieldQuestion,
  "health-care": HeartPulse,
  "family-change": Home,
}

const helperCards = [
  {
    title: "先選狀況，不用先懂工具",
    description: "情境專區先讓一般民眾找到「我比較像哪一種狀況」，再進到該情境下的說明頁。",
  },
  {
    title: "子情境頁先放測試文案",
    description: "目前先把每個子情境都生出頁面，正式導言、提醒與資源文案可以等夥伴確認後逐步替換。",
  },
]

export default function ScenariosPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-primary">情境專區</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl text-balance">
                先找到接近的生活狀況，再進入情境頁
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                依照平台架構，這裡先列出一般民眾會遇到的五大類情境。每個子情境都會進入自己的情境頁，目前先用測試文字建立頁面骨架。
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm">
              <p className="font-medium text-foreground">不知道選哪一個也可以</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                如果情況同時牽涉收入、債務、照顧或家庭變故，可以先選最有壓力的那一項，或先用問問 AI 整理。
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/ask-ai"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  問問 AI <Bot className="h-4 w-4" />
                </Link>
                <Link
                  href={externalLinks.onlineConsultation}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  免費諮詢 <HandCoins className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {helperCards.map((card) => (
            <Card key={card.title} className="border-border/80 bg-card/85">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="space-y-5">
          {scenarioCategories.map((category) => {
            const Icon = iconMap[category.slug] ?? WalletCards

            return (
              <section
                key={category.slug}
                id={category.anchor}
                className="scroll-mt-24 rounded-3xl border border-border/80 bg-card/75 p-5 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">{category.title}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {category.summary}
                      </p>
                    </div>
                  </div>
                  <p className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                    {category.situations.length} 個子情境
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {category.situations.map((situation) => (
                    <Link
                      key={situation.slug}
                      href={`/scenarios/${category.slug}/${situation.slug}`}
                      className="group rounded-2xl border border-border/70 bg-background/75 p-4 transition-all hover:border-primary/35 hover:bg-background"
                    >
                      <p className="font-semibold text-foreground">{situation.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        進入「{situation.title}」情境頁，先查看測試導言、容易忽略的事與可用資源。
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        查看情境頁 <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
