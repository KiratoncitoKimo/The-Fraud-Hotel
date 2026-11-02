
import { NavLink } from 'react-router'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        The Fraud Hotel
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/user">User</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
