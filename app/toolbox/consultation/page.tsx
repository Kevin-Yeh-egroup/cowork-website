"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NextSteps } from "@/components/next-steps"
import { MessageSquare, CheckCircle, Calendar, Clock } from "lucide-react"

const topics = [
  "債務問題",
  "收支管理",
  "詐騙求助",
  "財務規劃",
  "其他問題",
]

const timeSlots = [
  "上午 9:00-12:00",
  "下午 14:00-17:00",
  "晚上 19:00-21:00",
]

export default function ConsultationPage() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    topic: "",
    name: "",
    phone: "",
    preferredTime: "",
    notes: "",
  })
  const [isCompleted, setIsCompleted] = useState(false)

  const handleTopicSelect = (topic: string) => {
    setBooking({ ...booking, topic })
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setBooking({ ...booking, preferredTime: time })
  }

  const handleSubmit = () => {
    if (booking.name && booking.phone && booking.preferredTime) {
      setIsCompleted(true)
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">預約成功</h1>
            <p className="text-muted-foreground">我們會在預約時段聯繫你</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">諮詢主題</p>
                    <p className="font-medium text-foreground">{booking.topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">預約時段</p>
                    <p className="font-medium text-foreground">{booking.preferredTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <NextSteps title="在等待諮詢的時間，你可以：" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">線上諮詢</h1>
          <p className="text-muted-foreground">預約專人協助你解決財務問題</p>
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">你想諮詢什麼問題？</h2>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className="w-full p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{topic}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-6">填寫聯絡資料</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">姓名</label>
                  <Input
                    placeholder="請輸入你的姓名"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">聯絡電話</label>
                  <Input
                    placeholder="請輸入電話號碼"
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">偏好時段</label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          booking.preferredTime === time
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">補充說明（選填）</label>
                  <Input
                    placeholder="簡單說明你的狀況"
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                    上一步
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1"
                    disabled={!booking.name || !booking.phone || !booking.preferredTime}
                  >
                    送出預約 <Calendar className="h-4 w-4 ml-2" />
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
