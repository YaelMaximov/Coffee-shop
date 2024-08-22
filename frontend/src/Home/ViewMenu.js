import React from 'react';
import { useMenu } from '../MenuProvider';

export default function MenuPage() {
  console.log('Rendering MenuPage');
  const menuData = useMenu();
  console.log('Menu data:', menuData);

  const { menu, isLoading, error, refreshMenu } = menuData;

  if (isLoading) {
    return <p>טוען תפריט...</p>;
  }

  if (error) {
    console.error('Error in MenuPage:', error);
    return (
      <div>
        <p>שגיאה בטעינת התפריט: {error.toString()}</p>
        <button onClick={refreshMenu}>נסה שוב</button>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    console.log('Menu is empty');
    return (
      <div>
        <p>אין פריטים בתפריט</p>
        <button onClick={refreshMenu}>רענן תפריט</button>
      </div>
    );
  }

  console.log('Rendering menu items');
  return (
    <div>
      <h1>תפריט</h1>
      <button onClick={refreshMenu}>רענן תפריט</button>
      <ul>
        {menu.map(dish => (
          <li key={dish.dish_id}>
            <h2>{dish.name}</h2>
            <p>{dish.description}</p>
            <p>מחיר: {dish.price} ₪</p>
            <img src={dish.image_url} alt={dish.name} width="150" />
            <p>קטגוריה: {dish.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}