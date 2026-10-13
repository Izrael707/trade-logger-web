'use client'
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!loading && user) router.replace("/dashboard");
    }, [loading, user, router]);
  return (
    <div className="relative flex min-h-svh flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* Grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:44px_44px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
      />
      {/* Soft radial fade so the grid melts into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(250,250,250,0.9)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.9)_100%)]"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-lg font-semibold text-indigo-600">
          Trade Logger
        </span>
        <Link
          href="/auth/signup"
          className="text-sm font-medium text-zinc-700 transition hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
            Built for ICT Forex traders
          </span>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A home for{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              vicious traders.
            </span>
          </h1>

          <p className="max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Log every trade, capture your narrative, and review your edge — all
            in one place.
          </p>

          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
            <Link
              href="/auth/signup"
              className="flex h-12 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-40"
            >
              Start Now
            </Link>
            <Link
              href="/auth/login"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white/70 px-6 text-sm font-medium text-zinc-700 backdrop-blur transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:w-40"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center text-xs text-zinc-500 sm:px-10">
        © {new Date().getFullYear()} Trade Logger. All rights reserved.
      </footer>
    </div>
  );
}
