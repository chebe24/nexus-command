// =============================================================================
// ModelRouterAgent.gs — Multi-AI Routing Agent
// Project: nexus-command
// Account: cary.hebert@gmail.com
// Updated: 2026-03-29
// =============================================================================
// Routes incoming tasks to the correct AI model based on task_type.
// All API keys AND model names are read from Script Properties — never hardcoded.
//
// ROUTING TABLE:
//   Claude      → complex_code, architecture, writing, thesis, long_form, debugging
//   ChatGPT     → quick_script, prototype, web_task, multimedia
//   Gemini      → mandarin, ocr, translation, chinese
//   Perplexity  → research, current_events, sourced
//
// REQUIRED SCRIPT PROPERTIES:
//   ANTHROPIC_API_KEY, CLAUDE_MODEL, CLAUDE_MODEL_FALLBACK
//   OPENAI_API_KEY,    OPENAI_MODEL, OPENAI_MODEL_FALLBACK
//   GEMINI_API_KEY,    GEMINI_MODEL, GEMINI_MODEL_FALLBACK
//   PERPLEXITY_API_KEY, PERPLEXITY_MODEL, PERPLEXITY_MODEL_FALLBACK
// =============================================================================


// =============================================================================
// PUBLIC — Router
// =============================================================================

function routeToModel(payload) {
  var taskType = (payload.task_type || '').toLowerCase().trim();
  var prompt = payload.prompt || '';

  if (!taskType || !prompt) {
    return buildResponse(400, 'Missing required fields: task_type, prompt');
  }

  var claudeTasks     = ['complex_code', 'architecture', 'writing', 'thesis', 'long_form', 'debugging'];
  var chatgptTasks    = ['quick_script', 'prototype', 'web_task', 'multimedia'];
  var geminiTasks     = ['mandarin', 'ocr', 'translation', 'chinese'];
  var perplexityTasks = ['research', 'current_events', 'sourced'];

  if (claudeTasks.indexOf(taskType)     !== -1) return _callClaude(prompt, payload.context);
  if (chatgptTasks.indexOf(taskType)    !== -1) return _callChatGPT(prompt, payload.context);
  if (geminiTasks.indexOf(taskType)     !== -1) return _callGemini(prompt, payload.context);
  if (perplexityTasks.indexOf(taskType) !== -1) return _callPerplexity(prompt, payload.context);

  return buildResponse(400, 'Unknown task_type: ' + taskType);
}


// =============================================================================
// PUBLIC — Pre-flight config check (run manually from GAS editor)
// =============================================================================

function testModelConfig() {
  var props = PropertiesService.getScriptProperties();
  var keys = [
    'CLAUDE_MODEL', 'CLAUDE_MODEL_FALLBACK',
    'OPENAI_MODEL', 'OPENAI_MODEL_FALLBACK',
    'GEMINI_MODEL', 'GEMINI_MODEL_FALLBACK',
    'PERPLEXITY_MODEL', 'PERPLEXITY_MODEL_FALLBACK'
  ];
  Logger.log('=== Model Config Check ===');
  for (var i = 0; i < keys.length; i++) {
    var val = props.getProperty(keys[i]);
    Logger.log(keys[i] + ': ' + (val || '*** MISSING ***'));
  }
  Logger.log('=== End Config Check ===');
}


// =============================================================================
// PRIVATE — Model Callers
// =============================================================================

function _callClaude(prompt, context) {
  var props  = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: ANTHROPIC_API_KEY');

  var primaryModel  = props.getProperty('CLAUDE_MODEL')          || 'claude-sonnet-4-6';
  var fallbackModel = props.getProperty('CLAUDE_MODEL_FALLBACK')  || 'claude-3-5-haiku-20241022';

  var content = context ? 'Context:\n' + context + '\n\nTask:\n' + prompt : prompt;

  var result = _fetchClaude(apiKey, primaryModel, content);
  var modelUsed = primaryModel;

  if (_isModelError(result.parsed)) {
    result    = _fetchClaude(apiKey, fallbackModel, content);
    modelUsed = fallbackModel + ' (fallback)';
  }

  var text = result.text;
  _logRouteEvent_(modelUsed, 'claude', prompt, text || '', result.durationMs);
  return buildResponse(200, 'Claude response received', { model: modelUsed, output: text || 'EMPTY raw: ' + result.raw.substring(0, 400) });
}


function _callChatGPT(prompt, context) {
  var props  = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('OPENAI_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: OPENAI_API_KEY');

  var primaryModel  = props.getProperty('OPENAI_MODEL')          || 'gpt-4o';
  var fallbackModel = props.getProperty('OPENAI_MODEL_FALLBACK')  || 'gpt-4o-mini';

  var content = context ? 'Context:\n' + context + '\n\nTask:\n' + prompt : prompt;

  var result = _fetchChatGPT(apiKey, primaryModel, content);
  var modelUsed = primaryModel;

  if (_isModelError(result.parsed)) {
    result    = _fetchChatGPT(apiKey, fallbackModel, content);
    modelUsed = fallbackModel + ' (fallback)';
  }

  var text = result.text;
  _logRouteEvent_(modelUsed, 'chatgpt', prompt, text || '', result.durationMs);
  return buildResponse(200, 'ChatGPT response received', { model: modelUsed, output: text || 'EMPTY raw: ' + result.raw.substring(0, 400) });
}


