import { apiClient } from './axios'

export const getContests = (params) =>
  apiClient.get('contests', { query: params })

export const getContestById = (contestId) =>
  apiClient.get(`contests/${contestId}`)

export const createContest = (payload) => apiClient.post('contests', payload)

export const updateContest = (contestId, payload) =>
  apiClient.put(`contests/${contestId}`, payload)

export const deleteContest = (contestId) =>
  apiClient.delete(`contests/${contestId}`)
