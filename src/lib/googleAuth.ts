import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { addLog } from './logger';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = null;

// Load initial token from sessionStorage if present
if (typeof window !== 'undefined') {
  cachedAccessToken = sessionStorage.getItem('google_sheets_access_token');
  if (cachedAccessToken) {
    addLog('info', 'GoogleAuth', 'Token de acesso carregado da sessão armazenada.');
  }
}

export const getCachedAccessToken = (): string | null => {
  if (cachedAccessToken) return cachedAccessToken;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('google_sheets_access_token');
  }
  return null;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('google_sheets_access_token', token);
      addLog('info', 'GoogleAuth', `Token OAuth salvo na sessão (${token.substring(0, 10)}...).`);
    } else {
      sessionStorage.removeItem('google_sheets_access_token');
      addLog('warning', 'GoogleAuth', 'Token OAuth removido da sessão.');
    }
  }
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  addLog('info', 'GoogleAuth', 'Iniciando autenticação Google via Janela Popup...');
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      addLog('error', 'GoogleAuth', 'Falha ao obter credential.accessToken após popup do Google.');
      throw new Error('Não foi possível obter o token de acesso do Google.');
    }

    setCachedAccessToken(credential.accessToken);
    addLog('success', 'GoogleAuth', `Autenticação com Google efetuada com sucesso! Usuário: ${result.user.email}`);
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error: any) {
    addLog('error', 'GoogleAuth', `Erro na autenticação do Google: ${error.message || error}`, error);
    console.error('Erro no login do Google:', error);
    throw error;
  }
};

export const initAuthListener = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    const token = getCachedAccessToken();
    if (user && token) {
      if (onSuccess) onSuccess(user, token);
    } else {
      if (onFailure) onFailure();
    }
  });
};
