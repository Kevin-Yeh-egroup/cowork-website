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
    "勞工在生活裡面對的財務壓力，常常不是單一事件，而是工作收入、排班工時、轉職風險、家庭責任與未來退休一起交錯。有人是收入不穩，有人是加班、失業、斜槓或債務壓力正在累積，也有人只是想把辛苦賺來的錢安排得更安心。先把眼前最卡住的地方拆小一點，會比較知道下一步該從哪裡開始。",
  "health-challenge":
    "身障者與家庭面對的財務壓力，往往和醫療、復健、交通、輔具、照顧安排與收入變化交在一起。有些支出是長期累積，有些壓力則來自生活突然需要重新調整。先分清楚哪些是現在就要處理的費用，哪些是可以慢慢規劃的長期安排，會比較不容易被所有事情一起壓住。",
  "independent-life":
    "自立青少年開始獨立生活時，常常需要同時學著面對工作、租屋、生活費、人際支持與未來規劃。很多事情不是不努力，而是第一次自己承擔時，缺少可以一起整理的人。先從住哪裡、錢怎麼用、遇到事情可以找誰開始，一步一步把生活排出比較安心的順序。",
  "family-caregiver":
    "照顧者的壓力常常藏在日常裡，從陪診、照顧時間、醫療費、交通到是否需要調整工作，都會影響家庭財務與生活節奏。照顧不是一個人撐得越久越好，而是要找到可以分擔、可以喘息的安排。先把費用、時間和可協助的人力攤開來看，照顧路上才比較有機會留下自己的空間。",
  "single-parent-family":
    "單親家庭常常需要一個人同時處理收入、照顧、家務、孩子教育與生活突發狀況。壓力不一定來自單一費用，而是每件事情都要自己先想辦法。先把每月一定要付的錢、孩子需要的安排和可以使用的支持列出來，會比較知道哪些事情不用全部自己扛。",
  "retirement-aging":
    "中高齡面對的財務安排，不只是退休金或存款數字，也包含工作是否繼續、健康照顧、住房、詐騙風險與家人支持。每個人的老後想像都不同，適合的安排也不會只有一種。先從自己想過什麼樣的生活開始，再回頭看收入、支出和照顧安排，規劃會比較貼近真正的需要。",
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

const workingLifeIntroItems = [
  "\u6536\u5165\u4e0d\u7a69\u3001\u6392\u73ed\u8b8a\u52d5\u6216\u52a0\u73ed\u8b8a\u591a",
  "\u6b63\u5728\u8f49\u8077\u3001\u5931\u696d\u6216\u64d4\u5fc3\u5de5\u4f5c\u4e2d\u65b7",
  "\u5bb6\u7528\u3001\u80b2\u5152\u3001\u7167\u9867\u6216\u50b5\u52d9\u58d3\u529b\u540c\u6642\u51fa\u73fe",
  "\u60f3\u628a\u8f9b\u82e6\u8cfa\u4f86\u7684\u9322\u5b89\u6392\u5f97\u66f4\u5b89\u5fc3",
]

