"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Menu, Route, ClipboardCheck, Wrench, BookOpen, Calendar, Users, User, ChevronDown, HandCoins, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { externalLinks } from "@/lib/external-links"
import { getAuthHomePath, useDemoAuth, type DemoAuthState } from "@/lib/demo-auth"
import { scenarioCategories } from "@/lib/scenarios-data"
import { serviceAudiences } from "@/lib/life-stages-data"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  children?: {
    href: string
    label: string
  }[]
}

const baseNavItems: NavItem[] = [
  {
    href: "/assessment",
    label: "開始檢測",
    icon: ClipboardCheck,
    children: [
      { href: "/financial-resilience", label: "財務韌性" },
      { href: "/financial-anxiety", label: "財務焦慮" },
      { href: "/fraud-defense", label: "詐騙防禦" },
    ],
  },
  {
    href: externalLinks.onlineConsultation,
    label: "免費諮詢",
    icon: HandCoins,
  },
  {
    href: "/toolbox",
    label: "財務工具",
    icon: Wrench,
    children: [
      { href: "/toolbox/accounting", label: "記帳助理" },
      { href: "/toolbox/planning", label: "目標規劃" },
      { href: "/toolbox#risk-handling", label: "風險處理" },
      { href: "/toolbox#debt-calculation", label: "債務計算" },
      { href: "/toolbox#rights-calculation", label: "權益試算" },
    ],
  },
  {
    href: "/life-topics",
    label: "生活課題",
    icon: Route,
    children: scenarioCategories.map((category) => ({
      href: `/life-topics#${category.anchor}`,
      label: category.title,
    })),
  },
  {
    href: "/life-stages",
    label: "服務對象",
    icon: Users,
    children: serviceAudiences.map((stage) => ({
      href: `/life-stages/${stage.slug}`,
      label: stage.audience,
    })),
  },
  {
    href: "/content",
    label: "知識與內容",
    icon: BookOpen,
    children: [
      { href: "/content/articles", label: "看看文章" },
      { href: "/content/podcast", label: "聽聽 Podcast" },
      { href: "/content/column", label: "多多益善專欄" },
      { href: externalLinks.callForArticles, label: "投稿分享" },
    ],
  },
  {
    href: "/events",
    label: "活動與課程",
    icon: Calendar,
    children: [
      { href: "/events#public", label: "一般民眾" },
      { href: "/events#social-worker", label: "社工與助人工作者" },
    ],
  },
  {
    href: "/social-worker",
    label: "助人工作者",
    icon: Users,
  },
  {
    href: "https://www.familyfinhealth.com/sitemap",
    label: "網站導覽",
    icon: Map,
  },
]

function getAuthNavItem(authState: DemoAuthState): NavItem {
  if (!authState.isLoggedIn || !authState.role) {
    return {
      href: "/login",
      label: authState.isLoggedIn ? "選擇角色" : "登入",
      icon: User,
    }
  }

  return {
    href: getAuthHomePath(authState),
    label: authState.role === "member" ? "我的財務與生活" : "社工工作台",
    icon: authState.role === "member" ? User : Users,
  }
}

function getEventAudience(href: string) {
  if (href === "/events#public") return "public"
  if (href === "/events#social-worker") return "social-worker"

  return null
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { authState, logout } = useDemoAuth()
  const navItems =
    authState.isLoggedIn && authState.role === "social_worker"
      ? baseNavItems
      : [...baseNavItems, getAuthNavItem(authState)]

  const syncEventAudience = (href: string) => {
    const audience = getEventAudience(href)

    if (audience) {
      window.dispatchEvent(new CustomEvent("events-audience-change", { detail: audience }))
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_10px_30px_oklch(0.8_0.08_40_/_0.12)] backdrop-blur-md">
      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="好理家在"
              width={180}
              height={52}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-2 py-2 text-base text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-full transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
                </Link>

                {item.children && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 min-w-44 -translate-x-1/2 pt-2 opacity-0 translate-y-1 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0">
                    <div className="rounded-2xl border border-border/70 bg-card/95 p-2 shadow-xl backdrop-blur-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => syncEventAudience(child.href)}
                          className="block rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary/80 hover:text-foreground focus:bg-secondary focus:outline-none"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {authState.isLoggedIn && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                登出
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mobile-menu-button xl:!hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">開啟選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">主選單</SheetTitle>
              <SheetDescription className="sr-only">網站主要導覽連結</SheetDescription>
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="-mt-1 ml-8 flex flex-col gap-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => {
                                syncEventAudience(child.href)
                                setIsOpen(false)
                              }}
                              className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                {authState.isLoggedIn && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start px-4 py-3 text-foreground"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                  >
                    登出
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
