import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ClipboardCheck, HandCoins, Landmark, Network, Wrench } from "lucide-react"
import { AudienceMiniScene } from "@/components/context-illustration"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"
import { findLifeStage, lifeStages, serviceAudiences } from "@/lib/life-stages-data"

type LifeStageDetailPageProps = {
  params: Promise<{
    stage: string
  }>
}

export function generateStaticParams() {
  return lifeStages.map((stage) => ({
    stage: stage.slug,
  }))
}

export async function generateMetadata({ params }: LifeStageDetailPageProps): Promise<Metadata> {
  const { stage } = await params
  const data = findLifeStage(stage)

  if (!data) {
    return {
      title: "服務對象 - 好理家在",
    }
  }

  return {
    title: `${data.audience} - 服務對象 - 好理家在`,
    description: `為${data.audience}整理常見生活與財務課題、平台支持、合作資源與下一步。`,
  }
}

export default async function LifeStageDetailPage({ params }: LifeStageDetailPageProps) {
  const { stage } = await params
  const data = findLifeStage(stage)

  if (!data) notFound()

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 grid gap-6 border-b border-border/80 pb-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">服務對象</p>
            <p className="mb-3 text-sm font-medium text-muted-foreground">{data.title}</p>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              <span aria-hidden="true">{data.emoji}</span> {data.audience}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{data.summary}</p>
          </div>
          <AudienceMiniScene slug={data.slug} emoji={data.emoji} className="h-36 sm:h-44" />
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <main className="space-y-5">
            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">對象導言</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  這個頁面先從「{data.audience}」的生活處境出發，把常見財務壓力、可用工具與合作資源放在同一個入口，方便後續補正式文案與服務流程。
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">這個族群常見的生活與財務課題</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.commonTopics.map((topic) => (
                    <Link
                      key={topic.href}
                      href={topic.href}
                      className="group rounded-lg border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                    >
                      <p className="font-medium text-foreground">{topic.title}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        連到生活課題 <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">好理家在提供</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.offerings.map((offering, index) => {
                    const Icon = index % 2 === 0 ? ClipboardCheck : Wrench

                    return (
                      <div key={offering} className="rounded-lg border border-border/70 bg-background/75 p-4">
                        <Icon className="mb-3 h-5 w-5 text-primary" />
                        <p className="font-medium text-foreground">{offering}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">合作資源與夥伴</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.partners.map((partner) => (
                    <div key={partner} className="rounded-lg border border-border/70 bg-background/75 p-4">
                      <Landmark className="mb-3 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">{partner}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">我們可以一起做什麼？</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.actions.map((action) => (
                    <div key={action} className="rounded-lg border border-border/70 bg-background/75 p-4">
                      <Network className="mb-3 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">{action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">可先連到</h2>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/assessment"
                    className="flex items-start gap-3 rounded-lg bg-card/90 p-3 transition-colors hover:bg-card"
                  >
                    <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-foreground">財務健康檢測</span>
                      <span className="text-sm text-muted-foreground">先看目前狀態與風險輪廓</span>
                    </span>
                  </Link>
                  <Link
                    href="/toolbox"
                    className="flex items-start gap-3 rounded-lg bg-card/90 p-3 transition-colors hover:bg-card"
                  >
                    <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-foreground">財務工具</span>
                      <span className="text-sm text-muted-foreground">整理收支、債務與規劃</span>
                    </span>
                  </Link>
                  <Link
                    href={externalLinks.onlineConsultation}
                    className="flex items-start gap-3 rounded-lg bg-card/90 p-3 transition-colors hover:bg-card"
                  >
                    <HandCoins className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-medium text-foreground">免費諮詢</span>
                      <span className="text-sm text-muted-foreground">需要陪伴整理時可申請</span>
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">其他服務對象</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {serviceAudiences
                    .filter((item) => item.slug !== data.slug)
                    .slice(0, 5)
                    .map((item) => (
                      <Link
                        key={item.slug}
                        href={`/life-stages/${item.slug}`}
                        className="inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <span>{item.emoji} {item.audience}</span>
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
