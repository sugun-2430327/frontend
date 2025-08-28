import { getAuthHeaders } from '../../auth/services/authService';

const API_BASE_URL = 'http://localhost:8090/api/enrollments';

// Customer Enrollment Functions

// Enroll in a policy template
export const enrollInPolicyTemplate = async (policyTemplateId, vehicleDetails = '') => {
  try {
    // Prepare enrollment data including vehicle details
    const enrollmentData = {
      vehicleDetails: vehicleDetails.trim(),
      enrollmentDate: new Date().toISOString()
    };


    const response = await fetch(`${API_BASE_URL}/${policyTemplateId}/enroll`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enrollmentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enroll in policy template');
    }

    return await response.json();
    
  } catch (error) {
    console.error('Enrollment error:', error);
    throw error;
  }
};

// Check enrollment eligibility
export const checkEnrollmentEligibility = async (policyTemplateId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyTemplateId}/eligibility`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to check enrollment eligibility');
    }

    return await response.json();
  } catch (error) {
    console.error('Eligibility check error:', error);
    throw error;
  }
};

// Simple enrollment check
export const canEnrollInTemplate = async (policyTemplateId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${policyTemplateId}/can-enroll`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      return false;
    }

    return await response.json(); // Returns boolean
  } catch (error) {
    console.error('Can enroll check error:', error);
    return false;
  }
};

// Get customer's enrollments
export const getMyEnrollments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/my-enrollments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch enrollments');
    }

    return await response.json();
  } catch (error) {
    console.error('Get enrollments error:', error);
    throw error;
  }
};

// Admin Enrollment Management Functions

// Get all enrollments (Admin only)
export const getAllEnrollments = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all enrollments');
    }

    return await response.json();
  } catch (error) {
    console.error('Get all enrollments error:', error);
    throw error;
  }
};

// Get pending enrollments (Admin only)
export const getPendingEnrollments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pending`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending enrollments');
    }

    return await response.json();
  } catch (error) {
    console.error('Get pending enrollments error:', error);
    throw error;
  }
};

// Approve enrollment (Admin only)
export const approveEnrollment = async (enrollmentId, adminNotes = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/${enrollmentId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: adminNotes ? JSON.stringify(adminNotes) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to approve enrollment');
    }

    return await response.json();
  } catch (error) {
    console.error('Approve enrollment error:', error);
    throw error;
  }
};

// Decline enrollment (Admin only)
export const declineEnrollment = async (enrollmentId, adminNotes = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/${enrollmentId}/decline`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: adminNotes ? JSON.stringify(adminNotes) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to decline enrollment');
    }

    return await response.json();
  } catch (error) {
    console.error('Decline enrollment error:', error);
    throw error;
  }
};

// Extract key identifiers from vehicle details (for validation purposes)
export const extractVehicleIdentifiers = (vehicleDetails) => {
  if (!vehicleDetails) return { licensePlate: null, vin: null };
  
  const details = vehicleDetails.toLowerCase();
  
  // Try to extract license plate (various formats)
  const licenseMatch = details.match(/license[:\s]*([a-zA-Z0-9-]+)|plate[:\s]*([a-zA-Z0-9-]+)|([a-zA-Z]{2,3}[\s-]?\d{3,4}[a-zA-Z]?)/i);
  const licensePlate = licenseMatch ? (licenseMatch[1] || licenseMatch[2] || licenseMatch[3]) : null;
  
  // Try to extract VIN (17 character alphanumeric)
  const vinMatch = details.match(/vin[:\s]*([a-zA-Z0-9]{17})|([a-zA-Z0-9]{17})/i);
  const vin = vinMatch ? (vinMatch[1] || vinMatch[2]) : null;
  
  return { licensePlate, vin };
};

// Validation Functions

export const validateEnrollmentForm = (vehicleDetails) => {
  const errors = [];
  
  if (!vehicleDetails || !vehicleDetails.trim()) {
    errors.push('Vehicle details are required');
    return { isValid: false, errors };
  }
  
  // Extract and validate key identifiers
  const { licensePlate, vin } = extractVehicleIdentifiers(vehicleDetails);
  
  if (!licensePlate && !vin) {
    errors.push('Please include either license plate or VIN number');
  }
  
  // Check for minimum information
  const details = vehicleDetails.toLowerCase();
  const hasYear = /\b(19|20)\d{2}\b/.test(details);
  
  if (!hasYear) {
    errors.push('Please include the vehicle year');
  }
  
  // Allow any vehicle make/brand - users can enter any manufacturer
  
  return {
    isValid: errors.length === 0,
    errors,
    identifiers: { licensePlate, vin }
  };
};

// Format enrollment data for display
export const formatEnrollmentForDisplay = (enrollment) => {
  return {
    enrollmentId: enrollment.enrollmentId,
    policyTemplateId: enrollment.policyTemplateId,
    policyTemplateNumber: enrollment.policyTemplateNumber,
    customerName: enrollment.customerName,
    customerEmail: enrollment.customerEmail,
    status: enrollment.enrollmentStatus,
    enrolledDate: enrollment.enrolledDate,
    approvedDate: enrollment.approvedDate,
    declinedDate: enrollment.declinedDate,
    adminNotes: enrollment.adminNotes,
    policyNumber: enrollment.generatedPolicyNumber,
    vehicleDetails: enrollment.vehicleDetails,
    coverageAmount: enrollment.coverageAmount,
    coverageType: enrollment.coverageType,
    premiumAmount: enrollment.premiumAmount
  };
};
