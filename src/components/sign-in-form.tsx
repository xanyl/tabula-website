"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, redirect: false });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-6 text-center">
        <p className="font-semibold">Check your email</p>
        <p className="mt-2 text-sm text-text-muted">
          We sent a magic link to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border-subtle bg-bg-glass px-4 py-3 text-sm font-medium transition-colors hover:bg-bg-glass-hover"
      >
        Continue with Google
      </button>

      <button
        onClick={() => signIn("github")}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border-subtle bg-bg-glass px-4 py-3 text-sm font-medium transition-colors hover:bg-bg-glass-hover"
      >
        Continue with GitHub
      </button>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-border-subtle" />
        <span className="text-xs text-text-muted">or</span>
        <hr className="flex-1 border-border-subtle" />
      </div>

      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-border-subtle bg-bg-glass px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>
    </div>
  );
}
