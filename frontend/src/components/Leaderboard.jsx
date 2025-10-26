export function Leaderboard({ rows = [], currentUserId }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/60">
        No submissions yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <table className="min-w-full text-left text-sm text-white/80">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-4 py-3 font-semibold">Rank</th>
            <th className="px-4 py-3 font-semibold">User</th>
            <th className="px-4 py-3 font-semibold text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, index) => {
            const normalizedUserToken =
              currentUserId === null || currentUserId === undefined
                ? null
                : String(currentUserId)
            const highlight =
              normalizedUserToken &&
              ((entry.userId !== undefined &&
                entry.userId !== null &&
                String(entry.userId) === normalizedUserToken) ||
                (entry.username &&
                  String(entry.username).toLowerCase() ===
                    normalizedUserToken.toLowerCase()))

            return (
              <tr
                key={entry.userId ?? `${entry.username ?? index}`}
                className={highlight ? 'bg-brand-500/10 text-white' : ''}
              >
                <td className="px-4 py-3">{entry.rank ?? index + 1}</td>
                <td className="px-4 py-3 font-medium">
                  {entry.username ?? `User ${entry.userId ?? index + 1}`}
                </td>
                <td className="px-4 py-3 text-right">
                  {entry.score ?? entry.solved ?? 0}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
