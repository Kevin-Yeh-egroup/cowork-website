"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Heart,
  ShieldAlert,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const emptyStateActions = [
  {
    href: "/assessment",
    title: "做檢測",
    description: "了解你的財務狀況",
    icon: ClipboardCheck,
  },
  {
    href: "/toolbox/accounting",
    title: "開始記帳",
    description: "追蹤你的收支",
    icon: Calculator,
  },
]

const profileStats = [
  { label: "財務韌性", value: "100 分", tone: "text-primary" },
  { label: "已訂閱文章", value: "40 篇", tone: "text-foreground" },
  { label: "最後更新", value: "2026/04/15", tone: "text-foreground" },
]

const overviewTabs = ["總覽", "財務韌性", "詐騙防禦能力", "財務焦慮", "夢想達成財務管理"]

const financeHighlights = [
  {
    title: "財務韌性",
    value: "100 分",
    description: "較上次 +0 分",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "詐騙防禦能力",
    value: "待檢測",
    description: "完成檢測後會顯示風險提醒",
    icon: ShieldAlert,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "財務焦慮",
    value: "待檢測",
    description: "了解金錢壓力對生活的影響",
    icon: Heart,
    color: "bg-accent/30 text-accent-foreground",
  },
]

const monthlyBadges = [
  {
    month: "三月",
    title: "完成財務檢測",
    description: "完成財務韌性檢測並查看建議",
    completed: true,
    details: ["財務韌性檢測：綠燈", "財務焦慮檢測：已完成", "下一步建議：已閱讀"],
  },
  {
    month: "四月",
    title: "記帳不中斷",
    description: "本月完成 7 天以上記帳",
    completed: true,
    details: ["記帳紀錄：連續 7 天", "支出盤點：綠燈", "訂閱文章：閱讀 3 篇"],
  },
  {
    month: "五月",
    title: "訂閱學習",
    description: "閱讀 3 篇以上訂閱文章",
    completed: false,
    details: ["訂閱文章：1 / 3 篇", "詐騙防禦檢測：未完成", "本月燈號：黃燈"],
  },
  {
    month: "六月",
    title: "目標更新",
    description: "更新你的財務目標與下一步",
    completed: false,
    details: ["財務目標：待更新", "本月檢測：尚未開始", "本月燈號：未取得"],
  },
]

const quickTopics = ["課程推薦", "關係與人際", "親密關係", "信貸", "同志領域", "詐騙", "手小孩領域", "關係人失蹤/死亡", "親子領域", "專案知能"]

const sections = [
  {
    title: "我的檢測紀錄",
    href: "/assessment",
    icon: ClipboardCheck,
  },
  {
    title: "我的財務變化",
    href: "/toolbox/accounting",
    icon: TrendingUp,
  },
  {
    title: "我的工具",
    href: "/toolbox",
    icon: Wrench,
  },
  {
    title: "我的訂閱文章",
    href: "/content/articles",
    icon: BookOpen,
  },
]

export default function PersonalCenterPage() {
  const [activeBadge, setActiveBadge] = useState<string | null>(null)

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/20 p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">個人中心</h1>
              <p className="text-muted-foreground mb-6">集中管理你的財務旅程、更新進度與重要提醒。</p>
              <div className="rounded-2xl bg-card/90 border border-border p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">一般民眾專屬</p>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">開始你的財務旅程</h2>
                    <p className="text-muted-foreground">
                      從檢測或記帳開始，我們會幫你追蹤進度，逐步整理財務狀態。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:w-56">
                    {emptyStateActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button key={action.href} asChild variant="secondary" className="justify-start">
                          <Link href={action.href}>
                            <Icon className="h-4 w-4" />
                            {action.title}
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border bg-card/95 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">一般使用者</h2>
                    <p className="text-sm text-muted-foreground">member@example.com</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {profileStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between rounded-full bg-secondary/60 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className={`font-semibold ${stat.tone}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex gap-6 overflow-x-auto border-b border-border px-5">
            {overviewTabs.map((tab, index) => (
              <button
                key={tab}
                className={`shrink-0 border-b-2 py-4 text-sm font-medium ${
                  index === 0 ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {financeHighlights.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="border-border">
                    <CardContent className="p-5">
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-foreground mb-3">{item.title}</p>
                      <p className="text-3xl font-bold text-foreground mb-2">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">月度獎章</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">呈現每個月完成的財務整理進度。</p>
                  </div>
                  <span className="rounded-full bg-card px-3 py-1 text-sm font-medium text-primary">
                    已完成 2 / 4
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {monthlyBadges.map((badge) => (
                    <button
                      key={badge.month}
                      type="button"
                      onClick={() => setActiveBadge(activeBadge === badge.month ? null : badge.month)}
                      aria-expanded={activeBadge === badge.month}
                      className={`rounded-2xl border p-4 ${
                        badge.completed ? "border-primary/30 bg-card" : "border-border bg-card/60 opacity-70"
                      } group relative text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50`}
                    >
                      <span className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-semibold ${
                        badge.completed ? "border-primary/30 bg-primary text-primary-foreground" : "border-border bg-secondary text-muted-foreground"
                      }`}>
                        {badge.month}
                      </span>
                      <span className="block font-semibold text-foreground">{badge.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{badge.description}</span>
                      <span className={`${activeBadge === badge.month ? "block" : "hidden"} absolute left-3 right-3 top-full z-30 mt-2 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-lg group-hover:block group-focus-visible:block`}>
                        <span className="mb-2 block text-xs font-medium text-muted-foreground">完成項目與燈號</span>
                        <span className="block space-y-2">
                          {badge.details.map((detail) => (
                            <span key={detail} className="block rounded-lg bg-secondary/60 px-3 py-2 text-xs text-foreground">
                              {detail}
                            </span>
                          ))}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Link href="/toolbox/accounting" className="group block rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-background/20 px-3 py-1 text-xs font-medium mb-3">全新上線</span>
                  <h2 className="text-xl font-semibold mb-2">財務生活記帳助理</h2>
                  <p className="text-sm text-primary-foreground/85">
                    AI 輔助的個人記帳體驗，自動分析收支模式，讓財務管理更輕鬆。
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">我的訂閱文章</h2>
                    <p className="text-sm text-muted-foreground">已訂閱 40 個標籤，顯示最新 8 篇文章</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Bell className="h-4 w-4" />
                    管理訂閱
                  </Button>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-sm font-medium text-foreground mb-3">快速查看你關注的主題</p>
                  <div className="flex flex-wrap gap-2">
                    {quickTopics.map((topic) => (
                      <span key={topic} className="rounded-full bg-card px-3 py-1 text-xs text-foreground">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section) => {
              const Icon = section.icon
              return (
                  <Link key={section.title} href={section.href} className="group">
                    <Card className="h-full border-border transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          查看 <ArrowRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
              )
            })}
          </div>
          </div>
        </section>
      </div>
    </div>
  )
}
