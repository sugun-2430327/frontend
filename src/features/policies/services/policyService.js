import { getAuthHeaders } from '../../auth/services/authService';

const API_BASE_URL = 'http://localhost:8090/api/policies';

// Admin Policy Management Functions

// Create a new policy template (Admin only)
export const createPolicy = async (policyData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(policyData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create policy');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to create policy');
  }
};

// Update existing policy template (Admin only)
export const updatePolicy = async (policyId, policyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(policyData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update policy');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to update policy');
  }
};

// Delete policy (Admin only)
export const deletePolicy = async (policyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete policy');
    }

    return await response.text();
  } catch (error) {
    throw new Error(error.message || 'Failed to delete policy');
  }
};

// Protected Policy Functions (Admin sees all, Customer sees own)

// Get all policies (role-based access)
export const getAllPolicies = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch policies');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch policies');
  }
};

// Get policy by ID (role-based access)
export const getPolicyById = async (policyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch policy');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch policy');
  }
};

// Get policy by policy number (role-based access)
export const getPolicyByNumber = async (policyNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/number/${policyNumber}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch policy');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch policy');
  }
};

// Public Policy Template Functions (No authentication required)

// Get all public policy templates
export const getPublicPolicyTemplates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch policy templates');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch policy templates');
  }
};

// Get public policy template by ID
export const getPublicPolicyById = async (policyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/${policyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch policy template');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch policy template');
  }
};

// Get public policy template by policy number
export const getPublicPolicyByNumber = async (policyNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/number/${policyNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch policy template');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch policy template');
  }
};

// Utility functions for policy data transformation
export const transformPolicyForAPI = (policyData) => {
  return {
    policyNumber: policyData.policyNumber,
    vehicleDetails: policyData.vehicleDetails,
    coverageAmount: parseFloat(policyData.coverageAmount),
    coverageType: policyData.coverageType,
    premiumAmount: parseFloat(policyData.premiumAmount),
    startDate: policyData.startDate,
    endDate: policyData.endDate,
    policyStatus: policyData.policyStatus || 'ACTIVE',
    policyHolderId: policyData.policyHolderId || null
  };
};

export const formatPolicyForDisplay = (policy) => {
  return {
    ...policy,
    coverageAmount: `₹${policy.coverageAmount?.toLocaleString('en-IN')}`,
    premiumAmount: `₹${policy.premiumAmount?.toLocaleString('en-IN')}`,
    startDate: new Date(policy.startDate).toLocaleDateString('en-IN'),
    endDate: new Date(policy.endDate).toLocaleDateString('en-IN')
  };
};
