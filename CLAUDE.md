# CLAUDE.md

> This file exists so Claude (and Claude Code / Cowork) auto-loads project context.
> **All actual project information lives in AGENTCONTEXT.md — read that file first and in full.**

## Reference Docs (AI-loadable)

| File | When to read |
|------|-------------|
| `docs/security-guide.md` | Before handling any credentials, secrets, or API keys |
| `docs/ssh-troubleshooting.md` | When `git push` or clasp auth fails with SSH errors |
| `docs/troubleshooting.md` | When CI/CD fails, webhook errors, or GAS deploy issues |
| `.github/ISSUE_TEMPLATE.md` | When filing or triaging a bug report or feature request |
| `.github/workflows/deploy.yml` | When modifying the CI/CD pipeline |

---

## Who Built This

**Cary Hebert** — 1st Grade French Immersion teacher, BR FLAIM International School, Baton Rouge, LA (EBRPSS).
Transitioning to Shanghai High School International Division, **August 2026**.
HSK 4 Mandarin in progress. 20+ years GitHub experience. Prefers plain English and no-code solutions.

---

## What This Project Is

**Gateway-OS** is a modular, webhook-based automation system built on Google Apps Script (GAS).
It receives POST requests from external tools (n8n, Make, iOS Shortcuts), routes them to
self-contained Agent handlers, and logs results to Google Sheets.

There are two fully separate GAS projects:

| Environment | Account                  | Google Sheet          | Sheet ID |
|-------------|--------------------------|-----------------------|----------|
| Dev         | cary.hebert@gmail.com    | AI Agents Command Hub | `1KVHxSLUSk1LpySX2K1ITRXqxJKV4h-dpnd_Ia4lV6_E` |
| Prod        | cary.hebert@gmail.com    | AI_Agents_Command_Hub | `1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE` |

---

## Actual Folder Structure (as of March 2026)

```
nexus-command/                      ← Git repo root
├── ai-agents.sh                    ← Gateway-OS CLI (auth / agent / deploy)
├── deploy.sh                       ← Legacy deploy script (kept for reference)
├── CLAUDE.md                       ← This file
├── AGENTS.md                       ← Multi-agent workflow guide
├── README.md                       ← Human-facing project overview
├── ROADMAP.md                      ← Version history and next steps
├── .gitignore                      ← Excludes .env, .clasprc.json
│
├── dev-project/                    ← Development GAS project
│   ├── .clasp.json                 ← Points to DEV script ID
│   ├── appsscript.json             ← Manifest (timeZone: America/Chicago)
│   ├── Config.gs                   ← All constants (ENV, ACCOUNT, SPREADSHEET_ID)
│   ├── Utilities.gs                ← Shared helpers (checkAccount, logEvent, etc.)
│   ├── Router.gs                   ← doGet / doPost — routes action → Agent
│   ├── Code.gs                     ← Inventory management (updateInventory)
│   ├── RelocationTracker.gs        ← SHSID onboarding document tracker (in progress)
│   └── agents/                     ← Agent files live here (auto-created by CLI)
│
├── prod-project/                   ← Production GAS project
│   ├── .clasp.json                 ← Points to PROD script ID
│   ├── appsscript.json
│   ├── Config.gs
│   ├── Utilities.gs
│   ├── Router.gs
│   └── Code.gs
│
└── scripts/                        ← SHELVED — do not modify or build on these
    ├── standards_embed.py          ← RAG engine (shelved, not a priority)
    ├── query_test.py               ← RAG engine (shelved)
    ├── test_env.py                 ← RAG engine (shelved)
    ├── iam-auditor-notes.md        ← GC-IAM-Auditor planning notes (backlog)
    └── requirements.txt            ← RAG engine (shelved)
```

**Important:** There is no `scripts/Code.gs`. GAS files live inside `dev-project/` and `prod-project/` only.

> **Note on `scripts/`:** The Python RAG engine (Chroma vector DB, trilingual standards embedding)
> has been shelved and is not a current priority. Do not suggest building on or extending these files.
> They are kept for potential future reference only.

---

## Script IDs & Web App URLs

> **Stored locally only — see `.env.local` at repo root (gitignored).**
> Variables: `DEV_SCRIPT_ID`, `DEV_WEBHOOK_URL`, `PROD_SCRIPT_ID`, `PROD_WEBHOOK_URL`

| Env  | GAS Script ID | Web App URL |
|------|---------------|-------------|
| Dev  | see `DEV_SCRIPT_ID` in `.env.local` | see `DEV_WEBHOOK_URL` in `.env.local` |
| Prod | see `PROD_SCRIPT_ID` in `.env.local` | see `PROD_WEBHOOK_URL` in `.env.local` |

