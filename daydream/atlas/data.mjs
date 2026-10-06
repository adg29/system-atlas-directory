// Single source of truth for the DayDream atlas. Built by: node daydream/atlas/build.mjs
// Primer: /workspace/daydream-atlas/primer.md (gh api / raw of getnorthlight/daydream — not cloned)

const R = 'https://github.com/getnorthlight/daydream/blob/main';

export const META = {
  title: 'DayDream',
  artifactUrl: 'https://adg29.github.io/system-atlas-directory/daydream/',
  sourcePath: 'daydream/atlas/data.mjs',
  buildCmd: 'node daydream/atlas/build.mjs',
  stats: [
    { k: 'System', v: 'DayDream · getnorthlight' },
    { k: 'Platform', v: 'macOS 15+ · Apple silicon' },
    { k: 'License', v: 'MIT' },
    { k: 'Homepage', v: 'getdaydream.app' },
  ],
  intro: `_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._ MIT-licensed Mac memory app by [getnorthlight/daydream](https://github.com/getnorthlight/daydream). Homepage [getdaydream.app](https://getdaydream.app). Beta 0.1 — history is **not** encrypted yet (typed text is); turn on FileVault. Formerly Mac Mem (\`mac-mem\` CLI still).`,
  onePara: `DayDream is a Mac menu-bar app that remembers which app and window you were in, and when — locally — so you or a connected AI can ask "where was I?". Capture uses Accessibility plus a listen-only input tap (no screenshots, screen recording, or audio). Privacy layers can only refuse. Chrome page history is Apple Events only; BrowserBridge exists but is unused. Typed words are AES-GCM vaulted in Keychain keys and expire (default 7d). AI reads via stdio MCP (\`mac-mem mcp\`). Summaries are ITEMS views through WriterBackend — local Qwen/llama.cpp or OpenRouter cloud.`,
  costModel: [
    '- App: free MIT download (signed Developer ID / notarized). No DayDream account, analytics, or telemetry.',
    '- Local summaries: downloads ~2.74 GB Qwen3.5-4B from Hugging Face once; needs 8 GB RAM; battery/thermal gates.',
    '- Cloud summaries: your OpenRouter key + usage billed to your OpenRouter account (ZDR host requested).',
    '- Connected AI apps: whatever those apps bill for reading MCP context you grant.',
    '',
  ],
  deepDive: `README: [README.md](${R}/README.md). Privacy model: [docs/privacy-model.md](${R}/docs/privacy-model.md). Browser capture: [docs/browser-capture.md](${R}/docs/browser-capture.md). Summaries: [docs/summaries.md](${R}/docs/summaries.md). Backup: [docs/backup-restore.md](${R}/docs/backup-restore.md). PrivacyPolicy package: [PrivacyPolicy/README.md](${R}/PrivacyPolicy/README.md). License: [LICENSE](${R}/LICENSE).`,
  platformGives: 'macOS Accessibility + Input Monitoring (listen-only), optional Automation for Google Chrome, Keychain, SQLite under ~/Library/Application Support/DayDream/',
  weOwn: 'what to record, refuse-only privacy layers, typed retention, MCP grants, local vs cloud summarizer choice, backup destination',
  filesystem: `Sources/
  MacMemApp/     menu bar, recorder, Chrome Apple Events, writer glue
  MemoryUI/      SwiftUI timeline / settings / search
  MemoryCore/    SQLite store, PreCapture, ChromePages, AgentShare, DerivedNotes
  HistoryCore/   Event model + Policy / KnownBrowsers (open-codex-computer-history)
  MacMemCLI/     mac-mem CLI + MCP server (stdio)
PrivacyPolicy/   typed-text gate + TextClassifier + WebTypingGate
WriterBackend/   ModelView ITEMS → local llama.cpp / OpenRouter
BackupRestore/   mac-mem-backup helper
BrowserBridge/   extension host — NOT used by the app in this version
adapters/        CoreWriterBinding · CoreCaptureBinding · LevelWriterBinding
docs/            privacy-model · browser-capture · summaries · backup-restore
packaging/       Info.plist · icons · WriterRuntime / TypesenseRuntime pins`,
};

