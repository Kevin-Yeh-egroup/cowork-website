import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  HandCoins,
  HeartPulse,
  Home,
  ShieldQuestion,
  WalletCards,
  Wrench,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"

export const metadata: Metadata = {
  title: "情境專區 - 好理家在",
  description: "從工作收入、債務壓力、詐騙風險、生病照顧、家庭變故等生活情境，找到適合的檢測、工具、內容或諮詢入口。",
}

type ActionLink = {
  href: string
  label: string
  helper: string
  icon: LucideIcon
}

type ScenarioSection = {
  id: string
  category: string
  title: string
  intro: string
  icon: LucideIcon
  accent: string
  situations: string[]
  overlooked: string[]
  firstSteps: string[]
  learnMore: string[]
  actions: ActionLink[]
}

const scenarioSections: ScenarioSection[] = [
  {
    id: "debt",
    category: "債務與財務壓力",
    title: "帳單快繳不出來，卡費只能繳最低",
    intro: "先不用急著把所有數字算完，重點是分清楚哪些事情今天要處理、哪些可以談、哪些需要有人陪你一起看。",
    icon: WalletCards,
    accent: "bg-secondary text-secondary-foreground",
    situations: ["卡債與循環利息", "信用貸款", "房貸與車貸壓力", "無法準時繳款", "強制執行", "財務焦慮與入不敷出"],
    overlooked: ["最急的不一定是金額最大，而是最會影響生活或權益的項目。", "只繳最低應繳可能暫時喘口氣，但壓力會拖得更久。", "催收、法務通知或協商紀錄要先留存，不要只靠記憶。"],
    firstSteps: ["把這個月的必繳、可談、可延後分開。", "用債務盤點看利率、月付與現金流。", "如果已經收到法務或催收通知，優先找真人一起整理。"],
    learnMore: ["最低應繳、循環利息與總還款時間", "債務協商前要準備的資料", "財務焦慮時如何先做一個小決定"],
    actions: [
      { href: "/toolbox/debt", label: "債務盤點", helper: "先把帳單、利率和每月壓力放在同一張表裡。", icon: Wrench },
      { href: "/financial-anxiety", label: "財務焦慮檢測", helper: "看目前壓力是否已影響生活與判斷。", icon: ClipboardCheck },
      { href: externalLinks.onlineConsultation, label: "找人一起整理", helper: "把整理結果帶去和真人諮詢師討論。", icon: HandCoins },
    ],
  },
  {
    id: "fraud",
    category: "詐騙與金融風險",
    title: "收到投資、代操或 LINE 群訊息",
    intro: "詐騙常常不是因為人不小心，而是對方設計了時間壓力、關係壓力和獲利想像。先停下來查證，就是保護自己。",
    icon: ShieldQuestion,
    accent: "bg-primary/10 text-primary",
    situations: ["投資詐騙", "網路購物詐騙", "愛情交友詐騙", "求職詐騙", "人頭帳戶或警示帳戶", "個資外洩與帳號安全"],
    overlooked: ["保證獲利、穩賺不賠、老師帶單、代操帳戶，都是需要停下來的紅旗。", "對方要求帳戶、卡號、OTP、驗證碼或借用帳戶時，不需要貼上或提供。", "疑似詐騙時，對話紀錄、轉帳資訊和對方帳號都可能是後續查證資料。"],
    firstSteps: ["先不要轉帳、不要提供帳戶或驗證碼。", "截圖保存對話、連結、群組與匯款資訊。", "用詐騙防禦檢測或問問 AI 先整理風險紅旗。"],
    learnMore: ["投資群組常見話術", "人頭帳戶與警示帳戶風險", "個資外洩後可以先做的事"],
    actions: [
      { href: "/fraud-defense", label: "詐騙防禦檢測", helper: "用生活題目看自己是否容易被話術推著走。", icon: ClipboardCheck },
      { href: "/ask-ai", label: "先整理可疑訊息", helper: "不用貼個資，可以用遮蔽內容描述對方說法。", icon: Bot },
      { href: externalLinks.onlineConsultation, label: "需要有人確認", helper: "如果已經匯款、借帳戶或收到通知，請及早找真人協助。", icon: HandCoins },
    ],
  },
  {
    id: "care",
    category: "生病與照顧",
    title: "家人生病，照顧費和醫療費變多",
    intro: "生病與照顧常常同時改變收入、時間和支出。先把照顧安排、醫療費、生活費與可申請資源分開，壓力會比較能被看見。",
    icon: HeartPulse,
    accent: "bg-accent/10 text-accent",
    situations: ["自己生病", "家人生病", "重大傷病", "長期照顧", "照顧離職", "醫療支出增加"],
    overlooked: ["照顧者自己的收入、睡眠和情緒也會影響家庭財務。", "醫療費之外，交通、看護、餐食與請假成本也需要一起估。", "有些補助或資源有申請條件與時限，越早整理越好。"],
    firstSteps: ["列出每週固定照顧支出與一次性醫療費。", "把可申請的保險、補助、急難或社福資源放在同一處。", "如果照顧安排影響工作，先盤點收入缺口。"],
    learnMore: ["照顧支出如何先分固定與臨時", "重大傷病與長照情境常見財務壓力", "照顧者與家人談錢時的安全說法"],
    actions: [
      { href: "/ask-ai", label: "先整理照顧壓力", helper: "用模糊描述也可以，先把支出、照顧和工作影響分開。", icon: Bot },
      { href: "/content", label: "看相關內容", helper: "先用文章或音頻理解類似家庭怎麼面對。", icon: BookOpen },
      { href: externalLinks.onlineConsultation, label: "申請免費諮詢", helper: "需要有人一起盤點家庭資源時，可以帶著整理結果討論。", icon: HandCoins },
    ],
  },
  {
    id: "income",
    category: "工作與收入問題",
    title: "收入不穩、剛失業，接下來怎麼撐過去",
    intro: "工作變動時，最需要的不是立刻做完完整財務規劃，而是先知道現金能撐多久、哪些支出可調整、哪些權益要確認。",
    icon: BriefcaseBusiness,
    accent: "bg-primary/10 text-primary",
    situations: ["剛開始工作", "收入不穩", "正在轉職", "最近失業", "第二收入或斜槓", "退休準備"],
    overlooked: ["收入變少時，人會更容易做出高利借款或高風險投資決定。", "轉職、資遣、失業或兼職收入都可能影響保險、補助和現金流。", "退休準備不一定從投資開始，也可以先從生活支出與風險缺口開始。"],
    firstSteps: ["估算未來 1 到 3 個月必要支出。", "確認薪資、資遣、失業給付或兼職收入時間。", "用檢測看目前財務韌性，決定先調支出或找資源。"],
    learnMore: ["收入不穩時的現金流排序", "失業與轉職期間要先確認的權益", "第二收入與退休準備的風險界線"],
    actions: [
      { href: "/financial-resilience", label: "財務韌性檢測", helper: "先看家庭或個人目前承受變動的能力。", icon: ClipboardCheck },
      { href: "/toolbox", label: "財務工具", helper: "用記帳、試算或規劃工具抓出可調整空間。", icon: Wrench },
      { href: "/ask-ai", label: "問問 AI", helper: "先描述收入變動，請 AI 幫你整理下一步。", icon: Bot },
    ],
  },
  {
    id: "family",
    category: "家庭與生活變故",
    title: "家庭變故後，錢和生活都要重排",
    intro: "結婚、生育、離婚、單親、搬家或親人過世，都不只是金錢問題，也牽涉關係、照顧與安全感。先整理決定順序，會比一次解完所有問題更可行。",
    icon: Home,
    accent: "bg-secondary text-secondary-foreground",
    situations: ["結婚與家庭建立", "生育與育兒", "單親家庭", "離婚與關係變化", "搬家與租屋", "親人過世或重大變故"],
    overlooked: ["家庭成員對錢的期待不同，常常比數字本身更難談。", "搬家、育兒、喪葬或關係變化會帶來一次性支出，也會改變長期責任。", "如果牽涉暴力、控制或安全風險，財務安排需要和安全計畫一起看。"],
    firstSteps: ["先列出目前一定要做的決定，避免每件事同時處理。", "把家庭共同支出、個人支出和一次性支出分開。", "若擔心談錢會衝突，先用問問 AI 或諮詢整理說法。"],
    learnMore: ["家庭談錢前可以先準備什麼", "育兒、租屋與搬家常見財務壓力", "重大變故後如何先穩住生活安排"],
    actions: [
      { href: "/ask-ai", label: "先整理怎麼開口", helper: "先把想說的話整理成比較不容易衝突的版本。", icon: Bot },
      { href: "/content", label: "看相關內容", helper: "用文章、Podcast 或專欄找到相近的經驗。", icon: BookOpen },
      { href: externalLinks.onlineConsultation, label: "找人一起整理", helper: "需要第三方陪你梳理決定順序時，可以申請諮詢。", icon: HandCoins },
    ],
  },
]

