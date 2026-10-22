// Senha do painel: protege o envio do Live Chat, a leitura do Direct e o salvamento dos fluxos.
// O painel manda a senha no cabeçalho X-Panel-Key; ela é comparada com o segredo PANEL_KEY do Cloudflare Pages.
// Sem PANEL_KEY configurado, só registra um aviso e deixa passar (pra subir sem derrubar o painel).

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return new Uint8Array(digest);
}

async function sameSecret(a, b) {
  // Compara os hashes byte a byte, sem parar no primeiro diferente
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

// Devolve uma resposta 401 se a senha não bater, ou null se pode seguir
export async function requirePanelKey(request, env) {
  if (!env.PANEL_KEY) {
    console.warn('[WebFlow] PANEL_KEY não configurado: rota do painel sem senha.');
    return null;
  }
  const sent = request.headers.get('X-Panel-Key') || '';
  if (sent && (await sameSecret(sent, env.PANEL_KEY))) return null;
  return new Response(JSON.stringify({ success: false, error: 'PANEL_KEY_REQUIRED' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
