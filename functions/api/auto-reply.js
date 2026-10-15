// Cloudflare Pages Function: Motor de Comentários em Background (Meta Graph API v21.0)
// REA: Sincronizado com KV, Delay Humano Configurável, Anti-Duplicação e Zero Spam em DMs

const PAGE_ID = '1299815346552748';
const IG_USER_ID = '17841428469294913';

const PUBLIC_REPLIES = [
  "Acabei de te enviar no direct! Dá uma olhada 🚀",
  "Prontinho, já mandei lá nas suas mensagens ✨",
  "Dá uma olhadinha no seu direct, preparei tudo pra você! 📩",
  "Enviado com sucesso! Confere lá nas mensagens privadas 😉",
  "Te chamei no direct com todos os detalhes! 📲",
  "Chegou aí? Acabei de te mandar lá no chat 💥",
  "Informações enviadas! Confere a sua caixa de entrada 📥",
  "Mandei lá no direct, aproveita! 🎯"
];

const DEFAULT_STATE = {
  is_active: false,
  keyword: 'LISTA',
  delaySeconds: 15,
  antiBanJitter: 8,
  firstDmTitle: 'Me segue ai pra min te enviar ingrato(a) 🚀',
  firstDmSubtitle: 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar seu link 👇',
  buttonText: '✅ Já estou te seguindo!',
  finalLinkMessage: `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`
};

