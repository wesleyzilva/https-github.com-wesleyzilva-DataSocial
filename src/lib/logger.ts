export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  message: string;
  details?: any;
}

type LogListener = (logs: LogEntry[]) => void;

let logs: LogEntry[] = [];
const listeners: Set<LogListener> = new Set();

export const addLog = (
  type: LogEntry['type'],
  category: string,
  message: string,
  details?: any
) => {
  const entry: LogEntry = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    type,
    category,
    message,
    details,
  };

  logs = [entry, ...logs].slice(0, 100); // Keep last 100 logs
  console.log(`[${entry.type.toUpperCase()}] [${category}] ${message}`, details || '');
  listeners.forEach(fn => fn([...logs]));
  return entry;
};

export const getLogs = (): LogEntry[] => [...logs];

export const clearLogs = () => {
  logs = [];
  listeners.forEach(fn => fn([]));
};

export const subscribeLogs = (listener: LogListener) => {
  listeners.add(listener);
  listener([...logs]);
  return () => {
    listeners.delete(listener);
  };
};
