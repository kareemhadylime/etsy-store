<!--
Keep this short. Reviewers (or future you) should grok the change
in under 30 seconds. Delete sections that don't apply.
-->

## What

<!-- One paragraph. What does this change actually do? -->

## Why

<!-- One paragraph. What problem does it solve, or what does it unblock?
If this is a bug fix, link the failure mode (log line, stack, repro). -->

## Test plan

<!-- Bullet list of how you verified. CI runs lint + test + build
automatically; describe anything beyond that.
-->
- [ ] `npm run lint` clean
- [ ] `npm test` clean (438+ tests)
- [ ] `npm run build` clean
- [ ] Manually verified the affected surface (add specifics)

## Docs touched

<!-- Check what you updated. If you skipped one that probably should
have changed, say why. -->
- [ ] `session-handshake.md` — added/updated bullet for this ship
- [ ] `docs/session-history.md` — appended session entry
- [ ] `docs/deployment-runbook.md` — if env vars / crons / migrations changed
- [ ] `README.md` — if stack, repo layout, or top-level workflow changed
- [ ] Phase-tickets doc (`docs/phase-N-tickets.md`) — if scope shifted

## Notes

<!-- Anything reviewer-shaped: a known follow-up, a deliberately
deferred scope cut, a non-obvious decision, etc. -->
