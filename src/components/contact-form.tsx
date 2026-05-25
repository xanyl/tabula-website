"use client";

import { useState, useRef } from "react";
import { submitContact } from "@/lib/actions/contact";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<{
    error?: string;
    success?: boolean;
  }>({});
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setState({});

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = await submitContact(formData);

    if ("error" in result) {
      setState({ error: result.error });
    } else {
      setState({ success: true });
      formRef.current?.reset();
    }
    setPending(false);
  };

  if (state.success) {
    return (
      <div role="status" className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-8 text-center">
        <p className="text-lg font-semibold">Message sent</p>
        <p className="mt-2 text-text-muted">
          We will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          placeholder="Company name (optional)"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="message">
          What are you working on?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none resize-none"
          placeholder="Tell us about your workflows, your team, and what you are trying to improve."
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.22)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
