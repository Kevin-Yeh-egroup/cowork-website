import Link from "next/link"
import { ArrowRight, CalendarDays, Mail, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const newsletters = [
  {
    volume: "Vol.30",
    title: "很多大人，也是一邊亂一邊長大的",
    date: "2026年7月29日",
    tag: "生活整理",
    href: "https://www.familyfinhealth.com/popular",
  },
  {
    volume: "Vol.29",
    title: "理財習慣，其實也是生活習慣",
    date: "2026年7月22日",
    tag: "收支習慣",
    href: "https://www.familyfinhealth.com/popular",
  },
  {
    volume: "Vol.28",
    title: "有些錢，其實花在「不好意思拒絕」",
    date: "2026年7月15日",
    tag: "關係與金錢",
    href: "https://www.familyfinhealth.com/popular",
  },
  {
    volume: "Vol.27",
    title: "真正的財務安全感，不只是帳戶裡的數字",
    date: "2026年7月8日",
    tag: "安全感",
    href: "https://www.familyfinhealth.com/popular",
  },
  {
    volume: "Vol.26",
    title: "第一次當大人，很多事情都沒有標準答案",
    date: "2026年7月1日",
    tag: "剛開始工作",
    href: "https://www.familyfinhealth.com/popular",
  },
]

const newsletterTopics = ["全部", "收入不穩", "剛開始工作", "信用卡循環", "家庭照顧", "租屋搬家", "詐騙防禦"]

export default function NewslettersPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">知識與內容</p>
          <h1 className="mb-3 text-3xl font-bold text-foreground">電子報</h1>
          <p className="max-w-3xl text-muted-foreground">
            每一期把生活裡常見的財務課題整理成一封信。可以看最新一期，也可以回頭翻找過往主題。
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="搜尋電子報標題、期數或你正在煩惱的事"
              className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">常用主題</p>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">共 30 則</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {newsletterTopics.map((topic, index) => (
                <button
                  key={topic}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {newsletters.map((newsletter, index) => (
            <Link key={newsletter.volume} href={newsletter.href} className="group block">
              <Card className="border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="mb-2 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {index === 0 ? "最新一期" : newsletter.tag}
                      </span>
                      <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                        好理生活週報｜{newsletter.volume}｜{newsletter.title}
                      </h2>
                      <span className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {newsletter.date}
                      </span>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-all group-hover:gap-2 sm:self-center">
                    閱讀這期 <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
