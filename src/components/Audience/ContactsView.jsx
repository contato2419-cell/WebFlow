import React, { useState } from 'react';
import { Users, Search, Tag, Clock, ShieldCheck, MessageCircle, Filter } from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            Contatos & Audiência Unificada (CRM)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visualização de leads capturados no Instagram e WhatsApp com status da Janela de 24 horas da Meta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            Total: {contacts.length} Contatos
          </span>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, tag ou @handle..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              channelFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setChannelFilter('instagram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              channelFilter === 'instagram' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setChannelFilter('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              channelFilter === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            WhatsApp
          </button>
        </div>
      </div>

      {/* Tabela de Contatos */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Contato</th>
                <th className="py-3.5 px-4 font-semibold">Canal</th>
                <th className="py-3.5 px-4 font-semibold">Janela 24h Meta</th>
                <th className="py-3.5 px-4 font-semibold">Tags de Segmentação</th>
                <th className="py-3.5 px-4 font-semibold">Última Interação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-white">{contact.name}</p>
                        <p className="text-[11px] text-slate-400">{contact.handle}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      contact.channel === 'instagram' 
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    }`}>
                      {contact.channel === 'instagram' ? <InstagramIcon className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                      <span className="capitalize">{contact.channel}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {contact.windowHoursRemaining > 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{contact.windowHoursRemaining}h restantes (Aberta)</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">Janela Fechada</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, tidx) => (
                        <span key={tidx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
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
