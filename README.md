# WebFlow ⚡ (ManyChat Open-Source & Gratuito)

<p align="center">
  <img src="https://img.shields.io/badge/Status-100%25%20Funcional-emerald?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Custo-R%24%200%2C00%20(Gratuito)-blue?style=for-the-badge" alt="Custo" />
  <img src="https://img.shields.io/badge/Meta_API-v21.0%20Compliant-purple?style=for-the-badge" alt="Meta API" />
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge" alt="Licença" />
</p>

> **A alternativa open-source, gratuita e auto-hospedável ao ManyChat com Proteção Anti-Bloqueio Nativa para Instagram e WhatsApp.**  
> Criado através de Engenharia Reversa Avançada (**REA - Reverse Engineer Anything**) da arquitetura interna do ManyChat.

---

## ⚡ Por que o WebFlow existe?

O ManyChat cobra mensalidades que escalam rapidamente de **$15/mês até mais de $145/mês** conforme sua lista de contatos cresce, além de prender seus leads em um banco de dados proprietário.

O **WebFlow** entrega toda a inteligência e arquitetura do ManyChat com:
- ✅ **100% Gratuito Para Sempre** (Sem mensalidades ou taxas ocultas).
- ✅ **Contatos Ilimitados** (Armazenados no seu próprio banco de dados PostgreSQL).
- ✅ **Escudo Anti-Bloqueio da Meta** (Spintax com 8 variações, Jitter randômico e Caixa de Confirmação em 2 etapas).
- ✅ **Visual Flow Builder DAG** (Editor visual de fluxos com arrastar e soltar e nós inteligentes).
- ✅ **Simulador de Celular Interativo** (Teste suas automações ao vivo antes de publicar).
- ✅ **CRM Unificado com Janela de 24 Horas** (Contagem regressiva visual do tempo limite da Meta).
- ✅ **Live Chat com Human Takeover** (Atendimento humano com pausa automática do robô em 1 clique).
- ✅ **Deploy em 1 Clique** (Cloudflare Pages com CDN global gratuita + Supabase gratuito).

---

## 📊 Comparativo: ManyChat Pro vs WebFlow

| Recurso | ManyChat Pro | WebFlow (Este Repositório) |
| :--- | :---: | :---: |
| **Preço Mensal** | $15 a $145+/mês | **R$ 0,00 (Grátis)** |
| **Limite de Contatos** | Bloqueado por faixa | **Ilimitado (Seu Banco)** |
| **Propriedade dos Dados** | Servidor ManyChat | **100% Seus (Supabase/PostgreSQL)** |
| **Growth Tool: Comentários em Reels** | Sim | **Sim (Com Spintax de 8 variações)** |
| **Humanização de Envio (Jitter)** | Básico | **Sim (8s a 35s aleatório)** |
| **Micro-Compromisso 2-Step** | Sim | **Sim (Caixa interativa nativa)** |
| **Atendimento Humano (Takeover)** | Sim | **Sim (Pausa do robô em 1 clique)** |
| **Código Fonte** | Fechado / Proprietário | **Open-Source (Código Aberto)** |

---

## 📚 Documentação Técnica de Engenharia Reversa (REA)

Toda a engenharia e arquitetura do projeto está documentada em detalhes para quem quiser estudar ou customizar:

- 🔬 [**01. Arquitetura Interna do ManyChat**](docs/REA_MANYCHAT_ARQUITETURA.md) — Engenharia reversa dos protocolos DAG, Dynamic Blocks v2 e orquestração de webhooks.
- 🛡️ [**02. Manual Anti-Bloqueio do Instagram**](docs/REA_ANTI_BLOQUEIO_INSTAGRAM.md) — Como evitar banimentos com Spintax, Jitter, 2-Step Button e Janela de 24 horas.
- 🚀 [**03. Guia de Auto-Hospedagem (Self-Hosting)**](docs/GUIA_AUTO_HOSPEDAGEM.md) — Passo a passo para colocar no ar na Cloudflare Pages e Supabase em 10 minutos.
- 📡 [**04. Especificação de Webhooks da Meta**](docs/WEBHOOK_META_INSTAGRAM.md) — Integração oficial com a Meta Graph API v21.0.

---

## 🚀 Como Iniciar em 3 Passos

### 1. Configure o Banco de Dados Gratuito (Supabase)
1. Crie uma conta no [Supabase](https://supabase.com).
2. Vá em **SQL Editor** e execute o script [`supabase/schema.sql`](supabase/schema.sql).
3. Copie o **Project URL** e a chave **anon public** no menu *Project Settings > API*.

### 2. Faça o Deploy na Cloudflare Pages
1. Faça um Fork ou Clone deste repositório.
2. Acesse a [Cloudflare Pages](https://dash.cloudflare.com) e conecte ao seu GitHub.
3. Configure o build com `npm run build` e diretório `dist`.
4. Pronto! Sua aplicação estará no ar com HTTPS gratuito e CDN global ultra-rápida.

### 3. Rodar Localmente no seu Computador
```bash
# Clone o repositório
git clone https://github.com/contato2419-cell/VitrixFlow.git webflow
cd webflow

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
Acesse: `http://localhost:3000`

---

## 🏗️ Estrutura do Projeto

```
├── docs/                           # Documentação REA completa
│   ├── REA_MANYCHAT_ARQUITETURA.md
│   ├── REA_ANTI_BLOQUEIO_INSTAGRAM.md
│   ├── GUIA_AUTO_HOSPEDAGEM.md
│   └── WEBHOOK_META_INSTAGRAM.md
├── supabase/                       # Scripts de Banco de Dados
│   ├── schema.sql                  # Criação de tabelas, índices e RLS
│   └── seed.sql                    # Modelos prontos de fluxos e growth tools
├── src/
│   ├── components/
│   │   ├── FlowCanvas.jsx          # Visual Flow Builder DAG com Bézier splines
│   │   ├── FlowSimulatorModal.jsx  # Simulador de celular em tempo real
│   │   ├── CommentsTriggerView.jsx # Gerenciador de Reels com Spintax
│   │   ├── ContactsView.jsx        # CRM unificado com contador de 24h
│   │   ├── LiveChatView.jsx        # Live Chat com Human Takeover
│   │   ├── ChannelsView.jsx        # Conexão de canais Meta / WhatsApp
│   │   └── SupabaseConfigView.jsx  # Configuração de credenciais do banco
│   ├── lib/
│   │   └── supabase.js             # Cliente oficial Supabase
│   ├── App.jsx                     # Shell principal com abas e navegação
│   └── index.css                   # Glassmorphism e tema escuro moderno
├── package.json
└── vite.config.js
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais informações. Qualquer pessoa pode usar, modificar, clonar e hospedar gratuitamente para si ou para clientes.
