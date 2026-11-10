---
version: 1
slug: 'src-app-layouts'
primary_target: 'src/app/layouts'
related_targets: []
---

# App shell and dashboard

Scope: authenticated app shell (sidebar desktop, bottom tabs mobile), auth layout, dashboard. Mode: Operate.
Audience: fictitious customers/operators; real user is a QA engineer automating the UI.
Reference chosen by the user: neobank style (rounded, bold balance, circular actions), own brand only.

## Direction contract

THESIS: A confident neobank where the selected account is a physical-feeling virtual card; refuses the grey enterprise table-dashboard.
OWN-WORLD: Light grey ground (#f2f2f5), white 24px-radius panels, ink #121216 inverse hero, violet #5b3df5 primary accent, coral #ff6b4a secondary, Manrope 400–800, pill buttons, circular icon actions, tabular figures.
STORY: The customer sees the selected account balance first, acts with one tap (transfer, add account), then scans grouped transactions.
FIRST VIEWPORT: Left nav (232px); top greeting + avatar; full-width ink hero: account pills, 72px balance, monthly delta, four circular actions (Transfer primary violet); tilted violet virtual card with coral card behind on the right. Below: transactions (grouped by day) | month insight + quick transfer.
FORM: user-steered after two rolls; final direction from user reference (round 5 mocks). seed: d828ed7f04491a4f
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
