import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, ClipboardCheck, HandCoins, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"
import { findScenarioSituation, scenarioCategories } from "@/lib/scenarios-data"

type ScenarioDetailPageProps = {
  params: Promise<{
    category: string
    situation: string
  }>
}

export function generateStaticParams() {
  return scenarioCategories.flatMap((category) =>
    category.situations.map((situation) => ({
      category: category.slug,
      situation: situation.slug,
    })),
  )
}

export async function generateMetadata({ params }: ScenarioDetailPageProps): Promise<Metadata> {
  const { category, situation } = await params
  const data = findScenarioSituation(category, situation)

  if (!data) {
    return {
      title: "情境頁 - 好理家在",
    }
  }

  return {
    title: `${data.situation.title} - 情境專區 - 好理家在`,
    description: `好理家在「${data.category.title}」底下的「${data.situation.title}」情境頁，目前先使用測試文字建立頁面骨架。`,
  }
}

export default async function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { category, situation } = await params
  const data = findScenarioSituation(category, situation)

  if (!data) notFound()

  const { category: categoryData, situation: situationData } = data
  const siblingSituations = categoryData.situations.filter((item) => item.slug !== situationData.slug)

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/15 p-6 sm:p-8">
          <p className="mb-2 text-sm font-semibold text-primary">情境導言</p>
          <p className="mb-3 text-sm font-medium text-muted-foreground">{categoryData.title}</p>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">{situationData.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            這是「{situationData.title}」情境頁的測試導言。後續可依夥伴提供的正式文案，替換成更貼近使用者的說明、提醒、資源與下一步。
          </p>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <main className="space-y-5">
            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">很多人是從這裡開始的</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  測試文字：使用者可能還不確定自己是不是屬於這個狀況，只是覺得生活裡有一個財務壓力點。這一段可以放常見開場、生活描述或使用者心聲。
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">這些情況最容易忽略的是</h2>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>測試提醒：先避免要求使用者一次提供完整金額、帳號或個資。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>測試提醒：如果牽涉急迫風險、詐騙、催收或安全問題，應優先引導到真人或官方資源。</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">這個情況的人通常會先做</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {["先整理目前狀況", "先看一個小工具", "需要時找人一起看"].map((item, index) => (
                    <div key={item} className="rounded-2xl border border-border/70 bg-background/75 p-4">
                      <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <p className="font-medium text-foreground">{item}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">測試文字，後續替換為正式下一步。</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">想多了解可以看看</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href="/content/articles"
                    className="rounded-2xl border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                  >
                    <BookOpen className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">相關文章</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">測試文字：之後可放與此情境相關的內容入口。</p>
                  </Link>
                  <Link
                    href="/content/podcast"
                    className="rounded-2xl border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                  >
                    <BookOpen className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">Podcast</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">測試文字：之後可接音頻、案例或專欄。</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">你可能用得到的資源</h2>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/assessment"
                    className="flex items-start gap-3 rounded-2xl bg-card/90 p-3 transition-colors hover:bg-card"
                  >
                    <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-foreground">開始檢測</span>
                      <span className="text-sm text-muted-foreground">先看目前狀況與壓力位置。</span>
                    </span>
                  </Link>
                  <Link
                    href="/toolbox"
                    className="flex items-start gap-3 rounded-2xl bg-card/90 p-3 transition-colors hover:bg-card"
                  >
                    <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-foreground">財務工具</span>
                      <span className="text-sm text-muted-foreground">用記帳、試算或盤點整理下一步。</span>
                    </span>
                  </Link>
                  <Link
                    href={externalLinks.onlineConsultation}
                    className="flex items-start gap-3 rounded-2xl bg-card/90 p-3 transition-colors hover:bg-card"
                  >
                    <HandCoins className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-foreground">免費諮詢</span>
                      <span className="text-sm text-muted-foreground">需要有人一起整理時再申請。</span>
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">同一類的其他情境</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {siblingSituations.slice(0, 5).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/scenarios/${categoryData.slug}/${item.slug}`}
                      className="inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {item.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
