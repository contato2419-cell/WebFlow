import { createClient } from '@supabase/supabase-js';

// As credenciais são carregadas estritamente de variáveis de ambiente seguras (Vite)
// ou salvas de forma privada no localStorage do navegador do usuário.
// NENHUMA CHAVE DE SERVIDOR OU CREDENCIAL PRIVADA É EXPOSTA NO BUNDLE PÚBLICO.
const ENV_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getSupabaseConfig = () => {
  const savedUrl = localStorage.getItem('webflow_supabase_url') || localStorage.getItem('vitrixflow_supabase_url');
  const savedKey = localStorage.getItem('webflow_supabase_key') || localStorage.getItem('vitrixflow_supabase_key');
  
  const finalUrl = savedUrl || ENV_URL;
  const finalKey = savedKey || ENV_KEY;

  return {
    url: finalUrl,
    key: finalKey,
    isConfigured: Boolean(finalUrl && finalKey)
  };
};

export const saveSupabaseConfig = (url, key) => {
  localStorage.setItem('webflow_supabase_url', url);
  localStorage.setItem('webflow_supabase_key', key);
};

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.warn('Erro ao inicializar cliente Supabase:', e);
    }
  }
  return null;
};

export const supabase = getSupabaseClient();
