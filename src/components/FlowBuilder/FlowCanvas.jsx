import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move,
  MessageSquare,
  ShieldAlert,
  Zap,
  GitBranch,
  Clock,
  Shuffle,
  Bot,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowCanvas = ({ onOpenSimulator }) => {
  const { flows, selectedFlowId, updateFlow } = useApp();
  const currentFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  if (!currentFlow) return null;

  // Handlers de Pan
  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.tagName === 'svg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggingNodeId) {
      const updatedNodes = currentFlow.nodes.map(node => {
        if (node.id === draggingNodeId) {
          return {
            ...node,
            position: {
              x: Math.round((e.clientX - pan.x - dragOffset.x) / zoom),
              y: Math.round((e.clientY - pan.y - dragOffset.y) / zoom)
            }
          };
        }
        return node;
      });
      updateFlow(currentFlow.id, { nodes: updatedNodes });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Arrastar nó específico
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const node = currentFlow.nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({
        x: (e.clientX - pan.x) - (node.position.x * zoom),
        y: (e.clientY - pan.y) - (node.position.y * zoom)
      });
    }
  };

  // Adicionar novo nó
  const handleAddNode = (type) => {
    const newId = 'node_' + Date.now();
    let newNode = {
      id: newId,
      type,
      position: { x: Math.round((-pan.x + 300) / zoom), y: Math.round((-pan.y + 250) / zoom) },
      data: {}
    };

    if (type === 'message') {
      newNode.title = 'Nova Mensagem';
      newNode.data = { text: 'Olá {{first_name}}! Como posso te ajudar?', buttons: [] };
    } else if (type === 'anti_ban_box') {
      newNode.title = '🛡️ Caixinha Anti-Bloqueio';
      newNode.type = 'message';
      newNode.data = {
        text: 'Oi {{first_name}}! Vi que você comentou querendo o material. Para eu liberar agora, toque no botão abaixo 👇',
        buttons: [{ id: 'b_' + Date.now(), title: '🚀 Liberar Acesso Agora', targetNode: '' }]
      };
    } else if (type === 'action') {
      newNode.title = 'Ação Automática';
      newNode.data = { actions: [{ type: 'add_tag', value: 'novo_lead' }] };
    } else if (type === 'condition') {
      newNode.title = 'Condição Lógica';
      newNode.data = { criteria: 'tag_equals', value: 'cliente_vip' };
    } else if (type === 'delay') {
      newNode.title = 'Atraso Inteligente';
      newNode.data = { delaySeconds: 15, jitter: true };
    }

    const updatedNodes = [...currentFlow.nodes, newNode];
    updateFlow(currentFlow.id, { nodes: updatedNodes });
    setSelectedNodeId(newId);
  };

  // Remover nó
  const handleDeleteNode = (nodeId) => {
    const updatedNodes = currentFlow.nodes.filter(n => n.id !== nodeId);
    const updatedEdges = currentFlow.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
    updateFlow(currentFlow.id, { nodes: updatedNodes, edges: updatedEdges });
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const selectedNode = currentFlow.nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex select-none">
      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 h-full canvas-grid relative cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Barra Superior Flutuante: Título do Fluxo & Ferramentas */}
        <div className="absolute top-5 left-6 z-20 flex items-center gap-3">
          <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <div>
              <h2 className="text-xs font-bold text-white font-heading">{currentFlow.name}</h2>
              <p className="text-[10px] text-slate-400">
                Canal: <span className="capitalize text-indigo-400 font-medium">{currentFlow.channel}</span> • {currentFlow.nodes.length} nós no DAG
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSimulator}
            className="glass-panel hover:bg-indigo-600 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-white flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Simular Fluxo</span>
          </button>
        </div>

        {/* Toolbar de Inserção de Nós */}
        <div className="absolute top-5 right-6 z-20 flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => handleAddNode('message')}
            title="Adicionar Mensagem"
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mensagem</span>
          </button>

          <button
            onClick={() => handleAddNode('anti_ban_box')}
            title="Adicionar Caixinha Anti-Bloqueio (2 Passos)"
            className="px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Caixinha Anti-Ban</span>
          </button>

          <button
            onClick={() => handleAddNode('action')}
            title="Adicionar Ação"
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ação</span>
          </button>

          <button
            onClick={() => handleAddNode('condition')}
            title="Adicionar Condição"
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Condição</span>
          </button>

          <button
            onClick={() => handleAddNode('delay')}
            title="Adicionar Atraso / Delay"
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Smart Delay</span>
          </button>
        </div>

        {/* Controles de Zoom Flutuantes no Rodapé */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1 glass-panel p-1 rounded-xl shadow-xl text-slate-300">
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="p-2 hover:bg-slate-800 rounded-lg">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium px-2">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.8, z + 0.1))} className="p-2 hover:bg-slate-800 rounded-lg">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 hover:bg-slate-800 rounded-lg" title="Resetar View">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG de Arestas / Conectores de Bézier */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {currentFlow.edges.map((edge, idx) => {
            const sourceNode = currentFlow.nodes.find(n => n.id === edge.from);
            const targetNode = currentFlow.nodes.find(n => n.id === edge.to);
            if (!sourceNode || !targetNode) return null;

            // Coordenadas das portas
            const sx = sourceNode.position.x + 280; // largura aproximada do nó
            const sy = sourceNode.position.y + 70;
            const tx = targetNode.position.x;
            const ty = targetNode.position.y + 70;

            const dx = Math.max(60, Math.abs(tx - sx) * 0.5);
            const pathData = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;

            return (
              <g key={idx}>
                <path
                  d={pathData}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="6"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#edgeGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  className="animate-pulse-subtle"
                />
                <circle cx={tx} cy={ty} r="4" fill="#10b981" />
              </g>
            );
          })}
        </svg>

        {/* Nós do Grafo no Canvas */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
        >
          {currentFlow.nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                style={{
                  transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                  width: '280px'
                }}
                className={`absolute pointer-events-auto rounded-2xl bg-slate-900 border transition-shadow cursor-move shadow-2xl ${
                  isSelected 
                    ? 'border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-500/30' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Handle Esquerdo (Input) */}
                <div className="node-handle-in" title="Porta de Entrada"></div>

                {/* Cabeçalho do Nó */}
                <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {node.type === 'trigger' && <Zap className="w-4 h-4 text-amber-400" />}
                    {node.type === 'message' && <MessageSquare className="w-4 h-4 text-indigo-400" />}
                    {node.type === 'action' && <Zap className="w-4 h-4 text-emerald-400" />}
                    {node.type === 'condition' && <GitBranch className="w-4 h-4 text-cyan-400" />}
                    {node.type === 'delay' && <Clock className="w-4 h-4 text-purple-400" />}
                    <span className="text-xs font-semibold text-white truncate max-w-[170px]">{node.title || node.type}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Conteúdo do Nó */}
                <div className="p-3.5 text-xs text-slate-300 space-y-2">
                  {node.type === 'trigger' && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-400">Gatilho por palavra:</p>
                      <span className="font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                        {node.data?.keyword || 'QUALQUER'}
                      </span>
                    </div>
                  )}

                  {node.type === 'message' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-300 line-clamp-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 font-sans">
                        {node.data?.text || 'Sem texto'}
                      </p>

                      {node.data?.buttons && node.data.buttons.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {node.data.buttons.map((btn, bidx) => (
                            <div key={bidx} className="relative flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-[11px] text-indigo-200 font-medium">
                              <span>{btn.title}</span>
                              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === 'action' && (
                    <div className="space-y-1">
                      {node.data?.actions?.map((act, aidx) => (
                        <span key={aidx} className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mr-1 mb-1">
                          +{act.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {node.type === 'delay' && (
                    <div className="text-[11px] text-purple-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Esperar {node.data?.delaySeconds || 15}s (com jitter)</span>
                    </div>
                  )}
                </div>

                {/* Handle Direito (Output) */}
                <div className="node-handle-out" title="Porta de Saída"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral de Edição do Nó Selecionado */}
      {selectedNode && (
        <aside className="w-80 h-full border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl p-5 overflow-y-auto z-30 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configurar Nó</h3>
              <p className="text-[11px] text-slate-400">{selectedNode.title}</p>
            </div>
            <button 
              onClick={() => setSelectedNodeId(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Título do Passo</label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => {
                  const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, title: e.target.value } : n);
                  updateFlow(currentFlow.id, { nodes: updatedNodes });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {selectedNode.type === 'message' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Texto da Mensagem</label>
                    <span className="text-[10px] text-indigo-400 cursor-pointer" onClick={() => {
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, text: n.data.text + ' {{first_name}}' }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}>+ Variável</span>
                  </div>
                  <textarea
                    rows={4}
                    value={selectedNode.data?.text || ''}
                    onChange={(e) => {
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, text: e.target.value }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Botões da Mensagem */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-300">Botões / Interação</label>
                    <button
                      onClick={() => {
                        const newBtn = { id: 'btn_' + Date.now(), title: 'Novo Botão', targetNode: '' };
                        const updatedButtons = [...(selectedNode.data?.buttons || []), newBtn];
                        const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                          ...n,
                          data: { ...n.data, buttons: updatedButtons }
                        } : n);
                        updateFlow(currentFlow.id, { nodes: updatedNodes });
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      + Adicionar Botão
                    </button>
                  </div>

                  {selectedNode.data?.buttons?.map((btn, bidx) => (
                    <div key={btn.id || bidx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={btn.title}
                          onChange={(e) => {
                            const newButtons = selectedNode.data.buttons.map(b => b.id === btn.id ? { ...b, title: e.target.value } : b);
                            const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                            updateFlow(currentFlow.id, { nodes: updatedNodes });
                          }}
                          className="w-44 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                        <button
                          onClick={() => {
                            const newButtons = selectedNode.data.buttons.filter(b => b.id !== btn.id);
                            const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                            updateFlow(currentFlow.id, { nodes: updatedNodes });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.type === 'trigger' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">Palavra-Chave do Comentário</label>
                <input
                  type="text"
                  value={selectedNode.data?.keyword || ''}
                  onChange={(e) => {
                    const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                      ...n,
                      data: { ...n.data, keyword: e.target.value.toUpperCase() }
                    } : n);
                    updateFlow(currentFlow.id, { nodes: updatedNodes });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono uppercase"
                  placeholder="EX: VITRIX"
                />
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
