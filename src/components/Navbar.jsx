import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ user, onLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          CULT<span>CINEMA</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="navbar-links desktop-only">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Films</NavLink></li>
          <li><NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink></li>
          <li><NavLink to="/directors" className={({ isActive }) => isActive ? 'active' : ''}>Directors</NavLink></li>
          <li><NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}>Groups</NavLink></li>
          <li><NavLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>Achievements</NavLink></li>
        </ul>

        {/* Desktop auth */}
        <div className="navbar-auth desktop-only">
          {user ? (
            <div className="navbar-user">
              <img src={user.photoURL} alt={user.displayName} className="navbar-avatar" />
              <span className="navbar-username">{user.displayName}</span>
              <button className="navbar-logout-btn" onClick={onLogout}>Sign out</button>
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={onLogin}>Sign in with Google</button>
          )}
        </div>

        {/* Mobile right side */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user && <img src={user.photoURL} alt={user.displayName} className="navbar-avatar" />}
          <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'mobile-menu-item active' : 'mobile-menu-item'} onClick={() => setMenuOpen(false)}>🎬 Films</NavLink>
          <NavLink to="/schedule" className={({ isActive }) => isActive ? 'mobile-menu-item active' : 'mobile-menu-item'} onClick={() => setMenuOpen(false)}>📅 Schedule</NavLink>
          <NavLink to="/directors" className={({ isActive }) => isActive ? 'mobile-menu-item active' : 'mobile-menu-item'} onClick={() => setMenuOpen(false)}>🎥 Directors</NavLink>
          <NavLink to="/groups" className={({ isActive }) => isActive ? 'mobile-menu-item active' : 'mobile-menu-item'} onClick={() => setMenuOpen(false)}>👥 Groups</NavLink>
          <NavLink to="/achievements" className={({ isActive }) => isActive ? 'mobile-menu-item active' : 'mobile-menu-item'} onClick={() => setMenuOpen(false)}>🏆 Achievements</NavLink>
          <div className="mobile-menu-divider" />
          {user ? (
            <div className="mobile-menu-user">
              <span style={{ color: 'var(--aged-light)', fontSize: '0.82rem' }}>{user.displayName}</span>
              <button className="mobile-menu-logout" onClick={() => { onLogout(); setMenuOpen(false); }}>Sign out</button>
            </div>
          ) : (
            <button className="mobile-menu-login" onClick={() => { onLogin(); setMenuOpen(false); }}>Sign in with Google</button>
          )}
        </div>
      )}
    </>
  );
}