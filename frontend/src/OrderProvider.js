import React, { createContext, useState, useEffect } from 'react';

// Creating the OrderContext
export const OrderContext = createContext();

// OrderProvider component
export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    items: [],
    total: 0,
    orderType: null,
    address: '',
    branch: '',
  });

  const clearOrder = () => {
    sessionStorage.removeItem('order');
    setOrder([]); // אופציונלי: איפוס מצב ההזמנה ב-state
};

  // Function to update the order state
  const updateOrder = (newOrder) => {
    setOrder(newOrder);
    // Save to sessionStorage
    sessionStorage.setItem('order', JSON.stringify(newOrder));
  };

  // Load from sessionStorage when the provider loads
  useEffect(() => {
    const savedOrder = sessionStorage.getItem('order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <OrderContext.Provider value={{ order, updateOrder,clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
