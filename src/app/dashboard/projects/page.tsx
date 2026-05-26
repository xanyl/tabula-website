import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  DISCOVERY: "Discovery",
  DESIGN: "Design",
  BUILD: "Build",
  REFINE: "Refine",
  COMPLETE: "Complete",
};

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { userId: session?.user?.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Projects</h1>
      <p className="mt-1 text-text-muted">
        Track the status of your workflow transformations.
      </p>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-border-subtle bg-bg-surface p-12 text-center">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="mt-2 text-text-muted">
            Start a conversation to begin your first workflow transformation.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border-subtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface">
                <th className="px-6 py-3 text-left font-medium text-text-muted">
                  Project
                </th>
                <th className="px-6 py-3 text-left font-medium text-text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-text-muted">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border-subtle last:border-0"
                >
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {statusLabels[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
