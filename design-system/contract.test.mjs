import assert from "node:assert/strict"
import test from "node:test"

import {
  designSystem,
  expandConcreteRoutes,
  pageFamilies,
  routePatterns,
} from "./contract.mjs"
import { runAudit } from "../scripts/check-design-system.mjs"

test("contract covers the 46 route patterns and 109 concrete routes", () => {
  const concreteRoutes = expandConcreteRoutes()
  assert.equal(routePatterns.length, 46)
  assert.equal(concreteRoutes.length, 109)
  assert.equal(new Set(concreteRoutes.map((route) => route.path)).size, 109)
})

test("every route references a defined page family", () => {
  for (const route of routePatterns) {
    assert.ok(pageFamilies[route.family], `${route.pattern} uses undefined family ${route.family}`)
  }
})

test("mobile and desktop acceptance viewports straddle the responsive breakpoints", () => {
  const { acceptanceViewports, breakpoints } = designSystem.layout
  assert.ok(acceptanceViewports.mobile.width < breakpoints.sm)
  assert.ok(acceptanceViewports.desktop.width >= breakpoints.xl)
})

test("the repository conforms to the executable design contract", async () => {
  const result = await runAudit()
  assert.equal(result.ok, true, result.errors.join("\n"))
})