export const DECISIONS = [
  {
    axis: 'Capture',
    decision: 'Accessibility API + listen-only input event tap only. No screenshots, screen recording, OCR, microphone, or camera.',
    adr: `[docs/privacy-model.md](${R}/docs/privacy-model.md) · [README](${R}/README.md)`,
  },
  {
    axis: 'Privacy',
    decision: 'Five layered checks; each layer can only refuse — never widen what an earlier layer allowed. Store and share paths re-check.',
    adr: `[docs/privacy-model.md](${R}/docs/privacy-model.md)`,
  },
  {
    axis: 'Browsers',
    decision: 'Skip known browsers (and http/https lookalikes). Google Chrome is the only exception, via read-only Apple Events when Web pages in Chrome is on. BrowserBridge extension code is unused this release.',
    adr: `[docs/browser-capture.md](${R}/docs/browser-capture.md)`,
  },
  {
    axis: 'Typed text',
    decision: 'Optional; AES-GCM encrypted with Keychain day keys; secret classifier; default 7-day word retention leaving a where-you-typed note. AI apps get words only if Let AI apps read what you typed is on AND DayDream is open (private local socket + key).',
    adr: `[PrivacyPolicy/README.md](${R}/PrivacyPolicy/README.md) · [README#typed-text](${R}/README.md)`,
  },
  {
    axis: 'AI surface',
    decision: 'Read-only MCP via `mac-mem mcp` over stdio — no network port. Tools cannot start/stop recording, change settings, or delete.',
    adr: `[README#connect-an-ai-app](${R}/README.md)`,
  },
  {
    axis: 'Summaries',
    decision: 'Writer sees ITEMS (ModelView), never raw actions. Pick local Qwen via llama.cpp OR OpenRouter cloud — not both; no fallback between them.',
    adr: `[docs/summaries.md](${R}/docs/summaries.md)`,
  },
  {
    axis: 'License / rename',
    decision: 'MIT. Built as Mac Mem; CLI remains `mac-mem`; data folder migrates to DayDream on first open.',
    adr: `[LICENSE](${R}/LICENSE) · [docs/rename.md](${R}/docs/rename.md)`,
  },
];

export const GROUPS = [
  { id: 'capture', title: 'Capture' },
  { id: 'privacy', title: 'Privacy (refuse-only)' },
  { id: 'store', title: 'Store' },
  { id: 'surface', title: 'Surface' },
  { id: 'agents', title: 'Agents' },
  { id: 'notes', title: 'Notes' },
  { id: 'off', title: 'Backup & unused' },
];

