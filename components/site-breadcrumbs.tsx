"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const labelMap: Record<string, string> = {
  "ask-ai": "問問 AI",
  assessment: "開始檢測",
  content: "知識與內容",
  articles: "文章",
  column: "專欄",
  podcast: "Podcast",
  events: "活動與課程",
  admin: "管理後台",
  "financial-anxiety": "財務焦慮檢測",
  "financial-resilience": "財務韌性檢測",
  "fraud-defense": "詐騙防禦檢測",
  impact: "成果與影響",
  login: "登入",
  "personal-center": "個人中心",
  "social-worker": "社工專區",
  toolbox: "財務工具",
  accounting: "記帳助理",
  consultation: "線上諮詢",
  "online-consultation": "免費諮詢",
  apply: "個人申請",
  referral: "個案轉介",
  debt: "債務盤點",
  planning: "財務規劃",
  simulator: "財務試算",
}

function toLabel(segment: string) {
  return labelMap[segment] ?? decodeURIComponent(segment).replace(/-/g, " ")
}

export function SiteBreadcrumbs() {
  const pathname = usePathname()

  if (pathname === "/") {
    return null
  }

  const segments = pathname.split("/").filter(Boolean)

  return (
    <div className="border-b border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">首頁</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`
              const isLast = index === segments.length - 1

              return (
                <div key={href} className="contents">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{toLabel(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{toLabel(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
