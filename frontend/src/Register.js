import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Button from "./components/Button"; // Import the button component

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register/', {
        username,
        password,
        password2: password,
      });
      navigate('/'); // Redirect to login page after registration
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <p className="brrnie-title">Register</p>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;