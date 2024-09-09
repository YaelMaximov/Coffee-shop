import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider'; // Import useAuth hook
import './BranchPage.css';
import EditBranchPopup from '../AdminPages/EditBranchPopup'; // Import the new component

export default function BranchPage() {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const { user } = useAuth(); // Get the user from the AuthProvider
  const role = localStorage.getItem('userRole');


  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`http://localhost:3010/public/getBranch/${branchId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBranch(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranch();
  }, [branchId]);

  const handleSave = async (updatedBranch) => {
    try {
      const response = await fetch(`http://localhost:3010/branch/updateBranch/${branchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBranch),
      });
      if (!response.ok) {
        throw new Error('Failed to update branch details');
      }
      setBranch(updatedBranch); // Update the branch details locally
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) return <p>Loading branch details...</p>;
  if (error) return <p>Error loading branch details: {error.message}</p>;

  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`;

  return (
    <div className="branch-page">
      {branch ? (
        <div className="branch-details">
          <h1>{branch.address}</h1>
          <p><strong>טלפון:</strong> {branch.phone}</p>
          <p><strong>שעות פתיחה:</strong> {branch.opening_hours}</p>
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">View on Google Maps</a>

          {/* Show the edit button only if the user is an admin */}
          {role==='admin'  && (
            <button onClick={() => setIsEditPopupOpen(true)}>Edit Branch</button>
          )}
        </div>
      ) : (
        <p>No branch details found.</p>
      )}

      {isEditPopupOpen && (
        <EditBranchPopup
          branch={branch}
          onClose={() => setIsEditPopupOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
