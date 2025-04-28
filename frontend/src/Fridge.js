import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';
import Navbar from "./components/Navbar";
import { refreshAccessToken } from './Login.js';
import fridgyImg from './fridgy2.png';
import petImg from './image0.png';
import plusImg from './add.png';
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
  const [petPressed, setPetPressed] = useState(false);
  
  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/';
  };

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
      setPetText("Hello! Fridge is currently closed... 💤");
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

  const handleDeleteItem = async (itemId) => {
    try {
      let accessToken = Cookies.get('access_token');
      if (!accessToken) {
        accessToken = await refreshAccessToken();
      }
      await axios.delete(`http://localhost:8000/api/inventory/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  // UI for closed fridge
  if (!fridgeOpen) {
    return (
      <div className="fridge-closed-container">
        <Navbar />
        <div className="fridge-open-container">
          <Navbar logout={logout} />
          <img
            src={fridgyImg}
            alt="Fridge"
            className="fridge-image"
            onClick={() => setFridgeOpen(true)}
          />
                    <img
            src={petImg}
            alt="Pet"
            className={`pet-image pet-left ${petHovered ? "pet-hovered" : ""} ${petPressed ? "pet-pressed" : ""}`}
            onMouseEnter={() => setPetHovered(true)}
            onMouseLeave={() => setPetHovered(false)}
            onMouseDown={() => setPetPressed(true)}
            onMouseUp={() => setPetPressed(false)}
            onMouseOut={() => setPetPressed(false)}
            onClick={() => setShowPetConfirm(true)}
            style={{ cursor: 'pointer' }}
          />
          <div className="pet-bubble pet-bubble-closed pet-bubble-left">
            {petText || "Tap the fridge to open me!"}
          </div>
        </div>
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
      <span style={{
        position: 'fixed',
        left: '170px',
        top: 'calc(50% - 60px)',
        background: '#fffbe6',
        color: '#333',
        padding: '6px 14px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        fontSize: '1rem',
        zIndex: 20,
        pointerEvents: 'none',
        opacity: petHovered ? 1 : 0,
        transition: 'opacity 0.2s'
}}>
  Click me!
</span>
      <img
  src={petImg}
  alt="Pet"
  className={`pet-image pet-left ${petHovered ? "pet-hovered" : ""} ${petPressed ? "pet-pressed" : ""}`}
  onMouseEnter={() => setPetHovered(true)}
  onMouseLeave={() => setPetHovered(false)}
  onMouseDown={() => setPetPressed(true)}
  onMouseUp={() => setPetPressed(false)}
  onMouseOut={() => setPetPressed(false)}
  onClick={() => setShowPetConfirm(true)}
  style={{ cursor: 'pointer' }}
/>
    {showPetConfirm ? (
      <div className="pet-bubble pet-bubble-confirm pet-bubble-left">
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
      <div className="pet-bubble pet-bubble-open pet-bubble-left">{petText}</div>
    )}

      <p className="brrnie-title">Fridge</p>
      {error && <p>{error}</p>}

      {/* Scrollable inventory window with delete buttons */}
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        margin: '20px 0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        background: '#fff',
        width: '100%',
        maxWidth: '500px'
      }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              paddingBottom: '6px'
            }}>
              <span>
                {item.name} - {item.quantity} - {item.expiration_date} - {item.category}
              </span>
              <button
                style={{
                  marginLeft: '16px',
                  background: '#db4747',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer'
                }}
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

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
        <button type="submit" className="plus-btn" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <img
            src={plusImg}
            alt="Add"
            style={{ width: '36px', height: '36px', verticalAlign: 'middle' }}
          />
</button>
      </form>
    </div>
  );
}

export default Fridge;