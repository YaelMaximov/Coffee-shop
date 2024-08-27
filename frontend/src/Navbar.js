import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // קובץ CSS נפרד לעיצוב

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/menu" className="navbar-link">תפריטים</Link></li>
        <li><Link to="/orderType" className="navbar-link">הזמנות אונליין</Link></li>
        <li><Link to="/branch/1" className="navbar-link">סניפים</Link></li>
        <li><Link to="/login" className="navbar-link">התחברות</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;