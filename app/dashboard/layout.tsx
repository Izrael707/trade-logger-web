"use client";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const Dashboardlayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/signup");
  }, [loading, user, router]);

  if (loading || !user) return null;

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="relative h-svh bg-mauve-900 text-white">
      {/* Grid background — same as auth screens */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px]"
      />

      <div className="relative flex h-dvh">
        {/* Sidebar (md+) */}
        <aside className="hidden w-1/4 flex-col border-r border-white/10 bg-mauve-900/80 p-4 backdrop-blur-sm md:flex">
          <div className="flex flex-1 flex-col gap-8">
            <h1 className="text-3xl font-semibold text-indigo-500">
              Trade Logger
            </h1>
            <div className="flex flex-col gap-3">
              <Link
                href={"/dashboard"}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 text-lg font-medium text-white transition hover:bg-white/10"
              >
                <span>Home</span>
              </Link>
              <Link
                href={"/dashboard/add-trade"}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 text-lg font-medium text-white transition hover:bg-white/10"
              >
                <span>New Trade</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            {user && (
              <p className="truncate text-sm text-zinc-400">
                Welcome, <span className="text-white">{user.email}</span>
              </p>
            )}
            <button
              className="w-full cursor-pointer rounded-lg border border-red-500/40 bg-red-500/5 p-2 text-sm font-medium text-red-400 transition hover:bg-red-500/15 hover:text-red-300"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="flex items-center justify-between border-b border-white/10 bg-mauve-900/80 px-4 py-3 backdrop-blur-sm md:hidden">
            <h1 className="text-xl font-semibold text-indigo-500">
              Trade Logger
            </h1>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </header>

          {/* Mobile dropdown nav */}
          {menuOpen && (
            <div className="flex flex-col gap-2 border-b border-white/10 bg-mauve-900/90 p-4 backdrop-blur-sm md:hidden">
              <Link
                href={"/dashboard"}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-3 text-base font-medium text-white transition hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                href={"/dashboard/add-trade"}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-3 text-base font-medium text-white transition hover:bg-white/10"
              >
                New Trade
              </Link>
              <p className="truncate pt-2 text-sm text-zinc-400">
                Welcome, <span className="text-white">{user.email}</span>
              </p>
              <button
                className="w-full cursor-pointer rounded-lg border border-red-500/40 bg-red-500/5 p-2 text-sm font-medium text-red-400 transition hover:bg-red-500/15 hover:text-red-300"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Content */}
          <main className="flex-1 overflow-auto bg-gray-100 px-4 py-5 text-black sm:px-6 md:px-8 lg:px-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboardlayout;
