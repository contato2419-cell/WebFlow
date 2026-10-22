// Senha do painel: guardada só neste navegador e enviada no cabeçalho X-Panel-Key
// para as rotas protegidas (/api/state POST e /api/conversations).
const STORAGE_KEY = 'webflow_panel_key';
export const PANEL_KEY_EVENT = 'webflow:panel-key-required';

export const getPanelKey = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
};

export const savePanelKey = (key) => {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch (e) {}
};

export const panelFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), 'X-Panel-Key': getPanelKey() }
  });
  if (res.status === 401) {
    window.dispatchEvent(new Event(PANEL_KEY_EVENT));
  }
  return res;
};
