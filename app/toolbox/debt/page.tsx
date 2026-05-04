"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NextSteps } from "@/components/next-steps"
import { Plus, Trash2, CheckCircle } from "lucide-react"

interface Debt {
  id: number
  name: string
  amount: number
  monthlyPayment: number
}

const debtTypes = [
  "信用卡債務",
  "銀行貸款",
  "車貸",
  "房貸",
  "親友借款",
  "其他",
]

export default function DebtPage() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [newDebt, setNewDebt] = useState({ name: "", amount: 0, monthlyPayment: 0 })

  const addDebt = () => {
    if (newDebt.name && newDebt.amount > 0) {
      setDebts([...debts, { ...newDebt, id: Date.now() }])
      setNewDebt({ name: "", amount: 0, monthlyPayment: 0 })
    }
  }

  const removeDebt = (id: number) => {
    setDebts(debts.filter((d) => d.id !== id))
  }

  const handleComplete = () => {
    setIsCompleted(true)
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0)
  const totalMonthly = debts.reduce((sum, d) => sum + d.monthlyPayment, 0)

  if (isCompleted) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">債務盤點完成</h1>
            <p className="text-muted-foreground">已整理 {debts.length} 筆債務</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">總債務金額</p>
                  <p className="text-2xl font-bold text-foreground">${totalDebt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">每月還款金額</p>
                  <p className="text-2xl font-bold text-primary">${totalMonthly.toLocaleString()}</p>
                </div>
              </div>
              
              {debts.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  {debts.map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between py-2">
                      <span className="font-medium text-foreground">{debt.name}</span>
                      <span className="text-muted-foreground">${debt.amount.toLocaleString()}</span>
                    </div>
                  ))}
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
          <h1 className="text-2xl font-bold text-foreground mb-2">債務盤點</h1>
          <p className="text-muted-foreground">整理你目前的所有債務，了解完整狀況</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">新增債務</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">債務類型</label>
                <div className="flex flex-wrap gap-2">
                  {debtTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewDebt({ ...newDebt, name: type })}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        newDebt.name === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">債務金額</label>
                <Input
                  type="number"
                  placeholder="輸入金額"
                  value={newDebt.amount || ""}
                  onChange={(e) => setNewDebt({ ...newDebt, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">每月還款金額</label>
                <Input
                  type="number"
                  placeholder="輸入金額"
                  value={newDebt.monthlyPayment || ""}
                  onChange={(e) => setNewDebt({ ...newDebt, monthlyPayment: Number(e.target.value) })}
                />
              </div>
              <Button onClick={addDebt} className="w-full" disabled={!newDebt.name || !newDebt.amount}>
                <Plus className="h-4 w-4 mr-2" /> 新增債務
              </Button>
            </div>
          </CardContent>
        </Card>

        {debts.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">已新增的債務</h2>
              <div className="space-y-3">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{debt.name}</p>
                      <p className="text-sm text-muted-foreground">
                        總額 ${debt.amount.toLocaleString()} / 月付 ${debt.monthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeDebt(debt.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleComplete} className="w-full" disabled={debts.length === 0}>
          完成盤點 <CheckCircle className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
