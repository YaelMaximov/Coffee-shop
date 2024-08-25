import React, { useState } from 'react';
import { useMenu } from '../MenuProvider';
import './OrderPage.css'; 
import DishPopup from './DishPopup'; 

export default function OrderPage() {
  const { menu, isLoading, error } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState('ארוחת בוקר');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDish, setSelectedDish] = useState(null); 
  const [cart, setCart] = useState([]); // New cart state

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

  const openDishPopup = (dish) => {
    setSelectedDish(dish);
  };

  // Function to add dish to the cart
  const addToCart = (dish, quantity, selectedExtras, notes) => {
    const selectedExtrasList = Object.keys(selectedExtras)
      .filter(extraName => selectedExtras[extraName]);
    
    const extrasCost = selectedExtrasList.reduce((total, extraName) => {
      const extra = dish.extras.find(e => e.name === extraName);
      return total + (extra ? extra.price : 0);
    }, 0);
    
    const totalCost = (dish.price + extrasCost) * quantity;

    const newItem = {
      ...dish,
      quantity,
      selectedExtras: selectedExtrasList,
      notes,
      totalCost
    };

    setCart(prevCart => [...prevCart, newItem]);
    setSelectedDish(null); // Close the popup after adding to cart
  };

  return (
    <div className="order-page">
      <div className="content-wrapper">
        <div className="cart-summary">
          <h3>סיכום הזמנה</h3>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <h4>{item.name}</h4>
                <p>כמות: {item.quantity}</p>
                <p>תוספות: {item.selectedExtras.join(', ')}</p>
                <p>סה"כ: ₪{item.totalCost}</p>
              </div>
            ))
          ) : (
            <p>הסל שלך ריק</p>
          )}
          <button className="checkout-button">לתשלום</button>
        </div>
        
        <div className="menu-list">
          <div className="menu-header">
            <h2>{selectedCategory}</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="חפש מנה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {filteredMenu.map((dish) => (
            <div className="menu-item" key={dish.dish_id}>
              <div className="item-info">
                <div className="item-description">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <p>₪{dish.price}</p>
                  <button className="add-to-cart" onClick={() => openDishPopup(dish)}>הוסף לסל</button>
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
          onAddToCart={addToCart} // Pass the addToCart function to the popup
        />
      )}
    </div>
  );
}
