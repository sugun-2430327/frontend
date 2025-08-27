import React, { useState, useEffect } from 'react';
import { 
  getAllTickets, 
  getOpenTickets, 
  resolveTicket, 
  formatTicketForDisplay, 
  getTicketStatusBadge, 
  formatTicketDate, 
  isTicketResolved,
  getTicketPriorityColor 
} from '../services/supportService';
import { getAllEnrollments } from '../../policies/services/enrollmentService';
import { getAllClaims } from '../../claims/services/claimsService';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionForm, setResolutionForm] = useState({ resolutionNotes: '' });
  const [resolvingTicket, setResolvingTicket] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [ticketDetails, setTicketDetails] = useState({
    claim: null,
    enrollment: null,
    loading: false,
    error: null
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setError('');
      setLoading(true);
      const response = filterStatus === 'open' ? await getOpenTickets() : await getAllTickets();
      const formattedTickets = response.map(formatTicketForDisplay);
      setTickets(formattedTickets);
    } catch (err) {
      setError('Failed to load support tickets. Please try again.');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchTickets();
  };

  const openResolveModal = async (ticket) => {
    setSelectedTicket(ticket);
    setResolutionForm({ resolutionNotes: '' });
    
    // Reset ticket details
    setTicketDetails({
      claim: null,
      enrollment: null,
      loading: false,
      error: null
    });
    
    // Fetch related claim and enrollment details if available
    if (ticket.claimId || ticket.policyEnrollmentId) {
      await fetchTicketRelatedData(ticket);
    }
  };

  const fetchTicketRelatedData = async (ticket) => {
    try {
      setTicketDetails(prev => ({ ...prev, loading: true, error: null }));
      
      let claimData = null;
      let enrollmentData = null;
      
      // Fetch claim details if claim_id exists
      if (ticket.claimId) {
        try {
          const claims = await getAllClaims();
          claimData = claims.find(claim => claim.claimId === ticket.claimId);
        } catch (err) {
          console.error('Error fetching claim data:', err);
        }
      }
      
      // Fetch enrollment details if policy_enrollment_id exists
      if (ticket.policyEnrollmentId) {
        try {
          const enrollments = await getAllEnrollments();
          enrollmentData = enrollments.find(enrollment => enrollment.enrollmentId === ticket.policyEnrollmentId);
        } catch (err) {
          console.error('Error fetching enrollment data:', err);
        }
      }
      
      setTicketDetails({
        claim: claimData,
        enrollment: enrollmentData,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching ticket related data:', err);
      setTicketDetails(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load related information'
      }));
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    
    if (!resolutionForm.resolutionNotes.trim()) {
      setError('Resolution notes are required');
      return;
    }
    
    try {
      setResolvingTicket(true);
      setError('');
      
      const resolvedTicket = await resolveTicket(selectedTicket.ticketId, resolutionForm.resolutionNotes.trim());
      const formattedTicket = formatTicketForDisplay(resolvedTicket);
      
      // Update the ticket in the list
      setTickets(tickets.map(ticket => 
        ticket.ticketId === selectedTicket.ticketId ? formattedTicket : ticket
      ));
      
      // Close modal
      setSelectedTicket(null);
      setResolutionForm({ resolutionNotes: '' });
      
      // Create success message with fallback
      const ticketIdentifier = resolvedTicket.ticketNumber || resolvedTicket.ticketId || 'Unknown';
      alert(`Ticket ${ticketIdentifier} resolved successfully!`);
    } catch (err) {
      setError(`Failed to resolve ticket: ${err.message}`);
    } finally {
      setResolvingTicket(false);
    }
  };

  // Filter tickets locally if needed
  const filteredTickets = filterStatus === 'all' ? tickets : tickets.filter(t => {
    if (filterStatus === 'open') return ['OPEN', 'IN_PROGRESS'].includes(t.status);
    if (filterStatus === 'resolved') return t.status === 'RESOLVED';
    return t.status === filterStatus;
  });

  // Get status counts for summary
  const statusCounts = {
    total: tickets.length,
    open: tickets.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length
  };

  return (
    <div className="support-management">
      <h2>Support Ticket Management</h2>
      
      {/* Filter Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {['all', 'open', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: filterStatus === status ? '#007bff' : 'transparent',
              color: filterStatus === status ? 'white' : '#007bff',
              borderBottom: filterStatus === status ? '2px solid #007bff' : 'none',
              cursor: 'pointer',
              marginRight: '10px',
              textTransform: 'capitalize'
            }}
          >
            {status === 'all' ? `All (${statusCounts.total})` : 
             status === 'open' ? `Open (${statusCounts.open})` :
             status === 'resolved' ? `Resolved (${statusCounts.resolved})` :
             `${status} (0)`}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {filterStatus === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Open Tickets</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {statusCounts.open}
            </p>
          </div>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>Resolved</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              {statusCounts.resolved}
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '4px',
          margin: '20px 0',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchTickets}
            style={{
              marginLeft: '10px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>Loading Support Tickets...</h3>
          <p>Please wait while we fetch the tickets.</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Support Tickets Found</h3>
          <p>
            {filterStatus === 'all' 
              ? 'No support tickets have been created yet.' 
              : `No tickets with ${filterStatus} status found.`
            }
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Ticket #</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Issue Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Created</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Resolved</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticketId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <strong>{ticket.ticketNumber}</strong>
                      <div style={{ 
                        fontSize: '10px', 
                        color: getTicketPriorityColor(ticket.createdDate),
                        fontWeight: 'bold'
                      }}>
                        ID: {ticket.ticketId}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <strong>{ticket.customerName || '—'}</strong>
                      <div style={{ fontSize: '11px', color: '#666' }}>{ticket.customerEmail || '—'}</div>
                    </div>
                  </td>
                  <td style={{ padding: '10px', maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ticket.issueDescription}
                    </div>
                    {(ticket.policyEnrollmentId || ticket.claimId) && (
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                        {ticket.policyEnrollmentId && `Policy: ${ticket.policyEnrollmentId}`}
                        {ticket.claimId && `Claim: ${ticket.claimId}`}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={getTicketStatusBadge(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{formatTicketDate(ticket.createdDate)}</td>
                  <td style={{ padding: '10px' }}>
                    {ticket.resolvedDate ? formatTicketDate(ticket.resolvedDate) : '—'}
                    {ticket.resolvedByAdminName && (
                      <div style={{ fontSize: '11px', color: '#666' }}>by {ticket.resolvedByAdminName}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {!isTicketResolved(ticket.status) && (
                      <button
                        onClick={() => openResolveModal(ticket)}
                        disabled={actionLoading[ticket.ticketId]}
                        style={{
                          backgroundColor: actionLoading[ticket.ticketId] ? '#95a5a6' : '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: actionLoading[ticket.ticketId] ? 'not-allowed' : 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {actionLoading[ticket.ticketId] ? 'Resolving...' : 'Resolve'}
                      </button>
                    )}
                    {ticket.resolutionNotes && (
                      <div style={{ marginTop: '5px', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                        "{ticket.resolutionNotes.length > 50 ? `${ticket.resolutionNotes.substring(0, 50)}...` : ticket.resolutionNotes}"
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolve Ticket Modal */}
      {selectedTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Resolve Support Ticket</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
              <p><strong>Ticket:</strong> {selectedTicket.ticketNumber}</p>
              <p><strong>Customer:</strong> {selectedTicket.customerName} ({selectedTicket.customerEmail})</p>
              <p><strong>Issue:</strong> {selectedTicket.issueDescription}</p>
              <p><strong>Created:</strong> {formatTicketDate(selectedTicket.createdDate)}</p>
              <p style={{ margin: 0 }}><strong>Current Status:</strong> <span style={getTicketStatusBadge(selectedTicket.status)}>{selectedTicket.status}</span></p>
            </div>
            
            {/* Related Information Section */}
            {(selectedTicket.claimId || selectedTicket.policyEnrollmentId) && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>📋 Related Information</h4>
                
                {ticketDetails.loading && (
                  <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#1565c0' }}>Loading related information...</p>
                  </div>
                )}
                
                {ticketDetails.error && (
                  <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                    <p style={{ margin: 0, color: '#c62828' }}>⚠️ {ticketDetails.error}</p>
                  </div>
                )}
                
                {!ticketDetails.loading && (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {/* Claim Information */}
                    {selectedTicket.claimId && (
                      <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '6px', border: '1px solid #ffcc80' }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#ef6c00' }}>🏥 Claim Details (ID: {selectedTicket.claimId})</h5>
                        {ticketDetails.claim ? (
                          <div style={{ fontSize: '14px' }}>
                            <p style={{ margin: '5px 0' }}><strong>Claim Number:</strong> {ticketDetails.claim.claimNumber}</p>
                            <p style={{ margin: '5px 0' }}><strong>Type:</strong> {ticketDetails.claim.claimType}</p>
                            <p style={{ margin: '5px 0' }}><strong>Amount:</strong> ₹{ticketDetails.claim.claimAmount?.toLocaleString('en-IN')}</p>
                            <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ 
                              padding: '2px 6px', 
                              borderRadius: '3px', 
                              fontSize: '12px',
                              backgroundColor: ticketDetails.claim.claimStatus === 'APPROVED' ? '#d4edda' : ticketDetails.claim.claimStatus === 'REJECTED' ? '#f8d7da' : '#fff3cd',
                              color: ticketDetails.claim.claimStatus === 'APPROVED' ? '#155724' : ticketDetails.claim.claimStatus === 'REJECTED' ? '#721c24' : '#856404'
                            }}>{ticketDetails.claim.claimStatus}</span></p>
                            <p style={{ margin: '5px 0' }}><strong>Description:</strong> {ticketDetails.claim.description}</p>
                            <p style={{ margin: '5px 0 0 0' }}><strong>Filed:</strong> {new Date(ticketDetails.claim.claimDate).toLocaleDateString('en-IN')}</p>
                          </div>
                        ) : (
                          <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>Claim details not found</p>
                        )}
                      </div>
                    )}
                    
                    {/* Policy/Enrollment Information */}
                    {selectedTicket.policyEnrollmentId && (
                      <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '6px', border: '1px solid #a5d6a7' }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>📄 Policy/Enrollment Details (ID: {selectedTicket.policyEnrollmentId})</h5>
                        {ticketDetails.enrollment ? (
                          <div style={{ fontSize: '14px' }}>
                            <p style={{ margin: '5px 0' }}><strong>Policy Number:</strong> {ticketDetails.enrollment.generatedPolicyNumber || 'Not yet generated'}</p>
                            <p style={{ margin: '5px 0' }}><strong>Template:</strong> {ticketDetails.enrollment.policyTemplateNumber}</p>
                            <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ 
                              padding: '2px 6px', 
                              borderRadius: '3px', 
                              fontSize: '12px',
                              backgroundColor: ticketDetails.enrollment.enrollmentStatus === 'APPROVED' ? '#d4edda' : ticketDetails.enrollment.enrollmentStatus === 'DECLINED' ? '#f8d7da' : '#fff3cd',
                              color: ticketDetails.enrollment.enrollmentStatus === 'APPROVED' ? '#155724' : ticketDetails.enrollment.enrollmentStatus === 'DECLINED' ? '#721c24' : '#856404'
                            }}>{ticketDetails.enrollment.enrollmentStatus}</span></p>
                            <p style={{ margin: '5px 0' }}><strong>Coverage:</strong> {ticketDetails.enrollment.coverageType}</p>
                            <p style={{ margin: '5px 0' }}><strong>Coverage Amount:</strong> ₹{ticketDetails.enrollment.coverageAmount?.toLocaleString('en-IN')}</p>
                            <p style={{ margin: '5px 0' }}><strong>Premium:</strong> ₹{ticketDetails.enrollment.premiumAmount?.toLocaleString('en-IN')}/year</p>
                            <p style={{ margin: '5px 0' }}><strong>Vehicle:</strong> {ticketDetails.enrollment.vehicleDetails}</p>
                            <p style={{ margin: '5px 0 0 0' }}><strong>Enrolled:</strong> {new Date(ticketDetails.enrollment.enrolledDate).toLocaleDateString('en-IN')}</p>
                          </div>
                        ) : (
                          <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>Enrollment details not found</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleResolveSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Resolution Notes *</label>
                <textarea
                  placeholder="Explain how the issue was resolved..."
                  value={resolutionForm.resolutionNotes}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, resolutionNotes: e.target.value })}
                  required
                  rows={4}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={resolvingTicket || !resolutionForm.resolutionNotes.trim()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: (resolvingTicket || !resolutionForm.resolutionNotes.trim()) ? '#95a5a6' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (resolvingTicket || !resolutionForm.resolutionNotes.trim()) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {resolvingTicket ? 'Resolving...' : 'Resolve Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  disabled={resolvingTicket}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: resolvingTicket ? '#bdc3c7' : '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: resolvingTicket ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
