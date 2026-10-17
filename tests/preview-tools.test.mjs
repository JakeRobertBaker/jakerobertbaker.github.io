import test from "node:test"
import assert from "node:assert/strict"
import http from "node:http"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const exec = promisify(execFile)
const script = fileURLToPath(new URL("../scripts/screenshots.mjs", import.meta.url))

test("screenshots work against an arbitrary server, with isolated comparisons and interaction", async () => {
  const out = await mkdtemp(path.join(tmpdir(), "preview-tools-test-"))
  const server = http.createServer((request, response) => {
    if (request.url === "/missing") {
      response.writeHead(404).end("Missing")
      return
    }
    response.setHeader("Content-Type", "text/html")
    response.end(`<!doctype html><meta name="viewport" content="width=device-width">
      <h1>Framework-independent preview</h1>
      <details><summary>Proof</summary><p id="statement">A mathematical statement.</p></details>`)
  })
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const scenario = path.join(out, "scenario.json")
    await writeFile(scenario, JSON.stringify([
      { name: "initial", waitFor: "h1" },
      { name: "proof", click: { live: "summary", preview: "summary" }, waitFor: "#statement" },
    ]))
    await exec(process.execPath, [script, "--target", "both", "--live", base, "--preview", base,
      "--scenario", scenario, "--out", out], { timeout: 60000 })
    const reports = JSON.parse(await readFile(path.join(out, "report.json"), "utf8"))
    assert.equal(reports.length, 2)
    for (const report of reports) {
      assert.deepEqual(report.errors, [])
      assert.deepEqual(report.failedRequests, [])
      assert.equal(report.screenshots.length, 2)
      assert.equal(report.viewport.width, 390)
      const png = await readFile(report.screenshots[0])
      assert.equal(png.subarray(1, 4).toString(), "PNG")
      assert.equal(png.readUInt32BE(16), 390)
      assert.equal(png.readUInt32BE(20), 844)
    }
    await assert.rejects(exec(process.execPath, [script, "--url", `${base}/missing`, "--out", out]),
      (error) => error.code === 1)
    const failed = JSON.parse(await readFile(path.join(out, "report.json"), "utf8"))
    assert.match(failed[0].errors.join("\n"), /HTTP 404/)
    await exec(process.execPath, [script, "--url", `${base}/note?test=1`, "--mode", "light",
      "--width", "1440", "--height", "1000", "--out", out])
    const [desktop] = JSON.parse(await readFile(path.join(out, "report.json"), "utf8"))
    assert.equal(desktop.url, `${base}/note?test=1`)
    assert.equal(desktop.viewport.width, 1440)
    assert.equal(desktop.mode, "light")
    await assert.rejects(exec(process.execPath, [script, "--width", "NaN"]), /Viewport dimensions/)
    await assert.rejects(exec(process.execPath, [script, "--url", "file:///etc/passwd"]), /HTTP\(S\)/)
    await assert.rejects(exec(process.execPath, [script, "--url", base, "--path", "file:///etc/passwd"]), /HTTP\(S\)/)
    await writeFile(scenario, JSON.stringify([{ name: "same" }, { name: "same" }]))
    await assert.rejects(exec(process.execPath, [script, "--url", base, "--scenario", scenario]), /Duplicate scenario state/)
  } finally {
    await new Promise((resolve) => server.close(resolve))
    await rm(out, { recursive: true, force: true })
  }
})
