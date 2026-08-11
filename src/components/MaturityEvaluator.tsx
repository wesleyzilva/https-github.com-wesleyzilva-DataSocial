import React, { useState } from 'react';
import { Award, CheckCircle, Circle, ShieldAlert, FileText, Download, Sparkles, Check, Info } from 'lucide-react';
import { ONG, GovernanceRequirement, MaturityLevel } from '../types';

interface MaturityEvaluatorProps {
  ong: ONG;
  onUpdateOng: (updatedOng: ONG) => void;
  onNavigateToProjects: () => void;
  onNavigateToDiagnostic: () => void;
}

export const MaturityEvaluator: React.FC<MaturityEvaluatorProps> = ({
  ong,
  onUpdateOng,
  onNavigateToProjects,
  onNavigateToDiagnostic,
}) => {
  const [requirements, setRequirements] = useState<GovernanceRequirement[]>(ong.requirements || []);
  const [activeLevelFilter, setActiveLevelFilter] = useState<'Todos' | 'Bronze' | 'Prata' | 'Ouro'>('Todos');

  // Recalculate score and maturity tier
  const toggleRequirement = (reqId: string) => {
    const updatedReqs = requirements.map(r =>
      r.id === reqId ? { ...r, checked: !r.checked } : r
    );

    setRequirements(updatedReqs);

    // Calculate level
    const bronzeReqs = updatedReqs.filter(r => r.level === 'Bronze');
    const prataReqs = updatedReqs.filter(r => r.level === 'Prata');
    const ouroReqs = updatedReqs.filter(r => r.level === 'Ouro');

    const bronzePassed = bronzeReqs.every(r => r.checked);
    const prataPassed = prataReqs.every(r => r.checked);
    const ouroPassed = ouroReqs.every(r => r.checked);

    let level: MaturityLevel = 'None';
    if (bronzePassed) level = 'Bronze';
    if (bronzePassed && prataPassed) level = 'Prata';
    if (bronzePassed && prataPassed && ouroPassed) level = 'Ouro';

    const checkedTotal = updatedReqs.filter(r => r.checked).length;
    const score = Math.round((checkedTotal / updatedReqs.length) * 100);

    const updatedOng: ONG = {
      ...ong,
      requirements: updatedReqs,
      governanceScore: score,
      maturityLevel: level,
    };

    onUpdateOng(updatedOng);

    // Save to Express Backend
    fetch(`/api/ongs/${ong.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOng),
    }).catch(err => console.warn('Sync PUT error:', err));
  };

  const bronzeCount = requirements.filter(r => r.level === 'Bronze' && r.checked).length;
  const bronzeTotal = requirements.filter(r => r.level === 'Bronze').length;

  const prataCount = requirements.filter(r => r.level === 'Prata' && r.checked).length;
  const prataTotal = requirements.filter(r => r.level === 'Prata').length;

  const ouroCount = requirements.filter(r => r.level === 'Ouro' && r.checked).length;
  const ouroTotal = requirements.filter(r => r.level === 'Ouro').length;

  const filteredReqs = requirements.filter(r => {
    if (activeLevelFilter === 'Todos') return true;
    return r.level === activeLevelFilter;
  });

  const getBadgeStyle = (level: MaturityLevel) => {
    switch (level) {
      case 'Ouro':
        return {
          bg: 'bg-slate-900 border-amber-500/40 text-white',
          badgeBg: 'bg-amber-500 text-slate-950 font-bold',
          title: 'Selo Ouro de Governança',
          desc: 'Nível avançado de compliance, auditoria e impacto social demonstrado.',
        };
      case 'Prata':
        return {
          bg: 'bg-slate-900 border-slate-700 text-white',
          badgeBg: 'bg-slate-300 text-slate-900 font-bold',
          title: 'Selo Prata de Governança',
          desc: 'Gestão contábil e transparência apta para projetos de leis de incentivo.',
        };
      case 'Bronze':
        return {
          bg: 'bg-slate-900 border-amber-700/50 text-white',
          badgeBg: 'bg-amber-700 text-white font-bold',
          title: 'Selo Bronze de Governança',
          desc: 'Regularidade jurídica e fiscal básica (MROSC Lei 13.019/14) aprovada.',
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800 text-slate-200',
          badgeBg: 'bg-slate-800 text-slate-400 font-bold',
          title: 'Aguardando Selo Mínimo (Bronze)',
          desc: 'Conclua os requisitos mínimos para emissão do certificado digital.',
        };
    }
  };

  const badgeStyle = getBadgeStyle(ong.maturityLevel);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Banner - High Density */}
      <div className={`rounded-xl border p-5 ${badgeStyle.bg} shadow-sm transition-all`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${badgeStyle.badgeBg}`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {ong.name} ({ong.cnpj})
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                {badgeStyle.title}
              </h1>
              <p className="text-xs mt-1 text-slate-300 max-w-2xl">
                {badgeStyle.desc}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 bg-slate-800/90 border border-slate-700 p-3 rounded-lg font-mono">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Compliance Score
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {ong.governanceScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="w-32 h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${ong.governanceScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maturity Levels Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Bronze Card */}
        <div
          onClick={() => setActiveLevelFilter('Bronze')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeLevelFilter === 'Bronze'
              ? 'border-amber-700 bg-amber-500/10 shadow-sm'
              : 'border-slate-200 bg-white hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              Mínimo Legal
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {bronzeCount}/{bronzeTotal}
            </span>
          </div>
          <h3 className="font-bold text-base text-slate-900 mt-2">Selo Bronze</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Estatuto, CNDs e Ata de Diretoria MROSC.
          </p>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-700 h-full transition-all"
              style={{ width: `${(bronzeCount / bronzeTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Prata Card */}
        <div
          onClick={() => setActiveLevelFilter('Prata')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeLevelFilter === 'Prata'
              ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
              : 'border-slate-200 bg-white hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
              Intermediário
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {prataCount}/{prataTotal}
            </span>
          </div>
          <h3 className="font-bold text-base text-slate-900 mt-2">Selo Prata</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Balanço Contábil e Prestação de Contas.
          </p>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all"
              style={{ width: `${(prataCount / prataTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Ouro Card */}
        <div
          onClick={() => setActiveLevelFilter('Ouro')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeLevelFilter === 'Ouro'
              ? 'border-amber-500 bg-amber-50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              Avançado
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {ouroCount}/{ouroTotal}
            </span>
          </div>
          <h3 className="font-bold text-base text-slate-900 mt-2">Selo Ouro</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Auditoria Externa, KPIs e LGPD.
          </p>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${(ouroCount / ouroTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              Checklist de Requisitos de Governança
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Marque os itens validados para atualizar o Selo de Maturidade em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => setActiveLevelFilter('Todos')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLevelFilter === 'Todos'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({requirements.length})
            </button>
            <button
              onClick={() => setActiveLevelFilter('Bronze')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLevelFilter === 'Bronze'
                  ? 'bg-amber-800 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Bronze
            </button>
            <button
              onClick={() => setActiveLevelFilter('Prata')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLevelFilter === 'Prata'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Prata
            </button>
            <button
              onClick={() => setActiveLevelFilter('Ouro')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLevelFilter === 'Ouro'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Ouro
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-1">
          {filteredReqs.map(req => (
            <div
              key={req.id}
              onClick={() => toggleRequirement(req.id)}
              className="py-3 flex items-start gap-3 hover:bg-slate-50 p-2.5 rounded-lg transition-colors cursor-pointer group"
            >
              <button
                type="button"
                className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border ${
                  req.checked
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {req.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                    {req.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      req.level === 'Ouro'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : req.level === 'Prata'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    Selo {req.level}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                    {req.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {req.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onNavigateToDiagnostic}
            className="flex items-center gap-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gerar Plano de Ação Inteligente (IA)</span>
          </button>

          <button
            onClick={onNavigateToProjects}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <span>Ir para Projetos & Captação</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
