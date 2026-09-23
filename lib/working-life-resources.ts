import {
  BriefcaseBusiness,
  HandCoins,
  HeartPulse,
  Scale,
  ShieldCheck,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react"

export type ResourceSource = "政府單位" | "非營利組織" | "民間服務"

export type WorkingLifeResource = {
  topicId: string
  category: string
  source: ResourceSource
  title: string
  description: string
  provider: string
  scope: string
  tags: string[]
  href: string
  action: string
}

export type WorkingLifeResourceTopic = {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export const workingLifeResourceTopics: WorkingLifeResourceTopic[] = [
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

export const workingLifeResources: WorkingLifeResource[] = [
  {
    topicId: "work-rights",
    category: "勞動權益與爭議處理",
    source: "政府單位",
    title: "勞動權益諮詢與申訴窗口",
    description: "遇到薪資、工時、加班、解僱或資遣問題時，可查詢法規、申訴及勞資調解窗口。",
    provider: "勞動部及地方勞工行政主管機關",
    scope: "全國／依所在地辦理",
    tags: ["免費諮詢", "申訴與調解"],
    href: "https://www.mol.gov.tw/",
    action: "查詢諮詢窗口",
  },
  {
    topicId: "work-rights",
    category: "勞動權益與爭議處理",
    source: "非營利組織",
    title: "勞工訴訟法律扶助",
    description: "準備處理勞資爭議或進入法律程序時，可查詢律師諮詢與訴訟扶助的申請方式。",
    provider: "財團法人法律扶助基金會",
    scope: "全國",
    tags: ["法律扶助", "申請資格"],
    href: "https://www.mol.gov.tw/1607/28690/89680/89699/lpsimplelist",
    action: "查看扶助方式",
  },
  {
    topicId: "career",
    category: "就業與職涯支持",
    source: "政府單位",
    title: "求職與就業服務",
    description: "需要找工作、轉職或重返職場時，可查詢職缺、就業服務據點與分眾支持方案。",
    provider: "勞動部勞動力發展署",
    scope: "全國",
    tags: ["職缺查詢", "就業服務"],
    href: "https://www.taiwanjobs.gov.tw/",
    action: "尋找工作機會",
  },
  {
    topicId: "career",
    category: "就業與職涯支持",
    source: "政府單位",
    title: "職業訓練與技能發展",
    description: "想培養第二專長、準備轉職或提升工作技能時，可依地區及職類查詢訓練課程。",
    provider: "台灣就業通職業訓練整合網",
    scope: "全國",
    tags: ["職業訓練", "技能培養"],
    href: "https://course.taiwanjobs.gov.tw/",
    action: "尋找職訓課程",
  },
  {
    topicId: "income-support",
    category: "收入中斷與生活援助",
    source: "政府單位",
    title: "失業給付與就業保險",
    description: "工作中斷或非自願離職時，可查詢失業給付、提早就業獎助及相關申請方式。",
    provider: "勞動部勞工保險局",
    scope: "全國",
    tags: ["失業給付", "線上申辦"],
    href: "https://www.bli.gov.tw/",
    action: "查詢失業給付",
  },
  {
    topicId: "income-support",
    category: "收入中斷與生活援助",
    source: "政府單位",
    title: "急難救助與福利諮詢",
    description: "收入突然中斷、家庭生活陷入困難時，可查詢急難救助、福利諮詢及地方申請窗口。",
    provider: "衛生福利部及地方政府",
    scope: "全國／依所在地辦理",
    tags: ["急難救助", "生活支持"],
    href: "https://www.mohw.gov.tw/cp-190-226-1.html",
    action: "查看救助方式",
  },
  {
    topicId: "debt",
    category: "財務與債務整理",
    source: "非營利組織",
    title: "消費者債務清理法律扶助",
    description: "債務已難以負擔時，可申請債務法律諮詢，了解協商、更生或清算等處理方式。",
    provider: "財團法人法律扶助基金會",
    scope: "全國",
    tags: ["免費申請", "債務清理"],
    href: "https://www.laf.org.tw/service-project-detail/20",
    action: "查看債務扶助",
  },
  {
    topicId: "health",
    category: "職災、健康與復工",
    source: "政府單位",
    title: "職災保護與重建服務",
    description: "工作受傷或疑似職業病時，可查詢診治、職災給付、生活補助及重建服務。",
    provider: "勞動部職業安全衛生署",
    scope: "全國",
    tags: ["職災診治", "補助與重建"],
    href: "https://www.osha.gov.tw/48110/48363/",
    action: "查看職災服務",
  },
  {
    topicId: "health",
    category: "職災、健康與復工",
    source: "政府單位",
    title: "職能復健與復工協助",
    description: "治療後準備重返職場時，可查詢職能評估、復工計畫、訓練及津貼等服務。",
    provider: "職災職能復健專責機構及地方政府",
    scope: "依服務據點",
    tags: ["職能復健", "復工計畫"],
    href: "https://www.osha.gov.tw/48110/48363/133471/133474/133518/",
    action: "尋找復健服務",
  },
  {
    topicId: "insurance",
    category: "保險、給付與退休保障",
    source: "政府單位",
    title: "勞保、就保與退休給付",
    description: "可依目前處境查詢勞工保險、就業保險、職災保險及勞工退休金的申辦資訊。",
    provider: "勞動部勞工保險局",
    scope: "全國",
    tags: ["給付查詢", "勞工退休金"],
    href: "https://www.bli.gov.tw/",
    action: "查詢勞保與勞退",
  },
  {
    topicId: "insurance",
    category: "保險、給付與退休保障",
    source: "非營利組織",
    title: "保險消費爭議與評議",
    description: "已先向保險公司申訴但未獲妥善處理時，可了解金融消費爭議的評議申請程序。",
    provider: "財團法人金融消費評議中心",
    scope: "全國",
    tags: ["商業保險", "爭議評議"],
    href: "https://www.foi.org.tw/",
    action: "申請爭議評議",
  },
  {
    topicId: "family-care",
    category: "家庭照顧與工作安排",
    source: "政府單位",
    title: "工作與生活平衡措施",
    description: "育兒、長照或家庭照顧影響工作時，可查詢育嬰留職停薪、家庭照顧與企業支持措施。",
    provider: "勞動部工作生活平衡網",
    scope: "全國",
    tags: ["育嬰留停", "家庭照顧"],
    href: "https://wlb.mol.gov.tw/",
    action: "查看支持措施",
  },
]

export const resourceSourceStyles: Record<ResourceSource, string> = {
  政府單位: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200",
  非營利組織: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  民間服務: "bg-stone-100 text-stone-700 dark:bg-stone-900/60 dark:text-stone-200",
}

export function getWorkingLifeResources(topicId?: string) {
  return topicId ? workingLifeResources.filter((resource) => resource.topicId === topicId) : workingLifeResources
}
