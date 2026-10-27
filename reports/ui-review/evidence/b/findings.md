# Assessment B — independent detector and browser evidence

Target: `app/` and `components/` in EvalForge, served from `http://127.0.0.1:3000`. Read-only application review on 2026-10-27. No other review findings were read. This is the independent B input for the parent's synthesis, not a replacement for Assessment A.

## Method and limits

- Browser: a fresh, isolated Playwright Chromium 1243 instance and context, with fresh local storage; desktop 1440×1000 and phone 390×844. User browser was not accessed. Native CUA was unavailable according to the parent's preflight, so the standalone browser was the fallback. Browser was headless: screenshots are saved, but no human-visible browser tab or detector overlay was presented.
- Looked at landing, dashboard, practice catalog, practice audit/attempt workspace, OA catalog/workspace, mock landing/session, empty mock results, and local confirmation/key/sign-in modals. Exercised search with no results, tab/focus/Escape, modal open/close, responsive layout, and pointer hit testing. Local session creation was allowed in the disposable browser only. No sign-in, AI call, real submission, or cloud-write action was performed.
- Full-page and viewport PNGs were actually viewed. Prefer the `*-viewport.png` images when assessing phone legibility; tall full-page images are scaled down by viewers. `dashboard-desktop.png` and `practice-workspace-desktop.png` are early loading captures, not persistent-loading defects; use their `*-settled.png` replacements.
- Existing PRD.md and README.md provided product context. No PRODUCT.md/DESIGN.md or critique ignore list was found in the inspected root. Parent owns target-slug handling and final persistence.

## Deterministic detector: unavailable after a real attempt

Ran exactly once:

```text
C:\Users\mridu\.codex\skills\impeccable\scripts\impeccable.cmd detect --json app components
```

Observed stderr:

```text
impeccable: engine 0.1.18 is not installed; cannot create cache directory: "C:\Users\mridu\.impeccable\bin\0.1.18"
Engine 0.1.18 setup needs network access and write permission to "C:\Users\mridu\.impeccable\bin\0.1.18".
Run this launcher ("C:\Users\mridu\.codex\skills\impeccable\scripts\impeccable.cmd") with engine-probe in a terminal that has those permissions, then retry the original command.
Alternatively, set IMPECCABLE_HOME to a writable cache location, or IMPECCABLE_BIN to a preinstalled engine binary.
```

There is no detector JSON, count, rule list, or clean result. Counts/rules/false positives are **unavailable**, not zero. Context was not rerun. No engine installation was attempted. Browser script/title mutation preflight succeeded and was restored, but the missing engine prevented live-server/detect.js use; no detector overlay was injected and no detector browser-console findings exist.

## Priority issues supported by browser evidence

### B1 — P1: the phone mock exam hides its only route to the audit form

**Browser-reproduced, 390×844, `/assessment/session`.** The header occupies y=56–167. The Audit Form button occupies x=199, y=124, w=170, h=36, directly beneath the higher-layer Finish Exam control. `elementFromPoint` at its center returns the `FINISH EXAM` span. Playwright's trial pointer click repeatedly failed because the assessment header intercepted pointer events. The two mobile workspace tabs are absent from the screenshot even though they exist in the DOM. A phone user cannot reliably reach the form to answer the exam through the visible UI.

Source: `components/assessment/AssessmentHeader.tsx:38` uses `sticky top-14 z-40`; `app/assessment/session/page.tsx:179` uses `sticky top-[106px] z-20`, while the global navbar is deliberately hidden for this route. A two-row mobile header exceeds the assumed 50px height.

Evidence: `assessment-session-phone-viewport.png`; exact measured/hit-test summary in `browser-notes.json`.

Fix: make the exam header and mobile tab strip one sticky stack at top 0, or derive the tab offset from the actual responsive header height. Verify both tabs by pointer at 390px and after scrolling. Suggested command: `$impeccable adapt`.

### B2 — P1: sign-in modal renders above the viewport with its title and close control inaccessible

