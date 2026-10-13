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
  X,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowCanvas = ({ onOpenSimulator }) => {
  const { flows, selectedFlowId, updateFlow, theme } = useApp();
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
      newNode.title = 'Enviar Mensagem';
      newNode.data = { text: 'Olá {{first_name}}! Como posso te ajudar hoje?', buttons: [] };
    } else if (type === 'anti_ban_box') {
      newNode.title = '🛡️ Caixinha de Confirmação';
      newNode.type = 'message';
      newNode.data = {
        text: 'Oi {{first_name}}! Vi seu comentário no vídeo pedindo o material. Para liberar o acesso seguro, clique abaixo 👇',
        buttons: [{ id: 'b_' + Date.now(), title: '👉 Liberar Meu Acesso', targetNode: '' }]
      };
    } else if (type === 'action') {
      newNode.title = 'Ação Automática';
      newNode.data = { actions: [{ type: 'add_tag', value: 'lead_qualificado' }] };
    } else if (type === 'condition') {
      newNode.title = 'Condição Lógica';
      newNode.data = { criteria: 'tag_equals', value: 'cliente_vip' };
    } else if (type === 'delay') {
      newNode.title = 'Smart Delay';
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
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex select-none bg-slate-50 dark:bg-slate-950">
      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 h-full relative cursor-grab active:cursor-grabbing overflow-hidden ${
          theme === 'dark' ? 'canvas-grid-dark' : 'canvas-grid-light'
        }`}
      >
        {/* Barra Superior Flutuante Estilo ManyChat: Nome do Fluxo & Canal */}
        <div className="absolute top-5 left-6 z-20 flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white font-heading">{currentFlow.name}</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Canal: <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">{currentFlow.channel}</span> • {currentFlow.nodes.length} blocos
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSimulator}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Testar no Simulador</span>
          </button>
        </div>

        {/* Toolbar de Inserção de Blocos (Estilo ManyChat) */}
        <div className="absolute top-5 right-6 z-20 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-sm">
          <button
            onClick={() => handleAddNode('message')}
            title="Adicionar Mensagem"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Mensagem</span>
          </button>

          <button
            onClick={() => handleAddNode('anti_ban_box')}
            title="Adicionar Caixinha de Confirmação (Micro-Compromisso Anti-Ban)"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Caixa Anti-Ban</span>
          </button>

          <button
            onClick={() => handleAddNode('action')}
            title="Adicionar Ação"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ação</span>
          </button>

          <button
            onClick={() => handleAddNode('condition')}
            title="Adicionar Condição"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
            <span>Condição</span>
          </button>

          <button
            onClick={() => handleAddNode('delay')}
            title="Adicionar Atraso / Delay"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart Delay</span>
          </button>
        </div>

        {/* Controles de Zoom Flutuantes no Rodapé */}
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg shadow-sm text-slate-600 dark:text-slate-300">
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.8, z + 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title="Centralizar">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG de Conexões em Bézier Suave */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {currentFlow.edges.map((edge, idx) => {
            const sourceNode = currentFlow.nodes.find(n => n.id === edge.from);
            const targetNode = currentFlow.nodes.find(n => n.id === edge.to);
            if (!sourceNode || !targetNode) return null;

            const sx = sourceNode.position.x + 280;
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
                  stroke={theme === 'dark' ? '#334155' : '#E2E8F0'}
                  strokeWidth="5"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#edgeGrad)"
                  strokeWidth="2.5"
                />
                <circle cx={tx} cy={ty} r="4.5" fill="#10B981" />
              </g>
            );
          })}
        </svg>

        {/* Cartões / Blocos Estilo ManyChat */}
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
                className={`absolute pointer-events-auto rounded-xl bg-white dark:bg-slate-900 border transition-all cursor-move shadow-sm ${
                  isSelected 
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Handle Esquerdo (Entrada) */}
                <div className="node-handle-in" title="Ponto de Conexão"></div>

                {/* Cabeçalho do Bloco ManyChat */}
                <div className={`p-3 border-b flex items-center justify-between rounded-t-xl ${
                  node.type === 'trigger' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300' :
                  node.type === 'message' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-300' :
                  node.type === 'action' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300' :
                  node.type === 'condition' ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900 text-cyan-800 dark:text-cyan-300' :
                  'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900 text-purple-800 dark:text-purple-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {node.type === 'trigger' && <Zap className="w-4 h-4 text-emerald-600" />}
                    {node.type === 'message' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                    {node.type === 'action' && <Zap className="w-4 h-4 text-emerald-600" />}
                    {node.type === 'condition' && <GitBranch className="w-4 h-4 text-cyan-600" />}
                    {node.type === 'delay' && <Clock className="w-4 h-4 text-purple-600" />}
                    <span className="text-xs font-bold truncate max-w-[170px]">{node.title || node.type}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Conteúdo do Bloco */}
                <div className="p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                  {node.type === 'trigger' && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Gatilho de Comentário:</p>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                        PALAVRA: {node.data?.keyword || 'QUALQUER'}
                      </span>
                    </div>
                  )}

                  {node.type === 'message' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                        {node.data?.text || 'Sem texto'}
                      </p>

                      {node.data?.buttons && node.data.buttons.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {node.data.buttons.map((btn, bidx) => (
                            <div key={bidx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300 font-bold">
                              <span>{btn.title}</span>
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === 'action' && (
                    <div className="space-y-1">
                      {node.data?.actions?.map((act, aidx) => (
                        <span key={aidx} className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold mr-1 mb-1">
                          +{act.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {node.type === 'delay' && (
                    <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Esperar {node.data?.delaySeconds || 15}s (com jitter)</span>
                    </div>
                  )}
                </div>

                {/* Handle Direito (Saída) */}
                <div className="node-handle-out" title="Ponto de Saída"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral de Edição do Bloco (Estilo ManyChat Inspector) */}
      {selectedNode && (
        <aside className="w-80 h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-y-auto z-30 shadow-lg animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Configurar Bloco</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedNode.title}</p>
            </div>
            <button 
              onClick={() => setSelectedNodeId(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Nome do Bloco</label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => {
                  const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, title: e.target.value } : n);
                  updateFlow(currentFlow.id, { nodes: updatedNodes });
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {selectedNode.type === 'message' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Texto da Mensagem</label>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer" onClick={() => {
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, text: n.data.text + ' {{first_name}}' }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}>+ Inserir Nome</span>
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Botões Interativos / Caixinha */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Botões de Confirmação</label>
                    <button
                      onClick={() => {
                        const newBtn = { id: 'btn_' + Date.now(), title: '👉 Novo Botão', targetNode: '' };
                        const updatedButtons = [...(selectedNode.data?.buttons || []), newBtn];
                        const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                          ...n,
                          data: { ...n.data, buttons: updatedButtons }
                        } : n);
                        updateFlow(currentFlow.id, { nodes: updatedNodes });
                      }}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      + Adicionar Botão
                    </button>
                  </div>

                  {selectedNode.data?.buttons?.map((btn, bidx) => (
                    <div key={btn.id || bidx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <input
                        type="text"
                        value={btn.title}
                        onChange={(e) => {
                          const newButtons = selectedNode.data.buttons.map(b => b.id === btn.id ? { ...b, title: e.target.value } : b);
                          const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                          updateFlow(currentFlow.id, { nodes: updatedNodes });
                        }}
                        className="w-48 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                      />
                      <button
                        onClick={() => {
                          const newButtons = selectedNode.data.buttons.filter(b => b.id !== btn.id);
                          const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                          updateFlow(currentFlow.id, { nodes: updatedNodes });
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.type === 'trigger' && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Palavra-Chave no Reel</label>
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono uppercase"
                  placeholder="EX: QUERO"
                />
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
