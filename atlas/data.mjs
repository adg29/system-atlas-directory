// Single source of truth for the QM atlas. Built by: node atlas/build.mjs
// Primer: /workspace/qm-atlas/primer.md (public main of https://github.com/yc-software/qm)

export const META = {
  title: 'QM',
  artifactUrl: '',
  sourcePath: 'atlas/data.mjs',
  buildCmd: 'node atlas/build.mjs',
  stats: [
    { k: 'System', v: 'qm · public main' },
    { k: 'Harnesses', v: '4' },
    { k: 'Postures', v: '3' },
  ],
  intro: `_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._`,
  onePara: `QM is a single-org multiplayer agent runtime. A turn arrives from the web, Slack, or a cron; the core queues it and a hired harness works in that scope's isolated sandbox. Sessions and memory persist. The org owns the deploy directory — not a hosted cloud.`,
  costModel: [],
  deepDive: '',
  platformGives: 'generic core, harness interfaces, Fastify API, Slack-in-process, optional web/admin/portal',
  weOwn: 'org deploy directory (config, sandbox image, tools/skills, infra, secrets)',
  filesystem: `src/                 Node/TS headless core
  index.ts           entry; optional Slack start
  wiring.ts          substrate interfaces
  api/               Fastify /v1/*
  core/              orchestrator handleTurn
  harness/           Pi, OpenCode, Codex, Claude, mock
  tools/             primitives.ts
  sandbox/           local / sprites / smolmachines / aws
  persistence/       Postgres pool · DurableMap · S3
  slack/             in-process Bolt (not a plugin)
  cron/ monitors/ webhooks/ triggers/
  memory/ files/ sessions/ runs/
  identity/ acl/ policy/ security/ resolution/
  deploy/            agent publish (user apps)
  deployment/        org layer store
plugins/
  web-ui/            Vite + Lit
  admin/
  portal/            optional public SSO
  auth/              email magic-link OIDC
  onboarding/        skill, not a process
  chassis/           shared library
cli/                 @yc-software/qm
deploy/              layers/<org>/ (private fork)
docs/                getting-started · deploy-directory · screenshots`,
};

export const DECISIONS = [
  { axis: 'Runtime', decision: 'One Node/TypeScript core process; every substrate sits behind an interface in src/wiring.ts.', adr: '[README](https://github.com/yc-software/qm)' },
  { axis: 'Surfaces', decision: 'Slack is in-process Bolt; web UI, admin, and portal are separate processes over the core HTTP API.', adr: '(repo)' },
  { axis: 'Isolation', decision: 'Each person and each room has its own sandbox, memory, files, and keychain.', adr: '[README](https://github.com/yc-software/qm)' },
  { axis: 'Security', decision: 'Org posture is Strict, Auto, or Dangerous; command policy applies even in Dangerous.', adr: '[SECURITY.md](https://github.com/yc-software/qm/blob/main/SECURITY.md)' },
  { axis: 'Deploy', decision: 'Operator-owned cloud via the qm CLI; this repo has no production deploy workflow.', adr: '[docs/deploy-directory.md](https://github.com/yc-software/qm/blob/main/docs/deploy-directory.md)' },
];

export const GROUPS = [
  { id: 'loop', title: 'The turn' },
  { id: 'store', title: 'What persists' },
  { id: 'work', title: 'The computer' },
  { id: 'surf', title: 'Other surfaces' },
  { id: 'ops', title: 'Operate and deploy' },
  { id: 'off', title: 'Optional front door' },
];

