# ctx-docs.md — Medium Context for Gemini / ChatGPT (PRDs, MVPs, Documentation)
# Copy everything below this line and paste as your opening message.
# ─────────────────────────────────────────────────────────────────

## Project Context: Gateway-OS

You are helping Cary Hebert write documentation, PRDs, or MVP plans for **Gateway-OS**.

**Owner:** Cary Hebert — 1st Grade French Immersion teacher, Baton Rouge LA.
Transitioning to Shanghai High School International Division, August 2026.
Non-technical background. Plain English preferred. No jargon without explanation.

---

## What Gateway-OS Is

A personal automation system built on Google Apps Script. It works like a switchboard:
- External tools (iPhone Shortcuts, automation platforms) send requests to a central webhook
- The system routes each request to the right "Agent" — a small, focused script
- Every action is logged to a Google Sheet dashboard

Think of it as a modular command center where each Agent is a self-contained block
that can be added, removed, or swapped without touching anything else.

---

## Current Agents (Modules)

| Agent | What It Does |
|-------|-------------|
| LoggerAgent | Records AI conversations (platform, title, summary, URL) to a tracking sheet |
| InventoryAgent | Scans a Google Drive folder and catalogs automation files |
| FileOps | Validates file names against a naming convention |
| PatternRegistryAgent | Keeps the naming rules up to date from GitHub |

---

## Technology Stack (plain language)

- **Google Apps Script** — the scripting language (similar to JavaScript, runs in Google's cloud)
- **Google Sheets** — the database / dashboard
- **Webhooks** — the communication method (like a doorbell: external tool rings, system answers)
- **GitHub** — where all code is stored and versioned (chebe24/AI-Agents)
- **clasp** — the command-line tool that pushes code from local machine to Google Apps Script

---

## Design Principles

- **Modular** — each Agent is independent; plug in or remove without breaking others
- **No hardcoded secrets** — all sensitive IDs stored in a secure vault (Script Properties)
- **Logged** — every action writes to a Google Sheet for audit and review
- **Plain** — no infrastructure more complex than Google's free tools

---

## Naming Convention (V6)

All files follow this pattern: `NN-YYYY-MM-DD_Component_FileType_Title.ext`
Example: `02-2026-03-01_Gateway_YAML_PatternRegistryV6.md`

---

## What I Need From You

When writing PRDs, MVPs, or documentation for this project:
- Use plain, non-technical language where possible
- Structure output as: Overview → Goals → Components → Steps → Success Criteria
- Each new Agent or feature should be described as a self-contained module
- Flag any dependencies on existing agents clearly
- Do not suggest adding external services, databases, or paid tools unless asked
