import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import deliveryIcon from '../imgs/delivery.png';
import pickupIcon from '../imgs/take-away.png';
import './AdminOrderPage.css';

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('הכל'); 
  const { accessToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let token = accessToken;

        if (!token) {
          token = await refreshAccessToken();
        }

        const response = await fetch('http://localhost:3010/admin/getOrdersOfToday', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken, refreshAccessToken]);

  const fetchOrderDetails = async (order_id) => {
    try {
      let token = accessToken;

      if (!token) {
        token = await refreshAccessToken();
      }

      const response = await fetch(`http://localhost:3010/admin/orderDetails/${order_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'הכל') return true;
    return order.order_type === filter;
  });

  const handleOrderClick = (order_id) => {
    fetchOrderDetails(order_id);
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error}</p>;

  return (
    <div className="admin-order-page">
      <div className="filter-container">
        <select value={filter} onChange={handleFilterChange} className="filter-select">
          <option value="הכל">הכל</option>
          <option value="משלוח">משלוח</option>
          <option value="איסוף עצמי">איסוף עצמי</option>
        </select>
      </div>
      <div className="order-container">
        <ul className="order-list">
          {filteredOrders.map((order) => (
            <li key={order.id} className="order-item" onClick={() => handleOrderClick(order.order_id)}>
              <div className="order-details">
                <p><strong>מספר הזמנה:</strong> {order.order_id}</p>
                <p><strong>לקוח:</strong> {order.member_id}</p>
                <p><strong>סה"כ:</strong> ₪{order.total_price}</p>
                <p><strong>סוג הזמנה:</strong> {order.order_type}</p>
                <p><strong>הערות:</strong> {order.notes}</p>
              </div>
              <div className="order-image">
                <img
                  src={order.order_type === 'משלוח' ? deliveryIcon : pickupIcon}
                  alt={order.order_type === 'משלוח' ? 'משלוח' : 'איסוף עצמי'}
                  className="order-type-icon"
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="selected-order-details">
          {selectedOrder ? (
            <>
              <h2>פרטי הזמנה {selectedOrder.orderDetails[0]?.order_id}</h2>
              <button onClick={() => setSelectedOrder(null)}>סגור</button>
              <ul>
                {selectedOrder.orderDetails.map((dish, index) => (
                  <li key={index} className="dish-item">
                    <div className="dish-details">
                      <p><strong>מנה:</strong> {dish.dish_name}</p>
                      <p><strong>כמות:</strong> {dish.quantity}</p>
                      <p><strong>מחיר:</strong> ₪{dish.dish_price}</p>
                      <img src={dish.dish_image} alt={dish.dish_name} className="dish-image" />
                    </div>
                  </li>
                ))}
              </ul>

              <h3>תוספות:</h3>
              <ul>
                {selectedOrder.extrasDetails.map((extra, index) => (
                  <li key={index}>
                    <p><strong>תוספת:</strong> {extra.extra_name}</p>
                    {extra.extra_price > 0 && <p><strong>מחיר:</strong> ₪{extra.extra_price}</p>}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>בחר הזמנה לצפייה בפרטים</p>
          )}
        </div>
      </div>
    </div>
  );
}
