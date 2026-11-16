
import { NavLink } from 'react-router'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        The Fraud Hotel
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>Strona główna</NavLink>
        <NavLink to="/user">Panel użytkownika</NavLink>
        <NavLink to="/admin">Panel administratora</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
