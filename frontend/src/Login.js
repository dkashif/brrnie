import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';
import Button from "./components/Button"; // Import the button component
export const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh_token');
    const response = await axios.post('https://brrnie-1-0.onrender.com/api/auth/token/refresh/', {
      refresh: refreshToken,
    });
    const { access } = response.data;
    Cookies.set('access_token', access, { expires: 1 }); // Update the access token
    return access;
  } catch (error) {
    console.error('Failed to refresh access token');
    return null;
  }
};
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://brrnie-1-0.onrender.com/api/auth/login/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      Cookies.set('access_token', access, { expires: 1 }); // Store access token in cookies
      Cookies.set('refresh_token', refresh, { expires: 7 }); // Store refresh token in cookies
      navigate('/fridge'); // Redirect to the fridge page
    } catch (error) {
      setError('Invalid username or password');
    }
  };
  

  return (
    <div className="login-bg">
    <div className="login-card">
      <p className="brrnie-title">Brrnie</p>
      <form onSubmit={handleLogin}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
      {error && <p className="login-error">{error}</p>}
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  </div>
  );
}

export default Login;