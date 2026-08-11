import React, { useState } from 'react';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Globe, Mail, Phone, FileText } from 'lucide-react';
import { ONG, AreaAtuacao } from '../types';
import { INITIAL_GOVERNANCE_REQUIREMENTS } from '../mockData';

interface OnboardingFormProps {
  onRegisterSuccess: (ong: ONG) => void;
  existingOngs: ONG[];
  onSelectOng: (ong: ONG) => void;
}

const AREAS: AreaAtuacao[] = [
  'Educação e Pesquisa',
  'Assistência Social',
  'Saúde e Pessoas com Deficiência',
  'Meio Ambiente e Causa Animal',
  'Cultura e Arte',
  'Esporte e Lazer',
  'Direitos Humanos e Cidadania',
  'Desenvolvimento Comunitário',
];

const UF_LIST = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  onRegisterSuccess,
  existingOngs,
  onSelectOng,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '',
    cnpj: '',
    areaAtuacao: 'Educação e Pesquisa' as AreaAtuacao,
    state: 'SP',
    city: 'São Paulo',
    foundingYear: 2021,
    mission: '',
    summary: '',
    email: '',
    phone: '',
    website: '',
    pixKey: '',
    activeBeneficiariesCount: 150,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.cnpj.trim() || !formData.email.trim()) {
      setErrorMsg('Por favor, preencha os campos obrigatórios: Razão Social, CNPJ e E-mail.');
      return;
    }

    setLoading(true);

    const newOng: ONG = {
      id: `ong-${Date.now()}`,
      name: formData.name,
      tradeName: formData.tradeName || formData.name,
      cnpj: formData.cnpj,
      areaAtuacao: formData.areaAtuacao,
      state: formData.state,
      city: formData.city,
      foundingYear: Number(formData.foundingYear) || 2022,
      mission: formData.mission || 'Promover a transformação social e comunitária através de projetos sustentáveis.',
      summary: formData.summary || 'Organização comprometida com a transparência e impacto social medido.',
      email: formData.email,
      phone: formData.phone || '(11) 90000-0000',
      website: formData.website,
      pixKey: formData.pixKey || formData.cnpj,
      maturityLevel: 'Bronze',
      governanceScore: 60,
      requirements: INITIAL_GOVERNANCE_REQUIREMENTS.map(r => ({ ...r })),
      totalRaisedR$: 0,
      activeBeneficiariesCount: Number(formData.activeBeneficiariesCount) || 100,
      verifiedStatus: true,
      createdAt: new Date().toISOString(),
    };

    try {
      // Send to Express Backend API
      const response = await fetch('/api/ongs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOng),
      });

      const resData = await response.json();
      if (resData.success) {
        onRegisterSuccess(resData.data);
      } else {
        // Local fallback if API error
        onRegisterSuccess(newOng);
      }
    } catch (err) {
      console.warn('Backend API unreachable, using local state:', err);
      onRegisterSuccess(newOng);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Intro Hero - High Density Dark Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Jornada do Doador & Governança da ONG
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-800 text-indigo-300 border border-slate-700 rounded">
                MROSC Lei 13.019/14
              </span>
            </div>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Cadastre sua Organização da Sociedade Civil (OSC) para diagnosticar a regularidade jurídica, habilitar a captação via Leis de Incentivo (FIA, Rouanet, Esporte) e obter o <strong className="text-white font-semibold">Selo de Maturidade ONGanizator</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Select Existing or Register New */}
      {existingOngs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Organizações cadastradas ({existingOngs.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {existingOngs.map(ong => (
              <div
                key={ong.id}
                onClick={() => onSelectOng(ong)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {ong.state} • {ong.city}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      SELO {ong.maturityLevel.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 text-sm">
                    {ong.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {ong.mission}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Score: {ong.governanceScore}/100</span>
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    Acessar <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-3 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Cadastrar Nova Organização (ONG)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preencha os dados institucionais para iniciar a avaliação de governança.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">* Campos obrigatórios</span>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Razão Social (Estatuto) *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Associação Beneficente Mãos Unidas"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome Fantasia / Marca
              </label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
                placeholder="Ex: Mãos Unidas Social"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                CNPJ *
              </label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0001-00"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Área Principal de Atuação *
              </label>
              <select
                name="areaAtuacao"
                value={formData.areaAtuacao}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {AREAS.map(area => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Estado (UF) *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {UF_LIST.map(uf => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Cidade de Sede *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: Recife"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ano de Fundação
              </label>
              <input
                type="number"
                name="foundingYear"
                value={formData.foundingYear}
                onChange={handleChange}
                min="1950"
                max="2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chave PIX da Instituição
              </label>
              <input
                type="text"
                name="pixKey"
                value={formData.pixKey}
                onChange={handleChange}
                placeholder="CNPJ, E-mail ou Aleatória"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                E-mail Institucional *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@ong.org.br"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(81) 99999-8888"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Missão e Propósito Social
            </label>
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva a razão de existir da organização, o público atendido e o impacto pretendido..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Cadastrando...</span>
              ) : (
                <>
                  <span>Cadastrar & Iniciar Governança</span>
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
