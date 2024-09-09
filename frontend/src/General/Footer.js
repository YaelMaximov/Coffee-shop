// Footer.js
import React from 'react';
import './Footer.css'; // Optional, if you want to add specific styles for the footer.

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} - כל הזכויות שמורות - קפה הפוך </p>
      </div>
    </footer>
  );
}

export default Footer;
