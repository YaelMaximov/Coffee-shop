import React from 'react';
import './EditPopup.css';

export default function EditPopup({ dish, onClose, onUpdate }) {
  const [editedDish, setEditedDish] = React.useState(dish);

  const handleSave = () => {
    onUpdate(editedDish);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3 className="popup-title">עריכת מנה: {editedDish.name}</h3>
        <div className="popup-form">
          <label className="form-label">
            שם המנה:
            <input
              type="text"
              value={editedDish.name}
              onChange={(e) => setEditedDish({ ...editedDish, name: e.target.value })}
              className="form-input"
            />
          </label>
          <label className="form-label">
            תיאור:
            <textarea
              value={editedDish.description}
              onChange={(e) => setEditedDish({ ...editedDish, description: e.target.value })}
              className="form-textarea"
            />
          </label>
          <label className="form-label">
            מחיר:
            <input
              type="number"
              value={editedDish.price}
              onChange={(e) => setEditedDish({ ...editedDish, price: e.target.value })}
              className="form-input"
            />
          </label>
          <label className="form-label">
            כתובת תמונה:
            <input
              type="text"
              value={editedDish.image_url}
              onChange={(e) => setEditedDish({ ...editedDish, image_url: e.target.value })}
              className="form-input"
            />
          </label>
        </div>
        <div className="popup-actions">
          <button onClick={handleSave} className="action-button save-button">שמור</button>
          <button onClick={onClose} className="action-button cancel-button">בטל</button>
        </div>
      </div>
    </div>
  );
}
