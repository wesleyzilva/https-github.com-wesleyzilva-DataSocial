import React, { useState } from 'react';
import {
  Calculator,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Download,
  Building2,
  FileText,
  FileSpreadsheet,
  Check,
  X,
  Sparkles,
  HelpCircle,
  DollarSign
} from 'lucide-react';
import { ONG, Project } from '../types';

interface ContadorDashboardProps {
  ongs: ONG[];
  projects: Project[];
}

interface FinancialReceipt {
  id: string;
  ongName: string;
  projectName: string;
  item: string;
  valueR$: number;
  date: string;
  category: string;
  status: 'Aprovado' | 'Pendente' | 'Ajuste Solicitado';
  documentName: string;
}

export const ContadorDashboard: React.FC<ContadorDashboardProps> = ({ ongs, projects }) => {
  const [activeTab, setActiveTab] = useState<'compliance' | 'receipts' | 'reports'>('compliance');

  // Receipts pending accounting validation
  const [receipts, setReceipts] = useState<FinancialReceipt[]>([
    {
      id: 'rec-1',
      ongName: 'Instituto Esperança',
      projectName: 'Escola de Música Jovem',
      item: 'Aquisição de Violões e Flautas Infantis',
      valueR$: 12500,
      date: '2026-07-20',
      category: 'Equipamentos e Materiais',
      status: 'Pendente',
      documentName: 'NF-e_2849_LojaMusica.pdf'
    },
    {
      id: 'rec-2',
      ongName: 'Instituto Esperança',
      projectName: 'Escola de Música Jovem',
      item: 'Honorários de Professores de Música',
      valueR$: 8400,
      date: '2026-07-25',
      category: 'Recursos Humanos',
      status: 'Aprovado',
      documentName: 'RPA_07_Professores.pdf'
    },
    {
      id: 'rec-3',
      ongName: 'Associação Verde Vida',
      projectName: 'Reflorestamento e Horta Comunitária',
      item: 'Sementes e Adubo Orgânico',
      valueR$: 3800,
      date: '2026-07-18',
      category: 'Insumos',
      status: 'Ajuste Solicitado',
      documentName: 'CupomFiscal_SemCNPJ.pdf'
    }
  ]);

  const updateReceiptStatus = (id: string, newStatus: FinancialReceipt['status']) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const pendingCount = receipts.filter(r => r.status === 'Pendente').length;
  const approvedCount = receipts.filter(r => r.status === 'Aprovado').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 font-mono">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Painel do Contador OSC (MROSC & CEBAS)
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                  Prestação de Contas & CNDs
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Central de conformidade contábil para o Terceiro Setor: validação de comprovantes, conciliação bancária segregada, certidões negativas e emissão de parecer MROSC (Lei 13.019/2014).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700/80 px-3.5 py-2 rounded-lg text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Comprovantes a Validar</span>
              <span className="text-base font-extrabold text-cyan-400">{pendingCount} Pendentes</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-5 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'compliance' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Matriz MROSC & CNDs</span>
          </button>

          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'receipts' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Conciliação de Comprovantes ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Parecer Contábil & DRE</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">ONGs no Portfólio</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{ongs.length} Clientes OSC</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Certidões Válidas</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">100% CNDs Ok</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Recibos Aprovados</span>
            <span className="text-xl font-extrabold text-indigo-700 mt-0.5 block">{approvedCount} Auditados</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Regime Tributário</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">Isenção / CEBAS</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 1: Compliance MROSC */}
      {activeTab === 'compliance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-600" />
                <span>Checklist MROSC (Lei 13.019/2014) & Status Fiscais</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Validação prévia das certidões e demonstrações contábeis exigidas para recebimento de repasses e parcerias públicas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {ongs.map(ong => (
              <div key={ong.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-sm block">{ong.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">CNPJ: {ong.cnpj}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    ong.maturityLevel === 'Ouro' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-800'
                  }`}>
                    SELO {ong.maturityLevel.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>1. CND Receita Federal / Tributos:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ativa / Negativa
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>2. CRF Fundo de Garantia (FGTS):</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Regular
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>3. CNDT Trabalhista (TST):</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Válida
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span>4. Escrituração Contábil Segregada:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DRE por Projeto
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Receipts Auditing */}
      {activeTab === 'receipts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-600" />
                <span>Auditoria de Comprovantes e Recibos Fiscais</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revise os lançamentos enviados pelas ONGs para garantir o nexo de causalidade entre receita e despesa do projeto.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">ONG / Projeto</th>
                  <th className="p-2.5">Descrição do Item</th>
                  <th className="p-2.5">Categoria</th>
                  <th className="p-2.5 font-mono text-right">Valor (R$)</th>
                  <th className="p-2.5">Documento Anexo</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 text-slate-800">
                    <td className="p-2.5">
                      <div className="font-bold text-slate-900">{rec.ongName}</div>
                      <div className="text-[11px] text-slate-500">{rec.projectName}</div>
                    </td>
                    <td className="p-2.5 font-medium">{rec.item}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                        {rec.category}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      R$ {rec.valueR$.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-cyan-700 underline">
                      {rec.documentName}
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-900' :
                        rec.status === 'Pendente' ? 'bg-amber-100 text-amber-900' :
                        'bg-rose-100 text-rose-900'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateReceiptStatus(rec.id, 'Aprovado')}
                          className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                          title="Aprovar Lançamento"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateReceiptStatus(rec.id, 'Ajuste Solicitado')}
                          className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors cursor-pointer"
                          title="Solicitar Ajuste"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports & DRE */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-600" />
                <span>Emissão do Parecer Contábil MROSC</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidação contábil do exercício e parecer conclusivo para apresentação ao órgão repassador ou doadores.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="font-extrabold text-slate-900 font-sans text-sm">
              Modelo de Parecer Técnico Contábil Emitido:
            </div>
            <p className="text-slate-700 leading-relaxed font-sans">
              "Atestamos que a escrituração contábil e as demonstrações financeiras das ONGs associadas cumprem rigorosamente as Normas Brasileiras de Contabilidade aplicadas ao Terceiro Setor (ITG 2002) e os requisitos de transparência do MROSC (Lei 13.019/2014)."
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-bold font-mono pt-2 border-t border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assinatura Digital & Selo Contábil Ativo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
