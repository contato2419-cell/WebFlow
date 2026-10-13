import { createClient } from '@supabase/supabase-js';

// Obter configurações salvas ou usar defaults
export const getSupabaseConfig = () => {
  const savedUrl = localStorage.getItem('vitrixflow_supabase_url');
  const savedKey = localStorage.getItem('vitrixflow_supabase_key');
  return {
    url: savedUrl || '',
    key: savedKey || '',
    isConfigured: Boolean(savedUrl && savedKey)
  };
};

export const saveSupabaseConfig = (url, key) => {
  localStorage.setItem('vitrixflow_supabase_url', url);
  localStorage.setItem('vitrixflow_supabase_key', key);
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