const audienceIntroItems: Record<string, string[]> = {
  "working-life": workingLifeIntroItems,
  "independent-life": [
    "\u7b2c\u4e00\u6b21\u81ea\u5df1\u5b89\u6392\u6536\u5165\u3001\u4f4f\u8655\u8207\u751f\u6d3b\u8cbb",
    "\u540c\u6642\u9762\u5c0d\u5de5\u4f5c\u3001\u79df\u5c4b\u8207\u4eba\u969b\u652f\u6301",
    "\u60f3\u5efa\u7acb\u53ef\u4ee5\u6301\u7e8c\u8ffd\u8e64\u7684\u6536\u652f\u7fd2\u6163",
    "\u9700\u8981\u6709\u4eba\u4e00\u8d77\u628a\u751f\u6d3b\u6162\u6162\u6392\u51fa\u9806\u5e8f",
  ],
  "health-challenge": [
    "\u91ab\u7642\u3001\u5fa9\u5065\u3001\u4ea4\u901a\u6216\u8f14\u5177\u8cbb\u7528\u589e\u52a0",
    "\u6536\u5165\u6216\u5de5\u4f5c\u5b89\u6392\u53ef\u80fd\u9700\u8981\u8abf\u6574",
    "\u5bb6\u5ead\u7167\u9867\u8207\u9577\u671f\u652f\u51fa\u9700\u8981\u4e00\u8d77\u770b",
    "\u60f3\u628a\u773c\u524d\u9700\u8981\u548c\u9577\u671f\u5b89\u6392\u5206\u6bb5\u6574\u7406",
  ],
  "family-caregiver": [
    "\u966a\u8a3a\u3001\u7167\u9867\u6642\u9593\u8207\u4ea4\u901a\u652f\u51fa\u8b8a\u591a",
    "\u9700\u8981\u5728\u5de5\u4f5c\u548c\u7167\u9867\u4e4b\u9593\u91cd\u65b0\u5b89\u6392",
    "\u60f3\u77e5\u9053\u54ea\u4e9b\u8cc7\u6e90\u53ef\u4ee5\u5206\u64d4\u58d3\u529b",
    "\u9700\u8981\u628a\u5bb6\u5ead\u652f\u51fa\u548c\u7167\u9867\u8cac\u4efb\u4e00\u8d77\u770b",
  ],
  "single-parent-family": [
    "\u4e00\u500b\u4eba\u540c\u6642\u8655\u7406\u6536\u5165\u3001\u7167\u9867\u8207\u5bb6\u52d9",
    "\u5b69\u5b50\u6559\u80b2\u3001\u751f\u6d3b\u8cbb\u8207\u7a81\u767c\u652f\u51fa\u90fd\u8981\u5148\u60f3\u8fa6\u6cd5",
    "\u60f3\u6574\u7406\u6bcf\u6708\u5fc5\u8981\u652f\u51fa\u8207\u53ef\u7528\u652f\u6301",
    "\u9700\u8981\u4e00\u500b\u6bd4\u8f03\u4e0d\u5b64\u55ae\u7684\u6574\u7406\u9806\u5e8f",
  ],
  "retirement-aging": [
    "\u5de5\u4f5c\u662f\u5426\u7e7c\u7e8c\u3001\u6536\u5165\u8207\u9000\u4f11\u91d1\u9700\u8981\u4e00\u8d77\u770b",
    "\u5065\u5eb7\u7167\u9867\u3001\u4f4f\u623f\u548c\u8a50\u9a19\u98a8\u96aa\u90fd\u6703\u5f71\u97ff\u751f\u6d3b",
    "\u60f3\u6574\u7406\u81ea\u5df1\u671f\u5f85\u7684\u8001\u5f8c\u751f\u6d3b",
    "\u9700\u8981\u5f9e\u5b58\u6b3e\u3001\u652f\u51fa\u8207\u5bb6\u4eba\u652f\u6301\u6162\u6162\u76e4\u9ede",
  ],
}

const workingLifeTopicDescriptions: Record<string, string> = {
  "/life-topics/work-income/unstable-income": "\u6536\u5165\u4e0d\u7a69\u6642\uff0c\u5148\u770b\u6bcf\u6708\u5fc5\u8981\u652f\u51fa\u548c\u9810\u5099\u91d1\u80fd\u6490\u591a\u4e45\u3002",
  "/life-topics/work-income/career-transition": "\u8f49\u8077\u6642\uff0c\u6536\u5165\u3001\u6642\u9593\u8207\u672a\u4f86\u65b9\u5411\u90fd\u53ef\u80fd\u4e00\u8d77\u8b8a\u52d5\u3002",
  "/life-topics/work-income/recently-unemployed": "\u5de5\u4f5c\u4e2d\u65b7\u6642\uff0c\u5148\u6574\u7406\u751f\u6d3b\u8cbb\u3001\u6b20\u6b3e\u8207\u53ef\u7528\u7684\u652f\u6301\u3002",
  "/life-topics/work-income/side-income": "\u659c\u69d3\u6216\u517c\u5dee\u6536\u5165\u8981\u4e00\u8d77\u770b\u7a05\u52d9\u3001\u6642\u9593\u548c\u73fe\u91d1\u6d41\u3002",
  "/life-topics/debt-pressure/financial-anxiety": "\u7576\u9322\u7684\u58d3\u529b\u5f71\u97ff\u751f\u6d3b\u548c\u7761\u7720\uff0c\u53ef\u4ee5\u5148\u628a\u58d3\u529b\u4f86\u6e90\u62c6\u958b\u770b\u3002",
  "/life-topics/work-income/retirement-prep": "\u9000\u4f11\u6e96\u5099\u4e0d\u53ea\u662f\u5b58\u9322\uff0c\u4e5f\u548c\u5de5\u4f5c\u3001\u5065\u5eb7\u8207\u5bb6\u4eba\u652f\u6301\u6709\u95dc\u3002",
}

