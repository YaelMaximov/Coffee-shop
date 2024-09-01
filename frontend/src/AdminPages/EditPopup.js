import React from 'react';
import './EditPopup.css';

export default function EditPopup({ dish, onClose, onSave }) {
  const [editedDish, setEditedDish] = React.useState(dish);

  const handleSave = () => {
    onSave(editedDish);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>עריכת מנה: {editedDish.name}</h3>
        <label>
          שם המנה:
          <input
            type="text"
            value={editedDish.name}
            onChange={(e) => setEditedDish({ ...editedDish, name: e.target.value })}
          />
        </label>
        <label>
          תיאור:
          <textarea
            value={editedDish.description}
            onChange={(e) => setEditedDish({ ...editedDish, description: e.target.value })}
          />
        </label>
        <label>
          מחיר:
          <input
            type="number"
            value={editedDish.price}
            onChange={(e) => setEditedDish({ ...editedDish, price: e.target.value })}
          />
        </label>
        <label>
          כתובת תמונה:
          <input
            type="text"
            value={editedDish.image_url}
            onChange={(e) => setEditedDish({ ...editedDish, image_url: e.target.value })}
          />
        </label>
        <div className="popup-actions">
          <button onClick={handleSave} className="save-button">שמור</button>
          <button onClick={onClose} className="cancel-button">בטל</button>
        </div>
      </div>
    </div>
  );
}
