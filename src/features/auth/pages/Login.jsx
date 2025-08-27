import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await loginUser(usernameOrEmail, password);
      
      // Call parent component's onLogin with the user data
      onLogin({
        name: userData.username,
        role: userData.role.toLowerCase(),
        id: userData.id,
        email: userData.email,
        token: userData.token
      });
      
      // Navigate based on role (API returns uppercase, but we store lowercase)
      const normalizedRole = userData.role.toLowerCase();
      if (normalizedRole === 'customer') {
        navigate('/dashboard/customer');
      } else if (normalizedRole === 'admin') {
        navigate('/dashboard/admin');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <input 
        type="text" 
        placeholder="Username or Email" 
        value={usernameOrEmail} 
        onChange={(e) => setUsernameOrEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p className="signup-link">
        New user? <span onClick={() => navigate('/register')}>Sign up here</span>
      </p>
    </form>
     
      </>
  );
}

export default Login;
