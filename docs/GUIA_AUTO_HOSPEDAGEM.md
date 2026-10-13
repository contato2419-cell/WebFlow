# 🚀 Guia Completo de Auto-Hospedagem (Self-Hosting) do WebFlow

> **Crie seu próprio ManyChat 100% gratuito em menos de 10 minutos.**  
> *Sem mensalidades, sem limites de contatos e com hospedagem global gratuita.*

---

## 📋 Pré-Requisitos Gratuitos

Para rodar seu próprio WebFlow, você só precisa de contas gratuitas nas seguintes plataformas:
1. **GitHub** (para clonar ou bifurcar o repositório).
2. **Cloudflare** (para hospedagem do Frontend global via Cloudflare Pages — Gratuito).
3. **Supabase** (para o banco de dados PostgreSQL e Autenticação — Gratuito).
4. **Meta for Developers** (para conectar o Instagram Business / WhatsApp Cloud API).

---

## 🛠️ Passo 1: Configurar o Banco de Dados no Supabase (2 minutos)

1. Acesse [supabase.com](https://supabase.com) e crie sua conta gratuita.
2. Crie um novo projeto (ex: `webflow-db`) na região mais próxima dos seus clientes (ex: `sa-east-1` - São Paulo para Brasil).
3. No menu lateral, clique em **SQL Editor**.
4. Abra o arquivo [`supabase/schema.sql`](../supabase/schema.sql) deste repositório, copie todo o conteúdo e cole no SQL Editor do Supabase.
5. Clique em **Run** (Executar). Pronto! Todas as tabelas (`workspaces`, `flows`, `growth_tools`, `contacts`, `chat_messages`) e políticas de segurança RLS estarão criadas!
6. No menu lateral do Supabase, vá em **Project Settings > API**:
   - Copie o **Project URL** (ex: `https://xyzcompany.supabase.co`).
   - Copie a chave **anon / public** (ex: `eyJhbGciOi...`).

---

## 🌐 Passo 2: Hospedar o Frontend na Cloudflare Pages (3 minutos)

### Opção A: Deploy Automático via GitHub (Recomendado)
1. Faça um Fork deste repositório no seu GitHub.
2. Acesse o painel da [Cloudflare](https://dash.cloudflare.com).
3. Vá em **Workers & Pages > Create application > Pages > Connect to Git**.
4. Selecione o repositório `WebFlow` do seu GitHub.
5. Configure o build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variables:**
     - `VITE_SUPABASE_URL`: sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY`: sua chave anon do Supabase
6. Clique em **Save and Deploy**. Em 40 segundos seu sistema estará no ar com HTTPS gratuito e CDN global ultra-rápida!

### Opção B: Deploy via Linha de Comando (Wrangler)
Se você tiver o Node.js instalado na sua máquina:
```bash
# Clone o repositório
git clone https://github.com/contato2419-cell/VitrixFlow.git webflow
cd webflow

# Instale as dependências
npm install

# Compile o projeto
npm run build

# Faça o deploy direto na Cloudflare
npx wrangler pages deploy dist --project-name webflow-app
```

---

## 💻 Passo 3: Executar Localmente na sua Máquina (Desenvolvimento)

Se você preferir rodar no seu computador:
```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de variáveis de ambiente
cp .env.example .env

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```
Acesse no seu navegador: `http://localhost:3000`

---

## 📱 Passo 4: Conectar o Instagram Business (Meta Developers)

1. Acesse [developers.facebook.com](https://developers.facebook.com) e crie um Aplicativo do tipo **Empresa / Outro**.
2. Adicione os produtos **Instagram Graph API** e **Webhooks**.
3. Em Webhooks, selecione o objeto **Instagram** e assine os eventos:
   - `comments` (para monitorar palavras-chave nos Reels).
   - `messages` (para receber e responder DMs).
   - `messaging_postbacks` (para capturar os cliques nos botões de confirmação).
4. No WebFlow, acesse a aba **Canais**, cole seu Token da Meta e ID da Página do Instagram.
5. Pronto! Agora você pode criar seus fluxos visuais, programar o Spintax nos comentários e capturar leads no automático sem pagar nada para o ManyChat!
