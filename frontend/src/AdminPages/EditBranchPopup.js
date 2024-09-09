// EditBranchPopup.js

import React, { useState } from 'react';
import './css/EditBranchPopup.css'; // Create this file for styling

export default function EditBranchPopup({ branch, onClose, onSave }) {
  const [editedBranch, setEditedBranch] = useState({ ...branch });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBranch({ ...editedBranch, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedBranch);
    onClose(); // Close the popup after saving
  };

  return (
    <div className="edit-branch-popup">
      <div className="popup-content">
        <h2>עריכת פרטי סניף</h2>
        <form onSubmit={handleSubmit}>
          <label>
            כתובת:
            <input
              type="text"
              name="address"
              value={editedBranch.address}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            טלפון:
            <input
              type="text"
              name="phone"
              value={editedBranch.phone}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            שעות פתיחה:
            <input
              type="text"
              name="opening_hours"
              value={editedBranch.opening_hours}
              onChange={handleInputChange}
              required
            />
          </label>
          <div className="popup-buttons">
            <button type="submit">שמור</button>
            <button type="button" onClick={onClose}>בטל</button>
          </div>
        </form>
      </div>
    </div>
  );
}
