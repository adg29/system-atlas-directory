// Single source of truth for the pstack atlas. Built by: node pstack/atlas/build.mjs
// Primer: /workspace/pstack-atlas/primer.md (public main of cursor/plugins path pstack/)

const R = 'https://github.com/cursor/plugins/blob/main/pstack';

export const META = {
  title: 'pstack',
  artifactUrl: 'https://adg29.github.io/system-atlas-directory/pstack/',
  sourcePath: 'pstack/atlas/data.mjs',
  buildCmd: 'node pstack/atlas/build.mjs',
  stats: [
    { k: 'System', v: 'pstack · cursor/plugins' },
    { k: 'Skills', v: '47 dirs' },
    { k: 'Playbooks', v: '23' },
    { k: 'License', v: 'MIT' },
  ],
  intro: `_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._ MIT-licensed skills by Lauren Tan (poteto) in [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Install with \`/add-plugin pstack\`. This map is a **which-skill-when** reference — not a TypeScript package DAG.`,
  onePara: `poteto's engineering-team skills for Cursor. poteto-mode is the door for non-trivial work; other skills are situational and fire as playbook steps need them. Fearless parallelism and multi-model panels are the point: write less, higher quality code you can trust enough to parallelize.`,
  costModel: [
    '- MIT plugin. No separate pstack fee. Model spend is whatever Cursor bills for the models `/setup-pstack` assigns per role.',
    '- Default panel (upstream README): fable 5.1 / sol / grok / opus 5. Code delegates default to grok; judgment and prose to fable. Override with `/setup-pstack`.',
    '- Sibling plugin `cursor-team-kit` adds `/deslop`, `control-cli`, and `control-ui` that poteto-mode expects for full coverage.',
    '',
  ],
  deepDive: `Source: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Guide: [docs/guide](${R}/docs/guide/README.md). Mode: [skills/poteto-mode/SKILL.md](${R}/skills/poteto-mode/SKILL.md). Setup: [skills/setup-pstack/SKILL.md](${R}/skills/setup-pstack/SKILL.md). License: [LICENSE](${R}/LICENSE).`,
  platformGives: 'Cursor plugin host, Task subagents, multi-model panels, sticky mode skills, slash skills, agents/',
  weOwn: 'which skill to invoke, the overnight contract, personal -mode via automate-me, pstack-models.mdc overrides',
  filesystem: `skills/
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
.cursor-plugin/    plugin.json (v0.15.2 as of atlas snapshot)`,
};

export const DECISIONS = [
  {
    axis: 'Entry',
    decision: 'poteto-mode is the default for non-trivial work. setup-pstack configures models once. Other skills are situational; the mode fires them as steps need them.',
    adr: `[README.md](${R}/README.md) · [skills/poteto-mode/SKILL.md](${R}/skills/poteto-mode/SKILL.md)`,
  },
  {
    axis: 'Routing',
    decision: 'Mode matches a playbook, copies its steps into a todolist verbatim, then routes to skills as those steps fire. Large or "stepping away" work goes to figure-it-out; standing multi-day programs to orchestrate.',
    adr: `[docs/guide/02-poteto-mode.md](${R}/docs/guide/02-poteto-mode.md)`,
  },
  {
    axis: 'Multi-model',
    decision: 'Roles split by strength. Upstream defaults: panel fable 5.1 / sol / grok / opus 5; code delegates (feature, refactoring, bug-fix, perf, hillclimb) → grok; judgment and prose → fable. setup-pstack writes ~/.cursor/rules/pstack-models.mdc to override.',
    adr: `[README.md](${R}/README.md) · [skills/setup-pstack/SKILL.md](${R}/skills/setup-pstack/SKILL.md)`,
  },
  {
    axis: 'Principles',
    decision: 'Twenty-three principle-* skills are the design constitution. poteto-mode indexes them inline at task start. They are not daily slash entry points.',
    adr: `[README.md#principles](${R}/README.md) · [docs/guide/08-principles.md](${R}/docs/guide/08-principles.md)`,
  },
  {
    axis: 'License',
    decision: 'MIT. Copyright (c) 2026 Lauren Tan. Fork it, improve it, make it yours.',
    adr: `[LICENSE](${R}/LICENSE)`,
  },
];

export const GROUPS = [
  { id: 'door', title: 'The door' },
  { id: 'investigate', title: 'Understand first' },
  { id: 'design', title: 'Design & build' },
  { id: 'review', title: 'Review & voice' },
  { id: 'meta', title: 'Encode & verify' },
  { id: 'constitution', title: 'Constitution' },
  { id: 'off', title: 'Agents (not slash skills)' },
];

