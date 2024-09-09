import React, { useState } from 'react';
import { useMenu } from '../Providers/MenuProvider';
import { useAuth } from '../Providers/AuthProvider';
import EditPopup from './EditPopup';
import * as LucideIcons from 'lucide-react';
import './AdminMenuPage.css';

export default function AdminMenuPage() {
  const { menu, isLoading, error, refreshMenu } = useMenu();
  const { accessToken } = useAuth(); // קבלת ה-accessToken מקונטקסט ההתחברות
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDishIndices, setActiveDishIndices] = useState({});
  const [activeThumbnailId, setActiveThumbnailId] = useState(null);

  const handleEdit = (dish) => {
    setEditingDish(dish);
  };

  const handleDelete = async (dishId) => {
    try {
      const response = await fetch(`http://localhost:3010/admin/deleteDish/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}` // שליחת ה-accessToken
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Dish deleted:', dishId);
      refreshMenu();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleUpdate = async (dish) => {
    const { dish_id, name, price, description, category, image_url } = dish;

    try {
      const response = await fetch(`http://localhost:3010/admin/updateDish/${dish_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // שליחת ה-accessToken
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price, description, category, image_url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Dish updated:', data);
      setEditingDish(null);
      refreshMenu();
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMenu = menu.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuByCategory = filteredMenu.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  const handleArrowClick = (direction, category) => {
    setActiveDishIndices(prevIndices => {
      const currentIndex = prevIndices[category] || 0;
      const categoryDishes = menuByCategory[category];
      let newIndex;
      if (categoryDishes.length === 0) return prevIndices;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % categoryDishes.length;
      } else {
        newIndex = (currentIndex - 1 + categoryDishes.length) % categoryDishes.length;
      }
      return { ...prevIndices, [category]: newIndex };
    });
  };

  const handleThumbnailClick = (dishId, category) => {
    const index = menuByCategory[category].findIndex(dish => dish.dish_id === dishId);
    setActiveDishIndices(prevIndices => ({ ...prevIndices, [category]: index }));
    setActiveThumbnailId(dishId);
  };

  if (isLoading) return <p>טוען תפריט...</p>;
  if (error) return <p>שגיאה בטעינת התפריט: {error.toString()}</p>;
  if (!menu || menu.length === 0) return <p>אין פריטים בתפריט</p>;
  return (
    <div className="admin-menu-page">
      <div className="content-container">
        <div className="menu-navigation">
          {Object.keys(menuByCategory).map(category => (
            <a href={`#${category}`} key={category} className="category-link">{category}</a>
          ))}
        </div>

        <input
          type="text"
          placeholder="חפש מנה..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-box"
        />

        {Object.entries(menuByCategory).map(([category, dishes]) => {
          const activeIndex = activeDishIndices[category] || 0;
          const getVisibleDishes = (start, end) => dishes.slice(start, end);
          const prevDish = getVisibleDishes(activeIndex - 1, activeIndex).pop();
          const nextDish = getVisibleDishes(activeIndex + 1, activeIndex + 2).shift();

          return (
            <div id={category} key={category} className="category-section">
              <h2 className="category-title">{category}</h2>

              <div className="dish-carousel">
                <button
                  className="carousel-arrow prev"
                  onClick={() => handleArrowClick('prev', category)}
                  aria-label="Previous Dish"
                >
                  <LucideIcons.ChevronLeft />
                </button>

                <div className="dish-display">
                  {getVisibleDishes(activeIndex, activeIndex + 1).map(dish => (
                    <div className="dish-card" key={dish.dish_id}>
                      <img src={dish.image_url} alt={dish.name} />
                      <div className="dish-name">{dish.name}</div>
                      <div className="dish-description">{dish.description}</div>
                      <div className="dish-price">{dish.price} ₪</div>
                      <div className="admin-actions">
                        <button className="edit-button" onClick={() => handleEdit(dish)}>ערוך</button>
                        <button className="delete-button" onClick={() => handleDelete(dish.dish_id)}>מחק</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-arrow next"
                  onClick={() => handleArrowClick('next', category)}
                  aria-label="Next Dish"
                >
                  <LucideIcons.ChevronRight />
                </button>
              </div>

              <div className="dish-thumbnails">
                {dishes.map(dish => (
                  <div 
                    className={`thumbnail ${activeThumbnailId === dish.dish_id ? 'active' : ''}`}
                    key={dish.dish_id}
                    onClick={() => handleThumbnailClick(dish.dish_id, category)}
                  >
                    <img src={dish.image_url} alt={dish.name} />
                    <div className="thumbnail-name">{dish.name}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {editingDish && (
          <EditPopup
            dish={editingDish}
            onClose={() => setEditingDish(null)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
