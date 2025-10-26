export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10 text-surface-foreground">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Shodh-a-Code</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
        {subtitle ? <p className="text-white/60">{subtitle}</p> : null}
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </div>
  )
}