export const NODES = [
  {
    id: 'MODE',
    code: 'MODE',
    name: 'poteto-mode',
    short: 'MODE',
    group: 'door',
    gx: 1,
    gy: 6,
    w: 2.6,
    d: 2.4,
    h: 56,
    kind: 'tall',
    one: 'Default entry for any non-trivial task — sticky mode that matches a playbook and fires the other skills.',
    what: 'poteto\'s agent style: concise detailed replies, deliberate subagents, unslopped prose, simple code, verified work. Twenty-three playbooks live under its playbooks/ folder. Once entered it stays on across turns when rigor is needed; opt out by saying so. Works with Cursor\'s /loop for long overnight runs.',
    how: `<code>skills/poteto-mode/SKILL.md</code> plus <mark>playbooks/*.md</mark> (23). Reads the inline Principles index at task start. Spawns <code>subagent_type: "poteto-agent"</code> for playbook delegates.`,
    steps: [
      ['Match', 'Pick the playbook (investigation, bug-fix, feature, babysit, shipping, autonomous-run, …).'],
      ['Todo', 'Open a todolist whose first items are that playbook\'s steps, copied verbatim.'],
      ['Route', 'As steps fire, call how / architect / arena / swarm / interrogate / unslop / tdd / …'],
      ['Reply', 'Unslopped prose framed for the consumer and the maintainer; every other playbook ends in opening-a-pr.'],
    ],
    cond: [
      { q: 'Are the 23 playbooks separate atlas nodes?', r: 'No. Collapsed into MODE how/steps, FLOWS, and journey chapters (2026-09-15).' },
      { q: 'Is poteto-mode the only way to invoke other skills?', r: 'No. README table lists skills you can slash directly; mode just routes most of them for you (2026-09-15).' },
      'Will plugin.json version (0.15.2 at atlas snapshot) and the 23-playbook set stay stable, or should the atlas be re-synced periodically?',
    ],
  },

  {
    id: 'SETUP',
    code: 'SETUP',
    name: 'setup-pstack',
    short: 'SETUP',
    group: 'door',
    gx: 1,
    gy: 2.2,
    w: 2.4,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'Configure which models pstack uses per role and at what reasoning budget — run once, re-run to change.',
    what: 'Detects available Task model slugs, asks for a budget (unlimited / large / medium / small), confirms the role map, and writes an always-applied rule that overrides skill defaults. Every skill reads the rule; missing lines fall back to defaults.',
    how: `<code>skills/setup-pstack/SKILL.md</code> → writes <mark>~/.cursor/rules/pstack-models.mdc</mark> with alwaysApply: true. Default panel roles include arena/architect/interrogate reviewers as fable+sol+grok+opus.`,
    steps: [
      ['Detect', 'Enumerate model slugs this session can pass to Task.'],
      ['Budget', 'Pick unlimited / large / medium / small; remap effort tokens.'],
      ['Confirm', 'Show every role; accept or change; validate slugs.'],
      ['Write', 'Overwrite pstack-models.mdc; offer create-verification-skill if the project lacks a verify harness.'],
    ],
    cond: [
      { q: 'Do default model slugs match every Cursor entitlement?', r: 'No. Defaults are upstream skill text; setup-pstack must confirm what you actually have (2026-09-15).' },
      'Have Alan\'s local pstack-models.mdc or forks drifted from these upstream defaults?',
    ],
  },

  {
    id: 'HOW',
    code: 'HOW',
    name: 'how',
    short: 'HOW',
    group: 'investigate',
    gx: 5.2,
    gy: 8.2,
    w: 2.2,
    d: 2,
    h: 42,
    kind: 'box',
    one: 'I need a walkthrough of how a subsystem works — architecture, runtime flow, where something should live.',
    what: 'Explains subsystem architecture, runtime flow, and onboarding mental models. Also placement / ownership / layering questions. Use why for motivation and history; use teach when you want how+why woven into one plain explanation.',
    how: `<code>skills/how/SKILL.md</code>. poteto-mode non-negotiable: nontrivial change, architecture decision, or "are we sure?" → how.`,
    steps: [
      ['Scope', 'Name the subsystem or placement question.'],
      ['Explore', 'how explorer (default grok) gathers structure.'],
      ['Explain', 'how explainer (default fable) writes the walkthrough.'],
    ],
    cond: [],
  },

  {
    id: 'WHY',
    code: 'WHY',
    name: 'why',
    short: 'WHY',
    group: 'investigate',
    gx: 5.2,
    gy: 5.2,
    w: 2.2,
    d: 2,
    h: 42,
    kind: 'box',
    one: 'I need to know why something was built this way — design rationale with evidence, not vibes.',
    what: 'Discovers available MCPs at run time and queries evidence categories in parallel: source control, issue tracker, long-form docs, real-time chat, infra observability, error tracking, analytics warehouse. For regressions, postmortems, data-backed thresholds.',
    how: `<code>skills/why/SKILL.md</code>. Investigators default grok; synthesizer default fable (overridable via setup-pstack).`,
    steps: [
      ['Discover', 'Enumerate MCP evidence sources available this session.'],
      ['Query', 'Fan out investigators per category in parallel.'],
      ['Synthesize', 'One cited answer with evidence labels.'],
    ],
    cond: [],
  },

  {
    id: 'TEACH',
    code: 'TEACH',
    name: 'teach',
    short: 'TEACH',
    group: 'investigate',
    gx: 5.2,
    gy: 2.2,
    w: 2.2,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'I need to actually understand a change or subsystem — not just a summary.',
    what: 'Runs the how and why skills and weaves what they find into one clear explanation, built up diagram by diagram. For "teach me this", "help me really understand X", "explain this change to me".',
    how: `<code>skills/teach/SKILL.md</code>. Composes HOW + WHY rather than replacing them.`,
    steps: [
      ['Gather', 'Invoke how and why on the same subject.'],
      ['Weave', 'One plain explanation with progressive diagrams.'],
      ['Check', 'Reader can restate the mental model.'],
    ],
    cond: [],
  },

  {
    id: 'RECALL',
    code: 'RECALL',
    name: 'recall',
    short: 'RECALL',
    group: 'investigate',
    gx: 8.2,
    gy: 7.4,
    w: 2.2,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'I need my recent context rebuilt — catch me up before I start or resume.',
    what: 'Reconstructs recent working context from your own chat history, live state, and the shared record (user reports, prior fixes, incidents), then hands back a tight current-state brief.',
    how: `<code>skills/recall/SKILL.md</code>. Pairs with session-pickup playbook when taking over another agent\'s in-flight work.`,
    steps: [
      ['Mine', 'Chat history + live state + shared record.'],
      ['Brief', 'Tight current-state handoff, not a dump.'],
    ],
    cond: [],
  },

  {
    id: 'ARCH',
    code: 'ARCH',
    name: 'architect',
    short: 'ARCHITECT',
    group: 'design',
    gx: 11.4,
    gy: 8.4,
    w: 2.4,
    d: 2.2,
    h: 48,
    kind: 'box',
    one: 'I need the shape settled before code — types, signatures, module structure.',
    what: 'Sketch types, signatures, and module structure before implementation, then stay in the loop while code fills in. For non-trivial work crossing a function boundary where jumping to code would lock in the wrong shape. Runs a multi-model panel (default fable/sol/grok/opus).',
    how: `<code>skills/architect/SKILL.md</code>. poteto-mode: code crossing a function boundary → architect, with parallel design exploration before implementing.`,
    steps: [
      ['Sketch', 'Caller usage, types, module shape first.'],
      ['Panel', 'architect runners compare approaches.'],
      ['Fill', 'Stay in the loop while implementation follows the sketch.'],
    ],
    cond: [],
  },

  {
    id: 'TDD',
    code: 'TDD',
    name: 'tdd',
    short: 'TDD',
    group: 'design',
    gx: 11.4,
    gy: 5.2,
    w: 2.2,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'I need a failing test first — only when asked, or when the bug has an obvious cheap local test target.',
    what: 'Write the failing test, then the fix. Skip when the test path is unclear, expensive, integration-heavy, or not requested. Grounded in principle-test-behavior-not-implementation.',
    how: `<code>skills/tdd/SKILL.md</code>. Frontmatter: use only when user explicitly asks for TDD / failing / regression test, OR cheap local target.`,
    steps: [
      ['Red', 'Failing test that calls the code the way users do.'],
      ['Green', 'Smallest fix that makes the assertion pass.'],
      ['Prove', 'Assert against a literal expected value, not mocks of every import.'],
    ],
    cond: [],
  },

  {
    id: 'BLAST',
    code: 'BLAST',
    name: 'blast-radius',
    short: 'BLAST',
    group: 'design',
    gx: 11.4,
    gy: 2.2,
    w: 2.2,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'I have a small-looking change and do not trust it — what else could it break?',
    what: 'Finds what a change could break somewhere else before it ships, beyond the diff, and proves the one fact it is safe because of by running real code instead of writing it up.',
    how: `<code>skills/blast-radius/SKILL.md</code>. Common in babysit / shipping / refactoring playbook steps.`,
    steps: [
      ['Map', 'Callers, neighbors, shared state beyond the diff.'],
      ['Prove', 'Run the one fact that makes it safe — real code, not prose.'],
    ],
    cond: [],
  },

  {
    id: 'PARALLEL',
    code: 'PARALLEL',
    name: 'arena + swarm',
    short: 'PARALLEL',
    group: 'design',
    gx: 14.6,
    gy: 6.4,
    w: 2.6,
    d: 2.4,
    h: 52,
    kind: 'tall',
    one: 'I need fearless parallelism — bake off designs (arena) or fan out coverage (swarm).',
    what: 'Two complementary skills. arena: spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers. swarm: fan out N workers across different slices, races, or gauntlets and return one report. poteto-mode routes contested design to arena; coverage matrices and exploration partitions to swarm.',
    how: `<code>skills/arena/SKILL.md</code> + <code>skills/swarm/SKILL.md</code>. Default arena runners / cross-judge pool: fable, sol, grok, opus. Default swarm workers: grok.`,
    steps: [
      ['Choose', 'Same-task bakeoff → arena. Partitioned coverage → swarm.'],
      ['Fan out', 'N background Task workers with explicit models.'],
      ['Merge', 'Arena grafts; swarm aggregates one report.'],
    ],
    cond: [
      { q: 'Are arena and swarm interchangeable?', r: 'No. Arena is competing attempts at one artifact with grafting; swarm is parallel coverage across slices (2026-09-15).' },
    ],
  },

  {
    id: 'INT',
    code: 'INT',
    name: 'interrogate',
    short: 'INTERROGATE',
    group: 'review',
    gx: 18,
    gy: 8.2,
    w: 2.4,
    d: 2.2,
    h: 48,
    kind: 'box',
    one: 'I have a diff and want several models to try to break it.',
    what: 'Multi-model adversarial review. Reviewers challenge changes from independent angles, including a strict code-quality lens. poteto-mode: contested design → interrogate before shipping.',
    how: `<code>skills/interrogate/SKILL.md</code>. Default interrogate reviewers panel: fable, sol, grok, opus.`,
    steps: [
      ['Scope', 'Pass the diff or PR.'],
      ['Panel', 'Independent reviewers attack from different angles.'],
      ['Triage', 'Fix real findings; dismiss noise with a concrete reason.'],
    ],
    cond: [],
  },

  {
    id: 'CLEAN',
    code: 'CLEAN',
    name: 'unslop · no-comments · writing',
    short: 'CLEAN',
    group: 'review',
    gx: 18,
    gy: 4.8,
    w: 2.6,
    d: 2.4,
    h: 52,
    kind: 'tall',
    one: 'I need the writing and the comments cleaned — AI tells gone, comments stripped, docs on standard.',
    what: 'Collapsed writing/voice cluster. unslop cuts AI tells from any writing and must always apply. no-comments spawns Comment Sicko, fixes accepted findings, offers encodings for claimed constraints. technical-writing is the layered doc standard (Diátaxis + Google developer style + STE + Global English). bro restates the last message in plain human language. typescript-best-practices grounds type-system-discipline on .ts/.tsx.',
    how: `<code>skills/unslop</code>, <code>no-comments</code>, <code>technical-writing</code>, <code>bro</code>, <code>typescript-best-practices</code>. Before commit poteto-mode also expects <mark>/deslop</mark> from cursor-team-kit (not bundled).`,
    steps: [
      ['Prose', 'Draft clean; unslop patterns are stable rule ids other skills cite.'],
      ['Comments', '/no-comments → Comment Sicko → fix accepted findings.'],
      ['Docs', '/technical-writing for RFCs, readmes, PR bodies, commits.'],
      ['Plain', '/bro when jargon piled up.'],
    ],
    cond: [
      { q: 'Is /deslop part of pstack?', r: 'No. Ships in cursor-team-kit; poteto-mode still expects it before commit (2026-09-15).' },
    ],
  },

  {
    id: 'SHOW',
    code: 'SHOW',
    name: 'show-me-your-work',
    short: 'SHOW',
    group: 'review',
    gx: 18,
    gy: 1.6,
    w: 2.2,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'I am stepping away — keep a reviewable decision trail I can audit later.',
    what: 'TSV log with one row per decision (what, why, evidence, result). Local by default; commit when a reviewer needs the trail. Wired into overnight / autonomous / multi-phase work and figure-it-out.',
    how: `<code>skills/show-me-your-work/SKILL.md</code>. poteto-mode non-negotiable for "going to bed" / /loop until X / trust-it-when-back.`,
    steps: [
      ['Open', 'Start the TSV decision log for the run.'],
      ['Row', 'One row per decision with evidence and result.'],
      ['Commit', 'Only when stakes need an auditable record.'],
    ],
    cond: [],
  },

  {
    id: 'FIG',
    code: 'FIG',
    name: 'figure-it-out',
    short: 'FIGURE',
    group: 'meta',
    gx: 21.4,
    gy: 7.6,
    w: 2.4,
    d: 2.2,
    h: 48,
    kind: 'box',
    one: 'No bundled playbook fits — or the work is large / I am stepping away and need an auditable bespoke plan.',
    what: 'Designs a rigorous, auditable playbook when no narrower one fits: large migrations, ambitious multi-part changes, or work a human reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, logs decisions via show-me-your-work. Distinct from orchestrate (standing multi-day programs).',
    how: `<code>skills/figure-it-out/SKILL.md</code>. Guide overnight chapter routes "going to bed" migrations here.`,
    steps: [
      ['Design', 'Bespoke playbook with verifiable phase boundaries.'],
      ['Log', 'Wire show-me-your-work decision trail.'],
      ['Loop', 'Hypothesis → smallest change → prove against real artifact.'],
    ],
    cond: [
      { q: 'When is orchestrate preferred over figure-it-out?', r: 'Orchestrate = standing project-scale program (multi-day, many stacked PRs, fleet under one coordinator). figure-it-out = one bespoke run (2026-09-15).' },
    ],
  },

  {
    id: 'ENCODE',
    code: 'ENCODE',
    name: 'reflect · automate-me',
    short: 'ENCODE',
    group: 'meta',
    gx: 21.4,
    gy: 4.4,
    w: 2.4,
    d: 2.2,
    h: 46,
    kind: 'box',
    one: 'I need the lesson captured — as a skill edit, or as my own -mode.',
    what: 'reflect: three parallel review subagents over the active transcript; surface learnings; route each to a concrete edit on an existing skill. automate-me: mine recent transcripts, draft a personal <name>-mode skill via create-skill + unslop, keep pstack as the base. make-bot-ui (related, niche): page/dashboard whose buttons wake a Grok Bot over a webhook.',
    how: `<code>skills/reflect/SKILL.md</code> + <code>skills/automate-me/SKILL.md</code>. Optional sibling: <code>skills/make-bot-ui/SKILL.md</code> (webhook UI + Tailscale; sender key stays on server).`,
    steps: [
      ['Reflect', 'Spawn tooling + judgment + divergent reviewers; land skill edits.'],
      ['Automate', '/automate-me drafts your -mode from how you actually work.'],
      ['Bot UI', 'Only when building a webhook-waking dashboard for a Grok Bot.'],
    ],
    cond: [],
  },

  {
    id: 'VER',
    code: 'VER',
    name: 'verification skills',
    short: 'VERIFY',
    group: 'meta',
    gx: 21.4,
    gy: 1.4,
    w: 2.4,
    d: 2,
    h: 44,
    kind: 'box',
    one: 'I need a scripted way to prove the app behaves — create it once, maintain when it drifts.',
    what: 'create-verification-skill generates a project-local verification skill that drives the app the way a user does (any language/framework/platform) with a feature map. maintain-verification-skill runs parallel source readers per feature plus one live session, and opens at most one PR of proven corrections.',
    how: `<code>skills/create-verification-skill/SKILL.md</code> + <code>skills/maintain-verification-skill/SKILL.md</code>. setup-pstack offers create once if the project has no verify harness. Full UI/CLI proof also uses control-ui / control-cli from cursor-team-kit.`,
    steps: [
      ['Create', 'Feature map + verify skill that drives the real surface.'],
      ['Maintain', 'Source wave + one live pass; ≤1 PR of proven fixes.'],
      ['Ship', 'Playbooks call prove-it-works against the real artifact.'],
    ],
    cond: [],
  },

  {
    id: 'PRIN',
    code: 'PRIN',
    name: 'principles (×23)',
    short: 'PRINCIPLES',
    group: 'constitution',
    gx: 8.2,
    gy: 1.2,
    w: 2.8,
    d: 2.4,
    h: 56,
    kind: 'tall',
    one: 'Design constitution — named rules poteto-mode indexes; not daily slash entry points.',
    what: 'Twenty-three short skills, one principle each. poteto-mode indexes them inline and reads that index at task start; cite only principles whose leaf SKILL.md you read this session. Groups: core (laziness, foundational thinking, redesign, attack-the-premise, subtract-before-add, minimize-reader-load, outcome-oriented, experience-first, exhaust-design-space, build-the-lever), architecture (model-the-domain, boundary, type-system, idempotent, migrate-then-delete, separate-before-serialize), verification (prove-it-works, fix-root-causes, sequence-verifiable-units, test-behavior-not-implementation), delegation (guard-context-window, never-block-on-human), meta (encode-lessons-in-structure).',
    how: `<code>skills/principle-*/SKILL.md</code> (23 dirs). Guide: <code>docs/guide/08-principles.md</code>. typescript-best-practices grounds type-system-discipline in syntax.`,
    steps: [
      ['Index', 'Mode reads the inline Principles section at task start.'],
      ['Apply', 'Name each principle that shaped a decision and the choice it changed.'],
      ['Leaf', 'Read the leaf SKILL.md before citing it.'],
    ],
    cond: [
      { q: 'Should each principle be its own atlas node?', r: 'No. Collapsed into PRIN by design — constitution, not navigation targets (2026-09-15).' },
    ],
  },

  {
    id: 'AGENTS',
    code: 'AGENTS',
    name: 'poteto-agent · Comment Sicko',
    short: 'AGENTS',
    group: 'off',
    gx: 25,
    gy: 5,
    w: 2.4,
    d: 2.2,
    h: 44,
    kind: 'box',
    ghost: true,
    one: 'Subagents, not slash skills — poteto-agent is the mode wrapper; Comment Sicko is the comment hater.',
    what: 'poteto-agent: routing target for /poteto-mode and any request for poteto\'s style; must read poteto-mode SKILL.md (including principles index) before work — substituting generalPurpose drifts. Comment Sicko: read-only deranged comment reviewer; usually invoke through /no-comments, not directly. Benny automations are a separate dormant pack under automations/benny/.',
    how: `<code>agents/poteto-agent.md</code> + <code>agents/comment-sicko.md</code>. plugin.json registers agents: ./agents/.`,
    steps: [
      ['Spawn', 'Playbook delegates use subagent_type poteto-agent.'],
      ['Comments', 'no-comments spawns Comment Sicko on the scoped diff.'],
    ],
    cond: [
      { q: 'Is benny a first-class skill on this map?', r: 'No. Dormant automation pack; not registered slash skills (2026-09-15).' },
    ],
  },
];

