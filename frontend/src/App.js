import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MenuPage from "./Home/ViewMenu";
import { MenuProvider } from './MenuProvider'; // וודא שהנתיב נכון
import BranchPage from './Home/BranchPage';


function App() {
  return (
    <MenuProvider>
      <Router>
        <div>
          <Routes>          
            <Route path="/" element={<Navigate to="/branch/1" />} />

          <Route 
              path="/" 
              element={
                  <MenuPage />
              } 
            />
            {/* שאר הנתיבים שלך כאן */}
            <Route path="/branch/:branchId" element={<BranchPage />} />
          </Routes>
        </div>
      </Router>
    </MenuProvider>
  );
}

export default App;
