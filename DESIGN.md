# EvalForge interface

The interface supports careful code reading, independent judgment, and useful feedback. Preserve the existing dark working environment while keeping the content more prominent than its containers.

- Use the locally served Geist sans and mono fonts configured in `app/layout.tsx`. Sans is for prose and controls; mono is for code and compact measurements.
- Shared colors, surfaces, fields, focus rings, and button variants live in `app/globals.css`. Use `btn-primary`, `btn-secondary`, `icon-button`, `field`, and `surface` for new UI. The `neu-*` and `obsidian-*` names are compatibility aliases for older screens, not separate visual systems.
- Use one-pixel dividers, spacing, and readable type to group content. Ordinary panels have no shadow or bevel. Overlays may use a soft shadow.
- Primary actions use pale green with dark text. Red and amber communicate a specific finding or warning; green should not decorate every metadata item.
- Render protected-focus overlays with `components/ui/Dialog.tsx`, outside filtered or sticky ancestors. Give each dialog a name, initial focus, keyboard containment, Escape dismissal, and focus restoration.
- Review tasks are blind by default: do not show defect badges, reference answers, or answer-annotating comments before submission. Preserve source line numbers when hiding comments. Reference data and scoring are separate from presentation.
- New progress profiles are unassessed, not failed. Explain measured scores and their sample basis. Do not derive percentile rankings from score thresholds or imply hiring outcomes.
- Phone workspaces use explicit view navigation. Keep all essential actions named and reachable, and treat scrollable code separately from page overflow.
- Code editors load locally generated Monaco assets. `predev` and `prebuild` run `scripts/prepare-editor.mjs`; retain the basic editor fallback for a failed enhanced-editor load.
- Verify page widths at 360, 390, 768, 1024, and 1440px, plus keyboard, loading, empty, and feedback states. Screenshots and isolated UI regression helpers are retained under `reports/ui-review/`.