export const FLOWS = [
  {
    id: 'rigor',
    name: 'Rigorous change via poteto-mode',
    hops: [
      ['MODE', 'PRIN', 'index principles', { at: 'task-start' }, 'xy'],
      ['MODE', 'HOW', 'nontrivial → how', { trigger: 'are we sure?' }, 'xy'],
      ['MODE', 'ARCH', 'cross boundary → architect', { panel: 'fable/sol/grok/opus' }, 'xy'],
      ['MODE', 'TDD', 'cheap local test?', { when: 'explicit or cheap' }, 'yx'],
      ['MODE', 'INT', 'contested → interrogate', { reviewers: 4 }, 'xy'],
      ['MODE', 'CLEAN', 'unslop + no-comments', { before: 'review' }, 'xy'],
      ['MODE', 'MODE', 'opening-a-pr', { playbook: 'opening-a-pr' }, 'yx'],
    ],
  },
  {
    id: 'investigate',
    name: 'Understand before editing',
    hops: [
      ['MODE', 'HOW', 'investigation playbook', { readOnly: true }, 'xy'],
      ['HOW', 'WHY', 'rationale + MCP evidence', { parallel: true }, 'xy'],
      ['HOW', 'TEACH', 'weave plain explanation', { diagrams: true }, 'yx'],
      ['RECALL', 'MODE', 'current-state brief', { resume: true }, 'yx'],
    ],
  },
  {
    id: 'overnight',
    name: 'Ship overnight',
    hops: [
      ['MODE', 'FIG', 'stepping away → figure-it-out', { contract: 'done means…' }, 'xy'],
      ['FIG', 'SHOW', 'decision TSV', { commit: 'when stakes need it' }, 'xy'],
      ['MODE', 'MODE', 'babysit → shipping', { playbooks: ['babysit', 'shipping'] }, 'yx'],
      ['MODE', 'VER', 'prove on real app', { principle: 'prove-it-works' }, 'xy'],
      ['BLAST', 'MODE', 'safe because…', { evidence: 'ran code' }, 'yx'],
    ],
  },
  {
    id: 'parallel',
    name: 'Fearless parallelism',
    hops: [
      ['SETUP', 'MODE', 'pstack-models.mdc', { panel: 'fable/sol/grok/opus' }, 'xy'],
      ['MODE', 'PARALLEL', 'arena bakeoff or swarm fan-out', { workers: 'N' }, 'xy'],
      ['PARALLEL', 'INT', 'optional adversarial pass', {}, 'xy'],
      ['PARALLEL', 'CLEAN', 'unslop the winning graft', {}, 'yx'],
    ],
  },
];

