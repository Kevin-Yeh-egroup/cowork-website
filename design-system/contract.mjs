/**
 * Cowork Website executable design contract.
 *
 * This is JavaScript data on purpose: validators and tests import it directly.
 * It is not a prose design document and it does not prevent intentional
 * redesigns; update this contract and the implementation in the same change.
 */

export const designSystem = {
  meta: {
    name: "Cowork Website Design System",
    version: "1.0.0",
    baselineCommit: "73098230e76c383ad668e05dc48d30fd3c7db075",
    locale: "zh-TW",
  },
  typography: {
    sans: {
      family: "Noto Sans TC",
      cssVariable: "--font-noto-sans-tc",
      fallbacks: ["PingFang TC", "Microsoft JhengHei", "sans-serif"],
      weights: [400, 500, 600, 700],
    },
    scale: {
      bodySmall: "text-sm",
      body: "text-base",
      bodyLarge: "text-lg",
      heading3: "text-xl",
      heading2: "text-2xl",
      heading1: "text-3xl",
      display: "text-4xl",
    },
    contentRules: {
      longFormLineHeight: "leading-relaxed",
      heroHeadingLineHeight: "leading-tight",
      bodyMeasure: "max-w-3xl",
    },
  },
  colorTokens: {
    "--background": "oklch(0.985 0.015 62)",
    "--foreground": "oklch(0.28 0.055 318)",
    "--card": "oklch(0.998 0.006 62)",
    "--card-foreground": "oklch(0.28 0.055 318)",
    "--popover": "oklch(0.998 0.006 62)",
    "--popover-foreground": "oklch(0.28 0.055 318)",
    "--primary": "oklch(0.79 0.13 54)",
    "--primary-foreground": "oklch(1 0 0)",
    "--secondary": "oklch(0.955 0.035 323)",
    "--secondary-foreground": "oklch(0.33 0.07 318)",
    "--muted": "oklch(0.955 0.025 62)",
    "--muted-foreground": "oklch(0.52 0.035 318)",
    "--accent": "oklch(0.69 0.19 350)",
    "--accent-foreground": "oklch(1 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(1 0 0)",
    "--border": "oklch(0.91 0.025 62)",
    "--input": "oklch(0.94 0.025 62)",
    "--ring": "oklch(0.69 0.19 350)",
    "--radius": "1rem",
  },
  namedPaletteRoles: {
    warm: ["#fff0d6", "#d96b27"],
    rose: ["#ffe4ef", "#c81f72"],
    violet: ["#f0e7ff", "#7b4bd8"],
    sky: ["#e4f4ff", "#1f6f8f"],
    mint: ["#e7f7ef", "#237a56"],
    emergency: ["#ff78ad", "#e6005c"],
    illustration: ["#fff8ef"],
  },
  shape: {
    baseRadius: "1rem",
    card: "rounded-xl",
    compactControl: "rounded-md",
    focusRing: "focus-visible:ring-[3px]",
  },
  layout: {
    pageGutter: "px-4",
    pageVertical: ["py-8", "py-10", "py-12"],
    contentWidths: ["max-w-2xl", "max-w-3xl", "max-w-4xl", "max-w-5xl", "max-w-6xl", "max-w-7xl"],
    breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
    acceptanceViewports: {
      mobile: { width: 390, height: 844 },
      desktop: { width: 1440, height: 900 },
    },
  },
  accessibility: {
    documentLanguage: "zh-TW",
    minimumInteractiveHeight: 24,
    keyboardFocusToken: "focus-visible:ring-[3px]",
    horizontalOverflowAllowed: false,
    requiredRenderedTokens: ['<html lang="zh-TW"', "<h1", "font-sans"],
  },
}

export const pageFamilies = {
  home: {
    requiredAnySourceTokens: ["<h1", "max-w-6xl", "text-2xl", "sm:text-3xl", "lg:text-4xl"],
  },
  index: {
    requiredAnySourceTokens: ["<h1", "max-w-"],
  },
  detail: {
    requiredAnySourceTokens: ["<h1", "max-w-"],
  },
  assessment: {
    requiredAnySourceTokens: ["<h1", "max-w-2xl", "text-2xl"],
  },
  tool: {
    requiredAnySourceTokens: ["<h1", "max-w-"],
  },
  workspace: {
    requiredAnySourceTokens: ["<h1", "max-w-"],
  },
  auth: {
    requiredAnySourceTokens: ["<h1", "max-w-4xl"],
  },
  consultation: {
    requiredAnySourceTokens: ["<h1", "max-w-"],
  },
  admin: {
    requiredAnySourceTokens: ["<h1", "max-w-5xl"],
  },
  redirect: {
    requiredAnySourceTokens: ["redirect("],
  },
}

