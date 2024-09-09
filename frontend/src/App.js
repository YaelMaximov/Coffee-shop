import './App.css';
import React from "react";
import { AuthProvider } from './AuthProvider';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MenuPage from "./Home/ViewMenu";
import { MenuProvider } from './MenuProvider';
import { OrderProvider } from './OrderProvider';
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
import PrivateRoute from './PrivateRoutes'; // Import the PrivateRoute component
import MyOrderPage from './Home/MyOrderPage';
import Footer from './Footer'; // Import the Footer component

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <OrderProvider>
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
                {/* customer routes */}
                <Route path="/order" element={<PrivateRoute element={OrderPage} requiredRole="customer" />} />
                <Route path="/payment" element={<PrivateRoute element={PaymentPage} requiredRole="customer" />} />
                <Route path="/order-confirmation" element={<PrivateRoute element={OrderConfirmationPage} requiredRole="customer" />} />
                <Route path="/myOrder" element={<PrivateRoute element={MyOrderPage} requiredRole="customer" />} />
                {/* admin routes */}
                <Route path="/admin/branch-edit/:branchId" element={<PrivateRoute element={AdminBranchEditPage} requiredRole="admin" />} />
                <Route path="/admin/orders" element={<PrivateRoute element={AdminOrderPage} requiredRole="admin" />} />
                <Route path="/admin/menu" element={<PrivateRoute element={AdminMenuPage} requiredRole="admin" />} />
                {/* Redirect to home if no matching route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </OrderProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
