import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider'; // ייבוא ה-useAuth

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('הכל'); // New state for filtering
  const { accessToken, refreshAccessToken } = useAuth(); // שליפת ה-access token מ-context

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let token = accessToken;

        // אם אין access token ננסה לרענן אותו
        if (!token) {
          token = await refreshAccessToken();
        }

        // בקשת הנתונים עם ה-access token בכותרת
        const response = await fetch('http://localhost:3010/admin/getOrdersOfToday', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // הוספת ה-access token בכותרת Authorization
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
  }, [accessToken, refreshAccessToken]); // מעקב אחר access token ורענונו

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'הכל') return true;
    return order.order_type === filter;
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error}</p>;

  return (
    <div className="admin-order-page">
      <h1>ההזמנות של היום</h1>

      {/* Filter Dropdown */}
      <div className="order-filter">
        <label htmlFor="filter">סינון לפי סוג הזמנה: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="הכל">הכל</option>
          <option value="משלוח">משלוח</option>
          <option value="איסוף עצמי">איסוף עצמי</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        <ul className="order-list">
          {filteredOrders.map((order) => (
            <li key={order.id} className="order-item">
              <p><strong>מספר הזמנה:</strong> {order.order_id}</p>
              <p><strong>לקוח:</strong> {order.member_id}</p>
              <p><strong>סה"כ:</strong> ${order.total_price}</p>
              <p><strong>סוג הזמנה:</strong> {order.order_type}</p>
              <p><strong>הערות:</strong> {order.notes}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>לא נמצאו הזמנות מתאימות.</p>
      )}
    </div>
  );
}
