export default function NewNotePage() {
  return (
    <section className="space-y-8">
      <header className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/60 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
          /notes/new
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Create note placeholder
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          This route is reserved for the future note creation flow and editor surface.
        </p>
      </header>
      <section className="grid gap-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Note title input placeholder
        </div>
        <div className="min-h-72 rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Editor placeholder area
        </div>
      </section>
    </section>
  );
}
