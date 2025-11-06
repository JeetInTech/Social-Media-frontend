import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot, FaPen, FaCompass, FaUser, FaSignOutAlt, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import UserSearch from './UserSearch';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <FaRobot className="logo-icon" />
          <span className="logo-text">INNER<span className="logo-ai">WHISPERS</span></span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
              <span>Feed</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/explore" className="navbar-link" onClick={() => setMenuOpen(false)}>
              <FaCompass className="nav-icon" />
              <span>Explore</span>
            </Link>
          </li>
          <li className="navbar-item">
            <button className="navbar-link" onClick={openSearch}>
              <FaSearch className="nav-icon" />
              <span>Search Users</span>
            </button>
          </li>
          {user ? (
            <>
              <li className="navbar-item">
                <Link to="/write" className="navbar-link navbar-write" onClick={() => setMenuOpen(false)}>
                  <FaPen className="nav-icon" />
                  <span>Write</span>
                </Link>
              </li>
              <li className="navbar-item">
                <Link to={`/profile/${user.username}`} className="navbar-link" onClick={() => setMenuOpen(false)}>
                  <FaUser className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </li>
              <li className="navbar-item">
                <button className="navbar-link navbar-logout" onClick={handleLogout}>
                  <FaSignOutAlt className="nav-icon" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  <span>Login</span>
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link navbar-register" onClick={() => setMenuOpen(false)}>
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {searchOpen && <UserSearch onClose={closeSearch} />}
    </nav>
  );
}

export default Navbar;
