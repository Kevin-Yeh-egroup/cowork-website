import { designSystem, expandConcreteRoutes } from "../design-system/contract.mjs"

function readOption(name, fallback) {
  const index = process.argv.indexOf(name)
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

const baseUrl = readOption("--base-url", process.env.DESIGN_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "")
const concurrency = Math.max(1, Number(readOption("--concurrency", "8")) || 8)
const routes = expandConcreteRoutes()
const results = new Array(routes.length)
let cursor = 0

async function inspectRoute(route) {
  const response = await fetch(`${baseUrl}${route.path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
  })
  const location = response.headers.get("location")
  const contentType = response.headers.get("content-type") ?? ""
  const errors = []
  const html = route.expectedStatus === 200 ? await response.text() : ""

  if (response.status !== route.expectedStatus) {
    errors.push(`status ${response.status}; expected ${route.expectedStatus}`)
  }
  if (route.expectedLocation && location !== route.expectedLocation) {
    errors.push(`location "${location}"; expected "${route.expectedLocation}"`)
  }
  if (route.expectedStatus === 200 && !contentType.includes("text/html")) {
    errors.push(`content-type "${contentType}"; expected text/html`)
  }
  if (route.expectedStatus === 200) {
    for (const token of designSystem.accessibility.requiredRenderedTokens) {
      if (!html.includes(token)) errors.push(`rendered HTML is missing "${token}"`)
    }
    if (html.includes("data-next-error")) errors.push("rendered HTML contains a Next.js error marker")
  }

  return { ...route, ok: errors.length === 0, errors }
}

async function worker() {
  while (true) {
    const index = cursor++
    if (index >= routes.length) return
    try {
      results[index] = await inspectRoute(routes[index])
    } catch (error) {
      results[index] = {
        ...routes[index],
        ok: false,
        errors: [error instanceof Error ? error.message : String(error)],
      }
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, routes.length) }, () => worker()))

const failures = results.filter((result) => !result.ok)
if (failures.length > 0) {
  console.error(`Route acceptance FAIL — ${failures.length}/${routes.length} route(s) failed at ${baseUrl}`)
  for (const failure of failures) console.error(`- ${failure.path}: ${failure.errors.join("; ")}`)
  process.exitCode = 1
} else {
  console.log(`Route acceptance PASS — ${routes.length}/${routes.length} routes matched status and content contracts at ${baseUrl}`)
}
