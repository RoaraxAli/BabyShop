"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Palette, Moon, Sun } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const THEME_PRESETS = [
  { name: "Default Rose", hex: "#ff8fa1", darkHex: "#e85f78" },
  { name: "Mint Green", hex: "#e7f6ec", darkHex: "#c1e8d2" },
  { name: "Sky Blue", hex: "#e7f3ff", darkHex: "#b5d8f7" },
  { name: "Lavender", hex: "#f1ebff", darkHex: "#d1c4e9" },
  { name: "Amber", hex: "#ffbc63", darkHex: "#ffa000" },
];

export default function ThemeCustomizerPage() {
  const { user } = useAuth();
  const [customHex, setCustomHex] = useState("#ff8fa1");
  const [darkMode, setDarkMode] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Load local dark mode pref
    if (typeof window !== "undefined") {
      setDarkMode(document.documentElement.classList.contains("dark"));
      const savedHex = localStorage.getItem("custom_theme_hex");
      if (savedHex) setCustomHex(savedHex);
    }
  }, []);

  function handleDarkModeToggle() {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  function handlePresetSelect(hex: string, darkHex: string) {
    setCustomHex(hex);
    document.documentElement.style.setProperty("--rose", hex);
    document.documentElement.style.setProperty("--rose-dark", darkHex);
  }

  async function handleSaveTheme(e: FormEvent) {
    e.preventDefault();
    setStatus("Saving theme...");
    try {
      localStorage.setItem("custom_theme_hex", customHex);
      document.documentElement.style.setProperty("--rose", customHex);
      
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          themeColor: customHex,
          darkMode: darkMode
        });
      }
      setStatus("Theme preferences saved!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("Failed to save theme.");
    }
  }

  return (
    <ProtectedRoute>
      <main className="shop-layout bg-background min-h-screen">
        <section className="shop-content max-w-2xl mx-auto py-12 px-4 md:px-0">
          <div className="mb-6">
            <Link href="/shop?tab=profile" className="text-[var(--rose-dark)] font-bold mb-4 inline-block hover:underline">
              ← Back to Profile
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Palette size={28} className="text-[var(--rose)]" />
            <h1 className="text-3xl font-bold m-0">App Theme Customizer</h1>
          </div>
          <p className="text-muted-foreground mb-8">Personalize your BabyShop experience. These settings sync with your mobile app profile.</p>

          <form className="bg-white dark:bg-zinc-900 border border-border p-6 rounded-2xl shadow-sm" onSubmit={handleSaveTheme}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
              <div className="flex gap-4 flex-wrap mb-4">
                {THEME_PRESETS.map((t) => (
                  <button 
                    key={t.name}
                    type="button"
                    onClick={() => handlePresetSelect(t.hex, t.darkHex)}
                    className="w-12 h-12 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
                    style={{ backgroundColor: t.hex, borderColor: customHex === t.hex ? 'var(--ink)' : 'transparent' }}
                    title={t.name}
                  />
                ))}
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-medium text-sm">Custom Hex Color</span>
                <input 
                  type="color" 
                  value={customHex} 
                  onChange={(e) => setCustomHex(e.target.value)}
                  className="w-24 h-12 rounded cursor-pointer border border-border p-1" 
                />
              </label>
            </div>

            <div className="h-px bg-border my-6"></div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />} 
                Appearance
              </h3>
              <button 
                type="button" 
                onClick={handleDarkModeToggle}
                className="px-4 py-2 border border-border rounded-lg bg-transparent hover:bg-muted font-medium transition-colors cursor-pointer"
              >
                Toggle {darkMode ? "Light" : "Dark"} Mode
              </button>
            </div>

            <div className="flex items-center justify-between mt-8">
              <span className="text-sm font-medium text-emerald-600">{status}</span>
              <button type="submit" className="btn-primary-gradient px-6 py-3 rounded-lg text-white font-bold cursor-pointer border-none shadow-md">
                Save Preferences
              </button>
            </div>
          </form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
