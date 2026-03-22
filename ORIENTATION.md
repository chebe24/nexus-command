# ORIENTATION.md
> New session context guide for nexus-command. Read this first in every new chat, regardless of AI model.
> Last updated: 2026-03-22

---

## Part 1: Three-Layer Context Injection

Inject context at the start of every session in this order:

| Layer | How | When |
|---|---|---|
| 1 — Memory | Auto-loads in Claude.ai | Always |
| 2 — Raycast Snippet | Type keyword in chat | Every session |
| 3 — AGENTCONTEXT.md | Paste file contents | Complex sessions |

### Raycast Snippets

| Keyword | Use For |
|---|---|
| `!ctx-full` | Architecture, routing, system design |
| `!ctx-paths` | Any file editing or Terminal work |
| `!ctx-docs` | Documentation work |
| `!ctx-research` | AI research or routing decisions |

**Rule:** Always paste `!ctx-paths` when touching local files. Always paste `!ctx-full` for nexus-command system work.

---

## Part 2: Credentials & Environment Config

> ⚠️ Never paste raw credentials into any AI chat. Reference by name only.
> All secrets live in CREDENTIALS.local and GAS Script Properties.

### Key Files

| File | Path | Purpose |
|---|---|---|
| `CREDENTIALS.local` | `~/Developer.nosync/CREDENTIALS.local` | All local secrets — never committed |
| `.clasp.json` | Per-project root | Links local GAS code to Apps Script project |
| `AGENTCONTEXT.md` | `~/Developer.nosync/21_systems/nexus-command/` | AI source of truth |
| `CLAUDE.md` | Repo root | Claude Code project instructions |
| `.gitignore` | Repo root | Confirms CREDENTIALS.local + *.icloud excluded |

### Apps Script IDs

| Environment | Script ID |
|---|---|
| PROD | `1okfeLoXEpiq81Qdctv5Irph4oSO67VzhOtGTqJQGcd8gzkGhsSNUlT5G` |
| DEV (gmail) | `1o_3FUWvq...W7IBOBW` |
| DEV (ebr) | `1B91NVhY...iup0lu` |

### Webapp Deployment URL
- **Current key:** `AKfycbxAluWilnJHGljMQAW4gpSsPC6Tci1YxWsy_btxn-ORMJbq8axEMr43tlV4rpnjBwhrjg`
- **Full URL:** `https://script.google.com/macros/s/[KEY]/exec`

### Google Sheets IDs

| Sheet | ID | Notes |
|---|---|---|
| PROD Command Hub | `1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE` | Personal Drive |
| DEV Sheet | `1KVHxSLUSk1LpySX2K1ITRXqxJKV4h-dpnd_Ia4lV6_E` | EBR — MCP inaccessible |
| OCR ProdLog | `1qEZUBf4A1djNF5CstRxJa2UQbQqCnIZqavSF8mkKUpU` | Capital I not lowercase l |

### GitHub Secrets

| Secret | Maps To |
|---|---|
| `CLASDEV` | DEV `.clasp.json` |
| `CLASPRC` | PROD `.clasp.json` |

### Gemini API
- **GCP Project:** `gen-lang-client-0057364764`
- **Key location:** GAS Script Properties — never in code

---

## Part 3: ProdLog (Google Sheets)

### Location
- **Spreadsheet:** PROD Command Hub (`1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE`)
- **Tab:** `ProdLog`

### Column Structure

| Col | Field | Example |
|---|---|---|
| A | Timestamp | `3/22/2026 20:00:00` |
| B | Script | `Security-Maintenance` |
| C | Event Type | `MAINTENANCE` |
| D | Status | `COMPLETE` |
| E | Details | Free text |

### How to Write an Entry
- **Via Claude.ai MCP:** Say "Add a ProdLog entry for [what you did]" — Zapier Sheets MCP writes it
- **Via LoggerAgent.gs:** Any GAS script calling LoggerAgent writes automatically
- **Manual:** Open spreadsheet and add row directly

### When to Log
- Any deployment or webapp URL rotation
- Any credential change
- Any pipeline maintenance or system error
- End of any significant work session

---

## Part 4: MCP Servers (Claude.ai Only)

