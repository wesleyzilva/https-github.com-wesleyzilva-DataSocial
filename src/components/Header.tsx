import React from 'react';
import {
  Award,
  ShieldCheck,
  Download,
  HeartHandshake,
  Sparkles,
  Building2,
  FileSpreadsheet,
  Scale,
  Calculator,
  Briefcase,
  UserCheck,
  Lock,
  PlusCircle,
  FileText
} from 'lucide-react';
import { ONG } from '../types';

export type UserRole = 'advogado' | 'contador' | 'investidor' | 'fundacao' | 'admin' | 'ong';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeOng: ONG | null;
  onOpenExportGuide: () => void;
  ongsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  activeOng,
  onOpenExportGuide,
  ongsCount,
}) => {
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'advogado') setActiveTab('advogado');
    else if (role === 'contador') setActiveTab('contador');
    else if (role === 'investidor') setActiveTab('investidor');
    else if (role === 'fundacao') setActiveTab('fundacao');
    else if (role === 'admin') setActiveTab('admin');
    else if (role === 'ong') setActiveTab('onboarding');
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 sm:h-14 border-b border-slate-800 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm tracking-tight font-mono shrink-0 border border-emerald-400/40">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Data Soc<span className="text-amber-400 font-mono">IA</span>l
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-md">
                  Inteligência de Dados Sociais
                </span>
              </div>
            </div>
          </div>

          {/* Role Switcher & Export & Google Drive */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 hidden lg:inline">
                Perfil:
              </span>
              <button
                onClick={() => handleRoleChange('advogado')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeRole === 'advogado'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                ⚖️ Advogado
              </button>
              <button
                onClick={() => handleRoleChange('contador')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeRole === 'contador'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                📊 Contador
              </button>
              <button
                onClick={() => handleRoleChange('investidor')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeRole === 'investidor'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                💼 Investidor
              </button>
              <button
                onClick={() => handleRoleChange('fundacao')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeRole === 'fundacao'
                    ? 'bg-indigo-500 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                🏛️ Fundação
              </button>
              <button
                onClick={() => handleRoleChange('ong')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeRole === 'ong'
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                🌱 ONG
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                🛡️ Admin
              </button>
            </div>

            {/* Direct Google Sheets Link Button */}
            <a
              href="https://docs.google.com/spreadsheets/d/1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE/edit?gid=0#gid=0"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-all shadow-sm active:scale-95 cursor-pointer border border-emerald-400/30"
              title="Abrir Planilha Oficial no Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-300" />
              <span>Planilha Oficial ↗</span>
            </a>

            <button
              onClick={onOpenExportGuide}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all border border-slate-700 cursor-pointer"
              title="Exportar Código"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Exportar ZIP</span>
            </button>
          </div>
        </div>

        {/* Role-Restricted Sub-Navigation Journey Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none text-xs font-medium items-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            Jornada {activeRole.toUpperCase()}:
          </span>

          {/* ADVOGADO JOURNEY TABS */}
          {activeRole === 'advogado' && (
            <>
              <button
                onClick={() => setActiveTab('advogado')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'advogado' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-amber-300 hover:bg-slate-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>CRM & Split de Captação</span>
              </button>
              <button
                onClick={() => setActiveTab('cad-investidor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'cad-investidor' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cadastrar Investidor</span>
              </button>
              <button
                onClick={() => setActiveTab('cad-projeto')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'cad-projeto' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cadastrar Projeto</span>
              </button>
              <button
                onClick={() => setActiveTab('transparency')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'transparency' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Catalogo de ONGs</span>
              </button>
            </>
          )}

          {/* CONTADOR JOURNEY TABS */}
          {activeRole === 'contador' && (
            <>
              <button
                onClick={() => setActiveTab('contador')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'contador' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-cyan-300 hover:bg-slate-800'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Conciliação MROSC & CNDs</span>
              </button>
              <button
                onClick={() => setActiveTab('transparency')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'transparency' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Prestação de Contas ({ongsCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('maturity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'maturity' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Validador de Selo</span>
              </button>
            </>
          )}

          {/* INVESTIDOR JOURNEY TABS */}
          {activeRole === 'investidor' && (
            <>
              <button
                onClick={() => setActiveTab('investidor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'investidor' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-emerald-300 hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Simulador de Abatimento IRPJ</span>
              </button>
              <button
                onClick={() => setActiveTab('cad-investidor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'cad-investidor' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cadastrar Empresa Doadora</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'projects' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>Projetos Elegíveis para Aporte</span>
              </button>
            </>
          )}

          {/* FUNDACAO JOURNEY TABS */}
          {activeRole === 'fundacao' && (
            <>
              <button
                onClick={() => setActiveTab('fundacao')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'fundacao' ? 'bg-indigo-600 text-white font-extrabold' : 'text-indigo-300 hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Matriz de Risco & Editais GIFE</span>
              </button>
              <button
                onClick={() => setActiveTab('transparency')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'transparency' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Relatório de Transparência</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-diagnostic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'ai-diagnostic' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Diagnóstico Inteligente IA</span>
              </button>
            </>
          )}

          {/* ONG JOURNEY TABS */}
          {activeRole === 'ong' && (
            <>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'onboarding' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Cadastrar ONG</span>
              </button>
              <button
                onClick={() => setActiveTab('cad-projeto')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'cad-projeto' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cadastrar Projeto</span>
              </button>
              <button
                onClick={() => setActiveTab('maturity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'maturity' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Selo de Maturidade</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-diagnostic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'ai-diagnostic' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simular Diagnóstico IA</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'projects' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>Meus Projetos & Captação</span>
              </button>
            </>
          )}

          {/* ADMIN JOURNEY TABS */}
          {activeRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'admin' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Painel Admin Master</span>
              </button>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'onboarding' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Cadastrar ONG</span>
              </button>
              <button
                onClick={() => setActiveTab('cad-projeto')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'cad-projeto' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cadastrar Projeto</span>
              </button>
              <button
                onClick={() => setActiveTab('cad-investidor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'cad-investidor' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cadastrar Investidor</span>
              </button>
              <button
                onClick={() => setActiveTab('sheets')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'sheets' ? 'bg-slate-700 text-white font-bold' : 'text-emerald-400 hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Sheets API</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
