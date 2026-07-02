import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CalendarDays, ClipboardCheck, HandCoins, Landmark, Network, Wrench, type LucideIcon } from "lucide-react"
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

type OfferingLink = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const audienceIntros: Record<string, string> = {
  "working-life":
    "勞工在生活裡面對的財務壓力，常常不是單一事件，而是工作收入、排班工時、轉職風險、家庭責任與未來退休一起交錯。有人是收入不穩，有人是加班、失業、斜槓或債務壓力正在累積，也有人只是想把辛苦賺來的錢安排得更安心。這一頁先把常見課題、可用工具、諮詢與合作資源放在一起，讓勞工或陪伴勞工的工作者，都能更快找到下一步。",
  "health-challenge":
    "身障者與家庭面對的財務壓力，往往和醫療、復健、交通、輔具、照顧安排與收入變化交在一起。有些支出是長期累積，有些壓力則來自生活突然需要重新調整。這一頁先把常見課題、可用工具、諮詢與合作資源放在一起，協助家庭把眼前需要與長期安排分段整理。",
  "independent-life":
    "自立少年開始獨立生活時，常常需要同時學著面對工作、租屋、生活費、人際支持與未來規劃。很多事情不是不努力，而是第一次自己承擔時，缺少可以一起整理的人。這一頁先把常見課題、可用工具、諮詢與合作資源放在一起，陪你把生活慢慢排出可以前進的順序。",
  "family-caregiver":
    "照顧者的壓力常常藏在日常裡，從陪診、照顧時間、醫療費、交通到是否需要調整工作，都會影響家庭財務與生活節奏。照顧不是一個人撐得越久越好，而是要找到可以分擔、可以喘息的安排。這一頁先把常見課題、可用工具、諮詢與合作資源放在一起，讓照顧路上多一點支撐。",
  "single-parent-family":
    "單親家庭常常需要一個人同時處理收入、照顧、家務、孩子教育與生活突發狀況。壓力不一定來自單一費用，而是每件事情都要自己先想辦法。這一頁先把常見課題、可用工具、諮詢與合作資源放在一起，協助把每月必要支出、照顧安排與可用支持慢慢整理清楚。",
  "retirement-aging":
    "中高齡面對的財務安排，不只是退休金或存款數字，也包含工作是否繼續、健康照顧、住房、詐騙風險與家人支持。每個人的老後想像都不同，適合的安排也不會只有一種。這一頁先把常見課題、可用工具、諮詢與合作資源放在一起，協助你從生活期待開始整理。",
}

const topicIntros: Record<string, string> = {
  "/life-topics/work-income/first-job":
    "剛開始工作時，收入變得比較穩定，生活開銷也會開始變多，需要學著分配薪水。",
  "/life-topics/work-income/unstable-income":
    "收入不穩時，最累的常常不是單月少賺，而是不知道下個月能不能安心安排生活。",
  "/life-topics/work-income/career-transition":
    "轉職時，收入、時間與未來方向都可能一起變動，需要先看清楚可支撐多久。",
  "/life-topics/work-income/recently-unemployed":
    "最近失業時，生活常常會突然失去原本節奏，需要先穩住短期生活與可申請權益。",
  "/life-topics/work-income/side-income":
    "第二收入或斜槓會讓收入來源變多，也可能讓時間、稅務、成本與主業界線變複雜。",
  "/life-topics/work-income/retirement-prep":
    "退休準備不只是存到一筆錢，也包含未來生活、醫療、住房與工作退場安排。",
  "/life-topics/debt-pressure/financial-anxiety":
    "財務焦慮與入不敷出不只是帳戶餘額，也會影響睡眠、關係與日常判斷。",
  "/life-topics/debt-pressure/late-payment":
    "無法準時繳款時，需要先看清楚期限、金額與後果，再決定哪些要優先處理。",
  "/life-topics/debt-pressure/mortgage-car-loan":
    "房貸與車貸金額大、時間長，收入或照顧責任變動時，月付壓力也會跟著改變。",
  "/life-topics/fraud-risk/personal-data-safety":
    "個資外洩與帳號安全會影響金錢安全，也可能牽動冒名申辦、盜刷與帳戶異常。",
  "/life-topics/family-change/moving-renting":
    "搬家與租屋會牽動押金、租金、交通與合約條件，需要先看見完整成本。",
  "/life-topics/family-change/childcare":
    "生育與育兒會讓家庭支出和時間安排明顯改變，需要先估算照顧與工作安排。",
  "/life-topics/family-change/single-parent":
    "單親家庭常常要同時扛起照顧、收入與孩子安排，需要把支出與支持排出順序。",
  "/life-topics/family-change/bereavement-change":
    "親人過世或重大變故發生時，費用、文件與家庭分工常常會同時壓到眼前。",
  "/life-topics/health-care/self-illness":
    "自己生病時，身體、工作收入與醫療支出可能一起受影響，需要先整理可用保障。",
  "/life-topics/health-care/family-illness":
    "家人生病時，陪診、照顧、交通與醫療費會一起出現，需要先整理家庭分工。",
  "/life-topics/health-care/major-illness":
    "重大傷病通常不是短期事件，治療、休養、看護與收入中斷都可能一起出現。",
  "/life-topics/health-care/long-term-care":
    "長期照顧會影響被照顧者與照顧者，也會牽動工作、收入、休息與家庭關係。",
  "/life-topics/health-care/caregiving-leave":
    "照顧離職不是單純工作選擇，而是家庭責任、照顧資源與財務壓力一起推到眼前。",
  "/life-topics/health-care/medical-expense":
    "醫療支出增加時，反覆回診、藥物、交通與照顧成本會逐漸累積成壓力。",
}

