import React, { useState } from 'react';
import {
  Award,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  Building2,
  TrendingUp,
  Download,
  AlertTriangle,
  FileText,
  Sparkles,
  PieChart,
  Eye,
  ExternalLink
} from 'lucide-react';
import { ONG, Project } from '../types';

interface FundacaoDashboardProps {
  ongs: ONG[];
  projects: Project[];
}

export const FundacaoDashboard: React.FC<FundacaoDashboardProps> = ({ ongs, projects }) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'krs' | 'audit'>('risk');

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 font-mono">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Painel da Fundação & Instituto Doador
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800 rounded">
                  Governança & Risco GIFE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Acompanhamento rigoroso de risco reputacional, financeiro e jurídico de projetos apoiados, acompanhamento de KRs e pacote de auditoria de impacto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-lg text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Matriz de Risco</span>
              <span className="text-base font-extrabold text-indigo-400">Baixo Risco (98% Ok)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-5 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('risk')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'risk' ? 'bg-indigo-500 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Matriz de Risco & Due Diligence</span>
          </button>

          <button
            onClick={() => setActiveTab('krs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'krs' ? 'bg-indigo-500 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Acompanhamento de KRs & Metas</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-indigo-500 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Pacote de Evidências & Auditoria</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Projetos Apoiados</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{projects.length} Monitorados</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Impacto Social Direto</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">1.250 Pessoas</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Entregas de Metas (KRs)</span>
            <span className="text-xl font-extrabold text-indigo-700 mt-0.5 block">88% Concluído</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Selos de Maturidade</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">100% Auditável</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 1: Risk Matrix */}
      {activeTab === 'risk' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                <span>Matriz de Risco Jurídico, Financeiro e Reputacional</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Avaliação multidimensional de cada organização parceira conforme o framework MROSC.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Organização (OSC)</th>
                  <th className="p-2.5">Selo Maturidade</th>
                  <th className="p-2.5">Risco Jurídico</th>
                  <th className="p-2.5">Risco Financeiro</th>
                  <th className="p-2.5">Risco Reputacional</th>
                  <th className="p-2.5">Parecer Geral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ongs.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 text-slate-800">
                    <td className="p-2.5 font-bold font-sans">{o.name}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        o.maturityLevel === 'Ouro' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-800'
                      }`}>
                        SELO {o.maturityLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        Baixo (CNDs Ok)
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        Baixo (DRE Ativa)
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        Mínimo (Sem Ações)
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-emerald-700">Aprovado para Parceria</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: KRs & Goals Tracking */}
      {activeTab === 'krs' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>Acompanhamento das Metas (KRs) dos Projetos</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Medição de entregas físicas e financeiras com indicadores qualitativos e quantitativos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {projects.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <span>{p.title} ({p.ongName})</span>
                  <span className="text-emerald-700 font-mono font-bold">85% KR Concluído</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Meta Beneficiários:</span>
                    <span className="font-bold">{p.beneficiariesCount} Pessoas Atendidas</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Orçamento Executado:</span>
                    <span className="font-bold text-emerald-700">R$ {p.raisedAmountR$.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-2 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