const sharedOfferingLinks: OfferingLink[] = [
  {
    title: "\u6aa2\u6e2c",
    description: "\u5148\u7528\u7c21\u55ae\u6aa2\u6e2c\u770b\u58d3\u529b\u8207\u98a8\u96aa\u8f2a\u5ed3\u3002",
    href: "/assessment",
    icon: ClipboardCheck,
  },
  {
    title: "\u5de5\u5177",
    description: "\u7528\u5de5\u5177\u6574\u7406\u6536\u5165\u3001\u652f\u51fa\u6216\u50b5\u52d9\u3002",
    href: "/toolbox",
    icon: Wrench,
  },
  {
    title: "\u514d\u8cbb\u8aee\u8a62",
    description: "\u9700\u8981\u6709\u4eba\u4e00\u8d77\u770b\u6642\uff0c\u53ef\u4ee5\u7533\u8acb\u8aee\u8a62\u3002",
    href: externalLinks.onlineConsultation,
    icon: HandCoins,
  },
  {
    title: "\u793e\u5de5\u5408\u4f5c\u670d\u52d9",
    description: "\u7d66\u52a9\u4eba\u5de5\u4f5c\u8005\u7684\u5408\u4f5c\u5165\u53e3\u3002",
    href: "/social-worker-tools",
    icon: Network,
  },
  {
    title: "\u6d3b\u52d5\u8207\u8ab2\u7a0b",
    description: "\u8b1b\u5ea7\u3001\u8ab2\u7a0b\u8207\u57f9\u529b\u6d3b\u52d5\u3002",
    href: "/events",
    icon: CalendarDays,
  },
]

export default async function LifeStageDetailPage({ params }: LifeStageDetailPageProps) {
  const { stage } = await params
  const data = findLifeStage(stage)

  if (!data) notFound()

  const audienceIntro = audienceIntros[data.slug] ?? data.summary
  const introItems = audienceIntroItems[data.slug] ?? [
    "\u5148\u770b\u6e05\u76ee\u524d\u6700\u6709\u58d3\u529b\u7684\u6536\u652f\u72c0\u6cc1",
    "\u6574\u7406\u9700\u8981\u5e6b\u5fd9\u6216\u53ef\u4ee5\u4f7f\u7528\u7684\u8cc7\u6e90",
    "\u78ba\u8a8d\u53ef\u4ee5\u5148\u505a\u7684\u4e00\u500b\u5c0f\u6b65\u9a5f",
    "\u9700\u8981\u6642\u627e\u8aee\u8a62\u6216\u5408\u4f5c\u55ae\u4f4d\u4e00\u8d77\u770b",
  ]
  const offeringLinks = sharedOfferingLinks

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
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {data.slug === "working-life" ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{"\u52de\u5de5\u5728\u751f\u6d3b\u88e1\u9762\u5c0d\u7684\u8ca1\u52d9\u58d3\u529b\uff0c"}</p>
                      <p>{"\u5e38\u5e38\u4e0d\u662f\u55ae\u4e00\u4ef6\u4e8b\u3002"}</p>
                    </div>
                  ) : (
                    <p>{audienceIntro}</p>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{"\u4f60\u53ef\u80fd\u6b63\u5728\u9047\u5230\uff1a"}</p>
                    <ul className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2 sm:text-base">
                      {introItems.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">
                  {"\u5e38\u898b\u60c5\u5883"}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.commonTopics.map((topic) => {
                    const topicIntro =
                      (data.slug === "working-life" ? workingLifeTopicDescriptions[topic.href] : undefined) ??
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
                <h2 className="text-xl font-semibold text-foreground">
                  {"\u4f60\u53ef\u80fd\u7528\u5f97\u5230\u7684\u8cc7\u6e90"}
                </h2>
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

          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">
                  {"\u53ef\u4ee5\u8a66\u8a66"}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {"\u5982\u679c\u770b\u5230\u9019\u88e1\u89ba\u5f97\u60f3\u518d\u5f80\u524d\u4e00\u6b65\uff0c\u53ef\u4ee5\u5148\u9078\u4e00\u500b\u6700\u5bb9\u6613\u958b\u59cb\u7684\u884c\u52d5\u3002"}
                </p>
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
