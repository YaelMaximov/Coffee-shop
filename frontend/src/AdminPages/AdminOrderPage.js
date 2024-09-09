import React, { useState, useEffect } from 'react';
import { useAuth } from '../Providers/AuthProvider';
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
            'Content-Type': 'application/json',
          },
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
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const orderData = await response.json();
      setSelectedOrder(orderData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'הכל') return true;
    return order.order_type === filter;
  });

  const handleOrderClick = (order_id) => {
    fetchOrderDetails(order_id);
  };

  const handleStatusChange = async (status, order_id = null) => {
    try {
      let token = accessToken;

      if (!token) {
        token = await refreshAccessToken();
      }

      // Use the selectedOrder order_id if not provided
      const id = order_id || (selectedOrder && selectedOrder.order_id);

      if (!id) {
        throw new Error('Order ID is required to update status');
      }

      const response = await fetch(`http://localhost:3010/admin/updateOrderStatus/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      alert(result); // Notify the user of the result

      // Update local state to reflect status change
      setOrders(orders.map(order =>
        order.order_id === id ? { ...order, status } : order
      ));
      if (selectedOrder && selectedOrder.order_id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to format time from datetime
  const formatTime = (datetime) => {
    if (!datetime) return '';
    const date = new Date(datetime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <li
              key={order.order_id}
              className={`order-item ${order.status === 'מוכן' ? 'completed' : ''}`}
              onClick={() => handleOrderClick(order.order_id)}
            >
              <div className="order-image">
                <img
                  src={order.order_type === 'משלוח' ? deliveryIcon : pickupIcon}
                  alt={order.order_type === 'משלוח' ? 'משלוח' : 'איסוף עצמי'}
                  className="order-type-icon"
                />
              </div>
              <div className="order-details">
                <p><strong>מספר הזמנה:</strong> {order.order_id}</p>
                <p><strong>לקוח:</strong> {order.member_first_name} {order.member_last_name}</p> {/* Displaying customer name */}
                <p><strong>סה"כ:</strong> ₪{order.total_price}</p>
                <p><strong>סוג הזמנה:</strong> {order.order_type}</p>
                <p><strong>הערות:</strong> {order.notes}</p>
                <p><strong>שעת הזמנה:</strong> {formatTime(order.order_time)}</p> {/* Formatted time */}
                <p><strong>סטטוס:</strong> {order.status}</p>
                {/* Status Update */}
                <div className="status-update-container">
                  <label>
                    <input
                      type="checkbox"
                      checked={order.status === 'מוכן'}
                      onChange={(e) => handleStatusChange(e.target.checked ? 'מוכן' : 'לא מוכן', order.order_id)}
                    />
                    <span>מוכן</span>
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="selected-order-details">
          {selectedOrder ? (
            <>
              <div className="selected-order-header">
                <button onClick={() => setSelectedOrder(null)}>✖</button>
                <h2>פרטי הזמנה {selectedOrder.order_id}</h2>
              </div>
              <div className="customer-details">
                <h3>פרטי המזמין</h3>
                {selectedOrder.customer_name ? (
                  <>
                    <p><strong>שם פרטי:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>טלפון:</strong> {selectedOrder.customer_phone}</p>
                  </>
                ) : (
                  <p>לא נמצאו פרטי מזמין</p>
                )}
              </div>
              <ul>
                {selectedOrder.dishes.map((dish, index) => (
                  <li key={index} className="dish-item">
                    <div className="dish-details">
                      <img src={dish.image_url} alt={dish.name} className="dish-image" />
                      <p><strong>מנה:</strong> {dish.name}</p>
                      <p><strong>כמות:</strong> {dish.quantity}</p>
                      <p><strong>מחיר:</strong> ₪{dish.price}</p>
                    </div>
                    {dish.extras.length > 0 && (
                      <ul className="extras-list">
                        <h3>תוספות</h3>
                        {dish.extras.map((extra, index) => (
                          <li key={index} className="extra-item">
                            <p><strong>{extra.name}</strong></p>
                            {extra.price > 0 && <p> -₪{extra.price}</p>}
                          </li>
                        ))}
                      </ul>
                    )}
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
