// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// Add typings for the recaptchaVerifier on the Window object
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (safe in SSR-enabled Next.js environment)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig as any);
export const auth = getAuth(app);

// For invisible reCAPTCHA (required for phone auth in web)
// - Only callable in the browser
// - Returns the created RecaptchaVerifier instance for convenience
export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  if (typeof window === "undefined") {
    throw new Error("setupRecaptcha must be called in a browser environment");
  }

  // If already created reuse it
  if (window.recaptchaVerifier) return window.recaptchaVerifier;

  // Firebase v12 RecaptchaVerifier constructor takes `auth` first
  const verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  window.recaptchaVerifier = verifier;
  return verifier;
};