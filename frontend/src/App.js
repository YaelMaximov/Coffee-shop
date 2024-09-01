// src/App.js
import './App.css';
import React from "react";
import { AuthProvider, useAuth } from './AuthProvider';
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
import AdminMenuPage from './AdminPages/AdminMenuPage';
import AdminOrderPage from './AdminPages/AdminOrderPage';
import AdminBranchEditPage from './AdminPages/AdminBranchEditPage';

function App() {
  const { user } = useAuth(); // Access the user from the auth context

  return (
    <MenuProvider>
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
              
              <Route path="/admin/branch-edit/:branchId" element={<BranchPage />} />
              <Route path="/admin/orders" element={<AdminOrderPage />} />
              <Route path="/admin/menu" element={<AdminMenuPage />} />
               

              {/* Redirect to client mode if user is not admin */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
    </MenuProvider>
  );
}

export default App;
