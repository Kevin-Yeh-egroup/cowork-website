"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Gauge,
  LayoutDashboard,
  NotebookPen,
  ReceiptText,
  Search,
  ShieldAlert,
  Users,
  Wrench,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const resources = [
  {
    href: "/events",
    title: "社工培訓課程",
    description: "學習如何協助個案處理財務問題",
    icon: Calendar,
  },
  {
    href: "/toolbox",
    title: "財務評估工具",
    description: "使用各項工具協助個案評估財務狀況",
    icon: Wrench,
  },
  {
    href: "/content/articles",
    title: "教育資源",
    description: "適合分享給個案的文章和教材",
    icon: BookOpen,
  },
  {
    href: "/social-worker",
    title: "個案管理系統",
    description: "追蹤個案進度和服務紀錄",
    icon: FileText,
  },
]

const cases = [
  {
    id: "C-001",
    name: "林 O 芬",
    family: "單親家庭，2 名子女",
    status: "需要追蹤",
    risk: "中高風險",
    lastContact: "2026/05/03",
    note: "收入不穩，近期有信用卡循環與租金壓力。",
  },
  {
    id: "C-002",
    name: "陳 O 豪",
    family: "三代同住",
    status: "穩定輔導",
    risk: "中風險",
    lastContact: "2026/05/01",
    note: "主要壓力來自照顧支出，已開始記錄日常收支。",
  },
  {
    id: "C-003",
    name: "王 O 婷",
    family: "新住民家庭",
    status: "初評中",
    risk: "待快篩",
    lastContact: "2026/04/29",
    note: "需先完成風險快篩，釐清債務與詐騙疑慮。",
  },
  {
    id: "C-004",
    name: "張 O 明",
    family: "獨居長者",
    status: "密集追蹤",
    risk: "高風險",
    lastContact: "2026/05/04",
    note: "疑似遭遇投資詐騙，已安排下一次會談。",
  },
  {
    id: "C-005",
    name: "黃 O 珊",
    family: "雙薪家庭",
    status: "目標規劃",
    risk: "低風險",
    lastContact: "2026/04/26",
    note: "正在建立緊急預備金，需追蹤每月儲蓄進度。",
  },
]

const caseActions = [
  {
    label: "個案總覽",
    description: "查看家庭結構、財務狀態與服務摘要",
    icon: LayoutDashboard,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "會談紀錄",
    description: "記錄會談重點、服務目標與下次追蹤事項",
    icon: NotebookPen,
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    label: "風險快篩",
    description: "整理財務壓力、債務、詐騙與急迫需求",
    icon: ShieldAlert,
    color: "bg-destructive/10 text-destructive",
  },
  {
    label: "記帳紀錄",
    description: "查看個案收支紀錄與近期財務變化",
    icon: ReceiptText,
    color: "bg-secondary text-secondary-foreground",
  },
]

export default function SocialWorkerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredCases = cases.filter((caseItem) => {
    const searchableText = [
      caseItem.id,
      caseItem.name,
      caseItem.family,
      caseItem.status,
      caseItem.risk,
      caseItem.note,
    ]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(normalizedSearchTerm)
  })

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">社工專區</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            為社工夥伴準備的資源和工具，幫助你更有效地協助個案
          </p>
        </div>

        <div className="mb-10 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">社工工作提醒</h2>
          <p className="text-muted-foreground mb-4">
            若個案尚未使用系統，仍可先由社工建立會談紀錄與風險快篩，後續再邀請個案使用記帳或檢測工具補齊資料。
          </p>
          <Link
            href="/toolbox/consultation"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            聯繫支援團隊 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">個案數</p>
            </div>
            <p className="text-3xl font-bold text-primary">{cases.length}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">需優先追蹤</p>
            </div>
            <p className="text-3xl font-bold text-primary">2</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">本週會談</p>
            </div>
            <p className="text-3xl font-bold text-primary">4</p>
          </div>
        </div>

        <section className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">個案列表</h2>
              <p className="text-sm text-muted-foreground">快速進入個案總覽、會談紀錄、風險快篩與記帳紀錄。</p>
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="搜尋個案名稱、編號或關鍵字"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredCases.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  找不到符合「{searchTerm}」的個案，請換個關鍵字試試。
                </CardContent>
              </Card>
            )}

            {filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-72 shrink-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{caseItem.id}</p>
                          <h3 className="text-lg font-semibold text-foreground">{caseItem.name}</h3>
                        </div>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                          {caseItem.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{caseItem.family}</p>
                      <p className="text-sm text-foreground mb-2">風險狀態：{caseItem.risk}</p>
                      <p className="text-sm text-muted-foreground mb-3">最近聯繫：{caseItem.lastContact}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{caseItem.note}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1">
                      {caseActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <Button
                            key={`${caseItem.id}-${action.label}`}
                            variant="outline"
                            className="h-auto min-w-0 items-start justify-start whitespace-normal p-4 text-left"
                          >
                            <span className={`mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium text-foreground">{action.label}</span>
                              <span className="mt-1 block break-words text-xs text-muted-foreground font-normal leading-relaxed">
                                {action.description}
                              </span>
                            </span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">資源與工具</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Link key={resource.title} href={resource.href} className="group">
                  <Card className="h-full border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        前往 <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
