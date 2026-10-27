# EvalForge UI review and redesign plan

Method: dual-agent (A: /root/design_review; B: /root/ui_evidence). A completed before B findings entered synthesis.

Date: 2026-10-27

Status: Initial review and plan, preserved as the pre-implementation baseline. The user subsequently authorized implementation; see [implementation and validation](IMPLEMENTATION.md).

## Review scope

The target is the existing Next.js application (`app/` and `components/`). The review uses two independent assessments, live screenshots, browser behavior checks, and source inspection. Evidence is retained under `reports/ui-review/evidence/a/` and `reports/ui-review/evidence/b/`.

Rendered inspection used isolated Chromium contexts at 1440x1000 and 390x844. Desktop coverage included the landing page, practice catalog, audit and attempt workspaces, OA catalog and Stripe workspace, empty dashboard, mock entry and active session, and empty/missing results. Phone coverage included the main pages and both practice modes, OA workspace, mock session, and local dialogs. Browser checks included no-results search, focus/Tab/Escape, dialog geometry, mobile pointer hit testing, and delayed editor loading.

No sign-in, AI request, real submission, or cloud write was performed. Completed/populated scorecards and cloud history were source-inspected rather than fully exercised. Local assessment sessions existed only in disposable review browser contexts. Early loading screenshots were revisited; settled captures are the evidence for persistent page appearance.

The product's strongest idea is specific: practice reviewing AI-generated code, identify defects, support findings with evidence, and learn from a comparison with a reference review. The interface should make that activity feel clear, credible, and useful.

## Overall diagnosis

The visual language repeatedly emphasizes the container instead of the work. Heavy beveled panels, inset wells, glowing badges, uppercase monospace labels, and exaggerated headings give almost everything equal emphasis. This makes the product feel like a generated showcase rather than a focused tool for careful reading.

The problem goes beyond colors. The catalogs postpone the actual choices; the workspaces waste space and crowd important controls; the dashboard presents missing evidence as poor performance; marketing and metric labels claim more authority than the implementation demonstrates.

The useful pieces to keep are the interactive example, the problem/code/review relationship, explicit practice versus assessment modes, language switching, and detailed feedback. These should become the organizing structure of the interface.

## Findings and proposed changes

### F01. Repeated fake depth overwhelms the hierarchy

- **Where:** `app/globals.css`; cards and controls throughout the application.
- **Evidence:** `neu-card`, `neu-button`, `neu-inset`, `contrast-card`, and `obsidian-card` repeatedly apply layered gradients, multiple opposing shadows, inset highlights, and bevels. Live screenshots show the same treatment on major sections, small metadata, and secondary controls.
- **Why it feels wrong:** Every element looks like a separate physical object. A panel border receives more visual attention than the content inside it. Static information also acquires the visual affordance of a clickable control.
- **Change:** Establish a small hierarchy of flat canvas, content surface, and overlay. Use a restrained divider or border for grouping; reserve shadows for overlays. Use one clear primary button, one secondary button, and quiet text/icon actions. Retire competing style aliases after migration.

### F02. Typography shouts at the user and shrinks important details

- **Where:** Shared layout and almost every page; `app/globals.css:1`, `components/dashboard/ReadinessProfileCard.tsx:38`.
- **Evidence:** Many 9-12px uppercase metadata labels and monospace headings sit next to 48-88px headings. Named-font-only classes and an external Google Fonts import are also fragile: some captured prose/headings render with serif fallback in this environment.
- **Change:** Use a dependable sans-serif stack with a generic fallback everywhere, and load the chosen fonts reliably. Use monospace for code and short numeric/technical values. Set readable body and code sizes, a restrained heading scale, sentence case, and intentional line lengths. Verify both loaded-font and failed-font states.
- **Important distinction:** The serif appearance in some captures is a font-loading/fallback observation, not a claim that serif typography was the intended design.

### F03. Primary actions can lose their contrast