const route = (pattern, file, family, sourceFiles = [file]) => ({
  pattern,
  file,
  family,
  sourceFiles,
})

export const routePatterns = [
  route("/", "app/page.tsx", "home"),
  route("/ask-ai", "app/ask-ai/page.tsx", "tool"),
  route("/assessment", "app/assessment/page.tsx", "index"),
  route("/content", "app/content/page.tsx", "index"),
  route("/content/articles", "app/content/articles/page.tsx", "index"),
  route("/content/articles/unstable-income-work", "app/content/articles/unstable-income-work/page.tsx", "detail"),
  route("/content/column", "app/content/column/page.tsx", "index"),
  route("/content/newsletters", "app/content/newsletters/page.tsx", "index"),
  route("/content/podcast", "app/content/podcast/page.tsx", "index"),
  route("/events", "app/events/page.tsx", "index"),
  route("/events/admin", "app/events/admin/page.tsx", "admin"),
  route("/financial-anxiety", "app/financial-anxiety/page.tsx", "assessment", [
    "app/financial-anxiety/page.tsx",
    "components/assessment-flow.tsx",
  ]),
  route("/financial-resilience", "app/financial-resilience/page.tsx", "assessment", [
    "app/financial-resilience/page.tsx",
    "components/assessment-flow.tsx",
  ]),
  route("/fraud-defense", "app/fraud-defense/page.tsx", "assessment", [
    "app/fraud-defense/page.tsx",
    "components/assessment-flow.tsx",
  ]),
  route("/impact", "app/impact/page.tsx", "index"),
  route("/life-stages", "app/life-stages/page.tsx", "index"),
  route("/life-stages/[stage]", "app/life-stages/[stage]/page.tsx", "detail"),
  route("/life-topics", "app/life-topics/page.tsx", "index"),
  route("/life-topics/[category]/[situation]", "app/life-topics/[category]/[situation]/page.tsx", "detail"),
  route("/login", "app/login/page.tsx", "auth"),
  route("/media-reports", "app/media-reports/page.tsx", "index"),
  route("/online-consultation", "app/online-consultation/page.tsx", "consultation"),
  route("/online-consultation/apply", "app/online-consultation/apply/page.tsx", "consultation", [
    "app/online-consultation/apply/page.tsx",
    "app/toolbox/consultation/page.tsx",
    "components/intro-step.tsx",
  ]),
  route("/online-consultation/referral", "app/online-consultation/referral/page.tsx", "consultation", [
    "app/online-consultation/referral/page.tsx",
    "app/toolbox/consultation/page.tsx",
  ]),
  route(
    "/partner-review/familyfin-platform-architecture",
    "app/partner-review/familyfin-platform-architecture/page.tsx",
    "redirect",
  ),
  route("/personal-center", "app/personal-center/page.tsx", "workspace"),
  route("/scenarios", "app/scenarios/page.tsx", "index"),
  route("/scenarios/[category]/[situation]", "app/scenarios/[category]/[situation]/page.tsx", "detail"),
  route("/social-worker", "app/social-worker/page.tsx", "workspace"),
  route("/social-worker-tools", "app/social-worker-tools/page.tsx", "index"),
  route("/toolbox", "app/toolbox/page.tsx", "index"),
  route("/toolbox/accounting", "app/toolbox/accounting/page.tsx", "tool"),
  route("/toolbox/aid-association", "app/toolbox/aid-association/page.tsx", "tool", [
    "app/toolbox/aid-association/page.tsx",
    "app/toolbox/_components/alternative-debt-tool-draft.tsx",
  ]),
  route("/toolbox/car-loan", "app/toolbox/car-loan/page.tsx", "tool", [
    "app/toolbox/car-loan/page.tsx",
    "app/toolbox/_components/loan-tool-draft.tsx",
  ]),
  route("/toolbox/consultation", "app/toolbox/consultation/page.tsx", "consultation", [
    "app/toolbox/consultation/page.tsx",
    "components/intro-step.tsx",
  ]),
  route("/toolbox/credit-card", "app/toolbox/credit-card/page.tsx", "tool"),
  route("/toolbox/debt", "app/toolbox/debt/page.tsx", "tool"),
  route("/toolbox/financial-health-dashboard", "app/toolbox/financial-health-dashboard/page.tsx", "tool"),
  route("/toolbox/monthly-report", "app/toolbox/monthly-report/page.tsx", "tool"),
  route("/toolbox/mortgage", "app/toolbox/mortgage/page.tsx", "tool", [
    "app/toolbox/mortgage/page.tsx",
    "app/toolbox/_components/mortgage-tool-draft.tsx",
  ]),
  route("/toolbox/new-youth-loan", "app/toolbox/new-youth-loan/page.tsx", "tool", [
    "app/toolbox/new-youth-loan/page.tsx",
    "app/toolbox/_components/mortgage-tool-draft.tsx",
  ]),
  route("/toolbox/pawn-shop", "app/toolbox/pawn-shop/page.tsx", "tool", [
    "app/toolbox/pawn-shop/page.tsx",
    "app/toolbox/_components/alternative-debt-tool-draft.tsx",
  ]),
  route("/toolbox/personal-loan", "app/toolbox/personal-loan/page.tsx", "tool", [
    "app/toolbox/personal-loan/page.tsx",
    "app/toolbox/_components/loan-tool-draft.tsx",
  ]),
  route("/toolbox/planning", "app/toolbox/planning/page.tsx", "tool"),
  route("/toolbox/planning/quick", "app/toolbox/planning/quick/page.tsx", "tool", [
    "app/toolbox/planning/quick/page.tsx",
    "app/toolbox/planning/page.tsx",
  ]),
  route("/toolbox/simulator", "app/toolbox/simulator/page.tsx", "tool", [
    "app/toolbox/simulator/page.tsx",
    "components/intro-step.tsx",
  ]),
]