GitHub Secrets:
- `CLASDEV_JSON` — clasp OAuth token for dev account
- `CLASPRC` — clasp OAuth token for prod account

---

## Architecture — How a Request Flows

```
External trigger (iOS Shortcut, n8n, Make, curl)
        │  POST { "action": "fileops", ... }
        ▼
  Router.gs → doPost()
        │
        ├── Validates secret (prod only)
        ├── Parses JSON payload
        ├── Reads payload.action
        │
        └── "fileops"  → _Router_handleFileOps(payload)
```

Every Agent returns `buildResponse(code, message, data?)` — a standard JSON envelope.

---

## Current Status (March 2026)

### ✅ Complete
- Dev/prod separation deployed and tested
- Gateway-OS Router pattern live in both environments
- `ai-agents.sh` CLI: `auth`, `agent`, `deploy` commands
- `fileops` webhook route working
- `updateInventory()` Drive scan function
- Router.gs cleaned — no unimplemented stubs

### ✅ Complete (continued)
- **Phase 2** — Dev modular refactor (agents/ subfolder, LoggerAgent)
- **Phase 3** — RelocationBridge.py (Python → Drive upload → Webhook)
- **ModelRouterAgent** — All 4 routes active: Claude, Gemini, ChatGPT (GPT-4o), Perplexity. All API keys stored in Dev Script Properties.

### 🚫 Shelved
- **RAG Engine** — Python / Chroma vector DB / trilingual standards embedding (not a priority)

### ⏳ Ideas Backlog
- Journal Du Matin — daily Google Slides automation
- GC-IAM-Auditor — monthly GCP service account audit (template in scripts/)

---

## Ground Rules for AI Assistants

1. **Apply step by step logic** — think logically and provide evidence from research sources or user context.
2. **No-code first** — suggest GUI options before writing code
3. **Confirm before destructive actions** — never overwrite without asking
4. **Conventional commits** — format: `type: message` (e.g., `feat: add LoggerAgent`)
5. **FERPA** — never include real student names, grades, or IDs anywhere
6. **Check accounts** — always confirm which Google account is active before clasp operations
7. **Phase-by-phase** — output one phase at a time, wait for confirmation before the next
8. **Never guess at outputs** - if you have insufficient data or context to make a decision, do not guess. Instead, ask for more information.
9. **Code lives in GitHub only** — never save code files to local folders or Google Drive. All `.gs`, `.sh`, `.py`, `.js`, and config files belong in the GitHub repo and nowhere else.
---

## First-Time Setup (after fresh clone)

```bash
cd ~/Developer.nosync/21_systems/nexus-command

# Activate git hooks (one-time per machine)
git config core.hooksPath .githooks

# Copy credentials (not in repo — must be created manually)
# See .env.local format in project_env_local.md memory file
```

---

## CLI Quick Reference

```bash
cd ~/Developer.nosync/21_systems/nexus-command

./ai-agents.sh auth dev            # Verify dev token, auto-rotate GitHub Secret if expired
./ai-agents.sh auth prod           # Same for prod
./ai-agents.sh agent Journal       # Scaffold dev-project/agents/JournalAgent.gs
./ai-agents.sh deploy dev          # Push dev-project/ to GAS
./ai-agents.sh deploy prod         # Push prod-project/ (requires typing 'yes-prod')
```

---

## Git & GitHub Workflow (AI-Executable)

### Standard commit flow
```bash
git status                        # review what changed
git add <specific files>          # never use git add -A or git add .
git commit -m "type: message"     # conventional commit format (see below)
git push                          # push to origin/main
```

### Memory update triggers
After certain changes, update the relevant memory file before committing:

| If you changed... | Update this memory file |
|-------------------|------------------------|
| GAS script ID or webhook URL | `project_env_local.md` + `last_verified` date |
| Spreadsheet IDs or sheet structure | `project_sheet_state.md` + `last_verified` date |
| Repo structure in Developer.nosync | `reference_developer_nosync.md` + `last_verified` date |
| How Claude should behave | `feedback_*.md` — add or update the relevant rule |
| Cary's role or preferences | `user_cary.md` |

Memory files live at:
`~/.claude/projects/-Users-caryhebert-Developer-nosync-21-systems-nexus-command/memory/`

### Conventional commit format
| Type | When to use |
|------|-------------|
| `feat:` | new agent, new route, new capability |
| `fix:` | bug fix in existing code |
| `chore:` | maintenance, dependency updates, renames |
| `docs:` | CLAUDE.md, README, comments only |
| `security:` | credential removal, gitignore fixes, access changes |
| `refactor:` | restructure without behavior change |

