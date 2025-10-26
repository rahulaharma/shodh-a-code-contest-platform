import { AuthProvider } from './context/AuthContext'
import { ContestProvider } from './context/ContestContext'
import { AppRouter } from './router'

function App() {
  return (
    <AuthProvider>
      <ContestProvider>
        <AppRouter />
      </ContestProvider>
    </AuthProvider>
  )
}

export default App