export const NODES = [
  {
    id: 'REC',
    code: 'REC',
    name: 'Recorder',
    short: 'RECORDER',
    group: 'capture',
    gx: 1,
    gy: 7.2,
    w: 2.5,
    d: 2.3,
    h: 52,
    kind: 'tall',
    one: 'MacMemApp capture loop — start/pause/stop, wake resume, event intake.',
    what: 'While recording is on, the app watches frontmost app, window title, clicks (app+window only), optional Chrome pages, and optional typed text. Recording needs Accessibility + Input Monitoring; losing either stops within ~1s. Sleep/lock pause; wake/unlock resume if it was on.',
    how: `<code>Sources/MacMemApp/</code> — <mark>EventCapture.swift</mark>, <code>Coordinator.swift</code>, <code>WakeResume.swift</code>, <code>CaptureNativeLifecycle.swift</code>, <code>NativeTypingRoute.swift</code>, <code>WebTypingRoute.swift</code>. Bound through <code>adapters/CoreCaptureBinding.swift</code>.`,
    steps: [
      ['Arm', 'User Start Recording (or resume after quit) after permissions.'],
      ['Observe', 'Front app / window / click / optional Chrome & typing routes.'],
      ['Gate', 'Hand candidates to PreCapture + HistoryCore policy before store.'],
      ['Persist', 'Accepted actions land in MemoryCore SQLite.'],
    ],
    cond: [
      { q: 'Does recording capture screenshots or audio?', r: 'No. Accessibility + listen-only tap only (2026-10-05 README / privacy-model).' },
      'How often do wake-resume failure notices fire in the wild vs silent auto-resume?',
    ],
  },

  {
    id: 'AX',
    code: 'AX',
    name: 'Accessibility + tap',
    short: 'AX+TAP',
    group: 'capture',
    gx: 1,
    gy: 3.4,
    w: 2.3,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'macOS Accessibility for app/window/field; Input Monitoring as listen-only event tap.',
    what: 'Accessibility reads which app is front, window titles, and whether a focused field is safe before typed text is saved. Input Monitoring notices clicks and (if typed text is on) key events — DayDream cannot change or block input. No Screen Recording permission.',
    how: `Permissions table in [README](${R}/README.md). Snapshot helpers in <code>Sources/MacMemApp/AccessibilitySnapshot.swift</code>, <code>NativeFocusWitness.swift</code>. Privacy model: [docs/privacy-model.md](${R}/docs/privacy-model.md).`,
    steps: [
      ['Grant', 'Setup opens Privacy & Security for Accessibility + Input Monitoring.'],
      ['Read', 'AX snapshot of front app / window / focused element.'],
      ['Listen', 'Event tap observes; never injects or blocks.'],
    ],
    cond: [
      { q: 'Is Screen Recording required?', r: 'No — explicitly unused (2026-10-05).' },
    ],
  },

  {
    id: 'HIST',
    code: 'HIST',
    name: 'HistoryCore',
    short: 'HISTORY',
    group: 'capture',
    gx: 4.6,
    gy: 8.4,
    w: 2.4,
    d: 2.1,
    h: 46,
    kind: 'box',
    one: 'Event model and observation rules — apps, URLs, known browsers.',
    what: 'Shared history types and policy derived from open-codex-computer-history: which applications and URLs are observe vs skip, KnownBrowsers list, frames and text buffers that feed capture.',
    how: `<code>Sources/HistoryCore/</code> — <mark>Event.swift</mark>, <code>Policy.swift</code>, <code>KnownBrowsers.swift</code>, <code>Frame.swift</code>, <code>TextBuffer.swift</code>. Credited in README.`,
    steps: [
      ['Model', 'Represent app switch, window, click, URL, typed unit.'],
      ['Policy', 'Allow/block application and URL rules.'],
      ['Browsers', 'Known browser bundle IDs skipped (Chrome excepted upstream).'],
    ],
    cond: [
      { q: 'Is HistoryCore DayDream-specific?', r: 'Derived from open-codex-computer-history; DayDream layers PreCapture + PrivacyPolicy on top (2026-10-05).' },
    ],
  },

  {
    id: 'PRE',
    code: 'PRE',
    name: 'PreCapture',
    short: 'PRE-CAP',
    group: 'privacy',
    gx: 4.4,
    gy: 4.6,
    w: 2.3,
    d: 2,
    h: 42,
    kind: 'box',
    one: 'First refuse layer — excluded apps, browsers, private windows, secure input, blocked sites.',
    what: 'Before an event is recorded: drop excluded apps, password managers, DayDream itself, known browsers (except Chrome when on), private/incognito titles, secure input / password fields, blocked or sensitive-looking sites, unknown focused elements.',
    how: `<code>Sources/MemoryCore/PreCapturePrivacy.swift</code>, <code>CaptureSession.swift</code>, HistoryCore <code>Policy.swift</code> / <code>KnownBrowsers.swift</code>. Layer 1 in [docs/privacy-model.md](${R}/docs/privacy-model.md).`,
    steps: [
      ['Context', 'Front app, title, URL, focused element.'],
      ['Refuse', 'Any match on exclusion / browser / private / secure / blocked.'],
      ['Pass', 'Only then may Chrome or typed-text paths run.'],
    ],
    cond: [
      { q: 'Can a later layer widen PreCapture?', r: 'No — layers only refuse (2026-10-05 privacy-model).' },
    ],
  },

  {
    id: 'CHROME',
    code: 'CHROME',
    name: 'Chrome gate',
    short: 'CHROME',
    group: 'privacy',
    gx: 7.8,
    gy: 7.8,
    w: 2.4,
    d: 2.2,
    h: 48,
    kind: 'box',
    one: 'Read-only Apple Events to Google Chrome for front page title/site — never BrowserBridge.',
    what: 'When Web pages in Chrome is on, ask signed Google Chrome for window mode and front tab address. Save nothing while any Incognito/Guest window is open, ambiguous answers, or multiple Chrome copies. Links stay on-Mac; AI/cloud get title+site only.',
    how: `<code>ChromePageRecorder.swift</code>, <code>ChromeEventSender.swift</code>, <code>MemoryCore/ChromePages.swift</code>, <code>ChromeAppleEvents.swift</code>, <code>BrowserSites.swift</code>. Docs: [docs/browser-capture.md](${R}/docs/browser-capture.md).`,
    steps: [
      ['Automate', 'Optional macOS Automation grant for Google Chrome.'],
      ['Query', 'Apple Events core/getd — windows, mode, active tab URL.'],
      ['Sanitize', 'Site + optional on-Mac page link; skip blocked sites.'],
      ['Store', 'CaptureSession.accepts only if browserPagesOn.'],
    ],
    cond: [
      { q: 'Does BrowserBridge power Chrome history?', r: 'No. Extension tree exists but is unused; Apple Events path only (2026-10-05 browser-capture.md).' },
      'Will ReleaseFeatures.chromePageHistory ever ship false on a public release?',
    ],
  },

  {
    id: 'POL',
    code: 'POL',
    name: 'PrivacyPolicy',
    short: 'POLICY',
    group: 'privacy',
    gx: 7.8,
    gy: 3.6,
    w: 2.5,
    d: 2.2,
    h: 50,
    kind: 'tall',
    one: 'Typed-text gate — field checks, units, secret classifier, web typing kinds.',
    what: 'After PreCapture, a fresh field check (<1s) must confirm an ordinary text field in an allowlisted signed app, or a valid Chrome page for web typing. Builds short in-memory units; TextClassifier drops secrets; WebTypingGate + TypingSites classify sites.',
    how: `<code>PrivacyPolicy/Sources/PrivacyPolicy/</code> — <mark>CaptureGate.swift</mark>, <code>TextClassifier.swift</code>, <code>TypedUnit.swift</code>, <code>WebTypingGate.swift</code>, <code>TypingSites.swift</code>, <code>OwnerTyping.swift</code>, <code>TerminalPromptLatch.swift</code>. [PrivacyPolicy/README.md](${R}/PrivacyPolicy/README.md).`,
    steps: [
      ['Field', 'Refuse password / OTP / card / secure input / blocked site.'],
      ['Unit', 'Buffer characters into TypedUnit in memory only.'],
      ['Classify', 'Drop API keys, JWTs, card-shaped runs, password: lines…'],
      ['Encrypt', 'Pass to store for AES-GCM + Keychain day key.'],
    ],
    cond: [
      { q: 'Can the classifier catch ordinary passwords?', r: 'No — documented limit; leave typed text off if typing secrets into normal fields (2026-10-05).' },
    ],
  },

  {
    id: 'STORE',
    code: 'STORE',
    name: 'MemoryCore',
    short: 'SQLITE',
    group: 'store',
    gx: 11.4,
    gy: 6.8,
    w: 2.6,
    d: 2.4,
    h: 56,
    kind: 'tall',
    one: 'SQLite history at ~/Library/Application Support/DayDream/memory.sqlite.',
    what: 'Storage re-checks privacy before write: sanitize titles (secrets → [sensitive title omitted], max 160 chars), strip URL credentials/fragments, keep only safe search params, accept Chrome/typing rows only under current settings. Also search, deletion, AgentShare, DerivedNotes.',
    how: `<code>Sources/MemoryCore/</code> — models + <mark>Privacy.sanitized</mark>, <code>AgentShare/</code>, <code>DerivedNotes.swift</code>, <code>AIAppConnect.swift</code>, <code>AssistantTypedBridge.swift</code>. Folder mode 0700 / DB 0600.`,
    steps: [
      ['Re-check', 'App, site, private window, secure input, retention.'],
      ['Sanitize', 'Titles, URLs, typing eligibility.'],
      ['Write', 'Insert actions / moments into memory.sqlite.'],
      ['Serve', 'UI search, MCP AgentShare, writer NoteAudience.'],
    ],
    cond: [
      { q: 'Is the full history encrypted at rest?', r: 'No — only typed words. Any process under your macOS user can read the DB; use FileVault (2026-10-05).' },
      'Will whole-history encryption land before non-beta?',
    ],
  },

  {
    id: 'VAULT',
    code: 'VAULT',
    name: 'Typed vault',
    short: 'VAULT',
    group: 'store',
    gx: 11.4,
    gy: 2.8,
    w: 2.3,
    d: 2,
    h: 40,
    kind: 'box',
    one: 'AES-GCM typed words; Keychain day keys; default 7-day exact-word expiry.',
    what: 'Passed units encrypt before write. Keys live in Keychain (and OpenRouter key if cloud summaries). After retention (default 7d), exact words delete; a short where-you-typed note remains. OpenRouter key also Keychain — not in the data folder.',
    how: `<code>Sources/MacMemApp/TypedTextKeychain.swift</code>, <code>TypedTextExpiryTimer.swift</code>, PrivacyPolicy encrypt path, MemoryCore typing rows. README Typed text section.`,
    steps: [
      ['Key', 'One AES-GCM key per day in Keychain.'],
      ['Seal', 'Encrypt unit ciphertext into store.'],
      ['Expire', 'Delete exact words after retention; keep place note.'],
    ],
    cond: [
      { q: 'Do AI apps hold the typing key?', r: 'No — mac-mem has no typing key; DayDream app hands words over a private local socket after key check when allowed (2026-10-05).' },
    ],
  },

  {
    id: 'APP',
    code: 'APP',
    name: 'Menu bar app',
    short: 'APP',
    group: 'surface',
    gx: 1,
    gy: 0.2,
    w: 2.4,
    d: 2,
    h: 44,
    kind: 'screen',
    one: 'DayDream menu-bar panel — record switch, pause, search, settings, quit.',
    what: 'Primary human surface: recording state, moments today, pause durations, Settings (Apps to remember, Summarizer, Connections, Advanced backup/updates/uninstall), onboarding, Report a Problem mailto.',
    how: `<code>Sources/MacMemApp/MacMemApp.swift</code>, <mark>MenuBarContent.swift</mark>, <code>DaydreamSettings.swift</code>, <code>DaydreamOnboarding.swift</code>, <code>ConnectionSettings.swift</code>, <code>Updates.swift</code>.`,
    steps: [
      ['Show', 'Menu bar icon reflects recording on/off/paused.'],
      ['Control', 'Start / pause / stop; open main window or Settings.'],
      ['Connect', 'Settings › Connections writes daydream MCP entries.'],
    ],
    cond: [],
  },

  {
    id: 'UI',
    code: 'UI',
    name: 'MemoryUI',
    short: 'UI',
    group: 'surface',
    gx: 4.6,
    gy: 0.6,
    w: 2.4,
    d: 2.1,
    h: 42,
    kind: 'screen',
    one: 'SwiftUI timeline — moments, search, forget, summarize now.',
    what: 'Main window shows the day as moments. Search by app, title, site, or typed words (local, while kept). Forget This Moment deletes. Summarize Now requests a note. Site icons and resources ship under MemoryUI/Resources.',
    how: `<code>Sources/MemoryUI/</code> SwiftUI views + <code>Resources/SiteIcons</code>. Fed by MemoryCore queries.`,
    steps: [
      ['Browse', 'Timeline of moments for the day.'],
      ['Search', 'Query store (typed words only while retained).'],
      ['Forget', 'Delete moment/actions from history.'],
    ],
    cond: [
      'Is there an in-app wipe-all-history control yet, or only uninstall path?',
    ],
  },

  {
    id: 'MCP',
    code: 'MCP',
    name: 'mac-mem MCP',
    short: 'MCP',
    group: 'agents',
    gx: 8,
    gy: 0.4,
    w: 2.6,
    d: 2.3,
    h: 52,
    kind: 'tall',
    one: 'Read-only MCP over stdio — status, context, search, recall, recap, …',
    what: 'AI apps spawn `mac-mem mcp` and talk stdio — no network port. Tools: status, context, current-context, search, read, open, recall, recap, moment_details. Cannot mutate recording/settings/history. Typed words only if Let AI apps read what you typed + DayDream open.',
    how: `<code>Sources/MacMemCLI/main.swift</code> + MemoryCore <code>AgentShare/AgentTools.swift</code>, <code>AssistantTypedBridge.swift</code>, <code>AIAppConnect.swift</code>. Connect via Settings or <code>mac-mem connect/disconnect</code>.`,
    steps: [
      ['Grant', 'Connect adds daydream entry to AI app MCP config (+ backup).'],
      ['Spawn', 'AI app runs mac-mem mcp over stdio.'],
      ['Read', 'AgentShare policy + optional typed bridge socket.'],
      ['Answer', 'status / search / recap / moment_details …'],
    ],
    cond: [
      { q: 'Is MCP a lock on the database?', r: 'No — any process under your account can read memory.sqlite directly; MCP is the supported read path (2026-10-05).' },
      'Exact JSON schemas per tool beyond README names?',
    ],
  },

  {
    id: 'WRITER',
    code: 'WRITER',
    name: 'WriterBackend',
    short: 'WRITER',
    group: 'notes',
    gx: 11.6,
    gy: 0.2,
    w: 2.5,
    d: 2.2,
    h: 50,
    kind: 'box',
    one: 'Summaries from ITEMS view — local Qwen/llama.cpp or OpenRouter cloud.',
    what: 'Code folds actions into ModelView ITEMS; model never sees raw actions. Local: Qwen3.5-4B via CLlamaBridge, pauses on typing bursts, battery ≥20% / thermal gates. Cloud: your OpenRouter key, ZDR host request, only post-enable actions. Mutual exclusion — no fallback.',
    how: `<code>WriterBackend/Sources/WriterBackend/</code> — <mark>ModelView.swift</mark>, <code>LocalWriter.swift</code>, <code>CloudWriter.swift</code>, <code>CanonicalNotes.swift</code>, <code>LlamaInference.swift</code>. App: <code>WriterIntegration.swift</code>, <code>WriterScheduling.swift</code>, <code>LevelPower.swift</code>. adapters CoreWriterBinding / LevelWriterBinding.`,
    steps: [
      ['Fold', 'Actions → ITEMS (no IDs, idle, secrets, raw dumps).'],
      ['Choose', 'Local llama.cpp XOR OpenRouter.'],
      ['Gate', 'Privacy re-check; power/thermal for local.'],
      ['Validate', 'JSON note checks + optional repair; save DerivedNotes.'],
    ],
    cond: [
      { q: 'Can local and cloud run together?', r: 'No — turning one on turns the other off; neither falls back (2026-10-05 summaries.md).' },
      'How often do >400-action moments stay without notes in practice?',
    ],
  },

  {
    id: 'BACKUP',
    code: 'BACKUP',
    name: 'BackupRestore',
    short: 'BACKUP',
    group: 'off',
    gx: 15.2,
    gy: 4.2,
    w: 2.2,
    d: 2,
    h: 38,
    kind: 'box',
    one: 'mac-mem-backup — unencrypted folder export/merge; no keys or AI connections.',
    what: 'Settings › Advanced › Backup and restore writes history to a chosen folder and can merge back. Backups are not encrypted. Synced folders (iCloud) upload the whole history. Leaves out API key and AI app connections.',
    how: `<code>BackupRestore/</code> Native + Worker; CLI <code>mac-mem-backup</code>. [docs/backup-restore.md](${R}/docs/backup-restore.md).`,
    steps: [
      ['Export', 'Copy history snapshot to user-chosen folder.'],
      ['Warn', 'Unencrypted; avoid synced folders unless intended.'],
      ['Restore', 'Merge backup into DayDream data folder.'],
    ],
    cond: [
      { q: 'Are backups encrypted?', r: 'No (2026-10-05 docs/backup-restore.md).' },
    ],
  },

  {
    id: 'BRIDGE',
    code: 'BRIDGE',
    name: 'BrowserBridge',
    short: 'BRIDGE',
    group: 'off',
    gx: 15.2,
    gy: 7.6,
    w: 2.2,
    d: 2,
    h: 36,
    kind: 'box',
    ghost: true,
    one: 'Browser extension code in-tree — not used by any build of this version.',
    what: 'A second browser-capture design (extension + host) lives under BrowserBridge/. Chrome history and web typing in shipping DayDream use Apple Events only. Atlas marks this tower ghost/off-map.',
    how: `<code>BrowserBridge/</code> Sources + extension + safari. Explicitly unused per [docs/browser-capture.md](${R}/docs/browser-capture.md) and README project layout.`,
    steps: [
      ['Exists', 'Extension/host packages remain in the repo.'],
      ['Unused', 'No app build wires BrowserBridge for capture.'],
    ],
    cond: [
      { q: 'Is BrowserBridge on the live capture path?', r: 'No — ghost / unused this release (2026-10-05).' },
      'Will a future release activate BrowserBridge for non-Chrome browsers?',
    ],
  },
];

