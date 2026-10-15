import React, { useState } from 'react';
import { Users, Search, Tag, Clock, ShieldCheck, MessageCircle, Filter, HelpCircle } from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../Common/UserAvatar';

export const ContactsView = () => {
  const { contacts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2 sm:gap-2.5">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              Contatos & CRM Unificado
            </h1>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
              Público & Leads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Lista de seguidores capturados no Instagram e WhatsApp com monitoramento da Janela de 24 horas da Meta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
            Total: {contacts.length} Contatos
          </span>
        </div>
      </div>

      {/* Explicação da Janela de 24 Horas */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
          <p className="font-bold">O que é a Janela de 24 Horas da Meta?</p>
          <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed text-[11px] sm:text-xs">
            Sempre que um usuário comenta ou envia uma mensagem para você, a Meta permite que você envie mensagens automáticas e links promocionais durante exatamente <strong>24 horas</strong>. Quando o tempo zera, o sistema protege sua conta pausando disparos promocionais para evitar suspensões.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, tag ou @handle..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              channelFilter === 'all' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setChannelFilter('instagram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              channelFilter === 'instagram' 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setChannelFilter('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              channelFilter === 'whatsapp' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            WhatsApp
          </button>
        </div>
      </div>

      {/* Tabela de Contatos Estilo ManyChat */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4 font-bold">Contato</th>
                <th className="py-3.5 px-4 font-bold">Canal</th>
                <th className="py-3.5 px-4 font-bold">Janela 24h Meta</th>
                <th className="py-3.5 px-4 font-bold">Tags</th>
                <th className="py-3.5 px-4 font-bold">Última Interação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-300">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={contact.name}
                        handle={contact.handle}
                        avatar={contact.avatar}
                        channel={contact.channel}
                        size="sm"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{contact.handle}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      contact.channel === 'instagram' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {contact.channel === 'instagram' ? <InstagramIcon className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                      <span className="capitalize">{contact.channel}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {contact.windowHoursRemaining > 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{contact.windowHoursRemaining}h restantes (Aberta)</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium">Janela Expirada</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, tidx) => (
                        <span key={tidx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {contact.lastInteraction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
