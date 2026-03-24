type SharedNotePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharedNotePage({ params }: SharedNotePageProps) {
  const { token } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-[2rem] border border-white/60 bg-white/80 p-10 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
          /s/[token]
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Shared note placeholder
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Public note rendering will eventually use this route. The current scaffold only exposes a
          static placeholder for token <span className="font-medium text-slate-900">{token}</span>.
        </p>
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-cyan-200 bg-cyan-50/60 p-6 text-sm leading-6 text-slate-600">
          Sanitized shared note content placeholder
        </div>
      </section>
    </main>
  );
}
