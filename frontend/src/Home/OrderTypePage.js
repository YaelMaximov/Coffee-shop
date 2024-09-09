import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider';
import { OrderContext } from '../Providers/OrderProvider';
import './OrderTypePage.css';
import takeAwayIcon from '../Pictures/take-away.png';
import deliveryIcon from '../Pictures/delivery.png'; 
import LoginPage from '../Login/LoginPage';

export default function OrderTypePage() {
  const [orderType, setOrderType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState([]); // Define branches state
  const [error, setError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
 // const { user } = useAuth();
  const user = localStorage.getItem('username');

  const { order, updateOrder, clearOrder } = useContext(OrderContext); // Use OrderContext

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:3010/public/getAllBranches');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBranches(data); // Set branches with fetched data
        const defaultBranch = data.find(b => b.id === 1);
        if (defaultBranch) {
          setBranch(defaultBranch.id);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Unable to load branches');
      }
    };
    fetchBranches();
    clearOrder();
  }, []);

  const isValidAddressFormat = (address) => {
    // ביטוי רגולרי שיבדוק אם הכתובת מכילה מחרוזת, מספר, ו"ירושלים" בסוף
    const regex = /^[A-Za-zא-ת\s]+ \d+ ירושלים$/;
    return regex.test(address);
  };  

  const handleContinue = async () => {
    if (orderType === 'delivery') {
      // בדוק אם הכתובת בפורמט הנכון
      if (!isValidAddressFormat(address)) {
        setError('אנא הכנס כתובת בפורמט הנכון - רחוב,מספר ועיר');
        return;
      }
  
      const addressParts = address.split(' ');
      const cityInAddress = addressParts[addressParts.length - 1]; // העיר היא החלק האחרון
      const houseNumber = addressParts[addressParts.length - 2]; // המספר לפני העיר
      const street = addressParts.slice(0, addressParts.length - 2).join(' '); // כל מה שלפני המספר הוא הרחוב
  
      try {
        // שלח את הכתובת לשרת ותקבל בחזרה את ה-address_id
        const response = await fetch('http://localhost:3010/public/createAddress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            street,
            house_number: houseNumber,
            city: 'ירושלים',
            apartment: '', // ניתן להוסיף אופציות נוספות
            entrance: '',
            floor: '',
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save address');
        }
  
        const { address_id } = await response.json();
  
        // עדכן את ההזמנה עם סוג ההזמנה וכתובת
        updateOrder({ ...order, orderType, address_id });
      } catch (err) {
        setError('Error saving the address');
        console.error(err);
        return;
      }
    } else if (orderType === 'pickup') {
      if (branch === '') {
        setError('אנא בחר סניף מתוך הרשימה');
        return;
      }
      updateOrder({ ...order, orderType, branch });
    }
  
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
  
    navigate('/order');
  };
  
  
  
  // Utility function to parse address
  const parseAddress = (address) => {
    const addressParts = address.split(' ');
    const city = addressParts[addressParts.length - 1]; // ירושלים תמיד תהיה בסוף
    const houseNumber = addressParts[addressParts.length - 2]; // מספר בית לפני העיר
    const street = addressParts.slice(0, addressParts.length - 2).join(' '); // כל השאר הוא הרחוב
    return [street, houseNumber, city];
  };
  
  

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
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
                <option key={branch.branch_id} value={branch.branch_id}>
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

      {isLoginOpen && <LoginPage onClose={() => setIsLoginOpen(false)} />}

      <div className="image-section">
        <img src="https://parischezsharon.com/wp-content/uploads/2022/04/Paris-chez-Sharon-post-15.jpg" alt="Order Type" />
      </div>
    </div>
  );
}
