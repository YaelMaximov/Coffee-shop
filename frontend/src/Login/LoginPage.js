import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider'; // ייבוא הקונטקסט
import RegistrationPopup from './RegistrationPage'; // ייבוא פופאפ ההרשמה
import './auth.css';

export default function LoginPage({ onClose }) { // קבלת הפונקציה כ-prop
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3010/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage('ההתחברות בוצעה בהצלחה');
        login({ ...data.member, isAdmin: false }); // Set isAdmin to false for regular user
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
  

  const openRegistrationPopup = () => {
    setIsRegistrationOpen(true);
    setIsOpen(false); // סגירת פופאפ הלוגין
  };

  const closeRegistrationPopup = () => {
    setIsRegistrationOpen(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsRegistrationOpen(false);
    onClose(); // קריאה ל-onClose שהועבר כ-prop לסגירת הפופאפ
  };

  return (
    <div>
      {isOpen && (
        <div className="popup-overlay" onClick={handleClose}> {/* שימוש ב-handleClose */}
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={handleClose}>×</button> {/* שימוש ב-handleClose */}
            <div className="auth-page">
              <div className="auth-header">
                <h2>התחברות</h2>
              </div>
              <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="email">כתובת מייל:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="הכנס כתובת מייל"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="auth-button" type="submit">התחברות</button>
              </form>
              <div className="auth-footer">
                <span>עדיין אין לך חשבון? <a onClick={openRegistrationPopup}>הירשם</a></span>
              </div>
              {message && <p className="auth-message">{message}</p>}
            </div>
          </div>
        </div>
      )}

      {isRegistrationOpen && (
        <RegistrationPopup onClose={closeRegistrationPopup} />
      )}
    </div>
  );
}
