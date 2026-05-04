"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const tabs = [
  { id: "public", label: "一般民眾" },
  { id: "social-worker", label: "社工" },
]

const events = {
  public: [
    {
      id: 1,
      title: "財務健檢工作坊",
      description: "學習如何檢視自己的財務狀況，找出問題並制定改善計畫",
      date: "2026/05/15",
      time: "14:00-17:00",
      location: "線上",
      spots: 30,
    },
    {
      id: 2,
      title: "記帳新手入門",
      description: "從零開始學習記帳，建立良好的財務習慣",
      date: "2026/05/22",
      time: "19:00-21:00",
      location: "線上",
      spots: 50,
    },
    {
      id: 3,
      title: "債務管理實戰班",
      description: "了解債務整合選項，制定還款計畫",
      date: "2026/06/01",
      time: "14:00-17:00",
      location: "台北市社福中心",
      spots: 20,
    },
  ],
  "social-worker": [
    {
      id: 4,
      title: "財務社工培訓課程",
      description: "學習如何協助個案處理財務問題",
      date: "2026/05/20",
      time: "09:00-17:00",
      location: "線上",
      spots: 40,
    },
    {
      id: 5,
      title: "財務評估工具使用訓練",
      description: "熟悉平台各項評估工具的使用方式",
      date: "2026/05/28",
      time: "14:00-16:00",
      location: "線上",
      spots: 30,
    },
  ],
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("public")
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])

  const currentEvents = events[activeTab as keyof typeof events]

  const handleRegister = (eventId: number) => {
    setRegisteredEvents([...registeredEvents, eventId])
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">活動與課程</h1>
          <p className="text-muted-foreground text-lg">參加活動，學習更多財務知識</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {currentEvents.map((event) => {
            const isRegistered = registeredEvents.includes(event.id)
            
            return (
              <Card key={event.id} className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> 名額 {event.spots} 人
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isRegistered ? (
                        <Button disabled variant="secondary">
                          已報名
                        </Button>
                      ) : (
                        <Button onClick={() => handleRegister(event.id)}>
                          我要報名 <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
