import React, { useState, useEffect } from 'react';
import { getMyEnrollments } from '../../policies/services/enrollmentService';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyEnrollments();
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError(err.message || 'Failed to fetch enrollments');
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);
  if (loading) {
    return (
      <div style={{ padding: '2em', textAlign: 'center' }}>
        <h2>Loading Enrollments...</h2>
        <p>Please wait while we fetch your enrollment history.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2em', textAlign: 'center' }}>
        <h2>Error Loading Enrollments</h2>
        <p style={{ color: '#dc3545' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="enrollments-section">
      <h2>My Enrollments</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Track the status of your policy enrollment applications. Approved enrollments become active policies.
      </p>
      
      {Array.isArray(enrollments) && enrollments.length === 0 ?(
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Enrollments Found</h3>
          <p>You haven't submitted any enrollment applications yet.</p>
          <p>Browse our policy templates to get started!</p>
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#856404' }}>Pending</h4>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
                {/* {enrollments.filter(e => e.enrollmentStatus === 'PENDING').length} */}
                {Array.isArray(enrollments) ? enrollments.filter(e => e.enrollmentStatus === 'PENDING').length : 0}

              </p>
            </div>
            <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>Approved</h4>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
                {/* {enrollments.filter(e => e.enrollmentStatus === 'APPROVED').length} */}
                {Array.isArray(enrollments) ? enrollments.filter(e => e.enrollmentStatus === 'APPROVED').length : 0}

              </p>
            </div>
            <div style={{ backgroundColor: '#f8d7da', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>Declined</h4>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>
                {/* {enrollments.filter(e => e.enrollmentStatus === 'DECLINED').length} */}
                {Array.isArray(enrollments) ? enrollments.filter(e => e.enrollmentStatus === 'DECLINED').length : 0}

              </p>
            </div>
          </div>

          {/* Enrollments Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Enrollment ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy Template</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Vehicle Details</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Coverage</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Premium</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Applied Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(enrollments) && enrollments.map((enrollment) =>  (
                  <tr key={enrollment.enrollmentId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{enrollment.enrollmentId}</td>
                    <td style={{ padding: '10px' }}>
                      <div>
                        <strong>{enrollment.policyTemplateNumber}</strong><br/>
                        <small style={{ color: '#666' }}>{enrollment.coverageType}</small>
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>{enrollment.vehicleDetails || '—'}</td>
                    <td style={{ padding: '10px' }}>₹{enrollment.coverageAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px' }}>₹{enrollment.premiumAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={getStatusBadge(enrollment.enrollmentStatus)}>
                        {enrollment.enrollmentStatus}
                      </span>
                      {enrollment.generatedPolicyNumber && (
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>
                          Policy: {enrollment.generatedPolicyNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '10px' }}>{formatDate(enrollment.enrolledDate)}</td>
                    <td style={{ padding: '10px' }}>
                      {formatDate(enrollment.approvedDate || enrollment.declinedDate)}
                      {enrollment.adminNotes && enrollment.enrollmentStatus !== 'PENDING' && (
                        <div style={{ marginTop: '5px', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                          "{enrollment.adminNotes}"
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Help Text */}
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📋 About Enrollment Status</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#6c757d' }}>
              <li><strong>PENDING:</strong> Your application is under review by our admin team</li>
              <li><strong>APPROVED:</strong> Congratulations! Your enrollment has been approved and you now have an active policy</li>
              <li><strong>DECLINED:</strong> Your application was not approved. Please check admin notes for details</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;