**Browser-reproduced, 390×844, `/` → Sign In.** The modal panel spans y=-195 to 275; its heading spans y=-90 to -34. The screenshot shows only the lower portion of the dialog at the page top, while the background page remains exposed. The title and close control are offscreen. Escape also leaves it open.

Source: `components/auth/UserDropdown.tsx:124` renders AuthModal beneath the navbar. `components/layout/Navbar.tsx` header has `backdrop-blur-md`; `components/auth/AuthModal.tsx:36` uses a fixed overlay inside that backdrop-filter ancestor. The ancestor creates the containing context for the fixed overlay, so it centers relative to the navbar area rather than the viewport.

Evidence: `auth-modal-phone-viewport.png`, `auth-rect.json`. This conclusion uses measured panel geometry, not a font-dependent aesthetic judgment.

Fix: portal dialogs to a root outside filtered/sticky ancestors, with viewport positioning and bounded scrollable contents. Suggested command: `$impeccable harden`.

### B3 — P1: dark button gradients override intended white CTA backgrounds, leaving black labels on dark surfaces

**Browser-reproduced, desktop and phone.** The practice catalog's Launch Mock Test and all OA track Start buttons look inactive/unreadable. The settled audit workspace also shows Submit Evaluation with a black label on a dark raised button. Computed style for Launch Mock Test: `color: rgb(0, 0, 0)`, `backgroundColor: rgba(0, 0, 0, 0)`; the visible background is the dark `.neu-button` gradient. This is independent of the unavailable custom fonts.

Source: `app/globals.css:74` `.neu-button` supplies a dark `background` shorthand; `app/practice/page.tsx:269` and `app/oa/page.tsx:281` combine it with `bg-white text-black`. The audit form submit button shares the same visual failure in `components/review-studio/EvaluationForm.tsx` near its final submit control.

Evidence: `practice-desktop-settled.png`, `practice-phone.png`, `oa-desktop.png`, `practice-workspace-desktop-settled.png`.

Fix: define an explicit primary button variant that owns both foreground and background, and stop stacking conflicting background classes. Audit all enabled primary actions for contrast, including hover/focus states. Suggested command: `$impeccable audit`.

### B4 — P1: modal keyboard behavior allows interaction with the obscured page

**Browser-reproduced.** Opening the Gemini key modal leaves focus on its page trigger. Escape does not close it. Twelve subsequent Tab presses visit Add Question, Launch Mock Test, Start Foundational 5, status filters, search, selects, and topic filters **outside** the modal. It has `role=dialog`/`aria-modal=true`, but these do not implement focus containment. Opening sign-in similarly leaves focus on Sign In, has zero dialog-role elements, and does not respond to Escape. OA pre-submit and mock final-submission modals also have zero dialog-role elements; OA pre-submit remains open after Escape.

Source: `components/practice/GeminiApiKeyModal.tsx:147`, `components/auth/AuthModal.tsx:36`, `components/oa/PreSubmitModal.tsx` overlay, `app/assessment/session/page.tsx:252`. Auth close icon has no accessible name.

Evidence: `api-key-modal-desktop.png`, `browser-notes.json`, `auth-modal-phone-viewport.png`, `oa-presubmit-phone-viewport.png`, `assessment-submit-modal-phone-viewport.png`.

Fix: use a single dialog primitive with initial focus, Tab containment, Escape dismissal, focus restoration, meaningful dialog title, and named close control. Suggested command: `$impeccable harden`.

### B5 — P1: important form controls lack programmatic labels; the phone Run action has no name

**Browser/DOM-reproduced, desktop and 390px.** Practice's difficulty and language selects have no `<label>`, `aria-label`, id, or other programmatic naming. The bug report line-number input, severity select, and description textarea also have empty `.labels` and no ARIA name. Most Big-O labels are visual siblings without `htmlFor`. In the OA phone toolbar, Run's text is hidden below `sm`; the remaining icon-only button has no title or aria-label and appears as a nameless button in the accessibility snapshot. Practice pagination arrows likewise have no accessible names. This prevents reliable screen-reader operation of primary task controls.

