# 📡 Especificação de Webhooks: Meta Graph API v21.0 (Instagram & WhatsApp)

> Guia técnico para desenvolvedores integrarem o WebFlow com os Webhooks oficiais da Meta.

---

## 1. Verificação do Webhook (GET)

A Meta envia uma requisição `GET` com desafio criptográfico ao registrar o webhook:

```javascript
// Exemplo em Node.js / Cloudflare Worker
export function handleGetWebhook(req, env) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}
```

---

## 2. Evento de Comentário em Reel (POST)

Quando um usuário comenta a palavra-chave no Reel, a Meta dispara o seguinte payload JSON:

```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "17841400000000000",
      "time": 1728834000,
      "changes": [
        {
          "field": "comments",
          "value": {
            "id": "18042938491029384",
            "text": "EU QUERO",
            "from": {
              "id": "17841459876543210",
              "username": "lucas_empreendedor"
            },
            "media": {
              "id": "17923485719028374",
              "media_product_type": "REELS"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 3. Disparo da Resposta Pública (Spintax)

Para responder ao comentário de forma variada na publicação:

```http
POST https://graph.facebook.com/v21.0/{comment-id}/replies
Authorization: Bearer {PAGE_ACCESS_TOKEN}
Content-Type: application/json

{
  "message": "Fala @lucas_empreendedor! Acabei de te mandar lá no Direct 🚀"
}
```

---

## 4. Disparo da DM Privada com Micro-Compromisso (Botão)

Para abrir a conversa privada com o botão interativo em 2 etapas:

```http
POST https://graph.facebook.com/v21.0/me/messages
Authorization: Bearer {PAGE_ACCESS_TOKEN}
Content-Type: application/json

{
  "recipient": {
    "comment_id": "18042938491029384"
  },
  "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Confirmação de Acesso",
            "subtitle": "Clique abaixo para liberar o link exclusivo:",
            "buttons": [
              {
                "type": "postback",
                "title": "👉 Liberar Acesso Agora",
                "payload": "TRIGGER_FLOW_LINK_ACCESS"
              }
            ]
          }
        ]
      }
    }
  }
}
```

---

## 5. Evento de Postback (Clique no Botão pelo Usuário)

Quando o usuário clica no botão, a Meta envia:

```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "17841400000000000",
      "messaging": [
        {
          "sender": { "id": "17841459876543210" },
          "recipient": { "id": "17841400000000000" },
          "timestamp": 1728834015,
          "postback": {
            "title": "👉 Liberar Acesso Agora",
            "payload": "TRIGGER_FLOW_LINK_ACCESS"
          }
        }
      ]
    }
  ]
}
```

Ao receber este payload, o WebFlow envia com segurança o link final, com 100% de conformidade com os termos da Meta!
