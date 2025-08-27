// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import Login from './components/Login';
// import CustomerDashboard from './components/CustomerDashboard';
// import Home from './components/Home';
// import './index.css';

// function App() {
//   const [user, setUser] = useState(null); // { name, role }

//   const handleLogin = (credentials) => {
//     // Simulated login logic
//     const { identifier, password, role } = credentials;
//     if ((identifier === 'customer@example.com' || identifier === 'customer') && password === '1234' && role === 'customer') {
//       setUser({ name: 'Customer', role: 'customer' });
//     } else if ((identifier === 'admin@example.com' || identifier === 'admin') && password === 'admin' && role === 'admin') {
//       setUser({ name: 'Admin', role: 'admin' });
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   const handleLogout = () => setUser(null);

//   return (
//     <div>
//       <Navbar user={user} onLogout={handleLogout} />
//       {!user ? <Home /> : user.role === 'customer' ? <CustomerDashboard user={user} /> : <div>Admin Dashboard Coming Soon</div>}
//       {!user && <Login onLogin={handleLogin} />}

//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import CustomerDashboard from '../features/dashboard/CustomerDashboard';
import Home from '../features/public-pages/components/Home';
import AdminDashboard from '../features/admin/AdminDashboard';
import { getStoredUser, logoutUser, isAuthenticated, getUserDashboardRoute } from '../features/auth/services/authService';
import Profile from '../features/dashboard/components/Profile';
import '../shared/styles/index.css';
import './App.css';
import About from '../features/public-pages/components/About';
import Services from '../features/public-pages/components/Services';
import Contact from '../features/public-pages/components/Contact';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored authentication on app load and redirect if needed
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Redirect authenticated users from home/login pages to their dashboard
  useEffect(() => {
    if (user && !loading) {
      const currentPath = window.location.pathname;
      const correctDashboard = getUserDashboardRoute();
      
      // Small delay to prevent flash of blank content
      setTimeout(() => {
        // Redirect from home/login/register to dashboard
        if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
          navigate(correctDashboard, { replace: true });
        }
        // Redirect from wrong dashboard to correct one
        else if (currentPath === '/dashboard/customer' && user.role !== 'customer') {
          navigate(correctDashboard, { replace: true });
        }
        else if (currentPath === '/dashboard/admin' && user.role !== 'admin') {
          navigate(correctDashboard, { replace: true });
        }
      }, 100);
    }
  }, [user, loading, navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={
          user ? (
            loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div>Loading...</div>
              </div>
            ) : null
          ) : (
            <Home />
          )
        } />
        
        <Route path="/login" element={
          !user ? (
            <Login onLogin={(userData) => {
              handleLogin(userData);
              setTimeout(() => {
                const dashboardRoute = getUserDashboardRoute();
                navigate(dashboardRoute, { replace: true });
              }, 100);
            }} />
          ) : (
            loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div>Loading...</div>
              </div>
            ) : null
          )
        } />
        
        <Route path="/register" element={
          !user ? (
            <Register onRegister={(userData) => {
              handleLogin(userData);
              setTimeout(() => {
                const dashboardRoute = getUserDashboardRoute();
                navigate(dashboardRoute, { replace: true });
              }, 100);
            }} />
          ) : (
            loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div>Loading...</div>
              </div>
            ) : null
          )
        } />
        
        <Route path="/dashboard/customer" element={
          user && user.role === 'customer' ? (
            <CustomerDashboard user={user} />
          ) : (
            user && user.role !== 'customer' ? null : (
              // Not logged in, show login message
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div>Please log in to access dashboard.</div>
              </div>
            )
          )
        } />

        <Route path="/dashboard/admin" element={
          user && user.role === 'admin' ? (
            <AdminDashboard user={user} />
          ) : (
            user && user.role !== 'admin' ? null : (
              // Not logged in, show login message
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div>Please log in to access dashboard.</div>
              </div>
            )
          )
        } />
        <Route path="/customer/profile" element={<Profile/>} />
        <Route path="/admin/profile" element={<Profile/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/contact" element={<Contact/>} />
          

      </Routes>
    </div>
  );
}

export default App;
