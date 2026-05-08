"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Menu, ClipboardCheck, Wrench, BookOpen, Calendar, Users, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  children?: {
    href: string
    label: string
  }[]
}

const navItems: NavItem[] = [
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
  { href: "/toolbox", label: "財務工具", icon: Wrench },
  {
    href: "/content",
    label: "知識與內容",
    icon: BookOpen,
    children: [
      { href: "/content/articles", label: "看看文章" },
      { href: "/content/podcast", label: "聽聽 Podcast" },
      { href: "/content/column", label: "專欄（多多益善）" },
    ],
  },
  {
    href: "/events",
    label: "活動與課程",
    icon: Calendar,
    children: [
      { href: "/events#public", label: "一般民眾" },
      { href: "/events#social-worker", label: "社工" },
    ],
  },
  { href: "/social-worker", label: "社工專區", icon: Users },
  { href: "/personal-center", label: "個人中心", icon: User },
]

function getEventAudience(href: string) {
  if (href === "/events#public") return "public"
  if (href === "/events#social-worker") return "social-worker"

  return null
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const syncEventAudience = (href: string) => {
    const audience = getEventAudience(href)

    if (audience) {
      window.dispatchEvent(new CustomEvent("events-audience-change", { detail: audience }))
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
                </Link>

                {item.children && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 min-w-44 -translate-x-1/2 pt-2 opacity-0 translate-y-1 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    <div className="rounded-xl border border-border bg-card p-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => syncEventAudience(child.href)}
                          className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:outline-none"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">開啟選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
