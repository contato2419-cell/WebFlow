// Cloudflare Pages Function: Sincronização em Tempo Real da Caixa de Entrada da Meta (Instagram Direct)
// REA: Paginação Dinâmica, Cache em Memória Anti-Rate-Limit, Horários Inteligentes (Hoje/Ontem/Data), Fotos Reais Garantidas

const PAGE_ID = '1299815346552748';



// Formatação contextual idêntica ao Instagram Direct / WhatsApp (Hoje: 11:20 | Ontem: Ontem 22:45 | Outro dia: 14/10 21:17)
function formatSmartTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';

  const now = new Date();

  const toBrDateStr = (dt) => {
    return dt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  };

  const timeStr = d.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit'
  });

  const msgDateStr = toBrDateStr(d);
  const todayDateStr = toBrDateStr(now);

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayDateStr = toBrDateStr(yesterday);

  if (msgDateStr === todayDateStr) {
    return timeStr;
  } else if (msgDateStr === yesterdayDateStr) {
    return `Ontem ${timeStr}`;
  } else {
    const dayMonth = d.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit'
    });
    return `${dayMonth} ${timeStr}`;
  }
}

// Cache persistente em memória para evitar Rate Limit (#4 Application request limit reached)
const USER_CACHE = new Map();

export async function onRequestGet(context) {
  const { request, env } = context;
  const PAGE_TOKEN = env.META_PAGE_ACCESS_TOKEN;

  try {
    const reqUrl = new URL(request.url);
    const after = reqUrl.searchParams.get('after') || '';
    const limit = Math.min(parseInt(reqUrl.searchParams.get('limit') || '50', 10), 100);

    let apiUrl = `https://graph.facebook.com/v21.0/${PAGE_ID}/conversations?platform=instagram&fields=id,updated_time,participants{id,username},messages.limit(10){id,message,created_time,from}&limit=${limit}&access_token=${PAGE_TOKEN}`;
    if (after) {
      apiUrl += `&after=${encodeURIComponent(after)}`;
    }

    const res = await fetch(apiUrl);
    const data = await res.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: data.error || 'Nenhuma conversa retornada da Meta' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Identifica usuários únicos que ainda não estão em cache para buscar de forma controlada
    const uncachedIds = new Set();
    data.data.forEach(thread => {
      const other = thread.participants?.data?.find(p => p.username !== 'ygorweb') || thread.participants?.data?.[0];
      if (other && other.id && !USER_CACHE.has(other.id) && other.username !== 'vitrixapp' && other.username !== 'ygorweb') {
        uncachedIds.add(other.id);
      }
    });

    // Busca apenas usuários novos (máximo 8 por requisição para jamais estourar rate limit)
    const idsToFetch = Array.from(uncachedIds).slice(0, 8);
    if (idsToFetch.length > 0) {
      await Promise.allSettled(idsToFetch.map(async (userId) => {
        try {
          const uRes = await fetch(`https://graph.facebook.com/v21.0/${userId}?fields=id,name,username,profile_pic&access_token=${PAGE_TOKEN}`);
          const uData = await uRes.json();
          if (uData && !uData.error) {
            USER_CACHE.set(userId, {
              name: uData.name || null,
              profile_pic: uData.profile_pic || null
            });
          } else {
            // Em caso de erro de consentimento (#230) ou rate limit (#4), salva fallback no cache
            USER_CACHE.set(userId, { name: null, profile_pic: null });
          }
        } catch (e) {
          USER_CACHE.set(userId, { name: null, profile_pic: null });
        }
      }));
    }

    const conversations = data.data.map((thread) => {
      try {
        const otherSender = thread.participants?.data?.find(p => p.username !== 'ygorweb') || thread.participants?.data?.[0];
        if (!otherSender) return null;

        const isVitrix = otherSender.username === 'vitrixapp' || otherSender.username === 'vitrix';
        const isOwner = otherSender.username === 'ygorweb';

        const cached = USER_CACHE.get(otherSender.id) || {};
        const rawMessages = (thread.messages?.data || []).reverse();
        
        const contactName = isVitrix 
          ? 'VitrixApp' 
          : isOwner 
            ? 'Ygor Souza' 
            : (cached.name || otherSender.username);
            
        const lastMsg = rawMessages.length > 0 ? rawMessages[rawMessages.length - 1] : null;
        const lastTime = formatSmartTime(lastMsg?.created_time || thread.updated_time);

        // Foto com resolução oficial e sem fotos falsas de IA/Stock:
        // 1. Owner (@ygorweb e @yygor02) -> foto oficial local (/avatar_ygorweb.jpg)
        // 2. VitrixApp -> logo oficial (/logo.jpg)
        // 3. Meta profile_pic real da CDN do Instagram (se disponível)
        // 4. Se não disponível na Meta -> null (frontend exibe o monograma nativo do ManyChat)
        let resolvedAvatar = null;
        if (isOwner || otherSender.username === 'yygor02') {
          resolvedAvatar = '/avatar_ygorweb.jpg';
        } else if (isVitrix) {
          resolvedAvatar = '/logo.jpg';
        } else if (cached.profile_pic) {
          resolvedAvatar = cached.profile_pic;
        } else {
          resolvedAvatar = null;
        }

        return {
          id: thread.id,
          contactId: otherSender.id,
          contactName: contactName,
          handle: '@' + otherSender.username,
          channel: 'instagram',
          pinned: false,
          avatar: resolvedAvatar,
          botPaused: true,
          lastMessage: lastMsg?.message || 'Conversa iniciada no Instagram',
          lastTime: lastTime,
          updatedTime: thread.updated_time,
          unread: lastMsg?.from?.username !== 'ygorweb',
          messages: rawMessages.map(m => ({
            id: m.id,
            sender: m.from?.username === 'ygorweb' ? 'agent' : 'user',
            text: m.message || '',
            time: formatSmartTime(m.created_time),
            timestamp: m.created_time
          }))
        };
      } catch (e) {
        return null;
      }
    });

    const validConversations = conversations.filter(Boolean);
    validConversations.sort((a, b) => new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime());

    return new Response(JSON.stringify({ 
      success: true, 
      count: validConversations.length, 
      conversations: validConversations,
      hasMore: Boolean(data.paging?.next),
      nextCursor: data.paging?.cursors?.after || null
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Envio ao vivo de mensagem do atendente humano diretamente para o Instagram do seguidor
export async function onRequestPost(context) {
  const { request, env } = context;
  const PAGE_TOKEN = env.META_PAGE_ACCESS_TOKEN;

  try {
    const { recipientId, text } = await request.json();
    if (!recipientId || !text) {
      return new Response(JSON.stringify({ success: false, error: 'recipientId e text são obrigatórios' }), { status: 400 });
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/${PAGE_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: text },
        access_token: PAGE_TOKEN
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify({ success: !data.error, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
