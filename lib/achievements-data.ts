export type AchievementRole = "member" | "social_worker"

export type AchievementTargetRole = AchievementRole | "both"

export type AchievementCategory =
  | "health_check"
  | "knowledge"
  | "tool"
  | "habit"
  | "goal_management"
  | "seasonal_calendar"
  | "social_service"
  | "service_quality"
  | "followup"
  | "learning"

export type AchievementEventType =
  | "health_check_completed"
  | "health_recheck_completed"
  | "article_read"
  | "article_favorited"
  | "tool_used"
  | "tool_result_saved"
  | "daily_accounting_completed"
  | "goal_created"
  | "red_envelope_plan_completed"
  | "tax_ready_completed"
  | "year_end_review_completed"
  | "case_created"
  | "case_note_created"
  | "case_followup_completed"
  | "case_health_check_assisted"
  | "case_referral_completed"
  | "social_worker_learning_completed"

export type AchievementRuleType = "single_event" | "count_event" | "consecutive_event" | "mission_completed"

export type BadgeLevel = "bronze" | "silver" | "gold"

export type AchievementBadge = {
  id: string
  code: string
  name: string
  description: string
  category: AchievementCategory
  targetRole: AchievementTargetRole
  level: BadgeLevel
  iconLabel: string
  sortOrder: number
}

export type AchievementRule = {
  id: string
  badgeCode: string
  ruleType: AchievementRuleType
  eventType: AchievementEventType
  requiredCount?: number
  consecutiveDays?: number
  targetModule?: string
  metadataCondition?: Record<string, string | number | boolean>
}

export type MissionStep = {
  id: string
  stepKey: string
  title: string
  description: string
  requiredEventType: AchievementEventType
  requiredCount: number
  targetModule?: string
  targetUrl?: string
  sortOrder: number
}

export type AchievementMission = {
  id: string
  code: string
  title: string
  description: string
  category: AchievementCategory
  targetRole: AchievementTargetRole
  rewardBadgeCode?: string
  isMonthly: boolean
  sortOrder: number
  steps: MissionStep[]
}

export type AchievementTitle = {
  id: string
  code: string
  name: string
  description: string
  targetRole: AchievementTargetRole
  levelOrder: number
  iconLabel: string
  requirements: string[]
}

export const currentMemberId = "demo-member"
export const currentSocialWorkerId = "demo-social-worker"

export const achievementTitles: AchievementTitle[] = [
  {
    id: "title-member-beginner",
    code: "member_beginner",
    name: "好理家在初心者",
    description: "開始認識自己的財務狀況。",
    targetRole: "member",
    levelOrder: 10,
    iconLabel: "初",
    requirements: ["完成 1 次財務健檢，或取得 3 枚一般會員獎章"],
  },
  {
    id: "title-member-organizer",
    code: "finance_organizer",
    name: "財務整理者",
    description: "不只看見問題，也開始整理生活財務。",
    targetRole: "member",
    levelOrder: 20,
    iconLabel: "整",
    requirements: ["取得 8 枚一般會員獎章", "至少包含健檢、知識、工具各 1 枚獎章"],
  },
  {
    id: "title-member-budgeter",
    code: "life_budgeter",
    name: "生活預算者",
    description: "開始為生活事件與日常支出做安排。",
    targetRole: "member",
    levelOrder: 30,
    iconLabel: "預",
    requirements: ["完成 5 個任務項目", "建立過 1 份預算或使用過預算工具"],
  },
  {
    id: "title-member-stable-tracker",
    code: "stable_tracker",
    name: "穩定追蹤者",
    description: "建立穩定追蹤自己財務狀態的習慣。",
    targetRole: "member",
    levelOrder: 40,
    iconLabel: "穩",
    requirements: ["連續或累積 3 個月份有使用紀錄", "完成 3 次回測或月回顧"],
  },
  {
    id: "title-member-practitioner",
    code: "member_practitioner",
    name: "好理家在實踐者",
    description: "已能穩定使用工具與任務來管理生活財務。",
    targetRole: "member",
    levelOrder: 50,
    iconLabel: "實",
    requirements: ["取得 25 枚獎章", "完成 15 個任務項目", "完成年度財務回顧"],
  },
  {
    id: "title-social-beginner",
    code: "social_companion_beginner",
    name: "陪伴初心者",
    description: "開始使用好理家工具陪伴個案。",
    targetRole: "social_worker",
    levelOrder: 10,
    iconLabel: "陪",
    requirements: ["新增 1 位個案，或取得 3 枚社工獎章"],
  },
  {
    id: "title-social-recorder",
    code: "case_recorder",
    name: "個案紀錄者",
    description: "穩定累積個案服務與追蹤紀錄。",
    targetRole: "social_worker",
    levelOrder: 20,
    iconLabel: "錄",
    requirements: ["建立 10 筆個案歷程紀要", "完成 3 次追蹤"],
  },
  {
    id: "title-social-health-companion",
    code: "health_check_companion",
    name: "財務健檢陪伴者",
    description: "能熟悉運用財務健檢工具協助個案。",
    targetRole: "social_worker",
    levelOrder: 30,
    iconLabel: "健",
    requirements: ["協助 5 位個案完成財務健檢"],
  },
  {
    id: "title-social-practitioner",
    code: "social_professional_practitioner",
    name: "社工專業實踐者",
    description: "穩定結合知識、工具與服務紀錄。",
    targetRole: "social_worker",
    levelOrder: 40,
    iconLabel: "專",
    requirements: ["完成 5 個社工學習模組", "取得 15 枚社工獎章"],
  },
  {
    id: "title-social-expert",
    code: "social_worker_expert",
    name: "好理家在社工專家",
    description: "能成熟運用好理家系統進行財務社工服務。",
    targetRole: "social_worker",
    levelOrder: 50,
    iconLabel: "家",
    requirements: ["取得 25 枚社工獎章", "完成 50 次服務事件"],
  },
]

