export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-cyan-100 bg-cyan-50/70 p-10 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.2)] lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">
            Auth shell
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Placeholder layout for login and registration
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            This layout reserves space for the future credentials experience without adding any
            working authentication UI or submission logic.
          </p>
        </section>
        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_30px_120px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10">
          {children}
        </section>
      </div>
    </main>
  );
}
