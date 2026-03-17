import { NavLink } from 'react-router-dom';

export default function Navbar({ stats }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        CULT<span>CINEMA</span>
      </NavLink>
      <ul className="navbar-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Films</NavLink></li>
        <li><NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink></li>
        <li><NavLink to="/directors" className={({ isActive }) => isActive ? 'active' : ''}>Directors</NavLink></li>
        <li><NavLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>Achievements</NavLink></li>
      </ul>
    </nav>
  );
}