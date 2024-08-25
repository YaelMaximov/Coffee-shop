import React, { useState } from 'react';
import './DishPopup.css'; // נניח שיש לנו קובץ CSS נפרד

const DishPopup = ({ dish, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="dish-popup-overlay">
      <div className="dish-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{dish.name}</h2>
        <img src={dish.image_url} alt={dish.name} className="dish-image" />
        <p className="dish-description">{dish.description}</p>
        <p className="dish-price">מחיר: ₪{dish.price}</p>
        
        <div className="quantity-selector">
          <button onClick={decreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQuantity}>+</button>
        </div>
        
        <div className="popup-actions">
          <button className="add-to-cart-button">הוסף לסל</button>
        </div>
      </div>
    </div>
  );
};

export default DishPopup;