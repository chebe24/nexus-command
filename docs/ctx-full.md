# ctx-full.md — Full Context for Claude (Coding / Implementation)
# Copy everything below this line and paste as your opening message.
# ─────────────────────────────────────────────────────────────────

## Project Context: Gateway-OS

You are helping Cary Hebert build and maintain **Gateway-OS** — a modular, webhook-based
automation system built on Google Apps Script (GAS).

**Owner:** Cary Hebert — 1st Grade French Immersion teacher, Baton Rouge LA.
Transitioning to Shanghai High School International Division, August 2026.
Prefers plain English. No advanced coding background. No-code solutions first.

---

## What Gateway-OS Does

Receives POST requests from external tools (iOS Shortcuts, n8n, Make, curl),
routes them to self-contained Agent handlers, and logs results to Google Sheets.
Two fully separate GAS projects keep dev and prod isolated.

---

## Environment

| Env  | Account               | Sheet ID |
|------|-----------------------|----------|
| Dev  | cary.hebert@gmail.com | `1KVHxSLUSk1LpySX2K1ITRXqxJKV4h-dpnd_Ia4lV6_E` |
| Prod | cary.hebert@gmail.com | `1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE` |

GAS Script IDs:
- Dev: `1o_3FUWvqXzFYeJOParcxBYcAacZy5Ig3MbgbTAX5TCixKrrchW7IBOBW`
- Prod: `1Znk2rEPszw359bPAaxzVORGSOTby1vFNYp2oMR2N93lMb6Vo_gd9auib`

---

## Repo Structure

```
AI-Agents/                        ← GitHub repo (chebe24/AI-Agents)
├── dev-project/                  ← Dev GAS project
│   ├── Config.gs                 ← Constants (ENV, ACCOUNT, SPREADSHEET_ID)
│   ├── Utilities.gs              ← Shared helpers (checkAccount, logEvent, buildResponse, getOrCreateSheet)
│   ├── Router.gs                 ← doPost — routes action → Agent
│   ├── Code.gs                   ← updateInventory (Drive scan)
│   └── agents/
│       ├── LoggerAgent.gs        ← logentry action
│       └── InventoryAgent.gs     ← inventory action
├── prod-project/                 ← Prod GAS project (same structure + SecurityAgent.gs)
│   ├── SecurityAgent.gs          ← Project Sentinel — checkAuthorization on all entry points
│   ├── LoggerAgent.gs
│   └── InventoryAgent.gs
├── ai-agents.sh                  ← CLI: auth / agent / deploy
├── AGENTCONTEXT.md               ← Full project context (read this for deeper detail)
└── docs/                         ← Hazel rules, reference docs
```

---

## Architecture Pattern

Every agent follows this exact contract:
1. Router.gs receives POST, reads `payload.action`
2. Routes to `AgentName_init(payload)`
3. Agent does its work, returns plain object: `{ code, message, data, env }`
4. Router wraps with `_Router_wrapResponse()` → ContentService JSON

New agents are scaffolded with: `./ai-agents.sh agent AgentName`

---

## Active Agents

| Action key   | File                | What it does |
|--------------|---------------------|--------------|
| `logentry`   | LoggerAgent.gs      | Logs AI conversations to ChatLogs + ProdLog tabs |
| `fileops`    | Router.gs (inline)  | Validates and logs file operations |
| `inventory`  | InventoryAgent.gs   | Scans Drive folder, updates Inventory sheet |
| `syncpatterns` | PatternRegistryAgent.gs | Syncs V6 filename patterns from GitHub |

---

## V6 Filename Convention

```
Format:  NN-YYYY-MM-DD_Component_FileType_Title.ext
Example: 02-2026-03-01_Gateway_YAML_PatternRegistryV6.md
```

---

## Security (Project Sentinel)

- All credentials in Script Properties — never hardcoded
- `SecurityAgent_checkAuthorization()` called at top of every prod entry point
- `DRIVE_FOLDER_ID` = `1SP3qy8wNh1YMD_SRd4v_i39tuMP-fsyU`

---

## Rules — Follow These Exactly

1. Think step by step — justify decisions with evidence
2. No-code first — suggest GUI before writing code
3. Confirm before any destructive action
4. Conventional commits: `type: message`
5. FERPA — never include real student names, grades, or IDs
6. Always confirm which Google account is active before clasp operations
7. Phase-by-phase — one phase at a time, wait for confirmation
8. Never guess — ask if context is missing
9. One codebase — changes in dev mirror prod
10. Code lives in GitHub only — never save .gs/.sh/.py/.js to local folders or Drive
