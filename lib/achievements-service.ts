import {
  achievementBadges,
  achievementMissions,
  achievementRules,
  achievementTitles,
  type AchievementBadge,
  type AchievementEventType,
  type AchievementMission,
  type AchievementRole,
  type AchievementTitle,
  type MissionStep,
} from "@/lib/achievements-data"

const achievementStorageKey = "cilia-achievement-state-v1"

export type AchievementEventInput = {
  userId: string
  role: AchievementRole
  eventType: AchievementEventType
  module: string
  objectType?: string
  objectId?: string
  caseId?: string
  metadata?: Record<string, string | number | boolean>
}

export type UserAchievementEvent = AchievementEventInput & {
  id: string
  occurredAt: string
}

export type UserBadgeRecord = {
  userId: string
  badgeCode: string
  sourceEventId: string
  earnedAt: string
  isSeen: boolean
}

export type UserMissionStepProgress = {
  userId: string
  missionId: string
  stepId: string
  currentCount: number
  requiredCount: number
  isCompleted: boolean
  completedAt?: string
  updatedAt: string
}

export type AchievementStoreState = {
  events: UserAchievementEvent[]
  userBadges: UserBadgeRecord[]
  missionProgress: UserMissionStepProgress[]
}

export type BadgeWithStatus = AchievementBadge & {
  earnedAt?: string
  isEarned: boolean
}

export type MissionStepWithProgress = MissionStep & {
  currentCount: number
  isCompleted: boolean
  completedAt?: string
}

export type MissionWithProgress = Omit<AchievementMission, "steps"> & {
  steps: MissionStepWithProgress[]
  completedSteps: number
  totalSteps: number
  progressPercent: number
  isCompleted: boolean
}

export type TitleCriterion = {
  label: string
  isCompleted: boolean
  current?: number
  required?: number
}

export type TitleWithStatus = AchievementTitle & {
  isEarned: boolean
  progressPercent: number
  criteria: TitleCriterion[]
}

export type UserAchievementState = {
  badges: BadgeWithStatus[]
  earnedBadges: BadgeWithStatus[]
  missions: MissionWithProgress[]
  events: UserAchievementEvent[]
  titles: TitleWithStatus[]
  earnedTitles: TitleWithStatus[]
  currentTitle?: TitleWithStatus
  nextTitle?: TitleWithStatus
}

const emptyState: AchievementStoreState = {
  events: [],
  userBadges: [],
  missionProgress: [],
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function readStore(): AchievementStoreState {
  if (!canUseStorage()) return emptyState

  const rawValue = window.localStorage.getItem(achievementStorageKey)

  if (!rawValue) return emptyState

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<AchievementStoreState>

    return {
      events: Array.isArray(parsedValue.events) ? parsedValue.events : [],
      userBadges: Array.isArray(parsedValue.userBadges) ? parsedValue.userBadges : [],
      missionProgress: Array.isArray(parsedValue.missionProgress) ? parsedValue.missionProgress : [],
    }
  } catch {
    return emptyState
  }
}

function writeStore(nextState: AchievementStoreState) {
  if (!canUseStorage()) return

  window.localStorage.setItem(achievementStorageKey, JSON.stringify(nextState))
}

function roleMatches(targetRole: AchievementBadge["targetRole"] | AchievementMission["targetRole"], role: AchievementRole) {
  return targetRole === "both" || targetRole === role
}

function metadataMatches(
  metadata: AchievementEventInput["metadata"] = {},
  condition: Record<string, string | number | boolean> = {},
) {
  return Object.entries(condition).every(([key, value]) => metadata[key] === value)
}

function getEventCount(events: UserAchievementEvent[], event: UserAchievementEvent, rule: (typeof achievementRules)[number]) {
  return events.filter((storedEvent) => {
    if (storedEvent.userId !== event.userId) return false
    if (storedEvent.role !== event.role) return false
    if (storedEvent.eventType !== rule.eventType) return false
    if (rule.targetModule && storedEvent.module !== rule.targetModule) return false

    return metadataMatches(storedEvent.metadata, rule.metadataCondition)
  }).length
}

