// src/AdminPages/AdminBranchEditPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import './AdminBranchEditPage.css'; // Create this file for styling

export default function AdminBranchEditPage() {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`http://localhost:3010/admin/branch/${branchId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBranch(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranch();
  }, [branchId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranch({ ...branch, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3010/admin/branch/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branch),
      });

      if (!response.ok) {
        throw new Error('Failed to update branch details');
      }

      setSuccessMessage('Branch details updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) return <p>Loading branch details...</p>;
  if (error) return <p>Error loading branch details: {error}</p>;

  return (
    <div className="admin-branch-edit-page">
      <h1>Edit Branch Details</h1>
      {branch ? (
        <form onSubmit={handleSubmit} className="edit-branch-form">
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={branch.address}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={branch.phone}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Opening Hours:
            <input
              type="text"
              name="opening_hours"
              value={branch.opening_hours}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Save Changes</button>
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      ) : (
        <p>No branch details found.</p>
      )}
    </div>
  );
}