export const NODES = [
  { id: 'UI', code: 'UI', name: 'Web UI', short: 'WEB UI', group: 'loop', gx: 1, gy: 8, w: 2, d: 2, h: 44, kind: 'screen',
    one: 'The page where you talk to the agent in the browser.',
    what: 'A chat you open on the web. You type; answers stream back on that run. Slack threads can be read here but this page will not post into them.',
    how: '<code>plugins/web-ui</code> is a Vite + Lit SPA plus <code>server/index.ts</code>. It signs with source-auth and <mark>POST /v1/turns?async=1</mark>, then follows SSE <code>GET /api/runs/:id/events</code> and <code>GET /v1/runs/:id</code>.',
    steps: [
      ['Type', 'Send a TurnRequest {surface:web, actor, conversation, text}.'],
      ['Queue', 'Core answers 202 {status:queued, runId}.'],
      ['Stream', 'Relay of core partials over SSE, then GET /v1/runs/:id.'],
    ],
    cond: [] },

  { id: 'C', code: 'C', name: 'Core API', short: 'CORE', group: 'loop', gx: 6, gy: 5, w: 2.6, d: 2.4, h: 50, kind: 'box',
    one: 'The front door that takes your message and queues a turn.',
    what: 'One process answers HTTP, checks who you are, and puts the work on a durable queue. The web talks over HTTP; Slack talks to it in the same process.',
    how: '<code>src/index.ts</code> loads config, <code>src/wiring.ts</code> builds the graph, <code>src/api</code> (Fastify) serves <code>/v1/*</code>. <code>app.turn</code> in <code>src/api/app-turn.ts</code> identity-checks, authorizes scope, and <mark>enqueues a run</mark>.',
    steps: [
      ['Accept', 'Verify source-auth, a capability token, or signed portal identity.'],
      ['Authorize', 'Resolve the principal and the scope (personal / channel / group / project / org).'],
      ['Enqueue', 'deps.runs.enqueue; return {status:queued} when async=1.'],
      ['Drive', 'Else processRun inline via drive() in src/api/app-helpers.ts.'],
    ],
    cond: [
      'Which services[] are enabled in the org qm.config.jsonc (Slack? portal? auth vs Google/Slack OIDC? extra plugins?)',
      'Scale and topology — workers, instance count, whether a standalone worker process is used, Fly HA (templates default --ha=false).',
      'Operational exceptions — playground mode, ALLOW_UNAUTHENTICATED_CORE, shared Slack Connect rooms, published-app link holders.',
    ] },

  { id: 'O', code: 'O', name: 'Orchestrator', short: 'ORCHESTRATOR', group: 'loop', gx: 11, gy: 1.4, w: 3, d: 3, h: 64, kind: 'tall',
    one: 'The loop that runs one turn from start to finish.',
    what: 'Once a run is claimed, this is what screens you, hires a harness, calls tools, and writes the result down. It is not a separate Loop service.',
    how: '<code>src/core/orchestrator.ts</code> <mark>handleTurn</mark> plus harness <code>runTurn</code>. README\'s "API · identity · policy · scheduler" are four concerns inside one process.',
    steps: [
      ['Claim', 'A worker or inline drive hands the Run to handleTurn.'],
      ['Screen', 'Resolve principal, scope, policy, and the security screen.'],
      ['Drive', 'Call the hired harness; tools hit execute, files, memory.'],
      ['Persist', 'Session entries and run complete go to the store.'],
    ],
    cond: [] },

  { id: 'H', code: 'H', name: 'Harness', short: 'HARNESS', group: 'loop', gx: 16, gy: 2.6, w: 2.6, d: 2.4, h: 48, kind: 'box',
    one: 'The hired coding agent that actually thinks on this turn.',
    what: 'QM does not ship one model brain. It hires Pi, OpenCode, Codex, or Claude Code — same tools, same core — so a deployment is not tied to one vendor.',
    how: '<code>src/harness/harness-router.ts</code> plus adapters for Pi, OpenCode, Codex, Claude, and mock. Interface: <mark>runTurn, shouldRespond, judge, compact</mark>. Mock is refused in production (<code>src/config.ts</code>).',
    steps: [
      ['Choose', 'Router picks an approved harness and model.'],
      ['Run', 'runTurn walks the fixed tool surface.'],
      ['Unprompted', 'shouldRespond decides silent / react / reply.'],
      ['Compact', 'judge and compact when the thread is long.'],
    ],
    cond: [
      { q: 'Which harnesses exist?', r: 'Pi, OpenCode, Codex, Claude, and mock; mock is refused in production (2026-08-23).' },
      'Harness + models in force (HARNESS, approved harnesses, webui-models).',
    ] },

  { id: 'PG', code: 'PG', name: 'Postgres', short: 'POSTGRES', group: 'store', gx: 5, gy: 10.4, w: 3, d: 3, h: 24, kind: 'store',
    one: 'Where sessions, runs, memory, and the cron queue live when this is real.',
    what: 'Production keeps the conversation, the job queue, grants, and the org layer in Postgres. On a laptop it can all be maps in RAM — those vanish on deploy.',
    how: '<code>src/persistence</code> plus Postgres stores for sessions, runs, memory, grants, and <mark>deployment_layer</mark>. Cron uses pg-boss when <code>DATABASE_URL</code> is set; else an interval sweeper. Dev can be in-memory <code>DurableMap</code>.',
    steps: [
      ['Enqueue', 'runs.enqueue writes a Run.'],
      ['Claim', 'A worker leases the run (heartbeats, reaper, drain).'],
      ['Persist', 'Session entries and run complete.'],
      ['Layer', 'PUT /v1/deployment-layer hydrates org tools and skills.'],
    ],
    cond: [] },

  { id: 'MF', code: 'MF', name: 'Memory & files', short: 'MEMORY', group: 'store', gx: 9.2, gy: 11.2, w: 2.6, d: 2.6, h: 22, kind: 'store',
    one: 'What this person or room already knows, plus the files it made.',
    what: 'Each person and each room has its own notebook and artifact pile. The agent can search, remember, and rewrite — scoped so one room does not leak into another.',
    how: '<code>src/memory</code> (notebook + strategy + optional model capture) and <code>src/files</code> (artifact registry + <code>durable-byte-store</code>). Bytes go to local disk or S3. Tools expose <mark>memory search/read/remember/rewrite</mark>.',
    steps: [
      ['Search', 'Notebook lookup in this scope.'],
      ['Remember', 'Write a note the next turn can find.'],
      ['Files', 'Artifacts and blobs stay with the scope.'],
      ['Capture', 'Optional model-request capture (on by default).'],
    ],
    cond: [] },

  { id: 'TL', code: 'TL', name: 'Tools', short: 'TOOLS', group: 'work', gx: 14, gy: 8.2, w: 2.6, d: 2, h: 28, kind: 'cards',
    one: 'The small set of things the agent is allowed to do.',
    what: 'Not an open plugin marketplace. A fixed surface: run a command, read or write a file, publish an app, remember something, start background work, talk on Slack.',
    how: '<code>src/tools/primitives.ts</code> <code>createToolContext</code> exposes <mark>execute, read, write, publish, memory</mark>, history, MCP, background, cron/webhook control, soul, artifacts, and Slack surface tools. Command policy runs inside execute and backgroundStart.',
    steps: [
      ['Execute', 'Shell in the scope sandbox; command policy classifies the text.'],
      ['Files', 'read / write / publish artifacts.'],
      ['Memory', 'search, read, remember, rewrite.'],
      ['Control', 'background, cron, webhook, Slack post/react/edit.'],
    ],
    cond: [] },

  { id: 'SB', code: 'SB', name: 'Sandbox', short: 'SANDBOX', group: 'work', gx: 17.6, gy: 7.6, w: 3, d: 2, h: 22, kind: 'slab',
    one: 'This person or room\'s own computer, where installed tools stay installed.',
    what: 'Every scope gets an isolated machine. Commands run there, not on the core. The image and org tools come from the deploy layer, not from QM itself.',
    how: '<code>src/sandbox/sandbox.ts</code> plus router <code>sandbox-routing.ts</code>. Backends: <mark>local, sprites, smolmachines, aws</mark> Lambda MicroVM. Optional secondary backend and migration runner. <code>SANDBOX_BACKEND</code> in <code>src/config.ts</code>.',
    steps: [
      ['Route', 'Pick the backend for this scope.'],
      ['Run', 'sandbox.run for execute.'],
      ['Watch', 'Process sessions if the backend supports them.'],
      ['Migrate', 'Optional secondary backend + sandbox-migration-runner.'],
    ],
    cond: [
      'Sandbox backend + image digest actually pinned (sprites vs aws MicroVM vs local; secondary backend?).',
    ] },

  { id: 'G', code: 'G', name: 'Policy', short: 'POLICY', group: 'work', gx: 9.4, gy: 6.6, w: 2, d: 2, h: 42, kind: 'gate',
    one: 'Who you are, what this room allows, and whether the agent must pause.',
    what: 'The org picks one posture — Strict, Auto, or Dangerous — and narrower rooms can only tighten it. Even Dangerous still runs the command policy. That policy is a speed bump, not a sandbox.',
    how: '<code>src/identity</code>, <code>src/acl</code>, <code>src/policy/command-policy.ts</code>, <code>src/security/security-posture.ts</code> + screener, <code>src/resolution</code>. <mark>Strict / Auto / Dangerous</mark>; command policy applies in every posture.',
    steps: [
      ['Identity', 'Map the actor to a principal.'],
      ['Scope', 'Membership, audience floor, egress policy.'],
      ['Posture', 'Strict pauses every tool; Auto screens; Dangerous does not.'],
      ['Command policy', 'Always-on rules inside execute, even in Dangerous.'],
    ],
    cond: [
      'Posture in force (Strict/Auto/Dangerous) and whether a securityScreen proxy is wired.',
      'Who the org admins are (runtime admin_grants, not the seed ADMIN_GRANTS env) and the identity keying (email vs Slack U ids; whether migrate-principals-to-email was run).',
    ] },

  { id: 'SL', code: 'SL', name: 'Slack', short: 'SLACK', group: 'surf', gx: 1, gy: 4, w: 2, d: 2, h: 40, kind: 'screen',
    one: 'The same agent, in Slack — started inside the core, not as a plugin.',
    what: 'Mention it, DM it, or follow a thread. Replies land in-thread. The web can read Slack sessions but will not write back into them.',
    how: '<code>src/slack</code> is an in-process Bolt client (Socket Mode by default), started from <code>src/surfaces/slack-runtime.ts</code>. <code>SlackCoreClient</code> calls <mark>app.turn</mark> in-process — not HTTP. There is no <code>plugins/slack</code>.',
    steps: [
      ['Event', 'Socket Mode app_mention / message.im / thread / reaction.'],
      ['Map', 'Slack user → principal (email by default); conversation dm: or ch:.'],
      ['Turn', 'SlackCoreClient → app.turn({surface:slack}).'],
      ['Reply', 'Edit the Working message, or poll/ack deliveries.'],
    ],
    cond: [
      { q: 'Is Slack a plugin under plugins/slack?', r: 'No. Slack is in-process src/slack, started by the core when tokens are present (2026-08-23).' },
      'Real secrets and connected systems (model keys, Slack workspace, Resend/SMTP, GitHub OIDC trust, RDS snapshot policy).',
    ] },

  { id: 'CR', code: 'CR', name: 'Scheduler', short: 'SCHEDULER', group: 'surf', gx: 14.2, gy: 12.2, w: 2.2, d: 2.2, h: 36, kind: 'job',
    one: 'Work that fires when nobody is watching — a cron, a watch, or a webhook.',
    what: 'A scheduled job, a sandbox process you are watching, or a signed inbound POST all become the same kind of turn. If that turn needs a human and no one is there, it fails closed and leaves a note.',
    how: '<code>src/cron</code>, <code>src/monitors</code>, and <code>src/webhooks</code> share <mark>src/triggers/run-trigger.ts</mark>. Packet: {owner, ownerScopeId, input, fireKey, surface, destination?, message?}.',
    steps: [
      ['Tick', 'Leader lease or pg-boss job claims a due cron (or watch / webhook).'],
      ['Trigger', 'runTrigger → app.turn with surface cron / monitor / webhook.'],
      ['Deliver', 'Optional destination post to Slack or web.'],
      ['Fail closed', 'Unattended require_approval records a note and does not wait.'],
    ],
    cond: [] },

  { id: 'AD', code: 'AD', name: 'Admin', short: 'ADMIN', group: 'surf', gx: 1, gy: 0, w: 2, d: 2, h: 40, kind: 'screen',
    one: 'The org desk: posture, who is an admin, which harnesses and models are allowed.',
    what: 'A separate page for governance and looking around. Admins can read everything in a scope they administer — transcripts, memory, keychain metadata. Audited, not consent-gated.',
    how: '<code>plugins/admin</code> is a separate process that proxies <mark>/v1/admin/</mark>. Admin grant changes and impersonation are portal-only walls — the agent cannot do these itself.',
    steps: [
      ['Open', 'Separate process; source-auth to core.'],
      ['Govern', 'Posture, approved harnesses, models, grants.'],
      ['Observe', 'Transcripts, captured requests, memory, keychain metadata.'],
      ['Wall', 'Grant changes and impersonation stay off the agent API.'],
    ],
    cond: [] },

  { id: 'CL', code: 'CL', name: 'qm CLI', short: 'QM CLI', group: 'ops', gx: 18, gy: -0.4, w: 2.2, d: 2.2, h: 40, kind: 'box',
    one: 'The operator tool that reads your deploy directory and ships QM.',
    what: 'You point this at a folder of config, a sandbox image, tools, and secrets. It checks the contract, plans, and brings QM up in your cloud. That is not the same as the agent publishing a user app.',
    how: '<code>cli/</code>, package <code>@yc-software/qm</code>. Commands: init, check, doctor, plan, <mark>qm up</mark>, sandbox publish, secrets push, rollback. <code>qm up</code> PUTs the layer to <code>PUT /v1/deployment-layer</code>. Agent publish (<code>src/deploy</code>) is a different ship.',
    steps: [
      ['Check', 'qm check (static contract) then qm doctor (read-only cloud).'],
      ['Build', 'qm sandbox publish or qm infra build-image.'],
      ['Up', 'qm plan, then qm up --yes (docker | fly | aws).'],
      ['Layer', 'source-auth PUT /v1/deployment-layer {contract:1, tools[], skills[]}.'],
    ],
    cond: [
      { q: 'Does qm up ship a user app?', r: 'qm up ships QM; agent publish (src/deploy) ships a user app (2026-08-23).' },
      'Which target and account this deployment actually uses (docker vs Fly org vs AWS account/region/cluster), and the live publicUrl.',
      'What lives in the org layer — custom tools, skills, brokered AWS roles, sandbox Dockerfile, connector OAuth clients.',
      'Whether this is a private fork (deploy/layers/<org>/) or a standalone deploy repo from qm init.',
    ] },

  { id: 'PT', code: 'PT', name: 'Portal', short: 'PORTAL', group: 'off', ghost: true, gx: 5, gy: -1.2, w: 2, d: 2, h: 36, kind: 'gate',
    one: 'Later: a public front door that signs people in and proxies to the private apps.',
    what: 'Designed for, optional. When on, the browser hits the portal; the portal reverse-proxies the web UI and admin and hangs a signed identity on the request. Without it, you talk to core (and maybe the UI) directly.',
    how: '<code>plugins/portal</code> is a public SSO reverse proxy. It synthesizes a surface cookie and <code>x-portal-identity</code>. Auth can be <code>plugins/auth</code> or an external OIDC IdP. <mark>Ghost</mark>: typical install may skip it.',
    steps: [
      ['Sign in', 'SSO / IdP (built-in email or external).'],
      ['Proxy', 'Reverse-proxy HTML/API under / to web-ui and admin.'],
      ['Identity', 'Synthesize surface cookie + x-portal-identity.'],
      ['Passthrough', 'Webhook incoming can go through the portal in prod.'],
    ],
    cond: [] },
];

