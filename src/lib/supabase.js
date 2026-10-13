import { createClient } from '@supabase/supabase-js';

// Configurações padrão do projeto oficial WebFlow
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rezyrhydnsvtmyqxefzb.supabase.co';
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlenlyaHlkbnN2dG15cXhlZnpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTgwNTQsImV4cCI6MjEwNzQ5NDA1NH0.d6j1cBkQCaQr04F3GfLL_22vxkVP6vzGYGxq49tpSkc';

export const getSupabaseConfig = () => {
  const savedUrl = localStorage.getItem('webflow_supabase_url') || localStorage.getItem('vitrixflow_supabase_url');
  const savedKey = localStorage.getItem('webflow_supabase_key') || localStorage.getItem('vitrixflow_supabase_key');
  
  const finalUrl = savedUrl || DEFAULT_URL;
  const finalKey = savedKey || DEFAULT_KEY;

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
