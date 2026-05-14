"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NextSteps } from "@/components/next-steps"
import { IntroStep } from "@/components/intro-step"
import { Calculator, ArrowRight } from "lucide-react"
import { currentMemberId } from "@/lib/achievements-data"
import { recordAchievementEvent } from "@/lib/achievements-service"

type SimulatorType = "loan" | "savings" | null

export default function SimulatorPage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [type, setType] = useState<SimulatorType>(null)
  const [loanData, setLoanData] = useState({ principal: 0, rate: 0, months: 0 })
  const [savingsData, setSavingsData] = useState({ target: 0, monthly: 0, rate: 0 })
  const [result, setResult] = useState<{ monthly?: number; total?: number; months?: number; interest?: number } | null>(null)

  const calculateLoan = () => {
    const { principal, rate, months } = loanData
    if (principal > 0 && rate >= 0 && months > 0) {
      const monthlyRate = rate / 100 / 12
      const monthly = monthlyRate > 0
        ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
        : principal / months
      const total = monthly * months
      setResult({ monthly: Math.round(monthly), total: Math.round(total), interest: Math.round(total - principal) })
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: "tool_used",
        module: "tool_library",
        objectType: "tool",
        objectId: "loan-simulator",
        metadata: {
          tool_code: "loan_simulator",
          tool_category: "debt",
        },
      })
    }
  }

  const calculateSavings = () => {
    const { target, monthly, rate } = savingsData
    if (target > 0 && monthly > 0) {
      const monthlyRate = rate / 100 / 12
      let months = 0
      let accumulated = 0
      
      while (accumulated < target && months < 600) {
        accumulated = accumulated * (1 + monthlyRate) + monthly
        months++
      }
      
      setResult({ months, total: Math.round(accumulated) })
      recordAchievementEvent({
        userId: currentMemberId,
        role: "member",
        eventType: "tool_used",
        module: "tool_library",
        objectType: "tool",
        objectId: "savings-simulator",
        metadata: {
          tool_code: "savings_simulator",
          tool_category: "simulator",
        },
      })
    }
  }

  const reset = () => {
    setType(null)
    setResult(null)
    setLoanData({ principal: 0, rate: 0, months: 0 })
    setSavingsData({ target: 0, monthly: 0, rate: 0 })
  }

  if (!hasStarted) {
    return (
      <IntroStep
        title="財務試算"
        description="這個工具可以快速估算貸款還款或儲蓄目標，幫你先掌握大概的時間與金額。"
        details={[
          "可選擇貸款還款試算或儲蓄目標試算",
          "輸入金額、期數或每月可存金額後即可估算",
          "試算結果會顯示每月金額、總額或達成時間",
        ]}
        notice="試算結果會因利率、費用與實際條件不同而改變，請把它當作初步參考。"
        startLabel="開始使用"
        icon={Calculator}
        onStart={() => setHasStarted(true)}
      />
    )
  }

  if (result) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">試算結果</h1>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              {type === "loan" && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">每月還款金額</p>
                    <p className="text-3xl font-bold text-primary">${result.monthly?.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">總還款金額</p>
                      <p className="text-xl font-bold text-foreground">${result.total?.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">總利息</p>
                      <p className="text-xl font-bold text-foreground">${result.interest?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {type === "savings" && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">預計達成時間</p>
                    <p className="text-3xl font-bold text-primary">{result.months} 個月</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      約 {Math.floor((result.months || 0) / 12)} 年 {(result.months || 0) % 12} 個月
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={reset} variant="outline" className="w-full mb-6">
            重新試算
          </Button>

          <NextSteps title="接下來你可以：" />
        </div>
      </div>
    )
  }

  if (!type) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">財務試算</h1>
            <p className="text-muted-foreground">選擇你想試算的項目</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setType("loan")}
              className="p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">貸款還款試算</h3>
              <p className="text-sm text-muted-foreground">計算每月還款金額與總利息</p>
            </button>
            
            <button
              onClick={() => setType("savings")}
              className="p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">儲蓄目標試算</h3>
              <p className="text-sm text-muted-foreground">計算達成目標需要的時間</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {type === "loan" ? "貸款還款試算" : "儲蓄目標試算"}
          </h1>
          <p className="text-muted-foreground">輸入資料進行試算</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            {type === "loan" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">貸款金額</label>
                  <Input
                    type="number"
                    placeholder="輸入貸款金額"
                    value={loanData.principal || ""}
                    onChange={(e) => setLoanData({ ...loanData, principal: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">年利率 (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="輸入年利率"
                    value={loanData.rate || ""}
                    onChange={(e) => setLoanData({ ...loanData, rate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">還款期數（月）</label>
                  <Input
                    type="number"
                    placeholder="輸入還款月數"
                    value={loanData.months || ""}
                    onChange={(e) => setLoanData({ ...loanData, months: Number(e.target.value) })}
                  />
                </div>
                <Button onClick={calculateLoan} className="w-full" disabled={!loanData.principal || !loanData.months}>
                  開始試算 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {type === "savings" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">目標金額</label>
                  <Input
                    type="number"
                    placeholder="輸入目標金額"
                    value={savingsData.target || ""}
                    onChange={(e) => setSavingsData({ ...savingsData, target: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">每月存款金額</label>
                  <Input
                    type="number"
                    placeholder="輸入每月存款"
                    value={savingsData.monthly || ""}
                    onChange={(e) => setSavingsData({ ...savingsData, monthly: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">預估年報酬率 (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="輸入年報酬率（可填0）"
                    value={savingsData.rate || ""}
                    onChange={(e) => setSavingsData({ ...savingsData, rate: Number(e.target.value) })}
                  />
                </div>
                <Button onClick={calculateSavings} className="w-full" disabled={!savingsData.target || !savingsData.monthly}>
                  開始試算 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={reset} variant="ghost" className="w-full">
          返回選擇
        </Button>
      </div>
    </div>
  )
}
