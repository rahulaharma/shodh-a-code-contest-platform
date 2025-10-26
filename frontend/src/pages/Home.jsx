import { Link } from 'react-router-dom'

import { Button } from '../components/Button'

const metrics = [
  { label: 'Live contests', value: '1+' },
  { label: 'Avg. API latency', value: '<200ms' },
  { label: 'Judge sandboxes', value: 'Dockerized' },
]

const features = [
  {
    title: 'Contest Control Center',
    body: 'Preview schedules, timers, and problem inventory at a glance with role-aware actions.',
    badge: 'Admins',
  },
  {
    title: 'Contestant Workspace',
    body: 'Monaco-powered editor, status chips, and 2s polling for submissions to keep participants in flow.',
    badge: 'Contestants',
  },
  {
    title: 'Live Leaderboard',
    body: 'Responsive table that refreshes every 15-30s and highlights personal progress.',
    badge: 'All users',
  },
]

export function Home() {
  return (
    <div className="min-h-screen bg-surface text-surface-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-10">
          <p className="text-sm tracking-[0.4em] text-brand-300 uppercase">
            Shodh-a-Code
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Contest Platform</h1>
          <p className="max-w-3xl text-lg text-white/70">
            Build, host, and manage coding contests with a modern workspace that keeps admins and contestants in sync—from problem setup to live judging and leaderboards.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur"
              >
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <p className="text-sm uppercase tracking-wide text-white/60">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <Link to="/join">
              <Button>Get Started</Button>
            </Link>
            <Link to="/join">
              <Button variant="secondary">Join Contest</Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-6 py-10 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-black/20 p-6 shadow-card"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-200">
                {feature.badge}
              </span>
              <h2 className="text-2xl font-semibold text-white">{feature.title}</h2>
              <p className="text-white/70">{feature.body}</p>
            </article>
          ))}
        </section>

      </div>
    </div>
  )
}
