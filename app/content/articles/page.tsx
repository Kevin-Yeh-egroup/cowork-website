"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { id: "all", label: "全部" },
  { id: "resilience", label: "財務韌性" },
  { id: "anxiety", label: "焦慮" },
  { id: "fraud", label: "詐騙" },
  { id: "debt", label: "債務" },
  { id: "budget", label: "收支" },
  { id: "resources", label: "社會資源" },
]

const articles = [
  {
    id: 1,
    title: "什麼是財務韌性？為什麼它很重要？",
    excerpt: "了解財務韌性的概念，以及如何建立自己的財務緩衝能力...",
    category: "resilience",
    readTime: "5 分鐘",
  },
  {
    id: 2,
    title: "面對財務焦慮，你可以這樣做",
    excerpt: "當財務壓力影響到生活時，這些方法可以幫助你...",
    category: "anxiety",
    readTime: "4 分鐘",
  },
  {
    id: 3,
    title: "常見詐騙手法大公開",
    excerpt: "認識各種詐騙手法，保護自己和家人的財務安全...",
    category: "fraud",
    readTime: "6 分鐘",
  },
  {
    id: 4,
    title: "債務整合：什麼時候該考慮？",
    excerpt: "當你有多筆債務時，債務整合可能是一個選項...",
    category: "debt",
    readTime: "5 分鐘",
  },
  {
    id: 5,
    title: "建立記帳習慣的 5 個技巧",
    excerpt: "記帳不需要很複雜，這些簡單的技巧讓你輕鬆開始...",
    category: "budget",
    readTime: "4 分鐘",
  },
  {
    id: 6,
    title: "你可能不知道的社會資源",
    excerpt: "許多政府和民間資源可以在你需要時提供協助...",
    category: "resources",
    readTime: "5 分鐘",
  },
  {
    id: 7,
    title: "緊急預備金：從零開始建立",
    excerpt: "即使收入有限，也能一步步建立緊急預備金...",
    category: "resilience",
    readTime: "5 分鐘",
  },
  {
    id: 8,
    title: "如何與家人談論財務問題",
    excerpt: "財務問題常常影響家庭關係，這樣溝通更有效...",
    category: "anxiety",
    readTime: "4 分鐘",
  },
]

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">文章</h1>
          <p className="text-muted-foreground">探索財務知識，找到適合你的解決方案</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/content/articles/${article.id}`} className="group">
              <Card className="h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                  <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    閱讀文章 <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
