type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { id } = await params;

  return (
    <section className="space-y-8">
      <header className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50/60 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
          /notes/[id]
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Note editor placeholder
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Dynamic note route scaffold for note id <span className="font-medium text-slate-900">{id}</span>.
        </p>
      </header>
      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-h-80 rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Editor content placeholder
        </div>
        <aside className="rounded-[1.75rem] border border-dashed border-cyan-200 bg-cyan-50/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Share controls placeholder</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Future share toggles, public link output, and note actions will be rendered here.
          </p>
        </aside>
      </section>
    </section>
  );
}