export const CH = [
  {
    id: 'enter',
    title: 'You enter the mode',
    reveal: ['MODE', 'PRIN'],
    lede: `I need rigor on this task → /poteto-mode is the door.`,
    story: `<p>Type <mark>/poteto-mode</mark> with a goal and a way to check it. Mode matches one of twenty-three playbooks, copies the steps into a todolist, and keeps the principles index in view. Sticky across turns until you opt out. The other skills stay situational — mode fires them when a step needs them.</p>`,
    flow: [
      ['MODE', 'PRIN', 'read principles index', { cite: 'only leaves read' }],
      ['MODE', 'MODE', 'match playbook', { example: 'bug-fix' }],
    ],
  },
  {
    id: 'setup',
    title: 'Setup once',
    reveal: ['SETUP'],
    lede: `I need the right models per role → /setup-pstack.`,
    story: `<p>Run <mark>/setup-pstack</mark> once. Pick a reasoning budget, confirm the role map, write <code>~/.cursor/rules/pstack-models.mdc</code>. Upstream defaults send code delegates to grok and judgment/prose to fable; the review panel is fable / sol / grok / opus. Re-run whenever entitlements or taste change.</p>`,
    flow: [
      ['SETUP', 'MODE', 'alwaysApply rule', { file: 'pstack-models.mdc' }],
    ],
  },
  {
    id: 'understand',
    title: 'Understand the system',
    reveal: ['HOW', 'WHY', 'TEACH', 'RECALL'],
    lede: `I need to understand X before I touch it.`,
    story: `<p><mark>/how</mark> walks architecture and placement. <mark>/why</mark> gathers MCP evidence for rationale. <mark>/teach</mark> weaves both into one plain explanation. <mark>/recall</mark> rebuilds your recent context as a tight brief. Investigation playbook stays read-only until you choose a change.</p>`,
    flow: [
      ['MODE', 'HOW', 'how does X work?', {}],
      ['HOW', 'WHY', 'why this way?', { mcp: 'parallel' }],
      ['HOW', 'TEACH', 'teach me this', {}],
    ],
  },
  {
    id: 'careful',
    title: 'Change carefully',
    reveal: ['ARCH', 'TDD', 'BLAST'],
    lede: `I need the shape right, a cheap test, and a blast-radius proof.`,
    story: `<p><mark>/architect</mark> settles types and module shape before code. <mark>/tdd</mark> only when asked or the local test is cheap. <mark>/blast-radius</mark> finds what else could break and proves safety by running real code. Feature / refactoring / bug-fix playbooks wire these in.</p>`,
    flow: [
      ['MODE', 'ARCH', 'cross function boundary', {}],
      ['ARCH', 'TDD', 'failing test first?', { when: 'cheap' }],
      ['TDD', 'BLAST', 'what else breaks?', {}],
    ],
  },
  {
    id: 'parallel',
    title: 'Parallel attempts',
    reveal: ['PARALLEL'],
    lede: `I need fearless parallelism — bake off or fan out.`,
    story: `<p><mark>/arena</mark> runs N candidates at the same task and grafts the best parts. <mark>/swarm</mark> partitions coverage, races, or gauntlets and returns one report. This is why rigor matters: trusted agents are agents you can parallelize.</p>`,
    flow: [
      ['MODE', 'PARALLEL', 'arena or swarm', { panel: 'fable/sol/grok/opus' }],
      ['SETUP', 'PARALLEL', 'per-role models', {}],
    ],
  },
  {
    id: 'break',
    title: 'Break the diff',
    reveal: ['INT'],
    lede: `I need several models to try to break this change.`,
    story: `<p><mark>/interrogate</mark> is multi-model adversarial review. Contested designs go here before shipping. Bugbot and agentic security comments get a skeptical triage — real bugs fixed, noise dismissed with a reason.</p>`,
    flow: [
      ['MODE', 'INT', 'interrogate this PR', { reviewers: ['fable', 'sol', 'grok', 'opus'] }],
    ],
  },
  {
    id: 'overnight',
    title: 'Ship overnight',
    reveal: ['FIG', 'SHOW', 'VER'],
    lede: `I am going to bed — land it with a checkable finish condition.`,
    story: `<p>Say the goal, the done-means checks, permissions, and an escape hatch. Mode routes large "stepping away" work through <mark>/figure-it-out</mark> and <mark>/show-me-your-work</mark>. Babysit drives a PR to merge-ready; shipping independently verifies then lands the contiguous green run. Create/maintain verification skills so proof hits the real app.</p>`,
    flow: [
      ['MODE', 'FIG', 'overnight contract', { loop: true }],
      ['FIG', 'SHOW', 'decision TSV', {}],
      ['MODE', 'VER', 'prove-it-works', {}],
    ],
  },
  {
    id: 'clean',
    title: 'Clean the writing',
    reveal: ['CLEAN'],
    lede: `I need prose without AI tells, and comments that earn their place.`,
    story: `<p><mark>/unslop</mark> always applies. <mark>/no-comments</mark> spawns Comment Sicko. <mark>/technical-writing</mark> holds docs and PR bodies to Diátaxis + Google style + STE. <mark>/bro</mark> restates jargon in human. Before commit, poteto-mode also expects <code>/deslop</code> from cursor-team-kit.</p>`,
    flow: [
      ['MODE', 'CLEAN', 'unslop reply', {}],
      ['CLEAN', 'CLEAN', 'no-comments → Comment Sicko', {}],
    ],
  },
  {
    id: 'encode',
    title: 'Encode the lesson',
    reveal: ['ENCODE', 'AGENTS'],
    lede: `I need this run to make the next run smarter.`,
    story: `<p><mark>/reflect</mark> turns transcript learnings into skill edits. <mark>/automate-me</mark> drafts your own -mode on top of pstack. Principles push the same idea further: encode lessons in structure (lint, flag, script), not more prose. poteto-agent is the subagent wrapper that keeps mode loaded; Comment Sicko stays behind no-comments.</p>`,
    flow: [
      ['MODE', 'ENCODE', 'reflect', {}],
      ['ENCODE', 'PRIN', 'encode-lessons-in-structure', {}],
      ['CLEAN', 'AGENTS', 'Comment Sicko', { via: 'no-comments' }],
    ],
  },
  {
    id: 'all',
    title: 'The whole skill map',
    reveal: [],
    lede: `Everything at once — pick a journey, or explore freely.`,
    story: `<p>Door on the left, investigate and design in the middle, review and encode on the right, constitution underneath. Playbooks are flows, not buildings. Principles are one tower. Ghosts are agents and the dormant benny pack. Open questions: local forks vs upstream defaults, and whether your Cursor entitlements expose every default slug.</p>`,
    flow: null,
  },
];

