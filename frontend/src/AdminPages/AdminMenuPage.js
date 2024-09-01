import React, { useState } from 'react';
import { useMenu } from '../MenuProvider';
import EditPopup from './EditPopup';
// import './AdminMenuPage.css'; 

export default function AdminMenuPage() {
  const { menu, isLoading, error, refreshMenu } = useMenu();
  const [editingDish, setEditingDish] = useState(null);

  const handleEdit = (dish) => {
    setEditingDish(dish);
  };

  const handleDelete = async (dishId) => {
    try {
      const response = await fetch(`http://localhost:3010/menu/deleteDish/${dishId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Dish deleted:', dishId);
      refreshMenu(); // Refresh the menu after deletion
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleUpdate = async (dish) => {
    const { dish_id, name, price, description, category, image_url } = dish;
  
    try {
      const response = await fetch(`http://localhost:3010/menu/updateDish/${dish_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, description, category, image_url }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Dish updated:', data);
      setEditingDish(null); // Close the EditPopup after updating
      refreshMenu(); // Refresh the menu after updating
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

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

  const menuByCategory = menu.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  return (
    <div className="admin-menu-page">
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
                <div className="admin-actions">
                  <button onClick={() => handleEdit(dish)} className="edit-button">ערוך</button>
                  <button onClick={() => handleDelete(dish.dish_id)} className="delete-button">מחק</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {editingDish && (
        <EditPopup
          dish={editingDish}
          onClose={() => setEditingDish(null)}
          onSave={(updatedDish) => {
            setEditingDish(updatedDish);
            handleUpdate(updatedDish);
          }}
        />
      )}
    </div>
  );
}
