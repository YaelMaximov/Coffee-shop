import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider'; // ייבוא הקונטקסט
import '../Login/auth.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // קבלת פונקציית התחברות מהקונטקסט
  const [isOpen, setIsOpen] = useState(true); // חלון פתוח כברירת מחדל

  useEffect(() => {
    // הפופאפ ייפתח אוטומטית כאשר הקומפוננטה נטענת
    setIsOpen(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3010/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage('התחברות הצליחה');
        login({ ...data.manager, isAdmin: true }); // Set isAdmin to true for admin
        setTimeout(() => {
          window.location.href = 'http://localhost:3000/order';
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('התחברות נכשלה');
    }
  };
  
  

  const closeLoginPopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="popup-overlay" onClick={closeLoginPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={closeLoginPopup}>×</button>
            <div className="auth-page">
              <div className="auth-header">
                <h2>כניסת מנהל</h2>
              </div>
              <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="username">שם משתמש:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="הכנס שם משתמש"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="password">סיסמה:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="הכנס סיסמה"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="auth-button" type="submit">התחברות</button>
              </form>
              {message && <p className="auth-message">{message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
