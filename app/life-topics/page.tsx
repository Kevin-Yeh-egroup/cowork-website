import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BriefcaseBusiness,
  HeartPulse,
  Home,
  ShieldQuestion,
  WalletCards,
} from "lucide-react"
import { scenarioCategories } from "@/lib/scenarios-data"

export const metadata: Metadata = {
  title: "生活課題 - 好理家在",
  description: "依照生活中遇到的工作收入、債務壓力、詐騙風險、照顧與家庭變故，找到可開始整理的方向。",
}

const iconMap: Record<string, LucideIcon> = {
  "work-income": BriefcaseBusiness,
  "debt-pressure": WalletCards,
  "fraud-risk": ShieldQuestion,
  "health-care": HeartPulse,
  "family-change": Home,
}

export default function LifeTopicsPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-primary">生活課題</p>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl text-balance">
            從正在發生的生活問題開始整理
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            先選一個最接近的生活課題，再進到小情境看常見困擾、提醒與可以開始的下一步。
          </p>
        </section>

        <nav aria-label="生活課題分類" className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {scenarioCategories.map((category) => {
            const Icon = iconMap[category.slug] ?? WalletCards

            return (
              <Link
                key={category.slug}
                href={`/life-topics#${category.anchor}`}
                className="group flex min-h-44 flex-col justify-between rounded-lg border border-border/80 bg-card/85 p-4 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-lg font-semibold leading-snug text-foreground">{category.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{category.summary}</span>
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                  {category.situations.length} 個小情境 <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-8">
          {scenarioCategories.map((category) => {
            const Icon = iconMap[category.slug] ?? WalletCards

            return (
              <section
                key={category.slug}
                id={category.anchor}
                className="scroll-mt-24 border-t border-border/80 pt-6"
              >
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">{category.title}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {category.summary}
                      </p>
                    </div>
                  </div>
                  <p className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                    {category.situations.length} 個小情境
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {category.situations.map((situation) => (
                    <Link
                      key={situation.slug}
                      href={`/life-topics/${category.slug}/${situation.slug}`}
                      className="group rounded-lg border border-border/70 bg-card/75 p-4 transition-colors hover:border-primary/35 hover:bg-card"
                    >
                      <p className="font-semibold text-foreground">{situation.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        進入「{situation.title}」的小情境頁，先看常見困擾、提醒與可以開始的步驟。
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        看小情境 <ArrowRight className="h-4 w-4" />
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
