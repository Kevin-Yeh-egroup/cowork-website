"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { NextSteps } from "@/components/next-steps"
import { IntroStep } from "@/components/intro-step"
import { Target, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

const goalTypes = [
  { id: "emergency", label: "緊急預備金", icon: "🛡️", suggested: "3-6個月支出" },
  { id: "travel", label: "旅遊基金", icon: "✈️", suggested: "依目的地而定" },
  { id: "education", label: "進修學習", icon: "📚", suggested: "課程或學費" },
  { id: "house", label: "購屋頭期款", icon: "🏠", suggested: "房價20-30%" },
  { id: "retirement", label: "退休規劃", icon: "🌴", suggested: "越早開始越好" },
  { id: "other", label: "其他目標", icon: "🎯", suggested: "自訂目標" },
]

export default function PlanningPage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState({ type: "", name: "", targetAmount: 0, currentAmount: 0, monthlyContribution: 0 })
  const [isCompleted, setIsCompleted] = useState(false)

  const progress = (step / 4) * 100

  const handleTypeSelect = (type: string) => {
    const selected = goalTypes.find((g) => g.id === type)
    setGoal({ ...goal, type, name: selected?.label || "" })
    setStep(2)
  }

  const handleComplete = () => {
    setIsCompleted(true)
  }

  const monthsToGoal = goal.monthlyContribution > 0 
    ? Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyContribution)
    : 0

  if (!hasStarted) {
    return (
      <IntroStep
        title="財務規劃"
        description="這個工具會協助你把想達成的財務目標拆成金額、現況與每月可投入的步驟。"
        details={[
          "先選擇目標類型，例如緊急預備金、進修或購屋",
          "再輸入目標金額、已存金額與每月可存金額",
          "完成後會估算距離目標還需要多久",
        ]}
        notice="估算結果會受到收入、支出與生活變化影響，請把它當作規劃參考，而不是固定承諾。"
        startLabel="開始規劃"
        icon={Target}
        onStart={() => setHasStarted(true)}
      />
    )
  }

  if (isCompleted) {
    const progressPercent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0

    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">目標已建立</h1>
            <p className="text-muted-foreground">{goal.name}</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">目前進度</span>
                  <span className="font-medium text-foreground">{progressPercent.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">目標金額</p>
                  <p className="text-xl font-bold text-foreground">${goal.targetAmount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">已存金額</p>
                  <p className="text-xl font-bold text-primary">${goal.currentAmount.toLocaleString()}</p>
                </div>
              </div>

              {monthsToGoal > 0 && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    每月存 ${goal.monthlyContribution.toLocaleString()}，
                    預計 <span className="font-bold text-primary">{monthsToGoal} 個月</span> 後達成目標
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <NextSteps title="接下來你可以：" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">財務規劃</h1>
          <p className="text-muted-foreground mb-4">設定你的財務目標</p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">第 {step} 步，共 4 步</p>
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">你想達成什麼目標？</h2>
              <div className="grid grid-cols-2 gap-3">
                {goalTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                  >
                    <span className="text-2xl mb-2 block">{type.icon}</span>
                    <span className="font-medium text-foreground block">{type.label}</span>
                    <span className="text-xs text-muted-foreground">{type.suggested}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">目標金額是多少？</h2>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="輸入目標金額"
                  value={goal.targetAmount || ""}
                  onChange={(e) => setGoal({ ...goal, targetAmount: Number(e.target.value) })}
                  className="text-xl text-center h-14"
                />
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> 上一步
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1" disabled={!goal.targetAmount}>
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
              <h2 className="text-lg font-medium text-foreground mb-6">目前已經存了多少？</h2>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="輸入已存金額"
                  value={goal.currentAmount || ""}
                  onChange={(e) => setGoal({ ...goal, currentAmount: Number(e.target.value) })}
                  className="text-xl text-center h-14"
                />
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> 上一步
                  </Button>
                  <Button onClick={() => setStep(4)} className="flex-1">
                    下一步 <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">每月可以存多少？</h2>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="輸入每月存款金額"
                  value={goal.monthlyContribution || ""}
                  onChange={(e) => setGoal({ ...goal, monthlyContribution: Number(e.target.value) })}
                  className="text-xl text-center h-14"
                />
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(3)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> 上一步
                  </Button>
                  <Button onClick={handleComplete} className="flex-1" disabled={!goal.monthlyContribution}>
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
