import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getContestById } from '../api/contests'
import { getLeaderboard } from '../api/submissions'
import { Button } from '../components/Button'
import { CodeEditor } from '../components/CodeEditor'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../hooks/useAuth'
import { usePolling } from '../hooks/usePolling'
import { useSubmission } from '../hooks/useSubmission'
import { ContestLayout } from '../layouts/ContestLayout'

export function Contest() {
  const { contestId } = useParams()
  const { user, isAuthenticated } = useAuth()

  const [contest, setContest] = useState(null)
  const [problems, setProblems] = useState([])
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [language, setLanguage] = useState('java')
  const [code, setCode] = useState('// Write your solution here')
  const [loadingContest, setLoadingContest] = useState(true)
  const [contestError, setContestError] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardError, setLeaderboardError] = useState(null)

  const {
    submission,
    status,
    error: submissionError,
    submitCode,
  } = useSubmission(selectedProblem?.id)

  const formattedStatus =
    status && status.length > 0
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : 'Idle'

  useEffect(() => {
    let active = true
    setLoadingContest(true)
    setContestError(null)

    getContestById(contestId)
      .then((data) => {
        if (!active) return
        setContest(data)
        const contestProblems = data?.problems ?? []
        setProblems(contestProblems)
        setSelectedProblem(contestProblems[0] ?? null)
        setCode('// Write your solution here')
      })
      .catch((err) => {
        if (!active) return
        setContestError(err)
      })
      .finally(() => {
        if (!active) return
        setLoadingContest(false)
      })

    return () => {
      active = false
    }
  }, [contestId])

  const fetchLeaderboard = useCallback(async () => {
    if (!contestId) return
    try {
      const rows = await getLeaderboard(contestId)
      setLeaderboard(
        rows.map((row, index) => ({
          userId: row.userId,
          username: row.username ?? `User ${row.userId ?? index + 1}`,
          score: row.score ?? 0,
          rank: row.rank ?? index + 1,
        })),
      )
      setLeaderboardError(null)
    } catch (err) {
      console.error(err)
      setLeaderboardError(err)
    }
  }, [contestId])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  usePolling(fetchLeaderboard, 15000, { disabled: !contestId })

  const contestMeta = useMemo(
    () => ({
      id: contest?.id ?? contestId,
      name: contest?.name ?? `Contest ${contestId}`,
      description:
        contest?.description ??
        'Solve algorithmic challenges with live feedback from the judge service.',
    }),
    [contest, contestId],
  )

  const sidebar = (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">
        Problems
      </h2>

      {loadingContest ? (
        <Spinner label="Loading problems..." />
      ) : problems.length ? (
        <div className="space-y-3">
          {problems.map((problem) => (
            <button
              key={problem.id}
              className={`w-full rounded-2xl border px-3 py-2 text-left text-sm ${
                selectedProblem?.id === problem.id
                  ? 'border-brand-400 bg-brand-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              type="button"
              onClick={() => {
                setSelectedProblem(problem)
                setCode('// Write your solution here')
              }}
            >
              <p className="font-semibold">{problem.title}</p>
              <p className="text-xs uppercase text-white/60">{problem.difficulty}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/60">
          Problems will appear here once the organizer adds them.
        </p>
      )}
    </div>
  )

  const handleSubmit = async () => {
    if (!selectedProblem) return
    await submitCode({ language, code })
  }

  let content = null
  if (loadingContest) {
    content = <Spinner label="Loading contest details..." />
  } else if (contestError) {
    content = (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
        Unable to load contest: {contestError.message ?? 'Unexpected error'}
      </div>
    )
  } else if (!selectedProblem) {
    content = (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white/70">
        No problems are available for this contest yet.
      </div>
    )
  } else {
    content = (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">
            Problem
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {selectedProblem.title}
          </h2>
          <p className="text-sm uppercase text-white/60">
            Difficulty: {selectedProblem.difficulty ?? 'Unknown'}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-white/70">
            {selectedProblem.description ?? 'Problem statement coming soon.'}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {selectedProblem.inputSample ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Sample Input
                </p>
                <pre className="mt-2 rounded-2xl border border-white/10 bg-black/60 p-3 text-xs text-white">
                  {selectedProblem.inputSample}
                </pre>
              </div>
            ) : null}
            {selectedProblem.outputSample ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Sample Output
                </p>
                <pre className="mt-2 rounded-2xl border border-white/10 bg-black/60 p-3 text-xs text-white">
                  {selectedProblem.outputSample}
                </pre>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="text-sm font-medium text-white/70">
            Language
            <select
              className="ml-2 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-white focus:border-brand-400 focus:outline-none"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          </label>
          <p className="text-sm text-white/60">
            Status:{' '}
            <span className="font-semibold text-white">{formattedStatus}</span>
          </p>
          {!isAuthenticated ? (
            <p className="text-sm text-amber-300">
              Log in from the Join page to submit solutions.
            </p>
          ) : null}
        </div>

        <CodeEditor
          language={language}
          value={code}
          onChange={setCode}
          className="w-full"
        />

        {submissionError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {submissionError.message ?? 'Submission failed'}
          </div>
        ) : null}

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={
              status === 'submitting' || !isAuthenticated || !selectedProblem
            }
          >
            {status === 'submitting'
              ? 'Submitting...'
              : !isAuthenticated
                ? 'Login required'
                : 'Submit solution'}
          </Button>
          <Button variant="secondary" onClick={() => setCode('// Write your solution here')}>
            Reset
          </Button>
        </div>

        {submission ? (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
            <p>
              Submission ID:{' '}
              <span className="font-mono">
                {submission.id ?? submission.submissionId}
              </span>
            </p>
            <p>Status: {submission.status ? submission.status.toUpperCase() : '--'}</p>
            {submission.testResults?.length ? (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Test cases
                </p>
                <ul className="space-y-2">
                  {submission.testResults.map((result) => (
                    <li
                      key={result.id ?? result.label}
                      className="rounded-xl border border-white/10 bg-black/40 p-3"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{result.label}</span>
                        <span
                          className={
                            result.passed ? 'text-emerald-300' : 'text-red-300'
                          }
                        >
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      {!result.passed ? (
                        <div className="mt-2 space-y-1 text-xs text-white/70">
                          <p>{result.message}</p>
                          <p>
                            Expected:{' '}
                            <span className="font-mono text-white">
                              {result.expectedOutput || '—'}
                            </span>
                          </p>
                          <p>
                            Actual:{' '}
                            <span className="font-mono text-white">
                              {result.actualOutput || '—'}
                            </span>
                          </p>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {submission.output ? (
              <pre className="mt-2 rounded-xl bg-black/60 p-3 text-xs text-white">
                {submission.output}
              </pre>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <ContestLayout
      contest={contestMeta}
      leaderboard={leaderboard}
      currentUserId={user?.username ?? user?.id}
      sidebar={sidebar}
    >
      {content}
      {leaderboardError ? (
        <p className="text-sm text-amber-200">
          Unable to refresh leaderboard automatically:{' '}
          {leaderboardError.message ?? 'Unexpected error'}
        </p>
      ) : null}
    </ContestLayout>
  )
}
