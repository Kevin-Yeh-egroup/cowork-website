import Link from "next/link"
import { ArrowRight, CheckCircle2, HeartHandshake, LockKeyhole, MessageCircleHeart, TimerReset } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const situations = [
  "每個月很努力，卻還是存不下來",
  "收支越來越亂，不知道從哪裡整理",
  "債務或貸款開始影響生活",
  "家裡突然有大筆支出或變故",
  "被詐騙後，不知道下一步怎麼辦",
  "很焦慮，但不知道該找誰聊",
]

const supportItems = [
  {
    title: "先釐清狀況",
    description: "一起整理目前的收入、支出、壓力來源與最需要優先處理的事情。",
  },
  {
    title: "找到下一步方向",
    description: "陪你找出現在做得到的調整方向，而不是只給一套標準答案。",
  },
  {
    title: "連結適合資源",
    description: "依照你的狀況，討論可使用的工具、資源或後續協助。",
  },
]

const features = [
  {
    title: "專業服務",
    description: "由專業社工提供個人化財務諮詢服務。",
    icon: HeartHandshake,
  },
  {
    title: "彈性預約",
    description: "24 小時線上預約，約 10 個工作天內回覆。",
    icon: TimerReset,
  },
  {
    title: "隱私保護",
    description: "嚴格保護個人隱私，讓你可以安心說明狀況。",
    icon: LockKeyhole,
  },
  {
    title: "持續支援",
    description: "提供後續追蹤與持續的專業建議。",
    icon: MessageCircleHeart,
  },
]

const steps = [
  {
    title: "填寫線上諮詢表單",
    description: "簡單說明你的財務狀況、目前困擾與希望討論的事情。",
  },
  {
    title: "補充相關資料",
    description: "視情況整理收入、支出、債務、帳單或其他有助評估的資料。",
  },
  {
    title: "專業人員審核申請",
    description: "我們會先確認申請內容，約 10 個工作天內回覆與安排。",
  },
  {
    title: "安排諮詢時間",
    description: "確認適合的諮詢時段，並透過簡訊或 Email 通知。",
  },
  {
    title: "參與線上諮詢會議",
    description: "使用 Google Meet 進行諮詢，一起整理狀況與下一步。",
  },
]

export default function FreeConsultationPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 grid gap-5 rounded-3xl border border-border bg-card/80 p-5 shadow-sm lg:grid-cols-[1fr_320px] lg:items-center lg:p-7">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">免費諮詢</p>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              財務諮詢不只是談錢，而是陪你把狀況整理清楚
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              不用一次把所有事情都說清楚，先從現在最困擾的事情開始。專業人員會協助你釐清壓力來源、可行選項與下一步。
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/online-consultation/apply">
                  我想找人聊聊 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="border-primary/20 bg-primary/10">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-primary">只要其中一項讓你有感，都可以來聊聊</p>
              <div className="mt-3 space-y-2.5">
                {situations.map((situation) => (
                  <div key={situation} className="flex gap-2 text-sm leading-snug text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{situation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-border bg-card/75 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">服務特色</h2>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              申請後會由專人確認狀況，依照你目前的需要安排合適的諮詢與後續支持。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <div key={feature.title} className="rounded-2xl border border-border/70 bg-background/75 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card/75 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">諮詢流程</h2>
            <div className="mt-4 grid gap-3">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-3 rounded-2xl border border-border/70 bg-background/75 p-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">{step.title}</span>
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">{step.description}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-3xl border border-border bg-card/75 p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">我們怎麼陪你整理？</h2>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                諮詢不是一次把所有問題解完，而是先把壓力拆開，找到現在可以開始的方向。
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/online-consultation/apply">前往申請</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {supportItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-background/75 p-4">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
