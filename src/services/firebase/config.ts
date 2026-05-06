import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

import { ENV } from '@/constants/env';

const firebaseConfig = {
  apiKey: ENV.firebaseApiKey,
  authDomain: ENV.firebaseAuthDomain,
  databaseURL: ENV.firebaseDatabaseURL,
  projectId: ENV.firebaseProjectId,
  storageBucket: ENV.firebaseStorageBucket,
  messagingSenderId: ENV.firebaseMessagingSenderId,
  appId: ENV.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
export const firebaseDb = getDatabase(app);
