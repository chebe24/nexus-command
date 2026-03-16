# troubleshooting.md — Gateway-OS Debugging Reference
# Last updated: 2026-03-16
# ─────────────────────────────────────────────────────────────────
# All issues encountered in production, with root cause and fix.

---

## 1. CI/CD fails with `invalid_grant`

**Symptom:** GitHub Actions → Deploy DEV fails at `clasp push --force` with:
```
invalid_grant
Error: Process completed with exit code 1
```

**Root cause:** The `CLASDEV_JSON` (or `CLASPRC`) GitHub Secret contains an expired clasp OAuth token. The local token in `~/.clasprc.json` may still be valid — `ai-agents.sh auth dev` checks local auth only and does NOT update the secret if local auth passes.

**Fix:**
```bash
# Force-update the GitHub Secret with current local token
cd ~/Developer.nosync/21_systems/nexus-command
gh secret set CLASDEV_JSON < ~/.clasprc.json   # dev
gh secret set CLASPRC < ~/.clasprc.json         # prod (if needed)

# Re-trigger the workflow
gh workflow run deploy.yml
```

**Prevention:** `ai-agents.sh auth dev` should be run periodically, but it only rotates when local auth is expired. If CI/CD fails but local auth is valid, force-update the secret manually as above.

---

## 2. Code changes not picked up by live web app after `clasp push`

**Symptom:** `clasp push` succeeds but the webhook still returns old behavior.

**Root cause:** GAS web apps run off a pinned deployment version. `clasp push` updates the code in the editor (HEAD) but does NOT update the live deployment. A new deployment version must be created.

**Fix (automated — now in CI/CD):**
CI/CD runs `clasp deploy --deploymentId <id>` after every `clasp push`. No manual action needed as long as CI/CD is passing.

**Fix (manual — if CI/CD is broken):**
GAS editor → Deploy → Manage deployments → pencil icon → Version: New version → Deploy

**Key distinction:**
- `clasp push` → updates code in GAS script editor (like `git push`)
- `clasp deploy` → publishes a new version to the live web app URL (like releasing)

---

## 3. `UrlFetchApp.fetch` permission error

**Symptom:** Webhook returns:
```json
{"code":500,"message":"Perplexity API error: You do not have permission to call UrlFetchApp.fetch..."}
```

**Root cause:** `appsscript.json` was missing the `oauthScopes` field with `script.external_request`. GAS requires explicit OAuth scope declarations to make external HTTP calls.

**Fix:** `dev-project/appsscript.json` must include:
```json
"oauthScopes": [
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive"
]
```

**After adding scopes:** Must re-authorize in GAS editor:
1. Open any function (e.g. `LoggerAgent_test`)
2. Click Run
3. "Authorization required" → Review permissions → Allow

This grants the new scope to the deploying user account. Only needed once per new scope addition.

---

## 4. GAS POST via curl returns "Page Not Found"

**Symptom:** `curl -L -X POST "$URL"` returns a Google Drive "Page Not Found" page.

**Root cause:** GAS web apps return a 302 redirect after POST. `-L` follows the redirect but silently converts POST → GET. The GET request hits the wrong endpoint.

**Fix — two-step curl pattern (always use this):**
```bash
source ~/Developer.nosync/21_systems/nexus-command/.env.local
REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" -X POST "$DEV_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"..."}')
curl -s "$REDIRECT"
```

---

## 5. Perplexity returns empty output

**Symptom:** `{"code":200,"message":"Perplexity response received","output":""}` — call succeeds but no text returned.

**Root cause (investigated March 2026):** Was caused by the old model name `llama-3.1-sonar-small-128k-online` being deprecated. Updated to `sonar`.

**Current model names (March 2026):**
- `sonar` — standard (replaces llama-3.1-sonar-small-128k-online)
- `sonar-pro` — higher quality, higher cost

**How to debug empty output:** Check `data.raw` in the response — the debug code in `ModelRouterAgent.gs` logs the first 500 chars of the raw API response when output is empty.

---

## 6. Node.js deprecation warning in GitHub Actions

**Symptom:** Actions log warns about Node.js 20 deprecation (forced to Node.js 24 after June 2026).

**Fix (applied March 2026):**
```yaml
uses: actions/checkout@v4.2.2
uses: actions/setup-node@v4.3.0
with:
  node-version: '24'
```

---

## 7. GitHub Actions permissions advisory

**Symptom:** CodeQL scan flags missing explicit permissions in workflow.

**Fix (applied March 2026):** Added to `deploy.yml`:
```yaml
permissions:
  contents: read
```

---

## Deployment IDs (do not change without updating deploy.yml)

| Env | Deployment ID | Version |
|-----|--------------|---------|
| Dev | `AKfycbxQiZQIiltlYtmomigjNsmSVC4z-WRoSFIHFrSjMEZ85t-ReCSuN4D-u0WxDJ--obon` | @5 — Agents-Development-Log-v5.0 |
| Prod | `AKfycbxaaDHgJf3xBE8KZJBlpVSE2LSkaIZdLLeaBhx6z6y4uAq4fa0UiM3QI7oJ_WO8A91Ibg` | @2 — Agent-Prod-Hub-v2.0 |

These IDs are hardcoded in `.github/workflows/deploy.yml` under the `clasp deploy --deploymentId` steps.