- **Where:** `components/review-studio/EvaluationForm.tsx:524`, related catalog/import actions, and shared button CSS.
- **Evidence:** The review submit button combines `neu-button` with `bg-white text-black`. The custom utility supplies its own dark gradient, and the captured submit action has dark text on a dark surface.
- **Change:** Replace conflicting combinations with shared semantic button variants. Audit default, hover, focus, disabled, loading, and destructive states. A primary action must remain identifiable without hover.

### F04. Practice discovery is buried under setup and decoration

- **Where:** `app/practice/page.tsx`.
- **Evidence:** The heading, API-key setup, generation action, dashboard link, statistics, starter path, status tabs, search, topic chips, and filters all precede the question list. Each question repeats several pills and offers competing audit/attempt actions.
- **Change:** Put a compact title, search/filter controls, and useful question choices near the top. Keep one recommended starter action. Move custom generation and API-key configuration to contextual secondary actions. Use compact rows on desktop and simple cards on mobile. Choose a primary audit action and make solving a secondary mode.
- **Success condition:** A new user can find and start a suitable review without configuring an AI service.

### F05. The review workspace prioritizes panels over simultaneous reading

- **Where:** `app/practice/[id]/page.tsx`, `ProblemContextPane.tsx`, `CodeViewer.tsx`, `EvaluationForm.tsx`.
- **Evidence:** The captured desktop form stretches into a very large mostly empty panel while the code starts low in the opposite column. Thick card padding and a constrained code viewport reduce usable space. Raw backticks and list-like text appear in some problem statements. Read-only code has weak visual differentiation and line citation is attached to pointer clicks on table rows.
- **Change:** Keep code and the active review section visible together. Use compact problem/specification tabs, a clearly bounded code pane, and a review pane whose size follows the task. Give the form a useful completion summary and a stable submit area. Render supported problem formatting consistently. Provide syntax-aware code rendering and an explicit keyboard-accessible way to cite a line.

### F06. Initial review fields steer the answer

- **Where:** `components/review-studio/EvaluationForm.tsx:35`.
- **Source-confirmed:** A fresh form defaults to a major bug, the first expected defect's line, and the reference optimal complexity.
- **Also observed:** Catalog titles/defect badges name the intended flaw or verdict, and some presented code includes comments naming the bug. The same answer cues reach timed review assessments. The label "Audit Buggy Code" also primes rejection of examples that may be correct.
- **Why it matters:** The interface is supposed to collect the learner's judgment. Preselecting answers and filling reference values undermines that task and makes completion indicators misleading.
- **Change:** Start with neutral, unselected values and use "Review code" rather than declaring it buggy. Hide defect badges, answer-revealing titles, and answer annotations until feedback in blind practice/assessment. Keep guided instruction explicitly identified if desired. Show examples and hints separately from answers. Keep the scoring/data model intact while changing presentation, practice copies of problem content, and form state deliberately.

### F07. The empty dashboard mistakes no evidence for failure

- **Where:** `components/dashboard/ReadinessProfileCard.tsx`, `app/dashboard/page.tsx`, chart components.
- **Evidence:** A first-run dashboard shows `0.0%`, `NOT READY`, repeated zero metrics, empty charts, and deficit language before the user has produced evidence. The giant `EVAL ACUITY` heading consumes space needed for progress and next steps. The phone capture is a long stack of low-information panels.
- **Change:** Add a proper first-run state: explain that progress appears after an initial review and offer one starter task. Show unknown/unmeasured values as such. Once enough activity exists, lead with recent progress, the next recommended practice, and explainable scores. Replace repeated zero charts and large metric cards with compact summaries and actionable feedback.

### F08. Ranking and marketing claims need evidence