export const FLOWS = [
  { id: 'web', name: 'Web turn', hops: [
    ['UI', 'C', 'POST /v1/turns?async=1', { surface: 'web', actor: 'you@org', conversation: 'dm:you', text: 'ship the weekly note', async: 1 }, 'yx'],
    ['C', 'PG', 'runs.enqueue', { run: { id: 'run_1', surface: 'web', status: 'queued' } }, 'xy'],
    ['C', 'O', 'handleTurn', { runId: 'run_1' }, 'xy'],
    ['O', 'G', 'resolve', { principal: 'you@org', scope: 'personal', posture: 'auto' }, 'yx'],
    ['O', 'H', 'runTurn', { harness: 'pi' }, 'xy'],
    ['H', 'TL', 'tool context', { tools: ['execute', 'read', 'write', 'publish', 'memory'] }, 'xy'],
    ['TL', 'SB', 'sandbox.run', { backend: 'sprites', cmd: 'ls' }, 'xy'],
    ['O', 'PG', 'session + run complete', { session: 'web:you', run: 'complete' }, 'yx'],
    ['C', 'UI', 'events', { status: 'queued', runId: 'run_1', then: 'GET /v1/runs/run_1' }, 'xy'],
  ] },
  { id: 'slack', name: 'Slack turn', hops: [
    ['SL', 'C', 'app.turn', { surface: 'slack', actor: 'you@org', conversation: 'ch:C123:1234.567', text: '@qm weekly note' }, 'yx'],
    ['C', 'PG', 'runs.enqueue', { run: { id: 'run_2', surface: 'slack', status: 'queued' } }, 'xy'],
    ['C', 'O', 'handleTurn', { runId: 'run_2' }, 'xy'],
    ['O', 'G', 'resolve', { principal: 'you@org', scope: 'channel', posture: 'auto' }, 'yx'],
    ['O', 'H', 'runTurn', { harness: 'pi', shouldRespond: 'reply' }, 'xy'],
    ['H', 'TL', 'tool context', { tools: ['execute', 'read', 'write'] }, 'xy'],
    ['TL', 'SB', 'sandbox.run', { backend: 'sprites', cmd: 'ls' }, 'xy'],
    ['O', 'SL', 'reply', { delivery: 'in-thread', edit: 'Working → done' }, 'xy'],
  ] },
  { id: 'cron', name: 'Cron fire', hops: [
    ['CR', 'C', 'runTrigger', { owner: 'you@org', ownerScopeId: 'personal', input: 'weekly note', fireKey: 'cron:weekly', surface: 'cron', destination: 'slack' }, 'yx'],
    ['C', 'O', 'handleTurn', { runId: 'run_3', origin: 'automation' }, 'xy'],
    ['O', 'G', 'resolve', { principal: 'you@org', scope: 'personal', posture: 'auto' }, 'yx'],
    ['O', 'H', 'runTurn', { harness: 'pi' }, 'xy'],
    ['H', 'TL', 'tool context', { tool: 'execute' }, 'xy'],
    ['TL', 'SB', 'sandbox.run', { backend: 'sprites', cmd: 'ls' }, 'xy'],
    ['O', 'SL', 'destination post', { surface: 'cron', destination: 'slack' }, 'xy'],
  ] },
  { id: 'deploy', name: 'qm up', hops: [
    ['CL', 'C', 'PUT /v1/deployment-layer', { contract: 1, tools: [], skills: [] }, 'yx'],
    ['C', 'PG', 'layer store', { table: 'deployment_layer', version: 'sha256:…' }, 'xy'],
  ] },
];

