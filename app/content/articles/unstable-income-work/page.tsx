import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardList,
  MessageCircle,
  Sparkles,
  WalletCards,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const relatedArticles = [
  {
    title: "工作容易受傷，收入中斷怎麼辦？高風險工作者的家庭保障準備",
    href: "https://www.familyfinhealth.com/knowledge-base/HZeDCfTTaPHw8AozPVIg",
  },
  {
    title: "工作意外受傷，薪水中斷怎麼辦？職業災害申請流程與保障整理",
    href: "https://www.familyfinhealth.com/knowledge-base/0qmVvepDfQa41xbutQRNiQ",
  },
  {
    title: "薪水不高、生活壓力大，為什麼更容易吃得不健康？",
    href: "https://www.familyfinhealth.com/knowledge-base/0119We4fSzWr1OiArgeELg",
  },
]

const nextActions = [
  {
    title: "先記一週收入與支出",
    description: "不用一次整理完整，先用記帳助理記下這週收入、餐費、交通和固定支出。",
    href: "/toolbox/accounting",
    icon: WalletCards,
    action: "開始記帳",
  },
  {
    title: "看月報表裡的現金流",
    description: "如果已經有幾筆紀錄，可以用財務月報表看收入波動時，生活費是否還撐得住。",
    href: "/toolbox/monthly-report",
    icon: Calculator,
    action: "查看月報表",
  },
  {
    title: "收入壓力很大時一起談談",
    description: "若租金、債務或家用已經壓得喘不過氣，可以預約免費諮詢，一起排出先後順序。",
    href: "/online-consultation",
    icon: MessageCircle,
    action: "預約諮詢",
  },
]

const faqs = [
  {
    question: "收入不穩時，我應該先記帳還是先找工作？",
    answer:
      "兩件事可以一起做，但順序上可以先記下最低生活費和固定支出。這樣在找工作或接案時，會比較知道自己每個月至少需要多少收入，才不會只憑焦慮做決定。",
  },
  {
    question: "如果每個月收入差很多，財務月報表還有用嗎？",
    answer:
      "有用。月報表不只是看單月好不好，而是幫你看收入波動、固定支出和債務還款之間的關係。收入不穩的人更需要知道低收入月份能撐多久。",
  },
  {
    question: "什麼情況下比較適合預約諮詢？",
    answer:
      "如果已經開始遲繳、靠借款補生活費，或每個月都不知道先付哪一筆，建議不要自己硬撐，可以找人一起把收入、支出和債務順序排出來。",
  },
]

export default function UnstableIncomeArticlePage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">收入不穩</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">工作與收入</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">6 分鐘</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
            工作一直做不久，收入也不穩，該怎麼辦？
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            收入不穩時，最辛苦的常常不是某一個月少賺，而是不知道下個月能不能安心安排生活。這篇先陪你把問題拆小一點，從能掌握的數字開始。
          </p>
        </header>

        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 text-base leading-8 text-muted-foreground shadow-sm">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">先不要急著責怪自己</h2>
            <p>
              工作做不久、收入時多時少，背後可能跟工時、身體狀況、家庭照顧、交通距離、職場適應或產業特性有關。
              如果只用「我是不是不夠努力」來看，很容易忽略真正需要被處理的壓力來源。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">先看三個數字</h2>
            <ul className="space-y-3">
              <li>每個月最低需要多少生活費：房租、餐費、交通、保險、家用與債務還款。</li>
              <li>收入最低的月份大約是多少：用比較保守的月份來安排，生活會比較不容易失控。</li>
              <li>手邊能撐多久：存款、可動用資金、家人支持或可申請的資源。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">接著排出處理順序</h2>
            <p>
              如果收入短期內不容易穩定，可以先把支出分成「一定要付」、「可以延後」、「可以調整」三類。
              同時也要留意債務是否已經開始遲繳，或是否靠信用卡、親友借款撐生活。這些訊號代表需要更早找人一起整理。
            </p>
          </section>

          <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="font-semibold text-foreground">先做一件小事就好</p>
            <p className="mt-2">
              今天不用把人生全部規劃好。先記下最近一週收入和必要支出，會比只在腦中擔心更容易看見下一步。
            </p>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">延伸問答</h2>
              <p className="mt-1 text-sm text-muted-foreground">看完文章後，可能還會想先釐清的幾個問題。</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-border bg-background p-5">
                <summary className="cursor-pointer list-none font-semibold text-foreground">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-primary transition group-open:rotate-90">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <span className="rounded-full bg-primary/10 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">看完這篇，你可以接著做</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                如果這篇很像你的狀況，可以先從一個比較容易開始的行動做起。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {nextActions.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40 hover:shadow-md"
                >
                  <Icon className="mb-4 h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {item.action} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">也可以繼續看</h2>
          </div>

          <div className="space-y-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition hover:border-primary/40"
              >
                <span className="font-medium leading-relaxed text-foreground">{article.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ClipboardList className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">回到「收入不穩」情境</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  想看這個情境下的常見問題、提醒和工具，可以回到小情境頁繼續整理。
                </p>
              </div>
            </div>
            <Link
              href="/life-topics/work-income/unstable-income"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              回到情境頁 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
