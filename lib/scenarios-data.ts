export type ScenarioSituation = {
  slug: string
  title: string
}

export type ScenarioCategory = {
  slug: string
  anchor: string
  title: string
  summary: string
  situations: ScenarioSituation[]
}

export const scenarioCategories: ScenarioCategory[] = [
  {
    slug: "work-income",
    anchor: "work-income",
    title: "工作與收入問題",
    summary: "工作、收入、轉職與退休準備相關的生活財務情境。",
    situations: [
      { slug: "first-job", title: "剛開始工作" },
      { slug: "unstable-income", title: "收入不穩" },
      { slug: "career-transition", title: "正在轉職" },
      { slug: "recently-unemployed", title: "最近失業" },
      { slug: "side-income", title: "第二收入／斜槓" },
      { slug: "retirement-prep", title: "退休準備" },
    ],
  },
  {
    slug: "debt-pressure",
    anchor: "debt-pressure",
    title: "債務與財務壓力",
    summary: "卡債、貸款、準時繳款、強制執行與入不敷出相關情境。",
    situations: [
      { slug: "credit-card-revolving", title: "卡債與循環利息" },
      { slug: "personal-loan", title: "信用貸款" },
      { slug: "mortgage-car-loan", title: "房貸與車貸壓力" },
      { slug: "late-payment", title: "無法準時繳款" },
      { slug: "enforcement", title: "強制執行" },
      { slug: "financial-anxiety", title: "財務焦慮與入不敷出" },
    ],
  },
  {
    slug: "fraud-risk",
    anchor: "fraud-risk",
    title: "詐騙與金融風險",
    summary: "投資、網購、交友、求職、帳戶與個資安全相關情境。",
    situations: [
      { slug: "investment-fraud", title: "投資詐騙" },
      { slug: "shopping-fraud", title: "網路購物詐騙" },
      { slug: "romance-fraud", title: "愛情交友詐騙" },
      { slug: "job-fraud", title: "求職詐騙" },
      { slug: "warning-account", title: "人頭帳戶／警示帳戶" },
      { slug: "personal-data-safety", title: "個資外洩與帳號安全" },
    ],
  },
  {
    slug: "health-care",
    anchor: "health-care",
    title: "生病與照顧",
    summary: "自己或家人生病、重大傷病、長照與醫療支出增加相關情境。",
    situations: [
      { slug: "self-illness", title: "自己生病" },
      { slug: "family-illness", title: "家人生病" },
      { slug: "major-illness", title: "重大傷病" },
      { slug: "long-term-care", title: "長期照顧" },
      { slug: "caregiving-leave", title: "照顧離職" },
      { slug: "medical-expense", title: "醫療支出增加" },
    ],
  },
  {
    slug: "family-change",
    anchor: "family-change",
    title: "家庭與生活變故",
    summary: "家庭建立、生育、單親、關係變化、租屋搬家與重大變故相關情境。",
    situations: [
      { slug: "marriage-family", title: "結婚與家庭建立" },
      { slug: "childcare", title: "生育與育兒" },
      { slug: "single-parent", title: "單親家庭" },
      { slug: "relationship-change", title: "離婚與關係變化" },
      { slug: "moving-renting", title: "搬家與租屋" },
      { slug: "bereavement-change", title: "親人過世或重大變故" },
    ],
  },
]

export function findScenarioCategory(slug: string) {
  return scenarioCategories.find((category) => category.slug === slug)
}

export function findScenarioSituation(categorySlug: string, situationSlug: string) {
  const category = findScenarioCategory(categorySlug)
  const situation = category?.situations.find((item) => item.slug === situationSlug)

  if (!category || !situation) return null

  return { category, situation }
}