function evaluateRule(
  state: AchievementStoreState,
  event: UserAchievementEvent,
  rule: (typeof achievementRules)[number],
) {
  const badge = achievementBadges.find((candidate) => candidate.code === rule.badgeCode)

  if (!badge) return false
  if (!roleMatches(badge.targetRole, event.role)) return false
  if (rule.targetModule && rule.targetModule !== event.module) return false
  if (!metadataMatches(event.metadata, rule.metadataCondition)) return false
  if (state.userBadges.some((record) => record.userId === event.userId && record.badgeCode === badge.code)) return false

  if (rule.ruleType === "single_event") return true
  if (rule.ruleType === "count_event") return getEventCount(state.events, event, rule) >= (rule.requiredCount ?? 1)

  return false
}

function updateMissionProgress(state: AchievementStoreState, event: UserAchievementEvent) {
  const updatedAt = event.occurredAt
  const nextProgress = [...state.missionProgress]

  achievementMissions
    .filter((mission) => roleMatches(mission.targetRole, event.role))
    .forEach((mission) => {
      mission.steps
        .filter((step) => step.requiredEventType === event.eventType)
        .filter((step) => !step.targetModule || step.targetModule === event.module)
        .forEach((step) => {
          const existingIndex = nextProgress.findIndex(
            (progress) =>
              progress.userId === event.userId &&
              progress.missionId === mission.id &&
              progress.stepId === step.id,
          )
          const existingProgress = existingIndex >= 0 ? nextProgress[existingIndex] : null
          const currentCount = Math.min((existingProgress?.currentCount ?? 0) + 1, step.requiredCount)
          const isCompleted = currentCount >= step.requiredCount
          const nextStepProgress: UserMissionStepProgress = {
            userId: event.userId,
            missionId: mission.id,
            stepId: step.id,
            currentCount,
            requiredCount: step.requiredCount,
            isCompleted,
            completedAt: existingProgress?.completedAt ?? (isCompleted ? event.occurredAt : undefined),
            updatedAt,
          }

          if (existingIndex >= 0) {
            nextProgress[existingIndex] = nextStepProgress
          } else {
            nextProgress.push(nextStepProgress)
          }
        })
    })

  return nextProgress
}

function evaluateBadges(state: AchievementStoreState, event: UserAchievementEvent) {
  const earnedAt = event.occurredAt
  const earnedBadges = achievementRules
    .filter((rule) => rule.eventType === event.eventType)
    .filter((rule) => evaluateRule(state, event, rule))
    .map<UserBadgeRecord>((rule) => ({
      userId: event.userId,
      badgeCode: rule.badgeCode,
      sourceEventId: event.id,
      earnedAt,
      isSeen: false,
    }))

  return [...state.userBadges, ...earnedBadges]
}

function countEvents(events: UserAchievementEvent[], eventType: AchievementEventType) {
  return events.filter((event) => event.eventType === eventType).length
}

function countEventsByModule(events: UserAchievementEvent[], module: string) {
  return events.filter((event) => event.module === module).length
}

function countActiveMonths(events: UserAchievementEvent[]) {
  return new Set(events.map((event) => event.occurredAt.slice(0, 7))).size
}

function createCriterion(label: string, current: number, required: number): TitleCriterion {
  return {
    label,
    current,
    required,
    isCompleted: current >= required,
  }
}

