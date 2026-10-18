# Mathematical Book theme

The production default is **ET Book / standard 21px prose (1.3125rem) / wide 56rem article / fine rules / warm sepia / distinct statement-definition markers / on-demand subject index / scroll-away masthead / square serif controls / expanded desktop contents**. Light/dark/auto remains native Starlight. There are no experiment flags, comparison controls or theme-specific URL/session settings; old experimental query parameters are inert. Book styling and native disclosure work without JavaScript.

## Source map

| Location | Responsibility |
| --- | --- |
| `src/styles/book.css` | Approved typography, light/dark palette and mathematical/interface appearance. |
| `src/styles/notes.css` | Structural math/scrollers, topic cards and theorem-preview positioning. |
| `src/styles/navigation.css` | All masthead, persistent-control, sidebar and responsive contents geometry. |
| `src/components/PageFrame.astro`, `MobileMenuToggle.astro` | Small slot-forwarding native overrides; desktop subject-index controls. |
| `src/scripts/navigation.ts` | IntersectionObserver for masthead visibility; native sidebar popover on desktop. |
| `src/lib/heading-labels.mjs`, `src/route-data.ts` | Plain contents labels from the existing KaTeX MathML render, via cached Astro metadata and supported Starlight middleware. No changed heading HTML/IDs or second math renderer. |
| `tests/site/theme.spec.ts`, `tests/site/theme/` | Production-artifact visual contracts and representative captures, always included in CI. |

Local ET Book WOFFs in `src/assets/fonts/` are unmodified from [Tufte CSS](https://github.com/edwardtufte/tufte-css/tree/b5d7b7bbe5ce9c4c50fcfad4f19ee3646cfd7ae1/et-book); retain the published [MIT notice](../public/fonts/ET-Book-LICENSE.txt). No font CDN or extra package; KaTeX keeps its own fonts.

## Navigation contract

Breakpoints match pinned Starlight: **phone <50rem**, **compact desktop 50–72rem**, **wide >=72rem**.

- **Wide:** expanded contents on the right; subject-index trigger in an 11rem reading margin.
- **Compact:** index and native contents toggle share one row at top and after scrolling. Search/colour mode stay in the masthead; social links remain in the subject-menu footer. One surface protects prose below the persistent controls.
- **Phone:** native contents/current-section row and Menu/X. The sidebar starts below that persistent row, so its top-layer popover cannot cover its own close toggle. Increasing z-index cannot fix top-layer occlusion.

`--notes-header-offset` is the visible masthead; `--notes-sidebar-offset` is persistent space above the panel. They differ after scrolling on narrow screens. Derive control/panel positions together in `navigation.css`, not scroll-event geometry or scattered offsets. Starlight owns document scroll-padding: extra target margins double anchor offsets and disrupt current-section tracking.

Keep native Menu/X, `<details>`, popovers, focus/inert handling, Escape, hash links and current-section tracking. The script runs after Starlight's sidebar media listener. Re-test on framework upgrades: native IDs, footer utilities and breakpoints are version-specific. Don't vendor Starlight or rewrite article DOM. Block kinds/relationships belong in the [writing guide](example_template.md#semantic-mathematical-blocks); don't infer them from prose.

## Review

Follow [normal validation](../README.md#validation). `npm run test:site` includes the theme review against the built artifact with a Playwright-owned loopback server. For that subset only: `npm run build && npm run test:theme`. Captures/report are under ignored `test-results/`; CI uploads them on failure. Use [site preview](site-preview.md) and the visual-review skill for interactive inspection/reload checks.

Coverage includes light/dark math, nested/full-width blocks, native contents and clean mathematical labels, short compact desktops (800/960/1070/1151px), touch widths (320/360/390/430px), top/scrolled home/articles, actual close-button hit targets, resize/inert restoration, reading position, no-JS styling/disclosure and dark-mode printing. Keep artifacts outside published content. Use the README's branch/PR and tested-artifact deployment workflow.
