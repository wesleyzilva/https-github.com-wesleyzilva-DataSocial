import React, { useState } from 'react';
import {
  Building2,
  Edit2,
  Trash2,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Search,
  RefreshCw,
  X,
  Save,
  FileSpreadsheet,
  Tag,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { Investor } from '../types';

interface InvestorListProps {
  investors: Investor[];
  onUpdateInvestor: (updated: Investor) => Promise<void> | void;
  onDeleteInvestor?: (id: string) => Promise<void> | void;
  onRefreshFromSheets?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

export const InvestorList: React.FC<InvestorListProps> = ({
  investors,
  onUpdateInvestor,
  onDeleteInvestor,
  onRefreshFromSheets,
  isRefreshing = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    cnpj: '',
    type: 'Lucro Real' as Investor['type'],
    totalDeductibleBudgetR$: 0,
    contactPerson: '',
    email: '',
    phone: '',
    preferredAreas: '',
    preferredIncentiveLaws: '',
  });

  const handleStartEdit = (inv: Investor) => {
    setEditingInvestor(inv);
    setEditForm({
      name: inv.name,
      cnpj: inv.cnpj,
      type: inv.type,
      totalDeductibleBudgetR$: inv.totalDeductibleBudgetR$,
      contactPerson: inv.contactPerson || '',
      email: inv.email || '',
      phone: inv.phone || '',
      preferredAreas: (inv.preferredAreas || []).join(', '),
      preferredIncentiveLaws: (inv.preferredIncentiveLaws || []).join(', '),
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestor) return;

    setSaveLoading(true);
    const updated: Investor = {
      ...editingInvestor,
      name: editForm.name.trim() || editingInvestor.name,
      cnpj: editForm.cnpj.trim() || editingInvestor.cnpj,
      type: editForm.type,
      totalDeductibleBudgetR$: Number(editForm.totalDeductibleBudgetR$) || editingInvestor.totalDeductibleBudgetR$,
      contactPerson: editForm.contactPerson.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      preferredAreas: editForm.preferredAreas
        ? editForm.preferredAreas.split(',').map(s => s.trim()).filter(Boolean)
        : editingInvestor.preferredAreas,
      preferredIncentiveLaws: editForm.preferredIncentiveLaws
        ? editForm.preferredIncentiveLaws.split(',').map(s => s.trim()).filter(Boolean)
        : editingInvestor.preferredIncentiveLaws,
    };

    try {
      await onUpdateInvestor(updated);
      setFeedbackMsg(`Investidor "${updated.name}" atualizado e sincronizado com o Google Sheets!`);
      setEditingInvestor(null);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      alert(`Erro ao salvar investidor: ${err.message || err}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (inv: Investor) => {
    if (!window.confirm(`Tem certeza que deseja remover o investidor "${inv.name}"?`)) return;
    if (onDeleteInvestor) {
      try {
        await onDeleteInvestor(inv.id);
        setFeedbackMsg(`Investidor "${inv.name}" removido.`);
        setTimeout(() => setFeedbackMsg(null), 4000);
      } catch (err: any) {
        alert(`Erro ao excluir: ${err.message || err}`);
      }
    }
  };

  const filteredInvestors = investors.filter(inv => {
    const term = searchTerm.toLowerCase();
    return (
      inv.name.toLowerCase().includes(term) ||
      (inv.cnpj && inv.cnpj.toLowerCase().includes(term)) ||
      (inv.contactPerson && inv.contactPerson.toLowerCase().includes(term)) ||
      (inv.preferredIncentiveLaws && inv.preferredIncentiveLaws.some(l => l.toLowerCase().includes(term))) ||
      (inv.preferredAreas && inv.preferredAreas.some(a => a.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Investidores & Patrocinadores Mapeados</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                {investors.length} cadastrados
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Sincronizado bidirecionalmente com Google Sheets e APIs de Captação MROSC.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshFromSheets && (
            <button
              onClick={onRefreshFromSheets}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              title="Buscar dados atualizados no Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Sincronizando...' : 'Atualizar do Sheets'}</span>
            </button>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar investidor ou lei..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Grid of Investor Cards */}
      {filteredInvestors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
          <Building2 className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-bold">Nenhum investidor encontrado para os filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredInvestors.map(inv => (
            <div
              key={inv.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-4 shadow-sm hover:shadow transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {inv.type}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-1.5 leading-snug">{inv.name}</h3>
                  </div>

                  <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    <span>Sheets</span>
                  </span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>CNPJ:</span>
                    <span className="font-bold text-slate-800">{inv.cnpj || 'Não informado'}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-[11px] text-slate-600 font-sans">Orçamento Dedutível:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      R$ {inv.totalDeductibleBudgetR$.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  {inv.contactPerson && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{inv.contactPerson}</span>
                    </div>
                  )}
                  {inv.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono text-[10px]">{inv.email}</span>
                    </div>
                  )}
                  {inv.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[10px]">{inv.phone}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-1.5 pt-1">
                  {inv.preferredIncentiveLaws && inv.preferredIncentiveLaws.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {inv.preferredIncentiveLaws.map((law, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100"
                        >
                          {law}
                        </span>
                      ))}
                    </div>
                  )}

                  {inv.preferredAreas && inv.preferredAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {inv.preferredAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleStartEdit(inv)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Editar no Sheet</span>
                </button>

                {onDeleteInvestor && (
                  <button
                    onClick={() => handleDelete(inv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Excluir Investidor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingInvestor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto font-sans p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Editar Investidor Social</h3>
                  <p className="text-xs text-slate-500">
                    As edições atualizarão a aplicação e serão salvas na planilha do Google Sheets.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingInvestor(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Razão Social / Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={editForm.cnpj}
                    onChange={e => setEditForm(prev => ({ ...prev, cnpj: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Regime Tributário
                  </label>
                  <select
                    value={editForm.type}
                    onChange={e => setEditForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Lucro Real">Lucro Real (Dedução IRPJ)</option>
                    <option value="Lucro Presumido">Lucro Presumido (Aporte Direto)</option>
                    <option value="Fundação Empresarial">Fundação Empresarial</option>
                    <option value="Pessoa Física">Pessoa Física (IRPF)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Orçamento Dedutível Disponível (R$)
                  </label>
                  <input
                    type="number"
                    value={editForm.totalDeductibleBudgetR$}
                    onChange={e => setEditForm(prev => ({ ...prev, totalDeductibleBudgetR$: Number(e.target.value) }))}
                    step="50000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Pessoa de Contato / Cargo
                  </label>
                  <input
                    type="text"
                    value={editForm.contactPerson}
                    onChange={e => setEditForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Ex: Carlos Eduardo - Gerente ESG"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="esg@empresa.com.br"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Telefone de Contato
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Leis de Incentivo Preferenciais
                  </label>
                  <input
                    type="text"
                    value={editForm.preferredIncentiveLaws}
                    onChange={e => setEditForm(prev => ({ ...prev, preferredIncentiveLaws: e.target.value }))}
                    placeholder="FIA, Lei Rouanet, Esporte"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                    Áreas de Interesse Social
                  </label>
                  <input
                    type="text"
                    value={editForm.preferredAreas}
                    onChange={e => setEditForm(prev => ({ ...prev, preferredAreas: e.target.value }))}
                    placeholder="Educação, Cultura, Meio Ambiente"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingInvestor(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveLoading ? 'Salvando no Sheet...' : 'Salvar e Sincronizar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
