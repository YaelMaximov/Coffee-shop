import React, { createContext, useState, useEffect } from 'react';

// יצירת ה-Context
export const OrderContext = createContext();

// קומפוננטת ה-Provider של ההזמנה
export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState({
    items: [],
    total: 0
  });

  // פונקציה לעדכון ההזמנה
  const updateOrder = (newOrder) => {
    setOrder(newOrder);
    // שמירה ל-Session Storage
    sessionStorage.setItem('order', JSON.stringify(newOrder));
  };

  // קריאה ל-Session Storage בעת טעינת ה-Provider
  useEffect(() => {
    const savedOrder = sessionStorage.getItem('order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <OrderContext.Provider value={{ order, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