function evaluateTitle(
  title: AchievementTitle,
  role: AchievementRole,
  badges: BadgeWithStatus[],
  missions: MissionWithProgress[],
  events: UserAchievementEvent[],
) {
  const earnedBadges = badges.filter((badge) => badge.isEarned)
  const completedTaskCount = missions.reduce((total, mission) => total + mission.completedSteps, 0)
  const hasEarnedCategory = (category: AchievementBadge["category"]) =>
    earnedBadges.some((badge) => badge.category === category)
  const hasEarnedBadge = (badgeCode: string) => earnedBadges.some((badge) => badge.code === badgeCode)
  const healthCheckCount = countEvents(events, "health_check_completed")
  const recheckCount = countEvents(events, "health_recheck_completed")
  const caseCreatedCount = countEvents(events, "case_created")
  const caseNoteCount = countEvents(events, "case_note_created")
  const followupCount = countEvents(events, "case_followup_completed")
  const assistedHealthCheckCount = countEvents(events, "case_health_check_assisted")
  const learningCount = countEvents(events, "social_worker_learning_completed")
  const serviceEventCount = countEventsByModule(events, "case_history") + countEventsByModule(events, "social_worker")

  switch (title.code) {
    case "member_beginner": {
      const healthCriterion = createCriterion("完成 1 次財務健檢", healthCheckCount, 1)
      const badgeCriterion = createCriterion("或取得 3 枚一般會員獎章", earnedBadges.length, 3)
      const isEarned = healthCriterion.isCompleted || badgeCriterion.isCompleted

      return { isEarned, criteria: [healthCriterion, badgeCriterion] }
    }
    case "finance_organizer": {
      const categoryCount = [
        hasEarnedCategory("health_check"),
        hasEarnedCategory("knowledge"),
        hasEarnedCategory("tool"),
      ].filter(Boolean).length
      const criteria = [
        createCriterion("取得 8 枚一般會員獎章", earnedBadges.length, 8),
        createCriterion("含健檢、知識、工具各 1 枚", categoryCount, 3),
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "life_budgeter": {
      const criteria = [
        createCriterion("完成 5 個任務項目", completedTaskCount, 5),
        {
          label: "建立過 1 份預算或使用過預算工具",
          isCompleted: hasEarnedBadge("budget_tool_saved"),
          current: hasEarnedBadge("budget_tool_saved") ? 1 : 0,
          required: 1,
        },
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "stable_tracker": {
      const criteria = [
        createCriterion("3 個月份有使用紀錄", countActiveMonths(events), 3),
        createCriterion("完成 3 次回測或月回顧", recheckCount, 3),
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "member_practitioner": {
      const criteria = [
        createCriterion("取得 25 枚獎章", earnedBadges.length, 25),
        createCriterion("完成 15 個任務項目", completedTaskCount, 15),
        {
          label: "完成年度財務回顧",
          isCompleted: hasEarnedBadge("year_end_review_badge"),
          current: hasEarnedBadge("year_end_review_badge") ? 1 : 0,
          required: 1,
        },
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "social_companion_beginner": {
      const caseCriterion = createCriterion("新增 1 位個案", caseCreatedCount, 1)
      const badgeCriterion = createCriterion("或取得 3 枚社工獎章", earnedBadges.length, 3)
      const isEarned = caseCriterion.isCompleted || badgeCriterion.isCompleted

      return { isEarned, criteria: [caseCriterion, badgeCriterion] }
    }
    case "case_recorder": {
      const criteria = [
        createCriterion("建立 10 筆個案歷程紀要", caseNoteCount, 10),
        createCriterion("完成 3 次追蹤", followupCount, 3),
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "health_check_companion": {
      const criteria = [createCriterion("協助 5 位個案完成財務健檢", assistedHealthCheckCount, 5)]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "social_professional_practitioner": {
      const criteria = [
        createCriterion("完成 5 個社工學習模組", learningCount, 5),
        createCriterion("取得 15 枚社工獎章", earnedBadges.length, 15),
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    case "social_worker_expert": {
      const criteria = [
        createCriterion("取得 25 枚社工獎章", earnedBadges.length, 25),
        createCriterion("完成 50 次服務事件", serviceEventCount, 50),
      ]

      return { isEarned: criteria.every((criterion) => criterion.isCompleted), criteria }
    }
    default:
      return {
        isEarned: false,
        criteria:
          role === "member"
            ? [createCriterion("取得一般會員獎章", earnedBadges.length, 1)]
            : [createCriterion("取得社工獎章", earnedBadges.length, 1)],
      }
  }
}

function getTitleProgress(criteria: TitleCriterion[]) {
  if (criteria.length === 0) return 0

  const totalProgress = criteria.reduce((sum, criterion) => {
    if (!criterion.required) return sum + (criterion.isCompleted ? 1 : 0)

    return sum + Math.min((criterion.current ?? 0) / criterion.required, 1)
  }, 0)

  return Math.round((totalProgress / criteria.length) * 100)
}

export function getAchievementState(userId: string, role: AchievementRole): UserAchievementState {
  const store = readStore()
  const userEvents = store.events.filter((event) => event.userId === userId && event.role === role)
  const userBadgeRecords = store.userBadges.filter((record) => record.userId === userId)
  const badges = achievementBadges
    .filter((badge) => roleMatches(badge.targetRole, role))
    .sort((firstBadge, secondBadge) => firstBadge.sortOrder - secondBadge.sortOrder)
    .map<BadgeWithStatus>((badge) => {
      const earnedRecord = userBadgeRecords.find((record) => record.badgeCode === badge.code)

      return {
        ...badge,
        earnedAt: earnedRecord?.earnedAt,
        isEarned: Boolean(earnedRecord),
      }
    })
  const missions = achievementMissions
    .filter((mission) => roleMatches(mission.targetRole, role))
    .sort((firstMission, secondMission) => firstMission.sortOrder - secondMission.sortOrder)
    .map<MissionWithProgress>((mission) => {
      const steps = [...mission.steps]
        .sort((firstStep, secondStep) => firstStep.sortOrder - secondStep.sortOrder)
        .map<MissionStepWithProgress>((step) => {
          const progress = store.missionProgress.find(
            (candidate) => candidate.userId === userId && candidate.missionId === mission.id && candidate.stepId === step.id,
          )

          return {
            ...step,
            currentCount: progress?.currentCount ?? 0,
            isCompleted: progress?.isCompleted ?? false,
            completedAt: progress?.completedAt,
          }
        })
      const completedSteps = steps.filter((step) => step.isCompleted).length
      const totalSteps = steps.length

      return {
        ...mission,
        steps,
        completedSteps,
        totalSteps,
        progressPercent: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
        isCompleted: totalSteps > 0 && completedSteps === totalSteps,
      }
    })
  const titles = achievementTitles
    .filter((title) => roleMatches(title.targetRole, role))
    .sort((firstTitle, secondTitle) => firstTitle.levelOrder - secondTitle.levelOrder)
    .map<TitleWithStatus>((title) => {
      const titleResult = evaluateTitle(title, role, badges, missions, userEvents)

      return {
        ...title,
        isEarned: titleResult.isEarned,
        criteria: titleResult.criteria,
        progressPercent: getTitleProgress(titleResult.criteria),
      }
    })
  const earnedTitles = titles.filter((title) => title.isEarned)

  return {
    badges,
    earnedBadges: badges.filter((badge) => badge.isEarned),
    missions,
    events: userEvents,
    titles,
    earnedTitles,
    currentTitle: earnedTitles.at(-1),
    nextTitle: titles.find((title) => !title.isEarned),
  }
}

export function recordAchievementEvent(input: AchievementEventInput) {
  const occurredAt = new Date().toISOString()
  const event: UserAchievementEvent = {
    ...input,
    id: `${input.userId}-${input.eventType}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    occurredAt,
  }
  const currentState = readStore()
  const stateWithEvent: AchievementStoreState = {
    ...currentState,
    events: [event, ...currentState.events],
  }
  const stateWithProgress: AchievementStoreState = {
    ...stateWithEvent,
    missionProgress: updateMissionProgress(stateWithEvent, event),
  }
  const nextState: AchievementStoreState = {
    ...stateWithProgress,
    userBadges: evaluateBadges(stateWithProgress, event),
  }

  writeStore(nextState)

  return getAchievementState(input.userId, input.role)
}

export function resetAchievementState() {
  writeStore(emptyState)
}

export function resetUserAchievementState(userId: string, role: AchievementRole) {
  const currentState = readStore()
  const nextState: AchievementStoreState = {
    events: currentState.events.filter((event) => event.userId !== userId || event.role !== role),
    userBadges: currentState.userBadges.filter((badge) => badge.userId !== userId),
    missionProgress: currentState.missionProgress.filter((progress) => progress.userId !== userId),
  }

  writeStore(nextState)
}
