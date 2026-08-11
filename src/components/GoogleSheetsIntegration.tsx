import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Download,
  ShieldCheck,
  Building2,
  FileText,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Table,
  Zap,
  Code,
  LogIn
} from 'lucide-react';
import { ONG, Project } from '../types';
import { googleSignIn, getCachedAccessToken } from '../lib/googleAuth';
import { addLog } from '../lib/logger';

interface GoogleSheetsIntegrationProps {
  ongs: ONG[];
  projects: Project[];
  onImportData?: (ongs: ONG[], projects: Project[]) => void;
}

const OFFICIAL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE/edit?gid=0#gid=0';
const OFFICIAL_SHEET_ID = '1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE';

export const GoogleSheetsIntegration: React.FC<GoogleSheetsIntegrationProps> = ({
  ongs,
  projects,
  onImportData,
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(OFFICIAL_SHEET_URL);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activePreviewTab, setActiveTab] = useState<'ongs' | 'projects' | 'investors' | 'summary'>('ongs');

  const [sheetInputUrl, setSheetInputUrl] = useState(OFFICIAL_SHEET_URL);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showWebhookSetup, setShowWebhookSetup] = useState(false);
  const [customToken, setCustomToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Read data from Google Sheets via backend endpoint /api/sheets/read
  const handleFetchFromSheet = async () => {
    if (!sheetInputUrl.trim()) {
      setError('Por favor, digite ou cole a URL ou ID da planilha do Google Sheets.');
      return;
    }
    setLoading(true);
    setError(null);
    setStatusMessage('Lendo e estruturando dados do Google Sheets...');
    try {
      const res = await fetch('/api/sheets/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetIdOrUrl: sheetInputUrl.trim(),
          accessToken: customToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message || 'Dados lidos e importados com sucesso!');
        if (onImportData && data.ongs && data.projects) {
          onImportData(data.ongs, data.projects);
        }
      } else {
        setError(data.error || 'Erro ao ler dados da planilha do Google Sheets.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar ao servidor para importar planilha.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Google OAuth popup or API call to save directly in Google Drive Folder 1TaqtTvycmU3lDMsYkNUe-BL50IxemmSo
  const handleSaveDirectToDriveFolder = async () => {
    setError(null);
    setLoading(true);
    setStatusMessage('Autenticando com sua conta do Google e conectando ao Google Drive...');

    try {
      let token = customToken.trim() || getCachedAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }

      if (token) {
        setCustomToken(token);
        await sendDataToBackend(token);
      } else {
        setError('Autorização Google cancelada ou sem permissão.');
        setLoading(false);
      }
    } catch (e: any) {
      console.warn('Google Auth Popup warning:', e.message);
      setError(e.message || 'Erro ao autenticar com o Google.');
      setLoading(false);
    }
  };

  // Helper to format TSV (Tab Separated Values) - perfect for pasting into Google Sheets
  const generateTabTSV = (tab: 'ongs' | 'projects' | 'investors' | 'summary') => {
    if (tab === 'ongs') {
      const headers = ['ID', 'Nome da ONG', 'CNPJ', 'Área de Atuação', 'Cidade', 'UF', 'Selo', 'Score Governança', 'Beneficiários', 'Captação (R$)'];
      const rows = ongs.map(o => [
        o.id, o.name, o.cnpj, o.areaAtuacao, o.city, o.state, o.maturityLevel, `${o.governanceScore}%`, o.activeBeneficiariesCount, `R$ ${o.totalRaisedR$.toLocaleString('pt-BR')}`
      ]);
      return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    }
    if (tab === 'projects') {
      const headers = ['ID', 'Título do Projeto', 'ONG Responsável', 'Mecanismo Fiscal', 'Meta (R$)', 'Captado (R$)', 'Status', 'Impactados'];
      const rows = projects.map(p => [
        p.id, p.title, p.ongName, p.mecanismo, `R$ ${p.targetAmountR$.toLocaleString('pt-BR')}`, `R$ ${p.raisedAmountR$.toLocaleString('pt-BR')}`, p.status, p.beneficiariesCount
      ]);
      return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    }
    if (tab === 'investors') {
      const headers = ['ID', 'Empresa / Investidor Social', 'Orçamento Dedutível (R$)', 'Áreas de Interesse', 'Leis de Incentivo Preferenciais'];
      const rows = [
        ['inv-1', 'Itaú Social / Instituto Itaú', 'R$ 5.000.000', 'Educação, Cultura', 'FIA, Lei Rouanet'],
        ['inv-2', 'Klabin SA', 'R$ 2.500.000', 'Meio Ambiente, Assistência Social', 'Incentivo ao Esporte, FIA'],
        ['inv-3', 'Gerdau Impacto', 'R$ 1.800.000', 'Juventude, Capacitação', 'Pronas/PCD, Lei Rouanet'],
      ];
      return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    }

    // Summary
    const headers = ['Indicador MROSC', 'Valor Atual', 'Observação de Governança'];
    const rows = [
      ['Total de ONGs Validadas', ongs.length, 'Organizações da Sociedade Civil cadastradas'],
      ['Selo Ouro de Maturidade', ongs.filter(o => o.maturityLevel === 'Ouro').length, 'Conformidade MROSC avançada e auditoria'],
      ['Selo Prata de Maturidade', ongs.filter(o => o.maturityLevel === 'Prata').length, 'Transparência ativa e regimento'],
      ['Selo Bronze de Maturidade', ongs.filter(o => o.maturityLevel === 'Bronze').length, 'Estatuto social e CNDs regulares'],
      ['Projetos de Captação Ativos', projects.length, 'Aptos para Leis de Incentivo (FIA, Rouanet, PIX)'],
      ['Volume Total Captado (R$)', `R$ ${projects.reduce((acc, p) => acc + p.raisedAmountR$, 0).toLocaleString('pt-BR')}`, 'Recursos direcionados para impacto social'],
    ];
    return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
  };

  // Copy TSV data & open official Google Sheet
  const handleSyncAndOpenSheets = (tabName: 'ongs' | 'projects' | 'investors' | 'summary' = 'ongs') => {
    const tsvData = generateTabTSV(tabName);
    navigator.clipboard.writeText(tsvData);
    setCopiedTab(tabName);

    const targetUrl = sheetInputUrl.trim() || OFFICIAL_SHEET_URL;
    setStatusMessage(`Dados de "${tabName.toUpperCase()}" copiados para a área de transferência! Abrindo a planilha oficial no Google Sheets... Basta dar Ctrl+V na célula A1 caso queira colar os dados.`);
    setError(null);

    setTimeout(() => {
      window.open(targetUrl, '_blank');
      setCopiedTab(null);
    }, 600);
  };

  // Copy specific table to clipboard
  const handleCopyTable = (tabName: 'ongs' | 'projects' | 'summary') => {
    const tsvData = generateTabTSV(tabName);
    navigator.clipboard.writeText(tsvData);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  // Webhook sync to Google Apps Script
  const handleWebhookSync = async () => {
    if (!webhookUrl.trim()) {
      setError('Por favor, informe a URL do Webhook do Google Apps Script.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage('Enviando dados do Arandu para o Google Apps Script...');

    try {
      const payload = {
        timestamp: new Date().toISOString(),
        ongs,
        projects,
        summary: {
          totalOngs: ongs.length,
          totalProjects: projects.length,
          totalRaisedR$: projects.reduce((acc, p) => acc + p.raisedAmountR$, 0),
        }
      };

      await fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script web app endpoint requirement
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setStatusMessage('Requisição enviada com sucesso para o seu Google Sheets! Verifique a planilha.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar dados para o Webhook do Google.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Sync via Backend
  const handleConnectAndSync = async () => {
    setError(null);
    setLoading(true);

    try {
      let token = customToken.trim() || getCachedAccessToken();
      if (!token) {
        setStatusMessage('Abrindo autenticação do Google para autorizar gravação no Sheets...');
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }

      if (token) {
        setCustomToken(token);
        await sendDataToBackend(token);
      } else {
        setError('Login do Google não concluído.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erro de autenticação com o Google.');
      setLoading(false);
    }
  };

  const sendDataToBackend = async (accessToken: string) => {
    try {
      setStatusMessage('Enviando e organizando dados na planilha oficial do Google Sheets...');
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, spreadsheetIdOrUrl: OFFICIAL_SHEET_ID }),
      });

      const data = await res.json();
      if (data.success) {
        setSpreadsheetUrl(data.spreadsheetUrl || OFFICIAL_SHEET_URL);
        setStatusMessage(`Dados sincronizados com sucesso na planilha oficial do Google Sheets (${OFFICIAL_SHEET_ID})!`);
      } else {
        setError(data.error || 'Falha ao sincronizar dados com o Google Sheets.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de rede ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Download CSV with UTF-8 BOM so Excel/Google Sheets reads accentuation correctly
  const handleDownloadCsv = () => {
    const BOM = '\uFEFF';
    const headers = ['Nome da ONG', 'CNPJ', 'Área de Atuação', 'Cidade', 'UF', 'Selo Maturidade', 'Score Governança', 'Captação Total (R$)'];
    const rows = ongs.map(o => [
      `"${o.name}"`,
      `"${o.cnpj}"`,
      `"${o.areaAtuacao}"`,
      `"${o.city}"`,
      `"${o.state}"`,
      `"${o.maturityLevel}"`,
      `"${o.governanceScore}%"`,
      `"R$ ${o.totalRaisedR$.toLocaleString('pt-BR')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(BOM + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Arandu_Relatorio_MROSC_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-mono">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Integração Google Drive & Google Sheets
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  MROSC & Governança
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Armazene e sincronize os dados institucionais, relatórios MROSC e projetos em captação diretamente na sua pasta dedicada do <strong>Google Drive</strong> e planilhas do <strong>Google Sheets</strong>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleSaveDirectToDriveFolder}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>{loading ? 'Enviando...' : 'Salvar no Google Sheets'}</span>
            </button>

            <a
              href={OFFICIAL_SHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Planilha Oficial</span>
            </a>

            <button
              onClick={() => handleSyncAndOpenSheets('ongs')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>Copiar & Abrir Planilha</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs px-3.5 py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Baixar CSV</span>
            </button>
          </div>
        </div>

        {/* Google Drive Folder Banner */}
        <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-indigo-900/60 border border-indigo-700 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              📊
            </div>
            <div>
              <div className="font-bold text-white text-xs">
                Planilha Oficial Vínculada: <span className="text-emerald-400">{OFFICIAL_SHEET_ID}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Planilha oficial do Google Sheets sincronizada com o projeto Data Soc<span className="text-amber-400 font-mono">IA</span>l.
              </div>
            </div>
          </div>
          <a
            href={OFFICIAL_SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-sans font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Ver Planilha no Google</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Import Data from Google Sheets Card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-900/60 text-white space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-400">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>📥 Importar / Ler Dados da Planilha Oficial</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
              Leitura em Tempo Real
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            URL da planilha oficial configurada no sistema (<code>{OFFICIAL_SHEET_ID}</code>). Clique abaixo para carregar os dados atualizados das ONGs, Projetos e Investidores.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={sheetInputUrl}
              onChange={e => setSheetInputUrl(e.target.value)}
              placeholder="Cole a URL ou ID do Google Sheets (ex: https://docs.google.com/spreadsheets/d/...)"
              className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 flex-1 outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleFetchFromSheet}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Lendo Planilha...' : 'Carregar Dados do Sheets'}</span>
            </button>
          </div>
        </div>

        {/* Alternative Sync Options Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowWebhookSetup(!showWebhookSetup)}
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showWebhookSetup ? '▲ Ocultar Webhook Google Apps Script' : '► Conectar via Webhook do Google Apps Script'}</span>
            </button>

            <button
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="text-[11px] font-mono text-slate-400 hover:underline cursor-pointer"
            >
              {showTokenInput ? '▲ Ocultar OAuth Token' : '► Inserir Token OAuth Google'}
            </button>
          </div>
        </div>

        {/* Webhook Google Apps Script Setup Box */}
        {showWebhookSetup && (
          <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cole a URL do seu Webhook de Web App do Google Apps Script para sincronização automatizada sem precisar de OAuth Client ID:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-emerald-300 flex-1 outline-none font-mono"
              />
              <button
                onClick={handleWebhookSync}
                disabled={loading}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded cursor-pointer transition-all"
              >
                {loading ? 'Enviando...' : 'Sincronizar Webhook'}
              </button>
            </div>
          </div>
        )}

        {/* Token Input Section for manual Google OAuth testing */}
        {showTokenInput && (
          <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={customToken}
              onChange={e => setCustomToken(e.target.value)}
              placeholder="Cole o access_token OAuth da Google API aqui..."
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 flex-1 outline-none"
            />
            <button
              onClick={handleConnectAndSync}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded cursor-pointer whitespace-nowrap"
            >
              Enviar Token
            </button>
          </div>
        )}
      </div>

      {/* Sync Status Banner */}
      {statusMessage && !error && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-sans flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <a
            href={OFFICIAL_SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold bg-emerald-700 text-white px-3 py-1 rounded hover:bg-emerald-800 transition-colors cursor-pointer shrink-0"
          >
            <span>Abrir Planilha Oficial</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Banner with Direct Link */}
      {spreadsheetUrl && (
        <div className="bg-emerald-900 text-white border border-emerald-700 rounded-xl p-5 shadow-sm space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>Planilha Criada e Sincronizada com Sucesso!</span>
            </div>
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-white text-emerald-950 font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shadow-sm"
            >
              <span>Abrir no Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed font-mono">
            Link da Planilha: <a href={spreadsheetUrl} target="_blank" rel="noreferrer" className="underline break-all text-emerald-300">{spreadsheetUrl}</a>
          </p>
        </div>
      )}

      {/* Instructions Step-by-Step Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
        <div className="flex items-center gap-2 font-extrabold text-slate-900">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Como colar seus dados no Google Sheets em 3 Passos:</span>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 font-medium">
          <li className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Passo 1
              </span>
              <p className="mt-1.5 leading-relaxed">
                Clique no botão <strong>"Sincronizar & Abrir no Google Sheets"</strong> ou em <strong>"Copiar Tabela"</strong> na prévia abaixo.
              </p>
            </div>
          </li>
          <li className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                Passo 2
              </span>
              <p className="mt-1.5 leading-relaxed">
                O Google Sheets abrirá automaticamente em uma nova aba em branco (`sheets.new`).
              </p>
            </div>
          </li>
          <li className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                Passo 3
              </span>
              <p className="mt-1.5 leading-relaxed">
                Na primeira célula (<strong>A1</strong>), pressione <strong>Ctrl+V</strong> (ou <strong>Cmd+V</strong> no Mac). Toda a tabela com colunas e valores aparecerá preenchida!
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Live Interactive Data Preview Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Prévia dos Dados para Exportação & Sincronização
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyTable(activePreviewTab)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1.5 rounded-md transition-all cursor-pointer shadow-sm"
            >
              {copiedTab === activePreviewTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Tabela Atual</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation for Preview */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ongs')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activePreviewTab === 'ongs'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Aba 1: ONGs Cadastradas ({ongs.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activePreviewTab === 'projects'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Aba 2: Projetos & Captação ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('investors')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activePreviewTab === 'investors'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Aba 3: Investidores & Patrocinadores
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activePreviewTab === 'summary'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Aba 4: Resumo Governança
          </button>
          <button
            onClick={() => setActiveTab('schema' as any)}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              (activePreviewTab as any) === 'schema'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-600" />
            <span>📘 Dicionário de Dados & Mapeamento Analítico</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto p-4">
          {activePreviewTab === 'ongs' && (
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2">Nome da ONG</th>
                  <th className="p-2">CNPJ</th>
                  <th className="p-2">Área</th>
                  <th className="p-2">Cidade/UF</th>
                  <th className="p-2">Selo</th>
                  <th className="p-2">Governança</th>
                  <th className="p-2 text-right">Captação (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ongs.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 text-slate-800">
                    <td className="p-2 font-bold font-sans">{o.name}</td>
                    <td className="p-2">{o.cnpj}</td>
                    <td className="p-2 font-sans">{o.areaAtuacao}</td>
                    <td className="p-2 font-sans">{o.city}/{o.state}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.maturityLevel === 'Ouro' ? 'bg-amber-100 text-amber-900' :
                        o.maturityLevel === 'Prata' ? 'bg-slate-200 text-slate-800' :
                        'bg-amber-800/10 text-amber-800'
                      }`}>
                        {o.maturityLevel}
                      </span>
                    </td>
                    <td className="p-2">{o.governanceScore}%</td>
                    <td className="p-2 text-right font-bold">R$ {o.totalRaisedR$.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activePreviewTab === 'projects' && (
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2">Título do Projeto</th>
                  <th className="p-2">ONG</th>
                  <th className="p-2">Mecanismo</th>
                  <th className="p-2 text-right">Meta (R$)</th>
                  <th className="p-2 text-right">Captado (R$)</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 text-slate-800">
                    <td className="p-2 font-bold font-sans">{p.title}</td>
                    <td className="p-2 font-sans">{p.ongName}</td>
                    <td className="p-2 font-sans">{p.mecanismo}</td>
                    <td className="p-2 text-right">R$ {p.targetAmountR$.toLocaleString('pt-BR')}</td>
                    <td className="p-2 text-right font-bold text-emerald-700">R$ {p.raisedAmountR$.toLocaleString('pt-BR')}</td>
                    <td className="p-2 font-sans">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activePreviewTab === 'investors' && (
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2">ID</th>
                  <th className="p-2">Empresa / Investidor Social</th>
                  <th className="p-2 text-right">Orçamento Dedutível (R$)</th>
                  <th className="p-2">Áreas de Interesse</th>
                  <th className="p-2">Leis de Incentivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 text-slate-800">
                  <td className="p-2 font-bold">inv-1</td>
                  <td className="p-2 font-bold font-sans">Itaú Social / Instituto Itaú</td>
                  <td className="p-2 text-right font-bold text-emerald-700">R$ 5.000.000</td>
                  <td className="p-2 font-sans">Educação, Cultura</td>
                  <td className="p-2 font-sans">FIA, Lei Rouanet</td>
                </tr>
                <tr className="hover:bg-slate-50 text-slate-800">
                  <td className="p-2 font-bold">inv-2</td>
                  <td className="p-2 font-bold font-sans">Klabin SA</td>
                  <td className="p-2 text-right font-bold text-emerald-700">R$ 2.500.000</td>
                  <td className="p-2 font-sans">Meio Ambiente, Assistência Social</td>
                  <td className="p-2 font-sans">Incentivo ao Esporte, FIA</td>
                </tr>
                <tr className="hover:bg-slate-50 text-slate-800">
                  <td className="p-2 font-bold">inv-3</td>
                  <td className="p-2 font-bold font-sans">Gerdau Impacto</td>
                  <td className="p-2 text-right font-bold text-emerald-700">R$ 1.800.000</td>
                  <td className="p-2 font-sans">Juventude, Capacitação</td>
                  <td className="p-2 font-sans">Pronas/PCD, Lei Rouanet</td>
                </tr>
              </tbody>
            </table>
          )}

          {((activePreviewTab as any) === 'schema') && (
            <div className="space-y-6 text-xs text-slate-800 font-sans p-2">
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <Code className="w-4 h-4" />
                  <span>Dicionário de Dados & Banco de Dados Analítico Google Sheets</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Abaixo está a documentação técnica de mapeamento das tabelas sincronizadas na planilha oficial (<code>1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE</code>). Utilize estes dados para cruzamentos analíticos, relatórios de prestação de contas MROSC e estudos de viabilidade econômica.
                </p>
              </div>

              {/* Schema Table 1 */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Aba 1: ONGs Cadastradas (Dicionário de Entidades)</span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Campo no Sheets</th>
                        <th className="p-2">Tipo de Dado</th>
                        <th className="p-2">Descrição & Finalidade Analítica</th>
                        <th className="p-2">Exemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      <tr>
                        <td className="p-2 font-bold font-mono">ID</td>
                        <td className="p-2 font-mono text-indigo-700">String</td>
                        <td className="p-2">Identificador único da Organização (OSC)</td>
                        <td className="p-2 font-mono text-slate-500">ong-1</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Nome da ONG</td>
                        <td className="p-2 font-mono text-indigo-700">String</td>
                        <td className="p-2">Razão social / Nome de registro da ONG</td>
                        <td className="p-2 font-mono text-slate-500">Associação Instituto Vida Viva</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">CNPJ</td>
                        <td className="p-2 font-mono text-indigo-700">String (14 digits)</td>
                        <td className="p-2">Cadastro Nacional da Pessoa Jurídica oficial</td>
                        <td className="p-2 font-mono text-slate-500">12.345.678/0001-90</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Área de Atuação</td>
                        <td className="p-2 font-mono text-indigo-700">Enum / Category</td>
                        <td className="p-2">Classificação de setor do MROSC / Terceiro Setor</td>
                        <td className="p-2 font-mono text-slate-500">Educação e Pesquisa</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Selo de Maturidade</td>
                        <td className="p-2 font-mono text-indigo-700">Enum (Bronze, Prata, Ouro)</td>
                        <td className="p-2">Nível de governança e adequação à Lei 13.019/2014</td>
                        <td className="p-2 font-mono text-slate-500">Ouro</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Score Governança</td>
                        <td className="p-2 font-mono text-indigo-700">Percentage (0-100)</td>
                        <td className="p-2">Pontuação calculada pela auditoria de requisitos MROSC</td>
                        <td className="p-2 font-mono text-slate-500">92%</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Captação Total (R$)</td>
                        <td className="p-2 font-mono text-emerald-700">Currency (BRL)</td>
                        <td className="p-2">Volume financeiro captado acumulado via plataforma e leis</td>
                        <td className="p-2 font-mono text-slate-500">R$ 450.000,00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Schema Table 2 */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Aba 2: Projetos e Captação (Dicionário Orçamentário e Impacto)</span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Campo no Sheets</th>
                        <th className="p-2">Tipo de Dado</th>
                        <th className="p-2">Descrição & Finalidade Analítica</th>
                        <th className="p-2">Exemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      <tr>
                        <td className="p-2 font-bold font-mono">ID</td>
                        <td className="p-2 font-mono text-indigo-700">String</td>
                        <td className="p-2">Código identificador do projeto social</td>
                        <td className="p-2 font-mono text-slate-500">proj-101</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Mecanismo Fiscal</td>
                        <td className="p-2 font-mono text-indigo-700">Enum (Incentivo)</td>
                        <td className="p-2">Dispositivo legal (FIA, Rouanet, Esporte, PIX)</td>
                        <td className="p-2 font-mono text-slate-500">FIA</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Meta (R$)</td>
                        <td className="p-2 font-mono text-emerald-700">Currency (BRL)</td>
                        <td className="p-2">Meta orçamentária aprovada para execução do projeto</td>
                        <td className="p-2 font-mono text-slate-500">R$ 200.000,00</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Captado (R$)</td>
                        <td className="p-2 font-mono text-emerald-700">Currency (BRL)</td>
                        <td className="p-2">Recursos aportados por investidores e doadores</td>
                        <td className="p-2 font-mono text-slate-500">R$ 135.000,00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Schema Table 3 */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span>Aba 3: Investidores e Patrocinadores (Dicionário de Investimento Social Privado)</span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Campo no Sheets</th>
                        <th className="p-2">Tipo de Dado</th>
                        <th className="p-2">Descrição & Finalidade Analítica</th>
                        <th className="p-2">Exemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      <tr>
                        <td className="p-2 font-bold font-mono">Empresa / Investidor</td>
                        <td className="p-2 font-mono text-indigo-700">String</td>
                        <td className="p-2">Razão social da empresa patrocinadora ou fundação</td>
                        <td className="p-2 font-mono text-slate-500">Itaú Social / Instituto Itaú</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Orçamento Dedutível (R$)</td>
                        <td className="p-2 font-mono text-emerald-700">Currency (BRL)</td>
                        <td className="p-2">Teto dedutível de IRPJ (Lucro Real 6% ou Lucro Presumido)</td>
                        <td className="p-2 font-mono text-slate-500">R$ 5.000.000,00</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold font-mono">Leis Preferenciais</td>
                        <td className="p-2 font-mono text-indigo-700">List (CSV)</td>
                        <td className="p-2">Leis de incentivo com abatimento fiscal almejado</td>
                        <td className="p-2 font-mono text-slate-500">FIA, Lei Rouanet</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
