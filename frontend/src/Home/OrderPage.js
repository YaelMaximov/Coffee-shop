
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../MenuProvider';
import { OrderContext } from '../OrderProvider'; // Import OrderContext
import './OrderPage.css';
import DishPopup from './DishPopup';
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />


export default function OrderPage() {
  const navigate = useNavigate();
  const { menu, isLoading, error } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState('ארוחת בוקר');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const { order, updateOrder } = useContext(OrderContext); // Use OrderContext
  //const { items: cart } = order;
  const cart = order?.items || [];


  const handlePayment = () => {
    updateOrder({ ...order, items: cart, total: getTotalPrice() }); // Update OrderContext
    navigate('/payment');
  };
  const categories = [...new Set(menu.map((dish) => dish.category))];
  const filteredMenu = menu.filter(
    (dish) =>
      dish.category === selectedCategory &&
      dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const addToCart = (orderItem) => {
    if (editIndex !== null) {
      updateOrder({
        ...order,
        items: cart.map((item, i) => (i === editIndex ? orderItem : item)),
      });
      setEditIndex(null);
    } else {
      updateOrder({
        ...order,
        items: [...cart, orderItem],
      });
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleEditItem = (index) => {
    const dishId = cart[index].id;
    const editDish = menu.find((dish) => dish.dish_id === dishId);
    setSelectedDish(editDish);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    updateOrder({
      ...order,
      items: cart.filter((_, i) => i !== index),
    });
  };

  const handleQuantityChange = (index, newQuantity) => {
    const dishId = cart[index].id;
    const dishPrice = menu.find((dish) => dish.dish_id === dishId).price;
    updateOrder({
      ...order,
      items: cart.map((item, i) =>
        i === index
          ? { ...item, quantity: newQuantity, totalPrice: dishPrice * newQuantity }
          : item
      ),
    });
  };
  const handleResetOrder = () => {
    updateOrder({
      ...order,
      items: [], // Clear the cart
    });
  };

  return (
    <div className="order-page">
      <div className="header-container">
      {/* <img src="https://imageproxy.wolt.com/venue/61eea7232d54f85baeb99f9d/798f6406-81ea-11ec-a506-f20b69867cbd_yaelitz.jpg" alt="תיאור התמונה" className="header-image" /> */}

        <img src="https://scontent.ftlv1-1.fna.fbcdn.net/v/t39.30808-6/255245272_4902502489769622_2324489355499356995_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=EAvoMnTGp0gQ7kNvgH_vfTF&_nc_ht=scontent.ftlv1-1.fna&oh=00_AYCTVC6T1vVujJuneON1u-MiUcCxWqmXYYRSz-DLVWFT7w&oe=66DDF9CE" alt="תיאור התמונה" className="header-image" />
      </div>

      <div className="menu-header">
        <input
          className="search-bar"
          type="text"
          placeholder="חפש מנה"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2>{selectedCategory}</h2>
      </div>

      <div className="content-wrapper">
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
                <img src={dish.image_url} alt={dish.name} className="dish-image-order" />
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>סיכום הזמנה</h3>
          {cart.length === 0 ? (
            <>
              {/* <img className="basket" src="https://cdn-icons-png.freepik.com/512/7877/7877599.png" alt="Cart" width={200} /> */}
              <img className="basket" src="https://cdn-icons-png.flaticon.com/512/3721/3721650.png" alt="Cart" width={200} />
              <p>הסל שלך ריק</p>
            </>
          ) : (
            <div className="cart-items">
              <button className="reset-order" onClick={handleResetOrder}>אפס הזמנה</button>
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <h4>{item.dish}</h4>
                  <p>כמות: {item.quantity}</p>
                  <p>תוספות: {Object.entries(item.extras).flatMap(([category, extras]) => 
                    extras.map(extra => extra.name)
                  ).join(', ')}</p>
                  <p>מחיר: ₪{item.totalPrice}</p>
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
            </div>
          )}
          <button className="checkout-button" disabled={cart.length === 0} onClick={handlePayment}>לתשלום</button>
        </div>

        
      </div>

      {selectedDish && (
        <DishPopup
          dish={selectedDish}
          orderItem={cart[editIndex]}
          onClose={() => {
            setSelectedDish(null);
            setEditIndex(null);
          }}
          onAddToCart={addToCart}
          initialExtras={editIndex !== null ? cart[editIndex].extras : {}}
          initialQuantity={editIndex !== null ? cart[editIndex].quantity : 1}
        />
      )}
    </div>
  );
}
