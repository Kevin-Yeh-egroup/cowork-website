import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  componentContracts,
  designSystem,
  expandConcreteRoutes,
  pageFamilies,
  rawHexAllowlist,
  routePatterns,
} from "../design-system/contract.mjs"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const defaultRoot = path.resolve(scriptDirectory, "..")
const toPosix = (value) => value.split(path.sep).join("/")

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name)
      return entry.isDirectory() ? walk(target) : [target]
    }),
  )
  return nested.flat()
}

function routePatternFromFile(relativeFile) {
  if (relativeFile === "app/page.tsx") return "/"
  return `/${relativeFile.replace(/^app\//, "").replace(/\/page\.tsx$/, "")}`
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function readRelative(root, relativeFile, errors) {
  try {
    return await readFile(path.join(root, ...relativeFile.split("/")), "utf8")
  } catch (error) {
    errors.push(`${relativeFile}: cannot read source (${error.code ?? error.message})`)
    return ""
  }
}

function compareSets(actual, expected, actualLabel, expectedLabel, errors) {
  const actualSet = new Set(actual)
  const expectedSet = new Set(expected)

  for (const value of actualSet) {
    if (!expectedSet.has(value)) errors.push(`${actualLabel} is not registered in ${expectedLabel}: ${value}`)
  }
  for (const value of expectedSet) {
    if (!actualSet.has(value)) errors.push(`${expectedLabel} has no matching ${actualLabel}: ${value}`)
  }
}

export async function runAudit({ root = defaultRoot } = {}) {
  const errors = []
  const warnings = []

  const appFiles = (await walk(path.join(root, "app")))
    .map((file) => toPosix(path.relative(root, file)))
    .filter((file) => file.endsWith("/page.tsx") || file === "app/page.tsx")
    .sort()

  const actualPatterns = appFiles.map(routePatternFromFile)
  const contractedPatterns = routePatterns.map((entry) => entry.pattern)
  compareSets(actualPatterns, contractedPatterns, "page route", "design contract", errors)

  if (new Set(contractedPatterns).size !== contractedPatterns.length) {
    errors.push("design contract contains duplicate route patterns")
  }

  for (const entry of routePatterns) {
    if (!pageFamilies[entry.family]) {
      errors.push(`${entry.pattern}: unknown page family "${entry.family}"`)
      continue
    }

    const contents = await Promise.all(entry.sourceFiles.map((file) => readRelative(root, file, errors)))
    const combinedSource = contents.join("\n")
    for (const token of pageFamilies[entry.family].requiredAnySourceTokens) {
      if (!combinedSource.includes(token)) {
        errors.push(`${entry.pattern}: family "${entry.family}" requires token "${token}" in its render sources`)
      }
    }
  }

  const globalCss = await readRelative(root, "app/globals.css", errors)
  for (const [token, expectedValue] of Object.entries(designSystem.colorTokens)) {
    const match = globalCss.match(new RegExp(`${escapeRegExp(token)}\\s*:\\s*([^;]+);`))
    const actualValue = match?.[1]?.trim()
    if (!actualValue) {
      errors.push(`app/globals.css: missing ${token}`)
    } else if (actualValue !== expectedValue) {
      errors.push(`app/globals.css: ${token} is "${actualValue}", expected "${expectedValue}"`)
    }
  }

  const layout = await readRelative(root, "app/layout.tsx", errors)
  const font = designSystem.typography.sans
  const expectedFontStack = `--font-sans: var(${font.cssVariable}), '${font.fallbacks[0]}', '${font.fallbacks[1]}', ${font.fallbacks[2]};`
  for (const token of [
    "Noto_Sans_TC",
    `variable: "${font.cssVariable}"`,
    `${font.weights.map(String).map((weight) => `"${weight}"`).join(", ")}`,
    'className={`${notoSansTC.variable} font-sans antialiased`}',
    `<html lang="${designSystem.meta.locale}"`,
  ]) {
    if (!layout.includes(token)) errors.push(`app/layout.tsx: font/document contract is missing "${token}"`)
  }
  if (!globalCss.includes(expectedFontStack)) {
    errors.push(`app/globals.css: expected font stack "${expectedFontStack}"`)
  }

  for (const component of componentContracts) {
    const source = await readRelative(root, component.file, errors)
    for (const token of component.requiredTokens) {
      if (!source.includes(token)) errors.push(`${component.file}: ${component.name} contract requires "${token}"`)
    }
  }

  const sourceRoots = ["app", "components", "lib"]
  const sourceFiles = (
    await Promise.all(
      sourceRoots.map(async (directory) =>
        (await walk(path.join(root, directory))).filter((file) => /\.(?:ts|tsx)$/.test(file)),
      ),
    )
  ).flat()
  const allowedHexValues = new Set(
    Object.values(designSystem.namedPaletteRoles).flat().map((value) => value.toLowerCase()),
  )

  for (const file of sourceFiles) {
    const relativeFile = toPosix(path.relative(root, file))
    const source = await readFile(file, "utf8")
    const rawHexValues = [...source.matchAll(/#[0-9a-fA-F]{6,8}\b/g)].map((match) => match[0].toLowerCase())
    if (rawHexValues.length === 0) continue

    if (!rawHexAllowlist.includes(relativeFile)) {
      errors.push(`${relativeFile}: raw colours must use named roles from lib/design-system.ts (${[...new Set(rawHexValues)].join(", ")})`)
      continue
    }

    for (const value of rawHexValues) {
      if (!allowedHexValues.has(value)) {
        errors.push(`${relativeFile}: raw colour ${value} is not declared in namedPaletteRoles`)
      }
    }
  }

  const concreteRoutes = expandConcreteRoutes()
  const concretePaths = concreteRoutes.map((entry) => entry.path)
  if (new Set(concretePaths).size !== concretePaths.length) {
    errors.push("expanded concrete route list contains duplicate paths")
  }
  if (concreteRoutes.length !== 109) {
    errors.push(`expanded route inventory has ${concreteRoutes.length} routes; expected 109`)
  }

  const packageJson = JSON.parse(await readRelative(root, "package.json", errors))
  const expectedScripts = {
    "design:check": "node scripts/check-design-system.mjs",
    "design:check:routes": "node scripts/check-design-routes.mjs",
    "design:test": "node --test design-system/*.test.mjs",
  }
  for (const [name, command] of Object.entries(expectedScripts)) {
    if (packageJson.scripts?.[name] !== command) {
      errors.push(`package.json: script "${name}" must be "${command}"`)
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      pagePatterns: routePatterns.length,
      concreteRoutes: concreteRoutes.length,
      pageFamilies: Object.keys(pageFamilies).length,
      componentContracts: componentContracts.length,
      semanticColorTokens: Object.keys(designSystem.colorTokens).length,
    },
  }
}

function printHuman(result) {
  if (result.ok) {
    console.log(
      `Design System PASS — ${result.stats.pagePatterns} page patterns / ${result.stats.concreteRoutes} routes / ${result.stats.pageFamilies} families / ${result.stats.semanticColorTokens} semantic tokens`,
    )
    return
  }

  console.error(`Design System FAIL — ${result.errors.length} violation(s)`)
  for (const error of result.errors) console.error(`- ${error}`)
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  const result = await runAudit()
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    printHuman(result)
  }
  if (!result.ok) process.exitCode = 1
}
