import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTypePage.css';

export default function OrderTypePage() {
  const [orderType, setOrderType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch branches from the backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:3010/Branches');
        const data = await response.json();
        setBranches(data);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Unable to load branches');
      }
    };

    fetchBranches();
  }, []);

  const handleContinue = () => {
    setError(''); // Reset error before validating
    if (orderType === 'delivery') {
      if (city.toLowerCase() !== 'jerusalem') {
        setError('The restaurant does not deliver to your area.');
      } else {
        navigate('/order-page', { state: { orderType, address } });
      }
    } else if (orderType === 'pickup') {
      if (branch === '') {
        setError('Please select a branch for pickup.');
      } else {
        navigate('/order-page', { state: { orderType, branch } });
      }
    }
  };

  return (
    <div className="order-type-page">
      <h1>Choose your Order Type</h1>
      <div className="order-options">
        <button
          className={orderType === 'delivery' ? 'selected' : ''}
          onClick={() => setOrderType('delivery')}
        >
          Delivery
        </button>
        <button
          className={orderType === 'pickup' ? 'selected' : ''}
          onClick={() => setOrderType('pickup')}
        >
          Pickup
        </button>
      </div>

      {orderType === 'delivery' && (
        <div className="delivery-form">
          <h2>Enter your delivery address</h2>
          <input
            type="text"
            placeholder="Street, Number, City"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setCity(e.target.value.split(', ').pop());
            }}
          />
        </div>
      )}

      {orderType === 'pickup' && (
        <div className="pickup-form">
          <h2>Select a branch for pickup</h2>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">Select a Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.address}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <button onClick={() => navigate('/order')}>הזמנה</button>
    </div>
  );
}
