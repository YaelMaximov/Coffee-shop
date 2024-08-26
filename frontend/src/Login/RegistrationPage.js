import React, { useState } from 'react';
import './auth.css'

export default function RegistrationPage() {
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
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, save the address
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
      
      console.log("Response Status:", addressResponse.status);
      console.log("Address Data:", addressData);

      if (addressResponse.ok) {
        const addressId = addressData.address_id;

        console.log("ok")

        // Then, save the member with the address_id
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
          }),
        });

        const memberData = await memberResponse.json();
        if (memberResponse.ok) {
          // Save customer email to local storage
          localStorage.setItem('loggedInUser', JSON.stringify({ email }));
          // Redirect to the order page
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
    <div className='auth-page'>
      <h2 className='auth-header'>Register</h2>
      <form className='auth-form' onSubmit={handleSubmit}>
        {/* Form Fields */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
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
          <option value="" disabled>
            Select Gender
          </option>
          <option value="זכר">זכר</option>
          <option value="נקבה">נקבה</option>
        </select>
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="date"
          name="birthdate"
          placeholder="Birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />
        <input
          type="text"
          name="houseNumber"
          placeholder="House Number"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          name="apartment"
          placeholder="Apartment"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />
        <input
          type="text"
          name="entrance"
          placeholder="Entrance"
          value={entrance}
          onChange={(e) => setEntrance(e.target.value)}
        />
        <input
          type="text"
          name="floor"
          placeholder="Floor"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        />
        <button className='auth-button' type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
