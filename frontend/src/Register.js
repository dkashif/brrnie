import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';
import Button from "./components/Button";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('https://brrnie-1-0.onrender.com/api/auth/register/', {
      email,
      password,
      password2: password,
    });
    console.log('Register response:', response);
    if (response.status === 201) {
      navigate('/'); // Registration successful
    } else {
      setError('Registration failed');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response);
      setError(error.response.data?.detail || 'Registration failed');
    } else {
      console.error('Error:', error);
      setError('Registration failed');
    }
  }
};

  return (
    <div className="login-bg">
      <div className="login-card">
        <p className="brrnie-title">Register</p>
        <form onSubmit={handleRegister}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Button type="submit">Register</Button>
      </form>
        <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default Register;