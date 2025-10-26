import { apiClient } from './axios'

export const createSubmission = (payload) =>
  apiClient.post('submissions', payload)

export const getSubmission = (submissionId) =>
  apiClient.get(`submissions/${submissionId}`)

export const getLeaderboard = (contestId) =>
  apiClient.get(`contests/${contestId}/leaderboard`)
