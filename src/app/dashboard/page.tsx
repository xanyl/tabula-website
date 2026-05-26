import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardOverview() {
  const session = await auth();
  const userId = session?.user?.id;

  const [projectCount, inquiryCount] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.contactInquiry.count({
      where: userId ? { userId } : { email: session?.user?.email || "" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">
        Welcome back{", "}
        {session?.user?.name?.split(" ")[0] || "there"}.
      </h1>
      <p className="mt-1 text-text-muted">
        Here is an overview of your work with Tabula.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Active Projects
          </p>
          <p className="mt-2 font-serif text-4xl">{projectCount}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Inquiries
          </p>
          <p className="mt-2 font-serif text-4xl">{inquiryCount}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Status
          </p>
          <p className="mt-2 text-sm text-accent">Active</p>
        </div>
      </div>
    </div>
  );
}
