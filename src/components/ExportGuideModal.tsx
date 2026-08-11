import React from 'react';
import { Download, Github, Terminal, Copy, Check, ExternalLink } from 'lucide-react';

interface ExportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportGuideModal: React.FC<ExportGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  if (!isOpen) return null;

  const repoUrl = 'https://github.com/wesleyzilva/https-github.com-wesleyzilva-DataSocial.git';
  const pagesUrl = 'https://wesleyzilva.github.io/https-github.com-wesleyzilva-DataSocial/';

  const gitCommands = `cd https-github.com-wesleyzilva-DataSocial
git init
git add .
git commit -m "feat: DataSocial - Governança, MROSC e Captação de Recursos"
git branch -M main
git remote add origin ${repoUrl}
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

        {/* Method 1: Download Snapshot ZIP directly */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Opção 1: Download Direto do Código (ZIP)</span>
            </div>
            <a
              href="/DataSocial_Projeto_Completo.zip"
              download="DataSocial_Projeto_Completo.zip"
              className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar ZIP do Projeto</span>
            </a>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Você pode baixar o arquivo <strong>DataSocial_Projeto_Completo.zip</strong> pelo botão acima, ou usar o menu superior do AI Studio em <strong>Settings &gt; Export to ZIP</strong>.
          </p>
        </div>

        {/* Method 2: Push to GitHub */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2.5 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-white font-sans">
              <Github className="w-4 h-4 text-indigo-400" />
              <span>Opção 2: Enviar para o GitHub</span>
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
            * Repositório: <a href="https://github.com/wesleyzilva/https-github.com-wesleyzilva-DataSocial" target="_blank" rel="noreferrer" className="text-indigo-400 underline">github.com/wesleyzilva/https-github.com-wesleyzilva-DataSocial</a>
          </p>
        </div>

        {/* Method 3: GitHub Pages Deployment */}
        <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 space-y-2.5 font-mono border border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-white font-sans">
              <Github className="w-4 h-4 text-emerald-400" />
              <span>Opção 3: Publicar no GitHub Pages</span>
            </div>
            <a
              href={pagesUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-1 rounded border border-emerald-600 transition-colors"
            >
              <span>Abrir App no Pages</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-emerald-200 font-sans leading-relaxed">
            O repositório já conta com o workflow do GitHub Actions em <code className="text-amber-300">.github/workflows/deploy.yml</code>. A cada push na branch <code className="text-amber-300">main</code>, o deploy no Pages é automático!
          </p>
          <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 text-xs overflow-x-auto border border-emerald-900">
            {ghPagesCommands}
          </pre>
          <p className="text-[10px] text-emerald-300 font-sans">
            * Link oficial no Pages: <a href={pagesUrl} target="_blank" rel="noreferrer" className="text-amber-300 underline font-mono">{pagesUrl}</a>
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

