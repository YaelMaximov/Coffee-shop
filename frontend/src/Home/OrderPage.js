import React, { useState } from 'react';
import { useMenu } from '../MenuProvider';
import './OrderPage.css';
import DishPopup from './DishPopup';

export default function OrderPage() {
  const { menu, isLoading, error } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState('ארוחת בוקר');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [cart, setCart] = useState([]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const categories = [...new Set(menu.map((dish) => dish.category))];
  const filteredMenu = menu.filter((dish) => 
    dish.category === selectedCategory && 
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (orderItem) => {   
    setCart(prevCart => [...prevCart, orderItem]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleEditItem = (index) => {
    // Implement edit functionality
  };

  const handleDeleteItem = (index) => {
    // Implement delete functionality
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, newQuantity) => {
    // Implement quantity change functionality
    setCart(cart.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity } : item
    ));
  };

  const handleResetOrder = () => {
    setCart([]);
  };

  return (
    <div className="order-page">
      <div className="menu-header">
        <input
          type="text"
          placeholder="חפש מנה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2>{selectedCategory}</h2>
      </div>
      
      <div className="content-wrapper">
        <div className="cart-summary">
          <h3>סיכום הזמנה</h3>
          {cart.length === 0 ? (
            <>
              <img src="https://cdn-icons-png.flaticon.com/512/3721/3721650.png" alt="Cart" width={200} />
              <p>הסל שלך ריק</p>
            </>
          ) : (
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <h4>{item.dish}</h4>
                  <p>כמות: {item.quantity}</p>
                  <p>תוספות: {Object.entries(item.extras).flatMap(([category, extras]) => 
                    extras.map(extra => extra.name)
                  ).join(', ')}</p>
                  <p>מחיר: ₪{item.totalPrice.toFixed(2)}</p>
                  <div className="cart-item-actions">
                    <button onClick={() => handleEditItem(index)}>ערוך</button>
                    <button onClick={() => handleDeleteItem(index)}>מחק</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                    />
                  </div>
                </div>
              ))}
              <p className="total-price">סה"כ: ₪{getTotalPrice().toFixed(2)}</p>
              <button className="reset-order" onClick={handleResetOrder}>אפס הזמנה</button>
            </div>
          )}
          <button className="checkout-button" disabled={cart.length === 0}>לתשלום</button>
        </div>
        
        <div className="menu-list">
          {filteredMenu.map((dish) => (
            <div className="menu-item" key={dish.dish_id}>
              <div className="item-info">
                <div className="item-description">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <p>₪{dish.price}</p>
                  <button className="add-to-cart" onClick={() => setSelectedDish(dish)}>הוסף לסל</button>
                </div>
                <img src={dish.image_url} alt={dish.name} />
              </div>
            </div>
          ))}
        </div>

        <div className="category-navigation">
          <h3>קטגוריות</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={category === selectedCategory ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedDish && (
        <DishPopup
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