- **Where:** `app/page.tsx:213`, `ReadinessProfileCard.tsx:21`, `components/layout/Footer.tsx`.
- **Source-confirmed:** Homepage claims such as `78%` and `6.2x` are hard coded; percentile labels such as `TOP 5%` are derived directly from score thresholds. The inspected implementation does not establish a real comparative cohort or evidence for those marketing claims.
- **Change:** Remove or substantiate outcome claims before presenting them as proof. Describe company-style exercises without implying affiliation or access to exact hiring rubrics. Replace percentile ranking with transparent personal progress until a legitimate comparative basis exists. Remove decorative `SYSTEM OPERATIONAL` status unless it reports real service state.
- **Scope note:** This is a credibility issue in the UI; it is not an assertion that outside evidence cannot exist.

### F09. The landing page repeats generic AI-product patterns

- **Where:** `app/page.tsx`.
- **Evidence:** The uppercase slogan, glowing demo status, partner-like badge row, unsupported metric cards, competitive comparison, rubric card grid, and large final CTA stack repeat the same sales emphasis. The page calls the rubric six-dimensional while the displayed grid contains five numbered entries.
- **Change:** Lead with the actual learning activity and the interactive example. Use one clear primary action and a short explanation of how review feedback works. Replace the long prestige/benchmark sections with real sample evidence. Correct the rubric representation from the actual product definitions.
- **Illustrative copy direction:** "Practice reviewing AI-generated code"; "Try a review"; "Compare your findings with the reference review." These are proposals, not applied copy changes.

### F10. OA discovery mixes too many competing signals

- **Where:** `app/oa/page.tsx` and `components/oa/`.
- **Evidence:** A large duration headline, a long paragraph, import action, horizontally scrolling company filters, colored company badges, tags, question counts, point totals, timers, and large track cards all compete for attention.
- **Change:** Make the main choice the assessment: title, skill focus, question count, duration, and one start action. Keep company inspiration as secondary metadata. Reduce badge colors, card padding, and duplicated information. Put import in a secondary menu rather than the main visual path.

### F11. Workspaces need deliberate mobile layouts

- **Where:** Practice and OA workspace headers, editor toolbars, pane layouts, and assessment navigation.
- **Evidence:** Phone screenshots show dense strips of controls, compressed/truncated context, wrapped language controls, and constrained editor/test areas. Global `overflow-x: hidden` can hide content rather than fix its width.
- **Change:** Define the minimum useful phone layout explicitly. Use a concise toolbar and a named overflow menu for secondary actions. Make problem/code/review or problem/editor/tests reachable through stable mobile navigation. Preserve input while switching views. Let forms and dialogs scroll within the visible viewport; do not compress the desktop IDE into a tiny column.

### F12. Dialogs and custom controls need consistent interaction behavior

- **Where:** Authentication, API-key configuration, question generation/import, assessment submission, and custom tab/selection controls.
- **Source-confirmed:** Dialog semantics differ among modal implementations. Several components lack explicit Escape handling, focus containment/return, or accessible names on close/icon actions. Custom tabs and selectable tiles commonly express selection only through styling.
- **Change:** Use one accessible dialog pattern and reusable tab/selection primitives. Add clear names, programmatic selected/expanded states, reliable visible focus, keyboard operation, and focus restoration. Keep storage and AI-service explanations short, accurate, and contextual.

### F13. Loading, error, result, and destructive states need their own design pass

- **Where:** Monaco-based editor surfaces, result pages, error boundaries, `not-found`, scorecards, reset actions.
- **Evidence:** Captures include editor loading placeholders and different visual treatments across result/empty states. `app/assessment/results/page.tsx` includes literal `$R$` notation in ordinary copy. Error messages can expose raw exception text. Reset/copy actions need explicit user feedback appropriate to their consequence.
- **Change:** Define bounded editor loading with a clear failure/retry path, consistent skeletons, understandable error copy, reassuring empty results, and a meaningful next action. Make destructive reset separate from routine controls. Match feedback language across practice, mock, and coding results. Respect reduced-motion preferences for celebratory and pulsing effects.
- **Coverage limit:** Loading observed during review must be distinguished from an application defect or an unavailable external editor resource. Successful AI-generated and authenticated/cloud result states require a later controlled verification pass.