const guidanceCards = [
  {
    title: "這一區先給一般民眾",
    description: "不用先知道自己該用哪個服務，也不用一開始輸入完整金額或個資。先選一個最像現在狀況的情境，再決定要檢測、用工具、看內容或找人討論。",
  },
  {
    title: "不確定也可以先模糊描述",
    description: "如果狀況同時牽涉工作、債務、照顧或家庭變故，可以先選最有壓力的那一項；後面仍然可以改用問問 AI 或諮詢一起整理。",
  },
]

export default function ScenariosPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-primary">情境專區</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl text-balance">
                先從生活狀況出發，再找到適合的下一步
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                這裡不是要使用者先懂平台功能，而是用台灣家庭常見的財務壓力、照顧、工作、詐騙與家庭變故，幫一般民眾快速找到入口。
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm">
              <p className="font-medium text-foreground">如果不確定自己是哪一類</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                可以先選最接近的狀況，或直接用問問 AI 把問題整理成下一步。選錯也沒有關係。
              </p>
              <Link
                href="/ask-ai"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                不確定，先問問看 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {scenarioSections.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className="group rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm transition-all hover:border-primary/35 hover:bg-card"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-primary">{item.category}</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-foreground">{item.title}</p>
              </Link>
            )
          })}
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {guidanceCards.map((card) => (
            <Card key={card.title} className="border-border/80 bg-card/85">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="space-y-8">
          {scenarioSections.map((item) => {
            const Icon = item.icon
            const primaryAction = item.actions[0]
            const PrimaryActionIcon = primaryAction.icon
            const secondaryActions = item.actions.slice(1)
            return (
              <section
                key={item.id}
                id={item.id}
                className="scroll-mt-24 rounded-3xl border border-border/80 bg-card/70 p-4 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.accent}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{item.category}</p>
                      <h2 className="mt-1 text-2xl font-semibold leading-tight text-foreground">{item.title}</h2>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {item.intro}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={primaryAction.href}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {primaryAction.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary">
                      <PrimaryActionIcon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-primary">建議先做</p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{primaryAction.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{primaryAction.helper}</p>
                    <Link
                      href={primaryAction.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      前往處理 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-foreground">現在先完成這兩件事</h3>
                    <ul className="space-y-3">
                      {item.firstSteps.slice(0, 2).map((step) => (
                        <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
                            {item.firstSteps.indexOf(step) + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">很多人是從這裡開始的</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.situations.map((situation) => (
                        <span
                          key={situation}
                          className="rounded-full bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                        >
                          {situation}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">容易忽略的是</h3>
                    <ul className="space-y-2">
                      {item.overlooked.slice(0, 2).map((point) => (
                        <li key={point} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <details className="mt-5 rounded-2xl border border-border/70 bg-background/70 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">
                    想看更多選項與延伸內容
                  </summary>
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">想多了解可以看看</h3>
                      <ul className="space-y-2">
                        {item.learnMore.map((topic) => (
                          <li key={topic} className="text-sm leading-relaxed text-muted-foreground">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {secondaryActions.map((action) => {
                      const ActionIcon = action.icon
                      return (
                        <Link
                          key={action.label}
                          href={action.href}
                          className="group rounded-2xl border border-border/70 bg-background/75 p-4 transition-all hover:border-primary/35 hover:bg-background"
                        >
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                            <ActionIcon className="h-5 w-5" />
                          </div>
                          <p className="font-semibold text-foreground">{action.label}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{action.helper}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                            前往 <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      )
                    })}
                    </div>
                  </div>
                </details>
              </section>
            )
          })}
        </div>

        <section className="mt-8 rounded-3xl border border-border/80 bg-card/80 p-5 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary">下一步怎麼選</p>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">從情境進來後，先接一個低壓入口</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                情境專區的角色是幫一般民眾先說出「我現在比較像哪種狀況」。進來之後，不一定要立刻做完整規劃，可以先用檢測、問問 AI 或免費諮詢慢慢整理。
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/assessment"
                className="rounded-2xl border border-border/80 bg-background/75 p-4 transition-all hover:border-primary/35"
              >
                <p className="font-semibold text-foreground">先測一下</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">用 2 到 3 分鐘看目前比較需要注意什麼。</p>
              </Link>
              <Link
                href="/ask-ai"
                className="rounded-2xl border border-border/80 bg-background/75 p-4 transition-all hover:border-primary/35"
              >
                <p className="font-semibold text-foreground">先問問看</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">用模糊描述整理壓力、風險與下一步。</p>
              </Link>
              <Link
                href={externalLinks.onlineConsultation}
                className="rounded-2xl border border-border/80 bg-background/75 p-4 transition-all hover:border-primary/35"
              >
                <p className="font-semibold text-foreground">找人一起整理</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">需要第三方陪你釐清時，再申請免費諮詢。</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
