"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { closeAlert, showLoading, toast } from "@/lib/helpers";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    showLoading("Signing in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeAlert();
      router.replace("/dashboard");
    } catch (error: any) {
      closeAlert();
      toast("Invalid email or password.", "error", 4000);
    } finally {
      setSubmitting(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-mauve-900 px-4 py-8">
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center gap-1 text-center">
          <h2 className="text-2xl font-semibold text-indigo-500">
            Trade Logger
          </h2>
          <h4 className="text-2xl font-semibold text-white">Welcome back</h4>
          <p className="text-sm text-mauve-300">
            Log in to resume logging your trades.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-mauve-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Need an account?{" "}
          <Link
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
            href="/auth/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
