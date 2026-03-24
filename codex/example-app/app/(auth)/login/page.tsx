export default function LoginPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">Login</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        Sign in placeholder
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        This page will host the email and password login flow in the full implementation. It is
        intentionally static in this scaffold pass.
      </p>
      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Email field placeholder
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Password field placeholder
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-medium text-cyan-900">
          Submit button placeholder
        </div>
      </div>
    </div>
  );
}
