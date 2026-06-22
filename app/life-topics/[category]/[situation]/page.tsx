import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, ClipboardCheck, HandCoins, LifeBuoy, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"
import { findScenarioSituation, scenarioCategories } from "@/lib/scenarios-data"

type LifeTopicDetailPageProps = {
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

export async function generateMetadata({ params }: LifeTopicDetailPageProps): Promise<Metadata> {
  const { category, situation } = await params
  const data = findScenarioSituation(category, situation)

  if (!data) {
    return {
      title: "生活課題 - 好理家在",
    }
  }

  return {
    title: `${data.situation.title} - 生活課題 - 好理家在`,
    description: `整理${data.category.title}中「${data.situation.title}」的常見困擾、提醒與可開始的行動。`,
  }
}

function getCommonConcerns(title: string) {
  return [
    `覺得「${title}」好像不是單一問題，而是收入、支出、家庭或工作安排一起卡住。`,
    "知道需要整理，但不確定第一步要先看數字、先找資源，還是先和家人討論。",
    "擔心狀況越拖越難處理，所以需要一個比較不慌張的整理順序。",
  ]
}

function getBlindSpots(title: string) {
  return [
    `只看「${title}」當下的壓力，可能會忽略它背後長期累積的生活安排。`,
    "容易先責怪自己不會理財，卻還沒有把必要支出、風險與可用支持分開看。",
    "有些資源不是等問題很嚴重才能使用，早一點整理反而比較有選擇。",
  ]
}

export default async function LifeTopicDetailPage({ params }: LifeTopicDetailPageProps) {
  const { category, situation } = await params
  const data = findScenarioSituation(category, situation)

  if (!data) notFound()

  const { category: categoryData, situation: situationData } = data
  const siblingSituations = categoryData.situations.filter((item) => item.slug !== situationData.slug)

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 border-b border-border/80 pb-6">
          <p className="mb-2 text-sm font-semibold text-primary">生活課題</p>
          <p className="mb-3 text-sm font-medium text-muted-foreground">{categoryData.title}</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {situationData.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            這裡先用「{situationData.title}」做小情境頁預覽，協助使用者從常見困擾開始，接著看容易忽略的提醒，最後選一個可執行的下一步。
          </p>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <main className="space-y-5">
            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">情境導言</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  當生活出現「{situationData.title}」時，真正需要處理的通常不只是單一金額，而是生活節奏、可用資源、風險與下一步選擇。
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">很多人是從這裡開始的</h2>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {getCommonConcerns(situationData.title).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">這些情況最容易忽略的是</h2>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {getBlindSpots(situationData.title).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">建議先從這裡開始</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { title: "檢測", description: "先用簡單檢測看壓力與風險輪廓。", href: "/assessment", icon: ClipboardCheck },
                    { title: "工具", description: "用工具整理收入、支出或債務。", href: "/toolbox", icon: Wrench },
                    { title: "免費諮詢", description: "需要有人一起看時，可以申請諮詢。", href: externalLinks.onlineConsultation, icon: HandCoins },
                  ].map((item) => {
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="rounded-lg border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                      >
                        <Icon className="mb-3 h-5 w-5 text-primary" />
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">想多了解可以看看</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { title: "文章", href: "/content/articles" },
                    { title: "Podcast", href: "/content/podcast" },
                    { title: "專欄", href: "/content/column" },
                  ].map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="rounded-lg border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                    >
                      <BookOpen className="mb-3 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">後續可放與這個情境相關的內容入口。</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">你可能用得到的資源</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 bg-background/75 p-4">
                    <LifeBuoy className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">問題相關資源</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">可先保留位置，後續放官方資訊、補助、工具或合作服務。</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/75 p-4">
                    <LifeBuoy className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">外部單位</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">可依情境補上政府、社福、法律、金融或醫療相關單位。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">同一類的其他情境</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {siblingSituations.slice(0, 5).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/life-topics/${categoryData.slug}/${item.slug}`}
                      className="inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    >
                      {item.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">回到生活課題</h2>
                <Link
                  href="/life-topics"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2"
                >
                  看所有課題 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
