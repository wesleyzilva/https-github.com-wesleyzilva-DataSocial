import React, { useState } from 'react';
import {
  Scale,
  Briefcase,
  TrendingUp,
  DollarSign,
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calculator,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Kanban,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ONG, Project } from '../types';

interface AdvogadoDashboardProps {
  ongs: ONG[];
  projects: Project[];
}

interface CRMLead {
  id: string;
  donorName: string;
  projectName: string;
  ongName: string;
  estimatedValueR$: number;
  stage: 'backlog' | 'prospeccao' | 'em_andamento' | 'finalizado';
  trafficLight: 'verde' | 'amarelo' | 'vermelho';
  nextStep: string;
  mecanismo: string;
}

export const AdvogadoDashboard: React.FC<AdvogadoDashboardProps> = ({ ongs, projects }) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'calculator' | 'laws' | 'proposal'>('kanban');

  // Initial CRM Leads
  const [leads, setLeads] = useState<CRMLead[]>([
    {
      id: 'lead-1',
      donorName: 'Itaú Unibanco (Lucro Real)',
      projectName: 'Escola de Música Jovem',
      ongName: 'Instituto Esperança',
      estimatedValueR$: 150000,
      stage: 'em_andamento',
      trafficLight: 'verde',
      nextStep: 'Aguardando parecer do comitê de sustentabilidade',
      mecanismo: 'Lei Rouanet'
    },
    {
      id: 'lead-2',
      donorName: 'Klabin Paraná',
      projectName: 'Reflorestamento e Horta Comunitária',
      ongName: 'Associação Verde Vida',
      estimatedValueR$: 80000,
      stage: 'prospeccao',
      trafficLight: 'amarelo',
      nextStep: 'Apresentar certidão MROSC atualizada',
      mecanismo: 'MROSC / Fundo Meio Ambiente'
    },
    {
      id: 'lead-3',
      donorName: 'Gerdau Aços',
      projectName: 'Inclusão Digital para Idosos',
      ongName: 'Instituto Esperança',
      estimatedValueR$: 120000,
      stage: 'backlog',
      trafficLight: 'verde',
      nextStep: 'Marcar reunião inicial com área de ESG',
      mecanismo: 'Fundo do Idoso'
    },
    {
      id: 'lead-4',
      donorName: 'Banco BTG Pactual',
      projectName: 'Esporte e Cidadania na Periferia',
      ongName: 'Fundação Atleta do Futuro',
      estimatedValueR$: 200000,
      stage: 'finalizado',
      trafficLight: 'verde',
      nextStep: 'Aporte realizado e contrato de intermediação assinado',
      mecanismo: 'Lei do Esporte'
    }
  ]);

  // Split calculation state
  const [splitProjectValue, setSplitProjectValue] = useState<number>(250000);
  const [lawFeePercent, setLawyerFeePercent] = useState<number>(6); // 6% para o advogado captador
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(2); // 2% para DataSocial
  const [accountantFeePercent, setAccountantFeePercent] = useState<number>(1); // 1% para prestação de contas

  const lawyerAmount = (splitProjectValue * lawFeePercent) / 100;
  const platformAmount = (splitProjectValue * platformFeePercent) / 100;
  const accountantAmount = (splitProjectValue * accountantFeePercent) / 100;
  const ongAmount = splitProjectValue - (lawyerAmount + platformAmount + accountantAmount);

  const totalCRMValue = leads.reduce((acc, l) => acc + l.estimatedValueR$, 0);
  const totalProjectedCommission = (totalCRMValue * lawFeePercent) / 100;

  const moveLead = (leadId: string, newStage: CRMLead['stage']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-mono">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Painel do Advogado & Captador
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800 rounded">
                  Incentivo Fiscal & CRM
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Gestão de prospecção comercial, enquadramento nas leis de incentivo, emissão de pareceres de elegibilidade MROSC e cálculo de comissão de intermediação.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-lg text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Comissão Projetada</span>
              <span className="text-base font-extrabold text-amber-400">
                R$ {totalProjectedCommission.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-5 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'kanban' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>CRM de Captação</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'calculator' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Split & Honorários</span>
          </button>

          <button
            onClick={() => setActiveTab('laws')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'laws' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Radar de Leis de Incentivo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Oportunidades em CRM</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{leads.length} Negociações</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pipeline Mapeado</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
              R$ {totalCRMValue.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Projetos Elegíveis</span>
            <span className="text-xl font-extrabold text-indigo-700 mt-0.5 block">{projects.length} Cadastrados</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Conformidade MROSC</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">100% Auditável</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 1: Kanban CRM */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Kanban className="w-4 h-4 text-amber-600" />
              <span>Funil de Prospecção & Captação Tributária</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Clique nos botões para mover negociações entre as etapas do funil
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            {/* Column 1: Backlog */}
            <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-xs text-slate-700">
                <span>1. Backlog</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full font-mono text-[10px]">
                  {leads.filter(l => l.stage === 'backlog').length}
                </span>
              </div>
              {leads.filter(l => l.stage === 'backlog').map(lead => (
                <div key={lead.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900">{lead.donorName}</span>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      lead.trafficLight === 'verde' ? 'bg-emerald-500' : lead.trafficLight === 'amarelo' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} title={`Sinalização: ${lead.trafficLight}`} />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{lead.projectName} ({lead.ongName})</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold pt-1 border-t border-slate-100">
                    <span>R$ {lead.estimatedValueR$.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{lead.mecanismo}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Próximo passo: {lead.nextStep}</p>
                  <button
                    onClick={() => moveLead(lead.id, 'prospeccao')}
                    className="w-full text-center py-1 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 font-bold text-[10px] rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Avançar para Prospecção</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Column 2: Prospecção */}
            <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-xs text-amber-800">
                <span>2. Em Prospecção</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-mono text-[10px]">
                  {leads.filter(l => l.stage === 'prospeccao').length}
                </span>
              </div>
              {leads.filter(l => l.stage === 'prospeccao').map(lead => (
                <div key={lead.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900">{lead.donorName}</span>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      lead.trafficLight === 'verde' ? 'bg-emerald-500' : lead.trafficLight === 'amarelo' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} title={`Sinalização: ${lead.trafficLight}`} />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{lead.projectName} ({lead.ongName})</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold pt-1 border-t border-slate-100">
                    <span>R$ {lead.estimatedValueR$.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">{lead.mecanismo}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Próximo passo: {lead.nextStep}</p>
                  <button
                    onClick={() => moveLead(lead.id, 'em_andamento')}
                    className="w-full text-center py-1 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 font-bold text-[10px] rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Avançar para Negociação</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Column 3: Em Andamento */}
            <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-xs text-indigo-800">
                <span>3. Em Negociação</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full font-mono text-[10px]">
                  {leads.filter(l => l.stage === 'em_andamento').length}
                </span>
              </div>
              {leads.filter(l => l.stage === 'em_andamento').map(lead => (
                <div key={lead.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900">{lead.donorName}</span>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      lead.trafficLight === 'verde' ? 'bg-emerald-500' : lead.trafficLight === 'amarelo' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} title={`Sinalização: ${lead.trafficLight}`} />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{lead.projectName} ({lead.ongName})</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold pt-1 border-t border-slate-100">
                    <span>R$ {lead.estimatedValueR$.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded">{lead.mecanismo}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Próximo passo: {lead.nextStep}</p>
                  <button
                    onClick={() => moveLead(lead.id, 'finalizado')}
                    className="w-full text-center py-1 bg-emerald-600 text-white font-bold text-[10px] rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Finalizar & Confirmar Aporte</span>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Column 4: Finalizado */}
            <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-xs text-emerald-800">
                <span>4. Aporte Concluído</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-mono text-[10px]">
                  {leads.filter(l => l.stage === 'finalizado').length}
                </span>
              </div>
              {leads.filter(l => l.stage === 'finalizado').map(lead => (
                <div key={lead.id} className="bg-white p-3 rounded-lg border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900">{lead.donorName}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{lead.projectName} ({lead.ongName})</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold pt-1 border-t border-slate-100">
                    <span>R$ {lead.estimatedValueR$.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">{lead.mecanismo}</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-bold">✓ Contrato assinado & Recibo emitido</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Calculator / Split */}
      {activeTab === 'calculator' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <span>Calculadora Transparente de Split de Intermediação</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conforme diretrizes de governança (13.4): o advogado de captação origina o negócio e retém honorários transparentes com repasse direto via gateway de pagamentos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Valor Total do Aporte / Projeto (R$)
                </label>
                <input
                  type="number"
                  value={splitProjectValue}
                  onChange={e => setSplitProjectValue(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Advogado (Captador %)
                  </label>
                  <input
                    type="number"
                    value={lawFeePercent}
                    onChange={e => setLawyerFeePercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Plataforma DataSocial (%)
                  </label>
                  <input
                    type="number"
                    value={platformFeePercent}
                    onChange={e => setPlatformFeePercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contador OSC (%)
                  </label>
                  <input
                    type="number"
                    value={accountantFeePercent}
                    onChange={e => setAccountantFeePercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-cyan-700"
                  />
                </div>
              </div>
            </div>

            {/* Split Result Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-sans font-extrabold text-slate-900">
                <span>Resultado do Split Automático</span>
                <span>100% Auditável</span>
              </div>

              <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded border border-amber-200 font-bold text-amber-900">
                <span>Advogado Captador ({lawFeePercent}%):</span>
                <span>R$ {lawyerAmount.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center bg-indigo-50 p-2.5 rounded border border-indigo-200 font-bold text-indigo-900">
                <span>Plataforma DataSocial ({platformFeePercent}%):</span>
                <span>R$ {platformAmount.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center bg-cyan-50 p-2.5 rounded border border-cyan-200 font-bold text-cyan-900">
                <span>Contador OSC / Prestação ({accountantFeePercent}%):</span>
                <span>R$ {accountantAmount.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center bg-emerald-100 p-2.5 rounded border border-emerald-300 font-extrabold text-emerald-950 text-sm">
                <span>Recurso Líquido para a ONG:</span>
                <span>R$ {ongAmount.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Laws & Regulation Radar */}
      {activeTab === 'laws' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Radar Regulatório de Leis de Incentivo Tributário</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mapeamento jurídico das principais leis federais para orientar o enquadramento de doações empresariais (Lucro Real) e individuais.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-sm">Lei Rouanet (Lei 8.313/1991)</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono text-[10px]">Cultura</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Permite dedução de até 4% do IRPJ devido para PJs no Lucro Real e até 6% no IRPF. Projetos aprovados pelo Ministério da Cultura.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-sm">Lei de Incentivo ao Esporte (Lei 11.438/2006)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono text-[10px]">Esporte</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Abatimento de até 2% do IRPJ (PJ) e 7% do IRPF. Projetos para desporto educacional, de participação ou de rendimento.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-sm">FIA - Fundo da Infância e Adolescência (ECA)</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-mono text-[10px]">Criança</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Dedução de até 1% do IRPJ devido e 6% do IRPF para projetos direcionados a fundos municipais, estaduais ou nacionais da infância.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-sm">Fundo do Idoso (Lei 12.213/2010)</span>
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-900 rounded font-mono text-[10px]">Terceira Idade</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Abatimento de até 1% do IRPJ e 6% do IRPF para proteção, convivência e saúde de idosos cadastrados em conselhos municipais.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
