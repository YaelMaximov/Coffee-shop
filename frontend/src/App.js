import './App.css';
import React from "react";
import { AuthProvider } from './AuthProvider';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MenuPage from "./Home/ViewMenu";
import { MenuProvider } from './MenuProvider';
import BranchPage from './Home/BranchPage';
import OrderPage from './Home/OrderPage';
import OrderTypePage from './Home/OrderTypePage';
import LoginPage from './Login/LoginPage';
import RegistrationPage from './Login/RegistrationPage';
import Navbar from './Navbar'; // Import the Navbar component
import PaymentPage from './Home/PaymentPage';
import OrderConfirmationPage from './Home/OrderConfirmationPage';


function App() {
  return (
    <MenuProvider>
        <AuthProvider>
      <Router>
        <div>
          <Navbar /> {/* Navbar will appear on all pages */}
          <Routes>          
            <Route path="/" element={<Navigate to="/branch/1" />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/branch/:branchId" element={<BranchPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orderType" element={<OrderTypePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </MenuProvider>
  );
}

export default App;