### F14. The phone sign-in dialog is positioned partly outside the viewport

- **Priority:** P1, repair before a visual redesign.
- **Browser-reproduced:** At 390x844, the sign-in panel spans y=-195 to 275 and its heading spans y=-90 to -34. Its heading and close control are offscreen. Escape does not dismiss it.
- **Source:** `components/auth/UserDropdown.tsx` renders `AuthModal` inside the navbar's filtered header. `components/layout/Navbar.tsx` applies `backdrop-blur-md`; the descendant fixed overlay in `components/auth/AuthModal.tsx:36` therefore does not position as a normal viewport overlay.
- **Change:** Portal the dialog outside filtered/sticky ancestors. Constrain it to the visible viewport with scrollable contents, initial focus, Escape dismissal, focus containment, and focus restoration. Verify at phone width and after page scroll.
- **Evidence:** `evidence/b/auth-modal-phone-viewport.png` and `evidence/b/auth-rect.json`.

### F15. The phone mock header blocks the audit-form tab

- **Priority:** P1, repair before a visual redesign.
- **Browser-reproduced:** At 390x844 on `/assessment/session`, the Audit Form button lies under the higher-layer Finish Exam control. Hit testing at the tab's center returns the Finish Exam text; pointer trial clicks are intercepted by the header. The phone user cannot reliably reach the form through that tab.
- **Source:** `components/assessment/AssessmentHeader.tsx:38` uses `sticky top-14 z-40` even though the global navbar is hidden. `app/assessment/session/page.tsx:179` uses a separate `sticky top-[106px] z-20` strip, assuming a height the two-row phone header exceeds.
- **Change:** Use one responsive sticky stack starting at the top of the viewport, with form/code tabs below the actual header. Verify pointer and keyboard access before and after scroll. Remove the unused global-nav offset.
- **Related source-confirmed issue:** Answered pills check synthetic `q_${idx}` IDs while the session supplies real question IDs. Pass the actual IDs so saved progress has a truthful indicator; verify with controlled test data during implementation.
- **Evidence:** `evidence/b/assessment-session-phone-viewport.png` and `evidence/b/browser-notes.json`.

## Secondary corrections to include

- Compact the phone verdict choices: their one-column `aspect-square` layout makes each about 308px tall, consuming more than 900px for three choices.
- Stack OA pre-submit status beneath each title on phone. Currently wide non-shrinking test-status badges squeeze the problem title to fragments at the decision to submit.
- Connect labels to difficulty/language, bug-line/severity/description, and complexity fields. Name the phone OA Run icon and pagination arrows. Programmatically expose selected tab, filter, and verdict states.
- Keep the working practice phone Code/Form/Assistant switcher; repair the distinct broken mock implementation rather than replacing both indiscriminately.
- The code-line rows measured roughly 41px in the audited sample despite small type. Reduce wasted line height while preserving a readable code size and citation hit target.
- Reconcile the displayed rubric dimensions, terms such as audited/attempted/calibrated, catalog counts, benchmark counts, and different pass/readiness thresholds. Derive repeated counts from the actual catalog when they mean the same thing.
- Verify audit drafts on refresh and question changes before promising autosave. Session/timer persistence is not the same as unsent form-draft persistence.
- Correct raw formatting such as `$R$`, ordinary backticks/lists rendered as unformatted text, and implementation details such as "local or remote storage" in user-facing empty states.
- Do not claim major document-wide mobile horizontal overflow: measured catalog/landing widths fit their viewports. The reproduced mobile problems are specific overlap, poor prioritization, tiny/unnamed controls, and compressed rows.

## Design health assessment

The independent design review scored the existing product **18/40** across the ten heuristics below. This is a provisional expert assessment, not a detector score, accessibility certification, or measured user-study result. Completed submissions, screen-reader use, and populated history were not exhaustively tested. Browser assessment B corroborated specific status, control, labeling, and recovery failures.

