import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // קובץ CSS נפרד לעיצוב
import logo from './Design 7.png'; // עדכן את הנתיב לתמונה שלך

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/menu" className="navbar-link">תפריטים</Link></li>
        <li><Link to="/orderType" className="navbar-link">הזמנות אונליין</Link></li>
        
        {/* לוגו באמצע */}
        <li className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </li>

        <li><Link to="/branch/1" className="navbar-link">סניפים</Link></li>
        <li><Link to="/login" className="navbar-link">התחברות</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
