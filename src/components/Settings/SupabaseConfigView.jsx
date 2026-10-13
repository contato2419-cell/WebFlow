import React, { useState } from 'react';
import { Database, Check, Copy, Key, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';

const SUPABASE_SCHEMA_SQL = `-- SCHEMA COMPLETO DO WEBFLOW PARA SUPABASE (POSTGRESQL)
-- Cole e execute este script no menu 'SQL Editor' do seu painel Supabase

-- 1. Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Workspaces (Ambientes dos Usuários)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Canais Conectados (Meta Instagram & WhatsApp)
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'instagram', 'whatsapp', 'messenger'
    account_name TEXT,
    external_id TEXT, -- Page ID ou Phone Number ID
    access_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Contatos Unificados (Subscribers)
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

-- 6. Tabela de Gatilhos de Comentários (Growth Tools)
CREATE TABLE IF NOT EXISTS growth_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    keyword TEXT NOT NULL,
    channel TEXT NOT NULL,
    delay_seconds INT DEFAULT 15,
    public_replies JSONB NOT NULL DEFAULT '[]'::jsonb,
    flow_id UUID REFERENCES flows(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Mensagens do Live Chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user', 'bot', 'agent'
    message_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
`;

export const SupabaseConfigView = () => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseConfig(url.trim(), key.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-emerald-400" />
            Configuração do Supabase (Banco de Dados PostgreSQL)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conecte seu projeto gratuito no Supabase para persistência de dados em nuvem ou utilize o banco local.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Conexão */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white font-heading">Credenciais da API Supabase</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentConfig.isConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {currentConfig.isConfigured ? 'Conectado' : 'Modo Local Ativo'}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Project URL (URL do Projeto Supabase)</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Anon / Public API Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Server className="w-4 h-4" />}
              <span>{savedSuccess ? 'Configurações Salvas com Sucesso!' : 'Salvar Credenciais do Supabase'}</span>
            </button>
          </form>
        </div>

        {/* Script SQL Pronto para Copiar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white font-heading">Script SQL para o Supabase Editor</h2>
              <button
                onClick={copySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado para a Área de Transferência!' : 'Copiar SQL Completo'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Abra seu painel do Supabase, clique em <strong>SQL Editor</strong>, cole este código e clique em <strong>Run</strong> para criar automaticamente todas as tabelas.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-slate-300 h-64 overflow-y-auto leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
