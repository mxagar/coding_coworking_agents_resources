export default function RegisterPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700">Register</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        Registration placeholder
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        This page will eventually contain the credentials-based sign-up flow. For now it only
        marks the route and layout boundary required by the spec.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Name field placeholder
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Email field placeholder
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:col-span-2">
          Password field placeholder
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-medium text-cyan-900 sm:col-span-2">
          Create account button placeholder
        </div>
      </div>
    </div>
  );
}
