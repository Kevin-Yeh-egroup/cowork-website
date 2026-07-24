export type LifeStageTopic = {
  title: string
  href: string
}

export type LifeStage = {
  slug: string
  emoji: string
  title: string
  audience: string
  summary: string
  commonTopics: LifeStageTopic[]
  offerings: string[]
  partners: string[]
  actions: string[]
}

export const lifeStages: LifeStage[] = [
  {
    slug: "independent-life",
    emoji: "🧑‍🎓",
    title: "開始獨立生活",
    audience: "自立青少年",
    summary: "從第一次自己安排收入、住處、生活費開始，建立能被理解也能被追蹤的財務生活節奏。",
    commonTopics: [
      { title: "剛開始工作", href: "/life-topics/work-income/first-job" },
      { title: "收入不穩", href: "/life-topics/work-income/unstable-income" },
      { title: "搬家與租屋", href: "/life-topics/family-change/moving-renting" },
      { title: "財務焦慮與入不敷出", href: "/life-topics/debt-pressure/financial-anxiety" },
    ],
    offerings: ["財務健康檢測", "財務生活記帳助理", "免費諮詢", "社工合作服務"],
    partners: ["自立青少年服務單位", "學校與青年支持資源", "就業服務資源", "社福合作單位"],
    actions: ["整理生活費與固定支出", "建立第一份收支表", "陪同設定短期目標", "連結可用的支持資源"],
  },
  {
    slug: "working-life",
    emoji: "👷",
    title: "正在工作打拼",
    audience: "勞工",
    summary: "工作、收入、轉職與家庭責任常常交在一起，先把壓力拆開，才知道下一步要從哪裡開始。",
    commonTopics: [
      { title: "收入不穩", href: "/life-topics/work-income/unstable-income" },
      { title: "正在轉職", href: "/life-topics/work-income/career-transition" },
      { title: "最近失業", href: "/life-topics/work-income/recently-unemployed" },
      { title: "第二收入／斜槓", href: "/life-topics/work-income/side-income" },
      { title: "財務焦慮與入不敷出", href: "/life-topics/debt-pressure/financial-anxiety" },
      { title: "退休準備", href: "/life-topics/work-income/retirement-prep" },
    ],
    offerings: ["財務健康檢測", "財務工具", "免費諮詢", "社工合作服務"],
    partners: ["法律諮詢服務", "勞動權益諮詢", "就業與職涯支持", "財務與債務協談"],
    actions: ["個案轉介", "財務講座", "培力課程", "專案合作"],
  },
  {
    slug: "single-parent-family",
    emoji: "👩‍👧",
    title: "一個人撐起一個家",
    audience: "單親家庭",
    summary: "一個人扛起照顧、收入與家務時，最需要的是把壓力排序，先穩住日常，再處理長期問題。",
    commonTopics: [
      { title: "生育與育兒", href: "/life-topics/family-change/childcare" },
      { title: "單親家庭", href: "/life-topics/family-change/single-parent" },
      { title: "無法準時繳款", href: "/life-topics/debt-pressure/late-payment" },
      { title: "財務焦慮與入不敷出", href: "/life-topics/debt-pressure/financial-anxiety" },
    ],
    offerings: ["財務健康檢測", "債務盤點", "免費諮詢", "家庭財務風險整理"],
    partners: ["家庭服務中心", "婦幼與親職支持單位", "法律扶助資源", "社福合作單位"],
    actions: ["整理每月必要支出", "盤點照顧與工作安排", "安排債務與補助討論", "協助個案轉介"],
  },
  {
    slug: "family-caregiver",
    emoji: "❤️",
    title: "陪伴家人走一段路",
    audience: "照顧者",
    summary: "照顧責任會影響工作、時間與金錢安排，先把照顧成本看清楚，再找可分擔的資源。",
    commonTopics: [
      { title: "家人生病", href: "/life-topics/health-care/family-illness" },
      { title: "長期照顧", href: "/life-topics/health-care/long-term-care" },
      { title: "照顧離職", href: "/life-topics/health-care/caregiving-leave" },
      { title: "醫療支出增加", href: "/life-topics/health-care/medical-expense" },
    ],
    offerings: ["財務健康檢測", "財務規劃", "免費諮詢", "社工合作服務"],
    partners: ["長照服務單位", "醫療院所社工室", "照顧者支持團體", "社福合作單位"],
    actions: ["整理照顧支出", "盤點可用補助", "討論工作與照顧安排", "連結照顧資源"],
  },
  {
    slug: "health-challenge",
    emoji: "♿",
    title: "面對健康與生活的新挑戰",
    audience: "身障者與家庭",
    summary: "健康變化會牽動收入、交通、醫療與照顧支出，先建立清楚的風險輪廓，才能分段處理。",
    commonTopics: [
      { title: "自己生病", href: "/life-topics/health-care/self-illness" },
      { title: "重大傷病", href: "/life-topics/health-care/major-illness" },
      { title: "醫療支出增加", href: "/life-topics/health-care/medical-expense" },
      { title: "家庭與生活變故", href: "/life-topics/family-change/bereavement-change" },
    ],
    offerings: ["財務健康檢測", "免費諮詢", "家庭財務風險整理", "社工合作服務"],
    partners: ["身障服務單位", "醫療與復健資源", "社會福利服務中心", "合作單位"],
    actions: ["整理醫療與生活支出", "盤點收入變化", "確認補助與保險資訊", "安排後續追蹤"],
  },
  {
    slug: "retirement-aging",
    emoji: "🧓",
    title: "開始思考退休與老後",
    audience: "中高齡",
    summary: "退休不是只有存款數字，也包含工作選擇、家庭支持、健康風險與生活期待的整理。",
    commonTopics: [
      { title: "退休準備", href: "/life-topics/work-income/retirement-prep" },
      { title: "第二收入／斜槓", href: "/life-topics/work-income/side-income" },
      { title: "房貸與車貸壓力", href: "/life-topics/debt-pressure/mortgage-car-loan" },
      { title: "個資外洩與帳號安全", href: "/life-topics/fraud-risk/personal-data-safety" },
    ],
    offerings: ["財務健康檢測", "財務規劃", "詐騙防禦檢測", "免費諮詢"],
    partners: ["中高齡就業資源", "社區關懷據點", "金融安全宣導資源", "合作單位"],
    actions: ["整理退休前後收入", "盤點固定支出", "檢查金融風險", "討論老後生活安排"],
  },
]

const serviceAudienceOrder = [
  "working-life",
  "health-challenge",
  "independent-life",
  "family-caregiver",
  "single-parent-family",
  "retirement-aging",
]

export const serviceAudiences = serviceAudienceOrder
  .map((slug) => lifeStages.find((stage) => stage.slug === slug))
  .filter((stage): stage is LifeStage => Boolean(stage))

export function findLifeStage(slug: string) {
  return lifeStages.find((stage) => stage.slug === slug)
}
