-- =========================================================================
-- SCHEMA COMPLETO DO WEBFLOW PARA SUPABASE (POSTGRESQL)
-- Alternativa Open-Source Gratuita ao ManyChat com Anti-Bloqueio
-- =========================================================================

-- 1. Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Workspaces (Ambientes Individuais)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Canais Conectados (Meta Instagram & WhatsApp Cloud API)
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('instagram', 'whatsapp', 'messenger')),
    account_name TEXT,
    external_id TEXT, -- Page ID ou Phone Number ID
    access_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Contatos Unificados (Subscribers / CRM)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT,
    handle TEXT,
    phone TEXT,
    email TEXT,
    channel TEXT NOT NULL, -- 'instagram' ou 'whatsapp'
    psid TEXT,
    ig_id TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_bot_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Fluxos (Flows DAG)
CREATE TABLE IF NOT EXISTS flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    channel TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    nodes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Growth Tools (Comentários em Reels com Spintax)
CREATE TABLE IF NOT EXISTS growth_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    keyword TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'instagram',
    delay_seconds INT DEFAULT 15,
    public_replies JSONB NOT NULL DEFAULT '[]'::jsonb,
    flow_id UUID REFERENCES flows(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    total_triggered INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Mensagens do Live Chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'agent')),
    message_text TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_contacts_handle ON contacts(handle);
CREATE INDEX IF NOT EXISTS idx_contacts_workspace ON contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_growth_tools_keyword ON growth_tools(keyword);
CREATE INDEX IF NOT EXISTS idx_chat_messages_contact ON chat_messages(contact_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas Permissivas para Usuários Autenticados
CREATE POLICY "Users can manage their own workspaces" ON workspaces FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage channels in their workspaces" ON channels FOR ALL USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage contacts in their workspaces" ON contacts FOR ALL USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage flows in their workspaces" ON flows FOR ALL USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage growth_tools in their workspaces" ON growth_tools FOR ALL USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage chat_messages" ON chat_messages FOR ALL USING (contact_id IN (SELECT id FROM contacts WHERE workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid())));
