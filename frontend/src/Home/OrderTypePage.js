import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import './OrderTypePage.css';
import takeAwayIcon from './take-away.png'; 
import deliveryIcon from './delivery.png'; 
import LoginPage from '../Login/LoginPage'; // ייבוא של עמוד ההתחברות

export default function OrderTypePage() {
  const [orderType, setOrderType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false); // ניהול מצב פתיחה של הפופאפ
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:3010/branch/getAll');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (Array.isArray(data)) {
          setBranches(data);
          
          const defaultBranch = data.find(b => b.id === 1);
          if (defaultBranch) {
            setBranch(defaultBranch.id);
          }
        } else {
          setError('Unexpected data format from API');
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Unable to load branches');
      }
    };
  
    fetchBranches();
  }, []);

  const handleContinue = () => {
    
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder')) || {};

    if (orderType === 'delivery') {
        const addressParts = address.split(' ').filter(part => part.trim() !== '');
        const cityInAddress = addressParts.length > 1 ? addressParts[addressParts.length - 1] : '';

        if (cityInAddress !== 'ירושלים') {
            setError('אין משלוחים לאזורך.');
            return;
        }

        if (addressParts.length < 3) {
            setError('נא לוודא שהזנת רחוב, מספר בית ועיר.');
            return;
        }

        currentOrder.orderType = orderType;
        currentOrder.address = address;
    } else if (orderType === 'pickup') {
        if (branch === '') {
            setError('אנא בחר סניף מתוך הרשימה');
            return;
        }
        currentOrder.orderType = orderType;
        currentOrder.branch = branch;
    }
    
    localStorage.setItem('currentOrder', JSON.stringify(currentOrder));

    if (!user) {
      setIsLoginOpen(true); // פתיחת פופאפ ההתחברות אם המשתמש לא מחובר
      return;
  }

    navigate('/order');
};

  
  
  
  const handleCloseLogin = () => {
    setIsLoginOpen(false); // פונקציית סגירה לפופאפ ההתחברות
  };

  return (
    <div className="order-type-page">
  
      <div className="form-section">
        <h1>בחירת סוג הזמנה</h1>
        <div className="order-options">
          <button
            className={orderType === 'delivery' ? 'selected' : ''}
            onClick={() => setOrderType('delivery')}
          >
            <img src={deliveryIcon} alt="Delivery Icon" />
            משלוח
          </button>
          <button
            className={orderType === 'pickup' ? 'selected' : ''}
            onClick={() => setOrderType('pickup')}
          >
            <img src={takeAwayIcon} alt="Take Away Icon" />
            איסוף עצמי
          </button>
        </div>

        {orderType === 'delivery' && (
          <div className="delivery-form">
            <h2>הכנס כתובת מלאה למשלוח</h2>
            <input
              type="text"
              placeholder="רחוב, מספר ועיר"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setCity(e.target.value.split(', ').pop());
              }}
            />
          </div>
        )}

        {orderType === 'pickup' && (
          <div className="pickup-form">
            <h2>בחירת סניף</h2>
            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
              <option value="">בחר סניף מהרשימה..</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button className="continue-button" onClick={handleContinue}>
          המשך
        </button>
      </div>

      {/* הצגת הפופאפ עם פונקציית הסגירה */}
      {isLoginOpen && <LoginPage onClose={handleCloseLogin} />}

      <div className="image-section">
        <img src="https://parischezsharon.com/wp-content/uploads/2022/04/Paris-chez-Sharon-post-15.jpg" alt="Order Type" />
      </div>

    </div>
  );
}
