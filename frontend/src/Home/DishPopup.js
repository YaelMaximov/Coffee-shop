import React, { useState, useEffect } from 'react';
import './DishPopup.css';

const DishPopup = ({ dish, orderItem, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(orderItem ? orderItem.quantity : 1);
  const [extras, setExtras] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState(orderItem ? orderItem.extras : {});
  const [notes, setNotes] = useState(orderItem ? orderItem.notes : '');
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(orderItem ? orderItem.totalPrice : dish.price);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const response = await fetch(`http://localhost:3010/public/${dish.dish_id}/extras`);
        if (response.ok) {
          const data = await response.json();
          setExtras(data);
          if (!orderItem) {
            const initialSelectedExtras = {};
            data.forEach(extra => {
              initialSelectedExtras[extra.category] = [];
            });
            setSelectedExtras(initialSelectedExtras);
          }
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
  }, [dish, orderItem]);

  useEffect(() => {
    let updatedTotalPrice = parseFloat(dish.price);
    Object.entries(selectedExtras).forEach(([category, extras]) => {
      const sauceCount = extras.filter(extra => extra.category === 'רטבים').length;
      if (sauceCount > 1) {
        updatedTotalPrice += extras.slice(1).reduce((sum, extra) => parseFloat(sum) + parseFloat(extra.price), 0.00);        
      } 
    });
    setTotalPrice(updatedTotalPrice * quantity);
  }, [selectedExtras, quantity, dish.price]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const toggleExtra = (extra, category) => {
    setSelectedExtras(prev => {
      const updatedCategory = prev[category] ? [...prev[category]] : [];
      const index = updatedCategory.findIndex(e => e.name === extra.name);
      
      if (index !== -1) {
        updatedCategory.splice(index, 1);
      } else {
        const maxQuantity = extra.max_quantity;
        if (updatedCategory.length >= maxQuantity) {
          setError(maxQuantity > 1 ? `ניתן לבחור רק ${maxQuantity} פריטים מקטגוריה זו` : `ניתן לבחור רק פריט אחד מקטגוריה זו`);
          return prev;
        }
        updatedCategory.push(extra);
      }
      
      return { ...prev, [category]: updatedCategory };
    });
  };

  const groupedExtras = extras.reduce((acc, extra) => {
    acc[extra.category] = acc[extra.category] || [];
    acc[extra.category].push(extra);
    return acc;
  }, {});

  const addToCart = () => {
    const allCategoriesSelected = Object.keys(groupedExtras).every(
      category => selectedExtras[category] && selectedExtras[category].length > 0
    );

    if (!allCategoriesSelected) {
      setError('חובה לבחור לפחות תוספת אחת מכל סוג');
      return;
    }

    const orderItem = {
      id: dish.dish_id,
      dish: dish.name,
      quantity,
      extras: selectedExtras,
      notes,
      totalPrice
    };

    onAddToCart(orderItem);
    onClose();
  };

  return (
    <div className="dish-popup-overlay">
      <div className="dish-popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="dish-content">
          <img src={dish.image_url} alt={dish.name} className="dish-image-view" />
          <h2>{dish.name}</h2>
          <p className="dish-description">{dish.description}</p>
          <p className="dish-price">מחיר: ₪{totalPrice}</p>
          <p className="included-extra">תוספת אחת כלולה במחיר המנה</p>
          
          {Object.entries(groupedExtras).map(([category, extras]) => (
            <div className="extras-category" key={category}>
              <h3>{category} לבחירה:</h3>
              <p className="required-extra">חובה לבחור תוספת אחת</p>
              <div className="extras-buttons">
                {extras.map(extra => (
                  <button 
                    className={`extra-button ${selectedExtras[category]?.some(e => e.name === extra.name) ? 'selected' : ''}`} 
                    key={extra.name}
                    onClick={() => toggleExtra(extra, category)}
                  >
                    {extra.name} {category === 'רטבים' ? `₪${extra.price}` : ''}
                    {selectedExtras[category]?.some(e => e.name === extra.name) && <span className="checkmark">✓</span>}
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
          <p className="total-price">סה"כ: ₪{totalPrice}</p>
          <button className="add-to-cart-button" onClick={addToCart}>
            {orderItem ? 'עדכן' : 'הוסף לסל'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default DishPopup;
