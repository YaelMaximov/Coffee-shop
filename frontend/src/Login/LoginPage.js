import React, { useState } from 'react';
import './auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
        setMessage('Login successful');
        setTimeout(() => {
          window.location.href = 'http://localhost:3000/order';
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed');
    }
  };

  const handleRegister = () => {
    window.location.href = 'http://localhost:3000/register';
  };

  return (
    <div className='auth-page'>
      <div className='auth-header'>
        <h2>התחברות</h2>
      </div>
      <form className='auth-form' onSubmit={handleSubmit}>
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
        <div className='auth-buttons'>
          <button className='auth-button' onClick={handleRegister} type="button">הרשמה</button>
          <button className='auth-button' type="submit">התחברות</button>
        </div>
      </form>
      {message && <p className='auth-footer'>{message}</p>}
    </div>
  );
}
