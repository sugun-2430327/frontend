const API_BASE_URL = 'http://localhost:8090/api/auth';

// Login service
export const loginUser = async (usernameOrEmail, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernameOrEmail,
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage (consider using httpOnly cookies in production)
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userRole', data.role.toLowerCase()); // Normalize role to lowercase
    localStorage.setItem('userId', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('userEmail', data.email);
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
};

// Register service (multipart form for file upload)
export const registerUser = async (userData, idProofFile = null) => {
  try {
    const formData = new FormData();
    formData.append('firstName', userData.firstName || '');
    formData.append('lastName', userData.lastName || '');
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('email', userData.email);
    formData.append('role', userData.role || 'CUSTOMER');
    
    if (userData.incomePerAnnum) {
      formData.append('incomePerAnnum', userData.incomePerAnnum);
    }
    
    if (idProofFile) {
      formData.append('idProof', idProofFile);
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
    }

    const result = await response.text();
    return { success: true, message: result };
  } catch (error) {
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

// Register service (JSON only - no file upload)
export const registerUserJSON = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username,
        password: userData.password,
        email: userData.email,
        role: userData.role || 'CUSTOMER',
        incomePerAnnum: userData.incomePerAnnum || null
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
    }

    const result = await response.text();
    return { success: true, message: result };
  } catch (error) {
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

// Get stored user data
export const getStoredUser = () => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const id = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('userEmail');

  if (token && role && username) {
    return {
      token,
      role,
      id,
      username,
      email,
      name: username // For compatibility with existing code
    };
  }
  return null;
};

// Logout service
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userEmail');
};

// Get auth token for API calls
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Create authorization header
export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getStoredUser();
  return !!(token && user);
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getStoredUser();
  return user && user.role === role;
};

// Get user's current route based on role
export const getUserDashboardRoute = () => {
  const user = getStoredUser();
  if (!user) return '/';
  
  switch (user.role) {
    case 'customer':
      return '/dashboard/customer';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/';
  }
};
