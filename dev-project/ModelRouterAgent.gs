// =============================================================================
// ModelRouterAgent.gs — Multi-AI Routing Agent
// Project: nexus-command
// Account: cary.hebert@gmail.com
// Updated: 2026-03-13
// =============================================================================
// Routes incoming tasks to the correct AI model based on task_type.
// All API keys are read from Script Properties — never hardcoded.
//
// ROUTING TABLE (research-backed, Mar 13 2026):
//   Claude      → complex_code, architecture, writing, thesis, long_form
//   ChatGPT     → quick_script, prototype, web_task, multimedia
//   Gemini      → mandarin, ocr, translation
//   Perplexity  → research, current_events
// =============================================================================

/**
 * Main entry point. Called by Router.gs when action === "route".
 * @param {Object} payload - { task_type: string, prompt: string, context?: string }
 * @returns {Object} Standard buildResponse envelope
 */
function routeToModel(payload) {
  const taskType = (payload.task_type || '').toLowerCase().trim();
  const prompt   = payload.prompt || '';

  if (!taskType || !prompt) {
    return buildResponse(400, 'Missing required fields: task_type, prompt');
  }

  // Route based on task_type
  if (['complex_code','architecture','writing','thesis','long_form','debugging'].includes(taskType)) {
    return _callClaude(prompt, payload.context);
  }

  if (['quick_script','prototype','web_task','multimedia'].includes(taskType)) {
    return _callChatGPT(prompt, payload.context);
  }

  if (['mandarin','ocr','translation','chinese'].includes(taskType)) {
    return _callGemini(prompt, payload.context);
  }

  if (['research','current_events','sourced'].includes(taskType)) {
    return _callPerplexity(prompt, payload.context);
  }

  return buildResponse(400, `Unknown task_type: "${taskType}". Check routing table in ModelRouterAgent.gs.`);
}


// =============================================================================
// PRIVATE — Model Callers
// =============================================================================

/**
 * Claude (Anthropic) — complex code, architecture, writing, thesis
 * Called via Anthropic REST API.
 */
function _callClaude(prompt, context) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: ANTHROPIC_API_KEY');

  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      { role: 'user', content: context ? `Context:\n${context}\n\nTask:\n${prompt}` : prompt }
    ]
  };

  try {
    const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());
    const text   = result.content?.[0]?.text || '';
    return buildResponse(200, 'Claude response received', { model: 'claude', output: text });

  } catch (e) {
    return buildResponse(500, `Claude API error: ${e.message}`);
  }
}


/**
 * ChatGPT (OpenAI GPT-4o) — quick scripts, prototypes, web tasks, multimedia
 */
function _callChatGPT(prompt, context) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: OPENAI_API_KEY — key not yet obtained');

  const body = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user',   content: context ? `Context:\n${context}\n\nTask:\n${prompt}` : prompt }
    ],
    max_tokens: 2048
  };

  try {
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());
    const text   = result.choices?.[0]?.message?.content || '';
    return buildResponse(200, 'ChatGPT response received', { model: 'chatgpt', output: text });

  } catch (e) {
    return buildResponse(500, `ChatGPT API error: ${e.message}`);
  }
}


/**
 * Gemini (Google) — Mandarin, OCR, translation, Chinese language tasks
 */
function _callGemini(prompt, context) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: GEMINI_API_KEY');

  const fullPrompt = context ? `Context:\n${context}\n\nTask:\n${prompt}` : prompt;

  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }]
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());
    const text   = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return buildResponse(200, 'Gemini response received', { model: 'gemini', output: text });

  } catch (e) {
    return buildResponse(500, `Gemini API error: ${e.message}`);
  }
}


/**
 * Perplexity — research, current events, sourced answers
 */
function _callPerplexity(prompt, context) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('PERPLEXITY_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: PERPLEXITY_API_KEY — key not yet obtained');

  const body = {
    model: 'sonar',
    messages: [
      { role: 'system', content: 'Be precise and cite sources.' },
      { role: 'user',   content: context ? `Context:\n${context}\n\nResearch:\n${prompt}` : prompt }
    ]
  };

  try {
    const response = UrlFetchApp.fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    const raw    = response.getContentText();
    const result = JSON.parse(raw);
    const text   = result.choices?.[0]?.message?.content || '';
    if (!text) {
      return buildResponse(500, 'Perplexity returned empty output', { raw: raw.substring(0, 500) });
    }
    return buildResponse(200, 'Perplexity response received', { model: 'perplexity', output: text });

  } catch (e) {
    return buildResponse(500, `Perplexity API error: ${e.message}`);
  }
}
