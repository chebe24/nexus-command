# AGENTCONTEXT.md — Gateway-OS Project Context

> **For any AI assistant (Claude, Gemini, ChatGPT, Cursor, etc.):** Read this entire file before doing anything.
> It tells you exactly what this project is, its current state, and how to help without breaking anything.

---

## Who Built This

**Cary Hebert** — 1st Grade French Immersion teacher, BR FLAIM International School, Baton Rouge, LA (EBRPSS).
Transitioning to Shanghai High School International Division, **August 2026**.
HSK 4 Mandarin in progress. Prefers plain English and no-code solutions when possible.

---

## What This Project Is

**Gateway-OS** is a modular, webhook-based automation system built on Google Apps Script (GAS).
It receives POST requests from external tools (n8n, Make, iOS Shortcuts), routes them to
self-contained Agent handlers, and logs results to Google Sheets.

There are two fully separate GAS projects — dev for testing, prod for live use:

| Environment | Account               | Google Sheet          | Sheet ID |
|-------------|-----------------------|-----------------------|----------|
| Dev         | cary.hebert@gmail.com | AI Agents Command Hub | `1KVHxSLUSk1LpySX2K1ITRXqxJKV4h-dpnd_Ia4lV6_E` |
| Prod        | cary.hebert@gmail.com | AI_Agents_Command_Hub | `1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE` |

Both accounts are the same Gmail — prod and dev are separated by **GAS project**, not by Google account.

---

## Folder Structure (as of March 2026)

```
Proj_AI-Agents/                     ← Git repo root
├── ai-agents.sh                    ← Gateway-OS CLI (auth / agent / deploy)
├── deploy.sh                       ← Legacy deploy script (kept for reference only)
├── AGENTCONTEXT.md                 ← This file — read first
├── CLAUDE.md                       ← Claude-specific loader (references this file)
├── AGENTS.md                       ← Multi-agent workflow guide
├── README.md                       ← Human-facing project overview
├── ROADMAP.md                      ← Version history and next steps
├── .gitignore                      ← Excludes .env, .clasprc.json
│
├── dev-project/                    ← Development GAS project
│   ├── .clasp.json                 ← Points to DEV script ID
│   ├── appsscript.json             ← Manifest (timeZone: America/Chicago, V8 runtime)
│   ├── Config.gs                   ← All constants (ENV, ACCOUNT, SPREADSHEET_ID)
│   ├── Utilities.gs                ← Shared helpers (checkAccount, logEvent, buildResponse, etc.)
│   ├── Router.gs                   ← doGet / doPost — routes action field → correct Agent
│   ├── Code.gs                     ← Inventory management (updateInventory, Drive scanning)
│   ├── RelocationTracker.gs        ← SHSID onboarding document tracker (in progress)
│   └── agents/                     ← Agent files live here (scaffolded by CLI)
│
├── prod-project/                   ← Production GAS project (live)
│   ├── .clasp.json                 ← Points to PROD script ID
│   ├── appsscript.json             ← Manifest (timeZone: America/Chicago, V8 runtime)
│   ├── Config.gs                   ← Prod constants (ENV="production", SPREADSHEET_ID=prod sheet)
│   ├── Utilities.gs                ← Shared helpers (same pattern as dev)
│   ├── Router.gs                   ← Webhook entry point for prod
│   ├── Code.gs                     ← Inventory management for prod
│   ├── LoggerAgent.gs              ← Handles "logentry" action → writes to ChatLogs tab
│   ├── AddTabsOneTime.gs           ← One-time utility to create ChatLogs and ProdLog tabs (run once, then delete)
│   └── SetScriptProperties.gs     ← One-time utility to set SPREADSHEET_ID Script Property (run once, then delete)
│
└── scripts/                        ← SHELVED — do not modify or build on these
    ├── standards_embed.py          ← RAG engine (shelved)
    ├── query_test.py               ← RAG engine (shelved)
    ├── test_env.py                 ← RAG engine (shelved)
    └── requirements.txt            ← RAG engine (shelved)
```

