import React from 'react';
import { Download, Github, Terminal, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';

interface ExportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportGuideModal: React.FC<ExportGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  if (!isOpen) return null;

  const gitCommands = `cd arandu-ong
git init
git add .
git commit -m "feat: Arandu ONG / ONGanizator - Governança, Leis e Captação"
git branch -M main
git remote add origin https://github.com/wesleyzilva/AranduONG.git
git push -u origin main`;

  const ghPagesCommands = `npm run build
npx gh-pages -d dist`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex justify-between items-start border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Exportação & Deployment
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">
              Como Baixar o Projeto ou Publicar no GitHub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-base p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Method 1: Download Snapshot ZIP directly in AI Studio */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Opção 1: Download Direto do Código (Snapshot ZIP)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Você pode baixar o código completo deste projeto diretamente na interface do <strong>Google AI Studio</strong>:
          </p>
          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 font-medium">
            <li>No canto superior direito do AI Studio, clique no menu de três pontos <strong>(...)</strong> ou <strong>Settings</strong>.</li>
            <li>Selecione a opção <strong>Export Project / Download Snapshot</strong> ou <strong>Export to ZIP</strong>.</li>
            <li>O arquivo ZIP será baixado para o seu computador com todos os arquivos do monólito.</li>
          </ol>
        </div>

        {/* Method 2: Push to GitHub */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2.5 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-white font-sans">
              <Github className="w-4 h-4 text-indigo-400" />
              <span>Opção 2: Enviar para o GitHub (Primeira Vez)</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd ? 'Copiado!' : 'Copiar Comandos'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Para publicar este repositório no seu GitHub pela primeira vez:
          </p>

          <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 text-xs overflow-x-auto border border-slate-800">
            {gitCommands}
          </pre>

          <p className="text-[10px] text-slate-400 font-sans">
            * Repositório: <a href="https://github.com/wesleyzilva/AranduONG" target="_blank" rel="noreferrer" className="text-indigo-400 underline">github.com/wesleyzilva/AranduONG</a>
          </p>
        </div>

        {/* Method 3: GitHub Pages Deployment */}
        <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 space-y-2.5 font-mono border border-emerald-800">
          <div className="flex items-center gap-2 font-bold text-xs text-white font-sans">
            <Github className="w-4 h-4 text-emerald-400" />
            <span>Opção 3: Publicar no GitHub Pages (gh-pages)</span>
          </div>
          <p className="text-xs text-emerald-200 font-sans leading-relaxed">
            Para publicar a aplicação estática no <strong>GitHub Pages</strong> (`https://wesleyzilva.github.io/AranduONG/`):
          </p>
          <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 text-xs overflow-x-auto border border-emerald-900">
            {ghPagesCommands}
          </pre>
          <p className="text-[10px] text-emerald-300 font-sans">
            * No repositório no GitHub, vá em <strong>Settings &gt; Pages</strong> e defina a Source para o branch <strong>gh-pages</strong> ou via GitHub Action. O `vite.config.ts` já possui `base: './'` configurado para compatibilidade total.
          </p>
        </div>

        {/* Method 4: How to run locally */}
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
            <Terminal className="w-4 h-4 text-indigo-700" />
            <span>Como rodar localmente após o download:</span>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Execute no terminal dentro da pasta extraída:
          </p>
          <code className="block p-2 bg-slate-900 text-emerald-400 rounded font-mono text-xs">
            npm install && npm run dev
          </code>
          <p className="text-[10px] font-mono text-indigo-700">
            Acesse <strong>http://localhost:3000</strong> no seu navegador.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Entendido, Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
