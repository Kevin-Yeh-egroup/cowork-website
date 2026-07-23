"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const featuredTags = [
  { id: "unstable-income", label: "收入不穩" },
  { id: "first-job", label: "剛開始工作" },
  { id: "career-transition", label: "正在轉職" },
  { id: "credit-card-revolving", label: "信用卡循環" },
  { id: "late-payment", label: "已經遲繳" },
  { id: "financial-anxiety", label: "金錢焦慮" },
  { id: "childcare", label: "育兒與教育" },
  { id: "family-illness", label: "家人生病" },
  { id: "moving-renting", label: "搬家與租屋" },
  { id: "investment-fraud", label: "投資詐騙" },
]

const tagGroups = [
  {
    title: "工作與收入",
    tags: [
      { id: "first-job", label: "剛開始工作" },
      { id: "unstable-income", label: "收入不穩" },
      { id: "career-transition", label: "正在轉職" },
      { id: "recently-unemployed", label: "最近失業" },
      { id: "side-income", label: "斜槓與兼職" },
      { id: "retirement-prep", label: "準備退休" },
    ],
  },
  {
    title: "債務與壓力",
    tags: [
      { id: "credit-card-revolving", label: "信用卡循環" },
      { id: "personal-loan", label: "信貸壓力" },
      { id: "mortgage-car-loan", label: "房貸與車貸" },
      { id: "late-payment", label: "已經遲繳" },
      { id: "enforcement", label: "強制執行" },
      { id: "financial-anxiety", label: "金錢焦慮" },
    ],
  },
  {
    title: "詐騙與風險",
    tags: [
      { id: "investment-fraud", label: "投資詐騙" },
      { id: "shopping-fraud", label: "網購詐騙" },
      { id: "romance-fraud", label: "感情詐騙" },
      { id: "job-fraud", label: "求職詐騙" },
      { id: "warning-account", label: "警示帳戶" },
      { id: "personal-data-safety", label: "個資安全" },
    ],
  },
  {
    title: "健康與照顧",
    tags: [
      { id: "self-illness", label: "自己生病" },
      { id: "family-illness", label: "家人生病" },
      { id: "major-illness", label: "重大傷病" },
      { id: "long-term-care", label: "長期照顧" },
      { id: "caregiving-leave", label: "照顧假" },
      { id: "medical-expense", label: "醫療費用" },
    ],
  },
  {
    title: "家庭與變動",
    tags: [
      { id: "marriage-family", label: "結婚與家庭" },
      { id: "childcare", label: "育兒與教育" },
      { id: "single-parent", label: "單親家庭" },
      { id: "relationship-change", label: "關係變動" },
      { id: "moving-renting", label: "搬家與租屋" },
      { id: "bereavement-change", label: "親人離世" },
    ],
  },
]

const tags = [{ id: "all", label: "全部" }, ...tagGroups.flatMap((group) => group.tags)]

