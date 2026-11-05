// Roteamento dos fluxos do Instagram: palavra-chave → gatilho → bloco de seguidor → mensagem final.
// Usado pelo auto-reply (comentários) e pelo webhook (clique no botão), pra cada palavra-chave
// levar à sua própria mensagem em vez de cair no primeiro fluxo (LISTA).

export function activeInstagramFlow(state) {
  const flows = Array.isArray(state?.flows) ? state.flows : [];
  return flows.find(f => f.channel === 'instagram' && f.active) || null;
}

// Palavra geral do painel + as palavras de todos os gatilhos do fluxo ativo (ex.: S1)
export function allKeywords(state) {
  const flow = activeInstagramFlow(state);
  const triggerKeywords = (flow?.nodes || [])
    .filter(n => n.type === 'trigger' && n.data?.keyword)
    .map(n => n.data.keyword);
  return [state?.keyword, ...triggerKeywords].filter(Boolean).join(',');
}

// Destino do botão do bloco de seguidor. O editor às vezes grava a seta só na saída geral
// do bloco ('output') e deixa button.targetNode vazio, então a seta também vale como destino.
export function gateTargetNodeId(flow, gate) {
  const btn = gate?.data?.buttons?.[0];
  if (btn?.targetNode) return btn.targetNode;
  const edges = (flow?.edges || []).filter(e => e.from === gate?.id);
  const edge = edges.find(e => btn && e.port === btn.id) || edges.find(e => !e.port || e.port === 'output') || edges[0];
  return edge?.to || '';
}

// Gatilho que bate com o texto e o bloco de seguidor ligado a ele
export function resolveBranch(state, text, matchesKeyword) {
  const flow = activeInstagramFlow(state);
  if (!flow || !Array.isArray(flow.nodes)) return null;
  const trigger = flow.nodes.find(n => n.type === 'trigger' && matchesKeyword(text, n.data?.keyword));
  if (!trigger) return null;
  const edge = (flow.edges || []).find(e => e.from === trigger.id);
  const gate = edge ? flow.nodes.find(n => n.id === edge.to && n.type === 'follower_gate') : null;
  if (!gate) return null;
  return { flow, trigger, gate, targetNodeId: gateTargetNodeId(flow, gate) };
}

// Caixinha só pra quem a Meta confirmou que segue
export function receiveCard(branch) {
  const data = branch?.gate?.data || {};
  return {
    title: data.receiveTitle || 'Tá aqui o que você pediu 👇',
    text: data.receiveText || 'Clica no botão abaixo pra receber',
    button: data.receiveButton || 'Receber',
    payload: branch?.targetNodeId ? `RECEIVE:${branch.targetNodeId}` : 'RECEIVE'
  };
}

// Bloco de seguidor que leva a uma mensagem final
export function gateForTarget(state, targetNodeId) {
  const flow = activeInstagramFlow(state);
  const gates = (flow?.nodes || []).filter(n => n.type === 'follower_gate');
  return gates.find(g => gateTargetNodeId(flow, g) === targetNodeId) || gates[0] || null;
}

// Caixinha de seguir: vai pra quem não segue e pra quem a Meta não informa
export function followCard(branch, state) {
  const data = branch?.gate?.data || {};
  return {
    title: data.title || state?.firstDmTitle || 'Só me seguir e clicar no botão pra min não tomar ban',
    text: data.text || data.subtitle || state?.firstDmSubtitle || state?.firstDmText || 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar o link 👇',
    button: data.buttons?.[0]?.title || state?.buttonText || '✅ Já estou seguindo',
    payload: branch?.targetNodeId ? `FOLLOW_CONFIRMED:${branch.targetNodeId}` : 'FOLLOW_CONFIRMED'
  };
}

// true/false quando a Meta informa; null quando ela não informa (erro 230: a pessoa nunca interagiu)
export async function followStatus(userId, token) {
  if (!userId) return null;
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${userId}?fields=is_user_follow_business&access_token=${token}`);
    const data = await res.json();
    return typeof data.is_user_follow_business === 'boolean' ? data.is_user_follow_business : null;
  } catch (e) {
    return null;
  }
}

export async function firstCard(branch, state, userId, token) {
  // Trava anti-ban (Exigir que siga desligado): todo mundo recebe só o Receber
  if (branch?.gate?.data?.requireFollow === false) return receiveCard(branch);
  return (await followStatus(userId, token)) === true ? receiveCard(branch) : followCard(branch, state);
}
