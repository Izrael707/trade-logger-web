"use client";

import { auth } from "@/lib/firebase";
import { closeAlert, showLoading, toast } from "@/lib/helpers";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const confirmMatches = password === confirm;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmMatches) return;

    setSubmitting(true);
    showLoading("Signing up...");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      closeAlert();
      router.replace("/dashboard");
    } catch (error: any) {
      closeAlert();
      toast(error.message, "error", 4000);
    } finally {
      setSubmitting(false);
      setEmail("");
      setPassword("");
      setConfirm("");
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-mauve-900 px-4 py-8">
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
          <h4 className="text-2xl font-semibold text-white">Create account</h4>
          <p className="text-sm text-mauve-300">
            Log your setups and review your edge — free forever.
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
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-sm font-medium text-zinc-300"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              onChange={(e) => setConfirm(e.target.value)}
              value={confirm}
              aria-describedby={
                confirmMatches ? undefined : "password-match-error"
              }
              className={`w-full rounded-lg border bg-white/5 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:ring-2 ${
                confirm.length > 0 && !confirmMatches
                  ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
                  : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30"
              }`}
            />
            {!confirmMatches && confirm.length > 0 && (
              <span id="password-match-error" className="text-xs text-red-400">
                Passwords do not match.
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !confirmMatches}
            className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-mauve-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
            href="/auth/login"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