export const achievementBadges: AchievementBadge[] = [
  {
    id: "badge-member-first-health-check",
    code: "first_health_check",
    name: "初次健檢章",
    description: "完成第一次財務健檢，開始掌握自己的財務狀態。",
    category: "health_check",
    targetRole: "member",
    level: "bronze",
    iconLabel: "健",
    sortOrder: 10,
  },
  {
    id: "badge-member-first-article",
    code: "first_article_read",
    name: "知識起步章",
    description: "閱讀第一篇財務知識文章。",
    category: "knowledge",
    targetRole: "member",
    level: "bronze",
    iconLabel: "知",
    sortOrder: 20,
  },
  {
    id: "badge-member-first-favorite",
    code: "first_article_favorite",
    name: "收藏起步章",
    description: "收藏第一篇想再次查看的文章。",
    category: "knowledge",
    targetRole: "member",
    level: "bronze",
    iconLabel: "藏",
    sortOrder: 30,
  },
  {
    id: "badge-member-first-tool",
    code: "first_tool_used",
    name: "工具初體驗章",
    description: "使用第一個財務工具，將想法轉成可操作的紀錄。",
    category: "tool",
    targetRole: "member",
    level: "bronze",
    iconLabel: "工",
    sortOrder: 40,
  },
  {
    id: "badge-member-budget-saved",
    code: "budget_tool_saved",
    name: "預算規劃章",
    description: "使用預算工具並儲存試算結果。",
    category: "tool",
    targetRole: "member",
    level: "silver",
    iconLabel: "預",
    sortOrder: 50,
  },
  {
    id: "badge-member-accounting-first",
    code: "first_accounting",
    name: "記帳起步章",
    description: "完成第一次記帳。",
    category: "habit",
    targetRole: "member",
    level: "bronze",
    iconLabel: "記",
    sortOrder: 60,
  },
  {
    id: "badge-member-health-recheck-start",
    code: "health_recheck_start",
    name: "回測起步章",
    description: "完成第一次財務回測，開始追蹤狀態變化。",
    category: "health_check",
    targetRole: "member",
    level: "bronze",
    iconLabel: "回",
    sortOrder: 65,
  },
  {
    id: "badge-member-accounting-seven",
    code: "accounting_7_days",
    name: "記帳 7 日章",
    description: "累積完成 7 次記帳，建立穩定紀錄習慣。",
    category: "habit",
    targetRole: "member",
    level: "silver",
    iconLabel: "7",
    sortOrder: 70,
  },
  {
    id: "badge-member-health-recheck-three",
    code: "health_recheck_3",
    name: "穩定追蹤章",
    description: "累積完成 3 次財務回測，穩定掌握自己的變化。",
    category: "health_check",
    targetRole: "member",
    level: "silver",
    iconLabel: "穩",
    sortOrder: 80,
  },
  {
    id: "badge-member-debt-tool",
    code: "debt_tool_used",
    name: "債務看清章",
    description: "使用債務或貸款試算工具，看清還款壓力。",
    category: "tool",
    targetRole: "member",
    level: "bronze",
    iconLabel: "債",
    sortOrder: 90,
  },
  {
    id: "badge-member-first-goal",
    code: "first_goal_created",
    name: "目標起步章",
    description: "建立第一個財務目標，把想法整理成可追蹤的行動。",
    category: "goal_management",
    targetRole: "member",
    level: "bronze",
    iconLabel: "標",
    sortOrder: 100,
  },
  {
    id: "badge-member-red-envelope-plan",
    code: "red_envelope_plan",
    name: "紅包準備章",
    description: "春節前完成紅包預算，提前安排人情支出。",
    category: "seasonal_calendar",
    targetRole: "member",
    level: "bronze",
    iconLabel: "包",
    sortOrder: 110,
  },
  {
    id: "badge-member-tax-ready",
    code: "tax_ready_badge",
    name: "稅務安心章",
    description: "完成報稅資料整理任務。",
    category: "seasonal_calendar",
    targetRole: "member",
    level: "silver",
    iconLabel: "稅",
    sortOrder: 120,
  },
  {
    id: "badge-member-year-end-review",
    code: "year_end_review_badge",
    name: "年末回顧章",
    description: "完成年度收支與目標回顧。",
    category: "seasonal_calendar",
    targetRole: "member",
    level: "gold",
    iconLabel: "年",
    sortOrder: 130,
  },
  {
    id: "badge-social-first-case",
    code: "sw_first_case",
    name: "初次服務章",
    description: "建立第一位服務個案。",
    category: "social_service",
    targetRole: "social_worker",
    level: "bronze",
    iconLabel: "案",
    sortOrder: 210,
  },
  {
    id: "badge-social-first-note",
    code: "sw_first_case_note",
    name: "紀錄起步章",
    description: "建立第一次個案歷程紀要。",
    category: "social_service",
    targetRole: "social_worker",
    level: "bronze",
    iconLabel: "錄",
    sortOrder: 220,
  },
  {
    id: "badge-social-health-check-assisted",
    code: "sw_health_check_assisted",
    name: "健檢陪伴章",
    description: "協助個案完成財務健檢。",
    category: "service_quality",
    targetRole: "social_worker",
    level: "bronze",
    iconLabel: "陪",
    sortOrder: 230,
  },
  {
    id: "badge-social-first-followup",
    code: "sw_first_followup",
    name: "追蹤起步章",
    description: "完成第一次個案追蹤。",
    category: "followup",
    targetRole: "social_worker",
    level: "bronze",
    iconLabel: "追",
    sortOrder: 240,
  },
  {
    id: "badge-social-referral",
    code: "sw_referral_completed",
    name: "資源轉介章",
    description: "完成一次資源轉介紀錄。",
    category: "service_quality",
    targetRole: "social_worker",
    level: "silver",
    iconLabel: "介",
    sortOrder: 250,
  },
  {
    id: "badge-social-learning",
    code: "sw_first_learning",
    name: "專業起步章",
    description: "完成第一個社工學習模組。",
    category: "learning",
    targetRole: "social_worker",
    level: "bronze",
    iconLabel: "學",
    sortOrder: 260,
  },
]

