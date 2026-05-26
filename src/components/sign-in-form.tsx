"use client";

import { signIn } from "next-auth/react";

export function SignInForm() {
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
    </div>
  );
}
