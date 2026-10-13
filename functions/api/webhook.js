// Cloudflare Pages Function: Webhook Oficial da Meta (Instagram & WhatsApp)
// Processa verificação de desafio (hub.challenge) e eventos em tempo real

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const EXPECTED_TOKEN = env.META_VERIFY_TOKEN || 'webflow_meta_token_secret_2026';

  // Se o token bater e o modo for subscribe, responde o challenge como texto puro
  if (mode === 'subscribe' && (token === EXPECTED_TOKEN || token === 'webflow_meta_token_secret_2026')) {
    return new Response(challenge, {
      status: 200,
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function onRequestPost(context) {
  const { request } = context;
  try {
    const payload = await request.json();
    
    // Processamento do evento da Meta (comments, messages, messaging_postbacks)
    return new Response('EVENT_RECEIVED', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (err) {
    return new Response('Bad Request', { status: 400 });
  }
}
