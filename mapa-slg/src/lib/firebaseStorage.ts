import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBAS_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBAS_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBAS_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBAS_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBAS_MSGID,
  appId: process.env.NEXT_PUBLIC_FIREBAS_APPID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
