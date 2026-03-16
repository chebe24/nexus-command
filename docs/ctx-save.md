# ctx-save.md — Prompt to Save Gateway-OS Context in Any AI Model
# Paste this as your message AFTER loading a ctx-*.md file.
# Works in: ChatGPT (Memory), Gemini (Gems), Claude (Projects), Perplexity (Spaces)
# Last updated: 2026-03-16
# ─────────────────────────────────────────────────────────────────

Please save the following as persistent context so I don't need to re-paste it in future sessions.

---

## What to save

Save this as a memory or custom instruction titled: **"Gateway-OS Project Context"**

> I am Cary Hebert. I am building a personal automation system called Gateway-OS.
> It is a modular webhook router built on Google Apps Script (GAS).
> External tools (iPhone Shortcuts, n8n, Make, curl) POST to a central endpoint.
> The Router reads payload.action and routes to the correct Agent script.
> Every action is logged to a Google Sheet called AI_Agents_Command_Hub.
>
> **Repo:** github.com/chebe24/nexus-command (local: ~/Developer.nosync/21_systems/nexus-command)
>
> **Two environments:**
> - Dev: cary.hebert@gmail.com — Sheet ID 1KVHxSLUSk1LpySX2K1ITRXqxJKV4h-dpnd_Ia4lV6_E
> - Prod: cary.hebert@gmail.com — Sheet ID 1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE
> (Both currently write to prod sheet — dev sheet was deleted March 2026.)
>
> **Active webhook routes:**
> - "log" → LoggerAgent (System Log tab)
> - "fileops" → file validation
> - "inventory" → Drive folder scan
> - "route" → ModelRouterAgent (routes to Claude / GPT-4o / Gemini / Perplexity)
>
> **AI model routing (already implemented in ModelRouterAgent.gs):**
> - Claude → complex_code, architecture, debugging, writing
> - ChatGPT (GPT-4o) → quick_script, prototype, web_task, multimedia
> - Gemini → mandarin, ocr, translation, chinese
> - Perplexity → research, current_events, sourced
>
> **Credentials:** stored in .env.local (gitignored). Load with: source .env.local
>
> **GAS POST rule:** Never use curl -L -X POST. Use two-step pattern:
>   REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" -X POST "$DEV_WEBHOOK_URL" -H "Content-Type: application/json" -d '{...}')
>   curl -s "$REDIRECT"
>
> **CI/CD:** GitHub Actions — dev auto-deploys on push to main; prod requires manual approval (Environment: production, reviewer: chebe24).
>
> **My role in this project:** I ask the questions, you do the research/docs/planning. Claude handles all code implementation.
>
> **My preferences:**
> - Plain English, no jargon without explanation
> - No-code or low-code solutions first
> - Never suggest paid/external tools without asking
> - FERPA: never include real student names, grades, or IDs
> - Phase-by-phase: one step at a time, wait for my confirmation before the next

---

## Where to save it (per model)

**ChatGPT:**
Settings → Personalization → Memory → Manage memories → Add memory
OR just say: "Remember this for all future conversations."

**Gemini:**
Create a Gem: gemini.google.com → Gems → New Gem → name it "Gateway-OS" → paste the block above into the instructions field.

**Perplexity:**
Create a Space: perplexity.ai → Spaces → New Space → name it "Gateway-OS" → paste into the space instructions.

**Claude:**
This is handled automatically via Claude Projects and CLAUDE.md in the repo.
For Claude.ai (web), create a Project and paste ctx-full.md into the Project instructions.

---

## After saving

Confirm by saying: "Summarize the Gateway-OS project in 3 bullet points."
If the summary is accurate, context is saved correctly.
