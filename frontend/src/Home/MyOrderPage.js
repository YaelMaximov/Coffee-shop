import React, { useState, useEffect } from 'react';
import './MyOrderPage.css'; // קובץ CSS לעיצוב הדף
import { useAuth } from '../AuthProvider';

export default function MyOrderPage() {
  const user_id = localStorage.getItem('userId'); // קבלת ה-userId מ-localStorage
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth(); 


  useEffect(() => {
    // פונקציה לשליפת ההזמנות מהשרת
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3010/client/customerOrder/${user_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`, // Ensure the token is correct
            },
          });
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchOrders(); // שליפת ההזמנות אם ה-user_id קיים
    } else {
      setError('No user ID found. Please log in.');
      setLoading(false);
    }
  }, [user_id]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="order-history">
      <h1>ההזמנות שלך</h1>
      {orders.length === 0 ? (
        <p>אין הזמנות להצגה</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>מזהה הזמנה</th>
              <th>תאריך הזמנה</th>
              <th>סטטוס</th>
              <th>סכום</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>{order.total_price} ש"ח</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
