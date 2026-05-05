"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { NextSteps } from "@/components/next-steps"
import { IntroStep } from "@/components/intro-step"
import { ArrowLeft, ArrowRight, Plus, Minus, CheckCircle, Calculator } from "lucide-react"

const categories = [
  { id: "food", label: "飲食", icon: "🍜" },
  { id: "transport", label: "交通", icon: "🚗" },
  { id: "housing", label: "住宿", icon: "🏠" },
  { id: "entertainment", label: "娛樂", icon: "🎮" },
  { id: "shopping", label: "購物", icon: "🛒" },
  { id: "other", label: "其他", icon: "📦" },
]

interface Entry {
  type: "income" | "expense"
  amount: number
  category?: string
  note: string
}

export default function AccountingPage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [step, setStep] = useState(1)
  const [entries, setEntries] = useState<Entry[]>([])
  const [currentEntry, setCurrentEntry] = useState<Partial<Entry>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const progress = (step / 4) * 100

  const handleTypeSelect = (type: "income" | "expense") => {
    setCurrentEntry({ ...currentEntry, type })
    setStep(2)
  }

  const handleAmountSubmit = () => {
    if (currentEntry.amount && currentEntry.amount > 0) {
      if (currentEntry.type === "income") {
        setStep(4)
      } else {
        setStep(3)
      }
    }
  }

  const handleCategorySelect = (category: string) => {
    setCurrentEntry({ ...currentEntry, category })
    setStep(4)
  }

  const handleNoteSubmit = () => {
    if (currentEntry.type && currentEntry.amount) {
      setEntries([...entries, currentEntry as Entry])
      setIsCompleted(true)
    }
  }

  const handleAddAnother = () => {
    setCurrentEntry({})
    setStep(1)
    setIsCompleted(false)
  }

  if (!hasStarted) {
    return (
      <IntroStep
        title="記帳助理"
        description="這個工具會帶你一步步記錄收入或支出，先把今天發生的金錢流動整理下來。"
        details={[
          "先選收入或支出，再輸入金額與類別",
          "可以連續新增多筆資料，方便快速整理日常收支",
          "完成後會看到本次記錄的收入與支出小結",
        ]}
        notice="這裡的記錄目前用於本次整理與畫面顯示，請避免輸入完整帳號、身分證字號等敏感資訊。"
        startLabel="開始記帳"
        icon={Calculator}
        onStart={() => setHasStarted(true)}
      />
    )
  }

  if (isCompleted) {
    const totalIncome = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
    const totalExpense = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
    
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">記帳完成</h1>
            <p className="text-muted-foreground">已記錄 {entries.length} 筆資料</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">收入</p>
                  <p className="text-2xl font-bold text-primary">+${totalIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">支出</p>
                  <p className="text-2xl font-bold text-destructive">-${totalExpense.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 mb-6">
            <Button onClick={handleAddAnother} variant="outline" className="flex-1">
              繼續記帳
            </Button>
          </div>

          <NextSteps title="接下來你可以：" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">記帳助理</h1>
          <p className="text-muted-foreground mb-4">一步步記錄你的收支</p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">第 {step} 步，共 4 步</p>
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">這筆是收入還是支出？</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTypeSelect("income")}
                  className="p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-center"
                >
                  <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                  <span className="font-medium text-foreground">收入</span>
                </button>
                <button
                  onClick={() => handleTypeSelect("expense")}
                  className="p-6 rounded-xl border border-border hover:border-destructive/30 hover:bg-destructive/5 transition-all text-center"
                >
                  <Minus className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <span className="font-medium text-foreground">支出</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">金額是多少？</h2>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="輸入金額"
                  value={currentEntry.amount || ""}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, amount: Number(e.target.value) })}
                  className="text-2xl text-center h-16"
                />
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> 上一步
                  </Button>
                  <Button onClick={handleAmountSubmit} className="flex-1" disabled={!currentEntry.amount}>
                    下一步 <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">這筆支出的類別是？</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-center"
                  >
                    <span className="text-2xl mb-1 block">{cat.icon}</span>
                    <span className="text-sm text-foreground">{cat.label}</span>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setStep(2)} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" /> 上一步
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">備註（選填）</h2>
              <div className="space-y-4">
                <Input
                  placeholder="例如：午餐、加油..."
                  value={currentEntry.note || ""}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, note: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(currentEntry.type === "income" ? 2 : 3)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> 上一步
                  </Button>
                  <Button onClick={handleNoteSubmit} className="flex-1">
                    完成 <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
