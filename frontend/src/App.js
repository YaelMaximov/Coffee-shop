import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./Home/ViewMenu";
import { MenuProvider } from './MenuProvider'; // וודא שהנתיב נכון


function App() {
  return (
    <MenuProvider>
      <Router>
        <div>
          <Routes>
            <Route 
              path="/" 
              element={
                  <MenuPage />
              } 
            />
            {/* שאר הנתיבים שלך כאן */}
          </Routes>
        </div>
      </Router>
    </MenuProvider>
  );
}

export default App;