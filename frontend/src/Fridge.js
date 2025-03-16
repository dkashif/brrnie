import React from 'react';
import './App.css';
import Navbar from "./components/Navbar";

function Fridge() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="navbar">
          <Navbar />
        </div>
        <p className="brrnie-title">Fridge</p>
        {/* Add more content for the Fridge component here */}
      </header>
    </div>
  );
}

export default Fridge;