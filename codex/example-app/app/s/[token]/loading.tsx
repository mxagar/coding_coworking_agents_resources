export default function SharedNoteLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-[2rem] border border-dashed border-cyan-200 bg-white/75 p-10 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.2)]">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">Loading</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Shared note placeholder loading state
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This route-level loading file reserves the public share loading state described by the
          spec.
        </p>
      </section>
    </main>
  );
}