const offeringDetails: Record<string, Omit<OfferingLink, "title">> = {
  財務健康檢測: {
    description: "先看目前狀態與風險輪廓",
    href: "/assessment",
    icon: ClipboardCheck,
  },
  財務生活記帳助理: {
    description: "整理日常收支與生活費節奏",
    href: "/toolbox",
    icon: Wrench,
  },
  財務工具: {
    description: "整理收支、債務與規劃",
    href: "/toolbox",
    icon: Wrench,
  },
  債務盤點: {
    description: "先看清楚債務金額與還款順序",
    href: "/toolbox",
    icon: Wrench,
  },
  財務規劃: {
    description: "整理目標、支出與未來安排",
    href: "/toolbox",
    icon: Wrench,
  },
  免費諮詢: {
    description: "需要陪伴整理時可申請",
    href: externalLinks.onlineConsultation,
    icon: HandCoins,
  },
  家庭財務風險整理: {
    description: "整理家庭收支、風險與下一步",
    href: "/social-worker-tools#risk",
    icon: ClipboardCheck,
  },
  社工合作服務: {
    description: "給助人工作者的合作入口",
    href: "/social-worker-tools",
    icon: Network,
  },
  詐騙防禦檢測: {
    description: "檢查金融詐騙與個資風險",
    href: "/assessment",
    icon: ClipboardCheck,
  },
}

const collaborationModes = ["個案轉介", "社工培力", "專案合作", "資源串聯"]
const activitiesLink: OfferingLink = {
  title: "活動與課程",
  description: "講座、課程與培力活動",
  href: "/events",
  icon: CalendarDays,
}

function getOfferingLinks(offerings: string[]) {
  const links = offerings.map((offering) => {
    const detail =
      offeringDetails[offering] ??
      ({
        description: "陪你整理生活與財務壓力",
        href: "/online-consultation",
        icon: ClipboardCheck,
      } satisfies Omit<OfferingLink, "title">)

    return { title: offering, ...detail }
  })

  return links.some((link) => link.title === activitiesLink.title) ? links : [...links, activitiesLink]
}

const partnerDescriptions: Record<string, string> = {
  法律諮詢服務: "可串接合作單位的法律諮詢頁面，協助處理薪資、契約、資遣或勞資爭議。",
  勞動權益諮詢: "可放入勞動權益相關服務，讓使用者知道可以先問誰、準備哪些資料。",
  就業與職涯支持: "可連到就業媒合、職涯諮詢、職訓課程或轉職支持服務。",
  財務與債務協談: "可連到合作單位或好理家在的財務整理、債務盤點與諮詢服務。",
}

export default async function LifeStageDetailPage({ params }: LifeStageDetailPageProps) {
  const { stage } = await params
  const data = findLifeStage(stage)

  if (!data) notFound()

  const audienceIntro = audienceIntros[data.slug] ?? data.summary
  const offeringLinks = getOfferingLinks(data.offerings)

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
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{audienceIntro}</p>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">常見課題</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.commonTopics.map((topic) => {
                    const topicIntro =
                      topicIntros[topic.href] ?? "先了解這個情境常見的財務壓力，再找到可以開始整理的下一步。"

                    return (
                      <Link
                        key={topic.href}
                        href={topic.href}
                        className="group flex h-full flex-col rounded-lg border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                      >
                        <p className="font-medium text-foreground">{topic.title}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{topicIntro}</p>
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary transition-all group-hover:gap-2">
                          看更多 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">更多資源</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.partners.map((partner) => (
                    <div key={partner} className="rounded-lg border border-border/70 bg-background/75 p-4">
                      <Landmark className="mb-3 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">{partner}</p>
                      {partnerDescriptions[partner] ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{partnerDescriptions[partner]}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {data.slug !== "working-life" ? (
              <Card className="border-border/80 bg-card/90">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold text-foreground">合作模式</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {collaborationModes.map((action) => (
                      <div key={action} className="rounded-lg border border-border/70 bg-background/75 p-4">
                        <Network className="mb-3 h-5 w-5 text-primary" />
                        <p className="font-medium text-foreground">{action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">我們提供</h2>
                <div className="mt-4 space-y-3">
                  {offeringLinks.map((item) => {
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-start gap-3 rounded-lg bg-card/90 p-3 transition-colors hover:bg-card"
                      >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>
                          <span className="block font-medium text-foreground">{item.title}</span>
                          <span className="text-sm text-muted-foreground">{item.description}</span>
                        </span>
                      </Link>
                    )
                  })}
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
