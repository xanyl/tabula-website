import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Profile</h1>
      <p className="mt-1 text-text-muted">Your account details.</p>

      <div className="mt-8 max-w-md space-y-4">
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Name
          </p>
          <p className="mt-1">{session?.user?.name || "Not set"}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Email
          </p>
          <p className="mt-1">{session?.user?.email}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Member since
          </p>
          <p className="mt-1">
            {session?.user?.id
              ? "Account active"
              : "Sign in to see account details"}
          </p>
        </div>
      </div>
    </div>
  );
}