export const CH = [
  { id: 'you', title: 'You type', reveal: ['UI', 'C'],
    lede: `You type in the web UI; the core queues a turn.`,
    story: `<p>Strip everything away and this is QM: a page and a process. You send a message; the core identity-checks you and <mark>queues a durable run</mark>. The answer comes back as events on that run.</p>`,
    flow: [
      ['UI', 'C', 'POST /v1/turns?async=1', { surface: 'web', actor: 'you@org', conversation: 'dm:you', text: 'ship the weekly note', async: 1 }],
      ['C', 'UI', '202 queued', { status: 'queued', runId: 'run_1' }],
    ] },
  { id: 'turn', title: 'The turn', reveal: ['O', 'H'],
    lede: `The orchestrator drives a hired harness through one turn.`,
    story: `<p>A worker (or the HTTP handler itself) claims the run and calls handleTurn. The orchestrator does not think — it <mark>hires a harness</mark> (Pi, OpenCode, Codex, or Claude Code) and walks that turn to completion.</p>`,
    flow: [
      ['UI', 'C', 'POST /v1/turns?async=1', { surface: 'web', text: 'ship the weekly note', async: 1 }],
      ['C', 'O', 'handleTurn', { runId: 'run_1' }],
      ['O', 'H', 'runTurn', { harness: 'pi' }],
      ['C', 'UI', 'events', { status: 'queued', runId: 'run_1' }],
    ] },
  { id: 'remember', title: 'What persists', reveal: ['PG', 'MF'],
    lede: `Sessions and scoped memory outlive the turn.`,
    story: `<p>The queue and the transcript land in Postgres when you are in production — RAM maps on a laptop. Each person and room also has a <mark>scoped notebook and files</mark> the next turn can search.</p>`,
    flow: [
      ['UI', 'C', 'POST /v1/turns?async=1', { surface: 'web', text: 'what did we ship last week?' }],
      ['C', 'PG', 'runs.enqueue', { run: { id: 'run_1', status: 'queued' } }],
      ['C', 'O', 'handleTurn', { runId: 'run_1' }],
      ['O', 'MF', 'memory search', { scope: 'personal', query: 'last week' }],
      ['O', 'PG', 'session + run complete', { session: 'web:you', run: 'complete' }],
    ] },
  { id: 'computer', title: 'The computer', reveal: ['TL', 'SB'],
    lede: `Execute runs in that person or room's own sandbox.`,
    story: `<p>The interesting tool is execute. It does not run on the core. It runs in the <mark>scope's isolated sandbox</mark> — the durable computer where installed tools stay installed.</p>`,
    flow: [
      ['UI', 'C', 'POST /v1/turns?async=1', { surface: 'web', text: 'list the repo' }],
      ['C', 'O', 'handleTurn', { runId: 'run_1' }],
      ['O', 'H', 'runTurn', { harness: 'pi' }],
      ['H', 'TL', 'execute', { tool: 'execute', cmd: 'ls' }],
      ['TL', 'SB', 'sandbox.run', { backend: 'sprites', cmd: 'ls' }],
    ] },
  { id: 'gate', title: 'The gate', reveal: ['G'],
    lede: `Identity, policy, and the org's security posture sit on every turn.`,
    story: `<p>Before tools run, the gate resolves who you are and what this room allows. The org picks <mark>Strict, Auto, or Dangerous</mark>; command policy still classifies shell text in every posture.</p>`,
    flow: [
      ['UI', 'C', 'POST /v1/turns?async=1', { surface: 'web', text: 'rm -rf /' }],
      ['C', 'O', 'handleTurn', { runId: 'run_1' }],
      ['O', 'G', 'resolve', { principal: 'you@org', scope: 'personal', posture: 'auto' }],
      ['O', 'H', 'runTurn', { harness: 'pi' }],
    ] },
  { id: 'slack', title: 'Slack', reveal: ['SL'],
    lede: `Slack is not a sibling process — it lives inside the core.`,
    story: `<p>Mention the bot or DM it. Bolt maps you to a principal and calls app.turn in-process. There is <mark>no plugins/slack</mark>. Replies edit the Working message in-thread.</p>`,
    flow: [
      ['SL', 'C', 'app.turn', { surface: 'slack', conversation: 'ch:C123:1234.567', text: '@qm weekly note' }],
      ['C', 'O', 'handleTurn', { runId: 'run_2' }],
      ['O', 'H', 'runTurn', { harness: 'pi', shouldRespond: 'reply' }],
      ['O', 'SL', 'reply', { delivery: 'in-thread', edit: 'Working → done' }],
    ] },
  { id: 'background', title: 'Background', reveal: ['CR'],
    lede: `Cron, watch, and webhook share one trigger spine.`,
    story: `<p>A due cron, a sandbox process going quiet, or a signed inbound POST all call the same runTrigger. The turn looks like any other. If it needs approval and no one is there, it <mark>fails closed</mark>.</p>`,
    flow: [
      ['CR', 'C', 'runTrigger', { owner: 'you@org', input: 'weekly note', fireKey: 'cron:weekly', surface: 'cron', destination: 'slack' }],
      ['C', 'O', 'handleTurn', { runId: 'run_3', origin: 'automation' }],
      ['O', 'H', 'runTurn', { harness: 'pi' }],
      ['O', 'SL', 'destination post', { surface: 'cron', destination: 'slack' }],
    ] },
  { id: 'run', title: 'Operate and ship', reveal: ['AD', 'CL'],
    lede: `Admin governs the org; the CLI ships QM into your cloud.`,
    story: `<p>Admin is a separate process over /v1/admin/. The CLI reads your deploy directory and runs qm up. That ships QM. <mark>Agent publish ships a user app</mark> — a different door.</p>`,
    flow: [
      ['CL', 'C', 'PUT /v1/deployment-layer', { contract: 1, tools: [], skills: [] }],
      ['C', 'PG', 'layer store', { table: 'deployment_layer', version: 'sha256:…' }],
    ] },
  { id: 'later', title: 'Later', reveal: ['PT'],
    lede: `Designed for a public SSO proxy; typical install can skip it.`,
    story: `<p>Portal is the public front door: sign-in, then a reverse proxy to the private web UI and admin. It is <mark>designed for, optional</mark> — a ghost on this map.</p>`,
    flow: [
      ['PT', 'UI', 'reverse-proxy', { cookie: 'portal_session', header: 'x-portal-identity' }],
    ] },
  { id: 'all', title: 'The whole system', reveal: [],
    lede: `Everything at once, for free exploration.`,
    story: `<p>Choose which flow runs (bottom left). Hover anything; click to pin; → goes inside. The <mark>Open questions</mark> tab lists every operator fact this repo cannot answer.</p>`,
    flow: null },
];

