import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from './Design 7.png';

function Navbar() {
  const [isRolling, setIsRolling] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Activate the roll animation and typing animation on route change
    setIsRolling(true);
    const timer = setTimeout(() => {
      setIsRolling(false);
    }, 4000); // Adjust the duration according to the CSS animation

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/menu" className="navbar-link">תפריטים</Link></li>
        <li><Link to="/orderType" className="navbar-link">הזמנות אונליין</Link></li>
        
        {/* Logo with rolling and typing animation */}
        <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text">קפה הפוך</span>
        </li>

        <li><Link to="/branch/1" className="navbar-link">סניפים</Link></li>
        <li><Link to="/login" className="navbar-link">התחברות</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
