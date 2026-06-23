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

const situationIntroPreview: Record<string, string> = {
  "first-job": "剛開始工作時，收入變得比較穩定，生活開銷也會開始變多，需要慢慢建立自己的財務節奏。",
  "unstable-income": "收入不穩時，最累的常常不是單月少賺，而是不知道下個月能不能安心安排生活。",
  "career-transition": "正在轉職時，收入、時間與未來方向都可能一起變動，需要先看清楚可以支撐多久。",
  "recently-unemployed": "最近失業時，生活常常會突然失去原本節奏，需要先穩住短期生活與可申請權益。",
  "side-income": "第二收入或斜槓會讓收入來源變多，也可能讓時間、成本與主業界線變得複雜。",
  "retirement-prep": "退休準備不只是存到一筆錢，也包含未來生活、醫療、住房與工作退場安排。",
  "credit-card-revolving": "卡債與循環利息會讓人覺得每個月都有繳，卻好像一直還不完。",
  "personal-loan": "信用貸款看似固定支出，但收入或家用改變時，也可能慢慢變成沉重壓力。",
  "mortgage-car-loan": "房貸與車貸金額大、時間長，當生活責任改變時，月付壓力也會跟著變動。",
  "late-payment": "無法準時繳款時，需要先看清楚期限、金額、逾期後果與可以聯繫的窗口。",
  enforcement: "遇到強制執行時，薪資、帳戶或生活安排都可能受影響，需要先釐清目前進度。",
  "financial-anxiety": "財務焦慮與入不敷出不只是帳戶餘額，也會影響睡眠、關係與日常判斷。",
  "investment-fraud": "投資詐騙常用高報酬、限時機會或群組見證降低警覺，需要先暫停匯款並保存紀錄。",
  "shopping-fraud": "網路購物詐騙常藏在日常交易裡，可能牽涉付款、個資、帳戶與後續扣款。",
  "romance-fraud": "愛情交友詐騙讓人難受的不只是金錢損失，也包含信任被利用的受傷感。",
  "job-fraud": "求職詐騙常包裝成高薪、免經驗或快速錄取，需要先確認工作與金流是否合理。",
  "warning-account": "人頭帳戶或警示帳戶會影響薪資入帳與金融使用，也可能牽涉法律責任。",
  "personal-data-safety": "個資外洩與帳號安全會影響金錢安全，也可能造成冒名申辦、盜刷或帳戶異常。",
  "self-illness": "自己生病時，身體、工作收入與醫療支出可能同時受影響，需要先整理可用保障。",
  "family-illness": "家人生病時，陪診、照顧、交通、醫療費與家庭分工，常常會一起壓到眼前。",
  "major-illness": "重大傷病通常不是短期事件，治療、休養、看護與收入中斷都可能一起出現。",
  "long-term-care": "長期照顧會影響被照顧者與照顧者，也會牽動工作、收入、休息與家庭關係。",
  "caregiving-leave": "照顧離職不是單純的工作選擇，而是家庭責任、照顧資源與財務壓力一起推到眼前。",
  "medical-expense": "醫療支出增加時，反覆回診、藥物、交通與照顧成本會逐漸累積成壓力。",
  "marriage-family": "結婚與家庭建立會把兩個人的生活、金錢習慣與未來期待放在一起。",
  childcare: "生育與育兒會讓家庭支出和時間安排明顯改變，需要先估算照顧與工作安排。",
  "single-parent": "單親家庭常常要同時扛起照顧、收入與孩子安排，需要把支出與支持排出順序。",
  "relationship-change": "離婚與關係變化會牽動住處、孩子照顧、財產、債務與未來生活安排。",
  "moving-renting": "搬家與租屋會牽動押金、租金、交通、合約條件與每月固定支出。",
  "bereavement-change": "親人過世或重大變故發生時，費用、文件、家庭分工與未來生活常會同時出現。",
}

export default function LifeTopicsPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-primary">生活課題</p>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl text-balance">
            從最近困擾你的事情開始
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            不一定要先把所有問題都說清楚，先選一個最接近的生活課題，我們會陪你一步一步整理可以開始的方向。
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
                        {situationIntroPreview[situation.slug] ??
                          `先從「${situation.title}」的生活處境開始，看見壓力來源與可以整理的下一步。`}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        看更多 <ArrowRight className="h-4 w-4" />
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
