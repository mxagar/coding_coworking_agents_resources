export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/60 bg-white/70 p-10 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
          TinyNotes
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Entry route scaffold
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          In the full app, this route will redirect authenticated users to `/notes` and everyone
          else to `/login`. For now, it exists only as a static placeholder page.
        </p>
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          <section className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Public auth routes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">`/login` and `/register`</p>
          </section>
          <section className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Authenticated routes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              `/notes`, `/notes/new`, `/notes/[id]`
            </p>
          </section>
          <section className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Shared note route</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">`/s/[token]`</p>
          </section>
        </div>
      </div>
    </main>
  );
}
