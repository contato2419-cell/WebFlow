// Cloudflare Pages Function: Sincronização Global do Estado da Automação (Backend KV com Dupla Camada)
// Permite Ligar/Desligar instantaneamente a automação tanto no Frontend quanto no Webhook

const CF_ACCOUNT_ID = 'be7db94a293732762035a5c23126dfae';
const CF_KV_ID = '6ffd8aa59e6a43ebaee8c87a7dd5ceb1';
const CF_TOKEN = '';

const DEFAULT_STATE = {
  is_active: false,
  keyword: 'LISTA',
  delaySeconds: 15,
  antiBanJitter: 8,
  firstDmTitle: 'Só libera se seguir @ygorweb 🔒',
  firstDmSubtitle: 'So me seguir e apertar no botão pra min não tomar ban, Tô postando vídeo assim toda semana 🚀',
  firstDmText: 'So me seguir e apertar no botão pra min não tomar ban, Tô postando vídeo assim toda semana 🚀',
  buttonText: '✅ Já estou te seguindo!',
  finalLinkMessage: `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`,
  travaReminder: `Opa! Vi aqui que você ainda não começou a me seguir 👀\n\nDá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!`
};

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
};

async function getStoredState(env) {
  if (env.WEBFLOW_KV) {
    try {
      const stored = await env.WEBFLOW_KV.get('FLOW_STATE');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  }

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      headers: { 'Authorization': `Bearer ${CF_TOKEN}` }
    });
    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text);
    }
  } catch (e) {}

  return null;
}

async function putStoredState(env, stateObj) {
  const jsonStr = JSON.stringify(stateObj);

  if (env.WEBFLOW_KV) {
    try {
      await env.WEBFLOW_KV.put('FLOW_STATE', jsonStr);
    } catch (e) {}
  }

  try {
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CF_TOKEN}`,
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
    const state = stored ? { ...DEFAULT_STATE, ...stored } : DEFAULT_STATE;

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

  try {
    const body = await request.json().catch(() => ({}));
    const current = await getStoredState(env);
    const currentState = current ? { ...DEFAULT_STATE, ...current } : DEFAULT_STATE;

    const updatedState = {
      ...currentState,
      ...body,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : currentState.is_active
    };

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
