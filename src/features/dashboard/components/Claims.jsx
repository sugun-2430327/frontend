import React, { useState, useEffect } from 'react';
import { getAllClaims, submitClaim, validateClaimData, formatClaimForDisplay, getClaimStatusBadge, formatCurrency, formatClaimDate } from '../../claims/services/claimsService';
import { getMyEnrollments } from '../../policies/services/enrollmentService';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewClaimForm, setShowNewClaimForm] = useState(false);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({
    policyEnrollmentId: '',
    claimAmount: '',
    claimDescription: ''
  });

  // Fetch customer's claims
  const fetchClaims = async () => {
    try {
      setLoading(true);
      const claimsData = await getAllClaims();
      setClaims(claimsData.map(formatClaimForDisplay));
    } catch (error) {
      setError('Failed to load claims: ' + error.message);
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved enrollments for claim submission
  const fetchApprovedEnrollments = async () => {
    try {
      const enrollmentsData = await getMyEnrollments();
      // Only show approved enrollments that can have claims
      const approvedEnrollments = enrollmentsData.filter(e => e.enrollmentStatus === 'APPROVED');
      setEnrollments(approvedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      // Don't show error for enrollments as it's not critical
    }
  };

  // Handle new claim submission
  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateClaimData({
      ...claimForm,
      claimAmount: parseFloat(claimForm.claimAmount)
    });
    
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    try {
      setSubmittingClaim(true);
      
      const claimData = {
        policyEnrollmentId: parseInt(claimForm.policyEnrollmentId),
        claimAmount: parseFloat(claimForm.claimAmount),
        claimDescription: claimForm.claimDescription.trim() || undefined
      };
      
      const newClaim = await submitClaim(claimData);
      
      // Add new claim to list
      setClaims(prev => [formatClaimForDisplay(newClaim), ...prev]);
      
      // Reset form and close modal
      setClaimForm({
        policyEnrollmentId: '',
        claimAmount: '',
        claimDescription: ''
      });
      setShowNewClaimForm(false);
      
      alert(`Claim submitted successfully!\n\nClaim ID: ${newClaim.claimId}\nStatus: ${newClaim.claimStatus}\n\nYour claim is now under review.`);
      
    } catch (error) {
      alert(`Failed to submit claim: ${error.message}`);
    } finally {
      setSubmittingClaim(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchClaims();
    fetchApprovedEnrollments();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2em', textAlign: 'center' }}>
        <h2>Loading Claims...</h2>
        <p>Please wait while we fetch your claims data.</p>
      </div>
    );
  }

  return (
    <div className="claims-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Claims Management</h2>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>
            Submit and track your insurance claims for covered incidents.
          </p>
        </div>
        {enrollments.length > 0 && (
          <button
            onClick={() => setShowNewClaimForm(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + New Claim
          </button>
        )}
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
            onClick={fetchClaims}
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

      {/* Claims Summary */}
      {!error && claims.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Open</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {claims.filter(c => c.status === 'OPEN' || c.status === 'SUBMITTED' || c.status === 'PENDING').length}
            </p>
          </div>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>Approved</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              {claims.filter(c => c.status === 'APPROVED').length}
            </p>
          </div>
          <div style={{ backgroundColor: '#f8d7da', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>Rejected</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>
              {claims.filter(c => c.status === 'REJECTED').length}
            </p>
          </div>
        </div>
      )}
      
      {/* Claims Table */}
      {!error && claims.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Claims Found</h3>
          <p>You haven't submitted any claims yet.</p>
          {enrollments.length === 0 ? (
            <p><strong>Note:</strong> You need an approved policy enrollment to submit claims.</p>
          ) : (
            <p>Click "+ New Claim" to file your first claim.</p>
          )}
        </div>
      ) : !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Claim ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claimId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{claim.claimId}</td>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <strong>{claim.policyNumber || '—'}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>Enrollment ID: {claim.policyEnrollmentId}</div>
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>{formatCurrency(claim.claimAmount)}</td>
                  <td style={{ padding: '10px', maxWidth: '200px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {claim.claimDescription || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={getClaimStatusBadge(claim.status)}>
                      {claim.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {formatClaimDate(claim.processedDate || claim.settledDate)}
                    {claim.adminNotes && (
                      <div style={{ marginTop: '5px', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                        "{claim.adminNotes}"
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* New Claim Form Modal */}
      {showNewClaimForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Submit New Claim</h3>
            
            <form onSubmit={handleSubmitClaim}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Policy Enrollment *</label>
                <select
                  value={claimForm.policyEnrollmentId}
                  onChange={(e) => setClaimForm({ ...claimForm, policyEnrollmentId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select approved policy enrollment</option>
                  {enrollments.map((enrollment) => (
                    <option key={enrollment.enrollmentId} value={enrollment.enrollmentId}>
                      {enrollment.policyTemplateNumber} - {enrollment.coverageType} (₹{enrollment.coverageAmount?.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Only approved policy enrollments are available for claims
                </small>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Claim Amount *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter claim amount in ₹"
                  value={claimForm.claimAmount}
                  onChange={(e) => setClaimForm({ ...claimForm, claimAmount: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Claim Description</label>
                <textarea
                  placeholder="Describe the incident and damage (optional but recommended)"
                  value={claimForm.claimDescription}
                  onChange={(e) => setClaimForm({ ...claimForm, claimDescription: e.target.value })}
                  maxLength={1000}
                  rows={4}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  {claimForm.claimDescription.length}/1000 characters
                </small>
              </div>

              <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>📋 Claim Process</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0', fontSize: '14px' }}>
                  <li>Your claim will be submitted with <strong>SUBMITTED</strong> status</li>
                  <li>Admin will review and may change status to <strong>UNDER_REVIEW</strong></li>
                  <li>Final decision will be <strong>APPROVED</strong> or <strong>REJECTED</strong></li>
                  <li>Approved claims will be processed for settlement</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={submittingClaim || !claimForm.policyEnrollmentId || !claimForm.claimAmount}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: submittingClaim || !claimForm.policyEnrollmentId || !claimForm.claimAmount ? '#95a5a6' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: submittingClaim || !claimForm.policyEnrollmentId || !claimForm.claimAmount ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {submittingClaim ? 'Submitting Claim...' : 'Submit Claim'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewClaimForm(false)}
                  disabled={submittingClaim}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: submittingClaim ? '#bdc3c7' : '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: submittingClaim ? 'not-allowed' : 'pointer',
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
        <h3>Need Help?</h3>
        <p>If you have questions about filing a claim or need assistance with an existing claim, please contact our support team.</p>
        <ul style={{ color: '#666' }}>
          <li><strong>Phone:</strong> 1-800-CLAIMS (1-800-252-4567)</li>
          <li><strong>Email:</strong> claims@insuranceportal.com</li>
          <li><strong>Hours:</strong> Monday-Friday, 8 AM - 6 PM</li>
        </ul>
      </div>
    </div>
  );
};

export default Claims;