function _callGemini(prompt, context) {
  var props  = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('GEMINI_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: GEMINI_API_KEY');

  var primaryModel  = props.getProperty('GEMINI_MODEL')          || 'gemini-2.5-flash';
  var fallbackModel = props.getProperty('GEMINI_MODEL_FALLBACK')  || 'gemini-1.5-pro';

  var fullPrompt = context ? 'Context:\n' + context + '\n\nTask:\n' + prompt : prompt;

  var result = _fetchGemini(apiKey, primaryModel, fullPrompt);
  var modelUsed = primaryModel;

  if (_isModelError(result.parsed)) {
    result    = _fetchGemini(apiKey, fallbackModel, fullPrompt);
    modelUsed = fallbackModel + ' (fallback)';
  }

  var text = result.text;
  _logRouteEvent_(modelUsed, 'gemini', prompt, text || '', result.durationMs);
  return buildResponse(200, 'Gemini response received', { model: modelUsed, output: text || 'EMPTY raw: ' + result.raw.substring(0, 400) });
}


function _callPerplexity(prompt, context) {
  var props  = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('PERPLEXITY_API_KEY');
  if (!apiKey) return buildResponse(500, 'Missing Script Property: PERPLEXITY_API_KEY');

  var primaryModel  = props.getProperty('PERPLEXITY_MODEL')          || 'sonar';
  var fallbackModel = props.getProperty('PERPLEXITY_MODEL_FALLBACK')  || 'sonar-pro';

  var content = context ? 'Context:\n' + context + '\n\nResearch:\n' + prompt : prompt;

  var result = _fetchPerplexity(apiKey, primaryModel, content);
  var modelUsed = primaryModel;

  if (_isModelError(result.parsed)) {
    result    = _fetchPerplexity(apiKey, fallbackModel, content);
    modelUsed = fallbackModel + ' (fallback)';
  }

  var text = result.text;
  if (!text) return buildResponse(500, 'Perplexity returned empty output', { model: modelUsed, raw: result.raw.substring(0, 500) });
  _logRouteEvent_(modelUsed, 'perplexity', prompt, text, result.durationMs);
  return buildResponse(200, 'Perplexity response received', { model: modelUsed, output: text });
}


// =============================================================================
// PRIVATE — HTTP Fetchers (one per provider)
// =============================================================================

function _fetchClaude(apiKey, model, content) {
  var start = Date.now();
  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      payload: JSON.stringify({ model: model, max_tokens: 2048, messages: [{ role: 'user', content: content }] }),
      muteHttpExceptions: true
    });
    var raw    = response.getContentText();
    var parsed = JSON.parse(raw);
    var text   = (parsed.content && parsed.content[0]) ? parsed.content[0].text : '';
    return { raw: raw, parsed: parsed, text: text, durationMs: Date.now() - start };
  } catch (e) {
    return { raw: e.message, parsed: {}, text: '', durationMs: Date.now() - start };
  }
}


function _fetchChatGPT(apiKey, model, content) {
  var start = Date.now();
  try {
    var response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      payload: JSON.stringify({ model: model, max_tokens: 2048, messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: content }] }),
      muteHttpExceptions: true
    });
    var raw    = response.getContentText();
    var parsed = JSON.parse(raw);
    var text   = (parsed.choices && parsed.choices[0] && parsed.choices[0].message) ? parsed.choices[0].message.content : '';
    return { raw: raw, parsed: parsed, text: text, durationMs: Date.now() - start };
  } catch (e) {
    return { raw: e.message, parsed: {}, text: '', durationMs: Date.now() - start };
  }
}


function _fetchGemini(apiKey, model, fullPrompt) {
  var start = Date.now();
  try {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;
    var response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }),
      muteHttpExceptions: true
    });
    var raw    = response.getContentText();
    var parsed = JSON.parse(raw);
    var text   = (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0]) ? parsed.candidates[0].content.parts[0].text : '';
    return { raw: raw, parsed: parsed, text: text, durationMs: Date.now() - start };
  } catch (e) {
    return { raw: e.message, parsed: {}, text: '', durationMs: Date.now() - start };
  }
}


function _fetchPerplexity(apiKey, model, content) {
  var start = Date.now();
  try {
    var response = UrlFetchApp.fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      payload: JSON.stringify({ model: model, messages: [{ role: 'system', content: 'Be precise and cite sources.' }, { role: 'user', content: content }] }),
      muteHttpExceptions: true
    });
    var raw    = response.getContentText();
    var parsed = JSON.parse(raw);
    var text   = (parsed.choices && parsed.choices[0] && parsed.choices[0].message) ? parsed.choices[0].message.content : '';
    return { raw: raw, parsed: parsed, text: text, durationMs: Date.now() - start };
  } catch (e) {
    return { raw: e.message, parsed: {}, text: '', durationMs: Date.now() - start };
  }
}


// =============================================================================
// PRIVATE — Helpers
// =============================================================================

// Returns true if the API response indicates a model-level error (404/400)
// that warrants trying the fallback model.
function _isModelError(parsed) {
  return parsed && parsed.error && (parsed.error.code === 404 || parsed.error.code === 400);
}


// Appends one row to ChatLogs after every route call.
// Columns: Timestamp | Model | TaskType | Prompt (truncated) | Response (truncated) | Duration
function _logRouteEvent_(model, provider, prompt, response, durationMs) {
  try {
    var sheet = getOrCreateSheet('ChatLogs', ['Timestamp', 'Model', 'Provider', 'Prompt', 'Response', 'Duration']);
    sheet.appendRow([
      new Date(),
      model,
      provider,
      prompt.substring(0, 300),
      response.substring(0, 300),
      durationMs + 'ms'
    ]);
  } catch (e) {
    Logger.log('_logRouteEvent_ error: ' + e.message);
  }
}