export const HOW_HTML = `<div class="eyebrow">QM · public main</div><h1 class="t">How it's built</h1><div class="sub">the shape and what sits around it</div>
<h3 class="sec">Filesystem</h3>
<pre>src/                 Node/TS headless core
  index.ts           entry; optional Slack start
  wiring.ts          substrate interfaces
  api/               Fastify /v1/*
  core/              orchestrator handleTurn
  harness/           Pi, OpenCode, Codex, Claude, mock
  tools/             primitives.ts
  sandbox/           local / sprites / smolmachines / aws
  persistence/       Postgres pool · DurableMap · S3
  slack/             in-process Bolt (not a plugin)
  cron/ monitors/ webhooks/ triggers/
  memory/ files/ sessions/ runs/
  identity/ acl/ policy/ security/ resolution/
  deploy/            agent publish (user apps)
  deployment/        org layer store
plugins/
  web-ui/            Vite + Lit
  admin/
  portal/            optional public SSO
  auth/              email magic-link OIDC
  onboarding/        skill, not a process
  chassis/           shared library
cli/                 @yc-software/qm
deploy/              layers/&lt;org&gt;/ (private fork)
docs/                getting-started · deploy-directory · screenshots</pre>
<p>Slack lives at <code>src/slack</code>, not <code>plugins/slack</code>. There is no Slack plugin package.</p>
<h3 class="sec">Two deploys</h3>
<p><mark>qm up</mark> ships QM itself. <mark>agent publish</mark> (<code>src/deploy</code>) ships a user web app onto docker/fly/aws. Mixing them on a map will lie.</p>`;
