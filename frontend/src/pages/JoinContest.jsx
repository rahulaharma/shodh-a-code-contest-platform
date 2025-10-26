import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getContestById } from '../api/contests'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from '../layouts/AuthLayout'

export function JoinContest() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [form, setForm] = useState({ contestId: '', username: '', password: '' })
  const [mode, setMode] = useState('login')
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.contestId || !form.username || !form.password) {
      setError('Contest ID, username, and password are required.')
      return
    }

    setError(null)
    setJoining(true)

    try {
      if (mode === 'register') {
        await register({ username: form.username.trim(), password: form.password })
      } else {
        await login({ username: form.username.trim(), password: form.password })
      }

      await getContestById(form.contestId.trim())
      navigate(`/contest/${form.contestId.trim()}`)
    } catch (err) {
      console.error(err)
      setError(err.message ?? 'Unable to join contest.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <AuthLayout
      title="Join a Contest"
      subtitle="Authenticate with your handle, then jump straight into the contest workspace."
    >
      <div className="flex gap-2 rounded-2xl bg-black/40 p-1 text-white/70">
        {['login', 'register'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium capitalize transition ${
              mode === option ? 'bg-brand-500 text-white' : 'hover:text-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <label className="block text-sm font-medium text-white/70">
          Contest ID
          <input
            type="text"
            name="contestId"
            value={form.contestId}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white focus:border-brand-400 focus:outline-none"
            placeholder="e.g., 1"
          />
        </label>

        <label className="block text-sm font-medium text-white/70">
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white focus:border-brand-400 focus:outline-none"
            placeholder="Your contest handle"
            autoComplete="username"
          />
        </label>

        <label className="block text-sm font-medium text-white/70">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white focus:border-brand-400 focus:outline-none"
            placeholder="Choose a secure password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
        </label>

        {error ? (
          <p className="text-sm font-medium text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={joining} className="w-full">
          {joining ? 'Connecting...' : 'Enter contest'}
        </Button>
      </form>
    </AuthLayout>
  )
}
