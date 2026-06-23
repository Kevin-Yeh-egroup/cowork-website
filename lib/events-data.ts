export type EventAudience = "public" | "social-worker"

export interface ManagedEvent {
  id: number
  audience: EventAudience
  title: string
  description: string
  date: string
  time: string
  location: string
  spots: number
  visible: boolean
}

export const eventAudienceLabels: Record<EventAudience, string> = {
  public: "一般民眾",
  "social-worker": "社工",
}

export const eventsStorageKey = "familyfinhealth-events"

export const defaultEvents: ManagedEvent[] = [
  {
    id: 1,
    audience: "public",
    title: "財務健檢工作坊",
    description: "學習如何檢視自己的財務狀況，找出問題並制定改善計畫",
    date: "2026/05/15",
    time: "14:00-17:00",
    location: "線上",
    spots: 30,
    visible: true,
  },
  {
    id: 2,
    audience: "public",
    title: "記帳新手入門",
    description: "從零開始學習記帳，建立良好的財務習慣",
    date: "2026/05/22",
    time: "19:00-21:00",
    location: "線上",
    spots: 50,
    visible: true,
  },
  {
    id: 3,
    audience: "public",
    title: "債務管理實戰班",
    description: "了解債務整合選項，制定還款計畫",
    date: "2026/06/01",
    time: "14:00-17:00",
    location: "台北市社福中心",
    spots: 20,
    visible: true,
  },
  {
    id: 4,
    audience: "social-worker",
    title: "財務社工培訓課程",
    description: "學習如何協助個案處理財務問題",
    date: "2026/05/20",
    time: "09:00-17:00",
    location: "線上",
    spots: 40,
    visible: true,
  },
  {
    id: 5,
    audience: "social-worker",
    title: "財務評估工具使用訓練",
    description: "熟悉平台各項評估工具的使用方式",
    date: "2026/05/28",
    time: "14:00-16:00",
    location: "線上",
    spots: 30,
    visible: true,
  },
]

export function getStoredEvents() {
  if (typeof window === "undefined") {
    return defaultEvents
  }

  const stored = window.localStorage.getItem(eventsStorageKey)
  if (!stored) {
    return defaultEvents
  }

  try {
    const parsedEvents = JSON.parse(stored) as ManagedEvent[]

    return Array.isArray(parsedEvents) && parsedEvents.length > 0 ? parsedEvents : defaultEvents
  } catch {
    return defaultEvents
  }
}

export function saveStoredEvents(events: ManagedEvent[]) {
  window.localStorage.setItem(eventsStorageKey, JSON.stringify(events))
}