const articles = [
  {
    id: "first-salary-budget",
    title: "剛開始工作，第一份薪水要先分成哪幾筆？",
    excerpt: "從生活費、預備金、保險與還款開始整理。",
    tag: "first-job",
    type: "文章",
    readTime: "5 分鐘",
    href: "https://www.familyfinhealth.com/knowledge-base/first-salary-budget",
  },
  {
    id: "first-work-rights",
    title: "第一份工作報到前，可以先確認哪些權益？",
    excerpt: "薪資、勞健保、特休與加班紀錄先抓住。",
    tag: "first-job",
    type: "文章",
    readTime: "4 分鐘",
    href: "https://www.familyfinhealth.com/knowledge-base/first-work-rights",
  },
  {
    id: "unstable-income-work",
    title: "工作一直做不久，收入也不穩，該怎麼辦？",
    excerpt: "先把固定支出、最低生活需求與收入波動分開看。",
    tag: "unstable-income",
    type: "文章",
    readTime: "6 分鐘",
    href: "/content/articles/unstable-income-work",
  },
  {
    id: "unstable-income-injury",
    title: "工作容易受傷，收入中斷怎麼辦？高風險工作者的家庭保障準備",
    excerpt: "先整理收入中斷時可以使用的保障與資源。",
    tag: "unstable-income",
    type: "文章",
    readTime: "5 分鐘",
    href: "https://www.familyfinhealth.com/knowledge-base/HZeDCfTTaPHw8AozPVIg",
  },
  {
    id: "career-transition-skill",
    title: "轉職前要學什麼？技能提升、課程選擇一次整理",
    excerpt: "先看職缺需求、課程成本與轉職期間的生活安排。",
    tag: "career-transition",
    type: "文章",
    readTime: "7 分鐘",
    href: "https://www.familyfinhealth.com/knowledge-base/O2lUJet0SneyX6uX40HQDA",
  },
  {
    id: "career-transition-trend",
    title: "想換工作卻不知道往哪走？從職缺趨勢找到下一份工作的方向",
    excerpt: "用職缺趨勢和自身條件，慢慢縮小選擇範圍。",
    tag: "career-transition",
    type: "文章",
    readTime: "6 分鐘",
    href: "https://www.familyfinhealth.com/knowledge-base/ZTtoqLb0RtKVyybXgk9vhQ",
  },
  {
    id: "credit-card-cycle",
    title: "信用卡循環利息要怎麼看，才不會只看最低應繳？",
    excerpt: "從帳單數字看還款時間、利息與每月壓力。",
    tag: "credit-card-revolving",
    type: "文章",
    readTime: "5 分鐘",
    href: "https://www.familyfinhealth.com/content/articles/credit-card-cycle",
  },
  {
    id: "late-payment-order",
    title: "已經遲繳時，先處理哪一筆比較好？",
    excerpt: "用利率、催收狀態與生活支出排出處理順序。",
    tag: "late-payment",
    type: "文章",
    readTime: "6 分鐘",
    href: "https://www.familyfinhealth.com/content/articles/late-payment-order",
  },
  {
    id: "investment-fraud-check",
    title: "看到高報酬投資邀約時，可以先檢查哪幾件事？",
    excerpt: "把常見話術、匯款要求與風險訊號先拆開。",
    tag: "investment-fraud",
    type: "文章",
    readTime: "4 分鐘",
    href: "https://www.familyfinhealth.com/content/articles/investment-fraud-check",
  },
  {
    id: "care-cost",
    title: "家人生病後，照顧費用要怎麼先估？",
    excerpt: "先整理醫療、交通、照顧人力與收入中斷風險。",
    tag: "family-illness",
    type: "文章",
    readTime: "6 分鐘",
    href: "https://www.familyfinhealth.com/content/articles/care-cost",
  },
  {
    id: "child-education-cost",
    title: "孩子長大後，教育費用可以怎麼慢慢準備？",
    excerpt: "不用一次存到位，先把近期和長期支出分開。",
    tag: "childcare",
    type: "文章",
    readTime: "5 分鐘",
    href: "https://www.familyfinhealth.com/content/articles/child-education-cost",
  },
]

export default function ArticlesPage() {
  const [activeTag, setActiveTag] = useState("unstable-income")
  const [keyword, setKeyword] = useState("")

  const filteredArticles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesTag = activeTag === "all" || article.tag === activeTag
      const matchesKeyword =
        !normalizedKeyword ||
        `${article.title} ${article.excerpt}`.toLowerCase().includes(normalizedKeyword)

      return matchesTag && matchesKeyword
    })
  }, [activeTag, keyword])

  const activeTagLabel = tags.find((tag) => tag.id === activeTag)?.label ?? "全部"
  const tagButtonClass = (tagId: string) =>
    `rounded-full px-4 py-2 text-sm transition-colors ${
      activeTag === tagId
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    }`

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">知識庫</p>
          <h1 className="mb-3 text-3xl font-bold text-foreground">看看文章</h1>
          <p className="max-w-3xl text-muted-foreground">
            直接用生活情境找文章。可以搜尋關鍵字，也可以從常見情境開始看，先找到和自己現在最接近的內容。
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜尋文章、情境或你正在煩惱的事"
              className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-foreground">常用情境</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setActiveTag("all")} className={tagButtonClass("all")}>
                全部
              </button>
              {featuredTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setActiveTag(tag.id)}
                  className={tagButtonClass(tag.id)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <details className="mt-5 rounded-2xl border border-border bg-background p-4">
            <summary className="cursor-pointer list-none font-medium text-foreground">
              展開更多情境
              <span className="ml-2 text-sm font-normal text-muted-foreground">依生活課題分類查看全部小情境</span>
            </summary>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {tagGroups.map((group) => (
                <div key={group.title} className="rounded-xl border border-border p-4">
                  <p className="mb-3 font-semibold text-foreground">{group.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <button
                        key={`${group.title}-${tag.id}`}
                        type="button"
                        onClick={() => setActiveTag(tag.id)}
                        className={tagButtonClass(tag.id)}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{activeTagLabel}文章</h2>
              <p className="mt-2 text-sm text-muted-foreground">點選文章後，可以繼續看延伸問答、相關工具與下一步資源。</p>
            </div>
            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {filteredArticles.length} 篇內容
            </span>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={article.href} className="group">
                  <Card className="h-full border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{article.type}</span>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">{article.readTime}</span>
                      </div>
                      <h3 className="mb-3 font-semibold leading-snug text-foreground group-hover:text-primary">
                        {article.title}
                      </h3>
                      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        閱讀文章 <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <p className="font-medium text-foreground">目前沒有符合的文章</p>
              <p className="mt-2 text-sm text-muted-foreground">可以換一個標籤，或用右下角問問 AI 找方向。</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