export const FLOWS = [
  {
    id: 'record',
    name: 'Record → store',
    hops: [
      ['APP', 'REC', 'start recording', { perm: ['accessibility', 'input-monitoring'] }, 'xy'],
      ['REC', 'AX', 'front app / window / click', { tap: 'listen-only' }, 'xy'],
      ['AX', 'HIST', 'event model', { type: 'app|window|click' }, 'xy'],
      ['HIST', 'PRE', 'pre-capture refuse', { layer: 1 }, 'xy'],
      ['PRE', 'STORE', 'accept action', { db: 'memory.sqlite' }, 'xy'],
    ],
  },
  {
    id: 'typed',
    name: 'Typed text path',
    hops: [
      ['AX', 'PRE', 'field context', { secureInput: false }, 'xy'],
      ['PRE', 'CHROME', 'if Chrome web typing', { needs: 'browserPagesOn' }, 'yx'],
      ['PRE', 'POL', 'typed gate + classifier', { unit: 'TypedUnit' }, 'xy'],
      ['POL', 'VAULT', 'AES-GCM + Keychain day key', { retainDays: 7 }, 'xy'],
      ['VAULT', 'STORE', 'ciphertext row', { words: 'encrypted' }, 'xy'],
    ],
  },
  {
    id: 'mcp',
    name: 'MCP query',
    hops: [
      ['APP', 'MCP', 'connect daydream entry', { stdio: true }, 'xy'],
      ['MCP', 'STORE', 'AgentShare read', { tools: ['status', 'search', 'recap'] }, 'xy'],
      ['STORE', 'VAULT', 'optional typed words', { requires: ['aiReadsTyped', 'appOpen'] }, 'yx'],
      ['MCP', 'MCP', 'moment_details / recall', { mutate: false }, 'xy'],
    ],
  },
  {
    id: 'local-summary',
    name: 'Local summary',
    hops: [
      ['STORE', 'WRITER', 'ITEMS ModelView', { rawActions: false }, 'xy'],
      ['WRITER', 'WRITER', 'llama.cpp Qwen local', { pauseOnTyping: true }, 'xy'],
      ['APP', 'WRITER', 'battery / thermal gate', { minCharge: 0.2 }, 'yx'],
      ['WRITER', 'STORE', 'DerivedNotes save', { recheckPrivacy: true }, 'xy'],
    ],
  },
  {
    id: 'cloud-summary',
    name: 'Cloud summary',
    hops: [
      ['STORE', 'WRITER', 'ITEMS for post-enable actions', { audience: 'cloud' }, 'xy'],
      ['VAULT', 'WRITER', 'Keychain OpenRouter key', { zdr: true }, 'yx'],
      ['WRITER', 'WRITER', 'OpenRouter request', { host: 'openrouter.ai' }, 'xy'],
      ['WRITER', 'STORE', 'validated note or discard', { onSettingChange: 'restart' }, 'xy'],
    ],
  },
];

