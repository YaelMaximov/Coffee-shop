import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function PrivateRoute({ element: Component, requiredRole, ...rest }) {
  const { auth, refreshAccessToken, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null); // initial state as null
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        let accessToken = auth?.accessToken;
  
        // אם אין access token, ננסה לרענן אותו
        if (!accessToken) {
          console.log('Access token missing, trying to refresh.');
          accessToken = await refreshAccessToken(); // המתן להחזרת ה-token החדש
  
          if (!accessToken) {
            console.log('Refresh failed, no access token.');
            setIsAuthorized(false); // אם עדיין אין access token, נחשב את המשתמש כלא מאומת
            return;
          }
        }
  
        // נשלח בקשה לאימות ה-token
        const response = await fetch('http://localhost:3010/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // הוספת ה-access token ל-Headers
          },
          credentials: 'include', // כדי לשלוח את ה-Cookie אם יש צורך
        });
  
        if (response.ok) {
          const result = await response.json();
          if (result.role === requiredRole) {
            setIsAuthorized(true); // authorized
          } else {
            setIsAuthorized(false); // unauthorized, wrong role
          }
        } else {
          console.log('Token validation failed.');
          setIsAuthorized(false); // unauthorized, invalid token
        }
      } catch (error) {
        console.error('Error validating access token:', error);
        setIsAuthorized(false); // unauthorized, error occurred
      }
    };
  
    validateToken();
  }, [requiredRole, refreshAccessToken, auth?.accessToken]);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate('/branch/1'); // Redirect if not authorized
    }
  }, [isAuthorized, navigate]);

  if (isAuthorized === null) {
    return <div>Loading...</div>; // Loading spinner or placeholder
  }

  return <Component {...rest} />; // Render the component if authorized
}

export default PrivateRoute;
