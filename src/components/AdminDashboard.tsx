import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Lock,
  Palette,
  FileSpreadsheet,
  CheckCircle2,
  List,
  Sparkles,
  Settings,
  Users,
  Activity
} from 'lucide-react';
import { ONG, Project } from '../types';

interface AdminDashboardProps {
  ongs: ONG[];
  projects: Project[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ ongs, projects }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'whitelabel'>('overview');
  const [brandName, setBrandName] = useState('Data SocIAl');
  const [primaryColor, setPrimaryColor] = useState('Emerald (Esmeralda)');

  const permissionsMatrix = [
    { module: 'Organizações', action: 'Cadastrar / Editar ONG', roles: ['ONG', 'Admin'] },
    { module: 'Organizações', action: 'Visualizar Diagnóstico IA', roles: ['ONG', 'Contador', 'Advogado', 'Admin'] },
    { module: 'Projetos', action: 'Criar / Editar Projeto', roles: ['ONG', 'Admin'] },
    { module: 'Projetos', action: 'Aprovar para Prospecção', roles: ['Advogado', 'Admin'] },
    { module: 'Contabilidade', action: 'Validar Recibos e DRE', roles: ['Contador', 'Admin'] },
    { module: 'Captativo', action: 'Simular Abatimento IR', roles: ['Investidor', 'Advogado', 'Admin'] },
    { module: 'Captação', action: 'Gerenciar CRM & Split', roles: ['Advogado', 'Admin'] },
    { module: 'Auditoria', action: 'Acessar Trilha & Pacote', roles: ['Fundação', 'Contador', 'Admin'] },
    { module: 'Configurações', action: 'White-Label & Permissões', roles: ['Admin'] },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-mono">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Painel do Administrador Geral
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  Governança Monólito
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Supervisão geral do ecossistema Arandu, matriz de permissões por perfil, logs de auditoria e personalização de marca White-label.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-lg text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Conexão Sheets</span>
              <span className="text-base font-extrabold text-emerald-400">Ativa & Monolítica</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-5 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'permissions' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Matriz de Permissões (Roles)</span>
          </button>

          <button
            onClick={() => setActiveTab('whitelabel')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'whitelabel' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>White-Label Data SocIAl</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total de ONGs</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{ongs.length} Ativas</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Projetos Cadastrados</span>
            <span className="text-xl font-extrabold text-indigo-700 mt-0.5 block">{projects.length} Publicados</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <List className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Captação Total</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
              R$ {projects.reduce((acc, p) => acc + p.raisedAmountR$, 0).toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sincronização Google</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">Google Sheets API</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 2: Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span>Matriz de Acesso e Permissões por Perfil</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle de ações e visões configuradas para cada perfil do ecossistema.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Módulo</th>
                  <th className="p-2.5">Ação do Sistema</th>
                  <th className="p-2.5">Perfis Autorizados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 text-slate-800 font-mono">
                    <td className="p-2.5 font-bold font-sans text-indigo-900">{item.module}</td>
                    <td className="p-2.5 font-sans font-medium">{item.action}</td>
                    <td className="p-2.5">
                      <div className="flex flex-wrap gap-1">
                        {item.roles.map(r => (
                          <span key={r} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: White label */}
      {activeTab === 'whitelabel' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span>Configuração White-Label (Data SocIAl)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Personalize nome, identidade e esquema de cores da aplicação para redes parceiras.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome da Marca da Aplicação</label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cor Primária de Destaque</label>
              <select
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white outline-none"
              >
                <option value="Emerald (Esmeralda)">Emerald (Verde Arandu)</option>
                <option value="Indigo">Indigo / Azul Real</option>
                <option value="Amber">Amber / Dourado</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
