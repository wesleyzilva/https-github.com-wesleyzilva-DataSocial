import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Target,
  FileCheck,
  CheckCircle2,
  Calculator,
  HeartHandshake,
  ExternalLink,
  Award,
  Sparkles,
  PieChart,
  ShieldCheck,
  Users
} from 'lucide-react';
import { ONG, Project, Investor } from '../types';
import { InvestorList } from './InvestorList';

interface InvestidorDashboardProps {
  ongs: ONG[];
  projects: Project[];
  investors: Investor[];
  onDonate?: (projectId: string, amountR$: number, donorName: string) => void;
  onUpdateInvestor: (updated: Investor) => Promise<void> | void;
  onDeleteInvestor?: (id: string) => Promise<void> | void;
  onRefreshFromSheets?: () => Promise<void> | void;
  isRefreshingSheets?: boolean;
}

export const InvestidorDashboard: React.FC<InvestidorDashboardProps> = ({
  ongs,
  projects,
  investors,
  onDonate,
  onUpdateInvestor,
  onDeleteInvestor,
  onRefreshFromSheets,
  isRefreshingSheets = false,
}) => {
  const [activeTab, setActiveTab] = useState<'investors' | 'calculator' | 'matches'>('investors');

  // Donation Simulation State
  const [estimatedTaxR$, setEstimatedTaxR$] = useState<number>(1000000); // R$ 1 Milhão de Imposto de Renda devido
  const [selectedLaw, setSelectedLaw] = useState<string>('Rouanet (4%)');

  // Calculates 4% for Rouanet, 2% for Esporte, 1% for FIA
  const getDeductionCap = () => {
    if (selectedLaw.includes('Rouanet')) return estimatedTaxR$ * 0.04;
    if (selectedLaw.includes('Esporte')) return estimatedTaxR$ * 0.02;
    return estimatedTaxR$ * 0.01;
  };

  const maxDeductionR$ = getDeductionCap();

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-mono">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Portal do Investidor & Doador Corporativo
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  Lucro Real & ESG
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Transforme impostos devidos em impacto social mensurável. Simule deduções tributárias IRPJ/IRPF e direcione recursos para projetos auditados pelo MROSC.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-lg text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Potencial de Abatimento</span>
              <span className="text-base font-extrabold text-emerald-400">
                R$ {maxDeductionR$.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-5 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('investors')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'investors' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Investidores Mapeados & Sheet ({investors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'calculator' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Simulador do Imposto Deferido</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'matches' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Projetos Elegíveis Mapeados ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Imposto Estimado</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              R$ {estimatedTaxR$.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Teto Abatível ({selectedLaw})</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
              R$ {maxDeductionR$.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Custo Efetivo da Doação</span>
            <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">R$ 0,00 (100% Abatível)</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Projetos Elegíveis</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{projects.length} Aprovados</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 0: Investors List & Google Sheets Sync */}
      {activeTab === 'investors' && (
        <InvestorList
          investors={investors}
          onUpdateInvestor={onUpdateInvestor}
          onDeleteInvestor={onDeleteInvestor}
          onRefreshFromSheets={onRefreshFromSheets}
          isRefreshing={isRefreshingSheets}
        />
      )}

      {/* Tab 1: Tax Simulation */}
      {activeTab === 'calculator' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Simulador de Abatimento Tributário IRPJ / IRPF</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calcule o limite exato que a sua empresa pode aportar via Leis de Incentivo sem aumentar a carga tributária final.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Imposto de Renda Devido Estimado (R$)
                </label>
                <input
                  type="number"
                  value={estimatedTaxR$}
                  onChange={e => setEstimatedTaxR$(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mecanismo / Lei de Incentivo Escolhida
                </label>
                <select
                  value={selectedLaw}
                  onChange={e => setSelectedLaw(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-sans text-slate-800 outline-none bg-white"
                >
                  <option value="Rouanet (4%)">Lei Rouanet (Até 4% do IRPJ)</option>
                  <option value="Esporte (2%)">Lei de Incentivo ao Esporte (Até 2% do IRPJ)</option>
                  <option value="FIA (1%)">FIA - Fundo da Infância e Adolescência (Até 1% do IRPJ)</option>
                  <option value="Idoso (1%)">Fundo do Idoso (Até 1% do IRPJ)</option>
                  <option value="PRONON (1%)">PRONON - Oncologia (Até 1% do IRPJ)</option>
                  <option value="PRONAS (1%)">PRONAS - Pessoa com Deficiência (Até 1% do IRPJ)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="font-sans font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Resumo da Economia Fiscal:
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>Imposto Devido sem incentivo:</span>
                <span className="font-bold">R$ {estimatedTaxR$.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center bg-emerald-100 p-2.5 rounded border border-emerald-300 font-extrabold text-emerald-950">
                <span>Aporte Dedutível Recomendado:</span>
                <span>R$ {maxDeductionR$.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>Imposto a Recolher após Dedução:</span>
                <span className="font-bold">R$ {(estimatedTaxR$ - maxDeductionR$).toLocaleString('pt-BR')}</span>
              </div>

              <div className="text-[11px] text-emerald-800 font-sans font-medium pt-2 border-t border-slate-200">
                ✓ O recurso é 100% abatido do IRPJ a pagar no exercício seguinte.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Project Matches */}
      {activeTab === 'matches' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Projetos Destaque Mapeados para Aporte</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Projetos com selo de maturidade MROSC e alinhamento com os Objetivos de Desenvolvimento Sustentável (ODS da ONU).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{p.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold shrink-0">
                      {p.mecanismo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.summary}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 font-mono text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Meta de Captação:</span>
                    <span className="font-bold">R$ {p.targetAmountR$.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Captado até o momento:</span>
                    <span>R$ {p.raisedAmountR$.toLocaleString('pt-BR')}</span>
                  </div>

                  <button
                    onClick={() => onDonate && onDonate(p.id, 10000, 'Empresa Doadora')}
                    className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Realizar Aporte Direct / Incentivado</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