export const CH = [
  {
    id: 'start',
    title: 'You start recording',
    reveal: ['APP', 'REC', 'AX'],
    lede: `I open DayDream and press Start Recording.`,
    story: `<p>Apple silicon, macOS 15+. Setup walks Accessibility and Input Monitoring. The menu bar switch arms <mark>REC</mark>. <mark>AX</mark> reads front app and window; the tap only listens. No screenshots, no audio.</p>`,
    flow: [
      ['APP', 'REC', 'Start Recording', { permissions: true }],
      ['REC', 'AX', 'observe front context', {}],
    ],
  },
  {
    id: 'refuse',
    title: 'Privacy refuses first',
    reveal: ['HIST', 'PRE'],
    lede: `Every event hits refuse-only layers before storage.`,
    story: `<p><mark>HIST</mark> models the event. <mark>PRE</mark> drops excluded apps, known browsers, private windows, secure input, password fields, blocked sites. Later layers cannot widen this.</p>`,
    flow: [
      ['AX', 'HIST', 'event', {}],
      ['HIST', 'PRE', 'layer 1 refuse', {}],
    ],
  },
  {
    id: 'chrome',
    title: 'Chrome pages only',
    reveal: ['CHROME'],
    lede: `Web pages in Chrome is on — Apple Events, not an extension.`,
    story: `<p><mark>CHROME</mark> asks signed Google Chrome for the front tab. Incognito/Guest → save nothing. Title and site on Mac; full link stays local for Open Original. BrowserBridge stays ghost.</p>`,
    flow: [
      ['PRE', 'CHROME', 'Apple Events getd', { browser: 'com.google.Chrome' }],
      ['CHROME', 'STORE', 'page row', { browserPagesOn: true }],
    ],
  },
  {
    id: 'typing',
    title: 'Typed text vault',
    reveal: ['POL', 'VAULT', 'STORE'],
    lede: `Remember what you type — encrypted, expiring, classified.`,
    story: `<p><mark>POL</mark> re-checks the field, builds units, drops secrets. <mark>VAULT</mark> AES-GCM with Keychain day keys. Default 7 days then words go; a where-note remains in <mark>STORE</mark>.</p>`,
    flow: [
      ['PRE', 'POL', 'typed gate', {}],
      ['POL', 'VAULT', 'encrypt', { alg: 'AES-GCM' }],
      ['VAULT', 'STORE', 'ciphertext', {}],
    ],
  },
  {
    id: 'lookback',
    title: 'Look back',
    reveal: ['UI'],
    lede: `Timeline, search, forget a moment.`,
    story: `<p><mark>UI</mark> shows the day as moments. Search hits apps, titles, sites, and retained typed words locally. Forget This Moment deletes from SQLite. History otherwise keeps until you delete it.</p>`,
    flow: [
      ['STORE', 'UI', 'timeline query', {}],
      ['UI', 'STORE', 'Forget This Moment', { delete: true }],
    ],
  },
  {
    id: 'ask-ai',
    title: 'Ask your AI',
    reveal: ['MCP'],
    lede: `Connect an AI app — read-only MCP over stdio.`,
    story: `<p>Settings › Connections (or <code>mac-mem connect</code>) adds a daydream entry. The app runs <mark>MCP</mark> with tools like status, search, recap, moment_details. Typed words need the Connections toggle and DayDream open.</p>`,
    flow: [
      ['APP', 'MCP', 'connect', { stdio: true }],
      ['MCP', 'STORE', 'AgentShare', { readOnly: true }],
    ],
  },
  {
    id: 'local-notes',
    title: 'Notes on this Mac',
    reveal: ['WRITER'],
    lede: `Summaries on this Mac — Qwen via llama.cpp, ITEMS only.`,
    story: `<p><mark>WRITER</mark> folds actions into ModelView ITEMS — never raw dumps. Local inference pauses on typing bursts and respects battery/thermal gates. Nothing from your history is uploaded to write the note.</p>`,
    flow: [
      ['STORE', 'WRITER', 'ITEMS', {}],
      ['WRITER', 'STORE', 'DerivedNotes', { mode: 'local' }],
    ],
  },
  {
    id: 'cloud-notes',
    title: 'Cloud notes',
    reveal: [],
    lede: `OpenRouter instead — only activity after you turn it on.`,
    story: `<p>Same ITEMS path, different transport. Your Keychain holds the OpenRouter key. DayDream asks for zero-data-retention hosts. Turning cloud on turns local off (and vice versa).</p>`,
    flow: [
      ['STORE', 'WRITER', 'cloud ITEMS', { since: 'enabledAt' }],
      ['WRITER', 'STORE', 'validated note', {}],
    ],
  },
  {
    id: 'edges',
    title: 'Backup and the ghost',
    reveal: ['BACKUP', 'BRIDGE'],
    lede: `Backup is real; BrowserBridge is not on the path.`,
    story: `<p><mark>BACKUP</mark> exports an unencrypted folder (no keys/connections). <mark>BRIDGE</mark> is in-tree extension code marked ghost — unused this version. Chrome stays on Apple Events.</p>`,
    flow: [
      ['STORE', 'BACKUP', 'export folder', { encrypted: false }],
    ],
  },
  {
    id: 'all',
    title: 'The whole memory map',
    reveal: [],
    lede: `Capture left, refuse-only middle, store and surfaces right, notes and agents up top.`,
    story: `<p>DayDream keeps "where was I?" on your Mac for you and your AI. Open questions: full DB encryption timing, BrowserBridge future, chromePageHistory release flag, and exact MCP tool schemas beyond README names.</p>`,
    flow: null,
  },
];

