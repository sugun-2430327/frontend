import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle click outside and escape key to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setDropdown(false);
      }
    };

    // Only add event listeners if dropdown is open
    if (dropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [dropdown]);

  const handleDashboardClick = () => {
    setDropdown(false); // Close dropdown when clicking dashboard
    if (user?.role === 'customer') {
      navigate('/dashboard/customer');
    } else if (user?.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/'); // fallback route
    }
  };

  const handleProfileclick = () => {
    setDropdown(false); // Close dropdown when clicking profile
    if (user?.role === 'customer') {
      navigate('/customer/profile');
    } else if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else {
      navigate('/'); // fallback route
    }
  };

  const handleLogout = () => {
    setDropdown(false); // Close dropdown when logging out
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/home')}>Secure Shield</div>
      {user ? (
        <div className="nav-user" ref={dropdownRef}>
          {/* <span>Welcome, {user.name}</span> */}
          <div className="profile" onClick={() => setDropdown(!dropdown)}>👤</div>
          {dropdown && (
            <div className="dropdown">
              <div onClick={handleProfileclick}>My Profile</div>
              <div onClick={handleDashboardClick}>Dashboard</div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-auth">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/about')}>About</button>
          <button onClick={() => navigate('/services')}>Services</button>
          <button onClick={() => navigate('/contact')}>Contact</button>
          <button onClick={() => navigate('/login')}>Login/Signup</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

