import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BranchPage.css';

export default function BranchPage() {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`http://localhost:3010/branch/getBranch/${branchId}`);
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
        </div>
      ) : (
        <p>No branch details found.</p>
      )}
    </div>
  );
}
