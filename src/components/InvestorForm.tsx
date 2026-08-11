import React, { useState } from 'react';
import { Building2, Plus, CheckCircle2, DollarSign, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export interface Investor {
  id: string;
  name: string;
  cnpj: string;
  type: 'Lucro Real' | 'Lucro Presumido' | 'Pessoa Física' | 'Fundação Empresarial';
  totalDeductibleBudgetR$: number;
  contactPerson: string;
  email: string;
  phone: string;
  preferredAreas: string[];
  preferredIncentiveLaws: string[];
  createdAt: string;
}

interface InvestorFormProps {
  onRegisterSuccess: (newInvestor: Investor) => void;
  existingInvestors: Investor[];
}

export const InvestorForm: React.FC<InvestorFormProps> = ({
  onRegisterSuccess,
  existingInvestors,
}) => {
  const [form, setForm] = useState({
    name: '',
    cnpj: '',
    type: 'Lucro Real' as const,
    totalDeductibleBudgetR$: 500000,
    contactPerson: '',
    email: '',
    phone: '',
    preferredAreas: 'Educação, Meio Ambiente',
    preferredIncentiveLaws: 'Lei Rouanet, FIA',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);

    const newInv: Investor = {
      id: `inv-${Date.now()}`,
      name: form.name,
      cnpj: form.cnpj || '00.000.000/0001-00',
      type: form.type,
      totalDeductibleBudgetR$: Number(form.totalDeductibleBudgetR$) || 100000,
      contactPerson: form.contactPerson || 'Gestor de ESG / Investimento Social',
      email: form.email || 'investimento@empresa.com.br',
      phone: form.phone || '(11) 98888-7777',
      preferredAreas: form.preferredAreas.split(',').map(s => s.trim()),
      preferredIncentiveLaws: form.preferredIncentiveLaws.split(',').map(s => s.trim()),
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onRegisterSuccess(newInv);
      setSuccessMsg(`Investidor "${newInv.name}" cadastrado com sucesso!`);
      setLoading(false);
      setForm({
        name: '',
        cnpj: '',
        type: 'Lucro Real',
        totalDeductibleBudgetR$: 500000,
        contactPerson: '',
        email: '',
        phone: '',
        preferredAreas: 'Educação, Meio Ambiente',
        preferredIncentiveLaws: 'Lei Rouanet, FIA',
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-mono">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Cadastro de Investidor / Empresa Doadora
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                Lucro Real & Isenção
              </span>
            </div>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Cadastre empresas tributadas pelo Lucro Real ou fundações corporativas com orçamento para destinação via Leis de Incentivo Fiscal (IRPJ / IRPF).
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* List of Registered Investors */}
      {existingInvestors.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Investidores Mapeados ({existingInvestors.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {existingInvestors.map(inv => (
              <div key={inv.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    {inv.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {inv.cnpj}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{inv.name}</h3>
                <div className="text-xs text-slate-600 font-mono">
                  Orçamento: <strong className="text-emerald-700">R$ {inv.totalDeductibleBudgetR$.toLocaleString('pt-BR')}</strong>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {inv.preferredIncentiveLaws.map((law, idx) => (
                    <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {law}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-3 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Novo Investidor Corporativo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Informe a capacidade tributária e preferências de destinação social.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Razão Social / Nome da Empresa *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Klabin S.A. / Itaú Unibanco"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                CNPJ
              </label>
              <input
                type="text"
                value={form.cnpj}
                onChange={e => setForm(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0001-00"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Regime Tributário / Perfil
              </label>
              <select
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="Lucro Real">Lucro Real (Permite Abatimento de IRPJ)</option>
                <option value="Lucro Presumido">Lucro Presumido (Aportes Diretos ESG)</option>
                <option value="Fundação Empresarial">Fundação Empresarial / Instituto</option>
                <option value="Pessoa Física">Pessoa Física (Abatimento IRPF Completo)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Orçamento Anual Estimado para Incentivos (R$)
              </label>
              <input
                type="number"
                value={form.totalDeductibleBudgetR$}
                onChange={e => setForm(prev => ({ ...prev, totalDeductibleBudgetR$: Number(e.target.value) }))}
                step="10000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome do Contato ESG / RI
              </label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={e => setForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Ex: Carlos Eduardo - Gerente de Impacto"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="esg@empresa.com.br"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Leis de Incentivo Preferenciais (Separadas por vírgula)
              </label>
              <input
                type="text"
                value={form.preferredIncentiveLaws}
                onChange={e => setForm(prev => ({ ...prev, preferredIncentiveLaws: e.target.value }))}
                placeholder="Ex: Lei Rouanet, FIA, Esporte"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Áreas de Atuação de Interesse
              </label>
              <input
                type="text"
                value={form.preferredAreas}
                onChange={e => setForm(prev => ({ ...prev, preferredAreas: e.target.value }))}
                placeholder="Ex: Educação, Infância, Meio Ambiente"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <span>Cadastrar Investidor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