export const achievementMissions: AchievementMission[] = [
  {
    id: "mission-member-monthly-growth",
    code: "member_monthly_growth",
    title: "本月財務成長任務",
    description: "從健檢、知識與工具三個面向整理本月財務狀態。",
    category: "seasonal_calendar",
    targetRole: "member",
    rewardBadgeCode: "first_tool_used",
    isMonthly: true,
    sortOrder: 10,
    steps: [
      {
        id: "step-member-health-check",
        stepKey: "health_check",
        title: "完成財務健檢",
        description: "查看目前財務狀態與下一步建議。",
        requiredEventType: "health_check_completed",
        requiredCount: 1,
        targetModule: "health_check",
        targetUrl: "/assessment",
        sortOrder: 10,
      },
      {
        id: "step-member-article",
        stepKey: "article_read",
        title: "閱讀一篇財務文章",
        description: "補充一個本月最需要的財務知識。",
        requiredEventType: "article_read",
        requiredCount: 1,
        targetModule: "knowledge_base",
        targetUrl: "/content/articles",
        sortOrder: 20,
      },
      {
        id: "step-member-goal",
        stepKey: "goal_created",
        title: "建立一個財務目標",
        description: "把想整理的財務方向拆成金額與每月行動。",
        requiredEventType: "goal_created",
        requiredCount: 1,
        targetModule: "goal_management",
        targetUrl: "/toolbox/planning",
        sortOrder: 40,
      },
    ],
  },
  {
    id: "mission-member-seasonal-calendar",
    code: "member_seasonal_calendar",
    title: "生活財務行事曆",
    description: "用生活事件整理紅包、報稅與年末回顧。",
    category: "seasonal_calendar",
    targetRole: "member",
    rewardBadgeCode: "year_end_review_badge",
    isMonthly: true,
    sortOrder: 15,
    steps: [
      {
        id: "step-member-red-envelope",
        stepKey: "red_envelope_plan",
        title: "完成紅包預算",
        description: "盤點春節前的人情支出。",
        requiredEventType: "red_envelope_plan_completed",
        requiredCount: 1,
        targetModule: "seasonal_calendar",
        sortOrder: 10,
      },
      {
        id: "step-member-tax-ready",
        stepKey: "tax_ready",
        title: "完成報稅資料整理",
        description: "整理扣繳憑單、扶養與扣除額資料。",
        requiredEventType: "tax_ready_completed",
        requiredCount: 1,
        targetModule: "seasonal_calendar",
        sortOrder: 20,
      },
      {
        id: "step-member-year-end-review",
        stepKey: "year_end_review",
        title: "完成年末回顧",
        description: "回顧年度收支、目標與下一步。",
        requiredEventType: "year_end_review_completed",
        requiredCount: 1,
        targetModule: "seasonal_calendar",
        sortOrder: 30,
      },
    ],
  },
  {
    id: "mission-member-budget-tool",
    code: "member_budget_tool",
    title: "預算規劃任務",
    description: "完成預算試算並儲存結果。",
    category: "tool",
    targetRole: "member",
    rewardBadgeCode: "budget_tool_saved",
    isMonthly: false,
    sortOrder: 18,
    steps: [
      {
        id: "step-member-tool",
        stepKey: "tool_used",
        title: "使用一個財務工具",
        description: "把想法轉成具體試算或紀錄。",
        requiredEventType: "tool_used",
        requiredCount: 1,
        targetModule: "tool_library",
        targetUrl: "/toolbox",
        sortOrder: 30,
      },
      {
        id: "step-member-budget-saved",
        stepKey: "budget_saved",
        title: "儲存預算試算結果",
        description: "留下本次預算安排與可調整的空間。",
        requiredEventType: "tool_result_saved",
        requiredCount: 1,
        targetModule: "tool_library",
        sortOrder: 40,
      },
    ],
  },
  {
    id: "mission-social-service-month",
    code: "social_service_month",
    title: "本月服務品質任務",
    description: "以紀錄、追蹤與專業學習維持個案服務品質。",
    category: "social_service",
    targetRole: "social_worker",
    rewardBadgeCode: "sw_first_learning",
    isMonthly: true,
    sortOrder: 20,
    steps: [
      {
        id: "step-social-case-note",
        stepKey: "case_note",
        title: "更新個案歷程",
        description: "留下會談摘要、服務狀態與下次追蹤方向。",
        requiredEventType: "case_note_created",
        requiredCount: 1,
        targetModule: "case_history",
        sortOrder: 10,
      },
      {
        id: "step-social-followup",
        stepKey: "case_followup",
        title: "完成個案追蹤",
        description: "確認個案近期財務風險與生活變化。",
        requiredEventType: "case_followup_completed",
        requiredCount: 1,
        targetModule: "case_history",
        sortOrder: 20,
      },
      {
        id: "step-social-health-check-assisted",
        stepKey: "health_check_assisted",
        title: "協助完成財務健檢",
        description: "陪同個案完成一次財務健檢。",
        requiredEventType: "case_health_check_assisted",
        requiredCount: 1,
        targetModule: "case_history",
        sortOrder: 25,
      },
      {
        id: "step-social-referral",
        stepKey: "case_referral",
        title: "完成資源轉介",
        description: "記錄一次福利、債務或法律等資源轉介。",
        requiredEventType: "case_referral_completed",
        requiredCount: 1,
        targetModule: "case_history",
        sortOrder: 30,
      },
      {
        id: "step-social-learning",
        stepKey: "social_learning",
        title: "完成專業學習",
        description: "完成一個社工財務知能學習單元。",
        requiredEventType: "social_worker_learning_completed",
        requiredCount: 1,
        targetModule: "social_worker",
        targetUrl: "/events#social-worker",
        sortOrder: 40,
      },
    ],
  },
]