**GAS files live inside `dev-project/` and `prod-project/` only.** There is no `scripts/Code.gs`.

---

## Script IDs & Web App URLs

| Env  | GAS Script ID | Web App URL |
|------|---------------|-------------|
| Dev  | `1o_3FUWvqXzFYeJOParcxBYcAacZy5Ig3MbgbTAX5TCixKrrchW7IBOBW` | https://script.google.com/macros/s/AKfycbxC3q2qNHivWzRpvLZdWnH8r5uuDTUTPn-NtPG_3g2lC6Gy1ErDiDZoGzJ_LSIp-_Z6mQ/exec |
| Prod | `1Znk2rEPszw359bPAaxzVORGSOTby1vFNYp2oMR2N93lMb6Vo_gd9auib` | Run `./ai-agents.sh deploy prod` to get the current URL |

GitHub Secrets (stored in the chebe24/AI-Agents repo):
- `CLASDEV_JSON` — clasp OAuth token for dev
- `CLASPRC` — clasp OAuth token for prod

---

## Architecture — How a Request Flows

```
External trigger (iOS Shortcut, n8n, Make, curl)
        │  POST { "action": "logentry", ... }
        ▼
  Router.gs → doPost()
        │
        ├── Parses JSON payload
        ├── Reads payload.action
        │
        ├── "logentry"  → LoggerAgent_logEntry(payload)
        ├── "fileops"   → _Router_handleFileOps(payload)
        └── (unknown)   → error response

LoggerAgent_logEntry():
        ├── Validates required fields (title is required)
        ├── Validates filename against V6 pattern (if provided)
        ├── Writes row to ChatLogs tab
        └── Writes execution record to ProdLog tab
```

Every Agent returns a plain object `{ code, message, data, env }`.
The Router wraps it into `ContentService` for the HTTP response.

---

## Google Sheet — Tab Names and Purpose

**Prod sheet ID:** `1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE`

| Tab Name   | Purpose |
|------------|---------|
| ChatLogs   | One row per AI conversation logged via LoggerAgent |
| ProdLog    | Execution log — every script event (INFO / WARN / ERROR) |
| Inventory  | Drive folder scan results from updateInventory() |
| File Ops   | File validation events from fileops webhook |
| System Log | Legacy system log (may be consolidated later) |

**ChatLogs columns:** Timestamp, Date, AI Platform, Project/Context, Conversation Title, Summary, Chat URL, Tags, Status

**ProdLog columns:** Timestamp, Script, Event Type, Status (INFO/WARN/ERROR), Details

---

## LoggerAgent — Webhook Payload Shape

When sending a POST request to log an AI conversation, use this payload:

```json
{
  "action":    "logentry",
  "timestamp": "2026-03-07T18:00:00Z",
  "date":      "2026-03-07",
  "platform":  "Claude",
  "project":   "Gateway-OS",
  "title":     "Conversation title here",
  "summary":   "Brief description of what was accomplished",
  "url":       "https://claude.ai/chat/...",
  "tags":      "deploy, apps-script, logging",
  "status":    "Complete",
  "filename":  "01-2026-03-07_Gateway_GAS_LoggerDeploy.gs"
}
```

`title` is the only required field. `filename` is optional — if provided, it is validated against the V6 pattern.

**Status options:** `Complete` | `Follow-up` | `Archived` | `In Progress` | `Naming Error`

---

## V6 Filename Pattern

All files in this project follow the Gateway-OS V6 naming convention:

```
Format:  NN-YYYY-MM-DD_Component_FileType_Title.ext
Example: 02-2026-03-01_Gateway_YAML_PatternRegistryV6.md
Regex:   ^\d{2}-\d{4}-\d{2}-\d{2}_[A-Za-z0-9]+_[A-Za-z0-9]+_[A-Za-z0-9]+\.[a-z]{2,4}$
```

