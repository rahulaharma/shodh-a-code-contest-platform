import { createContext, useMemo, useState } from 'react'

export const ContestContext = createContext(undefined)

export function ContestProvider({ children }) {
  const [contest, setContest] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])

  const value = useMemo(
    () => ({
      contest,
      leaderboard,
      setContest,
      setLeaderboard,
    }),
    [contest, leaderboard],
  )

  return <ContestContext.Provider value={value}>{children}</ContestContext.Provider>
}
