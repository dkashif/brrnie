import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';
import Navbar from "./components/Navbar";
import { refreshAccessToken } from './Login.js';

function Fridge() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiration_date: '',
    category: 'OT', // Default category
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let accessToken = Cookies.get('access_token');
        if (!accessToken) {
          accessToken = await refreshAccessToken(); // Refresh the token if it's missing or expired
        }
        const response = await axios.get('http://localhost:8000/api/inventory/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        setError(error.response?.data?.detail || 'Failed to fetch fridge items');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };
  

  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log('New Item:', newItem); // Log the new item data
    try {
      let accessToken = Cookies.get('access_token');
      if (!accessToken) {
        accessToken = await refreshAccessToken(); // Refresh the token if it's missing or expired
      }
      const response = await axios.post('http://localhost:8000/api/inventory/', newItem, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setItems((prev) => [...prev, response.data]); // Add the new item to the list
      setNewItem({ name: '', quantity: '', expiration_date: '', category: 'OT' }); // Reset the form
    } catch (error) {
      console.error('Error adding item:', error.response?.data || error.message);
      setError(error.response?.data?.detail || 'Failed to add item');
    }
  };

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
            <li key={item.id}>
              {item.name} - {item.quantity} - {item.expiration_date} - {item.category}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddItem}>
          <h3>Add New Item</h3>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Expiration Date:</label>
            <input
              type="date"
              name="expiration_date"
              value={newItem.expiration_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <select
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              required
            >
              <option value="PR">Produce</option>
              <option value="GR">Grains</option>
              <option value="DR">Dairy</option>
              <option value="MS">Meat/Seafood</option>
              <option value="DM">Deli Meats</option>
              <option value="PF">Prepared Foods</option>
              <option value="BE">Beverages</option>
              <option value="CO">Condiments</option>
              <option value="EG">Eggs</option>
              <option value="OT">Other</option>
            </select>
          </div>
          <button type="submit">Add Item</button>
        </form>
      </header>
    </div>
  );
}

export default Fridge;