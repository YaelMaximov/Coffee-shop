import React, { useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './PaymentPage.css';  // Assume you have a CSS file for styling

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [fullName,setFullName] = useState('');
  const [errors, setErrors] = useState({});
  const { orderType, address, branch,cart } = location.state || {};

  const validateCardNumber = (number) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number);
  };

  const validateIdNumber = (id) => {
    const regex = /^[0-9]{9}$/;
    return regex.test(id);
  };

  const isCardExpired = (date) => {
    const [year, month] = date.split('-').map(Number);
    const currentDate = new Date();
    const expiryDate = new Date(year, month - 1);
    return expiryDate < currentDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    
    let validationErrors = {};

    // Validate credit card information if the payment method is credit card
    if (paymentMethod === 'credit_card') {
        if (!validateCardNumber(cardNumber)) {
            validationErrors.cardNumber = 'Invalid card number. Must be 16 digits.';
        }
        if (!validateIdNumber(idNumber)) {
            validationErrors.idNumber = 'Invalid ID number. Must be 9 digits.';
        }
        if (isCardExpired(expirationDate)) {
            validationErrors.expirationDate = 'Card is expired.';
        }
    }

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
    } else {
        // Make sure that no event object or non-serializable object is being passed to navigate
        navigate('/order-confirmation', {
            state: {
                orderType,
                address,
                branch,
                paymentMethod,
                cart: [...cart], // Making sure the cart is passed correctly
                fullName, // Customer’s full name
            }
        });
    }
};

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
};

const handleChange = (e) => {
  setFullName(e.target.value);
};

  return (
    <div className="payment-container">
        <div className="order-summary-pay">
                <h3>Order Summary</h3>
                {cart.map((item, index) => (
                    <div key={index} className="summary-item">
                        <h4>{item.dish}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Extras: {Object.entries(item.extras).flatMap(([category, extras]) => 
                            extras.map(extra => extra.name)
                        ).join(', ')}</p>
                        <p>Price: ₪{item.totalPrice.toFixed(2)}</p>
                    </div>
                ))}
                <p className="total-price">Total: ₪{getTotalPrice().toFixed(2)}</p>
          </div>

      <div className="payment-form">
        <h3>My Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input type="text" id="phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          {/* Additional form fields for credit card, etc. */}
          
          <div className="payment-method">
            <label>Payment Method:</label>
            <div>
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cash">Cash</label>
            </div>
            <div>
              <input
                type="radio"
                id="credit_card"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="credit_card">Credit Card</label>
            </div>
          </div>

          {paymentMethod === 'credit_card' && (
            <div>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number:</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                {errors.cardNumber && <p>{errors.cardNumber}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="idNumber">ID Number:</label>
                <input
                  type="text"
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
                {errors.idNumber && <p>{errors.idNumber}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date:</label>
                <input
                  type="month"
                  id="expirationDate"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                {errors.expirationDate && <p>{errors.expirationDate}</p>}
              </div>
            </div>
          )}

          <button type="submit">Complete Payment</button>
        </form>
      </div>
    </div>
  );
}