Source: `app/practice/page.tsx:444`, `:455`, `:467`, `:646`, `:675`; `components/review-studio/EvaluationForm.tsx:309`, `:321`, `:347`, `:443`; `components/oa/OANavbar.tsx` Run button with `hidden sm:inline` text.

Evidence: `records.json` field/control records, `practice-form-phone-bugs.png`, `oa-workspace-phone-viewport.png`.

Fix: connect visible labels to every input/select and add stable names to icon buttons at every breakpoint. Expose selected verdict/tab/filter state with `aria-pressed` or the appropriate native radio/tab pattern. Suggested command: `$impeccable audit`.

## Additional concrete issues

- **B6 — P2, source-confirmed:** code-line citation is mouse-only. `components/review-studio/CodeViewer.tsx:100–125` makes table rows clickable and reveals “Cite L…” on hover, but rows have no focusability, keyboard handler, or control role. Provide a keyboard-operable per-line cite button or alternate line-selection control. No claim of a screen-reader test with NVDA was made.
- **B7 — P2, browser-reproduced at 390px:** three verdict choices each become a 308×308 square, so merely reviewing the three choices takes over 900px of vertical content before submission. The first viewport shows one option plus only the start of the second. Source: `EvaluationForm.tsx:207`, `:235`, `:263` uses `aspect-square` inside a one-column phone grid. Convert mobile choices to compact radio rows; retain one clear selected state. Evidence: `practice-form-phone-viewport.png` and `practice-workspace-phone-form.png`.
- **B8 — P2, browser-reproduced at 390px:** OA pre-submit status badges take the entire row width, collapsing the problem-title column to nearly zero; the screenshot has only Q1/Q2 and fragments of points/difficulty beside wide “0/2 Tests Passed (Failing Tests)” badges. The user cannot identify the affected problem at the decision to submit. Source: `PreSubmitModal.tsx:151–172` combines a shrinking title column and `shrink-0` status badge in a horizontal row. Stack status below title on phone. Evidence: `oa-presubmit-phone-viewport.png`.
- **B9 — P2, browser-reproduced empty dashboard:** a fresh guest with zero audits immediately receives “NOT READY” and six red “CRITICAL DEFICIT” judgments. These are displayed before any measurement, alongside “0 verified” and “0 audits.” Use an unassessed state with one recommended starting audit, then show scored judgments after evidence exists. Source: `app/dashboard/page.tsx` and `components/dashboard/ReadinessProfileCard.tsx` / readiness progress components. Evidence: `dashboard-desktop-settled.png`.
- **B10 — P2, source-confirmed:** saved-question navigation status uses `answeredQuestionIds.includes(\`q_${idx}\`)` in `components/assessment/AssessmentHeader.tsx:53`, while `app/assessment/session/page.tsx:172` supplies actual IDs such as `q_conc_001`. Answered pills cannot reliably reflect saved progress. Fix by passing each actual question ID to the header. This was not verified by submitting an answer; no submission was made.
- **B11 — P2, browser/source-supported product issue:** the auditing task leaks its expected finding before the learner reviews it: titles include “Window Boundary Bug,” catalog defect badges reveal verdict/type, the code sample includes an explicit “Subtle Bug” comment, and the default form selects Fatal Logic Bug. Source also preloads the true expected line and optimal complexity (`EvaluationForm.tsx` initial state). If this is intended as guided teaching, label it as such and provide a blind audit mode; for screening practice, reveal defect/answer information after submission. Evidence: `practice-workspace-desktop-settled.png`, `practice-desktop-settled.png`. Whether to preserve guided mode is a product decision.

## External-resource observations: qualify these carefully

### Editor

In `/practice/q_slide_001?mode=attempt`, the editor still displayed “Loading...” after a first 4-second observation and a later 8-second observation. There were zero `.monaco-editor` elements. The actual requested script was `https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs/loader.js`; it failed with `net::ERR_NETWORK_ACCESS_DENIED` and transferred 0 bytes. The OA workspace uses the same externally loaded editor and showed the same loading fallback.

