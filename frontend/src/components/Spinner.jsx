export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-white/70">
      <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