const CF_ACCOUNT_ID = 'be7db94a293732762035a5c23126dfae';
const CF_KV_ID = '6ffd8aa59e6a43ebaee8c87a7dd5ceb1';
const CF_TOKEN = '';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function matchesKeywordStrict(text, keyword) {
  if (!text || !keyword) return false;
  const cleanKw = keyword.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|\\s|[.,!?;])${cleanKw}(?:$|\\s|[.,!?;])`, 'i');
  return regex.test(text.toLowerCase());
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const PAGE_TOKEN = env.META_PAGE_ACCESS_TOKEN || 'EAAdPoo2JfNUBSrpDVADHAZBWNClCWCaLngml0bbTRS5dv0I8RX4jceRChZBi3pZBkg6xmr3MIfMQSTvvMMLJG8RP4lfn97w2M0xZAbdWFA9BETDkfzfjP3MMlO1eoIMAehygJsCdinlt1g2w1Vqx3lZBnb0ZBmHUti2plKKatMZClKW2SIKL3jGwXOwipcvk65pZCHHbK0dB';

  try {
    // 1. CARREGA ESTADO GLOBAL DO KV COM FALLBACK REST
    const stored = await getStoredState(env);
    const state = stored ? { ...DEFAULT_STATE, ...stored } : DEFAULT_STATE;

    const body = await request.json().catch(() => ({}));
    const isActive = body.is_active !== undefined ? Boolean(body.is_active) : state.is_active;

    // REGRA DE SEGURANÇA: Se estiver pausado no painel ou no KV, não processa nada!
    if (!isActive) {
      return new Response(JSON.stringify({ 
        success: true, 
        is_active: false,
        message: 'Automação pausada no painel. Nenhum envio efetuado.', 
        processedCount: 0 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const keyword = (body.keyword || state.keyword || 'LISTA').trim().toLowerCase();
    const baseDelaySeconds = Number(body.delaySeconds || state.delaySeconds) || 15;
    const jitterSeconds = Number(body.antiBanJitter || state.antiBanJitter) || 8;
    const firstDmTitle = body.firstDmTitle || state.firstDmTitle || 'Me segue ai pra min te enviar ingrato(a) 🚀';
    const firstDmSubtitle = body.firstDmSubtitle || state.firstDmSubtitle || 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar seu link 👇';
    const buttonText = body.buttonText || state.buttonText || '✅ Já estou te seguindo!';

    // 2. Busca o Reel mais recente
    const mediaRes = await fetch(`https://graph.facebook.com/v21.0/${IG_USER_ID}/media?fields=id,caption&limit=1&access_token=${PAGE_TOKEN}`);
    const mediaData = await mediaRes.json();
    
    if (!mediaData.data || mediaData.data.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Nenhuma mídia encontrada na conta' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const reel = mediaData.data[0];

    // 3. Busca comentários com o campo de replies para BLOQUEAR QUALQUER RESPOSTA DUPLICADA
    const commRes = await fetch(`https://graph.facebook.com/v21.0/${reel.id}/comments?fields=id,text,timestamp,from,username,replies{id,from}&limit=15&access_token=${PAGE_TOKEN}`);
    const commData = await commRes.json();
    const comments = commData.data || [];

    const processed = [];
    const skipped = [];
    let commentsProcessed = 0;

    for (const comment of comments) {
      if (commentsProcessed >= 2) break; // Máximo de 2 comentários por ciclo para evitar qualquer risco com a Meta

      const text = (comment.text || '').trim();
      const user = (comment.username || comment.from?.username || '').toLowerCase();

      if (!user || user === 'ygorweb') continue;

      // REGRA DE SEGURANÇA: Casamento estrito por palavra inteira
      if (matchesKeywordStrict(text, keyword)) {
        const replies = comment.replies?.data || [];
        const alreadyHasYgorReply = replies.some(r => r.from?.username === 'ygorweb');

        // REGRA DE OURO 1: ANTI-DUPLICAÇÃO ABSOLUTA
        // Se a conta ygorweb já respondeu este comentário, PULA IMEDIATAMENTE!
        if (alreadyHasYgorReply) {
          skipped.push({ commentId: comment.id, user, reason: 'already_has_public_reply' });
          continue;
        }

        // REGRA DE OURO 2: DELAY HUMANO ANTI-BAN
        // Calcula a idade do comentário em segundos. Se for mais novo que o delay configurado, NÃO RESPONDE AINDA!
        const commentAgeSeconds = (Date.now() - new Date(comment.timestamp).getTime()) / 1000;
        const targetDelay = baseDelaySeconds + Math.floor(Math.random() * jitterSeconds);

        if (commentAgeSeconds < targetDelay) {
          skipped.push({ 
            commentId: comment.id, 
            user, 
            ageSeconds: Math.round(commentAgeSeconds), 
            targetDelay, 
            reason: 'waiting_human_delay' 
          });
          continue; // Deixa para responder no próximo ciclo quando o delay for atingido!
        }

        let dmStatus = 'skipped';

        // 1ª DM: Envia a Caixinha Interativa (Generic Template) com o botão nativo da Meta
        const caixinhaPayload = {
          recipient: { comment_id: comment.id },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [
                  {
                    title: firstDmTitle,
                    subtitle: firstDmSubtitle,
                    buttons: [
                      {
                        type: "postback",
                        title: buttonText,
                        payload: "FOLLOW_CONFIRMED"
                      }
                    ]
                  }
                ]
              }
            }
          }
        };

        try {
          const dmRes = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caixinhaPayload)
          });
          const dmJson = await dmRes.json();
          if (dmJson.message_id) {
            dmStatus = 'success_interactive_card';
          } else {
            // Fallback de texto com Quick Reply
            const fallbackRes = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { comment_id: comment.id },
                message: {
                  text: `${firstDmTitle}\n\n${firstDmSubtitle}`,
                  quick_replies: [
                    {
                      content_type: "text",
                      title: buttonText,
                      payload: "FOLLOW_CONFIRMED"
                    }
                  ]
                }
              })
            });
            const fallbackJson = await fallbackRes.json();
            dmStatus = fallbackJson.message_id ? 'success_quick_reply' : 'failed';
          }
        } catch (e) {
          dmStatus = 'error_network';
        }

        // Delay humano natural de 2 segundos entre a DM e o comentário público
        await sleep(2000);

        // Resposta pública humanizada no comentário do Reels
        let pubStatus = 'skipped';
        try {
          const replyText = PUBLIC_REPLIES[Math.floor(Math.random() * PUBLIC_REPLIES.length)];
          const pubRes = await fetch(`https://graph.facebook.com/v21.0/${comment.id}/replies?access_token=${PAGE_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: replyText })
          });
          const pubJson = await pubRes.json();
          if (pubJson.id) pubStatus = 'success';
        } catch (e) {
          pubStatus = 'error';
        }

        processed.push({
          commentId: comment.id,
          user,
          text,
          dmStatus,
          pubStatus
        });

        commentsProcessed++;
        await sleep(3000); // Espaçamento generoso entre leads
      }
    }

    return new Response(JSON.stringify({
      success: true,
      reelId: reel.id,
      processedCount: processed.length,
      processed,
      skipped
    }), {
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
