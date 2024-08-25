import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MenuPage from "./Home/ViewMenu";
import { MenuProvider } from './MenuProvider';
import BranchPage from './Home/BranchPage';
import OrderTypePage from './Home/OrderTypePage'; // Import the new page
import LoginPage from './Login/LoginPage';
import RegistrationPage from './Login/RegistrationPage';

function App() {
  return (
    <MenuProvider>
      <Router>
        <div>
          <Routes>          
            <Route path="/" element={<Navigate to="/branch/1" />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/branch/:branchId" element={<BranchPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/order" element={<OrderTypePage />} /> {/* Add the new route */}
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </MenuProvider>
  );
}

export default App;
