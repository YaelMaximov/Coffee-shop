import React from 'react';
import { useMenu } from '../MenuProvider';
import './MenuPage.css'; // You'll need to create this CSS file

export default function MenuPage() {
  const { menu, isLoading, error, refreshMenu } = useMenu();

  if (isLoading) return <p>טוען תפריט...</p>;

  if (error) {
    return (
      <div>
        <p>שגיאה בטעינת התפריט: {error.toString()}</p>
        <button onClick={refreshMenu}>נסה שוב</button>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <div>
        <p>אין פריטים בתפריט</p>
        <button onClick={refreshMenu}>רענן תפריט</button>
      </div>
    );
  }

  // Group menu items by category
  const menuByCategory = menu.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  return (
    <div className="menu-page">
      <button onClick={refreshMenu} className="refresh-button">רענן תפריט</button>
      {Object.entries(menuByCategory).map(([category, dishes]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="dishes-grid">
            {dishes.map(dish => (
              <div key={dish.dish_id} className="dish-card">
                <img src={dish.image_url} alt={dish.name} className="dish-image" />
                <h3 className="dish-name">{dish.name}</h3>
                <p className="dish-description">{dish.description}</p>
                <p className="dish-price">{dish.price} ₪</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}