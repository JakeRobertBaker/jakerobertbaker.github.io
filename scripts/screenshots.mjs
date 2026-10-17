import { chromium } from "@playwright/test"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"

// Browser-only tooling: the caller owns the site server and its reload mechanism.
const { values } = parseArgs({
  options: {
    url: { type: "string" },
    target: { type: "string", default: "both" },
    preview: { type: "string", default: process.env.PREVIEW_URL ?? "http://127.0.0.1:8000" },
    live: { type: "string", default: "https://jakerobertbaker.github.io" },
    path: { type: "string", multiple: true },
    mode: { type: "string", default: "dark" },
    width: { type: "string", default: "390" },
    height: { type: "string", default: "844" },
    out: { type: "string", default: path.join(tmpdir(), "jake-notes-screenshots") },
    scenario: { type: "string" },
    full: { type: "boolean", default: false },
  },
})
if (!["both", "live", "preview"].includes(values.target))
  throw new Error("--target: both, live, or preview")
if (!["light", "dark"].includes(values.mode)) throw new Error("--mode: light or dark")
const viewport = { width: Number(values.width), height: Number(values.height) }
for (const size of Object.values(viewport))
  if (!Number.isInteger(size) || size < 1 || size > 10000)
    throw new Error("Viewport dimensions must be integers between 1 and 10000")
const states = values.scenario
  ? JSON.parse(await readFile(values.scenario, "utf8"))
  : [{ name: "page" }]
if (!Array.isArray(states) || states.length === 0)
  throw new Error("Scenario must be a nonempty array of {name, click?, waitFor?} states")
const names = new Set()
for (const state of states) {
  if (!state || !/^[a-z0-9_-]+$/i.test(state.name)) throw new Error("Invalid scenario state name")
  if (names.has(state.name)) throw new Error(`Duplicate scenario state: ${state.name}`)
  names.add(state.name)
  for (const key of ["click", "waitFor"])
    if (state[key] !== undefined && typeof state[key] !== "string" &&
        !(state[key] && typeof state[key] === "object" && !Array.isArray(state[key]) &&
          Object.values(state[key]).every((selector) => typeof selector === "string")))
      throw new Error(`${key} must be a selector or a map of target names to selectors`)
}
const targets = values.url
  ? [["site", values.url]]
  : (values.target === "both" ? ["live", "preview"] : [values.target])
      .map((target) => [target, values[target]])
const routes = values.path ?? [null]
for (const [, base] of targets) {
  for (const route of [null, ...routes]) {
    const url = route === null ? new URL(base) : new URL(route, base)
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("Only HTTP(S) URLs are supported")
  }
}
const output = path.resolve(values.out)
await mkdir(output, { recursive: true })
const reports = []
const browser = await chromium.launch()
try {
  for (const [target, base] of targets) {
    for (const [index, route] of routes.entries()) {
      // Fresh context per page: themes, menu state, and cookies do not leak between comparisons.
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        colorScheme: values.mode,
        reducedMotion: "reduce",
        serviceWorkers: "block",
      })
      const page = await context.newPage()
      const report = {
        target, url: route === null ? base : new URL(route, base).href,
        viewport, mode: values.mode, screenshots: [], errors: [], failedRequests: [],
      }
      reports.push(report)
      page.on("pageerror", (error) => report.errors.push(error.message))
      page.on("console", (message) => {
        if (message.type() === "error") report.errors.push(message.text())
      })
      page.on("requestfailed", (request) => report.failedRequests.push({
        url: request.url(), error: request.failure()?.errorText,
      }))
      page.on("response", (response) => {
        if (response.status() >= 400)
          report.errors.push(`HTTP ${response.status()}: ${response.url()}`)
      })
      try {
        const response = await page.goto(report.url, { waitUntil: "load" })
        if (!response?.ok()) throw new Error(`HTTP ${response?.status()}: ${report.url}`)
        await page.evaluate(() => document.fonts.ready)
        for (const state of states) {
          for (const action of ["click", "waitFor"]) {
            const selector = typeof state[action] === "string"
              ? state[action] : state[action]?.[target]
            if (selector) {
              const element = page.locator(selector)
              if (action === "click") await element.click()
              else await element.waitFor({ state: "visible" })
            }
          }
          const filename = path.join(output, `${target}-${values.mode}-${index + 1}-${state.name}.png`)
          await page.screenshot({ path: filename, fullPage: values.full, animations: "disabled" })
          report.screenshots.push(filename)
          console.log(filename)
        }
        report.finalUrl = page.url()
        report.documentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      } catch (error) {
        report.errors.push(error.message)
      } finally {
        await context.close()
      }
    }
  }
} finally {
  await browser.close()
  await writeFile(path.join(output, "report.json"), JSON.stringify(reports, null, 2) + "\n")
}
if (reports.some((report) => report.errors.length || report.failedRequests.length)) {
  console.error(`Browser errors: see ${path.join(output, "report.json")}`)
  process.exitCode = 1
}