**This is a verified failure under this sandbox's blocked external-network condition, not proof that the production editor fails on an unrestricted connection.** The application does not turn this known load failure into a retry/error/fallback editor state. The code still uses `@monaco-editor/react` defaults in `PracticeAttemptWorkspace.tsx` and `MonacoCodeEditor.tsx`. Fix plan: bundle/self-host the editor loader and workers where feasible; provide a bounded loading period, failure message, retry, and basic text editor fallback.

Evidence: `practice-attempt-desktop-delayed.png`, `oa-workspace-phone-viewport.png`, and `resource-errors.json`.

### Fonts

Google Fonts stylesheet failed with `net::ERR_NETWORK_ACCESS_DENIED`. `document.fonts` had only unloaded Next dev-tool Geist faces; Hanken Grotesk, JetBrains Mono, and Space Grotesk were not loaded. The screenshots therefore show fallback typography. Some components use only `font-['Hanken_Grotesk']`, without an explicit generic fallback, which explains the serif fallback visible on several labels and metrics.

**Do not describe the observed serif face as the intended product typography, and do not infer intended line breaks from it.** A robust product should still define complete local fallback stacks or self-host fonts; the measured clipping, hit-test interception, and CTA color errors remain independently supported.

Source: `app/globals.css:1`, `:26–35`; arbitrary Hanken font classes throughout the reviewed components. Evidence: `resource-errors.json` and font observations above.

## Working checks and strengths

- Desktop/phone catalogs and landing did not show broad document overflow; measured widths were 1440 and 390 respectively. Practice workspace had only a 1px excess at 390px, not a major horizontal-layout failure.
- Search with `zzz_no_match` produced a clear no-results message and suggested clearing/changing filters, rather than a blank list. Evidence: `practice-empty-desktop.png`.
- Mock final submission visibly states answered count and warns that unsubmitted problems score 0; OA pre-submit presents a warning and a return action. These are useful error-prevention patterns once modal access and narrow layouts are repaired.
- Practice has a dedicated phone Code/Form/Assistant switcher, which works in that route; the mock route's separate sticky implementation is the broken one.

## Suggested sequence for the parent's fix plan

1. Repair viewport/dialog placement and the mock mobile sticky stack; validate phone pointer paths into and out of forms.
2. Consolidate primary button variants and modal behavior; cover keyboard focus, labels, and named mobile actions.
3. Make OA confirmation rows and verdict choices compact on phone; repair saved-question status IDs.
4. Handle unassessed metrics and separate guided versus blind review tasks.
5. Harden font/editor loading and then visually recheck typography on an unrestricted or locally served asset path.

## Run notes for parent synthesis

- Independent B only; no A findings were read or transmitted.
- Detector genuinely attempted, unavailable due missing 0.1.18 engine and cache/network restrictions. No deterministic finding counts/rules can be supplied.
- Native browser unavailable; isolated headless Playwright worked using cached Chromium1243. Initial default executable lookup sought uncached 1247; explicit cached executable resolved it without installation.
- One early long batch exceeded the node tool timeout and reset its kernel. Its early screenshots were retained; affected loading states were revisited and settled captures made. Active browser instances in the final two kernels were explicitly closed. An attempted process inventory to verify cleanup of the timed-out instance returned Access denied, so cleanup of that first instance is unverified; do not terminate unrelated Chromium instances.
- Mutable injection preflight succeeded (temporary title and script removed/restored). No detector live server was started because the engine could not run. No overlay exists; screenshots/manual DOM evidence are the fallback.
- Parent's Next dev server was left running as requested; no server was started or stopped by B.
- No application-source changes; output is restricted to `reports/ui-review/evidence/b/`. Browser state was disposable and no credentials were entered. Evidence artifacts intentionally retained. Parent handles critique snapshot/slug/trend accounting and final user questions.
