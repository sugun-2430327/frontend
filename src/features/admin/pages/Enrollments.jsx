import React, { useState, useEffect } from 'react';
import { getAllEnrollments, getPendingEnrollments, approveEnrollment, declineEnrollment } from '../../policies/services/enrollmentService';
import { getUserDisplayName } from '../services/userService';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState({});

  // Fetch all enrollments
  const fetchAllEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getAllEnrollments();
      setEnrollments(data);
    } catch (error) {
      setError('Failed to load enrollments: ' + error.message);
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending enrollments
  const fetchPendingEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getPendingEnrollments();
      setPendingEnrollments(data);
    } catch (error) {
      setError('Failed to load pending enrollments: ' + error.message);
      console.error('Error fetching pending enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle enrollment approval
  const handleApprove = async (enrollmentId, adminNotes = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [enrollmentId]: 'approving' }));
      
      const notes = adminNotes || prompt('Enter approval notes (optional):') || 'Approved by admin';
      const approvedEnrollment = await approveEnrollment(enrollmentId, notes);
      
      // Update local state
      setEnrollments(prev => prev.map(e => 
        e.enrollmentId === enrollmentId ? approvedEnrollment : e
      ));
      setPendingEnrollments(prev => prev.filter(e => e.enrollmentId !== enrollmentId));
      
      alert(`Enrollment ${enrollmentId} approved successfully!\nPolicy Number: ${approvedEnrollment.generatedPolicyNumber}`);
      
    } catch (error) {
      alert(`Failed to approve enrollment: ${error.message}`);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[enrollmentId];
        return newState;
      });
    }
  };

  // Handle enrollment decline
  const handleDecline = async (enrollmentId) => {
    try {
      const reason = prompt('Enter decline reason:');
      if (!reason) return;

      setActionLoading(prev => ({ ...prev, [enrollmentId]: 'declining' }));
      
      const declinedEnrollment = await declineEnrollment(enrollmentId, reason);
      
      // Update local state
      setEnrollments(prev => prev.map(e => 
        e.enrollmentId === enrollmentId ? declinedEnrollment : e
      ));
      setPendingEnrollments(prev => prev.filter(e => e.enrollmentId !== enrollmentId));
      
      alert(`Enrollment ${enrollmentId} declined.`);
      
    } catch (error) {
      alert(`Failed to decline enrollment: ${error.message}`);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[enrollmentId];
        return newState;
      });
    }
  };

  // Load data on component mount and tab change
  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingEnrollments();
    } else {
      fetchAllEnrollments();
    }
  }, [activeTab]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' },
      APPROVED: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
      DECLINED: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }
    };
    
    return {
      ...styles[status] || styles.PENDING,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    };
  };

  const currentEnrollments = activeTab === 'pending' ? pendingEnrollments : enrollments;

  return (
    <div className="enrollments-management">
      <h2>Enrollment Management</h2>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'pending' ? '#007bff' : 'transparent',
            color: activeTab === 'pending' ? 'white' : '#007bff',
            borderBottom: activeTab === 'pending' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Pending Enrollments ({pendingEnrollments.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'all' ? '#007bff' : 'transparent',
            color: activeTab === 'all' ? 'white' : '#007bff',
            borderBottom: activeTab === 'all' ? '2px solid #007bff' : 'none',
            cursor: 'pointer'
          }}
        >
          All Enrollments ({enrollments.length})
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div style={{ padding: '2em', textAlign: 'center' }}>
          <h3>Loading enrollments...</h3>
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
            onClick={() => activeTab === 'pending' ? fetchPendingEnrollments() : fetchAllEnrollments()}
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

      {/* Enrollments Table */}
      {!loading && currentEnrollments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No {activeTab === 'pending' ? 'Pending ' : ''}Enrollments</h3>
          <p>
            {activeTab === 'pending' 
              ? 'There are no pending enrollments requiring approval.' 
              : 'No enrollments have been submitted yet.'
            }
          </p>
        </div>
      ) : !loading && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Template</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Customer Name</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Vehicle</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Coverage</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Premium</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Enrolled</th>
                {activeTab === 'all' && (
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action Date</th>
                )}
                {activeTab === 'pending' && (
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentEnrollments.map((enrollment) => (
                <tr key={enrollment.enrollmentId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{enrollment.enrollmentId}</td>
                  <td style={{ padding: '10px' }}>
                    {enrollment.policyTemplateNumber}<br/>
                    <small style={{ color: '#666' }}>{enrollment.coverageType}</small>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {getUserDisplayName({ 
                      username: enrollment.customerName,
                      email: enrollment.customerEmail,
                      firstName: enrollment.firstName,
                      lastName: enrollment.lastName
                    })}<br/>
                    <small style={{ color: '#666' }}>{enrollment.customerEmail}</small>
                  </td>
                  <td style={{ padding: '10px' }}>{enrollment.vehicleDetails || '—'}</td>
                  <td style={{ padding: '10px' }}>₹{enrollment.coverageAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px' }}>₹{enrollment.premiumAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={getStatusBadge(enrollment.enrollmentStatus)}>
                      {enrollment.enrollmentStatus}
                    </span>
                    {enrollment.generatedPolicyNumber && (
                      <div style={{ marginTop: '5px', fontSize: '12px', color: '#28a745' }}>
                        Policy: {enrollment.generatedPolicyNumber}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>{formatDate(enrollment.enrolledDate)}</td>
                  
                  {activeTab === 'all' && (
                    <td style={{ padding: '10px' }}>
                      {formatDate(enrollment.approvedDate || enrollment.declinedDate)}
                      {enrollment.adminNotes && (
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                          {enrollment.adminNotes}
                        </div>
                      )}
                    </td>
                  )}
                  
                  {activeTab === 'pending' && (
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleApprove(enrollment.enrollmentId)}
                          disabled={actionLoading[enrollment.enrollmentId]}
                          style={{
                            backgroundColor: actionLoading[enrollment.enrollmentId] === 'approving' ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: actionLoading[enrollment.enrollmentId] ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {actionLoading[enrollment.enrollmentId] === 'approving' ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDecline(enrollment.enrollmentId)}
                          disabled={actionLoading[enrollment.enrollmentId]}
                          style={{
                            backgroundColor: actionLoading[enrollment.enrollmentId] === 'declining' ? '#ccc' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: actionLoading[enrollment.enrollmentId] ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {actionLoading[enrollment.enrollmentId] === 'declining' ? 'Declining...' : 'Decline'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
