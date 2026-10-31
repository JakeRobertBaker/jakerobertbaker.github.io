---
name: site-visual-review
description: Inspect local, LAN, or public website previews using Playwright MCP and repeatable screenshots. Use for mathematics rendering, navigation, search, responsive layout, live reload, and visual regressions, regardless of site framework.
---

# Site visual review

Read `instructions/site-preview.md` at the repository root and follow it.

Use the project's Playwright MCP (`.pi/mcp.json`, also `.mcp.json`; discover its deferred tools through tool search) for exploration, and `npm run screenshots` for matched comparison batches. Read the PNGs and `report.json`; generating images is not reviewing them. Keep viewport, theme, route, scroll position and menu state matched between targets.
