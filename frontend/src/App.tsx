import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight'
]

function AppRoutes() {
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const adminUnlockedRef = useRef(false)
  const konamiIndexRef = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      if (isEditing || event.repeat) {
        return
      }

      const expectedCode = KONAMI_SEQUENCE[konamiIndexRef.current]

      if (event.code === expectedCode) {
        konamiIndexRef.current += 1

        if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
          konamiIndexRef.current = 0
          const nextState = !adminUnlockedRef.current
          adminUnlockedRef.current = nextState
          setAdminUnlocked(nextState)
          navigate(nextState ? '/admin' : '/', { replace: true })
        }
      } else {
        konamiIndexRef.current = event.code === KONAMI_SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route
          path="/admin"
          element={adminUnlocked ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
