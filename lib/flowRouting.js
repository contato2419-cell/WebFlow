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
