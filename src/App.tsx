import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, ExternalLink, LogIn, CheckCircle2, Terminal } from 'lucide-react';
import { Header, UserRole } from './components/Header';
import { googleSignIn, getCachedAccessToken } from './lib/googleAuth';
import { addLog } from './lib/logger';
import { SystemLogsModal } from './components/SystemLogsModal';
import { OnboardingForm } from './components/OnboardingForm';
import { MaturityEvaluator } from './components/MaturityEvaluator';
import { ProjectManager } from './components/ProjectManager';
import { TransparencyPortal } from './components/TransparencyPortal';
import { AiDiagnostic } from './components/AiDiagnostic';
import { GoogleSheetsIntegration } from './components/GoogleSheetsIntegration';
import { ExportGuideModal } from './components/ExportGuideModal';
import { InvestorForm, Investor } from './components/InvestorForm';

// Persona Dashboards
import { AdvogadoDashboard } from './components/AdvogadoDashboard';
import { ContadorDashboard } from './components/ContadorDashboard';
import { InvestidorDashboard } from './components/InvestidorDashboard';
import { FundacaoDashboard } from './components/FundacaoDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import { ONG, Project } from './types';
import { MOCK_ONGS, MOCK_PROJECTS } from './mockData';

const INITIAL_INVESTORS: Investor[] = [
  {
    id: 'inv-1',
    name: 'Itaú Unibanco Social',
    cnpj: '60.701.190/0001-04',
    type: 'Lucro Real',
    totalDeductibleBudgetR$: 5000000,
    contactPerson: 'Juliana Mendes - Diretoria de Impacto',
    email: 'itau.social@itau.com.br',
    phone: '(11) 3003-4828',
    preferredAreas: ['Educação', 'Cultura', 'Cidadania'],
    preferredIncentiveLaws: ['FIA', 'Lei Rouanet', 'Lei do Esporte'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'inv-2',
    name: 'Klabin S.A.',
    cnpj: '89.637.490/0001-45',
    type: 'Lucro Real',
    totalDeductibleBudgetR$: 2500000,
    contactPerson: 'Ricardo Silveira - Gerente de Sustentabilidade',
    email: 'esg@klabin.com.br',
    phone: '(11) 3046-5000',
    preferredAreas: ['Meio Ambiente', 'Assistência Social'],
    preferredIncentiveLaws: ['Fundo do Idoso', 'Incentivo ao Esporte'],
    createdAt: '2026-02-10T11:00:00Z',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('advogado');
  const [activeRole, setActiveRole] = useState<UserRole>('advogado');
  const [ongs, setOngs] = useState<ONG[]>(MOCK_ONGS);
  const [activeOng, setActiveOng] = useState<ONG | null>(MOCK_ONGS[0] || null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [isExportGuideOpen, setIsExportGuideOpen] = useState<boolean>(false);
  const [isSystemLogsOpen, setIsSystemLogsOpen] = useState<boolean>(false);

  // Fetch initial ONGs, Projects, and Investors from Express API if available
  useEffect(() => {
    async function loadInitialData() {
      addLog('info', 'App', 'Carregando dados iniciais da API Express...');
      try {
        const [ongsRes, projRes, invRes] = await Promise.all([
          fetch('/api/ongs'),
          fetch('/api/projects'),
          fetch('/api/investors'),
        ]);

        if (ongsRes.ok) {
          const ongsData = await ongsRes.json();
          if (ongsData.success && ongsData.data.length > 0) {
            setOngs(ongsData.data);
            setActiveOng(ongsData.data[0]);
            addLog('info', 'App', `${ongsData.data.length} ONGs carregadas do servidor.`);
          }
        }

        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.success && projData.data.length > 0) {
            setProjects(projData.data);
            addLog('info', 'App', `${projData.data.length} projetos carregados do servidor.`);
          }
        }

        if (invRes.ok) {
          const invData = await invRes.json();
          if (invData.success && invData.data.length > 0) {
            setInvestors(invData.data);
            addLog('info', 'App', `${invData.data.length} investidores carregados do servidor.`);
          }
        }
      } catch (err) {
        addLog('warning', 'App', 'Conexão com API backend offline, usando dados locais de seed.');
        console.warn('Backend API connection skipped, using local seeds:', err);
      }
    }

    loadInitialData();
  }, []);

  const [isRefreshingSheets, setIsRefreshingSheets] = useState(false);

  const handleRefreshFromSheets = async () => {
    setIsRefreshingSheets(true);
    addLog('info', 'SheetsSync', 'Iniciando leitura atualizada da planilha Google Sheets...');
    try {
      const res = await fetch('/api/sheets/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetIdOrUrl: '1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE' }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.ongs && data.ongs.length > 0) setOngs(data.ongs);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.investors && data.investors.length > 0) setInvestors(data.investors);
        addLog('success', 'SheetsSync', `Leitura concluída com sucesso: ${data.message}`);
      } else {
        addLog('error', 'SheetsSync', `Falha ao ler planilha: ${data.error}`);
      }
    } catch (err: any) {
      addLog('error', 'SheetsSync', `Erro na requisição de leitura do Sheets: ${err.message || err}`);
      console.warn('Error refreshing from sheets:', err);
    } finally {
      setIsRefreshingSheets(false);
    }
  };

  const [syncBannerMsg, setSyncBannerMsg] = useState<string | null>(null);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);

  const handleSyncToSheets = async (
    forcedToken?: string,
    customOngs?: ONG[],
    customProjects?: Project[],
    customInvestors?: Investor[],
    promptAuthIfMissing: boolean = true
  ) => {
    setIsSyncingSheets(true);
    try {
      const currentOngs = customOngs || ongs;
      const currentProjects = customProjects || projects;
      const currentInvestors = customInvestors || investors;

      let token = forcedToken || getCachedAccessToken();

      addLog('info', 'SheetsSync', `Disparando sincronização com Sheets (${currentOngs.length} ONGs, ${currentProjects.length} Projetos, ${currentInvestors.length} Investidores). Token disponível: ${!!token}`);

      if (!token && promptAuthIfMissing) {
        addLog('info', 'GoogleAuth', 'Solicitando login do Google para gravação direta no Sheets...');
        try {
          const authRes = await googleSignIn();
          token = authRes?.accessToken || null;
        } catch (authErr: any) {
          addLog('warning', 'GoogleAuth', `Janela de autenticação cancelada ou indisponível: ${authErr.message || authErr}`);
          console.warn('Google sign in prompt skipped/cancelled:', authErr);
        }
      }

      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          accessToken: token || undefined,
          spreadsheetIdOrUrl: '1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE',
          ongs: currentOngs,
          projects: currentProjects,
          investors: currentInvestors,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addLog('success', 'SheetsSync', `Sincronização bem-sucedida! Planilha: ${data.spreadsheetId}`, data);
        setSyncBannerMsg(`✨ Dados salvos e sincronizados com sucesso na planilha oficial do Google Sheets!`);
      } else if (data.requiresAuth) {
        addLog('warning', 'SheetsSync', 'Servidor retornou status 401 (Autenticação Google necessária).', data);
        setSyncBannerMsg(`⚠️ Registro salvo no app! Clique em "🔑 Conectar Google & Sincronizar" no topo para atualizar o Sheets.`);
      } else {
        addLog('error', 'SheetsSync', `Erro retornado pelo servidor: ${data.error}`, data);
        setSyncBannerMsg(`ℹ️ Registro salvo no app! (Google Sheets: ${data.error || 'Autenticação necessária'})`);
      }
    } catch (err: any) {
      addLog('error', 'SheetsSync', `Exceção na sincronização com Sheets: ${err.message || err}`, err);
      setSyncBannerMsg(`ℹ️ Novo registro salvo com sucesso no aplicativo!`);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleConnectGoogleAndSync = async () => {
    try {
      setIsSyncingSheets(true);
      const res = await googleSignIn();
      if (res?.accessToken) {
        await handleSyncToSheets(res.accessToken);
      }
    } catch (err: any) {
      alert(`Autenticação com Google: ${err.message || 'Cancelado pelo usuário.'}`);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleRegisterSuccess = async (newOng: ONG) => {
    const ongWithDate = {
      ...newOng,
      createdAt: newOng.createdAt || new Date().toISOString(),
    };
    const updatedOngs = [ongWithDate, ...ongs];
    setOngs(updatedOngs);
    setActiveOng(ongWithDate);
    setActiveTab('maturity');
    setSyncBannerMsg(`🎉 ONG "${newOng.name}" cadastrada com sucesso! Sincronizando...`);
    try {
      await fetch('/api/ongs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ongWithDate),
      });
    } catch (err) {
      console.warn('Error saving ONG to API:', err);
    }
    handleSyncToSheets(undefined, updatedOngs, projects, investors);
  };

  const handleRegisterInvestorSuccess = async (newInvestor: Investor) => {
    const invWithDate = {
      ...newInvestor,
      createdAt: newInvestor.createdAt || new Date().toISOString(),
    };
    const updatedInvestors = [invWithDate, ...investors];
    setInvestors(updatedInvestors);
    setActiveTab('investidor');
    setSyncBannerMsg(`🎉 Investidor "${newInvestor.name}" cadastrado com sucesso! Sincronizando...`);
    try {
      await fetch('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invWithDate),
      });
    } catch (err) {
      console.warn('Error saving investor to API:', err);
    }
    handleSyncToSheets(undefined, ongs, projects, updatedInvestors);
  };

  const handleUpdateInvestor = async (updated: Investor) => {
    const updatedInvestors = investors.map(i => (i.id === updated.id ? updated : i));
    setInvestors(updatedInvestors);
    try {
      await fetch(`/api/investors/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Error updating investor:', err);
    }
    handleSyncToSheets(undefined, ongs, projects, updatedInvestors);
  };

  const handleDeleteInvestor = async (id: string) => {
    const updatedInvestors = investors.filter(i => i.id !== id);
    setInvestors(updatedInvestors);
    try {
      await fetch(`/api/investors/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Error deleting investor:', err);
    }
    handleSyncToSheets(undefined, ongs, projects, updatedInvestors);
  };

  const handleUpdateOng = async (updatedOng: ONG) => {
    const updatedOngs = ongs.map(o => (o.id === updatedOng.id ? updatedOng : o));
    setOngs(updatedOngs);
    if (activeOng && activeOng.id === updatedOng.id) {
      setActiveOng(updatedOng);
    }
    setSyncBannerMsg(`✏️ Dados da ONG "${updatedOng.name}" atualizados! Sincronizando...`);
    try {
      await fetch(`/api/ongs/${updatedOng.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOng),
      });
    } catch (err) {
      console.warn('Error updating ONG:', err);
    }
    handleSyncToSheets(undefined, updatedOngs, projects, investors);
  };

  const handleAddProject = async (newProject: Project) => {
    const projectWithDate = {
      ...newProject,
      createdAt: (newProject as any).createdAt || new Date().toISOString(),
    };
    const updatedProjects = [projectWithDate, ...projects];
    setProjects(updatedProjects);
    setSyncBannerMsg(`🚀 Novo projeto "${newProject.title}" cadastrado com sucesso! Sincronizando...`);
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectWithDate),
      });
    } catch (err) {
      console.warn('Error saving project to API:', err);
    }
    handleSyncToSheets(undefined, ongs, updatedProjects, investors);
  };

  const handleDonate = async (projectId: string, amountR$: number, donorName: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedRaised = p.raisedAmountR$ + amountR$;
        return {
          ...p,
          raisedAmountR$: updatedRaised,
          status: updatedRaised >= p.targetAmountR$ ? 'Em Execução' : 'Em Captação',
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    try {
      await fetch(`/api/projects/${projectId}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountR$, donorName }),
      });
    } catch (err) {
      console.warn('Donation sync error:', err);
    }
    handleSyncToSheets(undefined, ongs, updatedProjects, investors);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          activeOng={activeOng}
          onOpenExportGuide={() => setIsExportGuideOpen(true)}
          ongsCount={ongs.length}
        />

        {syncBannerMsg && (
          <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-slate-200">{syncBannerMsg}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {getCachedAccessToken() ? (
                <button
                  onClick={() => handleSyncToSheets()}
                  disabled={isSyncingSheets}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isSyncingSheets ? 'Sincronizando...' : '📊 Sincronizar com Google Sheets'}</span>
                </button>
              ) : (
                <button
                  onClick={handleConnectGoogleAndSync}
                  disabled={isSyncingSheets}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-md animate-bounce"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isSyncingSheets ? 'Conectando...' : '🔑 Conectar Google & Sincronizar'}</span>
                </button>
              )}
              <a
                href="https://docs.google.com/spreadsheets/d/1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE/edit?gid=0#gid=0"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-sans font-semibold px-2.5 py-1 rounded transition-all flex items-center gap-1"
              >
                <span>Abrir Planilha Oficial ↗</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsSystemLogsOpen(true)}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 font-sans font-bold px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                title="Ver Console de Logs do Sistema"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Logs</span>
              </button>
              <button
                onClick={() => setSyncBannerMsg(null)}
                className="text-slate-400 hover:text-white px-1.5 py-0.5 text-sm cursor-pointer"
                title="Fechar aviso"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Persona View 1: Advogado / Captador */}
          {activeTab === 'advogado' && (
            <AdvogadoDashboard ongs={ongs} projects={projects} />
          )}

          {/* Persona View 2: Contador OSC */}
          {activeTab === 'contador' && (
            <ContadorDashboard ongs={ongs} projects={projects} />
          )}

          {/* Persona View 3: Investidor Corporativo / Lucro Real */}
          {activeTab === 'investidor' && (
            <InvestidorDashboard
              ongs={ongs}
              projects={projects}
              investors={investors}
              onDonate={handleDonate}
              onUpdateInvestor={handleUpdateInvestor}
              onDeleteInvestor={handleDeleteInvestor}
              onRefreshFromSheets={handleRefreshFromSheets}
              isRefreshingSheets={isRefreshingSheets}
            />
          )}

          {/* Persona View 4: Fundação / Instituto Doador */}
          {activeTab === 'fundacao' && (
            <FundacaoDashboard ongs={ongs} projects={projects} />
          )}

          {/* Persona View 5: Admin DataSocial */}
          {activeTab === 'admin' && (
            <AdminDashboard ongs={ongs} projects={projects} />
          )}

          {/* CADASTRO DE INVESTIDOR */}
          {activeTab === 'cad-investidor' && (
            <InvestorForm
              onRegisterSuccess={handleRegisterInvestorSuccess}
              existingInvestors={investors}
            />
          )}

          {/* CADASTRO DE PROJETO & GESTÃO */}
          {activeTab === 'cad-projeto' && activeOng && (
            <ProjectManager
              ong={activeOng}
              projects={projects}
              onAddProject={handleAddProject}
              onDonate={handleDonate}
            />
          )}

          {/* CADASTRO DE ONG (ONBOARDING) */}
          {activeTab === 'onboarding' && (
            <OnboardingForm
              onRegisterSuccess={handleRegisterSuccess}
              existingOngs={ongs}
              onSelectOng={ong => {
                setActiveOng(ong);
                setActiveTab('maturity');
              }}
            />
          )}

          {/* SELO DE MATURIDADE */}
          {activeTab === 'maturity' && activeOng && (
            <MaturityEvaluator
              ong={activeOng}
              onUpdateOng={handleUpdateOng}
              onNavigateToProjects={async () => {
                setActiveTab('projects');
                await handleSyncToSheets(undefined, ongs, projects, investors, true);
              }}
              onNavigateToDiagnostic={() => setActiveTab('ai-diagnostic')}
            />
          )}

          {/* PROJETOS E CAPTAÇÃO */}
          {activeTab === 'projects' && activeOng && (
            <ProjectManager
              ong={activeOng}
              projects={projects}
              onAddProject={handleAddProject}
              onDonate={handleDonate}
            />
          )}

          {/* TRANSPARÊNCIA */}
          {activeTab === 'transparency' && (
            <TransparencyPortal
              ongs={ongs}
              onSelectOng={ong => {
                setActiveOng(ong);
                setActiveTab('maturity');
              }}
            />
          )}

          {/* SIMULADOR DE DIAGNÓSTICO IA */}
          {activeTab === 'ai-diagnostic' && activeOng && (
            <AiDiagnostic
              ong={activeOng}
              allOngs={ongs}
              onSelectOng={setActiveOng}
            />
          )}

          {/* GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <GoogleSheetsIntegration
              ongs={ongs}
              projects={projects}
              onImportData={(newOngs, newProjects) => {
                setOngs(newOngs);
                setProjects(newProjects);
              }}
            />
          )}
        </main>
      </div>

      {/* High Density Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-slate-400 text-xs mt-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] inline-block" />
            <span className="text-slate-300">Data Soc<span className="text-amber-400 font-mono">IA</span>l • Plataforma de Inteligência de Dados Sociais, MROSC & Captação</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsSystemLogsOpen(true)}
              className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer text-slate-300 font-bold"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Console de Logs & Diagnóstico</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsExportGuideOpen(true)}
              className="hover:text-white underline transition-colors cursor-pointer"
            >
              Baixar Código ZIP / GitHub
            </button>
            <span>•</span>
            <span>Lei 13.019/2014 (MROSC)</span>
          </div>
        </div>
      </footer>

      <ExportGuideModal
        isOpen={isExportGuideOpen}
        onClose={() => setIsExportGuideOpen(false)}
      />

      <SystemLogsModal
        isOpen={isSystemLogsOpen}
        onClose={() => setIsSystemLogsOpen(false)}
      />
    </div>
  );
}
