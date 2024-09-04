import React, { useState, useContext,useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './Design 7.png';
import LoginPopup from './Login/LoginPage'; // Import the login popup component
import AdminLoginPopup from './AdminPages/AdminLogin';
import { useAuth } from './AuthProvider'; // Import the auth context
import { OrderContext } from './OrderProvider';

function Navbar() {
  const { user, logout } = useAuth(); // Access the user and logout function from context
  const {clearOrder} = useContext(OrderContext);
  const [isRolling, setIsRolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); // State for Login Popup
  const [isAdminLoginPopupOpen, setIsAdminLoginPopupOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

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

  const openAdminLoginPopup = () => {
    setIsAdminLoginPopupOpen(true);
  };
  
  const closeAdminLoginPopup = () => {
    setIsAdminLoginPopupOpen(false);
  };

  // Ensure the login popup is closed if the user logs out
  useEffect(() => {
    if (!user) {
      setIsLoginPopupOpen(false);
    }
  }, [user]);

  const handleLogout = () => {
    clearOrder();
    logout(); // Perform logout
    setIsSidebarOpen(false); // Close the sidebar
    navigate('/orderType'); // Redirect to /orderType after logout
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          {user && user.isAdmin ? (
            // Navbar for Admin
            <>
              <li onClick={toggleSidebar} className="navbar-link">מחובר</li>
              <li><Link to="/branch/1" className="navbar-link">דף הבית</Link></li>
              <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">קפה הפוך</span>
              </li>
              <li><Link to="/admin/menu" className="navbar-link">תפריט</Link></li>
              <li><Link to="/admin/orders" className="navbar-link">הזמנות אונליין</Link></li>
            </>
          ) : (
            // Navbar for Customer
            <>
              {user ? (
                <li onClick={toggleSidebar} className="navbar-link">מחובר</li>
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
        <div className="dropdown-menu">
          <ul className="dropdown-list">
            {user && user.isAdmin ? (
              <>
                <li>שלום, {user.username}</li>
                <li><a onClick={handleLogout}>התנתקות</a></li>
              </>
            ) : user ? (
              <>
                <li>שלום, {user.email}</li>
                <li><a onClick={handleLogout}>התנתקות</a></li>
              </>
            ) : (
              <>
                <li><a onClick={openAdminLoginPopup}>כניסת מנהל</a></li>
                <li><a onClick={openLoginPopup}>כניסת לקוח</a></li> {/* Open login popup */}
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
