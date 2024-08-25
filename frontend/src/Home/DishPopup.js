import React, { useState, useEffect } from 'react';
import './DishPopup.css';

const DishPopup = ({ dish, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const response = await fetch(`http://localhost:3010/menu/${dish.dish_id}/extras`);
        if (response.ok) {
          const data = await response.json();
          setExtras(data);
        } else {
          console.error('Failed to fetch extras');
        }
      } catch (error) {
        console.error('Error fetching extras:', error);
      }
    };
    if (dish && dish.dish_id) {
      fetchExtras();
    }
  }, [dish]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => ({
      ...prev,
      [extra.name]: !prev[extra.name] // עדכון מצב התוספת הנבחרת
    }));
  };

  const groupedExtras = extras.reduce((acc, extra) => {
    acc[extra.category] = acc[extra.category] || [];
    acc[extra.category].push(extra);
    return acc;
  }, {});

  // פונקציה לטיפול בהוספה לסל
  const handleAddToCart = () => {
    onAddToCart(dish, quantity, selectedExtras, notes); // העברת כל המידע הנדרש
    onClose(); // סגירת החלון לאחר הוספה לסל
  };

  return (
    <div className="dish-popup-overlay">
      <div className="dish-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="dish-content">
          <img src={dish.image_url} alt={dish.name} className="dish-image" />
          <h2>{dish.name}</h2>
          <p className="dish-description">{dish.description}</p>
          <p className="dish-price">מחיר: ₪{dish.price}</p>
          
          {Object.entries(groupedExtras).map(([category, extras]) => (
            <div className="extras-category" key={category}>
              <h3>{category} לבחירה:</h3>
              <div className="extras-buttons">
                {extras.map(extra => (
                  <button 
                    className={`extra-button ${selectedExtras[extra.name] ? 'selected' : ''}`} 
                    key={extra.name}
                    onClick={() => toggleExtra(extra)}
                  >
                    {extra.name} ₪{extra.price}
                    {selectedExtras[extra.name] && <span className="checkmark">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <input
            type="text"
            className="notes-input"
            placeholder="הערות להזמנה (אופציונלי)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="popup-actions">
          <div className="quantity-selector">
            <button onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>הוסף לסל</button>
        </div>
      </div>
    </div>
  );
};

export default DishPopup;