### CI/CD pipeline — `.github/workflows/deploy.yml`
- **DEV auto-deploys** on every push to `main` using `CLASDEV_JSON` secret
- **PROD requires manual approval** via GitHub Environment protection (`production` environment)
- To approve a prod deploy: go to the GitHub Actions run → Review deployments → Approve

### One-time GitHub setup required for prod protection
1. Repo **Settings → Environments → New environment** → name it `production`
2. Enable **Required reviewers** → add yourself
3. Save — prod will now pause and wait for your approval on every push

### Verify a deploy succeeded
```bash
git log --oneline -5              # confirm commit is on main
```
Then check the GitHub Actions tab for green checkmarks on both jobs.

---

## Gateway Route Command (Zero-Friction AI Routing)

When Cary pastes a message starting with `gateway route`, execute it automatically — no confirmation needed.

### Format
```
gateway route [task_type]: [prompt]
```

### What to do
1. `source /Users/caryhebert/Developer.nosync/21_systems/nexus-command/.env.local`
2. Fire the two-step curl POST to `$DEV_WEBHOOK_URL` with `action: "route"`, `task_type`, and `prompt`
3. Parse the JSON response and present `data.output` clearly — do not dump raw JSON
4. If `code` is not 200, diagnose the error

### Task type → model mapping
| `task_type` | Routes to | Use for |
|-------------|-----------|---------|
| `research` | Perplexity | Cited research, best practices |
| `current_events` | Perplexity | Recent news, time-sensitive topics |
| `complex_code` | Claude | Multi-file code, architecture review |
| `architecture` | Claude | System design, GAS structure |
| `debugging` | Claude | Error diagnosis and fixes |
| `long_form` | Claude | Reports, letters, proposals |
| `quick_script` | GPT-4o | Short scripts, one-off tasks |
| `prototype` | GPT-4o | Fast working proof-of-concept |
| `mandarin` | Gemini | Chinese/French translation |
| `ocr` | Gemini | OCR cleanup, text extraction |

### Examples (paste as-is, fill in `[...]`)
```
gateway route research: [question]
gateway route current_events: [topic] — past [7 / 30] days
gateway route debugging: ERROR: [error] CODE: [code]
gateway route mandarin: Translate to Chinese: [text]
gateway route quick_script: Write a GAS script that [what it should do]
```

Full template list: `docs/route-prompts.md`

---

## Webhook POST Workflow (AI-Executable)

> Credentials are in `.env.local` (gitignored). Load them before running any curl command.

### Why two steps?
GAS web apps always return a 302 redirect. `curl -L` silently converts POST→GET after the redirect, which breaks the call. The correct pattern is: POST → capture redirect URL → GET the redirect.

### Pattern (copy-paste ready)
```bash
# 1. Load credentials
source /Users/caryhebert/Developer.nosync/21_systems/nexus-command/.env.local

# 2. POST and capture redirect
REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" -X POST \
  "$DEV_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "log",
    "eventType": "PROJECT_STATUS",
    "message": "your message here",
    "level": "INFO",
    "data": { "source": "manual" }
  }')

# 3. GET the response
curl -s "$REDIRECT"
```

### LoggerAgent payload shape
| Field | Required | Values |
|-------|----------|--------|
| `action` | yes | `"log"` |
| `eventType` | yes | any string e.g. `"PROJECT_STATUS"` |
| `message` | yes | free text |
| `level` | no | `"INFO"` \| `"WARN"` \| `"ERROR"` (default: INFO) |
| `data` | no | any JSON object |

Logs appear in the **System Log** tab of the shared spreadsheet (see `PROD_SPREADSHEET_ID` in `.env.local`).

### After pushing code changes via clasp
The live web app does NOT auto-update. You must redeploy in the GAS editor:
**Deploy → Manage deployments → Edit → New version → Deploy**

---

## Future Addition: Trilingual RAG Engine

> **Status: Not started. Do not implement unless Cary explicitly asks.**

A planned semantic search engine over educational standards in English, French, and Mandarin.
Files already exist in `scripts/` but are not connected to Gateway-OS yet.

| File | Purpose |
|------|---------|
| `scripts/standards_embed.py` | Embeds standards PDFs/CSVs into a Chroma vector DB |
| `scripts/query_test.py` | Tests semantic queries against the DB |
| `scripts/test_env.py` | Verifies `GOOGLE_API_KEY` is set in `.env` |
| `standards_raw/` | Source PDFs/CSVs to be embedded |

When active, it will use Google's free embedding API and requires a `GOOGLE_API_KEY` in a local `.env` file (never committed to Git).
