"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAS_tSvgR9EyEVqtV6fDWU3K8YugHiFjX4",
  authDomain: "babyshop-1f281.firebaseapp.com",
  databaseURL: "https://babyshop-1f281-default-rtdb.firebaseio.com",
  projectId: "babyshop-1f281",
  storageBucket: "babyshop-1f281.firebasestorage.app",
  messagingSenderId: "940262216174",
  appId: "1:940262216174:web:e1beb9d89bbfaee97dbeff",
  measurementId: "G-1ZFLSQQN27",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
