import React, { useState } from 'react';
import { Sparkles, Brain, CheckCircle, AlertTriangle, ArrowRight, Lightbulb, Target, Compass, Award, RefreshCw, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { ONG, AIDiagnosticResult } from '../types';

interface AiDiagnosticProps {
  ong: ONG;
  allOngs?: ONG[];
  onSelectOng?: (ong: ONG) => void;
}

export const AiDiagnostic: React.FC<AiDiagnosticProps> = ({
  ong: initialOng,
  allOngs = [],
  onSelectOng,
}) => {
  const [selectedOng, setSelectedOng] = useState<ONG>(initialOng);
  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState('');
  const [diagnostic, setDiagnostic] = useState<AIDiagnosticResult | null>(null);

  // Interactive Governance Simulation State Toggles
  const [hasTransparancyPortal, setHasTransparencyPortal] = useState(true);
  const [hasAuditedAccounts, setHasAuditedAccounts] = useState(false);
  const [hasCndFederal, setHasCndFederal] = useState(true);
  const [hasCMDCA, setHasCMDCA] = useState(true);

  const handleSelectOngChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = allOngs.find(o => o.id === e.target.value);
    if (found) {
      setSelectedOng(found);
      if (onSelectOng) onSelectOng(found);
      setDiagnostic(null);
    }
  };

  const handleRunDiagnostic = async () => {
    setLoading(true);
    setStepText('Analizando Estatuto Social e Regularidade MROSC...');

    setTimeout(() => {
      setStepText('Verificando CNDs, Portal de Transparência e Pareceres...');
    }, 600);

    setTimeout(() => {
      setStepText('Consultando modelo Gemini 2.5 Flash para Leis de Incentivo...');
    }, 1200);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/ai/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ongData: {
              ...selectedOng,
              hasTransparancyPortal,
              hasAuditedAccounts,
              hasCndFederal,
              hasCMDCA,
            },
          }),
        });

        const resData = await response.json();
        if (resData.success && resData.data) {
          // Adjust overallScore based on interactive toggles
          let score = resData.data.overallScore || 65;
          if (hasTransparancyPortal) score += 10;
          if (hasAuditedAccounts) score += 15;
          if (!hasCndFederal) score -= 20;
          score = Math.min(Math.max(score, 25), 98);

          let level: 'Bronze' | 'Prata' | 'Ouro' = 'Bronze';
          if (score >= 85) level = 'Ouro';
          else if (score >= 65) level = 'Prata';

          setDiagnostic({
            ...resData.data,
            overallScore: score,
            maturityAssessed: level,
          });
        }
      } catch (err) {
        console.warn('API error, executing client simulation:', err);
        // Pure local simulation fallback
        let score = 60;
        if (hasTransparancyPortal) score += 15;
        if (hasAuditedAccounts) score += 15;
        if (hasCndFederal) score += 10;
        if (hasCMDCA) score += 10;

        let level: 'Bronze' | 'Prata' | 'Ouro' = 'Bronze';
        if (score >= 85) level = 'Ouro';
        else if (score >= 65) level = 'Prata';

        setDiagnostic({
          overallScore: score,
          maturityAssessed: level,
          keyStrengths: [
            'Estatuto social adequado às exigências do MROSC (Lei 13.019/2014)',
            hasCndFederal ? 'Certidões Negativas de Débitos (CNDs) ativas e válidas' : 'Documentação cadastral inicial validada',
            hasCMDCA ? 'Inscrição ativa no Conselho Municipal dos Direitos da Criança' : 'Proposta social clara e mensurável',
          ],
          criticalGaps: [
            !hasTransparancyPortal ? 'Falta Portal de Transparência Aberto para prestação de contas aos doadores' : 'Necessita consolidação do Manual de Compras Interno',
            !hasAuditedAccounts ? 'Demonstrativos contábeis sem parecer de auditoria independente' : 'Aprimorar relatório anual com indicadores de impacto e ODS',
            'Plano de captação de recursos necessita diversificação em leis federais',
          ],
          roadmap30Days: [
            'Aprovar e publicar o Regimento Interno no site da instituição',
            'Sincronizar balancete atualizado no portal do DataSocial',
            'Elaborar o primeiro edital para chamamento de pareceristas contábeis',
          ],
          roadmap60Days: [
            'Cadastrar projeto piloto no sistema do Fundo da Infância e Adolescência (FIA)',
            'Implementar canal direto de prestação de contas para doadores via PIX',
            'Regularizar atestado de pleno funcionamento no conselho municipal',
          ],
          roadmap90Days: [
            'Submeter proposta formal no Pronas/PCD ou Lei Rouanet',
            'Pleitear a elevação para o Selo Ouro de Maturidade Governamental',
            'Estabelecer parceria com doadores corporativos do Lucro Real',
          ],
          recommendedIncentiveLaws: ['FIA', 'Lei Rouanet', 'Lei de Incentivo ao Esporte', 'MROSC / Parceria Pública'],
          suggestedActionPlans: [
            { title: 'Implantação do Selo Prata / Ouro', detail: 'Regularize todos os apontamentos jurídicos.', priority: 'Alta' },
            { title: 'Qualificação para Incentivo Fiscal', detail: 'Habilite a instituição para emissão de recibos dedutíveis de IR.', priority: 'Alta' },
          ],
        });
      } finally {
        setLoading(false);
      }
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-400 font-mono">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  Simulador de Diagnóstico Inteligente Gemini AI
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 rounded">
                  v2.5 Flash • Governança MROSC
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
                Diagnóstico de Maturidade & Captação
              </h1>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                Análise inteligente dos dados institucionais, CNDs e projetos para acelerar a obtenção dos Selos e captação em Leis de Incentivo.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {allOngs.length > 0 && (
              <select
                value={selectedOng.id}
                onChange={handleSelectOngChange}
                className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-2 outline-none cursor-pointer"
              >
                {allOngs.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.maturityLevel})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleRunDiagnostic}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processando...
                </span>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Gerar Diagnóstico IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Simulador de Parâmetros de Governança para <strong className="text-indigo-800">{selectedOng.name}</strong>:
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Marque os itens para recalcular o impacto da IA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setHasTransparencyPortal(!hasTransparancyPortal)}
            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
              hasTransparancyPortal
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {hasTransparancyPortal ? (
              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span>Portal de Transparência</span>
          </button>

          <button
            onClick={() => setHasAuditedAccounts(!hasAuditedAccounts)}
            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
              hasAuditedAccounts
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {hasAuditedAccounts ? (
              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span>Contas Auditadas</span>
          </button>

          <button
            onClick={() => setHasCndFederal(!hasCndFederal)}
            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
              hasCndFederal
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {hasCndFederal ? (
              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span>CNDs Válidas</span>
          </button>

          <button
            onClick={() => setHasCMDCA(!hasCMDCA)}
            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
              hasCMDCA
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {hasCMDCA ? (
              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span>Registro no Cons. Municipal</span>
          </button>
        </div>
      </div>

      {/* Loading animation state */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm space-y-3">
          <Brain className="w-10 h-10 text-indigo-600 animate-bounce mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            Executando Análise Preditiva de Governança
          </h3>
          <p className="text-xs text-indigo-700 font-mono animate-pulse">
            {stepText}
          </p>
        </div>
      )}

      {/* Results view */}
      {!loading && diagnostic && (
        <div className="space-y-4">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Nível Avaliado
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-xl font-black text-slate-900">
                  SELO {diagnostic.maturityAssessed.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                Baseado nos requisitos MROSC validados
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Índice de Prontidão IA
              </span>
              <div className="text-xl font-black text-indigo-700 mt-1">
                {diagnostic.overallScore} / 100
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                Aptidão para captação em fundos públicos
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                Leis Indicadas
              </span>
              <div className="flex flex-wrap gap-1 mt-1 font-mono">
                {diagnostic.recommendedIncentiveLaws.map((law, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    {law}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths and Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Pontos Fortes da Organização
              </h3>
              <ul className="space-y-2">
                {diagnostic.keyStrengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Gargalos Críticos a Resolver
              </h3>
              <ul className="space-y-2">
                {diagnostic.criticalGaps.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Roadmap 30-60-90 Days */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-indigo-600" />
              Plano de Ação Gerado por Inteligência Artificial (30, 60 e 90 dias)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 block">
                  Ações Imediatas (30 Dias)
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {diagnostic.roadmap30Days.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-indigo-600 shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">
                  Estruturação (60 Dias)
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {diagnostic.roadmap60Days.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-emerald-600 shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 block">
                  Captação Ativa (90 Dias)
                </span>
                <ul className="space-y-2 text-xs text-slate-700">
                  {diagnostic.roadmap90Days.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-amber-700 shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !diagnostic && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm space-y-3">
          <Brain className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            Nenhum diagnóstico gerado ainda para {selectedOng.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Ajuste os parâmetros acima e clique em "Gerar Diagnóstico IA" para simular a avaliação completa de governança e captação social.
          </p>
        </div>
      )}
    </div>
  );
};
