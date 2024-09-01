import React, { useState, useEffect } from 'react';
// import './AdminOrderPage.css'; // Ensure you have styles for the new filter feature

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // New state for filtering

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3010/admin/orders'); // Update with your API endpoint
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
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.order_type === filter;
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error}</p>;

  return (
    <div className="admin-order-page">
      <h1>Today's Orders</h1>

      {/* Filter Dropdown */}
      <div className="order-filter">
        <label htmlFor="filter">Filter by Order Type: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="משלוח">משלוח</option>
          <option value='איסוף  עצמי'>איסוף עצמי</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        <ul className="order-list">
          {filteredOrders.map((order) => (
            <li key={order.id} className="order-item">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Customer:</strong> {order.member_id}</p>
              <p><strong>Total:</strong> ${order.total_price}</p>
              <p><strong>Type:</strong> {order.order_type}</p>
              <p><strong>Notes:</strong> {order.notes}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found for the selected filter.</p>
      )}
    </div>
  );
}
