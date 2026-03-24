export default function NotesLoading() {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-cyan-200 bg-cyan-50/60 p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">Loading</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
        Notes area placeholder loading state
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        This file exists to reserve the loading-state route structure required by the spec.
      </p>
    </div>
  );
}
