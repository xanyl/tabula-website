export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 border border-accent/20 font-mono text-lg font-bold text-accent">
            T
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
