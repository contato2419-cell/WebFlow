import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PAGE_ID = '1299815346552748';
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || '';



function formatSmartTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const toBrDateStr = (dt) => dt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

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

const LOCAL_USER_CACHE = new Map();

const apiConversationsPlugin = () => ({
  name: 'api-conversations-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url.startsWith('/api/conversations')) return next();

      if (req.method === 'GET') {
        try {
          const parsedUrl = new URL(req.url, 'http://localhost');
          const after = parsedUrl.searchParams.get('after') || '';
          const limit = Math.min(parseInt(parsedUrl.searchParams.get('limit') || '50', 10), 100);

          let apiUrl = `https://graph.facebook.com/v21.0/${PAGE_ID}/conversations?platform=instagram&fields=id,updated_time,participants{id,username},messages.limit(10){id,message,created_time,from}&limit=${limit}&access_token=${PAGE_TOKEN}`;
          if (after) apiUrl += `&after=${encodeURIComponent(after)}`;

          const metaRes = await fetch(apiUrl);
          const data = await metaRes.json();

          if (!data.data || !Array.isArray(data.data)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: data.error || 'Nenhuma conversa retornada da Meta' }));
            return;
          }

          const uncachedIds = new Set();
          data.data.forEach(thread => {
            const other = thread.participants?.data?.find(p => p.username !== 'ygorweb') || thread.participants?.data?.[0];
            if (other && other.id && !LOCAL_USER_CACHE.has(other.id) && other.username !== 'vitrixapp' && other.username !== 'ygorweb') {
              uncachedIds.add(other.id);
            }
          });

          const idsToFetch = Array.from(uncachedIds).slice(0, 8);
          if (idsToFetch.length > 0) {
            await Promise.allSettled(idsToFetch.map(async (userId) => {
              try {
                const uRes = await fetch(`https://graph.facebook.com/v21.0/${userId}?fields=id,name,username,profile_pic&access_token=${PAGE_TOKEN}`);
                const uData = await uRes.json();
                if (uData && !uData.error) {
                  LOCAL_USER_CACHE.set(userId, { name: uData.name || null, profile_pic: uData.profile_pic || null });
                } else {
                  LOCAL_USER_CACHE.set(userId, { name: null, profile_pic: null });
                }
              } catch (e) {
                LOCAL_USER_CACHE.set(userId, { name: null, profile_pic: null });
              }
            }));
          }

          const conversations = data.data.map((thread) => {
            try {
              const other = thread.participants?.data?.find(p => p.username !== 'ygorweb') || thread.participants?.data?.[0];
              if (!other) return null;

              const isVitrix = other.username === 'vitrixapp' || other.username === 'vitrix';
              const isOwner = other.username === 'ygorweb';

              const cached = LOCAL_USER_CACHE.get(other.id) || {};
              const rawMessages = (thread.messages?.data || []).reverse();
              const contactName = isVitrix ? 'VitrixApp' : isOwner ? 'Ygor Souza' : (cached.name || other.username);
              const lastMsg = rawMessages.length > 0 ? rawMessages[rawMessages.length - 1] : null;

              let resolvedAvatar = null;
              if (isOwner || other.username === 'yygor02') resolvedAvatar = '/avatar_ygorweb.jpg';
              else if (isVitrix) resolvedAvatar = '/logo.jpg';
              else if (cached.profile_pic) resolvedAvatar = cached.profile_pic;
              else resolvedAvatar = null;

              return {
                id: thread.id,
                contactId: other.id,
                contactName,
                handle: '@' + other.username,
                channel: 'instagram',
                pinned: false,
                avatar: resolvedAvatar,
                botPaused: true,
                lastMessage: lastMsg?.message || 'Conversa iniciada no Instagram',
                lastTime: formatSmartTime(lastMsg?.created_time || thread.updated_time),
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

          const valid = conversations.filter(Boolean);
          valid.sort((a, b) => new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime());

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            count: valid.length,
            conversations: valid,
            hasMore: Boolean(data.paging?.next),
            nextCursor: data.paging?.cursors?.after || null
          }));
        } catch (err) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          try {
            const { recipientId, text } = JSON.parse(body);
            const postRes = await fetch(`https://graph.facebook.com/v21.0/${PAGE_ID}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text },
                access_token: PAGE_TOKEN
              })
            });
            const data = await postRes.json();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: !data.error, data }));
          } catch (e) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
        return;
      }

      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), apiConversationsPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
