import { getAuthHeaders } from '../../auth/services/authService';

const API_BASE_URL = 'http://localhost:8090/api/claims';

// Customer Claims Functions

// Submit a new claim (Customer only)
export const submitClaim = async (claimData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(claimData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit claim');
    }

    return await response.json();
    
  } catch (error) {
    console.error('Submit claim error:', error);
    throw error;
  }
};

// Get claim details by ID (Role-based access)
export const getClaimById = async (claimId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${claimId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch claim details');
    }

    return await response.json();
  } catch (error) {
    console.error('Get claim by ID error:', error);
    throw error;
  }
};

// Get all claims (Role-based: Admin sees all, Customer sees own)
export const getAllClaims = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch claims');
    }

    return await response.json();
  } catch (error) {
    console.error('Get all claims error:', error);
    throw error;
  }
};

// Admin Claims Management Functions

// Update claim status (Admin only)
export const updateClaimStatus = async (claimId, statusData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${claimId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update claim status');
    }

    return await response.json();
  } catch (error) {
    console.error('Update claim status error:', error);
    throw error;
  }
};

// Get claims by status (Admin only)
export const getClaimsByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${status}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch claims with status: ${status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get claims by status error:', error);
    throw error;
  }
};

// Utility Functions

// Validate claim submission data
export const validateClaimData = (claimData) => {
  const errors = [];
  
  if (!claimData.policyEnrollmentId) {
    errors.push('Policy enrollment ID is required');
  }
  
  if (!claimData.claimAmount || claimData.claimAmount <= 0) {
    errors.push('Claim amount must be positive');
  }
  
  if (claimData.claimDescription && claimData.claimDescription.length > 1000) {
    errors.push('Claim description cannot exceed 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format claim data for display
export const formatClaimForDisplay = (claim) => {
  if (!claim) {
    console.warn('formatClaimForDisplay: claim is null or undefined');
    return {};
  }
  

  
  return {
    claimId: claim.claimId || claim.id,
    policyEnrollmentId: claim.policyEnrollmentId,
    // Use actual API field names as primary
    policyNumber: claim.generatedPolicyNumber || claim.policyNumber || `POL-${claim.policyEnrollmentId}`,
    customerName: claim.customerUsername || claim.customerName || claim.customer?.name || 'Unknown Customer',
    customerId: claim.customerUsername || claim.customerId || claim.customerEmail || 'Unknown ID',
    claimAmount: claim.claimAmount || 0,
    claimDescription: claim.claimDescription || '',
    status: claim.claimStatus || claim.status || 'OPEN',
    // Use actual API field names as primary
    submittedDate: claim.claimDate || claim.submittedDate || claim.createdDate,
    processedDate: claim.processedDate || claim.updatedDate,
    settledDate: claim.settledDate,
    adminNotes: claim.adminNotes || '',
    // Add additional fields from actual API response
    customerEmail: claim.customerEmail || '',
    adminUsername: claim.adminUsername || ''
  };
};

// Get status badge style for UI
export const getClaimStatusBadge = (status) => {
  const styles = {
    // Actual backend statuses
    OPEN: { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #bbdefb' },
    APPROVED: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    REJECTED: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    // Legacy status support
    SUBMITTED: { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #bbdefb' },
    PENDING: { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #bbdefb' },
    UNDER_REVIEW: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' },
    SETTLED: { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' },
    CANCELLED: { backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }
  };
  
  return {
    ...styles[status] || styles.OPEN,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  };
};

// Format currency for display
export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format date for display
export const formatClaimDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get available status transitions
export const getAvailableStatusTransitions = (currentStatus) => {
  // Based on actual backend enum: [OPEN, REJECTED, APPROVED]
  const transitions = {
    'OPEN': ['APPROVED', 'REJECTED'], // Open claims can be approved or rejected
    'APPROVED': [], // Final state - no further transitions
    'REJECTED': [], // Final state - no further transitions
    // Legacy mappings for consistency
    'SUBMITTED': ['APPROVED', 'REJECTED'], // Same as OPEN
    'PENDING': ['APPROVED', 'REJECTED'] // Same as OPEN
  };
  
  // Normalize the current status
  const normalizedStatus = currentStatus ? currentStatus.toString().toUpperCase().trim() : '';
  
  return transitions[normalizedStatus] || [];
};

// Check if status is final (no more transitions allowed)
export const isStatusFinal = (status) => {
  // Based on actual backend enum: [OPEN, REJECTED, APPROVED]
  return ['REJECTED', 'APPROVED'].includes(status);
};
