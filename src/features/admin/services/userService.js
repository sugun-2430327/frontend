import { getAuthHeaders } from '../../auth/services/authService';

const API_BASE_URL = 'http://localhost:8090/api/users';

// Customer Functions

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user profile error:', error);
    throw error;
  }
};

// Admin Functions

// Get all users with detailed information
export const getAllUsersDetailed = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/detailed`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get all users detailed error:', error);
    throw error;
  }
};

// Get user details by ID
export const getUserDetailsById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/detailed/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user details by ID error:', error);
    throw error;
  }
};

// Get all customers with detailed information
export const getAllCustomersDetailed = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/detailed`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get all customers detailed error:', error);
    throw error;
  }
};

// Utility Functions

// Format user data for display
export const formatUserForDisplay = (user) => {
  if (!user) {
    console.warn('formatUserForDisplay: user is null or undefined');
    return {};
  }
  
  return {
    userId: user.userId || user.id,
    username: user.username || '',
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    role: user.role || 'CUSTOMER',
    incomePerAnnum: user.incomePerAnnum || 0,
    idProofFilePath: user.idProofFilePath || null
  };
};

// Get user role badge style
export const getUserRoleBadge = (role) => {
  const styles = {
    ADMIN: { backgroundColor: '#dc3545', color: 'white', border: '1px solid #dc3545' },
    CUSTOMER: { backgroundColor: '#007bff', color: 'white', border: '1px solid #007bff' }
  };
  
  return {
    ...styles[role] || styles.CUSTOMER,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  };
};

// Format currency for display
export const formatIncome = (income) => {
  if (!income || income === 0) return '—';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(income);
};

// Get ID proof file type icon
export const getIdProofFileIcon = (filePath) => {
  if (!filePath) return '📄';
  
  const extension = filePath.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return '📋';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return '🖼️';
    default:
      return '📄';
  }
};

// Get ID proof filename from path
export const getIdProofFilename = (filePath) => {
  if (!filePath) return 'No ID proof uploaded';
  
  return filePath.split('/').pop() || 'Unknown file';
};

// Validate user data
export const validateUserData = (userData) => {
  const errors = [];
  
  if (!userData.username || userData.username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  if (!userData.email || userData.email.trim().length === 0) {
    errors.push('Email is required');
  }
  
  if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
    errors.push('Email format is invalid');
  }
  
  if (!userData.role || !['CUSTOMER', 'ADMIN'].includes(userData.role)) {
    errors.push('Valid role is required');
  }
  
  if (userData.incomePerAnnum && userData.incomePerAnnum < 0) {
    errors.push('Income cannot be negative');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Check if user has admin role
export const isAdmin = (user) => {
  return user && user.role === 'ADMIN';
};

// Check if user has customer role
export const isCustomer = (user) => {
  return user && user.role === 'CUSTOMER';
};

// Get user display name
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  
  // Prefer first name + last name if available
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  
  // Fallback to username or email
  return user.username || user.email || 'Unknown User';
};

// Get user avatar placeholder
export const getUserAvatarPlaceholder = (user) => {
  if (!user || !user.username) return '👤';
  return user.username.charAt(0).toUpperCase();
};
