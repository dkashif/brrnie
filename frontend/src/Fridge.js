import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';
import Navbar from "./components/Navbar";

function Fridge() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        const response = await axios.get('http://localhost:8000/api/inventory/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        setError('Failed to fetch fridge items');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="navbar">
          <Navbar />
        </div>
        <p className="brrnie-title">Fridge</p>
        {error && <p>{error}</p>}
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Fridge;