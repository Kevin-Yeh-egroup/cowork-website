import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ExternalLink,
  HandCoins,
  HeartPulse,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
  Users,
  WalletCards,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { AudienceMiniScene } from "@/components/context-illustration"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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

type AudienceResource = {
  category: string
  source: "政府單位" | "非營利組織" | "民間服務"
  title: string
  description: string
  provider: string
  tags: string[]
  href: string
  action: string
}

type ResourceTopic = {
  id: string
  title: string
  description: string
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

const workingLifeResources: AudienceResource[] = [
  {
    category: "勞動權益與爭議處理",
    source: "政府單位",
    title: "勞動權益諮詢與申訴窗口",
    description: "遇到薪資、工時、加班、解僱或資遣問題時，可查詢法規、申訴及勞資調解窗口。",
    provider: "勞動部及地方勞工行政主管機關",
    tags: ["免費諮詢", "申訴與調解"],
    href: "https://www.mol.gov.tw/",
    action: "查詢諮詢窗口",
  },
  {
    category: "勞動權益與爭議處理",
    source: "非營利組織",
    title: "勞工訴訟法律扶助",
    description: "準備處理勞資爭議或進入法律程序時，可查詢律師諮詢與訴訟扶助的申請方式。",
    provider: "財團法人法律扶助基金會",
    tags: ["法律扶助", "申請資格"],
    href: "https://www.mol.gov.tw/1607/28690/89680/89699/lpsimplelist",
    action: "查看扶助方式",
  },
  {
    category: "就業與職涯支持",
    source: "政府單位",
    title: "求職與就業服務",
    description: "需要找工作、轉職或重返職場時，可查詢職缺、就業服務據點與分眾支持方案。",
    provider: "勞動部勞動力發展署",
    tags: ["職缺查詢", "就業服務"],
    href: "https://www.taiwanjobs.gov.tw/",
    action: "尋找工作機會",
  },
  {
    category: "就業與職涯支持",
    source: "政府單位",
    title: "職業訓練與技能發展",
    description: "想培養第二專長、準備轉職或提升工作技能時，可依地區及職類查詢訓練課程。",
    provider: "台灣就業通職業訓練整合網",
    tags: ["職業訓練", "技能培養"],
    href: "https://course.taiwanjobs.gov.tw/",
    action: "尋找職訓課程",
  },
  {
    category: "收入中斷與生活援助",
    source: "政府單位",
    title: "失業給付與就業保險",
    description: "工作中斷或非自願離職時，可查詢失業給付、提早就業獎助及相關申請方式。",
    provider: "勞動部勞工保險局",
    tags: ["失業給付", "線上申辦"],
    href: "https://www.bli.gov.tw/",
    action: "查詢失業給付",
  },
  {
    category: "收入中斷與生活援助",
    source: "政府單位",
    title: "急難救助與福利諮詢",
    description: "收入突然中斷、家庭生活陷入困難時，可查詢急難救助、福利諮詢及地方申請窗口。",
    provider: "衛生福利部及地方政府",
    tags: ["急難救助", "生活支持"],
    href: "https://www.mohw.gov.tw/cp-190-226-1.html",
    action: "查看救助方式",
  },
  {
    category: "財務與債務整理",
    source: "非營利組織",
    title: "消費者債務清理法律扶助",
    description: "債務已難以負擔時，可申請債務法律諮詢，了解協商、更生或清算等處理方式。",
    provider: "財團法人法律扶助基金會",
    tags: ["免費申請", "債務清理"],
    href: "https://www.laf.org.tw/service-project-detail/20",
    action: "查看債務扶助",
  },
  {
    category: "職災、健康與復工",
    source: "政府單位",
    title: "職災保護與重建服務",
    description: "工作受傷或疑似職業病時，可查詢診治、職災給付、生活補助及重建服務。",
    provider: "勞動部職業安全衛生署",
    tags: ["職災診治", "補助與重建"],
    href: "https://www.osha.gov.tw/48110/48363/",
    action: "查看職災服務",
  },
  {
    category: "職災、健康與復工",
    source: "政府單位",
    title: "職能復健與復工協助",
    description: "治療後準備重返職場時，可查詢職能評估、復工計畫、訓練及津貼等服務。",
    provider: "職災職能復健專責機構及地方政府",
    tags: ["職能復健", "復工計畫"],
    href: "https://www.osha.gov.tw/48110/48363/133471/133474/133518/",
    action: "尋找復健服務",
  },
  {
    category: "保險、給付與退休保障",
    source: "政府單位",
    title: "勞保、就保與退休給付",
    description: "可依目前處境查詢勞工保險、就業保險、職災保險及勞工退休金的申辦資訊。",
    provider: "勞動部勞工保險局",
    tags: ["給付查詢", "勞工退休金"],
    href: "https://www.bli.gov.tw/",
    action: "查詢勞保與勞退",
  },
  {
    category: "保險、給付與退休保障",
    source: "非營利組織",
    title: "保險消費爭議與評議",
    description: "已先向保險公司申訴但未獲妥善處理時，可了解金融消費爭議的評議申請程序。",
    provider: "財團法人金融消費評議中心",
    tags: ["商業保險", "爭議評議"],
    href: "https://www.foi.org.tw/",
    action: "申請爭議評議",
  },
  {
    category: "家庭照顧與工作安排",
    source: "政府單位",
    title: "工作與生活平衡措施",
    description: "育兒、長照或家庭照顧影響工作時，可查詢育嬰留職停薪、家庭照顧與企業支持措施。",
    provider: "勞動部工作生活平衡網",
    tags: ["育嬰留停", "家庭照顧"],
    href: "https://wlb.mol.gov.tw/",
    action: "查看支持措施",
  },
]

const workingLifeResourceTopics: ResourceTopic[] = [
  {
    id: "work-rights",
    title: "勞動權益與爭議處理",
    description: "薪資、工時、解僱、資遣、申訴與法律扶助",
    icon: Scale,
  },
  {
    id: "career",
    title: "就業與職涯支持",
    description: "求職、轉職、職業訓練與技能發展",
    icon: BriefcaseBusiness,
  },
  {
    id: "income-support",
    title: "收入中斷與生活援助",
    description: "失業給付、急難救助與基本生活支持",
    icon: HandCoins,
  },
  {
    id: "debt",
    title: "財務與債務整理",
    description: "債務諮詢、協商、更生與清算扶助",
    icon: WalletCards,
  },
  {
    id: "health",
    title: "職災、健康與復工",
    description: "職業傷病、補助、重建與重返職場",
    icon: HeartPulse,
  },
  {
    id: "insurance",
    title: "保險、給付與退休保障",
    description: "社會保險、商業保險爭議與退休給付",
    icon: ShieldCheck,
  },
  {
    id: "family-care",
    title: "家庭照顧與工作安排",
    description: "育兒、長照與家庭照顧期間的工作支持",
    icon: Users,
  },
]

const resourceSourceStyles: Record<AudienceResource["source"], string> = {
  政府單位: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200",
  非營利組織: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  民間服務: "bg-stone-100 text-stone-700 dark:bg-stone-900/60 dark:text-stone-200",
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
                {data.slug === "working-life" ? (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      需要直接辦理、申請或找人協助時，可以先從幾個主要服務入口開始。
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">以下為主要入口示意，正式收錄單位與服務範圍仍需確認。</p>
                    <Accordion type="single" collapsible defaultValue="work-rights" className="mt-4 space-y-2">
                      {workingLifeResourceTopics.map((topic) => {
                        const TopicIcon = topic.icon
                        const resources = workingLifeResources.filter((resource) => resource.category === topic.title)

                        return (
                          <AccordionItem
                            key={topic.id}
                            value={topic.id}
                            className="overflow-hidden rounded-lg border border-border/70 bg-background/75 px-4"
                          >
                            <AccordionTrigger className="py-4 hover:no-underline">
                              <span className="flex min-w-0 items-start gap-3">
                                <span className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                                  <TopicIcon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block font-semibold text-foreground">{topic.title}</span>
                                  <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">
                                    {topic.description}
                                  </span>
                                </span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-2">
                              <div className="divide-y divide-border/70 border-t border-border/70">
                                {resources.map((resource) => {
                                  const isExternal = resource.href.startsWith("http")

                                  return (
                                    <div
                                      key={`${resource.source}-${resource.title}`}
                                      className="grid gap-3 py-4 sm:grid-cols-[110px_1fr_auto] sm:items-start"
                                    >
                                      <div>
                                        <span
                                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${resourceSourceStyles[resource.source]}`}
                                        >
                                          {resource.source}
                                        </span>
                                      </div>
                                      <div className="min-w-0">
                                        <h3 className="font-semibold text-foreground">{resource.title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                          <span className="font-medium text-foreground">提供單位：</span>
                                          {resource.provider}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {resource.tags.map((tag) => (
                                            <span
                                              key={tag}
                                              className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <Link
                                        href={resource.href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noreferrer" : undefined}
                                        className="group inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary transition-all hover:gap-2 sm:pt-0.5"
                                      >
                                        {resource.action}
                                        {isExternal ? (
                                          <ExternalLink className="h-4 w-4" />
                                        ) : (
                                          <ArrowRight className="h-4 w-4" />
                                        )}
                                      </Link>
                                    </div>
                                  )
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </>
                ) : (
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
                )}
              </CardContent>
            </Card>

          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">
                  {data.slug === "working-life" ? "我們提供" : "\u53ef\u4ee5\u8a66\u8a66"}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {data.slug === "working-life"
                    ? "需要整理生活與財務壓力時，可以從好理家在提供的服務中選擇適合的入口。"
                    : "\u5982\u679c\u770b\u5230\u9019\u88e1\u89ba\u5f97\u60f3\u518d\u5f80\u524d\u4e00\u6b65\uff0c\u53ef\u4ee5\u5148\u9078\u4e00\u500b\u6700\u5bb9\u6613\u958b\u59cb\u7684\u884c\u52d5\u3002"}
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
