import React, { useState, useEffect } from 'react';
import './css/MyOrderPage.css'; // קובץ CSS לעיצוב הדף
import { useAuth } from '../Providers/AuthProvider';

export default function MyOrderPage() {
  const user_id = localStorage.getItem('userId'); // קבלת ה-userId מ-localStorage
  const [orders, setOrders] = useState([]); // הגדרת ברירת מחדל כ-array
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3010/client/customerOrder`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, 
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // הבטחת ש-data הוא מערך
        if (Array.isArray(data)) {
          setOrders(data);
          if (data.length === 0) {
            setMessage('אין הזמנות להצגה'); // הצגת הודעה מתאימה אם המערך ריק
          }
        } else {
          throw new Error('Data received from the server is not an array');
        }
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    if (user_id) {
      fetchOrders(); 
    } else {
      setError('No user ID found. Please log in.');
      setLoading(false);
    }
  }, [user_id, accessToken]);
  

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="order-history">
      <h1>ההזמנות שלך</h1>
      {message ? (
        <p>{message}</p>
      ) : orders.length === 0 ? (
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
