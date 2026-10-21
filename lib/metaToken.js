// Chave da página para a Meta Graph API.
// O segredo META_PAGE_ACCESS_TOKEN é a chave do usuário do sistema (WebFlow Bot): ela lê mídias e
// comentários, mas o envio de DM (/me/messages) exige a chave da própria página. Aqui trocamos uma
// pela outra e guardamos em memória por 50 minutos.
const PAGE_ID = '1299815346552748';
const CACHE_MS = 50 * 60 * 1000;

let cachedPageToken = null;
let cachedAt = 0;

export async function getPageToken(env) {
  const systemToken = env.META_PAGE_ACCESS_TOKEN;
  if (cachedPageToken && Date.now() - cachedAt < CACHE_MS) return cachedPageToken;

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PAGE_ID}?fields=access_token&access_token=${systemToken}`);
    const data = await res.json();
    if (data.access_token) {
      cachedPageToken = data.access_token;
      cachedAt = Date.now();
      return cachedPageToken;
    }
  } catch (e) {}

  // Se o segredo já for uma chave de página, usa ele direto
  return systemToken;
}
