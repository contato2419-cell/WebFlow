# VitrixFlow ⚡

> **Plataforma Aberta de Automação Omnichannel, Flow Builder DAG & Escudo Anti-Bloqueio (Alternativa Open Source e Gratuita ao ManyChat)**

O **VitrixFlow** foi desenvolvido através de engenharia reversa forense (**REA - Reverse Engineer Anything**) da arquitetura interna do ManyChat, projetado para lojistas, infoprodutores e empresas que necessitam de automações poderosas no **Instagram Direct, Comentários de Reels/Posts e WhatsApp Cloud API** sem custos abusivos de mensalidade.

---

## 🚀 Principais Funcionalidades

1. **Visual Flow Builder (Canvas Interativo DAG):**
   - Criação de automações visuais em tela infinita com nós arrastáveis (*Drag & Drop*).
   - Renderização fluida de conexões curvas em SVG (*Cubic Bézier Splines*).
   - Nós de **Mensagem**, **Caixinha Interativa Anti-Ban**, **Ação Atômica**, **Condição Lógica**, **Smart Delay** e **Randomizer A/B**.
   - Simulador de celular em tempo real com console de rastreamento de estados.

2. **Growth Tools & Proteção Anti-Bloqueio (Instagram Reels):**
   - Rotação dinâmica de respostas públicas no feed com **Spintax** de 8+ variações para quebrar algoritmos de detecção de spam da Meta.
   - Atraso humano inteligente (*Jitter* de 8s a 35s).
   - Arquitetura da **Caixinha de Micro-Compromisso**: nunca envia links externos na 1ª DM, forçando o usuário a interagir primeiro e garantindo a abertura legal da Janela de 24 horas da Meta.

3. **Audiência & CRM Unificado:**
   - Resolução cruzada de contatos entre canais (`ig_id`, `whatsapp_phone`, tags e campos customizados).
   - Monitoramento visual da **Janela de 24 Horas da Meta** com contagem regressiva por contato.

4. **Live Chat com Human Takeover:**
   - Caixa de entrada em tempo real para atendimento por atendente humano.
   - Interruptor de segurança: ao assumir o chat, o bot é pausado automaticamente para evitar colisões com o cliente.

5. **Infraestrutura em Nuvem Gratuita:**
   - **Banco de Dados:** PostgreSQL com Supabase (script SQL completo incluído).
   - **Hospedagem / Edge:** Cloudflare Pages (Deploy gratuito com latência zero).
   - **Controle de Versão:** Repositório no GitHub.

---

## 🛠️ Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build
```

---

## 🗄️ Configuração do Banco de Dados Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma organização/projeto gratuito.
2. Abra o menu **SQL Editor**.
3. Copie o script contido na aba **Configurações > Supabase & API** da plataforma (ou veja `supabase_schema.sql`) e clique em **Run**.
4. No VitrixFlow, cole sua **Project URL** e sua **Anon Public Key**.

---

## ⛅ Deploy na Cloudflare Pages

1. Acesse o painel da [Cloudflare](https://dash.cloudflare.com) com sua conta `ygorsouza24194@gmail.com`.
2. Vá em **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Selecione o repositório **VitrixFlow** da sua conta GitHub (`contato2419-cell`).
4. Configurações de Build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Clique em **Save and Deploy**. A cada novo `git push`, seu site será atualizado automaticamente!
