"use client"

import Link from "next/link"
import { useState } from "react"
import { Bot, CircleHelp, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { externalLinks } from "@/lib/external-links"

const actionLinks = [
  { href: externalLinks.financialResilience, label: "開始財務檢測" },
  { href: "/toolbox", label: "試試財務工具" },
  { href: "/content/articles", label: "看看文章" },
  { href: "/online-consultation", label: "想找人諮詢" },
]

export function FloatingAskButton() {
  const [input, setInput] = useState("")
  const [hasResponse, setHasResponse] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    setHasResponse(true)
  }

  return (
    <div className="fixed bottom-24 right-5 z-50 sm:right-6">
      <input id="floating-ask-toggle" type="checkbox" className="peer sr-only" />

      <div className="pointer-events-none invisible absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-sm translate-y-2 rounded-2xl border border-border bg-card opacity-0 shadow-2xl transition-all peer-checked:pointer-events-auto peer-checked:visible peer-checked:translate-y-0 peer-checked:opacity-100">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">問問 AI</p>
              <p className="text-xs text-muted-foreground">先整理你的狀況，再推薦下一步</p>
            </div>
          </div>
          <label
            htmlFor="floating-ask-toggle"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            role="button"
            aria-label="關閉問問 AI"
            title="關閉問問 AI"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">關閉問問 AI</span>
          </label>
        </div>

        <div className="space-y-3 p-4">
          <div className="max-w-[85%] rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            你好，我可以先陪你整理目前最困擾的財務問題。你可以簡單說說：最近最擔心的是收支、債務、詐騙，還是不知道從哪開始？
          </div>

          {hasResponse && (
            <>
              <div className="ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground">
                {input}
              </div>
              <div className="max-w-[90%] rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                我先幫你把下一步整理成幾個方向。你可以選一個最接近現在需求的功能開始。
              </div>
              <div className="grid grid-cols-1 gap-2">
                {actionLinks.map((action) => (
                  <Button key={action.label} asChild variant="outline" className="justify-start whitespace-normal">
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setHasResponse(false)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend()
                }
              }}
              placeholder="例如：我不知道錢去哪了"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">送出</span>
            </Button>
          </div>
          <Button
            variant="link"
            asChild
            className="mt-2 h-auto p-0 text-xs text-muted-foreground"
          >
            <Link href={externalLinks.askIvy}>前往完整問問 AI</Link>
          </Button>
        </div>
      </div>

      <label
        htmlFor="floating-ask-toggle"
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        role="button"
        aria-label="不確定從哪開始？先問看看"
        title="不確定從哪開始？先問看看"
      >
        <CircleHelp className="h-6 w-6" />
      </label>
    </div>
  )
}