export const HOW_HTML = `<div class="eyebrow">pstack · cursor/plugins</div><h1 class="t">How it's built</h1><div class="sub">which skill when — poteto-mode and the skill map</div>
<h3 class="sec">Framing</h3>
<p>MIT skills by Lauren Tan (poteto). Install with <code>/add-plugin pstack</code>. This atlas is a <mark>skill navigation</mark> map for Alan: journeys like "I need to understand X" or "I need rigor overnight", not a package DAG.</p>
<h3 class="sec">Filesystem</h3>
<pre>skills/
  poteto-mode/     sticky door + 23 playbooks + principles index
  setup-pstack/    per-role model rule writer
  how why teach recall blast-radius/
  architect arena swarm tdd/
  interrogate no-comments unslop technical-writing bro show-me-your-work/
  automate-me reflect figure-it-out make-bot-ui/
  create-verification-skill maintain-verification-skill/
  typescript-best-practices/
  principle-*/     23 leaf principles
agents/            poteto-agent · Comment Sicko
docs/guide/        01-setup … 10-recipes-and-pitfalls
automations/benny/ dormant Slack pack (not slash skills)
.cursor-plugin/    plugin.json</pre>
<h3 class="sec">Routing</h3>
<p><mark>/poteto-mode</mark> matches a playbook and fires situational skills as steps need them. <mark>/setup-pstack</mark> writes the always-applied model rule. Principles are the constitution; playbooks are the journeys.</p>
<h3 class="sec">Multi-model</h3>
<p>Default panel: fable 5.1 / sol / grok / opus 5. Code delegates → grok. Judgment and prose → fable. Override per role with setup-pstack. Sibling <code>cursor-team-kit</code> supplies deslop and control-cli/ui.</p>`;
