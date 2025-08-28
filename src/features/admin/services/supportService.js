import { getAuthHeaders } from '../../auth/services/authService';

const API_BASE_URL = 'http://localhost:8090/api/support';

// Customer Functions

// Create a new support ticket
export const createSupportTicket = async (ticketData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create support ticket: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create support ticket error:', error);
    throw error;
  }
};

// Get all tickets (role-based: customers see their own, admins see all)
export const getAllTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get all tickets error:', error);
    throw error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ticket: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    throw error;
  }
};

// Admin Functions

// Get open tickets (admin only)
export const getOpenTickets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/open`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch open tickets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get open tickets error:', error);
    throw error;
  }
};

// Resolve ticket (admin only)
export const resolveTicket = async (ticketId, resolutionNotes) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/resolve`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resolutionNotes })
    });

    if (!response.ok) {
      throw new Error(`Failed to resolve ticket: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Resolve ticket error:', error);
    throw error;
  }
};

// Utility Functions

// Validate ticket creation data
export const validateTicketData = (ticketData) => {
  const errors = [];
  
  if (!ticketData.issueDescription || ticketData.issueDescription.trim().length === 0) {
    errors.push('Issue description is required');
  }
  
  if (ticketData.issueDescription && ticketData.issueDescription.length > 2000) {
    errors.push('Issue description cannot exceed 2000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format customer display name with firstName and lastName for tickets
const formatCustomerDisplayName = (firstName, lastName, username) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName} (${username || 'Unknown'})`;
  } else if (firstName) {
    return `${firstName} (${username || 'Unknown'})`;
  } else if (lastName) {
    return `${lastName} (${username || 'Unknown'})`;
  }
  return username || 'Unknown Customer';
};

// Format ticket data for display
export const formatTicketForDisplay = (ticket) => {
  if (!ticket) {
    console.warn('formatTicketForDisplay: ticket is null or undefined');
    return {};
  }
  
  return {
    ticketId: ticket.ticketId || ticket.id,
    ticketNumber: ticket.ticketNumber || `TICK-${ticket.ticketId || ticket.id}`,
    issueDescription: ticket.issueDescription || '',
    status: ticket.ticketStatus || ticket.status || 'OPEN',
    createdDate: ticket.createdDate || ticket.createdAt,
    resolvedDate: ticket.resolvedDate || ticket.resolvedAt,
    customerName: formatCustomerDisplayName(ticket.firstName, ticket.lastName, ticket.customerUsername),
    customerUsername: ticket.customerUsername || '',
    customerEmail: ticket.customerEmail || ticket.customer?.email,
    firstName: ticket.firstName || '',
    lastName: ticket.lastName || '',
    resolvedByAdminName: ticket.resolvedByAdminName || ticket.resolvedBy?.name || ticket.resolvedByUsername,
    resolutionNotes: ticket.resolutionNotes || ticket.resolution || '',
    policyEnrollmentId: ticket.policyEnrollmentId,
    policyNumber: ticket.policyNumber,
    claimId: ticket.claimId
  };
};

// Get status badge style for UI
export const getTicketStatusBadge = (status) => {
  const styles = {
    OPEN: { backgroundColor: '#e3f2fd', color: '#1976d2', border: '1px solid #bbdefb' },
    IN_PROGRESS: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' },
    RESOLVED: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    CLOSED: { backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }
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

// Format date for display
export const formatTicketDate = (dateString) => {
  if (!dateString) return '—';
  
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Check if ticket is resolved
export const isTicketResolved = (status) => {
  return ['RESOLVED', 'CLOSED'].includes(status);
};

// Get priority color based on creation date (older tickets = higher priority)
export const getTicketPriorityColor = (createdDate) => {
  const now = new Date();
  const created = new Date(createdDate);
  const daysDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 7) return '#dc3545'; // Red - High priority
  if (daysDiff > 3) return '#ffc107'; // Yellow - Medium priority
  return '#28a745'; // Green - Normal priority
};
