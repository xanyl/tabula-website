import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  NEW: "New",
  IN_REVIEW: "In Review",
  RESPONDED: "Responded",
};

export default async function InquiriesPage() {
  const session = await auth();
  const inquiries = await prisma.contactInquiry.findMany({
    where: {
      OR: [
        { userId: session?.user?.id || undefined },
        { email: session?.user?.email || "" },
      ].filter((c) => Object.keys(c).length > 0),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Inquiries</h1>
      <p className="mt-1 text-text-muted">
        Your contact form submissions and their status.
      </p>

      {inquiries.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-bg-surface p-12 text-center">
          <p className="text-lg font-medium">No inquiries yet</p>
          <p className="mt-2 text-text-muted">
            Your contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-2xl border border-white/[0.06] bg-bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {inquiry.message.slice(0, 100)}
                    {inquiry.message.length > 100 ? "..." : ""}
                  </p>
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {statusLabels[inquiry.status]}
                </span>
              </div>
              <p className="mt-3 text-xs text-text-muted">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
