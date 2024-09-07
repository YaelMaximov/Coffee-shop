import React, { useState } from 'react';
import './auth.css';

export default function RegistrationPage({ onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [city, setCity] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const addressResponse = await fetch('http://localhost:3010/auth/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street,
          house_number: houseNumber,
          city,
          apartment,
          entrance,
          floor,
        }),
      });
      const addressData = await addressResponse.json();

      if (addressResponse.ok) {
        const addressId = addressData.address_id;

        const memberResponse = await fetch('http://localhost:3010/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            gender,
            phone,
            email,
            birthdate,
            address_id: addressId,
            password,
          }),
        });

        const memberData = await memberResponse.json();
        if (memberResponse.ok) {
          localStorage.setItem('loggedInUser', JSON.stringify({ email }));
          window.location.href = 'http://localhost:3000/order';
        } else {
          setMessage(memberData.message);
        }
      } else {
        setMessage('Failed to save address');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed');
    }
  };

  return (
    <div className='popup-overlay' onClick={onClose}>
      <div className='popup-content' onClick={(e) => e.stopPropagation()}>
        <span className='popup-close' onClick={onClose}>&times;</span>
        <h2 className='auth-header'>הרשמה</h2>
        <form className='auth-form' onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="שם פרטי"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="שם משפחה"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="" disabled>בחירת מין</option>
            <option value="זכר">זכר</option>
            <option value="נקבה">נקבה</option>
          </select>
          <input
            type="text"
            name="phone"
            placeholder="פלאפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="מייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="date"
            name="birthdate"
            placeholder="תאריך לידה"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="רחוב"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
          <input
            type="text"
            name="houseNumber"
            placeholder="מספר בית"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="עיר"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            name="apartment"
            placeholder="מספר דירה"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            required
          />
          <input
            type="text"
            name="entrance"
            placeholder="כניסה"
            value={entrance}
            onChange={(e) => setEntrance(e.target.value)}
            required
          />
          <input
            type="text"
            name="floor"
            placeholder="קומה"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="אישור סיסמה"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className='auth-button' type="submit">Register</button>
        </form>
        {message && <p className='auth-message'>{message}</p>}
      </div>
    </div>
  );
}
