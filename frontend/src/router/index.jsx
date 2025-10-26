import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Contest } from '../pages/Contest'
import { Home } from '../pages/Home'
import { JoinContest } from '../pages/JoinContest'
import { NotFound } from '../pages/NotFound'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinContest />} />
        <Route path="/contest/:contestId" element={<Contest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
