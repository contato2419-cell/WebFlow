// Cloudflare Pages Function: Sincronização Global do Estado da Automação (Backend KV com Dupla Camada)
// Permite Ligar/Desligar instantaneamente a automação tanto no Frontend quanto no Webhook
import { requirePanelKey } from '../../lib/panelAuth.js';

const CF_ACCOUNT_ID = 'be7db94a293732762035a5c23126dfae';
const CF_KV_ID = '6ffd8aa59e6a43ebaee8c87a7dd5ceb1';

const DEFAULT_STATE = {
  is_active: false,
  keyword: 'LISTA',
  delaySeconds: 15,
  antiBanJitter: 8,
  firstDmTitle: 'Só me seguir e clicar no botão pra min não tomar ban',
  firstDmSubtitle: 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra receber 📲',
  firstDmText: 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra receber 📲',
  buttonText: '✅ Já estou seguindo',
  finalLinkMessage: `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`,
  travaReminder: `Opa! Vi aqui que você ainda não começou a me seguir 👀\n\nDá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!`
};

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Panel-Key',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
};

// Cache em memória para caso o KV esteja temporariamente bloqueado (429)
let inMemoryStateCache = null;

async function getStoredState(env) {
  if (inMemoryStateCache) return inMemoryStateCache;

  if (env && env.WEBFLOW_KV) {
    try {
      const stored = await env.WEBFLOW_KV.get('FLOW_STATE');
      if (stored) {
        inMemoryStateCache = JSON.parse(stored);
        return inMemoryStateCache;
      }
    } catch (e) {
      console.warn('Erro ao ler do KV (usando cache local se disponível):', e.message);
    }
  }

  const token = env?.CLOUDFLARE_API_TOKEN || env?.CF_TOKEN;
  if (!token) return inMemoryStateCache;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const text = await res.text();
      inMemoryStateCache = JSON.parse(text);
      return inMemoryStateCache;
    }
  } catch (e) {}

  return inMemoryStateCache;
}

async function putStoredState(env, stateObj) {
  inMemoryStateCache = stateObj;
  const jsonStr = JSON.stringify(stateObj);

  if (env && env.WEBFLOW_KV) {
    try {
      // PROTEÇÃO DE COTA: A leitura no KV é de 100.000/dia grátis.
      // Se o estado for idêntico ao já gravado, NÃO gasta cota de gravação (1.000/dia)!
      const currentRaw = await env.WEBFLOW_KV.get('FLOW_STATE');
      if (currentRaw === jsonStr) {
        return; // Estado inalterado: zero PUTs gastos!
      }
      await env.WEBFLOW_KV.put('FLOW_STATE', jsonStr);
      return; // Já gravou via binding, não chama REST API duplicada!
    } catch (e) {
      console.warn('KV temporariamente limitado ou indisponível:', e.message);
      return;
    }
  }

  const token = env?.CLOUDFLARE_API_TOKEN || env?.CF_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: jsonStr
    });
  } catch (e) {}
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const stored = await getStoredState(env);
    const rawState = stored ? { ...DEFAULT_STATE, ...stored } : DEFAULT_STATE;
    let cleanKeyword = rawState.keyword;
    if (cleanKeyword) {
      const parts = String(cleanKeyword).split(/[,;|]/).map(k => k.trim().toUpperCase()).filter(Boolean);
      const unique = [...new Set(parts)];
      cleanKeyword = unique.length > 0 ? unique.join(', ') : 'LISTA';
    }
    const state = { ...rawState, keyword: cleanKeyword };

    return new Response(JSON.stringify({ success: true, state }), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message, state: DEFAULT_STATE }), {
      status: 200,
      headers: CORS_HEADERS
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const denied = await requirePanelKey(request, env);
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const current = await getStoredState(env);
    const currentState = current || DEFAULT_STATE;

    let cleanKeyword = currentState.keyword;
    if (body.keyword !== undefined) {
      const parts = String(body.keyword).split(/[,;|]/).map(k => k.trim().toUpperCase()).filter(Boolean);
      const unique = [...new Set(parts)];
      cleanKeyword = unique.length > 0 ? unique.join(', ') : 'LISTA';
    }

    const updatedState = {
      ...currentState,
      ...body,
      keyword: cleanKeyword,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : currentState.is_active
    };

    if (body.flows !== undefined && Array.isArray(body.flows)) {
      updatedState.flows = body.flows;
    }

    await putStoredState(env, updatedState);

    return new Response(JSON.stringify({ success: true, state: updatedState }), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}
