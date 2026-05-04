"use client"

import Link from "next/link"
import { MessageCircleQuestion } from "lucide-react"

export function FloatingAskButton() {
  return (
    <Link
      href="/ask-ai"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
    >
      <MessageCircleQuestion className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-medium">不確定從哪開始？先問看看</span>
      <span className="sm:hidden text-sm font-medium">問問看</span>
    </Link>
  )
}
