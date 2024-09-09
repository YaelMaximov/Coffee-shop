import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from './imgs/Design 7.png';
import LoginPopup from './Login/LoginPage'; 
import AdminLoginPopup from './AdminPages/AdminLogin';
import { useAuth } from './AuthProvider'; 

function Navbar() {
  const { auth, logout } = useAuth(); 
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added for menu toggle
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); 
  const [isAdminLoginPopupOpen, setIsAdminLoginPopupOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 
  const dropdownRef = useRef(null); 
  const navbarRef = useRef(null);

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
      setUsername(''); 
      setRole(''); 
    }
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 50) {
        navbarRef.current.classList.add('scrolled');
      } else {
        navbarRef.current.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close menu
  };

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
    setIsAdminLoginPopupOpen(false); 
    setIsSidebarOpen(false); 
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const openAdminLoginPopup = () => {
    setIsAdminLoginPopupOpen(true);
    setIsLoginPopupOpen(false); 
    setIsSidebarOpen(false); 
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
      navigate('/orderType');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleOrders = async () => {
    setIsSidebarOpen(false); 
    navigate('/myOrder');
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      closeMenu(); // Close menu on mobile when a link is clicked
    }
  };

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
      <nav ref={navbarRef} className="navbar">
        <div className="navbar-toggle">
          <span>שלום, {username}</span>
          <div className="hamburger-icon" onClick={toggleMenu}>
            &#9776;
          </div>
        </div>
        
        <ul className={`navbar-list ${isMenuOpen ? 'open' : ''}`}>
          {role === 'admin' ? (
            <>
              <li onClick={toggleSidebar} className="navbar-link">שלום, {username}</li>
              <li><Link to="/branch/1" className="navbar-link" onClick={handleLinkClick}>דף הבית</Link></li>
              <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">קפה הפוך</span>
              </li>
              <li><Link to="/admin/menu" className="navbar-link" onClick={handleLinkClick}>תפריט</Link></li>
              <li><Link to="/admin/orders" className="navbar-link" onClick={handleLinkClick}>הזמנות אונליין</Link></li>
            </>
          ) : (
            <>
              {username ? (
                <li onClick={toggleSidebar} className="navbar-link">שלום, {username}</li>
              ) : (
                <li onClick={toggleSidebar} className="navbar-link">התחברות</li>
              )}
              <li><Link to="/branch/1" className="navbar-link" onClick={handleLinkClick}>דף הבית</Link></li>
              <li className={`navbar-logo ${isRolling ? 'roll' : ''}`}>
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">קפה הפוך</span>
              </li>
              <li><Link to="/menu" className="navbar-link" onClick={handleLinkClick}>תפריט</Link></li>
              <li><Link to="/orderType" className="navbar-link" onClick={handleLinkClick}>הזמנות אונליין</Link></li>
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
                <li><a onClick={handleOrders}>ההזמנות שלי</a></li>
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
