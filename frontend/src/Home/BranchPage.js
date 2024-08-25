import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BranchPage.css';

export default function BranchPage() {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Get the navigate function

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

  return (
    <div className="branch-page">
      {branch ? (
        <>
          <h1>{branch.address}</h1>
          <p><strong>Phone:</strong> {branch.phone}</p>
          <p><strong>Opening Hours:</strong> {branch.opening_hours}</p>
          <a href={branch.google_maps_link} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
          <div className="button-group">
            <button onClick={() => navigate('/menu')}>View Menu</button>
            <button onClick={() => navigate('/orderType')}>Place an Order</button>
            <button onClick={() => navigate('/contact')}>Contact Us</button>          
          </div>
          <button onClick={() => navigate('/login')}>התחברות</button>
          </>
      ) : (
        <p>No branch details found.</p>
      )}
    </div>
  );
}
