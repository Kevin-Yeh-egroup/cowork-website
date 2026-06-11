import type { Metadata } from "next"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Library,
  Mic,
  NotebookTabs,
  ShieldCheck,
} from "lucide-react"
import { externalLinks } from "@/lib/external-links"

export const metadata: Metadata = {
  title: "工作支持 - 好理家在",
  description: "提供社工與助人工作者使用的會談整理、家庭財務風險整理、議題處理工具、知識庫與專業工作支持入口。",
}

type ToolGroup = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  items: {
    title: string
    description: string
    href?: string
    steps?: string[]
  }[]
}

const toolGroups: ToolGroup[] = [
  {
    id: "transcript",
    title: "會談整理與逐字稿",
    description: "協助把會談內容整理成可追蹤、可回顧的工作資料。",
    icon: Mic,
    items: [
      { title: "語音轉文字", description: "將會談語音轉成文字紀錄。", href: externalLinks.voiceToText },
      { title: "AI 摘要", description: "測試入口：後續可放會談摘要、重點整理與追蹤事項。", href: "/social-worker-tools#transcript" },
      { title: "摘要模板", description: "測試入口：後續可放摘要格式、紀錄欄位與範例。", href: "/social-worker-tools#transcript" },
    ],
  },
  {
    id: "risk",
    title: "家庭財務風險整理",
    description: "用快篩與整理表協助社工看見家庭財務風險輪廓。",
    icon: ShieldCheck,
    items: [
      { title: "財務風險快篩", description: "協助初步判斷個案財務壓力與風險。", href: externalLinks.financeScreening },
    ],
  },
  {
    id: "issue-tools",
    title: "議題處理工具",
    description: "參考正式站社工工作台的情境懶人包，用常見議題先帶社工進入評估流程。",
    icon: FileText,
    items: [
      {
        title: "債務處理",
        description: "債務不再是燙手山芋",
        steps: [
          "上傳逐字稿與文件：訪談紀錄、個案資料或掃描文件",
          "進行財務健檢：債務盤點、財務月報與財務風險快篩",
          "接續知識庫、債務試算工具或線上諮詢",
        ],
      },
      {
        title: "詐騙預防",
        description: "遇到詐騙即時止損",
        steps: [
          "整理可疑訊息、匯款紀錄、對方帳號與往來管道",
          "辨識是否有保證獲利、代操、OTP、帳密或轉帳壓力",
          "協助連到 165、銀行或官方窗口查證與停損",
        ],
      },
      {
        title: "財務盤點",
        description: "快速掌握財務全貌",
        steps: [
          "整理收入、支出、債務、急迫需求與可動用資源",
          "建立月報或收支輪廓，看見目前壓力來源",
          "判斷風險等級，再接財務風險快篩或後續支持",
        ],
      },
    ],
  },
  {
    id: "knowledge",
    title: "社工知識庫",
    description: "把可分享給個案或可供社工準備的內容集中。",
    icon: Library,
    items: [
      { title: "看看文章", description: "閱讀與家庭財務、債務、詐騙與照顧相關文章。", href: "/content/articles" },
      { title: "多多益善專欄", description: "查看專欄文章與實務案例。", href: "/content/column" },
      { title: "Podcast", description: "用音頻理解財務社工與家庭議題。", href: "/content/podcast" },
    ],
  },
  {
    id: "journal",
    title: "季刊",
    description: "測試入口：後續可放專業整理、案例回顧或季刊下載。",
    icon: BookOpen,
    items: [
      { title: "季刊內容", description: "測試文字，待正式資料補上。", href: "/social-worker-tools#journal" },
    ],
  },
  {
    id: "support",
    title: "專業工作支持",
    description: "連到課程、諮詢轉介與工作支持資源。",
    icon: NotebookTabs,
    items: [
      { title: "活動與課程", description: "查看社工與助人工作者課程。", href: "/events#social-worker" },
      { title: "個案轉介", description: "協助個案申請免費諮詢。", href: "/online-consultation/referral" },
      { title: "問問 AI", description: "測試入口：先整理問題或會談摘要。", href: "/ask-ai" },
    ],
  },
]

export default function SocialWorkerToolsPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-primary">工作支持</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                社工與助人工作者的工作支持入口
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                依照平台架構，社工現場會快速用到的支持資源集中在這裡；登入後的社工工作台則負責呈現最近工作、個案歷程與使用紀錄。
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm">
              <FileText className="mb-3 h-6 w-6 text-primary" />
              <p className="font-medium text-foreground">議題處理工具參考情境懶人包</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                名稱保留為議題處理工具；內容先用債務、詐騙、財務盤點三個情境，呈現社工可以怎麼開始評估。
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {toolGroups.map((group) => {
            const Icon = group.icon

            return (
              <section
                key={group.id}
                id={group.id}
                className="scroll-mt-24 rounded-3xl border border-border/80 bg-card/75 p-5 shadow-sm sm:p-6"
              >
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{group.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) =>
                    item.href ? (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="group rounded-2xl border border-border/70 bg-background/75 p-4 transition-all hover:border-primary/35 hover:bg-background"
                      >
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                          前往 <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ) : (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-border/70 bg-background/75 p-4"
                      >
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        {item.steps && (
                          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
                            {item.steps.map((step, index) => (
                              <li key={step} className="flex gap-2">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        )}
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          可作為會談前快速入口，後續再接快篩、知識庫、轉介或正式諮詢。
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
