import React, { useState, useEffect } from 'react';
import { 
  createSupportTicket, 
  getAllTickets, 
  validateTicketData, 
  formatTicketForDisplay, 
  getTicketStatusBadge, 
  formatTicketDate, 
  isTicketResolved,
  getTicketPriorityColor 
} from '../../admin/services/supportService';
import { getMyEnrollments } from '../../policies/services/enrollmentService';
import { getAllClaims } from '../../claims/services/claimsService';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  
  const [ticketForm, setTicketForm] = useState({
    issueDescription: '',
    policyEnrollmentId: null,
    claimId: null
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchTickets();
    fetchEnrollments();
    fetchClaims();
  }, []);

  const fetchTickets = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await getAllTickets();
      const formattedTickets = response.map(formatTicketForDisplay);
      setTickets(formattedTickets);
    } catch (err) {
      setError('Failed to load support tickets. Please try again.');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await getMyEnrollments();
      setEnrollments(response.filter(e => e.enrollmentStatus === 'APPROVED'));
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await getAllClaims();
      setClaims(response);
    } catch (err) {
      console.error('Error fetching claims:', err);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateTicketData(ticketForm);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }
    
    try {
      setSubmittingTicket(true);
      setError('');
      
      // Prepare ticket data - convert empty strings to null
      const ticketData = {
        issueDescription: ticketForm.issueDescription.trim(),
        policyEnrollmentId: ticketForm.policyEnrollmentId || null,
        claimId: ticketForm.claimId || null
      };
      
      const newTicket = await createSupportTicket(ticketData);
      const formattedTicket = formatTicketForDisplay(newTicket);
      
      // Add new ticket to the list
      setTickets([formattedTicket, ...tickets]);
      
      // Reset form and close modal
      setTicketForm({
        issueDescription: '',
        policyEnrollmentId: null,
        claimId: null
      });
      setShowNewTicketForm(false);
      
      // Create success message with fallback
      const ticketIdentifier = newTicket.ticketNumber || newTicket.ticketId || 'Unknown';
      alert(`Support ticket created successfully! Ticket ID: ${ticketIdentifier}`);
    } catch (err) {
      setError(`Failed to create support ticket: ${err.message}`);
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <div className="support-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Support Tickets</h2>
        <button
          onClick={() => setShowNewTicketForm(true)}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Create Ticket
        </button>
      </div>

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
          <p>Please wait while we fetch your tickets.</p>
        </div>
      ) : tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Support Tickets</h3>
          <p>You haven't created any support tickets yet. Click "Create Ticket" to get started.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Ticket #</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Issue Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Created</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Resolved</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Resolution Notes</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
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
                  <td style={{ padding: '10px', maxWidth: '200px' }}>
                    {ticket.resolutionNotes ? (
                      <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
                        {ticket.resolutionNotes.length > 100 
                          ? `${ticket.resolutionNotes.substring(0, 100)}...` 
                          : ticket.resolutionNotes
                        }
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showNewTicketForm && (
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
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Create Support Ticket</h3>
            
            <form onSubmit={handleSubmitTicket}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Issue Description *</label>
                <textarea
                  value={ticketForm.issueDescription}
                  onChange={(e) => setTicketForm({ ...ticketForm, issueDescription: e.target.value })}
                  required
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  maxLength={2000}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  {ticketForm.issueDescription.length}/2000 characters
                </small>
              </div>
            
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Related Policy Enrollment (Optional)</label>
                <select
                  value={ticketForm.policyEnrollmentId || ''}
                  onChange={(e) => setTicketForm({ ...ticketForm, policyEnrollmentId: e.target.value || null })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select policy enrollment (optional)</option>
                  {enrollments.map((enrollment) => (
                    <option key={enrollment.enrollmentId} value={enrollment.enrollmentId}>
                      {enrollment.policyTemplateNumber} - {enrollment.coverageType}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Related Claim (Optional)</label>
                <select
                  value={ticketForm.claimId || ''}
                  onChange={(e) => setTicketForm({ ...ticketForm, claimId: e.target.value || null })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select claim (optional)</option>
                  {claims.map((claim) => (
                    <option key={claim.claimId} value={claim.claimId}>
                      Claim #{claim.claimId} - ₹{claim.claimAmount?.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={submittingTicket || !ticketForm.issueDescription.trim()}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: (submittingTicket || !ticketForm.issueDescription.trim()) ? '#95a5a6' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (submittingTicket || !ticketForm.issueDescription.trim()) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {submittingTicket ? 'Creating Ticket...' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketForm(false)}
                  disabled={submittingTicket}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: submittingTicket ? '#bdc3c7' : '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: submittingTicket ? 'not-allowed' : 'pointer',
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

      {/* Help Section */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <h3>Need Immediate Help?</h3>
        <p>If you have urgent questions or need immediate assistance, please contact our support team directly.</p>
        <ul style={{ color: '#666' }}>
          <li><strong>Phone:</strong> +91 9756785414</li>
          <li><strong>Email:</strong> insurance@secureshield.com</li>
          <li><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default Support;
