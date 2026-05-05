"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  defaultEvents,
  eventAudienceLabels,
  getStoredEvents,
  saveStoredEvents,
  type EventAudience,
  type ManagedEvent,
} from "@/lib/events-data"

const emptyEvent: Omit<ManagedEvent, "id"> = {
  audience: "public",
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  spots: 30,
  visible: true,
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<ManagedEvent[]>([])
  const [draft, setDraft] = useState(emptyEvent)

  useEffect(() => {
    setEvents(getStoredEvents())
  }, [])

  const persistEvents = (nextEvents: ManagedEvent[]) => {
    setEvents(nextEvents)
    saveStoredEvents(nextEvents)
  }

  const updateEvent = (eventId: number, patch: Partial<ManagedEvent>) => {
    persistEvents(events.map((event) => (event.id === eventId ? { ...event, ...patch } : event)))
  }

  const addEvent = () => {
    if (!draft.title.trim()) return

    const nextEvent: ManagedEvent = {
      ...draft,
      id: Date.now(),
      spots: Number(draft.spots) || 0,
    }

    persistEvents([nextEvent, ...events])
    setDraft(emptyEvent)
  }

  const deleteEvent = (eventId: number) => {
    persistEvents(events.filter((event) => event.id !== eventId))
  }

  const resetEvents = () => {
    persistEvents(defaultEvents)
    setDraft(emptyEvent)
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" /> 回活動列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-3">活動與課程管理後台</h1>
          <p className="text-muted-foreground">
            這裡可以新增、編輯、隱藏或刪除前台顯示的活動內容。資料會暫存在目前瀏覽器。
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">新增活動</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="活動名稱"
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              />
              <select
                value={draft.audience}
                onChange={(event) => setDraft({ ...draft, audience: event.target.value as EventAudience })}
                className="border-input bg-background rounded-md border px-3 py-2 text-sm"
              >
                {Object.entries(eventAudienceLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Input
                placeholder="日期，例如 2026/06/12"
                value={draft.date}
                onChange={(event) => setDraft({ ...draft, date: event.target.value })}
              />
              <Input
                placeholder="時間，例如 14:00-16:00"
                value={draft.time}
                onChange={(event) => setDraft({ ...draft, time: event.target.value })}
              />
              <Input
                placeholder="地點"
                value={draft.location}
                onChange={(event) => setDraft({ ...draft, location: event.target.value })}
              />
              <Input
                type="number"
                placeholder="名額"
                value={draft.spots}
                onChange={(event) => setDraft({ ...draft, spots: Number(event.target.value) })}
              />
              <Textarea
                placeholder="活動說明"
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                className="md:col-span-2"
              />
            </div>
            <Button onClick={addEvent} className="mt-4" disabled={!draft.title.trim()}>
              <Plus className="h-4 w-4 mr-2" /> 新增到前台
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-foreground">目前活動</h2>
          <Button variant="outline" onClick={resetEvents}>
            還原預設內容
          </Button>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className={!event.visible ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={event.title}
                    onChange={(changeEvent) => updateEvent(event.id, { title: changeEvent.target.value })}
                  />
                  <select
                    value={event.audience}
                    onChange={(changeEvent) => updateEvent(event.id, { audience: changeEvent.target.value as EventAudience })}
                    className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                  >
                    {Object.entries(eventAudienceLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={event.date}
                    onChange={(changeEvent) => updateEvent(event.id, { date: changeEvent.target.value })}
                  />
                  <Input
                    value={event.time}
                    onChange={(changeEvent) => updateEvent(event.id, { time: changeEvent.target.value })}
                  />
                  <Input
                    value={event.location}
                    onChange={(changeEvent) => updateEvent(event.id, { location: changeEvent.target.value })}
                  />
                  <Input
                    type="number"
                    value={event.spots}
                    onChange={(changeEvent) => updateEvent(event.id, { spots: Number(changeEvent.target.value) })}
                  />
                  <Textarea
                    value={event.description}
                    onChange={(changeEvent) => updateEvent(event.id, { description: changeEvent.target.value })}
                    className="md:col-span-2"
                  />
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => updateEvent(event.id, { visible: !event.visible })}
                  >
                    {event.visible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {event.visible ? "隱藏" : "顯示"}
                  </Button>
                  <Button variant="outline" onClick={() => saveStoredEvents(events)}>
                    <Save className="h-4 w-4 mr-2" /> 儲存
                  </Button>
                  <Button variant="ghost" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="h-4 w-4 mr-2 text-destructive" /> 刪除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
