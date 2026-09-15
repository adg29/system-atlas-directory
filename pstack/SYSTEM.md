# pstack — System Definition

_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._ MIT-licensed skills by Lauren Tan (poteto) in [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Install with `/add-plugin pstack`. This map is a **which-skill-when** reference — not a TypeScript package DAG.

_Question status: **2 open · 8 resolved**._

## One paragraph

poteto's engineering-team skills for Cursor. poteto-mode is the door for non-trivial work; other skills are situational and fire as playbook steps need them. Fearless parallelism and multi-model panels are the point: write less, higher quality code you can trust enough to parallelize.

## Decisions locked

| Axis | Decision | ADR |
|---|---|---|
| Entry | poteto-mode is the default for non-trivial work. setup-pstack configures models once. Other skills are situational; the mode fires them as steps need them. | [README.md](https://github.com/cursor/plugins/blob/main/pstack/README.md) · [skills/poteto-mode/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md) |
| Routing | Mode matches a playbook, copies its steps into a todolist verbatim, then routes to skills as those steps fire. Large or "stepping away" work goes to figure-it-out; standing multi-day programs to orchestrate. | [docs/guide/02-poteto-mode.md](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/02-poteto-mode.md) |
| Multi-model | Roles split by strength. Upstream defaults: panel fable 5.1 / sol / grok / opus 5; code delegates (feature, refactoring, bug-fix, perf, hillclimb) → grok; judgment and prose → fable. setup-pstack writes ~/.cursor/rules/pstack-models.mdc to override. | [README.md](https://github.com/cursor/plugins/blob/main/pstack/README.md) · [skills/setup-pstack/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md) |
| Principles | Twenty-three principle-* skills are the design constitution. poteto-mode indexes them inline at task start. They are not daily slash entry points. | [README.md#principles](https://github.com/cursor/plugins/blob/main/pstack/README.md) · [docs/guide/08-principles.md](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/08-principles.md) |
| License | MIT. Copyright (c) 2026 Lauren Tan. Fork it, improve it, make it yours. | [LICENSE](https://github.com/cursor/plugins/blob/main/pstack/LICENSE) |

## Cost model

- MIT plugin. No separate pstack fee. Model spend is whatever Cursor bills for the models `/setup-pstack` assigns per role.
- Default panel (upstream README): fable 5.1 / sol / grok / opus 5. Code delegates default to grok; judgment and prose to fable. Override with `/setup-pstack`.
- Sibling plugin `cursor-team-kit` adds `/deslop`, `control-cli`, and `control-ui` that poteto-mode expects for full coverage.

## Deep dives

Source: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Guide: [docs/guide](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/README.md). Mode: [skills/poteto-mode/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md). Setup: [skills/setup-pstack/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md). License: [LICENSE](https://github.com/cursor/plugins/blob/main/pstack/LICENSE).

## Reading order (the atlas chapters)

1. **You enter the mode** — I need rigor on this task → /poteto-mode is the door. _(adds MODE, PRIN)_
2. **Setup once** — I need the right models per role → /setup-pstack. _(adds SETUP)_
3. **Understand the system** — I need to understand X before I touch it. _(adds HOW, WHY, TEACH, RECALL)_
4. **Change carefully** — I need the shape right, a cheap test, and a blast-radius proof. _(adds ARCH, TDD, BLAST)_
5. **Parallel attempts** — I need fearless parallelism — bake off or fan out. _(adds PARALLEL)_
6. **Break the diff** — I need several models to try to break this change. _(adds INT)_
7. **Ship overnight** — I am going to bed — land it with a checkable finish condition. _(adds FIG, SHOW, VER)_
8. **Clean the writing** — I need prose without AI tells, and comments that earn their place. _(adds CLEAN)_
9. **Encode the lesson** — I need this run to make the next run smarter. _(adds ENCODE, AGENTS)_
10. **The whole skill map** — Everything at once — pick a journey, or explore freely.

## Structures

### The door

#### MODE · poteto-mode

**In one line.** Default entry for any non-trivial task — sticky mode that matches a playbook and fires the other skills.

**What it does.** poteto's agent style: concise detailed replies, deliberate subagents, unslopped prose, simple code, verified work. Twenty-three playbooks live under its playbooks/ folder. Once entered it stays on across turns when rigor is needed; opt out by saying so. Works with Cursor's /loop for long overnight runs.

**How it's built.** `skills/poteto-mode/SKILL.md` plus **playbooks/*.md** (23). Reads the inline Principles index at task start. Spawns `subagent_type: "poteto-agent"` for playbook delegates.

**Steps in execution.**

1. **Match** — Pick the playbook (investigation, bug-fix, feature, babysit, shipping, autonomous-run, …).
2. **Todo** — Open a todolist whose first items are that playbook's steps, copied verbatim.
3. **Route** — As steps fire, call how / architect / arena / swarm / interrogate / unslop / tdd / …
4. **Reply** — Unslopped prose framed for the consumer and the maintainer; every other playbook ends in opening-a-pr.

**Questions.**

- ~~**Q-MODE1** Are the 23 playbooks separate atlas nodes?~~ ✓ No. Collapsed into MODE how/steps, FLOWS, and journey chapters (2026-09-15).
- ~~**Q-MODE2** Is poteto-mode the only way to invoke other skills?~~ ✓ No. README table lists skills you can slash directly; mode just routes most of them for you (2026-09-15).
- **Q-MODE3** Will plugin.json version (0.15.2 at atlas snapshot) and the 23-playbook set stay stable, or should the atlas be re-synced periodically?

#### SETUP · setup-pstack

**In one line.** Configure which models pstack uses per role and at what reasoning budget — run once, re-run to change.

**What it does.** Detects available Task model slugs, asks for a budget (unlimited / large / medium / small), confirms the role map, and writes an always-applied rule that overrides skill defaults. Every skill reads the rule; missing lines fall back to defaults.

**How it's built.** `skills/setup-pstack/SKILL.md` → writes **~/.cursor/rules/pstack-models.mdc** with alwaysApply: true. Default panel roles include arena/architect/interrogate reviewers as fable+sol+grok+opus.

**Steps in execution.**

1. **Detect** — Enumerate model slugs this session can pass to Task.
2. **Budget** — Pick unlimited / large / medium / small; remap effort tokens.
3. **Confirm** — Show every role; accept or change; validate slugs.
4. **Write** — Overwrite pstack-models.mdc; offer create-verification-skill if the project lacks a verify harness.

**Questions.**

- ~~**Q-SETUP1** Do default model slugs match every Cursor entitlement?~~ ✓ No. Defaults are upstream skill text; setup-pstack must confirm what you actually have (2026-09-15).
- **Q-SETUP2** Have Alan's local pstack-models.mdc or forks drifted from these upstream defaults?

### Understand first

#### HOW · how

**In one line.** I need a walkthrough of how a subsystem works — architecture, runtime flow, where something should live.

**What it does.** Explains subsystem architecture, runtime flow, and onboarding mental models. Also placement / ownership / layering questions. Use why for motivation and history; use teach when you want how+why woven into one plain explanation.

**How it's built.** `skills/how/SKILL.md`. poteto-mode non-negotiable: nontrivial change, architecture decision, or "are we sure?" → how.

**Steps in execution.**

1. **Scope** — Name the subsystem or placement question.
2. **Explore** — how explorer (default grok) gathers structure.
3. **Explain** — how explainer (default fable) writes the walkthrough.

#### WHY · why

**In one line.** I need to know why something was built this way — design rationale with evidence, not vibes.

**What it does.** Discovers available MCPs at run time and queries evidence categories in parallel: source control, issue tracker, long-form docs, real-time chat, infra observability, error tracking, analytics warehouse. For regressions, postmortems, data-backed thresholds.

**How it's built.** `skills/why/SKILL.md`. Investigators default grok; synthesizer default fable (overridable via setup-pstack).

**Steps in execution.**

1. **Discover** — Enumerate MCP evidence sources available this session.
2. **Query** — Fan out investigators per category in parallel.
3. **Synthesize** — One cited answer with evidence labels.

#### TEACH · teach

**In one line.** I need to actually understand a change or subsystem — not just a summary.

**What it does.** Runs the how and why skills and weaves what they find into one clear explanation, built up diagram by diagram. For "teach me this", "help me really understand X", "explain this change to me".

**How it's built.** `skills/teach/SKILL.md`. Composes HOW + WHY rather than replacing them.

**Steps in execution.**

1. **Gather** — Invoke how and why on the same subject.
2. **Weave** — One plain explanation with progressive diagrams.
3. **Check** — Reader can restate the mental model.

#### RECALL · recall

**In one line.** I need my recent context rebuilt — catch me up before I start or resume.

**What it does.** Reconstructs recent working context from your own chat history, live state, and the shared record (user reports, prior fixes, incidents), then hands back a tight current-state brief.

**How it's built.** `skills/recall/SKILL.md`. Pairs with session-pickup playbook when taking over another agent's in-flight work.

**Steps in execution.**

1. **Mine** — Chat history + live state + shared record.
2. **Brief** — Tight current-state handoff, not a dump.

### Design & build

#### ARCH · architect

**In one line.** I need the shape settled before code — types, signatures, module structure.

**What it does.** Sketch types, signatures, and module structure before implementation, then stay in the loop while code fills in. For non-trivial work crossing a function boundary where jumping to code would lock in the wrong shape. Runs a multi-model panel (default fable/sol/grok/opus).

**How it's built.** `skills/architect/SKILL.md`. poteto-mode: code crossing a function boundary → architect, with parallel design exploration before implementing.

**Steps in execution.**

1. **Sketch** — Caller usage, types, module shape first.
2. **Panel** — architect runners compare approaches.
3. **Fill** — Stay in the loop while implementation follows the sketch.

#### TDD · tdd

**In one line.** I need a failing test first — only when asked, or when the bug has an obvious cheap local test target.

**What it does.** Write the failing test, then the fix. Skip when the test path is unclear, expensive, integration-heavy, or not requested. Grounded in principle-test-behavior-not-implementation.

**How it's built.** `skills/tdd/SKILL.md`. Frontmatter: use only when user explicitly asks for TDD / failing / regression test, OR cheap local target.

**Steps in execution.**

1. **Red** — Failing test that calls the code the way users do.
2. **Green** — Smallest fix that makes the assertion pass.
3. **Prove** — Assert against a literal expected value, not mocks of every import.

#### BLAST · blast-radius

**In one line.** I have a small-looking change and do not trust it — what else could it break?

**What it does.** Finds what a change could break somewhere else before it ships, beyond the diff, and proves the one fact it is safe because of by running real code instead of writing it up.

**How it's built.** `skills/blast-radius/SKILL.md`. Common in babysit / shipping / refactoring playbook steps.

**Steps in execution.**

1. **Map** — Callers, neighbors, shared state beyond the diff.
2. **Prove** — Run the one fact that makes it safe — real code, not prose.

#### PARALLEL · arena + swarm

**In one line.** I need fearless parallelism — bake off designs (arena) or fan out coverage (swarm).

**What it does.** Two complementary skills. arena: spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers. swarm: fan out N workers across different slices, races, or gauntlets and return one report. poteto-mode routes contested design to arena; coverage matrices and exploration partitions to swarm.

**How it's built.** `skills/arena/SKILL.md` + `skills/swarm/SKILL.md`. Default arena runners / cross-judge pool: fable, sol, grok, opus. Default swarm workers: grok.

**Steps in execution.**

1. **Choose** — Same-task bakeoff → arena. Partitioned coverage → swarm.
2. **Fan out** — N background Task workers with explicit models.
3. **Merge** — Arena grafts; swarm aggregates one report.

**Questions.**

- ~~**Q-PARALLEL1** Are arena and swarm interchangeable?~~ ✓ No. Arena is competing attempts at one artifact with grafting; swarm is parallel coverage across slices (2026-09-15).

### Review & voice

#### INT · interrogate

**In one line.** I have a diff and want several models to try to break it.

**What it does.** Multi-model adversarial review. Reviewers challenge changes from independent angles, including a strict code-quality lens. poteto-mode: contested design → interrogate before shipping.

**How it's built.** `skills/interrogate/SKILL.md`. Default interrogate reviewers panel: fable, sol, grok, opus.

**Steps in execution.**

1. **Scope** — Pass the diff or PR.
2. **Panel** — Independent reviewers attack from different angles.
3. **Triage** — Fix real findings; dismiss noise with a concrete reason.

#### CLEAN · unslop · no-comments · writing

**In one line.** I need the writing and the comments cleaned — AI tells gone, comments stripped, docs on standard.

**What it does.** Collapsed writing/voice cluster. unslop cuts AI tells from any writing and must always apply. no-comments spawns Comment Sicko, fixes accepted findings, offers encodings for claimed constraints. technical-writing is the layered doc standard (Diátaxis + Google developer style + STE + Global English). bro restates the last message in plain human language. typescript-best-practices grounds type-system-discipline on .ts/.tsx.

**How it's built.** `skills/unslop`, `no-comments`, `technical-writing`, `bro`, `typescript-best-practices`. Before commit poteto-mode also expects **/deslop** from cursor-team-kit (not bundled).

**Steps in execution.**

1. **Prose** — Draft clean; unslop patterns are stable rule ids other skills cite.
2. **Comments** — /no-comments → Comment Sicko → fix accepted findings.
3. **Docs** — /technical-writing for RFCs, readmes, PR bodies, commits.
4. **Plain** — /bro when jargon piled up.

**Questions.**

- ~~**Q-CLEAN1** Is /deslop part of pstack?~~ ✓ No. Ships in cursor-team-kit; poteto-mode still expects it before commit (2026-09-15).

#### SHOW · show-me-your-work

**In one line.** I am stepping away — keep a reviewable decision trail I can audit later.

**What it does.** TSV log with one row per decision (what, why, evidence, result). Local by default; commit when a reviewer needs the trail. Wired into overnight / autonomous / multi-phase work and figure-it-out.

**How it's built.** `skills/show-me-your-work/SKILL.md`. poteto-mode non-negotiable for "going to bed" / /loop until X / trust-it-when-back.

**Steps in execution.**

1. **Open** — Start the TSV decision log for the run.
2. **Row** — One row per decision with evidence and result.
3. **Commit** — Only when stakes need an auditable record.

### Encode & verify

#### FIG · figure-it-out

**In one line.** No bundled playbook fits — or the work is large / I am stepping away and need an auditable bespoke plan.

**What it does.** Designs a rigorous, auditable playbook when no narrower one fits: large migrations, ambitious multi-part changes, or work a human reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, logs decisions via show-me-your-work. Distinct from orchestrate (standing multi-day programs).

**How it's built.** `skills/figure-it-out/SKILL.md`. Guide overnight chapter routes "going to bed" migrations here.

**Steps in execution.**

1. **Design** — Bespoke playbook with verifiable phase boundaries.
2. **Log** — Wire show-me-your-work decision trail.
3. **Loop** — Hypothesis → smallest change → prove against real artifact.

**Questions.**

- ~~**Q-FIG1** When is orchestrate preferred over figure-it-out?~~ ✓ Orchestrate = standing project-scale program (multi-day, many stacked PRs, fleet under one coordinator). figure-it-out = one bespoke run (2026-09-15).

#### ENCODE · reflect · automate-me

**In one line.** I need the lesson captured — as a skill edit, or as my own -mode.

**What it does.** reflect: three parallel review subagents over the active transcript; surface learnings; route each to a concrete edit on an existing skill. automate-me: mine recent transcripts, draft a personal -mode skill via create-skill + unslop, keep pstack as the base. make-bot-ui (related, niche): page/dashboard whose buttons wake a Grok Bot over a webhook.

**How it's built.** `skills/reflect/SKILL.md` + `skills/automate-me/SKILL.md`. Optional sibling: `skills/make-bot-ui/SKILL.md` (webhook UI + Tailscale; sender key stays on server).

**Steps in execution.**

1. **Reflect** — Spawn tooling + judgment + divergent reviewers; land skill edits.
2. **Automate** — /automate-me drafts your -mode from how you actually work.
3. **Bot UI** — Only when building a webhook-waking dashboard for a Grok Bot.

#### VER · verification skills

**In one line.** I need a scripted way to prove the app behaves — create it once, maintain when it drifts.

**What it does.** create-verification-skill generates a project-local verification skill that drives the app the way a user does (any language/framework/platform) with a feature map. maintain-verification-skill runs parallel source readers per feature plus one live session, and opens at most one PR of proven corrections.

**How it's built.** `skills/create-verification-skill/SKILL.md` + `skills/maintain-verification-skill/SKILL.md`. setup-pstack offers create once if the project has no verify harness. Full UI/CLI proof also uses control-ui / control-cli from cursor-team-kit.

**Steps in execution.**

1. **Create** — Feature map + verify skill that drives the real surface.
2. **Maintain** — Source wave + one live pass; ≤1 PR of proven fixes.
3. **Ship** — Playbooks call prove-it-works against the real artifact.

### Constitution

#### PRIN · principles (×23)

**In one line.** Design constitution — named rules poteto-mode indexes; not daily slash entry points.

**What it does.** Twenty-three short skills, one principle each. poteto-mode indexes them inline and reads that index at task start; cite only principles whose leaf SKILL.md you read this session. Groups: core (laziness, foundational thinking, redesign, attack-the-premise, subtract-before-add, minimize-reader-load, outcome-oriented, experience-first, exhaust-design-space, build-the-lever), architecture (model-the-domain, boundary, type-system, idempotent, migrate-then-delete, separate-before-serialize), verification (prove-it-works, fix-root-causes, sequence-verifiable-units, test-behavior-not-implementation), delegation (guard-context-window, never-block-on-human), meta (encode-lessons-in-structure).

**How it's built.** `skills/principle-*/SKILL.md` (23 dirs). Guide: `docs/guide/08-principles.md`. typescript-best-practices grounds type-system-discipline in syntax.

**Steps in execution.**

1. **Index** — Mode reads the inline Principles section at task start.
2. **Apply** — Name each principle that shaped a decision and the choice it changed.
3. **Leaf** — Read the leaf SKILL.md before citing it.

**Questions.**

- ~~**Q-PRIN1** Should each principle be its own atlas node?~~ ✓ No. Collapsed into PRIN by design — constitution, not navigation targets (2026-09-15).

### Agents (not slash skills) (designed for, not built)

#### AGENTS · poteto-agent · Comment Sicko _(not switched on)_

**In one line.** Subagents, not slash skills — poteto-agent is the mode wrapper; Comment Sicko is the comment hater.

**What it does.** poteto-agent: routing target for /poteto-mode and any request for poteto's style; must read poteto-mode SKILL.md (including principles index) before work — substituting generalPurpose drifts. Comment Sicko: read-only deranged comment reviewer; usually invoke through /no-comments, not directly. Benny automations are a separate dormant pack under automations/benny/.

**How it's built.** `agents/poteto-agent.md` + `agents/comment-sicko.md`. plugin.json registers agents: ./agents/.

**Steps in execution.**

1. **Spawn** — Playbook delegates use subagent_type poteto-agent.
2. **Comments** — no-comments spawns Comment Sicko on the scoped diff.

**Questions.**

- ~~**Q-AGENTS1** Is benny a first-class skill on this map?~~ ✓ No. Dormant automation pack; not registered slash skills (2026-09-15).

## Flows (representative packets)

Payload shapes are what the design implies, not measured traffic.

### Rigorous change via poteto-mode

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | MODE → PRIN | index principles | `{"at":"task-start"}` |
| 2 | MODE → HOW | nontrivial → how | `{"trigger":"are we sure?"}` |
| 3 | MODE → ARCH | cross boundary → architect | `{"panel":"fable/sol/grok/opus"}` |
| 4 | MODE → TDD | cheap local test? | `{"when":"explicit or cheap"}` |
| 5 | MODE → INT | contested → interrogate | `{"reviewers":4}` |
| 6 | MODE → CLEAN | unslop + no-comments | `{"before":"review"}` |
| 7 | MODE → MODE | opening-a-pr | `{"playbook":"opening-a-pr"}` |

### Understand before editing

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | MODE → HOW | investigation playbook | `{"readOnly":true}` |
| 2 | HOW → WHY | rationale + MCP evidence | `{"parallel":true}` |
| 3 | HOW → TEACH | weave plain explanation | `{"diagrams":true}` |
| 4 | RECALL → MODE | current-state brief | `{"resume":true}` |

### Ship overnight

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | MODE → FIG | stepping away → figure-it-out | `{"contract":"done means…"}` |
| 2 | FIG → SHOW | decision TSV | `{"commit":"when stakes need it"}` |
| 3 | MODE → MODE | babysit → shipping | `{"playbooks":["babysit","shipping"]}` |
| 4 | MODE → VER | prove on real app | `{"principle":"prove-it-works"}` |
| 5 | BLAST → MODE | safe because… | `{"evidence":"ran code"}` |

### Fearless parallelism

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | SETUP → MODE | pstack-models.mdc | `{"panel":"fable/sol/grok/opus"}` |
| 2 | MODE → PARALLEL | arena bakeoff or swarm fan-out | `{"workers":"N"}` |
| 3 | PARALLEL → INT | optional adversarial pass | `{}` |
| 4 | PARALLEL → CLEAN | unslop the winning graft | `{}` |

## Questions — index

Reference by ID. ✓ resolved (with date) · otherwise open.

- ~~**Q-MODE1**~~ (MODE) ✓ No. Collapsed into MODE how/steps, FLOWS, and journey chapters (2026-09-15).
- ~~**Q-MODE2**~~ (MODE) ✓ No. README table lists skills you can slash directly; mode just routes most of them for you (2026-09-15).
- **Q-MODE3** (MODE) Will plugin.json version (0.15.2 at atlas snapshot) and the 23-playbook set stay stable, or should the atlas be re-synced periodically?
- ~~**Q-SETUP1**~~ (SETUP) ✓ No. Defaults are upstream skill text; setup-pstack must confirm what you actually have (2026-09-15).
- **Q-SETUP2** (SETUP) Have Alan's local pstack-models.mdc or forks drifted from these upstream defaults?
- ~~**Q-PARALLEL1**~~ (PARALLEL) ✓ No. Arena is competing attempts at one artifact with grafting; swarm is parallel coverage across slices (2026-09-15).
- ~~**Q-CLEAN1**~~ (CLEAN) ✓ No. Ships in cursor-team-kit; poteto-mode still expects it before commit (2026-09-15).
- ~~**Q-FIG1**~~ (FIG) ✓ Orchestrate = standing project-scale program (multi-day, many stacked PRs, fleet under one coordinator). figure-it-out = one bespoke run (2026-09-15).
- ~~**Q-PRIN1**~~ (PRIN) ✓ No. Collapsed into PRIN by design — constitution, not navigation targets (2026-09-15).
- ~~**Q-AGENTS1**~~ (AGENTS) ✓ No. Dormant automation pack; not registered slash skills (2026-09-15).

## What the platform gives vs what we own

**Platform gives:** Cursor plugin host, Task subagents, multi-model panels, sticky mode skills, slash skills, agents/

**We own:** which skill to invoke, the overnight contract, personal -mode via automate-me, pstack-models.mdc overrides

## Planned filesystem

```
skills/
  poteto-mode/     sticky door + 23 playbooks + principles index
  setup-pstack/    per-role model rule writer
  how why teach recall blast-radius/
  architect arena swarm tdd/
  interrogate no-comments unslop technical-writing bro show-me-your-work/
  automate-me reflect figure-it-out make-bot-ui/
  create-verification-skill maintain-verification-skill/
  typescript-best-practices/
  principle-*/     23 leaf principles (constitution, not daily entry)
agents/
  poteto-agent.md  Comment Sicko.md
docs/guide/        01-setup … 10-recipes-and-pitfalls
automations/benny/ dormant Slack triage+fix pack (not slash skills)
.cursor-plugin/    plugin.json (v0.15.2 as of atlas snapshot)
```

## How this file is maintained

Generated from `pstack/atlas/data.mjs` by `node pstack/atlas/build.mjs`, which also builds the interactive atlas (`atlas.html`, published at https://adg29.github.io/system-atlas-directory/pstack/). Edit the data file, rebuild, republish — never edit this file by hand.