If `filename` is included in a logentry payload, LoggerAgent validates it against this pattern.
A failed validation sets the ChatLogs Status to `"Naming Error"` and logs a WARN to ProdLog.

---

## Script Properties (Set in GAS Project Settings)

These are stored in Apps Script → Project Settings → Script Properties.
**Never hardcode these values in code files.**

| Property       | Value / Purpose |
|----------------|-----------------|
| `SPREADSHEET_ID` | The Google Sheet ID for the current environment |

To set these, run `setProductionScriptProperties()` from `SetScriptProperties.gs`, then delete that file.
To view all current properties, run `viewAllScriptProperties()`.

---

## CLI Quick Reference

```bash
cd ~/Documents/02_Projects/Proj_AI-Agents

./ai-agents.sh auth dev            # Verify dev token, auto-rotate GitHub Secret if expired
./ai-agents.sh auth prod           # Same for prod
./ai-agents.sh agent Journal       # Scaffold dev-project/agents/JournalAgent.gs
./ai-agents.sh deploy dev          # Push dev-project/ to GAS
./ai-agents.sh deploy prod         # Push prod-project/ (requires typing 'yes-prod')
```

---

## Current Status (March 2026)

### ✅ Complete
- Dev/prod GAS projects deployed and tested
- Gateway-OS Router pattern live in both environments
- `ai-agents.sh` CLI: `auth`, `agent`, `deploy` commands working
- `logentry` webhook route live — LoggerAgent writing to ChatLogs and ProdLog tabs
- `fileops` webhook route working
- `updateInventory()` Drive scan function
- ChatLogs and ProdLog tabs created in prod sheet
- Script Properties set for prod

### 🔧 In Progress
- **Phase 2** — Dev modular refactor (agents/ subfolder, LoggerAgent dev version)
- **RelocationTracker.gs** — SHSID onboarding document tracker

### 🚫 Shelved
- **RAG Engine** — Python / Chroma vector DB / trilingual standards embedding (not a priority)

### ⏳ Ideas Backlog
- Journal Du Matin — daily Google Slides automation
- GC-IAM-Auditor — monthly GCP service account audit

---

## Rules for AI Assistants

1. **Think step by step** — provide justification using evidence from research or project context
2. **No-code first** — suggest GUI options before writing code
3. **Confirm before destructive actions** — never overwrite files without asking
4. **Conventional commits** — format: `type: message` (e.g., `feat: add LoggerAgent`)
5. **FERPA** — never include real student names, grades, or IDs anywhere
6. **Check accounts** — confirm which Google account is active before any clasp operation
7. **Phase-by-phase** — output one phase at a time, wait for confirmation before the next
8. **Never guess** — if you lack context to make a decision, ask instead of assuming
9. **One codebase** — prod and dev use the same patterns; changes in one should mirror the other
10. **Code lives in GitHub only** — never save code files to local folders or Google Drive. All `.gs`, `.sh`, `.py`, `.js`, and config files belong in the GitHub repo and nowhere else.

---

## Cross-Platform Context Snippets

Pre-built context blocks for loading project context into other AI tools.
Located in `docs/` — copy the right one and paste it as the first message.

| File | Use With | Purpose |
|------|----------|---------|
| `docs/ctx-full.md` | Claude | Full coding context — architecture, IDs, rules |
| `docs/ctx-docs.md` | Gemini / ChatGPT | PRDs, MVPs, documentation |
| `docs/ctx-research.md` | Perplexity | Research queries framed by project constraints |

---

## Shelved: Trilingual RAG Engine

> **Status: Not started. Do not implement unless Cary explicitly asks.**

A planned semantic search engine over educational standards in English, French, and Mandarin.
Source files exist in `scripts/` but are disconnected from Gateway-OS.
Will use Google's free embedding API and a local `.env` file (never committed to Git).
