import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  enableNetwork,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAKaAXDIaVAt4lMtAkdJbeySZPwRBHEH4k',
  authDomain: 'sipangzi007-c602d.firebaseapp.com',
  databaseURL:
    'https://sipangzi007-c602d-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'sipangzi007-c602d',
  storageBucket: 'sipangzi007-c602d.firebasestorage.app',
  messagingSenderId: '901895724913',
  appId: '1:901895724913:web:d68c98cfe8942448f6e0d0',
  measurementId: 'G-SGXX49LW3J',
};

const app: FirebaseApp = initializeApp(firebaseConfig);
// 使用新 cache API 並啟用多分頁共用，避免 enableIndexedDbPersistence 棄用與獨佔錯誤
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const realtimeDb = getDatabase(app);
export default app;

/** 檢查 Firestore 連線是否可用（等待連線後嘗試讀取 config/admin，逾時 8 秒） */
export async function checkFirestoreConnection(): Promise<boolean> {
  try {
    await Promise.race([
      enableNetwork(db),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 4000)
      ),
    ]);
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 4000)
    );
    const read = getDoc(doc(db, 'config', 'admin'));
    await Promise.race([read, timeout]);
    return true;
  } catch {
    return false;
  }
}
