import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTypePage.css';
import takeAwayIcon from './take-away.png'; // Adjust the path accordingly
import deliveryIcon from './delivery.png'; // Adjust the path accordingly

export default function OrderTypePage() {
  const [orderType, setOrderType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [branches, setBranches] = useState([]);  // Initialize as an empty array
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch branches from the backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:3010/branch/getAll');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Log the received data
        
        if (Array.isArray(data)) {
          setBranches(data);
          
          const defaultBranch = data.find(b => b.id === 1);
          if (defaultBranch) {
            setBranch(defaultBranch.id);
          }
        } else {
          setError('Unexpected data format from API');
        }
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
      navigate('/order', { state: { orderType, address } });
      /*if (city.toLowerCase() !== 'jerusalem') {
        setError('The restaurant does not deliver to your area.');
      } else {
        navigate('/order-page', { state: { orderType, address } });
      }*/
    } else if (orderType === 'pickup') {
      if (branch === '') {
        setError('Please select a branch for pickup.');
      } else {
        navigate('/order', { state: { orderType, branch } });
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
          <img src={deliveryIcon} alt="Delivery Icon" />
          משלוח
        </button>
        <button
          className={orderType === 'pickup' ? 'selected' : ''}
          onClick={() => setOrderType('pickup')}
        >
          <img src={takeAwayIcon} alt="Take Away Icon" />
          איסוף עצמי
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

      <button className="continue-button" onClick={handleContinue}>המשך</button>
    </div>
  );
}
