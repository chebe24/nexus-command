# ctx-research.md — Lightweight Context for Perplexity (Research)
# Copy everything below this line and paste as your opening message.
# ─────────────────────────────────────────────────────────────────

## Research Context

I'm building a personal automation system called **Gateway-OS** using Google Apps Script (GAS).
It's a modular webhook router: external tools POST to a central endpoint, which routes to
self-contained Agent scripts that log results to Google Sheets.

**My constraints:**
- No-code / low-code preferred — I'm not a professional developer
- Free tools only — Google Workspace ecosystem (GAS, Sheets, Drive)
- Modular architecture — new capabilities are added as independent Agent blocks
- All code lives in GitHub (chebe24/AI-Agents), deployed via clasp CLI
- Running on Google Apps Script V8 runtime

**Current agents:** LoggerAgent (conversation logging), InventoryAgent (Drive scanning),
FileOps (filename validation), PatternRegistryAgent (naming convention sync)

**My workflow:**
- Claude → coding and implementation
- Perplexity → research (that's you)
- Gemini / ChatGPT → PRDs and documentation

Frame your research answers with these constraints in mind.
Prefer solutions that work within Google's ecosystem before suggesting external services.
