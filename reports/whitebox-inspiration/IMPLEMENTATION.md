# Whitebox-inspired homepage implementation

Completed 5 November 2026. This implements the first pass approved after the reference review.

## Result

- A wider hero with lighter Geist display type and an original geometric background, using EvalForge's existing mint and charcoal colors.
- A larger working review example with neutral starting state, distinct feedback for both verdicts, a concrete input/output trace, and reset focus restoration.
- An interactive three-stage worked example showing specification reading, a counterexample, and a precise reference correction. The binary-search example is separate from the linked-list review in the hero and is clearly labeled as an example.
- Clear links to self-paced practice, the 50-minute review mock, and coding assessments.
- An original illustrated study scene in the homepage footer, with readable HTML copy, working navigation, and a deliberate mobile crop.
- Homepage-only navigation sizing; other browsing pages retain the compact footer, and active workspaces retain their existing navigation/footer exceptions.

The page uses the existing Next.js stack and local fonts. No dependency was added. Artwork and its generation prompts are documented in [ASSETS.md](ASSETS.md); the two application WebP files total 117,784 bytes.

## Verification

- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed, including type checking and static generation. The homepage's reported route size is 4.68 kB, with 110 kB first-load JavaScript including shared code.
- Impeccable's detector returned no findings for the changed page and components.
- [The Playwright check](verify-implementation.cjs) passed against the production preview. [Machine-readable results](implementation/validation.json) record zero page errors and matching viewport/document widths at 360, 390, 768, 1024, and 1440 pixels.
- Verified both demo verdicts, answer reveal timing, reset behavior, focus restoration, keyboard access between verdicts, all three workflow stages, mobile navigation, footer image loading, and expected marketing-shell behavior on the catalog and review workspace.
- Reduced-motion inspection found visible heading content and no running animations.
- After the production interaction run, the phone artwork crop was moved toward the monitor. The final production build and a targeted phone screenshot checked that CSS-only adjustment.

The first development capture encountered a transient JavaScript loading error. Fresh development and production checks did not reproduce it. The final validation results are from the successful production run.

These checks cover the homepage and its affected layout behavior. They do not establish live sign-in, database writes, AI scoring, or remote submissions.

## Visual evidence

Screenshots were opened and inspected, including desktop, tablet, and phone compositions. The final footer crop is recorded separately after the CSS adjustment.

- [Desktop hero](implementation/hero-desktop.png)
- [Full desktop page](implementation/home-1440.png)
- [Tablet page](implementation/home-768.png)
- [Narrow phone page](implementation/home-360.png)
- [Demo feedback](implementation/demo-feedback-desktop.png)
- [Worked counterexample](implementation/workflow-evidence-desktop.png)
- [Reference feedback](implementation/workflow-feedback-desktop.png)
- [Desktop footer](implementation/footer-desktop.png)
- [Final phone footer crop](implementation/footer-mobile-final.png)

## Files

- `app/page.tsx`, `app/home.module.css`: homepage composition and scoped styles.
- `components/marketing/ReviewDemo.*`: interactive linked-list review.
- `components/marketing/ReviewWorkflow.*`: three-stage binary-search example.
- `components/layout/Footer.*`, `components/layout/Navbar.*`: homepage shell treatment.
- `public/images/marketing/`: original application artwork.
- `DESIGN.md`: the durable homepage conventions.

Command search, catalog redesign, mobile bottom navigation, a skills graph, pricing, and a mascot remain outside this first pass.
