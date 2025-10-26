import { Leaderboard } from '../components/Leaderboard'

export function ContestLayout({
  contest,
  leaderboard = [],
  currentUserId,
  sidebar,
  children,
}) {
  return (
    <div className="grid min-h-screen gap-6 bg-surface px-6 py-8 text-surface-foreground md:grid-cols-[1fr,320px]">
      <main className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Contest</p>
          <h1 className="text-3xl font-semibold text-white">{contest?.name}</h1>
          <p className="text-white/60">{contest?.description}</p>
        </header>
        {children}
      </main>
      <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        {sidebar}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
            Leaderboard
          </h2>
          <Leaderboard rows={leaderboard} currentUserId={currentUserId} />
        </div>
      </aside>
    </div>
  )
}
