import React, { useState } from 'react';

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

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
    e.preventDefault();
    let validationErrors = {};

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
      // Handle the payment submission
      console.log('Payment method:', paymentMethod);
      console.log('Notes:', notes);

      // If credit card is chosen, log the credit card details (remove in production)
      if (paymentMethod === 'credit_card') {
        console.log('Card Number:', cardNumber);
        console.log('ID Number:', idNumber);
        console.log('Expiration Date:', expirationDate);
      }

      // Redirect to the order confirmation page
      //window.location.href = 'http://localhost:3000/order';
    }
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <form onSubmit={handleSubmit}>
        <h3>Order Summary</h3>
        {/* Add order summary details here */}

        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
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
            <div>
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              {errors.cardNumber && <p>{errors.cardNumber}</p>}
            </div>

            <div>
              <label htmlFor="idNumber">ID Number:</label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
              {errors.idNumber && <p>{errors.idNumber}</p>}
            </div>

            <div>
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
  );
}
