# DayDream — System Definition

_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._ MIT-licensed Mac memory app by [getnorthlight/daydream](https://github.com/getnorthlight/daydream). Homepage [getdaydream.app](https://getdaydream.app). Beta 0.1 — history is **not** encrypted yet (typed text is); turn on FileVault. Formerly Mac Mem (`mac-mem` CLI still).

_Question status: **7 open · 12 resolved**._

## One paragraph

DayDream is a Mac menu-bar app that remembers which app and window you were in, and when — locally — so you or a connected AI can ask "where was I?". Capture uses Accessibility plus a listen-only input tap (no screenshots, screen recording, or audio). Privacy layers can only refuse. Chrome page history is Apple Events only; BrowserBridge exists but is unused. Typed words are AES-GCM vaulted in Keychain keys and expire (default 7d). AI reads via stdio MCP (`mac-mem mcp`). Summaries are ITEMS views through WriterBackend — local Qwen/llama.cpp or OpenRouter cloud.

## Decisions locked

| Axis | Decision | ADR |
|---|---|---|
| Capture | Accessibility API + listen-only input event tap only. No screenshots, screen recording, OCR, microphone, or camera. | [docs/privacy-model.md](https://github.com/getnorthlight/daydream/blob/main/docs/privacy-model.md) · [README](https://github.com/getnorthlight/daydream/blob/main/README.md) |
| Privacy | Five layered checks; each layer can only refuse — never widen what an earlier layer allowed. Store and share paths re-check. | [docs/privacy-model.md](https://github.com/getnorthlight/daydream/blob/main/docs/privacy-model.md) |
| Browsers | Skip known browsers (and http/https lookalikes). Google Chrome is the only exception, via read-only Apple Events when Web pages in Chrome is on. BrowserBridge extension code is unused this release. | [docs/browser-capture.md](https://github.com/getnorthlight/daydream/blob/main/docs/browser-capture.md) |
| Typed text | Optional; AES-GCM encrypted with Keychain day keys; secret classifier; default 7-day word retention leaving a where-you-typed note. AI apps get words only if Let AI apps read what you typed is on AND DayDream is open (private local socket + key). | [PrivacyPolicy/README.md](https://github.com/getnorthlight/daydream/blob/main/PrivacyPolicy/README.md) · [README#typed-text](https://github.com/getnorthlight/daydream/blob/main/README.md) |
| AI surface | Read-only MCP via `mac-mem mcp` over stdio — no network port. Tools cannot start/stop recording, change settings, or delete. | [README#connect-an-ai-app](https://github.com/getnorthlight/daydream/blob/main/README.md) |
| Summaries | Writer sees ITEMS (ModelView), never raw actions. Pick local Qwen via llama.cpp OR OpenRouter cloud — not both; no fallback between them. | [docs/summaries.md](https://github.com/getnorthlight/daydream/blob/main/docs/summaries.md) |
| License / rename | MIT. Built as Mac Mem; CLI remains `mac-mem`; data folder migrates to DayDream on first open. | [LICENSE](https://github.com/getnorthlight/daydream/blob/main/LICENSE) · [docs/rename.md](https://github.com/getnorthlight/daydream/blob/main/docs/rename.md) |

## Cost model

- App: free MIT download (signed Developer ID / notarized). No DayDream account, analytics, or telemetry.
- Local summaries: downloads ~2.74 GB Qwen3.5-4B from Hugging Face once; needs 8 GB RAM; battery/thermal gates.
- Cloud summaries: your OpenRouter key + usage billed to your OpenRouter account (ZDR host requested).
- Connected AI apps: whatever those apps bill for reading MCP context you grant.

## Deep dives

README: [README.md](https://github.com/getnorthlight/daydream/blob/main/README.md). Privacy model: [docs/privacy-model.md](https://github.com/getnorthlight/daydream/blob/main/docs/privacy-model.md). Browser capture: [docs/browser-capture.md](https://github.com/getnorthlight/daydream/blob/main/docs/browser-capture.md). Summaries: [docs/summaries.md](https://github.com/getnorthlight/daydream/blob/main/docs/summaries.md). Backup: [docs/backup-restore.md](https://github.com/getnorthlight/daydream/blob/main/docs/backup-restore.md). PrivacyPolicy package: [PrivacyPolicy/README.md](https://github.com/getnorthlight/daydream/blob/main/PrivacyPolicy/README.md). License: [LICENSE](https://github.com/getnorthlight/daydream/blob/main/LICENSE).

## Reading order (the atlas chapters)

1. **You start recording** — I open DayDream and press Start Recording. _(adds APP, REC, AX)_
2. **Privacy refuses first** — Every event hits refuse-only layers before storage. _(adds HIST, PRE)_
3. **Chrome pages only** — Web pages in Chrome is on — Apple Events, not an extension. _(adds CHROME)_
4. **Typed text vault** — Remember what you type — encrypted, expiring, classified. _(adds POL, VAULT, STORE)_
5. **Look back** — Timeline, search, forget a moment. _(adds UI)_
6. **Ask your AI** — Connect an AI app — read-only MCP over stdio. _(adds MCP)_
7. **Notes on this Mac** — Summaries on this Mac — Qwen via llama.cpp, ITEMS only. _(adds WRITER)_
8. **Cloud notes** — OpenRouter instead — only activity after you turn it on.
9. **Backup and the ghost** — Backup is real; BrowserBridge is not on the path. _(adds BACKUP, BRIDGE)_
10. **The whole memory map** — Capture left, refuse-only middle, store and surfaces right, notes and agents up top.

## Structures

### Capture

#### REC · Recorder

**In one line.** MacMemApp capture loop — start/pause/stop, wake resume, event intake.

**What it does.** While recording is on, the app watches frontmost app, window title, clicks (app+window only), optional Chrome pages, and optional typed text. Recording needs Accessibility + Input Monitoring; losing either stops within ~1s. Sleep/lock pause; wake/unlock resume if it was on.

**How it's built.** `Sources/MacMemApp/` — **EventCapture.swift**, `Coordinator.swift`, `WakeResume.swift`, `CaptureNativeLifecycle.swift`, `NativeTypingRoute.swift`, `WebTypingRoute.swift`. Bound through `adapters/CoreCaptureBinding.swift`.

**Steps in execution.**

1. **Arm** — User Start Recording (or resume after quit) after permissions.
2. **Observe** — Front app / window / click / optional Chrome & typing routes.
3. **Gate** — Hand candidates to PreCapture + HistoryCore policy before store.
4. **Persist** — Accepted actions land in MemoryCore SQLite.

**Questions.**

- ~~**Q-REC1** Does recording capture screenshots or audio?~~ ✓ No. Accessibility + listen-only tap only (2026-10-05 README / privacy-model).
- **Q-REC2** How often do wake-resume failure notices fire in the wild vs silent auto-resume?

#### AX · Accessibility + tap

**In one line.** macOS Accessibility for app/window/field; Input Monitoring as listen-only event tap.

**What it does.** Accessibility reads which app is front, window titles, and whether a focused field is safe before typed text is saved. Input Monitoring notices clicks and (if typed text is on) key events — DayDream cannot change or block input. No Screen Recording permission.

**How it's built.** Permissions table in [README](https://github.com/getnorthlight/daydream/blob/main/README.md). Snapshot helpers in `Sources/MacMemApp/AccessibilitySnapshot.swift`, `NativeFocusWitness.swift`. Privacy model: [docs/privacy-model.md](https://github.com/getnorthlight/daydream/blob/main/docs/privacy-model.md).

**Steps in execution.**

1. **Grant** — Setup opens Privacy & Security for Accessibility + Input Monitoring.
2. **Read** — AX snapshot of front app / window / focused element.
3. **Listen** — Event tap observes; never injects or blocks.

**Questions.**

- ~~**Q-AX1** Is Screen Recording required?~~ ✓ No — explicitly unused (2026-10-05).

#### HIST · HistoryCore

**In one line.** Event model and observation rules — apps, URLs, known browsers.

**What it does.** Shared history types and policy derived from open-codex-computer-history: which applications and URLs are observe vs skip, KnownBrowsers list, frames and text buffers that feed capture.

**How it's built.** `Sources/HistoryCore/` — **Event.swift**, `Policy.swift`, `KnownBrowsers.swift`, `Frame.swift`, `TextBuffer.swift`. Credited in README.

**Steps in execution.**

1. **Model** — Represent app switch, window, click, URL, typed unit.
2. **Policy** — Allow/block application and URL rules.
3. **Browsers** — Known browser bundle IDs skipped (Chrome excepted upstream).

**Questions.**

- ~~**Q-HIST1** Is HistoryCore DayDream-specific?~~ ✓ Derived from open-codex-computer-history; DayDream layers PreCapture + PrivacyPolicy on top (2026-10-05).

### Privacy (refuse-only)

#### PRE · PreCapture

**In one line.** First refuse layer — excluded apps, browsers, private windows, secure input, blocked sites.

**What it does.** Before an event is recorded: drop excluded apps, password managers, DayDream itself, known browsers (except Chrome when on), private/incognito titles, secure input / password fields, blocked or sensitive-looking sites, unknown focused elements.

**How it's built.** `Sources/MemoryCore/PreCapturePrivacy.swift`, `CaptureSession.swift`, HistoryCore `Policy.swift` / `KnownBrowsers.swift`. Layer 1 in [docs/privacy-model.md](https://github.com/getnorthlight/daydream/blob/main/docs/privacy-model.md).

**Steps in execution.**

1. **Context** — Front app, title, URL, focused element.
2. **Refuse** — Any match on exclusion / browser / private / secure / blocked.
3. **Pass** — Only then may Chrome or typed-text paths run.

**Questions.**

- ~~**Q-PRE1** Can a later layer widen PreCapture?~~ ✓ No — layers only refuse (2026-10-05 privacy-model).

#### CHROME · Chrome gate

**In one line.** Read-only Apple Events to Google Chrome for front page title/site — never BrowserBridge.

**What it does.** When Web pages in Chrome is on, ask signed Google Chrome for window mode and front tab address. Save nothing while any Incognito/Guest window is open, ambiguous answers, or multiple Chrome copies. Links stay on-Mac; AI/cloud get title+site only.

**How it's built.** `ChromePageRecorder.swift`, `ChromeEventSender.swift`, `MemoryCore/ChromePages.swift`, `ChromeAppleEvents.swift`, `BrowserSites.swift`. Docs: [docs/browser-capture.md](https://github.com/getnorthlight/daydream/blob/main/docs/browser-capture.md).

**Steps in execution.**

1. **Automate** — Optional macOS Automation grant for Google Chrome.
2. **Query** — Apple Events core/getd — windows, mode, active tab URL.
3. **Sanitize** — Site + optional on-Mac page link; skip blocked sites.
4. **Store** — CaptureSession.accepts only if browserPagesOn.

**Questions.**

- ~~**Q-CHROME1** Does BrowserBridge power Chrome history?~~ ✓ No. Extension tree exists but is unused; Apple Events path only (2026-10-05 browser-capture.md).
- **Q-CHROME2** Will ReleaseFeatures.chromePageHistory ever ship false on a public release?

#### POL · PrivacyPolicy

**In one line.** Typed-text gate — field checks, units, secret classifier, web typing kinds.

**What it does.** After PreCapture, a fresh field check (<1s) must confirm an ordinary text field in an allowlisted signed app, or a valid Chrome page for web typing. Builds short in-memory units; TextClassifier drops secrets; WebTypingGate + TypingSites classify sites.

**How it's built.** `PrivacyPolicy/Sources/PrivacyPolicy/` — **CaptureGate.swift**, `TextClassifier.swift`, `TypedUnit.swift`, `WebTypingGate.swift`, `TypingSites.swift`, `OwnerTyping.swift`, `TerminalPromptLatch.swift`. [PrivacyPolicy/README.md](https://github.com/getnorthlight/daydream/blob/main/PrivacyPolicy/README.md).

**Steps in execution.**

1. **Field** — Refuse password / OTP / card / secure input / blocked site.
2. **Unit** — Buffer characters into TypedUnit in memory only.
3. **Classify** — Drop API keys, JWTs, card-shaped runs, password: lines…
4. **Encrypt** — Pass to store for AES-GCM + Keychain day key.

**Questions.**

- ~~**Q-POL1** Can the classifier catch ordinary passwords?~~ ✓ No — documented limit; leave typed text off if typing secrets into normal fields (2026-10-05).

### Store

#### STORE · MemoryCore

**In one line.** SQLite history at ~/Library/Application Support/DayDream/memory.sqlite.

**What it does.** Storage re-checks privacy before write: sanitize titles (secrets → [sensitive title omitted], max 160 chars), strip URL credentials/fragments, keep only safe search params, accept Chrome/typing rows only under current settings. Also search, deletion, AgentShare, DerivedNotes.

**How it's built.** `Sources/MemoryCore/` — models + **Privacy.sanitized**, `AgentShare/`, `DerivedNotes.swift`, `AIAppConnect.swift`, `AssistantTypedBridge.swift`. Folder mode 0700 / DB 0600.

**Steps in execution.**

1. **Re-check** — App, site, private window, secure input, retention.
2. **Sanitize** — Titles, URLs, typing eligibility.
3. **Write** — Insert actions / moments into memory.sqlite.
4. **Serve** — UI search, MCP AgentShare, writer NoteAudience.

**Questions.**

- ~~**Q-STORE1** Is the full history encrypted at rest?~~ ✓ No — only typed words. Any process under your macOS user can read the DB; use FileVault (2026-10-05).
- **Q-STORE2** Will whole-history encryption land before non-beta?

#### VAULT · Typed vault

**In one line.** AES-GCM typed words; Keychain day keys; default 7-day exact-word expiry.

**What it does.** Passed units encrypt before write. Keys live in Keychain (and OpenRouter key if cloud summaries). After retention (default 7d), exact words delete; a short where-you-typed note remains. OpenRouter key also Keychain — not in the data folder.

**How it's built.** `Sources/MacMemApp/TypedTextKeychain.swift`, `TypedTextExpiryTimer.swift`, PrivacyPolicy encrypt path, MemoryCore typing rows. README Typed text section.

**Steps in execution.**

1. **Key** — One AES-GCM key per day in Keychain.
2. **Seal** — Encrypt unit ciphertext into store.
3. **Expire** — Delete exact words after retention; keep place note.

**Questions.**

- ~~**Q-VAULT1** Do AI apps hold the typing key?~~ ✓ No — mac-mem has no typing key; DayDream app hands words over a private local socket after key check when allowed (2026-10-05).

### Surface

#### APP · Menu bar app

**In one line.** DayDream menu-bar panel — record switch, pause, search, settings, quit.

**What it does.** Primary human surface: recording state, moments today, pause durations, Settings (Apps to remember, Summarizer, Connections, Advanced backup/updates/uninstall), onboarding, Report a Problem mailto.

**How it's built.** `Sources/MacMemApp/MacMemApp.swift`, **MenuBarContent.swift**, `DaydreamSettings.swift`, `DaydreamOnboarding.swift`, `ConnectionSettings.swift`, `Updates.swift`.

**Steps in execution.**

1. **Show** — Menu bar icon reflects recording on/off/paused.
2. **Control** — Start / pause / stop; open main window or Settings.
3. **Connect** — Settings › Connections writes daydream MCP entries.

#### UI · MemoryUI

**In one line.** SwiftUI timeline — moments, search, forget, summarize now.

**What it does.** Main window shows the day as moments. Search by app, title, site, or typed words (local, while kept). Forget This Moment deletes. Summarize Now requests a note. Site icons and resources ship under MemoryUI/Resources.

**How it's built.** `Sources/MemoryUI/` SwiftUI views + `Resources/SiteIcons`. Fed by MemoryCore queries.

**Steps in execution.**

1. **Browse** — Timeline of moments for the day.
2. **Search** — Query store (typed words only while retained).
3. **Forget** — Delete moment/actions from history.

**Questions.**

- **Q-UI1** Is there an in-app wipe-all-history control yet, or only uninstall path?

### Agents

#### MCP · mac-mem MCP

**In one line.** Read-only MCP over stdio — status, context, search, recall, recap, …

**What it does.** AI apps spawn `mac-mem mcp` and talk stdio — no network port. Tools: status, context, current-context, search, read, open, recall, recap, moment_details. Cannot mutate recording/settings/history. Typed words only if Let AI apps read what you typed + DayDream open.

**How it's built.** `Sources/MacMemCLI/main.swift` + MemoryCore `AgentShare/AgentTools.swift`, `AssistantTypedBridge.swift`, `AIAppConnect.swift`. Connect via Settings or `mac-mem connect/disconnect`.

**Steps in execution.**

1. **Grant** — Connect adds daydream entry to AI app MCP config (+ backup).
2. **Spawn** — AI app runs mac-mem mcp over stdio.
3. **Read** — AgentShare policy + optional typed bridge socket.
4. **Answer** — status / search / recap / moment_details …

**Questions.**

- ~~**Q-MCP1** Is MCP a lock on the database?~~ ✓ No — any process under your account can read memory.sqlite directly; MCP is the supported read path (2026-10-05).
- **Q-MCP2** Exact JSON schemas per tool beyond README names?

### Notes

#### WRITER · WriterBackend

**In one line.** Summaries from ITEMS view — local Qwen/llama.cpp or OpenRouter cloud.

**What it does.** Code folds actions into ModelView ITEMS; model never sees raw actions. Local: Qwen3.5-4B via CLlamaBridge, pauses on typing bursts, battery ≥20% / thermal gates. Cloud: your OpenRouter key, ZDR host request, only post-enable actions. Mutual exclusion — no fallback.

**How it's built.** `WriterBackend/Sources/WriterBackend/` — **ModelView.swift**, `LocalWriter.swift`, `CloudWriter.swift`, `CanonicalNotes.swift`, `LlamaInference.swift`. App: `WriterIntegration.swift`, `WriterScheduling.swift`, `LevelPower.swift`. adapters CoreWriterBinding / LevelWriterBinding.

**Steps in execution.**

1. **Fold** — Actions → ITEMS (no IDs, idle, secrets, raw dumps).
2. **Choose** — Local llama.cpp XOR OpenRouter.
3. **Gate** — Privacy re-check; power/thermal for local.
4. **Validate** — JSON note checks + optional repair; save DerivedNotes.

**Questions.**

- ~~**Q-WRITER1** Can local and cloud run together?~~ ✓ No — turning one on turns the other off; neither falls back (2026-10-05 summaries.md).
- **Q-WRITER2** How often do >400-action moments stay without notes in practice?

### Backup & unused (designed for, not built)

#### BACKUP · BackupRestore

**In one line.** mac-mem-backup — unencrypted folder export/merge; no keys or AI connections.

**What it does.** Settings › Advanced › Backup and restore writes history to a chosen folder and can merge back. Backups are not encrypted. Synced folders (iCloud) upload the whole history. Leaves out API key and AI app connections.

**How it's built.** `BackupRestore/` Native + Worker; CLI `mac-mem-backup`. [docs/backup-restore.md](https://github.com/getnorthlight/daydream/blob/main/docs/backup-restore.md).

**Steps in execution.**

1. **Export** — Copy history snapshot to user-chosen folder.
2. **Warn** — Unencrypted; avoid synced folders unless intended.
3. **Restore** — Merge backup into DayDream data folder.

**Questions.**

- ~~**Q-BACKUP1** Are backups encrypted?~~ ✓ No (2026-10-05 docs/backup-restore.md).

#### BRIDGE · BrowserBridge _(not switched on)_

**In one line.** Browser extension code in-tree — not used by any build of this version.

**What it does.** A second browser-capture design (extension + host) lives under BrowserBridge/. Chrome history and web typing in shipping DayDream use Apple Events only. Atlas marks this tower ghost/off-map.

**How it's built.** `BrowserBridge/` Sources + extension + safari. Explicitly unused per [docs/browser-capture.md](https://github.com/getnorthlight/daydream/blob/main/docs/browser-capture.md) and README project layout.

**Steps in execution.**

1. **Exists** — Extension/host packages remain in the repo.
2. **Unused** — No app build wires BrowserBridge for capture.

**Questions.**

- ~~**Q-BRIDGE1** Is BrowserBridge on the live capture path?~~ ✓ No — ghost / unused this release (2026-10-05).
- **Q-BRIDGE2** Will a future release activate BrowserBridge for non-Chrome browsers?

## Flows (representative packets)

Payload shapes are what the design implies, not measured traffic.

### Record → store

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | APP → REC | start recording | `{"perm":["accessibility","input-monitoring"]}` |
| 2 | REC → AX | front app / window / click | `{"tap":"listen-only"}` |
| 3 | AX → HIST | event model | `{"type":"app\|window\|click"}` |
| 4 | HIST → PRE | pre-capture refuse | `{"layer":1}` |
| 5 | PRE → STORE | accept action | `{"db":"memory.sqlite"}` |

### Typed text path

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | AX → PRE | field context | `{"secureInput":false}` |
| 2 | PRE → CHROME | if Chrome web typing | `{"needs":"browserPagesOn"}` |
| 3 | PRE → POL | typed gate + classifier | `{"unit":"TypedUnit"}` |
| 4 | POL → VAULT | AES-GCM + Keychain day key | `{"retainDays":7}` |
| 5 | VAULT → STORE | ciphertext row | `{"words":"encrypted"}` |

### MCP query

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | APP → MCP | connect daydream entry | `{"stdio":true}` |
| 2 | MCP → STORE | AgentShare read | `{"tools":["status","search","recap"]}` |
| 3 | STORE → VAULT | optional typed words | `{"requires":["aiReadsTyped","appOpen"]}` |
| 4 | MCP → MCP | moment_details / recall | `{"mutate":false}` |

### Local summary

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | STORE → WRITER | ITEMS ModelView | `{"rawActions":false}` |
| 2 | WRITER → WRITER | llama.cpp Qwen local | `{"pauseOnTyping":true}` |
| 3 | APP → WRITER | battery / thermal gate | `{"minCharge":0.2}` |
| 4 | WRITER → STORE | DerivedNotes save | `{"recheckPrivacy":true}` |

### Cloud summary

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | STORE → WRITER | ITEMS for post-enable actions | `{"audience":"cloud"}` |
| 2 | VAULT → WRITER | Keychain OpenRouter key | `{"zdr":true}` |
| 3 | WRITER → WRITER | OpenRouter request | `{"host":"openrouter.ai"}` |
| 4 | WRITER → STORE | validated note or discard | `{"onSettingChange":"restart"}` |

## Questions — index

Reference by ID. ✓ resolved (with date) · otherwise open.

- ~~**Q-REC1**~~ (REC) ✓ No. Accessibility + listen-only tap only (2026-10-05 README / privacy-model).
- **Q-REC2** (REC) How often do wake-resume failure notices fire in the wild vs silent auto-resume?
- ~~**Q-AX1**~~ (AX) ✓ No — explicitly unused (2026-10-05).
- ~~**Q-HIST1**~~ (HIST) ✓ Derived from open-codex-computer-history; DayDream layers PreCapture + PrivacyPolicy on top (2026-10-05).
- ~~**Q-PRE1**~~ (PRE) ✓ No — layers only refuse (2026-10-05 privacy-model).
- ~~**Q-CHROME1**~~ (CHROME) ✓ No. Extension tree exists but is unused; Apple Events path only (2026-10-05 browser-capture.md).
- **Q-CHROME2** (CHROME) Will ReleaseFeatures.chromePageHistory ever ship false on a public release?
- ~~**Q-POL1**~~ (POL) ✓ No — documented limit; leave typed text off if typing secrets into normal fields (2026-10-05).
- ~~**Q-STORE1**~~ (STORE) ✓ No — only typed words. Any process under your macOS user can read the DB; use FileVault (2026-10-05).
- **Q-STORE2** (STORE) Will whole-history encryption land before non-beta?
- ~~**Q-VAULT1**~~ (VAULT) ✓ No — mac-mem has no typing key; DayDream app hands words over a private local socket after key check when allowed (2026-10-05).
- **Q-UI1** (UI) Is there an in-app wipe-all-history control yet, or only uninstall path?
- ~~**Q-MCP1**~~ (MCP) ✓ No — any process under your account can read memory.sqlite directly; MCP is the supported read path (2026-10-05).
- **Q-MCP2** (MCP) Exact JSON schemas per tool beyond README names?
- ~~**Q-WRITER1**~~ (WRITER) ✓ No — turning one on turns the other off; neither falls back (2026-10-05 summaries.md).
- **Q-WRITER2** (WRITER) How often do >400-action moments stay without notes in practice?
- ~~**Q-BACKUP1**~~ (BACKUP) ✓ No (2026-10-05 docs/backup-restore.md).
- ~~**Q-BRIDGE1**~~ (BRIDGE) ✓ No — ghost / unused this release (2026-10-05).
- **Q-BRIDGE2** (BRIDGE) Will a future release activate BrowserBridge for non-Chrome browsers?

## What the platform gives vs what we own

**Platform gives:** macOS Accessibility + Input Monitoring (listen-only), optional Automation for Google Chrome, Keychain, SQLite under ~/Library/Application Support/DayDream/

**We own:** what to record, refuse-only privacy layers, typed retention, MCP grants, local vs cloud summarizer choice, backup destination

## Planned filesystem

```
Sources/
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
packaging/       Info.plist · icons · WriterRuntime / TypesenseRuntime pins
```

## How this file is maintained

Generated from `daydream/atlas/data.mjs` by `node daydream/atlas/build.mjs`, which also builds the interactive atlas (`atlas.html`, published at https://adg29.github.io/system-atlas-directory/daydream/). Edit the data file, rebuild, republish — never edit this file by hand.
