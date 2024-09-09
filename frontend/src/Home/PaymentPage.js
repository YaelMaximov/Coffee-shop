import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderContext } from '../Providers/OrderProvider';
import { useAuth } from '../Providers/AuthProvider';
import './css/PaymentPage.css';  // Assume you have a CSS file for styling

export default function PaymentPage() {
  const { accessToken } = useAuth(); 
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
  const [PhoneNum, setPhoneNum] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const { orderType, address, branch } = location.state || {};
  


  const memberId = localStorage.getItem('userId');; // Replace with actual value if available
  const addressId = order.address_id;

  useEffect(() => {
    const savedOrder = JSON.parse(sessionStorage.getItem('order'));
    if (savedOrder && !order.items.length) {
      updateOrder(savedOrder);
    }
  }, [order.items.length, updateOrder]);

  useEffect(() => {
    if (order.orderType === 'delivery') {
      const baseTotal = order.items.reduce((total, item) => total + item.totalPrice, 0);
      const updatedTotal = baseTotal + 15;
      updateOrder((prevOrder) => ({ ...prevOrder, total: updatedTotal }));
      sessionStorage.setItem('order', JSON.stringify({ ...order, total: updatedTotal }));
    }
  }, []);

  const validateCardNumber = (number) => /^[0-9]{16}$/.test(number);
  const validateIdNumber = (id) => /^[0-9]{9}$/.test(id);
  const isCardExpired = (date) => {
    const [year, month] = date.split('-').map(Number);
    const currentDate = new Date();
    const expiryDate = new Date(year, month - 1);
    return expiryDate < currentDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'מספר כרטיס אשראי לא תקין';
      setMessage('אחד או יותר מהפרטים שהזנת שגויים');
    }
  
    if (!validateIdNumber(idNumber)) {
      newErrors.idNumber = 'מספר תעודת זהות לא תקין';
      setMessage('אחד או יותר מהפרטים שהזנת שגויים');
    }
  
    if (isCardExpired(expirationDate)) {
      newErrors.expirationDate = 'תוקף הכרטיס פג';
      setMessage('אחד או יותר מהפרטים שהזנת שגויים');
    }
  
    try {
      // Step 1: Save the order in the Orders table
      const orderResponse = await fetch('http://localhost:3010/client/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          member_id: memberId,
          order_type: orderTypeHeb(),
          total_price: getTotalPrice(),
          notes: notes,
          order_date: new Date().toISOString().split('T')[0],
          customer_name:fullName,
          customer_phone:PhoneNum, 
        }),
      });
  
      const orderData = await orderResponse.json();
  
      if (orderResponse.ok) {
        const orderId = orderData.order_id;
        console.log(order.items); // inspect the dishes array
  
        for (const dish of order.items) {
          console.log('Dish:', dish);
          console.log('Dish ID:', dish.id);
        }
  
        // Step 2: Save the dishes in the Order_Dishes table
        const orderDishesResponse = await fetch('http://localhost:3010/client/saveDishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            order_id: orderId,
            dishes: order.items,  // This is the array of dishes being sent
          }),
        });
  
        const orderDishesData = await orderDishesResponse.json();
        console.log(orderDishesData);

        if (orderDishesResponse.ok) {
          // Step 3: Handle extras for each dish
          //const order_dish_id = orderDishesData.order_dish_id;
          const savedDishes = orderDishesData.savedDishes; // Assuming savedDishes contains order_dish_id for each dish
  
          for (const dish of savedDishes) {
            console.log('Dish:', dish);
            const order_dish_id = dish.order_dish_id;
  
            if (dish.extras && Object.keys(dish.extras).length > 0) {
              for (const category in dish.extras) {
                const categoryExtras = dish.extras[category]; // Get the array of extras for this category
  
                if (Array.isArray(categoryExtras) && categoryExtras.length > 0) {
                  
                  console.log(`Extras for category ${category}:`, categoryExtras);
                  console.log("Sending extras for dish:", dish);

                  await fetch('http://localhost:3010/client/addOrderDishExtras', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                      order_dish_id: order_dish_id, // Ensure this contains the correct dish ID
                      extras: categoryExtras,
                      category:category // Send the extras for this category
                    }),
                  })
                  .then(response => response.json())
                  .then(data => console.log("Extras added:", data))
                  .catch(error => console.error("Error adding extras:", error));

                  
                }
              }
            }
          }
        }
  
        // Step 4: Handle delivery or pickup
        if (order.orderType === 'delivery') {
          const deliveryResponse = await fetch('http://localhost:3010/client/saveDelivery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              order_id: orderId,
              recipient_name: fullName,
              recipient_phone: PhoneNum,
              address_id: addressId,
              payment_method: paymentMethodHeb(),
            }),
          });
  
          const deliveryData = await deliveryResponse.json();
  
          if (!deliveryResponse.ok) {
            throw new Error(deliveryData.message);
          }
        } else {
          const pickupResponse = await fetch('http://localhost:3010/client/savePickup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              order_id: orderId,
              payment_method: paymentMethodHeb(),
            }),
          });
  
          const pickupData = await pickupResponse.json();
  
          if (!pickupResponse.ok) {
            throw new Error(pickupData.message);
          }
        }
  
        // Step 5: Navigate to order confirmation page
        navigate('/order-confirmation', {
          state: {
            orderType,
            address,
            branch,
            paymentMethod,
            cart: order.items,
            fullName,
          },
        });
      } else {
        setMessage(orderData.message);
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      setMessage('Order submission failed');
    }
  };
  
  const getTotalPrice = () => {
    const baseTotal = order.items.reduce((total, item) => total + item.totalPrice, 0);
    return order.orderType === 'delivery' ? baseTotal + 15 : baseTotal; // Add 15 for delivery orders
  };

  const orderTypeHeb = () => {
    return order.orderType === 'delivery' ? 'משלוח' : 'איסוף עצמי';
  };

  const paymentMethodHeb = () => {
    if (order.orderType === 'delivery') {
      return paymentMethod === 'cash' ? 'מזומן' : 'כרטיס אשראי';
    }
    return paymentMethod === 'cash' ? 'תשלום בבית העסק' : 'כרטיס אשראי';
  };

  const handleChange = (e) => {
    setFullName(e.target.value);
  };

  return (
    <div className="payment-container">


      <div className="payment-form">
        <h3>הפרטים שלי</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">שם מלא:</label>
            <input type="text" id="fullName" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">פלאפון:</label>
            <input type="text"
              value={PhoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
              id="phone" required />
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
                {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="idNumber">תעודת זהות</label>
                <input
                  type="text"
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
                {errors.idNumber && <p className="error-message">{errors.idNumber}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">תוקף</label>
                <input
                  type="month"
                  id="expirationDate"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                {errors.expirationDate && <p className="error-message">{errors.expirationDate}</p>}
                {message && <p className="error-message">{message}</p>}
                </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  value={CVV}
                  onChange={(e) => setCVV(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">הערות:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-payment-button">בצע תשלום</button>
        </form>
      </div>
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
    </div>
  );
}
