"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type WebUser = {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
};

type AuthContextValue = {
  user: WebUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<WebUser>;
  register: (name: string, email: string, password: string) => Promise<WebUser>;
  googleLogin: () => Promise<WebUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function checkEmailVerification(firebaseUser: User) {
  try {
    const settingsSnap = await getDoc(doc(db, "admin_settings", "store"));
    const requireVerification = settingsSnap.exists() ? settingsSnap.data().requireEmailVerification : false;
    if (requireVerification && !firebaseUser.emailVerified) {
      await sendEmailVerification(firebaseUser);
      await signOut(auth);
      throw new Error("EMAIL_NOT_VERIFIED");
    }
  } catch (err: any) {
    if (err.message === "EMAIL_NOT_VERIFIED") throw err;
    // Ignore Firestore permission errors for admin_settings
  }
}

async function loadProfile(user: User): Promise<WebUser> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const fallbackRole = user.email?.toLowerCase().includes("admin") ? "admin" : "user";

  if (!snap.exists()) {
    const profile = {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? user.email?.split("@")[0] ?? "Parent",
      avatarIndex: 0,
      isTotpEnabled: false,
      role: fallbackRole,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return {
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      role: fallbackRole as "admin" | "user",
    };
  }

  const data = snap.data();
  return {
    uid: user.uid,
    email: user.email ?? data.email ?? "",
    displayName: data.displayName ?? user.displayName ?? user.email?.split("@")[0] ?? "Parent",
    role: (data.role ?? fallbackRole) as "admin" | "user",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WebUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        let requireVerification = false;
        try {
          const settingsSnap = await getDoc(doc(db, "admin_settings", "store"));
          requireVerification = settingsSnap.exists() ? settingsSnap.data().requireEmailVerification : false;
        } catch (e) {
          // Ignore permission errors
        }

        if (requireVerification && !firebaseUser.emailVerified) {
          setUser(null);
          document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } else {
          const profile = await loadProfile(firebaseUser);
          setUser(profile);
          document.cookie = `auth_token=true; path=/; max-age=86400`;
          document.cookie = `auth_role=${profile.role}; path=/; max-age=86400`;
        }
      } catch {
        setUser(null);
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await checkEmailVerification(credential.user);
        const profile = await loadProfile(credential.user);
        setUser(profile);
        document.cookie = `auth_token=true; path=/; max-age=86400`;
        document.cookie = `auth_role=${profile.role}; path=/; max-age=86400`;
        return profile;
      },
      async register(name, email, password) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        const role = email.toLowerCase().includes("admin") ? "admin" : "user";
        await setDoc(doc(db, "users", credential.user.uid), {
          uid: credential.user.uid,
          email,
          displayName: name,
          avatarIndex: 0,
          isTotpEnabled: false,
          role,
          createdAt: serverTimestamp(),
        });
        await checkEmailVerification(credential.user);
        const profile = await loadProfile(credential.user);
        setUser(profile);
        document.cookie = `auth_token=true; path=/; max-age=86400`;
        document.cookie = `auth_role=${profile.role}; path=/; max-age=86400`;
        return profile;
      },
      async googleLogin() {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        await checkEmailVerification(credential.user);
        const profile = await loadProfile(credential.user);
        setUser(profile);
        document.cookie = `auth_token=true; path=/; max-age=86400`;
        document.cookie = `auth_role=${profile.role}; path=/; max-age=86400`;
        return profile;
      },
      async logout() {
        await signOut(auth);
        setUser(null);
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
