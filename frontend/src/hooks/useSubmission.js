import { useEffect, useState } from 'react'

import { usePolling } from './usePolling'
import { createSubmission, getSubmission } from '../api/submissions'

const normalizeStatus = (value) =>
  typeof value === 'string' ? value.toLowerCase() : 'unknown'

const normalizeResults = (testResults) =>
  Array.isArray(testResults)
    ? testResults.map((result, index) => ({
        id: result.testCaseId ?? index,
        label: result.label ?? `Test #${index + 1}`,
        passed: Boolean(result.passed),
        expectedOutput: result.expectedOutput ?? '',
        actualOutput: result.actualOutput ?? '',
        message: result.message ?? (result.passed ? 'Passed' : 'Failed'),
      }))
    : []

const normalizeSubmission = (payload) => {
  if (!payload) return null
  return {
    id: payload.id ?? payload.submissionId ?? null,
    submissionId: payload.submissionId ?? payload.id ?? null,
    status: normalizeStatus(payload.status),
    output: payload.output ?? '',
    testResults: normalizeResults(payload.testResults),
  }
}

const terminalStatuses = new Set(['accepted', 'wrong_answer', 'tle', 'mle', 'error'])

export function useSubmission(problemId) {
  const [submission, setSubmission] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const submitCode = async (payload) => {
    if (!problemId) {
      const err = new Error('Select a problem before submitting code.')
      setError(err)
      return
    }

    try {
      setStatus('submitting')
      const response = await createSubmission({ problemId, ...payload })
      const normalized = normalizeSubmission(response)
      setSubmission(normalized)
      setStatus(normalized?.status ?? 'pending')
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err)
      setStatus('error')
    }
  }

  usePolling(
    async () => {
      if (!submission?.id) return
      try {
        const updated = await getSubmission(submission.id)
        const normalized = normalizeSubmission(updated)
        setSubmission(normalized)
        setStatus(normalized?.status ?? status)
      } catch (err) {
        console.error(err)
        setError(err)
        setStatus('error')
      }
    },
    2500,
    { disabled: !submission || terminalStatuses.has(status) },
  )

  useEffect(() => {
    if (!problemId) {
      setSubmission(null)
      setStatus('idle')
      setError(null)
    }
  }, [problemId])

  return {
    submission,
    status,
    error,
    submitCode,
  }
}