| Heuristic | Score / 4 | Main issue |
| --- | --- | --- |
| Visibility of system status | 2 | Editor failures remain loading; saved/completion status is weak |
| Match to real-world language | 2 | Clear code-review concepts compete with inflated jargon |
| User control and freedom | 3 | Several useful back/mode/exit controls; important dialog and mock-route gaps |
| Consistency and standards | 2 | Conflicting primary styles, vocabulary, and modal behavior |
| Error prevention | 1 | Answer-derived defaults and incomplete-review safeguards |
| Recognition rather than recall | 2 | Visible rubric tabs, but mobile context and line evidence are separated |
| Flexibility and efficiency | 1 | Excess scrolling, no visible pane adjustment or accelerators |
| Aesthetic and minimalist design | 2 | Repeated bevels, badges, and large low-information panels |
| Error recovery | 1 | Editor failure lacks a recovery path |
| Help and documentation | 2 | Useful starter path; weak score methodology/contextual guidance |
| **Total** | **18/40** | **Structural changes needed** |

The intended emotional journey should be curiosity, one understandable task, independent judgment, specific feedback, and a manageable next exercise. The current mini-demo supports curiosity, but excessive configuration/authority language and the unassessed dashboard's failure labels interrupt that journey. Cognitive load is highest in the practice catalog and when phone reviewers must remember code evidence while switching to the form.

## Recommended design direction

Treat EvalForge as a place for careful technical judgment. The most distinctive content is the relationship between a code line, a review finding, the evidence supporting it, and the feedback after submission. Make those relationships clear before adding visual flourish.

Recommended starting assumptions, pending user preference:

- Keep a dark working environment, with neutral graphite surfaces and one primary accent. Use red, amber, and green for meaningful feedback rather than decoration.
- Use readable sans-serif prose and headings; reserve monospace for code and compact technical values.
- Use restrained borders, spacing, and type weight to establish hierarchy. No bevels or glow on ordinary controls.
- Make one action dominant in each view. Keep advanced setup, AI configuration, import, and generation contextual.
- Keep marketing expressive enough to explain the idea, and make working screens quiet enough to support sustained reading.

This is a proposed direction for discussion, not a newly imposed visual specification.

## Implementation sequence

| Order | Work | Main files | Completion evidence |
| --- | --- | --- | --- |
| 0 | Unblock current use: phone sign-in placement, mock form-tab overlap, unreadable primary actions, modal focus/labels | Auth/modal components, assessment shell, primary action consumers | Pointer and keyboard users can open/close dialogs and reach the mock form; enabled CTAs are legible |
| 1 | Shared foundation: dependable fonts, tokens, typography, surfaces, semantic buttons, focus, shared dialog/tab primitives | `app/globals.css`, `app/layout.tsx`, shared layout/components | A small representative screen set demonstrates consistent readable controls in every state; no dark-on-dark primary actions |
| 2 | Review workspace: code/spec/review hierarchy, neutral form defaults, completion feedback, line citation, mobile navigation | `app/practice/[id]/page.tsx`, `components/review-studio/*`, `components/practice/PracticeAttemptWorkspace.tsx` | A learner can read code, enter evidence, switch sections, and understand submission state at desktop and phone sizes |
| 3 | Practice catalog: compact discovery, starter path, contextual AI setup, simplified question rows | `app/practice/page.tsx`, practice modals | A suitable first task is visible without a long preamble or any API-key requirement |
| 4 | OA and mock flows: track discovery, toolbar layout, task navigation, editor/test sizing, preflight and result consistency | `app/oa/*`, `components/oa/*`, `app/assessment/*`, `components/assessment/*` | Every essential timed action is reachable; problem context, remaining time, and progress remain clear |
| 5 | Progress and feedback: first-run state, evidence-backed metrics, concise learning recommendations, readable chart/table alternatives | `app/dashboard/page.tsx`, dashboard/infographic components, result components | No-data is presented as unmeasured; activity produces explainable feedback and a useful next step |
| 6 | Landing page and copy: concise proposition, genuine demo, substantiated proof, consistent navigation/footer | `app/page.tsx`, `components/layout/*` | The product is understandable from its actual mechanism without prestige claims, repeated CTAs, or decorative status |
| 7 | Final cross-screen polish and regression review | All affected UI surfaces | Desktop/mobile, keyboard, loading/error/empty/success, font failure, and editor failure checks pass |

