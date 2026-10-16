import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Check,
  AlertCircle,
  Filter,
  X,
  HelpCircle,
  Sparkles,
  UserCheck,
  Lock
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

export const FlowCanvas = ({ onOpenSimulator }) => {
  const { 
    flows, 
    selectedFlowId, 
    setSelectedFlowId,
    updateFlow, 
    createFlow,
    channels,
    setCurrentView,
    theme, 
    processLiveAutomation, 
    isRunningAutomation, 
    automationStatus,
    saveFlowsToCloud,
    saveStatus 
  } = useApp();
  const currentFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [connectingWire, setConnectingWire] = useState(null);
  const [flowDropdownOpen, setFlowDropdownOpen] = useState(false);
  const [flowChannelFilter, setFlowChannelFilter] = useState('all');
  const dropdownRef = useRef(null);
  const dragStartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFlowDropdownOpen(false);
      }
    };
    if (flowDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [flowDropdownOpen]);

  // Auto-recuperação: Garante que todo bloco do tipo 'follower_gate' possua o botão de confirmação do seguidor
  useEffect(() => {
    if (!currentFlow?.nodes) return;
    let needsRepair = false;
    const repairedNodes = currentFlow.nodes.map(n => {
      if (n.type === 'follower_gate') {
        const hasValidButton = Array.isArray(n.data?.buttons) && n.data.buttons.length > 0;
        if (!hasValidButton) {
          needsRepair = true;
          // Verifica se já existia uma conexão saindo deste nó para ligar ao botão
          const existingEdge = (currentFlow.edges || []).find(e => e.from === n.id);
          const targetId = existingEdge?.to || '';
          const btnId = 'b_follow_' + n.id;
          return {
            ...n,
            data: {
              ...n.data,
              buttons: [{ id: btnId, title: '✅ Já estou seguindo', targetNode: targetId }]
            }
          };
        } else if (n.data.buttons.some(b => b.title === '✅ Já estou te seguindo!')) {
          // Atualiza automaticamente o texto antigo que passava de 20 chars para a versão segura que a Meta aceita sem cortar
          needsRepair = true;
          return {
            ...n,
            data: {
              ...n.data,
              buttons: n.data.buttons.map(b => b.title === '✅ Já estou te seguindo!' ? { ...b, title: '✅ Já estou seguindo' } : b)
            }
          };
        }
      }
      return n;
    });

    if (needsRepair) {
      // Se havia ligação saindo de 'output', redireciona para a porta do botão de verificação
      const repairedEdges = (currentFlow.edges || []).map(e => {
        const sourceNode = currentFlow.nodes.find(n => n.id === e.from);
        if (sourceNode?.type === 'follower_gate' && (!e.port || e.port === 'output')) {
          const btnId = 'b_follow_' + sourceNode.id;
          return { ...e, port: btnId };
        }
        return e;
      });
      updateFlow(currentFlow.id, { nodes: repairedNodes, edges: repairedEdges });
    }
  }, [currentFlow?.id, currentFlow?.nodes]);

  if (!currentFlow) return null;

  // Iniciar ligação visual a partir de um handle ou botão
  const handleStartConnect = (fromNodeId, port, e) => {
    e.stopPropagation();
    const fromNode = currentFlow.nodes.find(n => n.id === fromNodeId);
    if (!fromNode) return;
    
    let startY = fromNode.position.y + 50;
    if (port && port !== 'output' && fromNode.data?.buttons) {
      const btnIdx = fromNode.data.buttons.findIndex(b => b.id === port);
      if (btnIdx !== -1) {
        startY = fromNode.position.y + 115 + btnIdx * 34;
      }
    }
    const startX = fromNode.position.x + 290;
    
    setConnectingWire({
      fromNodeId,
      port: port || 'output',
      startX,
      startY,
      currentX: startX + 25,
      currentY: startY
    });
  };

  // Concluir ligação ao clicar ou soltar em um nó ou handle de entrada
  const handleFinishConnect = (targetNodeId) => {
    if (!connectingWire) return;
    if (connectingWire.fromNodeId === targetNodeId) {
      setConnectingWire(null);
      return;
    }

    const newEdge = {
      from: connectingWire.fromNodeId,
      to: targetNodeId,
      port: connectingWire.port || 'output'
    };

    // Remove qualquer edge anterior saindo do mesmo nó e da mesma porta
    const filteredEdges = (currentFlow.edges || []).filter(e => 
      !(e.from === connectingWire.fromNodeId && (e.port || 'output') === (connectingWire.port || 'output'))
    );

    // Se a porta for de um botão específico, atualiza o targetNode do botão
    const updatedNodes = currentFlow.nodes.map(n => {
      if (n.id === connectingWire.fromNodeId && n.data?.buttons) {
        const newBtns = n.data.buttons.map(b => 
          b.id === connectingWire.port ? { ...b, targetNode: targetNodeId } : b
        );
        return { ...n, data: { ...n.data, buttons: newBtns } };
      }
      return n;
    });

    updateFlow(currentFlow.id, {
      edges: [...filteredEdges, newEdge],
      nodes: updatedNodes
    });

    setConnectingWire(null);
  };

  // Excluir aresta específica
  const handleDeleteEdge = (edgeToDelete) => {
    const filteredEdges = (currentFlow.edges || []).filter(e => 
      !(e.from === edgeToDelete.from && e.to === edgeToDelete.to && (e.port || 'output') === (edgeToDelete.port || 'output'))
    );
    const updatedNodes = currentFlow.nodes.map(n => {
      if (n.id === edgeToDelete.from && n.data?.buttons) {
        const newBtns = n.data.buttons.map(b => 
          b.id === edgeToDelete.port ? { ...b, targetNode: '' } : b
        );
        return { ...n, data: { ...n.data, buttons: newBtns } };
      }
      return n;
    });
    updateFlow(currentFlow.id, { edges: filteredEdges, nodes: updatedNodes });
  };

  // Desconectar porta pelo painel lateral
  const handleDisconnectPort = (fromNodeId, port) => {
    const filteredEdges = (currentFlow.edges || []).filter(e => 
      !(e.from === fromNodeId && (e.port || 'output') === (port || 'output'))
    );
    const updatedNodes = currentFlow.nodes.map(n => {
      if (n.id === fromNodeId && n.data?.buttons) {
        const newBtns = n.data.buttons.map(b => 
          b.id === port ? { ...b, targetNode: '' } : b
        );
        return { ...n, data: { ...n.data, buttons: newBtns } };
      }
      return n;
    });
    updateFlow(currentFlow.id, { edges: filteredEdges, nodes: updatedNodes });
  };

  // Handlers de Pan no Canvas (clicar ou tocar em qualquer área vazia)
  const handleMouseDown = (e) => {
    if (connectingWire) {
      setConnectingWire(null);
      return;
    }
    if (e.target.closest('.flow-node') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select')) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleTouchStart = (e) => {
    if (connectingWire) {
      setConnectingWire(null);
      return;
    }
    if (e.target.closest('.flow-node') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select')) {
      return;
    }
    if (e.touches && e.touches.length === 1) {
      setIsPanning(true);
      setStartPan({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  // Arrastar nó específico (mouse ou touch)
  const handleNodeMouseDown = (e, nodeId) => {
    if (connectingWire) {
      handleFinishConnect(nodeId);
      return;
    }
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select') || e.target.closest('.node-handle-in') || e.target.closest('.node-handle-out')) {
      return;
    }
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    
    const node = currentFlow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    dragStartRef.current = {
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      nodeStartX: node.position.x,
      nodeStartY: node.position.y
    };
  };

  const handleNodeTouchStart = (e, nodeId) => {
    if (connectingWire) {
      handleFinishConnect(nodeId);
      return;
    }
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select') || e.target.closest('.node-handle-in') || e.target.closest('.node-handle-out')) {
      return;
    }
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    
    const node = currentFlow.nodes.find(n => n.id === nodeId);
    if (!node || !e.touches || e.touches.length !== 1) return;

    setDraggingNodeId(nodeId);
    dragStartRef.current = {
      nodeId,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      nodeStartX: node.position.x,
      nodeStartY: node.position.y
    };
  };

  // Listeners globais de window para arrastar suavemente e guiar o fio de conexão
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (isPanning) {
        setPan({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y
        });
      } else if (dragStartRef.current) {
        const { nodeId, startX, startY, nodeStartX, nodeStartY } = dragStartRef.current;
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;
        
        const updatedNodes = currentFlow.nodes.map(n => {
          if (n.id === nodeId) {
            return {
              ...n,
              position: {
                x: Math.round(nodeStartX + dx),
                y: Math.round(nodeStartY + dy)
              }
            };
          }
          return n;
        });
        updateFlow(currentFlow.id, { nodes: updatedNodes });
      } else if (connectingWire && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseCanvasX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseCanvasY = (e.clientY - rect.top - pan.y) / zoom;
        setConnectingWire(prev => prev ? ({
          ...prev,
          currentX: mouseCanvasX,
          currentY: mouseCanvasY
        }) : null);
      }
    };

    const handleWindowTouchMove = (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (isPanning) {
        setPan({
          x: touch.clientX - startPan.x,
          y: touch.clientY - startPan.y
        });
      } else if (dragStartRef.current) {
        const { nodeId, startX, startY, nodeStartX, nodeStartY } = dragStartRef.current;
        const dx = (touch.clientX - startX) / zoom;
        const dy = (touch.clientY - startY) / zoom;
        
        const updatedNodes = currentFlow.nodes.map(n => {
          if (n.id === nodeId) {
            return {
              ...n,
              position: {
                x: Math.round(nodeStartX + dx),
                y: Math.round(nodeStartY + dy)
              }
            };
          }
          return n;
        });
        updateFlow(currentFlow.id, { nodes: updatedNodes });
      }
    };

    const handleWindowMouseUp = () => {
      if (isPanning) setIsPanning(false);
      if (dragStartRef.current) {
        dragStartRef.current = null;
        setDraggingNodeId(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && connectingWire) {
        setConnectingWire(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isPanning || draggingNodeId || connectingWire) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
      window.addEventListener('touchend', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowMouseUp);
    };
  }, [isPanning, startPan, draggingNodeId, connectingWire, currentFlow, zoom, pan]);

  // Adicionar novo nó
  const handleAddNode = (type) => {
    const newId = 'node_' + Date.now();
    let newNode = {
      id: newId,
      type,
      position: { x: Math.round((-pan.x + 300) / zoom), y: Math.round((-pan.y + 250) / zoom) },
      data: {}
    };

    if (type === 'trigger') {
      newNode.title = 'Gatilho: Comentário no Reels';
      newNode.type = 'trigger';
      newNode.data = { keyword: 'LISTA' };
    } else if (type === 'message') {
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
    } else if (type === 'follower_gate') {
      newNode.title = '1ª DM: Convite & Botão Seguidor';
      newNode.type = 'follower_gate';
      newNode.data = {
        text: 'Oi {{first_name}}! Preparei esse material com muito carinho exclusivamente para quem me acompanha aqui no Instagram 🎁\n\nDá um pulinho no meu perfil @ygorweb, começa a me seguir e depois toca no botão abaixo pra eu te enviar na hora 👇',
        buttons: [{ id: 'b_follow_' + Date.now(), title: '✅ Já estou te seguindo!', targetNode: '' }],
        fallbackText: 'Opa! Vi aqui que você ainda não começou a me seguir 👀 Dá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!',
        profileHandle: '@ygorweb',
        requireFollow: true
      };
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
    <div className="relative w-full h-[calc(100vh-4rem-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden flex select-none bg-slate-50 dark:bg-slate-950">
      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`flex-1 h-full relative cursor-grab active:cursor-grabbing overflow-hidden ${
          theme === 'dark' ? 'canvas-grid-dark' : 'canvas-grid-light'
        }`}
      >
        {/* Barra Superior Flutuante: Seletor de Fluxos e Ações Principais (Organizado em 2 Lados) */}
        <header className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-6 z-30 flex items-center justify-between gap-3 pointer-events-none">
          {/* Lado Esquerdo: Fluxo Atual, Nova Automação e Switch de Ligado/Desligado */}
          <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
            {/* Seletor de Fluxos Interativo */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlowDropdownOpen(!flowDropdownOpen);
                }}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 sm:gap-3 shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all text-left group ${
                  flowDropdownOpen ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  currentFlow.channel === 'instagram' 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' 
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                }`}>
                  {currentFlow.channel === 'instagram' ? <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[130px] sm:max-w-none">
                      {currentFlow.name}
                    </h2>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${flowDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 sm:gap-1.5 truncate">
                    <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
                      {currentFlow.channel === 'instagram' ? 'Instagram @ygorweb' : 'WhatsApp'}
                    </span>
                    <span>•</span>
                    <span>{currentFlow.nodes.length} blocos</span>
                    <span>•</span>
                    <span className={currentFlow.active ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                      {currentFlow.active ? 'Ativo' : 'Pausado'}
                    </span>
                  </p>
                </div>
              </button>

              {/* Menu Dropdown de Seleção de Fluxo */}
              {flowDropdownOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Alternar Fluxo
                    </span>
                    {/* Filtros Rápidos */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
                      <button
                        onClick={() => setFlowChannelFilter('all')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${flowChannelFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                      >
                        Todos ({flows.length})
                      </button>
                      <button
                        onClick={() => setFlowChannelFilter('instagram')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${flowChannelFilter === 'instagram' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs' : 'text-slate-500'}`}
                      >
                        Instagram
                      </button>
                      <button
                        onClick={() => setFlowChannelFilter('whatsapp')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${flowChannelFilter === 'whatsapp' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500'}`}
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Lista de Fluxos */}
                  <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                    {flows
                      .filter(f => flowChannelFilter === 'all' || f.channel === flowChannelFilter)
                      .map(f => {
                        const isSelected = f.id === currentFlow.id;
                        const isConnected = f.channel === 'instagram' ? channels.instagram?.connected : channels.whatsapp?.connected;
                        return (
                          <div
                            key={f.id}
                            onClick={() => {
                              setSelectedFlowId(f.id);
                              setFlowDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 shadow-xs'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                f.channel === 'instagram' 
                                   ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                                   : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                              }`}>
                                {f.channel === 'instagram' ? <InstagramIcon className="w-3.5 h-3.5" /> : <WhatsAppIcon className="w-3.5 h-3.5" />}
                              </div>
                              <div className="truncate">
                                <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                  {f.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span>{f.nodes.length} nós</span>
                                  <span>•</span>
                                  <span className={isConnected ? 'text-emerald-600 font-semibold' : 'text-amber-500 font-semibold'}>
                                    {isConnected ? 'Canal Conectado' : '⚪ Desconectado'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Criar Novo Fluxo */}
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newId = createFlow('Novo Fluxo Instagram', 'instagram');
                        setSelectedFlowId(newId);
                        setFlowDropdownOpen(false);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> + Instagram
                    </button>
                    <button
                      onClick={() => {
                        const newId = createFlow('Novo Fluxo WhatsApp', 'whatsapp');
                        setSelectedFlowId(newId);
                        setFlowDropdownOpen(false);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> + WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Criar Nova Automação do Zero (Novo Fluxo) */}
            <button
              onClick={() => {
                const newId = createFlow('Nova Automação Instagram', 'instagram');
                setSelectedFlowId(newId);
              }}
              title="Criar Nova Automação do Zero (Novo Fluxo)"
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition-all border border-blue-500 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nova Automação</span>
            </button>

            {/* Botão de Ligar / Desligar Automação */}
            <button
              onClick={() => updateFlow(currentFlow.id, { active: !currentFlow.active })}
              className={`px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all border shrink-0 ${
                currentFlow.active
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentFlow.active ? 'bg-white' : 'bg-slate-400'}`}></span>
              <span className="hidden sm:inline">{currentFlow.active ? '🟢 Automação Ligada' : '⚪ Automação Desligada'}</span>
              <span className="sm:hidden">{currentFlow.active ? '🟢 Ligada' : '⚪ Desligada'}</span>
            </button>
          </div>

          {/* Lado Direito: Ações Globais (Disparar, Salvar, Simulador) */}
          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            {/* Disparo em Tempo Real / Forçar Verificação */}
            <button
              onClick={() => {
                if (currentFlow.channel === 'whatsapp' && !channels.whatsapp?.connected) {
                  alert('O canal WhatsApp está desconectado. Conecte seu número na aba Canais Meta para disparar automações no WhatsApp.');
                  return;
                }
                processLiveAutomation();
              }}
              disabled={isRunningAutomation}
              className={`px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border shrink-0 ${
                isRunningAutomation
                  ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50'
              }`}
              title={currentFlow.channel === 'whatsapp' ? 'Verificar mensagens do WhatsApp' : 'Verificar comentários recentes no Reel e enviar DMs agora'}
            >
              <Zap className={`w-3.5 h-3.5 ${isRunningAutomation ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isRunningAutomation ? 'Enviando DMs...' : '⚡ Disparar Agora'}</span>
              <span className="md:hidden">⚡ Disparar</span>
            </button>

            {/* Botão de Salvar Fluxo na Nuvem */}
            <button
              onClick={() => saveFlowsToCloud(flows)}
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 shrink-0 cursor-pointer"
              title="Salvar alterações na nuvem"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salvar Fluxo</span>
            </button>

            {/* Testar no Simulador */}
            <button
              onClick={onOpenSimulator}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-white items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Testar no Simulador</span>
            </button>
          </div>
        </header>

        {/* Status Flutuante Centralizado (Toast Não-Intrusivo que NUNCA sobrepõe botões) */}
        {(automationStatus || saveStatus) && (
          <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {automationStatus && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white/95 dark:bg-slate-900/95 border border-emerald-300 dark:border-emerald-700/80 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                {automationStatus}
              </span>
            )}
            {saveStatus && (
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white/95 dark:bg-slate-900/95 border border-indigo-300 dark:border-indigo-700/80 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                {saveStatus}
              </span>
            )}
          </div>
        )}

        {/* Banner de Aviso caso o WhatsApp esteja desconectado */}
        {currentFlow.channel === 'whatsapp' && !channels.whatsapp?.connected && (
          <div className="absolute top-16 sm:top-20 left-6 right-6 z-20 bg-amber-50/90 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 px-3 sm:px-4 py-2 rounded-xl flex items-center justify-between gap-2 sm:gap-3 text-xs text-amber-800 dark:text-amber-200 shadow-md backdrop-blur-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                <strong>WhatsApp Desconectado:</strong> Conecte na aba Canais para disparar automações no WhatsApp.
              </span>
            </div>
            <button
              onClick={() => setCurrentView('channels')}
              className="px-2 sm:px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] sm:text-[11px] shrink-0 transition-colors"
            >
              Conectar
            </button>
          </div>
        )}

        {/* Toolbar de Inserção de Blocos - Dock Fixo no Centro Inferior (Padrão Figma/ManyChat) */}
        <div className="fixed sm:absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl max-w-[95vw] overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleAddNode('trigger')}
            title="Adicionar Gatilho de Comentário (Palavra-Chave)"
            className="px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>+ Gatilho</span>
          </button>

          <button
            onClick={() => handleAddNode('follower_gate')}
            title="Adicionar 1ª DM: Trava de Seguidor"
            className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>+ Trava Seguidor</span>
          </button>

          <button
            onClick={() => handleAddNode('message')}
            title="Adicionar Mensagem"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>+ Mensagem</span>
          </button>

          <button
            onClick={() => handleAddNode('action')}
            title="Adicionar Ação (+Tag)"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>+ Ação</span>
          </button>

          <button
            onClick={() => handleAddNode('condition')}
            title="Adicionar Condição"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>+ Condição</span>
          </button>

          <button
            onClick={() => handleAddNode('delay')}
            title="Adicionar Smart Delay"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>+ Delay</span>
          </button>
        </div>

        {/* Controles Flutuantes de Zoom e Centralização (Mobile & Desktop) */}
        <div className="absolute bottom-28 md:bottom-6 right-3 sm:right-6 z-20 flex flex-col items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-lg gap-0.5">
          <button
            onClick={() => setZoom(z => Math.min(2, Math.round((z + 0.15) * 100) / 100))}
            title="Aumentar Zoom"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold text-slate-500 select-none px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.max(0.4, Math.round((z - 0.15) * 100) / 100))}
            title="Diminuir Zoom"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-4 h-px bg-slate-200 dark:bg-slate-800 my-0.5"></div>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            title="Resetar Posição e Zoom"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Banner de Ligação Ativa */}
        {connectingWire && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl flex items-center gap-3 animate-pulse border border-indigo-400">
            <span>🔗 Clique no bloco de destino para fazer a ligação</span>
            <button 
              onClick={() => setConnectingWire(null)}
              className="px-2 py-0.5 rounded bg-indigo-800 hover:bg-indigo-900 text-indigo-100 text-[10px] font-semibold"
            >
              Cancelar (Esc)
            </button>
          </div>
        )}

        {/* Linhas SVG Conectando os Nós */}
        <div 
          className="w-full h-full"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
        >
          <svg className="w-[4000px] h-[4000px] absolute inset-0 pointer-events-none">
            {currentFlow.edges?.map((edge, idx) => {
              const fromNode = currentFlow.nodes.find(n => n.id === edge.from);
              const toNode = currentFlow.nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              let yOffsetFrom = 50;
              if (edge.port && edge.port !== 'output' && fromNode.data?.buttons) {
                const btnIdx = fromNode.data.buttons.findIndex(b => b.id === edge.port);
                if (btnIdx !== -1) {
                  yOffsetFrom = 115 + btnIdx * 34;
                }
              }

              const x1 = fromNode.position.x + 290;
              const y1 = fromNode.position.y + yOffsetFrom;
              const x2 = toNode.position.x;
              const y2 = toNode.position.y + 50;
              const cx1 = x1 + (x2 - x1) * 0.5;
              const cx2 = x2 - (x2 - x1) * 0.5;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={idx} className="group pointer-events-auto cursor-pointer">
                  <path
                    d={`M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`}
                    className="dag-edge"
                  />
                  {/* Botão de excluir aresta no meio da curva */}
                  <circle
                    cx={midX}
                    cy={midY}
                    r="10"
                    fill="#EF4444"
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEdge(edge);
                    }}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    ×
                  </text>
                </g>
              );
            })}

            {/* Fio de conexão sendo arrastado em tempo real */}
            {connectingWire && (
              <path
                d={`M ${connectingWire.startX} ${connectingWire.startY} C ${connectingWire.startX + (connectingWire.currentX - connectingWire.startX) * 0.5} ${connectingWire.startY}, ${connectingWire.currentX - (connectingWire.currentX - connectingWire.startX) * 0.5} ${connectingWire.currentY}, ${connectingWire.currentX} ${connectingWire.currentY}`}
                className="dag-edge-active pointer-events-none"
              />
            )}
          </svg>

          {/* Renderização dos Blocos Visuais */}
          {currentFlow.nodes?.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onTouchStart={(e) => handleNodeTouchStart(e, node.id)}
                onClick={() => {
                  if (connectingWire) {
                    handleFinishConnect(node.id);
                  } else {
                    setSelectedNodeId(node.id);
                  }
                }}
                style={{
                  transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                  width: '290px'
                }}
                className={`flow-node absolute pointer-events-auto rounded-xl bg-white dark:bg-slate-900 border transition-shadow cursor-grab active:cursor-grabbing shadow-sm select-none ${
                  isSelected 
                    ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                } ${connectingWire && connectingWire.fromNodeId !== node.id ? 'ring-2 ring-indigo-400 hover:scale-[1.02] cursor-pointer' : ''}`}
              >
                {/* Handle Esquerdo (Entrada) - Clicável para concluir ligação */}
                <div 
                  className={`node-handle-in cursor-pointer transition-all ${
                    connectingWire ? 'ring-4 ring-indigo-400 bg-indigo-500 scale-125 animate-pulse' : ''
                  }`} 
                  title="Ponto de Conexão - Clique para ligar este bloco"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFinishConnect(node.id);
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    handleFinishConnect(node.id);
                  }}
                ></div>

                {/* Cabeçalho do Bloco ManyChat */}
                <div className={`p-3 border-b flex items-center justify-between rounded-t-xl ${
                  node.type === 'trigger' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300' :
                  node.type === 'follower_gate' ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300' :
                  node.type === 'message' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-300' :
                  node.type === 'action' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300' :
                  node.type === 'condition' ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900 text-cyan-800 dark:text-cyan-300' :
                  'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900 text-purple-800 dark:text-purple-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {node.type === 'trigger' && <Zap className="w-4 h-4 text-emerald-600" />}
                    {node.type === 'follower_gate' && <UserCheck className="w-4 h-4 text-indigo-600" />}
                    {node.type === 'message' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                    {node.type === 'action' && <Zap className="w-4 h-4 text-emerald-600" />}
                    {node.type === 'condition' && <GitBranch className="w-4 h-4 text-cyan-600" />}
                    {node.type === 'delay' && <Clock className="w-4 h-4 text-purple-600" />}
                    <span className="text-xs font-bold truncate max-w-[180px]">{node.title || node.type}</span>
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
                        PALAVRA: {node.data?.keyword || 'LISTA'}
                      </span>
                    </div>
                  )}

                  {node.type === 'follower_gate' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">
                        <UserCheck className="w-3 h-3 text-indigo-600" />
                        <span>{node.data?.title || 'Me segue ai pra min te enviar ingrato(a) 🚀'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed whitespace-pre-line">
                        {node.data?.text || node.data?.subtitle || 'Sem texto'}
                      </p>

                      {/* Botão de Confirmação do Seguidor no Card do Canvas */}
                      {(() => {
                        const buttons = (node.data?.buttons && node.data.buttons.length > 0)
                          ? node.data.buttons
                          : [{ id: 'b_follow_' + node.id, title: '✅ Já estou seguindo', targetNode: '' }];

                        return (
                          <div className="space-y-1.5 pt-1">
                            {buttons.map((btn, bidx) => (
                              <div key={bidx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-700 dark:text-indigo-300 font-bold">
                                <span>{btn.title}</span>
                                {/* Conector Interativo de Saída do Botão */}
                                <button
                                  type="button"
                                  onClick={(e) => handleStartConnect(node.id, btn.id || ('b_' + bidx), e)}
                                  onMouseDown={(e) => handleStartConnect(node.id, btn.id || ('b_' + bidx), e)}
                                  title="Clique ou arraste para ligar este botão a outro bloco"
                                  className="w-4 h-4 rounded-full bg-indigo-500 hover:bg-indigo-600 hover:scale-125 transition-all flex items-center justify-center cursor-crosshair border border-white dark:border-slate-800 shadow-xs"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {node.type === 'message' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed whitespace-pre-line">
                        {node.data?.text || 'Sem texto'}
                      </p>

                      {node.data?.buttons && node.data.buttons.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {node.data.buttons.map((btn, bidx) => (
                            <div key={bidx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300 font-bold">
                              <span>{btn.title}</span>
                              {/* Conector Interativo de Saída do Botão */}
                              <button
                                type="button"
                                onClick={(e) => handleStartConnect(node.id, btn.id || ('b_' + bidx), e)}
                                onMouseDown={(e) => handleStartConnect(node.id, btn.id || ('b_' + bidx), e)}
                                title="Clique ou arraste para ligar este botão a outro bloco"
                                className="w-4 h-4 rounded-full bg-blue-500 hover:bg-blue-600 hover:scale-125 transition-all flex items-center justify-center cursor-crosshair border border-white dark:border-slate-800 shadow-xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                              </button>
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

                {/* Handle Direito (Saída Principal) - Clicável e Arrastável para Ligar */}
                <div 
                  className="node-handle-out cursor-crosshair" 
                  title="Ponto de Saída - Clique ou arraste para ligar ao próximo bloco"
                  onClick={(e) => handleStartConnect(node.id, 'output', e)}
                  onMouseDown={(e) => handleStartConnect(node.id, 'output', e)}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral de Edição do Bloco (Estilo ManyChat Inspector) */}
      {selectedNode && (
        <>
          {/* Backdrop escurecido no Mobile */}
          <div 
            onClick={() => setSelectedNodeId(null)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in"
            aria-hidden="true"
          />

          <aside className="fixed inset-x-0 bottom-0 top-16 md:static md:top-auto md:bottom-auto md:w-80 md:h-full z-50 md:z-30 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 overflow-y-auto shadow-2xl md:shadow-lg animate-in slide-in-from-bottom md:slide-in-from-right duration-200 rounded-t-2xl md:rounded-none">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Configurar Bloco</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedNode.title}</p>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Fechar painel"
              >
                <X className="w-5 h-5" />
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
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* Alternador Dinâmico de Tipo de Bloco */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Tipo do Bloco</label>
              <select
                value={selectedNode.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const updatedNodes = currentFlow.nodes.map(n => {
                    if (n.id === selectedNode.id) {
                      let newTitle = n.title;
                      let newData = { ...n.data };
                      if (newType === 'trigger') {
                        newTitle = 'Gatilho: Comentário no Reels';
                        newData = { keyword: n.data?.keyword || 'LISTA' };
                      } else if (newType === 'follower_gate') {
                        newTitle = '1ª DM: Convite & Botão Seguidor';
                        const existingButtons = (n.data?.buttons && n.data.buttons.length > 0)
                          ? n.data.buttons
                          : [{ id: 'b_follow_' + Date.now(), title: '✅ Já estou seguindo', targetNode: '' }];
                        newData = {
                          title: n.data?.title || 'Só me seguir e clicar no botão pra min não tomar ban',
                          text: n.data?.text || 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra receber 📲',
                          subtitle: n.data?.subtitle || n.data?.text || 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra receber 📲',
                          fallbackText: n.data?.fallbackText || 'Opa! Vi aqui que você ainda não começou a me seguir 👀 Dá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!',
                          profileHandle: '@ygorweb',
                          requireFollow: true,
                          buttons: existingButtons
                        };
                      } else if (newType === 'message') {
                        newTitle = '2ª DM: Enviar Mensagem';
                        newData = { text: n.data?.text || 'Aqui está o seu link 🚀', buttons: n.data?.buttons || [] };
                      } else if (newType === 'action') {
                        newTitle = 'Ação Automática';
                        newData = { actions: [{ type: 'add_tag', value: 'lead_qualificado' }] };
                      } else if (newType === 'delay') {
                        newTitle = 'Smart Delay';
                        newData = { delaySeconds: 15, jitter: true };
                      }
                      return { ...n, type: newType, title: newTitle, data: newData };
                    }
                    return n;
                  });
                  updateFlow(currentFlow.id, { nodes: updatedNodes });
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="trigger">🎯 Gatilho (Palavra-Chave no Reel)</option>
                <option value="follower_gate">🔒 1ª DM: Trava de Seguidor</option>
                <option value="message">💬 DM: Enviar Mensagem</option>
                <option value="action">⚡ Ação Automática (+Tag)</option>
                <option value="condition">🔀 Condição Lógica</option>
                <option value="delay">⏱️ Smart Delay</option>
              </select>
            </div>

            {/* Aviso e Atalho Inteligente para Blocos de Ação */}
            {selectedNode.type === 'action' && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Você adicionou uma Ação Interna (+Tag)</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                  Este bloco serve para marcar contatos com tags (ex: <code>+lead_qualificado</code>). Se o que você queria era criar um <strong>Gatilho de Palavra-Chave</strong> (igual ao bloco da LISTA), clique no botão abaixo para transformar:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                      ...n,
                      type: 'trigger',
                      title: 'Gatilho: Comentário no Reels',
                      data: { keyword: 'LISTA' }
                    } : n);
                    updateFlow(currentFlow.id, { nodes: updatedNodes });
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🎯 Transformar em Gatilho de Palavra-Chave</span>
                </button>
              </div>
            )}

            {/* Configurações Específicas da Trava de Seguidor */}
            {selectedNode.type === 'follower_gate' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Verificação de Seguidor (Instagram)</span>
                  </div>
                  <p className="text-[11px] text-indigo-800 dark:text-indigo-200 leading-relaxed">
                    Entrega o link final quando a pessoa começar a seguir seu perfil. Comunicação 100% humanizada e sem jargões.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Seu Perfil no Instagram
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data?.profileHandle || '@ygorweb'}
                    onChange={(e) => {
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, profileHandle: e.target.value }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Título / Destaque do Card (DM)
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data?.title || 'Me segue ai pra min te enviar ingrato(a) 🚀'}
                    onChange={(e) => {
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, title: e.target.value }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                    placeholder="Ex: Me segue ai pra min te enviar ingrato(a) 🚀"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Mensagem de Convite para Seguir (Texto da DM)
                    </label>
                    {(() => {
                      const len = (selectedNode.data?.text || selectedNode.data?.subtitle || '').length;
                      return (
                        <span className={`text-[10px] font-bold ${len > 80 ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`}>
                          {len}/80 chars {len > 80 ? '⚠️ (Meta corta em 80)' : '✅'}
                        </span>
                      );
                    })()}
                  </div>
                  <textarea
                    rows={4}
                    value={selectedNode.data?.text || selectedNode.data?.subtitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, text: val, subtitle: val }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed font-sans"
                  />
                  {((selectedNode.data?.text || selectedNode.data?.subtitle || '').length > 80) && (
                    <p className="text-[10px] text-amber-500 mt-1 leading-tight">
                      ⚠️ Dica: A Meta corta subtítulos de cartões em 80 caracteres. Encurte 1 ou 2 letras para que emojis no final não sejam cortados!
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Lembrete Amigável (se clicar antes de seguir)
                  </label>
                  <textarea
                    rows={3}
                    value={selectedNode.data?.fallbackText || 'Opa! Vi aqui que você ainda não começou a me seguir 👀 Dá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!'}
                    onChange={(e) => {
                      const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                        ...n,
                        data: { ...n.data, fallbackText: e.target.value }
                      } : n);
                      updateFlow(currentFlow.id, { nodes: updatedNodes });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Botão de Confirmação do Seguidor
                    </label>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Obrigatório no Instagram</span>
                  </div>

                  {(() => {
                    const currentButtons = (selectedNode.data?.buttons && selectedNode.data.buttons.length > 0)
                      ? selectedNode.data.buttons
                      : [{ id: 'b_follow_' + selectedNode.id, title: '✅ Já estou seguindo', targetNode: '' }];

                    return (
                      <div className="space-y-3">
                        {currentButtons.map((btn, bidx) => {
                          const portId = btn.id || ('b_' + bidx);
                          const connectedEdge = (currentFlow.edges || []).find(e => e.from === selectedNode.id && e.port === portId);
                          const targetNodeId = btn.targetNode || connectedEdge?.to || '';

                          return (
                            <div key={portId} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] text-slate-500 font-bold uppercase">Texto do Botão</label>
                                <span className={`text-[10px] font-bold ${btn.title.length > 20 ? 'text-rose-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                  {btn.title.length}/20 chars (Limite Meta)
                                </span>
                              </div>
                              <input
                                type="text"
                                maxLength={20}
                                value={btn.title}
                                onChange={(e) => {
                                  const newButtons = currentButtons.map(b => b.id === btn.id ? { ...b, title: e.target.value } : b);
                                  const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                                  updateFlow(currentFlow.id, { nodes: updatedNodes });
                                }}
                                className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                                placeholder="Ex: ✅ Já estou seguindo"
                              />
                              <div>
                                <label className="text-[10px] text-slate-500 font-medium block mb-1">🔗 Se já seguiu, ir para o bloco:</label>
                                <select
                                  value={targetNodeId}
                                  onChange={(e) => {
                                    const destId = e.target.value;
                                    const newButtons = currentButtons.map(b => b.id === btn.id ? { ...b, targetNode: destId } : b);
                                    const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                                    const filteredEdges = (currentFlow.edges || []).filter(ed => !(ed.from === selectedNode.id && ed.port === portId));
                                    const newEdges = destId ? [...filteredEdges, { from: selectedNode.id, to: destId, port: portId }] : filteredEdges;
                                    updateFlow(currentFlow.id, { nodes: updatedNodes, edges: newEdges });
                                  }}
                                  className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
                                >
                                  <option value="">(Nenhum - Arraste a linha ou selecione)</option>
                                  {currentFlow.nodes.filter(n => n.id !== selectedNode.id).map(n => (
                                    <option key={n.id} value={n.id}>➜ {n.title || n.type} ({n.id})</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}

                        {(!selectedNode.data?.buttons || selectedNode.data.buttons.length === 0) && (
                          <button
                            type="button"
                            onClick={() => {
                              const defaultButton = { id: 'b_follow_' + Date.now(), title: '✅ Já estou te seguindo!', targetNode: '' };
                              const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? {
                                ...n,
                                data: { ...n.data, buttons: [defaultButton] }
                              } : n);
                              updateFlow(currentFlow.id, { nodes: updatedNodes });
                            }}
                            className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            Restaurar Botão de Confirmação
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Configurações de Mensagem Normal */}
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Botões Interativos</label>
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

                  {selectedNode.data?.buttons?.map((btn, bidx) => {
                    const portId = btn.id || ('b_' + bidx);
                    const connectedEdge = (currentFlow.edges || []).find(e => e.from === selectedNode.id && e.port === portId);
                    const targetNodeId = btn.targetNode || connectedEdge?.to || '';

                    return (
                      <div key={portId} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-slate-500 font-bold uppercase">Botão #{bidx + 1}</label>
                          <button
                            onClick={() => {
                              const newButtons = selectedNode.data.buttons.filter(b => b.id !== btn.id);
                              const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                              const filteredEdges = (currentFlow.edges || []).filter(ed => !(ed.from === selectedNode.id && ed.port === portId));
                              updateFlow(currentFlow.id, { nodes: updatedNodes, edges: filteredEdges });
                            }}
                            className="text-slate-400 hover:text-rose-500 p-0.5 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={btn.title}
                          onChange={(e) => {
                            const newButtons = selectedNode.data.buttons.map(b => b.id === btn.id ? { ...b, title: e.target.value } : b);
                            const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                            updateFlow(currentFlow.id, { nodes: updatedNodes });
                          }}
                          className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                        />
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-1">🔗 Ao clicar, ir para o bloco:</label>
                          <select
                            value={targetNodeId}
                            onChange={(e) => {
                              const destId = e.target.value;
                              const newButtons = selectedNode.data.buttons.map(b => b.id === btn.id ? { ...b, targetNode: destId } : b);
                              const updatedNodes = currentFlow.nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, buttons: newButtons } } : n);
                              const filteredEdges = (currentFlow.edges || []).filter(ed => !(ed.from === selectedNode.id && ed.port === portId));
                              const newEdges = destId ? [...filteredEdges, { from: selectedNode.id, to: destId, port: portId }] : filteredEdges;
                              updateFlow(currentFlow.id, { nodes: updatedNodes, edges: newEdges });
                            }}
                            className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
                          >
                            <option value="">(Nenhum - Arraste a linha ou selecione)</option>
                            {currentFlow.nodes.filter(n => n.id !== selectedNode.id).map(n => (
                              <option key={n.id} value={n.id}>➜ {n.title || n.type} ({n.id})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedNode.type === 'trigger' && (
              <div className="space-y-3 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Palavra-Chave de Disparo no Reel</span>
                </div>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                  Quando alguém comentar esta palavra no seu post ou Reel, o fluxo começará automaticamente.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Palavra(s)-Chave
                  </label>
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
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-xs text-slate-900 dark:text-white font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500 shadow-xs"
                    placeholder="EX: LISTA ou LISTA, QUERO"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-tight">
                    💡 <strong>Dica:</strong> Você pode adicionar mais de uma palavra separada por vírgula (ex: <code>LISTA, QUERO, LINK</code>).
                  </p>
                </div>
              </div>
            )}

            {/* Conexão de Saída Principal do Bloco */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>🔗 Ligar Saída Principal</span>
                <span className="text-[10px] text-slate-400 font-normal">Fluxo Sequencial</span>
              </label>
              {(() => {
                const currentEdge = (currentFlow.edges || []).find(e => e.from === selectedNode.id && (!e.port || e.port === 'output'));
                const otherNodes = (currentFlow.nodes || []).filter(n => n.id !== selectedNode.id);
                return (
                  <div className="space-y-1.5">
                    <select
                      value={currentEdge?.to || ''}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        if (!targetId) {
                          handleDisconnectPort(selectedNode.id, 'output');
                        } else {
                          const filteredEdges = (currentFlow.edges || []).filter(ed => 
                            !(ed.from === selectedNode.id && (!ed.port || ed.port === 'output'))
                          );
                          updateFlow(currentFlow.id, {
                            edges: [...filteredEdges, { from: selectedNode.id, to: targetId, port: 'output' }]
                          });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
                    >
                      <option value="">(Nenhum - Arraste pelo ponto direito ou selecione)</option>
                      {otherNodes.map(n => (
                        <option key={n.id} value={n.id}>
                          ➜ {n.title || n.type} ({n.id})
                        </option>
                      ))}
                    </select>
                    {currentEdge && (
                      <div className="flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <span>Ligado a: <strong>{currentFlow.nodes.find(n => n.id === currentEdge.to)?.title || currentEdge.to}</strong></span>
                        <button 
                          onClick={() => handleDisconnectPort(selectedNode.id, 'output')}
                          className="text-rose-500 hover:underline text-[10px] font-bold"
                        >
                          Desconectar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Botão de Salvar Alterações na Nuvem */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => saveFlowsToCloud(flows)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações na Nuvem</span>
              </button>
              {saveStatus && (
                <p className="text-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-2 animate-in fade-in">
                  {saveStatus}
                </p>
              )}
            </div>
          </div>
        </aside>
        </>
      )}
    </div>
  );
};
