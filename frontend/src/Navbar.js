import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import the auth context
import './Navbar.css';
import logo from './Design 7.png';
import LoginPopup from './Login/LoginPage'; // Import the login popup component

function Navbar() {
  const { user, logout } = useAuth(); // Access the user and logout function from context
  const [isRolling, setIsRolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); // State for Login Popup
  const location = useLocation();

  useEffect(() => {
    setIsRolling(true);
    const timer = setTimeout(() => {
      setIsRolling(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
    setIsSidebarOpen(false); // Close sidebar when opening login popup
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  // Ensure the login popup is closed if the user logs out
  useEffect(() => {
    if (!user) {
      setIsLoginPopupOpen(false);
    }
  }, [user]);

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          <li><Link to="/menu" className="navbar-link">תפריט</Link></li>
          <li><Link to="/orderType" className="navbar-link">הזמנות אונליין</Link></li>
          
          <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
            <img src={logo} alt="Logo" className="logo-image" />
            <span className="logo-text">קפה הפוך</span>
          </li>

          <li><Link to="/branch/1" className="navbar-link">דף הבית</Link></li>

          {user ? (
            <li onClick={toggleSidebar} className="navbar-link">מחובר</li>
          ) : (
            <li onClick={toggleSidebar} className="navbar-link">התחברות</li>
          )}
        </ul>
      </nav>

      {isSidebarOpen && (
        <div className="dropdown-menu">
          <ul className="dropdown-list">
            {user ? (
              <>
                <li>שלום, {user.email}</li>
                <li><Link to="/admin" onClick={() => setIsSidebarOpen(false)}>כניסת מנהל</Link></li>
                <li><a onClick={() => {
                  logout();
                  setIsSidebarOpen(false);
                }}>התנתקות</a></li>
              </>
            ) : (
              <>
                <li><Link to="/admin" onClick={() => setIsSidebarOpen(false)}>כניסת מנהל</Link></li>
                <li><a onClick={openLoginPopup}>כניסת לקוח</a></li> {/* Open login popup */}
              </>
            )}
          </ul>
        </div>
      )}

      {isLoginPopupOpen && (
        <LoginPopup onClose={closeLoginPopup} /> 
      )}
    </div>
  );
}

export default Navbar;
