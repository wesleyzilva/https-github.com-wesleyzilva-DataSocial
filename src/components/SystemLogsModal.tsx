import React, { useState, useEffect } from 'react';
import { Terminal, X, Copy, Check, Trash2, Filter, AlertTriangle, CheckCircle, Info, Bug } from 'lucide-react';
import { getLogs, clearLogs, subscribeLogs, LogEntry, addLog } from '../lib/logger';

interface SystemLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemLogsModal: React.FC<SystemLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = subscribeLogs(setLogs);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(l => {
    if (filterType === 'all') return true;
    if (filterType === 'error') return l.type === 'error' || l.type === 'warning';
    if (filterType === 'auth') return l.category === 'GoogleAuth';
    if (filterType === 'sync') return l.category === 'SheetsSync' || l.category === 'API';
    return true;
  });

  const handleCopy = () => {
    const text = logs
      .map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] [${l.category}] ${l.message} ${l.details ? JSON.stringify(l.details) : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    clearLogs();
    addLog('info', 'System', 'Logs limpos pelo usuário.');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] overflow-hidden text-slate-100 font-sans">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Console de Logs & Diagnóstico de Sistema</span>
                <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-emerald-400 border border-slate-700">
                  {logs.length} eventos
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rastreamento em tempo real de autenticação Google, sincronização com Sheets e chamadas de API.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Filters */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({logs.length})
            </button>
            <button
              onClick={() => setFilterType('error')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filterType === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-red-400'
              }`}
            >
              Erros & Alertas
            </button>
            <button
              onClick={() => setFilterType('sync')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filterType === 'sync' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Sheets & Sync
            </button>
            <button
              onClick={() => setFilterType('auth')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filterType === 'auth' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-indigo-400'
              }`}
            >
              Google Auth
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar Logs'}</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/60 hover:bg-red-950/40 text-slate-400 hover:text-red-300 text-xs font-bold rounded-lg border border-slate-800 hover:border-red-900/50 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Log Viewer Container */}
        <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-y-auto space-y-2 select-text">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <Bug className="w-8 h-8 text-slate-700" />
              <p>Nenhum log registrado para este filtro até o momento.</p>
            </div>
          ) : (
            filteredLogs.map(log => {
              let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
              let Icon = Info;

              if (log.type === 'success') {
                badgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
                Icon = CheckCircle;
              } else if (log.type === 'error') {
                badgeColor = 'bg-red-950/80 text-red-300 border-red-800/60';
                Icon = AlertTriangle;
              } else if (log.type === 'warning') {
                badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-800/60';
                Icon = AlertTriangle;
              }

              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border flex flex-col gap-1.5 transition-all ${badgeColor}`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-slate-400">[{log.timestamp}]</span>
                      <span className="uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                        {log.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{log.type}</span>
                  </div>

                  <p className="text-slate-100 font-sans text-xs font-medium leading-relaxed pl-5 whitespace-pre-wrap">
                    {log.message}
                  </p>

                  {log.details && (
                    <div className="mt-1 ml-5 p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
                      <pre className="font-mono text-[11px] leading-tight">
                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Planilha Oficial: <code className="text-emerald-400 font-mono">1OCJjWhV9CzI9fOt9NqpVmfin5lDciyz2GASCE80d5eE</code></span>
          <span>Sincronização ativa • Data SocIAl</span>
        </div>

      </div>
    </div>
  );
};
