import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";
import Fridge from './Fridge';
import Login from './Login'; // Import the Login component
import Register from './Register'; // Import the Register component

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="navbar">
            <Navbar />
          </div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/fridge" element={<Fridge />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;