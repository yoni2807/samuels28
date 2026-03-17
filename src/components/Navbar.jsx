import { NavLink } from 'react-router-dom';

export default function Navbar({ user, onLogin, onLogout }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        CULT<span>CINEMA</span>
      </NavLink>
      <ul className="navbar-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Films</NavLink></li>
        <li><NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink></li>
        <li><NavLink to="/directors" className={({ isActive }) => isActive ? 'active' : ''}>Directors</NavLink></li>
        <li><NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}>Groups</NavLink></li>
        <li><NavLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>Achievements</NavLink></li>
      </ul>
      <div className="navbar-auth">
        {user ? (
          <div className="navbar-user">
            <img src={user.photoURL} alt={user.displayName} className="navbar-avatar" />
            <span className="navbar-username">{user.displayName}</span>
            <button className="navbar-logout-btn" onClick={onLogout}>Sign out</button>
          </div>
        ) : (
          <button className="navbar-login-btn" onClick={onLogin}>
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}