
import { Outlet } from 'react-router'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        © 2026 The Fraud Hotel
      </footer>
    </div>
  )
}

export default Layout
