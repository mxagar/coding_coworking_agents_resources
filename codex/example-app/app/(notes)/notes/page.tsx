export default function NotesIndexPage() {
  return (
    <section className="space-y-8">
      <header className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/60 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
          /notes
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Notes list placeholder
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          This page will eventually render the authenticated user&apos;s notes sorted by update
          time. In this scaffold, it only defines the route and basic shell content.
        </p>
      </header>
      <section className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 p-8">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Empty state</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your notes will appear here once note listing and persistence are implemented.
        </p>
      </section>
    </section>
  );
}