Use one representative workspace and catalog to validate the shared foundation before migrating every screen. Do not globally remove old utility classes until their consumers have been migrated and visually checked.

## Acceptance criteria

- Review at 360/390px phone widths, 768px tablet, and 1024/1440px desktop. Check zoom and long content separately.
- No essential control is clipped, overlapped, or accessible only by hover. Code can scroll horizontally where necessary; ordinary page content must not rely on hidden overflow.
- Primary actions meet normal-text contrast targets of 4.5:1; large text and meaningful control boundaries meet appropriate 3:1 targets. Measure composited colors rather than inferring contrast from class names.
- Keyboard users can reach every action, operate custom selections/tabs, open and close dialogs, and return to the invoking control. Focus must remain visible.
- Aim for comfortably sized touch controls, including approximately 44px hit areas for important phone actions.
- No-data, partial progress, saved progress, long titles, missing fonts, editor load failure, pending requests, request failure, and populated feedback each have explicit, honest states.
- Scores, labels, and copy agree with the underlying behavior. Unmeasured values are not called deficits; score thresholds are not presented as measured cohort percentiles.
- Core practice remains understandable without an AI API key. AI setup appears when the user chooses a feature that needs it.
- Reduced-motion preferences are respected; success does not depend on animation.
- Complete one fresh review and one controlled timed-session journey after implementation. Use isolated test data and avoid paid AI requests unless separately authorized.

## Scope boundaries

This plan concerns presentation, discovery, interaction, and truthful explanations of current capabilities. It does not call for replacing the framework, migrating the database, rewriting scoring algorithms, or adding new product features. Existing review/solve modes and question content should be preserved, with presentation bugs and answer-revealing defaults handled deliberately.

Application edits should begin only after the user asks to implement the plan. The review artifacts and screenshots are the only repository additions made for this task.

## Run notes

- Source target: `app/` and `components/`. No ignore list was found.
- Assessment A and B were independent; A was recorded before the parent read B's findings. B's detailed report is retained at `evidence/b/findings.md`.
- Impeccable context, detector, and target-slug helpers were actually attempted but could not start because engine 0.1.18 was absent and its cache path was unavailable. There is no detector count, rule list, clean scan, generated target slug, or score trend. This Markdown document is a manual report archive, not a successful engine-generated critique snapshot.
- Native browser access was unavailable. Isolated headless Playwright screenshots and DOM/geometry checks provided browser evidence. No user browser was accessed and no visible detector overlay exists.
- Mutable browser injection preflight succeeded and its changes were removed. The missing engine prevented a detector live server from starting, so there was no detector server to clean up.
- Google Fonts and the jsDelivr Monaco loader failed with `net::ERR_NETWORK_ACCESS_DENIED` in this environment. Editors remained loading after repeated observations, including a 15-second OA observation while its timer ran. This demonstrates poor handling of a blocked dependency; it does not prove failure on a normal production network. Font-dependent visual judgments remain qualified.
- Final review browser instances were closed. One earlier B tool timeout left cleanup of that initial browser process unverified because process inventory was denied; no unrelated browser processes were terminated.
- Screenshot, JSON, and small capture-script files are intentional retained evidence, not temporary report bodies. No temporary critique-body file was created.
- The temporary parent-owned Next.js preview is stopped after evidence collection. No application source or existing user progress was changed.

## Decisions for the next implementation turn

1. Keep the dark application throughout (recommended), or use light discovery/progress pages with dark code editors?
2. Make independent blind review the default (recommended), or keep answer hints visible in an explicitly guided practice mode?

The plan above assumes a restrained dark application and blind review by default; either decision can be adjusted before implementation.
