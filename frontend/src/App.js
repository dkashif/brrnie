import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";
import Button from "./components/Button"; // Import the button component
import fridgy from "./fridgy2.png";
import Fridge from './Fridge';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="navbar">
            <Navbar />
          </div>
          <p className="brrnie-title">Brrnie</p>
          <div className="fridge">
            <a href="Fridge"><img src={fridgy} alt="fridge" className="fridge-image" /></a>
          </div>
          <div>
            <Button onClick={() => alert("Button clicked!")}>Open Fridge</Button>
          </div>
          More shit incoming
        </header>
        <Routes>
          <Route path="/fridge" element={<Fridge />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;