export const achievementRules: AchievementRule[] = [
  {
    id: "rule-first-health-check",
    badgeCode: "first_health_check",
    ruleType: "single_event",
    eventType: "health_check_completed",
  },
  {
    id: "rule-knowledge-starter",
    badgeCode: "first_article_read",
    ruleType: "single_event",
    eventType: "article_read",
  },
  {
    id: "rule-favorite-starter",
    badgeCode: "first_article_favorite",
    ruleType: "single_event",
    eventType: "article_favorited",
  },
  {
    id: "rule-tool-starter",
    badgeCode: "first_tool_used",
    ruleType: "single_event",
    eventType: "tool_used",
  },
  {
    id: "rule-budget-starter",
    badgeCode: "budget_tool_saved",
    ruleType: "single_event",
    eventType: "tool_result_saved",
    targetModule: "tool_library",
    metadataCondition: { tool_code: "budget" },
  },
  {
    id: "rule-accounting-starter",
    badgeCode: "first_accounting",
    ruleType: "single_event",
    eventType: "daily_accounting_completed",
  },
  {
    id: "rule-accounting-seven",
    badgeCode: "accounting_7_days",
    ruleType: "count_event",
    eventType: "daily_accounting_completed",
    requiredCount: 7,
  },
  {
    id: "rule-health-recheck-start",
    badgeCode: "health_recheck_start",
    ruleType: "single_event",
    eventType: "health_recheck_completed",
  },
  {
    id: "rule-health-recheck-three",
    badgeCode: "health_recheck_3",
    ruleType: "count_event",
    eventType: "health_recheck_completed",
    requiredCount: 3,
  },
  {
    id: "rule-debt-tool-used",
    badgeCode: "debt_tool_used",
    ruleType: "single_event",
    eventType: "tool_used",
    targetModule: "tool_library",
    metadataCondition: { tool_category: "debt" },
  },
  {
    id: "rule-first-goal-created",
    badgeCode: "first_goal_created",
    ruleType: "single_event",
    eventType: "goal_created",
  },
  {
    id: "rule-red-envelope-plan",
    badgeCode: "red_envelope_plan",
    ruleType: "single_event",
    eventType: "red_envelope_plan_completed",
  },
  {
    id: "rule-tax-ready",
    badgeCode: "tax_ready_badge",
    ruleType: "single_event",
    eventType: "tax_ready_completed",
  },
  {
    id: "rule-year-end-review",
    badgeCode: "year_end_review_badge",
    ruleType: "single_event",
    eventType: "year_end_review_completed",
  },
  {
    id: "rule-social-first-case",
    badgeCode: "sw_first_case",
    ruleType: "single_event",
    eventType: "case_created",
  },
  {
    id: "rule-social-note-starter",
    badgeCode: "sw_first_case_note",
    ruleType: "single_event",
    eventType: "case_note_created",
  },
  {
    id: "rule-social-health-check-assisted",
    badgeCode: "sw_health_check_assisted",
    ruleType: "single_event",
    eventType: "case_health_check_assisted",
  },
  {
    id: "rule-social-first-followup",
    badgeCode: "sw_first_followup",
    ruleType: "single_event",
    eventType: "case_followup_completed",
  },
  {
    id: "rule-social-referral",
    badgeCode: "sw_referral_completed",
    ruleType: "single_event",
    eventType: "case_referral_completed",
  },
  {
    id: "rule-social-learning",
    badgeCode: "sw_first_learning",
    ruleType: "single_event",
    eventType: "social_worker_learning_completed",
  },
]
