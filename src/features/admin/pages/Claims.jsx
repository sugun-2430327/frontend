import React, { useState, useEffect } from 'react';
import { getAllClaims, getClaimsByStatus, updateClaimStatus, formatClaimForDisplay, getClaimStatusBadge, formatCurrency, formatClaimDate, getAvailableStatusTransitions, isStatusFinal } from '../../claims/services/claimsService';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    claimStatus: '',
    adminNotes: ''
  });

  // Fetch all claims
  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError('');
      const claimsData = await getAllClaims();
      setClaims(claimsData.map(formatClaimForDisplay));
    } catch (error) {
      setError('Failed to load claims: ' + error.message);
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch claims by status
  const fetchClaimsByStatus = async (status) => {
    try {
      setLoading(true);
      setError('');
      const claimsData = await getClaimsByStatus(status);
      setClaims(claimsData.map(formatClaimForDisplay));
    } catch (error) {
      setError(`Failed to load ${status.toLowerCase()} claims: ` + error.message);
      console.error('Error fetching claims by status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (claimId, newStatus, adminNotes = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [claimId]: newStatus.toLowerCase() }));
      
      const updateData = {
        claimStatus: newStatus,
        adminNotes: adminNotes.trim() || undefined
      };
      
      const updatedClaim = await updateClaimStatus(claimId, updateData);
      
      // Update local state
      setClaims(prev => prev.map(claim => 
        claim.claimId === claimId ? formatClaimForDisplay(updatedClaim) : claim
      ));
      
      alert(`Claim ${claimId} status updated to ${newStatus}${adminNotes ? ' with notes' : ''}`);
      
    } catch (error) {
      alert(`Failed to update claim status: ${error.message}`);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[claimId];
        return newState;
      });
    }
  };

  // Handle opening update modal
  const openUpdateModal = (claim) => {
    setSelectedClaim(claim);
    setUpdateForm({
      claimStatus: '',
      adminNotes: claim.adminNotes || ''
    });
    setShowUpdateModal(true);
  };

  // Handle update form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateForm.claimStatus) {
      alert('Please select a status');
      return;
    }
    
    handleStatusUpdate(
      selectedClaim.claimId, 
      updateForm.claimStatus, 
      updateForm.adminNotes
    );
    
    setShowUpdateModal(false);
    setSelectedClaim(null);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      fetchClaims();
    } else {
      fetchClaimsByStatus(status);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchClaims();
  }, []);

  // Filter claims locally if needed
  const filteredClaims = filterStatus === 'all' ? claims : claims.filter(c => c.status === filterStatus);

  // Get status counts for summary
  const statusCounts = {
    total: claims.length,
    open: claims.filter(c => c.status === 'OPEN' || c.status === 'SUBMITTED' || c.status === 'PENDING').length,
    approved: claims.filter(c => c.status === 'APPROVED').length,
    rejected: claims.filter(c => c.status === 'REJECTED').length
  };

  return (
    <div className="claims-management">
      <h2>Claims Management</h2>
      
      {/* Filter Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {['all', 'OPEN', 'APPROVED', 'REJECTED'].map((status) => (
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
             status === 'OPEN' ? `Open (${statusCounts.open})` :
             status === 'APPROVED' ? `Approved (${statusCounts.approved})` :
             status === 'REJECTED' ? `Rejected (${statusCounts.rejected})` :
             `${status} (0)`}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {filterStatus === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Open</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {statusCounts.open}
            </p>
          </div>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>Approved</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              {statusCounts.approved}
            </p>
          </div>
          <div style={{ backgroundColor: '#f8d7da', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>Rejected</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>
              {statusCounts.rejected}
            </p>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div style={{ padding: '2em', textAlign: 'center' }}>
          <h3>Loading claims...</h3>
        </div>
      )}

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

      {/* Claims Table */}
      {!loading && !error && filteredClaims.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Claims Found</h3>
          <p>
            {filterStatus === 'all' 
              ? 'No claims have been submitted yet.' 
              : `No claims with ${filterStatus.replace('_', ' ').toLowerCase()} status found.`
            }
          </p>
        </div>
      ) : !loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Claim ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.claimId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{claim.claimId}</td>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <strong>{claim.customerName || '—'}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div>
                      <strong>{claim.policyNumber || '—'}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>ID: {claim.policyEnrollmentId}</div>
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
                    {claim.adminNotes && (
                      <div style={{ marginTop: '5px', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                        "{claim.adminNotes}"
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {!isStatusFinal(claim.status) && (
                      <button
                        onClick={() => openUpdateModal(claim)}
                        disabled={actionLoading[claim.claimId]}
                        style={{
                          backgroundColor: actionLoading[claim.claimId] ? '#95a5a6' : '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: actionLoading[claim.claimId] ? 'not-allowed' : 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        {actionLoading[claim.claimId] ? 'Updating...' : 'Update Status'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedClaim && (
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
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Update Claim Status</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
              <p><strong>Claim ID:</strong> {selectedClaim.claimId}</p>
              <p><strong>Customer:</strong> {selectedClaim.customerName}</p>
              <p><strong>Policy:</strong> {selectedClaim.policyNumber}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedClaim.claimAmount)}</p>
              <p><strong>Current Status:</strong> <span style={getClaimStatusBadge(selectedClaim.status)}>{selectedClaim.status}</span></p>
              <p style={{ margin: 0 }}><strong>Submitted:</strong> {formatClaimDate(selectedClaim.submittedDate)}</p>
            </div>
            
            {isStatusFinal(selectedClaim.status) && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeeba', 
                color: '#856404', 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                <strong>ℹ️ Note:</strong> This claim has a final status ({selectedClaim.status}) and cannot be changed further.
              </div>
            )}
            
            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Status *</label>
                <select
                  value={updateForm.claimStatus}
                  onChange={(e) => setUpdateForm({ ...updateForm, claimStatus: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select new status</option>
                  {(() => {
                    const availableTransitions = getAvailableStatusTransitions(selectedClaim?.status);
                    
                    // If no transitions available (e.g., final state), show message
                    if (!availableTransitions || availableTransitions.length === 0) {
                      return (
                        <option value="" disabled>
                          {isStatusFinal(selectedClaim?.status) 
                            ? 'No transitions available - Final status' 
                            : 'No valid transitions available'
                          }
                        </option>
                      );
                    }
                    
                    return availableTransitions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Admin Notes</label>
                <textarea
                  placeholder="Add notes about this status change..."
                  value={updateForm.adminNotes}
                  onChange={(e) => setUpdateForm({ ...updateForm, adminNotes: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={!updateForm.claimStatus || getAvailableStatusTransitions(selectedClaim?.status).length === 0}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: (!updateForm.claimStatus || getAvailableStatusTransitions(selectedClaim?.status).length === 0) ? '#95a5a6' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (!updateForm.claimStatus || getAvailableStatusTransitions(selectedClaim?.status).length === 0) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
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

export default Claims;
