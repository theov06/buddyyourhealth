import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  activeLink?: string;
}

function Navbar({ activeLink }: NavbarProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="nav-bar">
      <div className="logo">
        <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="logo-image" />
        <span className="logo-text">BUDDY YOUR HEALTH®</span>
      </div>
      <nav className="nav-links">
        <Link to="/" className={activeLink === 'home' ? 'active' : ''}>Home</Link>
        <Link to="/about" className={activeLink === 'about' ? 'active' : ''}>About</Link>
        <Link to="/contact" className={activeLink === 'contact' ? 'active' : ''}>Contact</Link>
        {isAuthenticated && (
          <Link to="/account" className={activeLink === 'account' ? 'active' : ''}>Account</Link>
        )}
      </nav>
      <div className="menu-container" ref={menuRef}>
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="menu-icon">☰</span>
        </button>
        {isMenuOpen && (
          <div className="menu-dropdown">
            {isAuthenticated ? (
              <>
                <div className="menu-user-info">
                  <span className="user-greeting">Hello, {user?.firstName}!</span>
                </div>
                <Link 
                  to="/account" 
                  className="menu-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="menu-item-icon">👤</span>
                  Manage Account
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="menu-item sign-out-button"
                >
                  <span className="menu-item-icon">🚪</span>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/loading/login" 
                  className="menu-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="menu-item-icon">🔐</span>
                  Sign In
                </Link>
                <Link 
                  to="/loading/signup" 
                  className="menu-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="menu-item-icon">✨</span>
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;