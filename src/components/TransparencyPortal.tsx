import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, MapPin, Building2, ExternalLink, Award, FileText, Users, DollarSign, CheckCircle } from 'lucide-react';
import { ONG, AreaAtuacao, MaturityLevel } from '../types';

interface TransparencyPortalProps {
  ongs: ONG[];
  onSelectOng: (ong: ONG) => void;
}

export const TransparencyPortal: React.FC<TransparencyPortalProps> = ({
  ongs,
  onSelectOng,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');

  const filteredOngs = ongs.filter(o => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.cnpj.includes(searchTerm) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea === 'Todas' || o.areaAtuacao === selectedArea;
    const matchesLevel = selectedLevel === 'Todos' || o.maturityLevel === selectedLevel;

    return matchesSearch && matchesArea && matchesLevel;
  });

  const getBadgeStyle = (level: MaturityLevel) => {
    switch (level) {
      case 'Ouro':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-mono font-bold';
      case 'Prata':
        return 'bg-slate-200 text-slate-800 border-slate-300 font-mono font-bold';
      case 'Bronze':
        return 'bg-amber-50 text-amber-900 border-amber-200 font-mono font-bold';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 font-mono font-bold';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Hero Header - High Density */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Portal Público de Transparência & Impacto
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-800 text-cyan-300 border border-slate-700 rounded">
                Live Directory
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Consulte organizações da sociedade civil validadas pelo <strong className="text-white font-semibold">DataSocial</strong>. Acompanhe relatórios de governança, regularidade MROSC e indicadores de impacto.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar nome, CNPJ ou cidade..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white font-medium"
            >
              <option value="Todas">Todas as Áreas de Atuação</option>
              <option value="Educação e Pesquisa">Educação e Pesquisa</option>
              <option value="Assistência Social">Assistência Social</option>
              <option value="Saúde e Pessoas com Deficiência">Saúde e PCD</option>
              <option value="Meio Ambiente e Causa Animal">Meio Ambiente</option>
              <option value="Cultura e Arte">Cultura e Arte</option>
              <option value="Esporte e Lazer">Esporte e Lazer</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none bg-white font-medium"
            >
              <option value="Todos">Todos os Selos de Governança</option>
              <option value="Bronze">Selo Bronze (Regular MROSC)</option>
              <option value="Prata">Selo Prata (Contábil & Transparência)</option>
              <option value="Ouro">Selo Ouro (Auditoria & KPIs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOngs.map(ong => (
          <div
            key={ong.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    CNPJ: {ong.cnpj}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                    {ong.name}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 text-[11px] rounded border shrink-0 ${getBadgeStyle(
                    ong.maturityLevel
                  )}`}
                >
                  SELO {ong.maturityLevel.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {ong.mission}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold uppercase">
                    Sede
                  </span>
                  <span className="font-bold text-slate-800">
                    {ong.city} / {ong.state}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold uppercase">
                    Área
                  </span>
                  <span className="font-bold text-slate-800 truncate block">
                    {ong.areaAtuacao}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold uppercase">
                    Beneficiários
                  </span>
                  <span className="font-bold text-emerald-700">
                    {ong.activeBeneficiariesCount} atendidos
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold uppercase">
                    Captação Total
                  </span>
                  <span className="font-bold text-slate-900">
                    R$ {ong.totalRaisedR$.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Validado MROSC
              </span>

              <button
                onClick={() => onSelectOng(ong)}
                className="flex items-center gap-1 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <span>Ver Relatório Completo</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
