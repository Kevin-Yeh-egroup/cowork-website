"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { eventAudienceLabels, getStoredEvents, type EventAudience, type ManagedEvent } from "@/lib/events-data"

const tabs = [
  { id: "public", label: "一般民眾" },
  { id: "social-worker", label: "社工" },
]

const audienceIds = ["public", "social-worker"] as const

function isEventAudience(value: string): value is EventAudience {
  return audienceIds.includes(value as EventAudience)
}

function getAudienceFromHash(): EventAudience | null {
  const hashAudience = window.location.hash.replace("#", "")

  if (isEventAudience(hashAudience)) {
    return hashAudience
  }

  return null
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventAudience>("public")
  const [events, setEvents] = useState<ManagedEvent[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])

  useEffect(() => {
    const syncTabFromHash = () => {
      const hashAudience = getAudienceFromHash()

      if (hashAudience) {
        setActiveTab(hashAudience)
      }
    }

    syncTabFromHash()
    window.addEventListener("hashchange", syncTabFromHash)

    return () => window.removeEventListener("hashchange", syncTabFromHash)
  }, [])

  useEffect(() => {
    const syncTabFromNavigation = (event: Event) => {
      const audience = (event as CustomEvent<EventAudience>).detail

      if (isEventAudience(audience)) {
        setActiveTab(audience)
      }
    }

    window.addEventListener("events-audience-change", syncTabFromNavigation)

    return () => window.removeEventListener("events-audience-change", syncTabFromNavigation)
  }, [])

  useEffect(() => {
    setEvents(getStoredEvents())
  }, [])

  const currentEvents = events.filter((event) => event.audience === activeTab && event.visible)

  const handleRegister = (eventId: number) => {
    setRegisteredEvents([...registeredEvents, eventId])
  }

  const handleTabChange = (audience: EventAudience) => {
    setActiveTab(audience)
    window.history.replaceState(null, "", `#${audience}`)
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-foreground mb-3">活動與課程</h1>
          <p className="text-muted-foreground text-lg">參加活動，學習更多財務知識</p>
        </div>

        <div className="mb-5 flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as EventAudience)}
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
          {currentEvents.length === 0 && (
            <Card>
              <CardContent className="p-5 text-center text-muted-foreground">
                目前沒有顯示中的{eventAudienceLabels[activeTab]}活動。
              </CardContent>
            </Card>
          )}

          {currentEvents.map((event) => {
            const isRegistered = registeredEvents.includes(event.id)
            
            return (
              <Card key={event.id} className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="flex min-h-24 items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                      <h3 className="mb-1 font-semibold text-lg text-foreground">{event.title}</h3>
                      <p className="sr-only">{event.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
                        <Button disabled variant="secondary" size="sm">
                          已報名
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleRegister(event.id)}>
                          我要報名 <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
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
