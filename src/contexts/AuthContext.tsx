import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { doc, getDoc, setDoc, enableNetwork } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ADMIN_SESSION_KEY = 'admin_session';
const CONFIG_COLLECTION = 'config';
const ADMIN_DOC_ID = 'admin';
const DEFAULT_PASSWORD = '0000';

interface AdminUser {
  id: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  signIn: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function getStoredPassword(): Promise<string> {
  const docRef = doc(db, CONFIG_COLLECTION, ADMIN_DOC_ID);
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 等待 Firestore 連線就緒（最多 6 秒），避免 "client is offline" 錯誤
      await Promise.race([
        enableNetwork(db),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('enableNetwork timeout')), 6000)
        ),
      ]).catch(() => {});
      const snap = await getDoc(docRef);
      const data = snap.data();
      return data?.password ?? DEFAULT_PASSWORD;
    } catch (err) {
      const isOffline =
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message: string }).message === 'string' &&
        (err as { message: string }).message.includes('offline');
      if (isOffline && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
      throw err;
    }
  }
  return DEFAULT_PASSWORD;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
    setUser(hasSession ? { id: 'admin' } : null);
    setLoading(false);
  }, []);

  const signIn = async (password: string) => {
    const stored = await getStoredPassword();
    if (password !== stored) {
      throw new Error('密碼錯誤');
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    setUser({ id: 'admin' });
  };

  const signOut = async () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const stored = await getStoredPassword();
    if (currentPassword !== stored) {
      throw new Error('目前密碼錯誤');
    }
    await setDoc(doc(db, CONFIG_COLLECTION, ADMIN_DOC_ID), { password: newPassword });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
