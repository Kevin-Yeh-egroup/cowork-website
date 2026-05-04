"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Send, ClipboardCheck, Wrench, BookOpen, MessageSquare, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const suggestedPrompts = [
  "我最近很焦慮",
  "我不知道錢去哪了",
  "我有債務問題",
  "我想開始存錢",
  "我擔心被詐騙",
]

const actionButtons = [
  { href: "/assessment", label: "做檢測", icon: ClipboardCheck },
  { href: "/toolbox", label: "用工具", icon: Wrench },
  { href: "/content/articles", label: "看文章", icon: BookOpen },
  { href: "/toolbox/consultation", label: "預約諮詢", icon: MessageSquare },
]

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const aiResponses: Record<string, string> = {
  "我最近很焦慮": "我理解財務焦慮是很常見的感受。首先，深呼吸，這種感覺是正常的。建議你可以先做一個財務焦慮檢測，了解自己的狀況，然後我們再來看看有什麼方法可以幫助你。",
  "我不知道錢去哪了": "這是很多人的困擾！好消息是，只要開始記帳，你就能慢慢看清楚錢的流向。我們有一個簡單的記帳工具，可以幫你一步步記錄收支。要不要試試看？",
  "我有債務問題": "面對債務問題需要勇氣，你願意正視它已經是很重要的第一步。建議你先使用債務盤點工具，把所有債務整理清楚，這樣才能制定還款計畫。如果需要專業協助，也可以預約免費諮詢。",
  "我想開始存錢": "太棒了！想開始存錢是改變的第一步。建議先設定一個具體的目標，比如緊急預備金。我們的財務規劃工具可以幫你計算每月需要存多少，多久可以達成目標。",
  "我擔心被詐騙": "保持警覺是好事！你可以先做一個詐騙防禦檢測，看看自己對常見詐騙手法的了解程度。我們也有文章介紹各種詐騙手法，幫助你提高警覺。",
}

export default function AskAiPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = aiResponses[text] || 
      "我了解你的狀況。每個人的財務情況都不同，但好消息是，我們有很多工具和資源可以幫助你。你可以試試下面的選項，找到最適合你的下一步。"

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: response,
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsTyping(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">有什麼想問的嗎？</h1>
              <p className="text-muted-foreground">我可以幫你找到適合的下一步</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  <p className={message.role === "user" ? "text-primary-foreground" : "text-foreground"}>
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {messages.length > 0 && !isTyping && messages[messages.length - 1].role === "assistant" && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">你可以試試這些：</p>
                  <div className="flex flex-wrap gap-2">
                    {actionButtons.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button key={action.href} asChild variant="secondary" size="sm">
                          <Link href={action.href} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {action.label}
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="輸入你的問題..."
            className="flex-1"
          />
          <Button onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
