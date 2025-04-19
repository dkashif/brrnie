import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';
import Navbar from "./components/Navbar";
import { refreshAccessToken } from './Login.js';
import fridgyImg from './fridgy2.png';
import petImg from './image0.png';

function Fridge() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiration_date: '',
    category: 'OT',
  });
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [petText, setPetText] = useState('');
  const [showPetConfirm, setShowPetConfirm] = useState(false);
  const [petHovered, setPetHovered] = useState(false);

  useEffect(() => {
    if (fridgeOpen) {
      setPetText("Yay! You opened the fridge! 🍎");
      const fetchData = async () => {
        try {
          let accessToken = Cookies.get('access_token');
          if (!accessToken) {
            accessToken = await refreshAccessToken();
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
    } else {
      setPetText("Bye! Closing the fridge... 💤");
    }
  }, [fridgeOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      let accessToken = Cookies.get('access_token');
      if (!accessToken) {
        accessToken = await refreshAccessToken();
      }
      const response = await axios.post('http://localhost:8000/api/inventory/', newItem, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setItems((prev) => [...prev, response.data]);
      setNewItem({ name: '', quantity: '', expiration_date: '', category: 'OT' });
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to add item');
    }
  };

  // UI for closed fridge
  // ...existing code...

// UI for closed fridge
if (!fridgeOpen) {
  return (
    <div className="fridge-closed-container">
      <Navbar />
      <img
        src={fridgyImg}
        alt="Fridge"
        className="fridge-image"
        onClick={() => setFridgeOpen(true)}
      />
      <img
        src={petImg}
        alt="Pet"
        className="pet-image pet-left"
      />
      <div className="pet-bubble pet-bubble-closed">{petText || "Tap the fridge to open me!"}</div>
    </div>
  );
}

// UI for open fridge
return (
  <div className="fridge-open-container">
    <Navbar />
    <button className="close-fridge-btn" onClick={() => setFridgeOpen(false)}>
      Close Fridge
    </button>
    <img
      src={petImg}
      alt="Pet"
      className={`pet-image pet-right ${petHovered ? "pet-hovered" : ""}`}
      onMouseEnter={() => setPetHovered(true)}
      onMouseLeave={() => setPetHovered(false)}
      onClick={() => setShowPetConfirm(true)}
      style={{ cursor: 'pointer' }}
    />
    {showPetConfirm ? (
      <div className="pet-bubble pet-bubble-confirm pet-bubble-right">
        Do you wanna close the fridge?
        <br />
        <button
          className="pet-confirm-btn"
          onClick={() => {
            setShowPetConfirm(false);
            setFridgeOpen(false);
          }}
        >
          Yes
        </button>
        <button
          className="pet-confirm-btn"
          onClick={() => setShowPetConfirm(false)}
          style={{ marginLeft: 8 }}
        >
          No
        </button>
      </div>
    ) : (
      <div className="pet-bubble pet-bubble-open pet-bubble-right">{petText}</div>
    )}

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
    </div>
  );
}

export default Fridge;