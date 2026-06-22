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
  scenarios: "情境專區",
  "life-topics": "生活課題",
  "life-stages": "服務對象",
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
  "personal-center": "我的財務與生活",
  "social-worker": "社工專區",
  "social-worker-tools": "工作支持",
  "work-income": "工作與收入問題",
  "first-job": "剛開始工作",
  "unstable-income": "收入不穩",
  "career-transition": "正在轉職",
  "recently-unemployed": "最近失業",
  "side-income": "第二收入／斜槓",
  "retirement-prep": "退休準備",
  "debt-pressure": "債務與財務壓力",
  "credit-card-revolving": "卡債與循環利息",
  "personal-loan": "信用貸款",
  "mortgage-car-loan": "房貸與車貸壓力",
  "late-payment": "無法準時繳款",
  enforcement: "強制執行",
  "fraud-risk": "詐騙與金融風險",
  "investment-fraud": "投資詐騙",
  "shopping-fraud": "網路購物詐騙",
  "romance-fraud": "愛情交友詐騙",
  "job-fraud": "求職詐騙",
  "warning-account": "人頭帳戶／警示帳戶",
  "personal-data-safety": "個資外洩與帳號安全",
  "health-care": "生病與照顧",
  "self-illness": "自己生病",
  "family-illness": "家人生病",
  "major-illness": "重大傷病",
  "long-term-care": "長期照顧",
  "caregiving-leave": "照顧離職",
  "medical-expense": "醫療支出增加",
  "family-change": "家庭與生活變故",
  "marriage-family": "結婚與家庭建立",
  childcare: "生育與育兒",
  "single-parent": "單親家庭",
  "relationship-change": "離婚與關係變化",
  "moving-renting": "搬家與租屋",
  "bereavement-change": "親人過世或重大變故",
  "independent-life": "開始獨立生活",
  "working-life": "正在工作打拼",
  "single-parent-family": "一個人撐起一個家",
  "family-caregiver": "陪伴家人走一段路",
  "health-challenge": "面對健康與生活的新挑戰",
  "retirement-aging": "開始思考退休與老後",
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
