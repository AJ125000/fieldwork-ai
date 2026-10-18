# Fieldwork UI audit (ui-ux-pro-max, pro-rules pre-delivery checklist)

Scope: all 8 screens + shared components. Brand tokens, fonts, wording, nav and visual style untouched. Reviewer console still has no preselected decision.
Checks: `tsc --noEmit` passes. ESLint is not installed or configured in this project, so it was not run.

## Passed as-is
Touch targets (all controls >= 44px, most 48px); global `:focus-visible` ring plus on-dark variant; global `prefers-reduced-motion`; icon-only buttons labelled; decorative icons `aria-hidden`; state never colour-only (icon + words); form fields labelled; fonts via next/font; no raster images so next/image not needed.

## Findings

| # | Screen / component | Rule | Severity | Status |
|---|---|---|---|---|
| 1 | Root layout, TopBar, camera top, Sheet | Safe areas: `env(safe-area-inset-*)` was used but `viewport-fit=cover` was missing, so insets were always 0; no top inset | High | Fixed (viewportFit cover, top/bottom insets) |
| 2 | Item, Deal, Draft, Case | Two `<h1>` per page (TopBar title + page heading) | Medium | Fixed (`TopBar titleAs="p"`) |
| 3 | ClaimRow, EvidenceBadge | Heading levels skipped (h2 to h4, h1 to h3) | Medium | Fixed (h3, h2) |
| 4 | Button | `white-space: nowrap` can overflow 375px with long labels (e.g. "Request a callback instead of waiting") | High | Fixed (wraps; single-line height unchanged) |
| 5 | Chip answers (Draft, Case) | `role="radio"` without arrow-key behaviour | Medium | Fixed (`onRadioGroupKeyDown`) |
| 6 | All routes | No per-page `<title>` (WCAG 2.4.2) | Medium | Fixed (title template + route metadata) |
| 7 | Sell capture timer | `aria-label` on a plain `<p>` is unreliable | Low | Fixed (sr-only text) |
| 8 | Tokens: `--fw-text-quiet` #737B76 | Contrast 4.10 on Paper, 3.79 on Parchment, 3.59 on Inset (needs 4.5). Used for t-quiet, placeholders, inactive Stepper labels | High | Needs design decision |
| 9 | Tokens: Differs fg on bg | #A65342 on #F4E4DE = 4.32 (StatusTag, ResultCard label) | Medium | Needs design decision |
| 10 | Tokens: Can't tell fg on bg | #8A6A2E on #F1E9D5 = 4.15; on Parchment 4.38 | Medium | Needs design decision |
| 11 | Case "Appeal this decision" | Button has no action | Medium | Needs product decision |
| 12 | No `loading.tsx` / `error.tsx` / `not-found.tsx` | Missing system states (needs copy + design) | Medium | Needs design decision |
| 13 | Handover "Preview result" links | Dev-only nav visible in the UI | Low | Needs decision (hide for demo?) |
| 14 | Deal, Draft confirm/undo | Focus is lost when the focused button is swapped | Low | Open |
| 15 | Sheet (modal) | Page behind not inert, no scroll lock | Low | Open |
| 16 | Tabs | Tabpanels not focusable | Low | Open |
| 17 | sell, draft, deal, case, review | Whole page is a client component (could split) | Low | Open |

## Needs Akshat's decision
1. `--fw-text-quiet` fails AA on every surface (darken to about #666E69 for 4.5:1 on Parchment, or restrict to large or decorative use).
2. Differs and Can't tell foreground-on-tint fail AA at small sizes (fg slightly darker, or use Ink text with the icon carrying the colour).
3. Loading, error and not-found screens: copy and design.
4. Appeal action behaviour; whether to hide the handover preview links.
