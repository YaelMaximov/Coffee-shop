import React, { useState,navigate } from 'react';
import './auth.css'
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
        // You can redirect to another page or perform other actions here
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
      <h2 className='auth-header'>Login</h2>
      <form className='auth-form' onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />  
        <div className='auth-buttons'>
          <button className='auth-button' type="submit">Login</button>
          <button className='auth-button'onClick={handleRegister}>Register</button>
        </div>    
        </form>
      {message && <p>{message}</p>}
    </div>
  );
}
