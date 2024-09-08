import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './imgs/Design 7.png';
import LoginPopup from './Login/LoginPage'; // Import the login popup component
import AdminLoginPopup from './AdminPages/AdminLogin';
import { useAuth } from './AuthProvider'; // Import the useAuth hook

function Navbar() {
  const { auth, logout } = useAuth(); // Destructure logout from useAuth
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); // State for Login Popup
  const [isAdminLoginPopupOpen, setIsAdminLoginPopupOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const dropdownRef = useRef(null); // Reference to the dropdown menu

  useEffect(() => {
    setIsRolling(true);
    const timer = setTimeout(() => {
      setIsRolling(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    if (auth.username && auth.role) {
      setUsername(auth.username);
      setRole(auth.role);
    } else {
      setUsername(''); // Clear username if auth is not set
      setRole(''); // Clear role if auth is not set
    }
  }, [auth]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
    setIsAdminLoginPopupOpen(false); // סגור את הפופאפ של מנהל אם הוא פתוח
    setIsSidebarOpen(false); // סגור את הסיידבר אם הוא פתוח
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const openAdminLoginPopup = () => {
    setIsAdminLoginPopupOpen(true);
    setIsLoginPopupOpen(false); // סגור את הפופאפ של לקוח אם הוא פתוח
    setIsSidebarOpen(false); // סגור את הסיידבר אם הוא פתוח
  };

  const closeAdminLoginPopup = () => {
    setIsAdminLoginPopupOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthProvider
      setIsSidebarOpen(false); // Close the sidebar
      setUsername(''); // Clear username
      setRole(''); // Clear role
  
      // Check if the current path is the order page
      if (location.pathname.startsWith('/order')) {
        navigate('/orderType'); // Redirect to /orderType if on an order page
      }
      // If not on an order page, stay on the current page (no navigation)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close the dropdown menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
      if (event.target.closest('.popup-content') === null) {
        if (isLoginPopupOpen) closeLoginPopup();
        if (isAdminLoginPopupOpen) closeAdminLoginPopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoginPopupOpen, isAdminLoginPopupOpen]);

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          {role === 'admin' ? (
            <>
              <li onClick={toggleSidebar} className="navbar-link">שלום, {username}</li>
              <li><Link to="/branch/1" className="navbar-link">דף הבית</Link></li>
              <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">קפה הפוך</span>
              </li>
              <li><Link to="/admin/menu" className="navbar-link">תפריט</Link></li>
              <li><Link to="/admin/orders" className="navbar-link">הזמנות אונליין</Link></li>
            </>
          ) : (
            <>
              {username ? (
                <li onClick={toggleSidebar} className="navbar-link">שלום, {username}</li>
              ) : (
                <li onClick={toggleSidebar} className="navbar-link">התחברות</li>
              )}
              <li><Link to="/branch/1" className="navbar-link">דף הבית</Link></li>
              <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">קפה הפוך</span>
              </li>
              <li><Link to="/menu" className="navbar-link">תפריט</Link></li>
              <li><Link to="/orderType" className="navbar-link">הזמנות אונליין</Link></li>
            </>
          )}
        </ul>
      </nav>

      {isSidebarOpen && (
        <div ref={dropdownRef} className="dropdown-menu">
          <ul className="dropdown-list">
            {role === 'admin' ? (
              <>
                <li>שלום, {username}</li>
                <li><a onClick={handleLogout}>התנתקות</a></li>
              </>
            ) : username ? (
              <>
                <li>שלום, {username}</li>
                <li><a onClick={handleLogout}>התנתקות</a></li>
              </>
            ) : (
              <>
                <li><a onClick={openAdminLoginPopup}>כניסת מנהל</a></li>
                <li><a onClick={openLoginPopup}>כניסת לקוח</a></li>
              </>
            )}
          </ul>
        </div>
      )}

      {isLoginPopupOpen && (
        <LoginPopup onClose={closeLoginPopup} />
      )}

      {isAdminLoginPopupOpen && (
        <AdminLoginPopup onClose={closeAdminLoginPopup} />
      )}
    </div>
  );
}

export default Navbar;
