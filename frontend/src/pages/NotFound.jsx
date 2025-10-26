import { Link } from 'react-router-dom'

import { Button } from '../components/Button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-4 text-center text-surface-foreground">
      <div>
        <p className="text-sm uppercase tracking-[0.5em] text-brand-300">404</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Page not found</h1>
        <p className="text-white/60">
          The resource you are looking for either moved or never existed.
        </p>
      </div>
      <Link to="/">
        <Button variant="secondary">Head back home</Button>
      </Link>
    </div>
  )
}