export const HOW_HTML = `<div class="eyebrow">DayDream · getnorthlight/daydream</div><h1 class="t">How it's built</h1><div class="sub">Local Mac memory — where you were, for you and your AI</div>
<h3 class="sec">Framing</h3>
<p>MIT menu-bar app (Apple silicon, macOS 15+). Formerly Mac Mem — CLI remains <code>mac-mem</code>. Homepage <mark>getdaydream.app</mark>. Beta 0.1: history file is not encrypted yet; typed text is. Research via <code>gh api</code> only — repo not cloned for this atlas.</p>
<h3 class="sec">Filesystem</h3>
<pre>Sources/
  MacMemApp/     menu bar · recorder · Chrome Apple Events · writer glue
  MemoryUI/      SwiftUI timeline / settings / search
  MemoryCore/    SQLite · PreCapture · ChromePages · AgentShare · notes
  HistoryCore/   Event · Policy · KnownBrowsers
  MacMemCLI/     mac-mem + MCP (stdio)
PrivacyPolicy/   typed gate · TextClassifier · WebTypingGate
WriterBackend/   ModelView ITEMS → llama.cpp / OpenRouter
BackupRestore/   mac-mem-backup (unencrypted export)
BrowserBridge/   extension — UNUSED this version (ghost)
adapters/        CoreCaptureBinding · CoreWriterBinding · LevelWriterBinding
docs/            privacy-model · browser-capture · summaries · backup-restore</pre>
<h3 class="sec">Refuse-only layers</h3>
<p>PreCapture → Chrome Apple Events → PrivacyPolicy typed path → store re-check → share/summary re-check. Each layer can only refuse.</p>
<h3 class="sec">AI</h3>
<p>Read-only <mark>mac-mem mcp</mark> over stdio. Tools: status, context, current-context, search, read, open, recall, recap, moment_details. Typed words only with Connections toggle + app open.</p>`;
