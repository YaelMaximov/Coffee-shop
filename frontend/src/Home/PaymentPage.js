import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderContext } from '../OrderProvider';
import './PaymentPage.css';  // Assume you have a CSS file for styling

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, updateOrder } = useContext(OrderContext);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [CVV, setCVV] = useState('');
  const [notes, setNotes] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState({});
  const { orderType, address, branch } = location.state || {};

  useEffect(() => {
    // Fetch the order from sessionStorage if not available in context
    const savedOrder = JSON.parse(sessionStorage.getItem('order'));
    if (savedOrder && !order.items.length) {
      updateOrder(savedOrder);
    }
  }, [order.items.length, updateOrder]);

  useEffect(() => {
    // Update the total in order if it's a delivery order
    if (order.orderType === 'delivery') {
      const baseTotal = order.items.reduce((total, item) => total + item.totalPrice, 0);
      const updatedTotal = baseTotal + 15;
      updateOrder((prevOrder) => ({ ...prevOrder, total: updatedTotal }));
      sessionStorage.setItem('order', JSON.stringify({ ...order, total: updatedTotal }));
    }
  }, []);

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
        navigate('/order-confirmation', {
            state: {
                orderType,
                address,
                branch,
                paymentMethod,
                cart: order.items, // Pass the order items from context
                fullName, // Customer’s full name
            }
        });
    }
};

  const getTotalPrice = () => {
    const baseTotal = order.items.reduce((total, item) => total + item.totalPrice, 0);
    return order.orderType === 'delivery' ? baseTotal + 15 : baseTotal; // Add 15 for delivery orders
  };

  const handleChange = (e) => {
    setFullName(e.target.value);
  };

  return (
    <div className="payment-container">
        <div className="order-summary-pay">
            <h3>סיכום הזמנה</h3>
            {order.items.map((item, index) => (
                <div key={index} className="summary-item">
                    <h4>{item.dish}</h4>
                    <p>כמות: {item.quantity}</p>
                    <p>תוספות: {Object.entries(item.extras).flatMap(([category, extras]) => 
                        extras.map(extra => extra.name)
                    ).join(', ')}</p>
                    <p>מחיר: ₪{item.totalPrice.toFixed(2)}</p>
                </div>
                
            ))}
            {order.orderType === 'delivery' && (
                <p className="delivery-cost">עלות משלוח: ₪15.00</p>
            )}
            <p className="total-price">סה"כ: ₪{getTotalPrice().toFixed(2)}</p>
        </div>

        <div className="payment-form">
            <h3>הפרטים שלי</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">שם מלא:</label>
                    <input type="text" id="fullName" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">פלאפון:</label>
                    <input type="text" id="phone" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">מייל:</label>
                    <input type="email" id="email" required />
                </div>
                <div className="payment-method">
                    <label>אופן התשלום:</label>
                    <div>
                        <input
                            type="radio"
                            id="cash"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="cash">מזומן</label>
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
                        <label htmlFor="credit_card">אשראי</label>
                    </div>
                </div>

                {paymentMethod === 'credit_card' && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="cardNumber">מספר אשראי:</label>
                            <input
                                type="text"
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                            {errors.cardNumber && <p>{errors.cardNumber}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="idNumber">תעודת זהות</label>
                            <input
                                type="text"
                                id="idNumber"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                            />
                            {errors.idNumber && <p>{errors.idNumber}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="expirationDate">תוקף</label>
                            <input
                                type="month"
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                            />
                            {errors.expirationDate && <p>{errors.expirationDate}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                value={CVV}
                                onChange={(e) => setCVV(e.target.value)}
                                maxLength="3"
                                pattern="\d{3}"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                                required
                            />
                            {errors.cvv && <p>{errors.cvv}</p>}
                        </div>
                    </div>
                )}

                <button type="submit">סיום הזמנה</button>
            </form>
        </div>
    </div>
  );
}