export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/60 bg-white/75 p-10 text-center shadow-[0_30px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          TinyNotes page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This placeholder stands in for the custom not-found experience required by the spec.
        </p>
      </section>
    </main>
  );
}
