import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register({ onRegister }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [incomePerAnnum, setIncomePerAnnum] = useState('');
  const [idProofFile, setIdProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!firstName || firstName.length < 2 || firstName.length > 50) {
      setError('First name must be 2-50 characters long');
      setLoading(false);
      return;
    }
    
    if (!lastName || lastName.length < 2 || lastName.length > 50) {
      setError('Last name must be 2-50 characters long');
      setLoading(false);
      return;
    }
    
    if (!username || username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters long');
      setLoading(false);
      return;
    }
    
    if (!password || password.length < 6 || password.length > 40) {
      setError('Password must be 6-40 characters long');
      setLoading(false);
      return;
    }
    
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    try {
      const userData = {
        firstName,
        lastName,
        username,
        password,
        email,
        role,
        incomePerAnnum: incomePerAnnum ? parseFloat(incomePerAnnum) : null
      };
      
      const result = await registerUser(userData, idProofFile);
      setSuccess(result.message);
      
      // Navigate to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
      <h2>Register</h2>
      
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      {success && <div className="success-message" style={{color: 'green', marginBottom: '10px'}}>{success}</div>}
      
      <input 
        type="text" 
        placeholder="First Name (2-50 characters)" 
        value={firstName} 
        onChange={(e) => setFirstName(e.target.value)} 
        required 
        minLength={2}
        maxLength={50}
      />
      
      <input 
        type="text" 
        placeholder="Last Name (2-50 characters)" 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} 
        required 
        minLength={2}
        maxLength={50}
      />
      
      <input 
        type="text" 
        placeholder="Username (3-20 characters)" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required 
        minLength={3}
        maxLength={20}
      />
      
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      
      <input 
        type="password" 
        placeholder="Password (6-40 characters)" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        minLength={6}
        maxLength={40}
      />
      
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>
         
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      
      <p className="login-link" style={{marginTop: '15px', textAlign: 'center'}}>
        Already have an account? <span onClick={() => navigate('/login')} style={{color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>Login here</span>
      </p>
    </form>
  );
}

export default Register;