> MCP servers are only active in claude.ai — not in Claude Code terminal or other AI tools.

### Connected Servers

| Server | Capability |
|---|---|
| Gmail | Search, read messages and threads |
| Google Calendar | Read/create/update events |
| Zapier | Gmail + Google Sheets read/write |
| Google Drive | Search and fetch docs (personal account only) |
| Supabase | Database operations |
| Canva | Design generation |

### How to Trigger
Ask naturally — MCP fires automatically:
- "Check my ProdLog for the last 5 entries" → Zapier Sheets
- "Search my email for Dan Lu" → Gmail
- "Add a ProdLog row for today's work" → Zapier Sheets

### Critical Limits
- Google Drive MCP scoped to `cary.hebert@gmail.com` only — EBR inaccessible
- Zapier MCP requires active Google Drive connection — reconnect at zapier.com/app/connections if broken
- MCP cannot be used inside Claude Code terminal

---

## Part 5: CLASP

CLASP syncs local GAS code to Google Apps Script (like git, but for Apps Script).

### Key Commands
```bash
clasp push        # push local code to Apps Script
clasp pull        # pull cloud code to local
clasp open        # open Apps Script editor in browser
clasp deploy      # deploy a new version
cat .clasp.json   # confirm which project you are linked to
```

### Two Environments

| Environment | Account |
|---|---|
| DEV | `cary.hebert@gmail.com` |
| PROD | `chebert4@ebrschools.org` |

> ⚠️ Always run `cat .clasp.json` before pushing to confirm the correct environment.

---

## Part 6: File Path Gotchas

- Script filename uses **HYPHENS**: `hazel-ocr-bridge.sh` — not underscores
- Full path: `~/Developer.nosync/21_systems/nexus-command/hazel-ocr-bridge.sh`
- `CREDENTIALS.local` path: `~/Developer.nosync/CREDENTIALS.local`
- **MCP filesystem cannot reach** `~/Developer.nosync` — always use Terminal commands for edits
- **`sed -i` fails** on iCloud placeholder files — use Python3 replace pattern instead
- Always use `/usr/bin/git` explicitly and `cd` to repo before any git operations

---

## Part 7: AI Model Routing

| Model | Use For |
|---|---|
| **Claude** | Complex code, logical architecture, long-form writing, thesis/structured docs |
| **ChatGPT** | Rapid prototyping, quick scripts, agentic web tasks, multimedia |
| **Gemini** | Mandarin, OCR, translation |
| **Perplexity** | Research, current events |

---

## Part 8: New Session Checklist

- [ ] Paste `!ctx-full` for system/architecture work
- [ ] Paste `!ctx-paths` for any file editing
- [ ] Confirm DEV vs PROD environment before any push
- [ ] Run `cat .clasp.json` before any `clasp push`
- [ ] At end of session: ask Claude to write a ProdLog entry

---

## Part 9: Quick Reference — Where Everything Lives
```
~/Developer.nosync/
├── CREDENTIALS.local                         ← all secrets
└── 21_systems/
    └── nexus-command/                        ← main repo
        ├── ORIENTATION.md                    ← this file
        ├── AGENTCONTEXT.md                   ← AI source of truth
        ├── CLAUDE.md                         ← Claude Code instructions
        ├── hazel-ocr-bridge.sh               ← OCR pipeline trigger (HYPHENS)
        └── docs/
            └── gateway-os-snippets.json      ← Raycast snippets
```

**GitHub remote:** `github.com/chebe24/nexus-command.git`
**Always use:** `/usr/bin/git` | `cd` to repo first | Python3 for file edits/usr/bin/git add ORIENTATION.md && /usr/bin/git commit -m "docs: add ORIENTATION.md for new session context injection" && /usr/bin/git push
```

---

### Step 5: Register It in AGENTCONTEXT.md

**Why:** `AGENTCONTEXT.md` is the master index. Any AI reading it should know `ORIENTATION.md` exists and what it's for. This is the same reason a README links to CONTRIBUTING — discoverability.

Add one line to the relevant section of `AGENTCONTEXT.md`:
```
- ORIENTATION.md — new session checklist: credentials, MCP servers, CLASP, ProdLog, file path gotchas
