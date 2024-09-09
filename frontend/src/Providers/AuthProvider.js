import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ userId: '', role: '', username: '' });
  const [accessToken, setAccessToken] = useState(''); // הוסף state ל-access token

  const login = (authData) => {
    setAuth(authData); // שמור את פרטי ההתחברות ב-state
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('username', authData.username); // שמור רק את שם המשתמש ב-localStorage
    localStorage.setItem('userRole', authData.role); // שמור את התפקיד ב-localStorage
    // הגדרת ה-accessToken אם זמין
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:3010/auth/logout', {
        method: 'POST',
        credentials: 'include', // נכלול את ה-cookie כדי לוודא התנתקות מהשרת
      });
  
      // בדוק את קוד הסטטוס של התגובה
      if (response.ok) {
        const data = await response.json();
        console.log('Logout successful:', data.message);
  
        // Clear local storage and state
        setAuth({ userId: '', role: '', username: '' });
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setAccessToken(''); // איפוס ה-access token
  
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  const refreshAccessToken = async () => {
    try {
      const response = await fetch('http://localhost:3010/auth/refresh-token', {
        method: 'POST',
        credentials: 'include' // כולל את ה-cookie
      });
      if (response.ok) {
        const data = await response.json();
        // עדכון ה-access token אם קיים
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          console.log('Access token refreshed');
          return data.accessToken;
        }
      } else {
        console.error('Failed to refresh token');
        await logout(); // התנתקות אם ריפרש נכשל
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout(); // התנתקות אם קרתה שגיאה
    }
    return null; // במקרה של שגיאה או כישלון
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    if (username && role) {
      setAuth({ username, role });
      refreshAccessToken(); // וודא שה-token מעודכן בעת טעינת האפליקציה
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, refreshAccessToken, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
