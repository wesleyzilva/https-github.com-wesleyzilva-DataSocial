import React, { useState } from 'react';
import { Plus, HeartHandshake, Calculator, FileCheck, Layers, DollarSign, CheckCircle2, Coins, ArrowUpRight, Share2, Sparkles } from 'lucide-react';
import { ONG, Project, MecanismoCaptacao, DonorSimulation } from '../types';

interface ProjectManagerProps {
  ong: ONG;
  projects: Project[];
  onAddProject: (newProject: Project) => void;
  onDonate: (projectId: string, amountR$: number, donorName: string) => void;
}

const MECANISMOS: MecanismoCaptacao[] = [
  'FIA',
  'Lei Rouanet',
  'Lei do Esporte',
  'PRONON / PRONAS',
  'Fundo do Idoso',
  'MROSC / Parceria Pública',
  'Doação Direta PIX',
  'Investimento Social Privado',
];

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  ong,
  projects,
  onAddProject,
  onDonate,
}) => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [donationModalProject, setDonationModalProject] = useState<Project | null>(null);
  const [donationAmount, setDonationAmount] = useState(100);
  const [donorName, setDonorName] = useState('');

  // Tax Simulator state
  const [donorType, setDonorType] = useState<'PF' | 'PJ'>('PF');
  const [incomeR$, setIncomeR$] = useState(120000);
  const [simulatedContribution, setSimulatedContribution] = useState(5000);

  // Form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    summary: '',
    description: '',
    mecanismo: 'FIA' as MecanismoCaptacao,
    targetAmountR$: 100000,
    beneficiariesCount: 200,
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    item1: 'Equipamentos e Insumos',
    item1Amount: 50000,
    item2: 'Equipe Pedagógica / Técnica',
    item2Amount: 50000,
  });

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      ongId: ong.id,
      ongName: ong.name,
      title: projectForm.title,
      summary: projectForm.summary || 'Projeto aprovado para captação de recursos.',
      description: projectForm.description || 'Descrição detalhada das etapas de execução, público atendido e cronograma.',
      mecanismo: projectForm.mecanismo,
      targetAmountR$: Number(projectForm.targetAmountR$) || 100000,
      raisedAmountR$: 0,
      odsList: [4, 10],
      beneficiariesCount: Number(projectForm.beneficiariesCount) || 150,
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      status: 'Em Captação',
      imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
      budgetBreakdown: [
        { item: projectForm.item1, amountR$: Number(projectForm.item1Amount) || 50000 },
        { item: projectForm.item2, amountR$: Number(projectForm.item2Amount) || 50000 },
      ],
    };

    setShowNewProjectModal(false);
    onAddProject(newProject);
  };

  const handleConfirmDonation = () => {
    if (!donationModalProject) return;
    onDonate(donationModalProject.id, donationAmount, donorName || 'Apoiador Anônimo');
    setDonationModalProject(null);
  };

  // Calculate tax deduction simulation
  // PF: up to 6% of IRPF due
  // PJ: up to 1% of IRPJ due (Lucro Real)
  const estimatedTaxDue = donorType === 'PF' ? incomeR$ * 0.15 : incomeR$ * 0.15;
  const maxDeductible = donorType === 'PF' ? estimatedTaxDue * 0.06 : estimatedTaxDue * 0.01;
  const actualDeduction = Math.min(simulatedContribution, maxDeductible);
  const netCost = simulatedContribution - actualDeduction;

  const ongProjects = projects.filter(p => p.ongId === ong.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Hero Header - High Density */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono font-semibold text-[11px] uppercase tracking-wider mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              Gestão de Projetos & Captação
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Captação de Recursos (Incentivos Fiscais & PIX)
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Crie projetos estruturados para FIA, Lei Rouanet, Esporte e Doação Direta. Simule o abatimento de Imposto de Renda para Pessoas Físicas e Jurídicas.
            </p>
          </div>

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 font-mono">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Calculadora de Abatimento de Imposto de Renda (Incentivo Fiscal)
            </h2>
            <p className="text-[11px] text-slate-500">
              Pessoas Físicas (Declaração Completa) abatem até 6% do IR devido. Empresas no Lucro Real até 1%.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tipo de Doador
              </label>
              <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 font-mono">
                <button
                  onClick={() => setDonorType('PF')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded transition-all ${
                    donorType === 'PF'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  PF (Pessoa Física)
                </button>
                <button
                  onClick={() => setDonorType('PJ')}
                  className={`flex-1 py-1 text-[11px] font-bold rounded transition-all ${
                    donorType === 'PJ'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  PJ (Lucro Real)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1">
                Renda / Lucro Anual (R$)
              </label>
              <input
                type="number"
                value={incomeR$}
                onChange={e => setIncomeR$(Number(e.target.value))}
                step="5000"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1">
                Aporte Simulado (R$)
              </label>
              <input
                type="number"
                value={simulatedContribution}
                onChange={e => setSimulatedContribution(Number(e.target.value))}
                step="500"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Limite Máximo
                </span>
                <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">
                  R$ {maxDeductible.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-500">
                  {donorType === 'PF' ? '6% do IRPF' : '1% do IRPJ'}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Abatimento no Leão
                </span>
                <span className="text-base font-extrabold text-indigo-700 mt-0.5 block">
                  R$ {actualDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-500">
                  Economia direta
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Custo Efetivo Real
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  R$ {netCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-500">
                  {netCost === 0 ? 'Dedução integral' : 'Desembolso real'}
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Ao direcionar seu imposto para o projeto aprovado da <strong className="font-semibold">{ong.name}</strong>, seu dinheiro fortalece sua comunidade.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Projetos Ativos de Captação ({projects.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => {
            const progress = Math.min(Math.round((p.raisedAmountR$ / p.targetAmountR$) * 100), 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 relative bg-slate-100">
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900/90 text-white shadow-sm">
                        {p.mecanismo}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-700 text-white shadow-sm">
                        {p.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-mono font-semibold text-indigo-600">
                      {p.ongName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {p.summary}
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-1 font-mono">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-900">
                          R$ {p.raisedAmountR$.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Meta: R$ {p.targetAmountR$.toLocaleString('pt-BR')} ({progress}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 mt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Impacto: <strong className="text-slate-800">{p.beneficiariesCount} pessoas</strong>
                  </span>

                  <button
                    onClick={() => setDonationModalProject(p)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Apoiar / Doar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-stone-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-lg text-stone-900">Cadastrar Novo Projeto de Captação</h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={e => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Horta Comunitária e Nutrição Infantil"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mecanismo de Captação
                  </label>
                  <select
                    value={projectForm.mecanismo}
                    onChange={e => setProjectForm(prev => ({ ...prev, mecanismo: e.target.value as MecanismoCaptacao }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none bg-white"
                  >
                    {MECANISMOS.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Meta Financeira (R$) *
                  </label>
                  <input
                    type="number"
                    value={projectForm.targetAmountR$}
                    onChange={e => setProjectForm(prev => ({ ...prev, targetAmountR$: Number(e.target.value) }))}
                    step="5000"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Resumo Executivo
                </label>
                <textarea
                  value={projectForm.summary}
                  onChange={e => setProjectForm(prev => ({ ...prev, summary: e.target.value }))}
                  rows={2}
                  placeholder="Resumo em 2 linhas sobre os objetivos e entregáveis..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                >
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donation Simulation Modal */}
      {donationModalProject && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700">Apoio ao Projeto</span>
                <h3 className="font-bold text-base text-stone-900">{donationModalProject.title}</h3>
              </div>
              <button onClick={() => setDonationModalProject(null)} className="text-stone-400 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Seu Nome / Razão Social</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Valor da Doação Simulatória (R$)</label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={e => setDonationAmount(Number(e.target.value))}
                  step="50"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-700 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-100 text-xs text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Chave PIX da ONG:</span>
                  <strong className="text-stone-900 font-mono">{ong.pixKey || ong.cnpj}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mecanismo:</span>
                  <strong className="text-stone-900">{donationModalProject.mecanismo}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmDonation}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Confirmar Doação & Atualizar Total
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
