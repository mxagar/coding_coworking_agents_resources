export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:flex-row">
        <aside className="border-b border-cyan-100 bg-cyan-50/70 p-6 lg:w-72 lg:border-r lg:border-b-0">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
            TinyNotes
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            Notes app shell
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Future navigation, account controls, and note metadata will live in this area.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-cyan-100 bg-white/70 px-4 py-3">Notes list</div>
            <div className="rounded-xl border border-cyan-100 bg-white/70 px-4 py-3">New note</div>
            <div className="rounded-xl border border-cyan-100 bg-white/70 px-4 py-3">Share controls</div>
          </div>
        </aside>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