export const lifeStageSlugs = [
  "independent-life",
  "working-life",
  "single-parent-family",
  "family-caregiver",
  "health-challenge",
  "retirement-aging",
]

export const scenarioSlugs = {
  "work-income": [
    "first-job",
    "unstable-income",
    "career-transition",
    "recently-unemployed",
    "side-income",
    "retirement-prep",
  ],
  "debt-pressure": [
    "credit-card-revolving",
    "personal-loan",
    "mortgage-car-loan",
    "late-payment",
    "enforcement",
    "financial-anxiety",
  ],
  "fraud-risk": [
    "investment-fraud",
    "shopping-fraud",
    "romance-fraud",
    "job-fraud",
    "warning-account",
    "personal-data-safety",
  ],
  "health-care": [
    "self-illness",
    "family-illness",
    "major-illness",
    "long-term-care",
    "caregiving-leave",
    "medical-expense",
  ],
  "family-change": [
    "marriage-family",
    "childcare",
    "single-parent",
    "relationship-change",
    "moving-renting",
    "bereavement-change",
  ],
}

export const componentContracts = [
  {
    name: "button",
    file: "components/ui/button.tsx",
    requiredTokens: [
      'data-slot="button"',
      "rounded-md",
      "focus-visible:ring-[3px]",
      "bg-primary text-primary-foreground",
    ],
  },
  {
    name: "card",
    file: "components/ui/card.tsx",
    requiredTokens: ['data-slot="card"', "bg-card text-card-foreground", "rounded-xl", "shadow-sm"],
  },
  {
    name: "navigation",
    file: "components/navigation.tsx",
    requiredTokens: ["fixed top-0", "h-16", "border-b", "bg-background/90", 'aria-label="開啟網站選單"'],
  },
]

export const rawHexAllowlist = [
  "lib/design-system.ts",
  "app/layout.tsx",
]

function scenarioRoutes(prefix) {
  return Object.entries(scenarioSlugs).flatMap(([category, situations]) =>
    situations.map((situation) => `${prefix}/${category}/${situation}`),
  )
}

export function expandConcreteRoutes() {
  return routePatterns.flatMap(({ pattern, family }) => {
    if (pattern === "/life-stages/[stage]") {
      return lifeStageSlugs.map((stage) => ({
        path: `/life-stages/${stage}`,
        family,
        expectedStatus: 200,
      }))
    }

    if (pattern === "/life-topics/[category]/[situation]") {
      return scenarioRoutes("/life-topics").map((path) => ({ path, family, expectedStatus: 200 }))
    }

    if (pattern === "/scenarios/[category]/[situation]") {
      return scenarioRoutes("/scenarios").map((path) => ({ path, family, expectedStatus: 200 }))
    }

    if (pattern === "/partner-review/familyfin-platform-architecture") {
      return [{
        path: pattern,
        family,
        expectedStatus: 307,
        expectedLocation: "/partner-review/familyfin-platform-architecture/index.html",
      }]
    }

    return [{ path: pattern, family, expectedStatus: 200 }]
  })
}
