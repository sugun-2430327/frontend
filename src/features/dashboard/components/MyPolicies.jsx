import React, { useState, useEffect } from 'react';
import { getMyEnrollments } from '../../policies/services/enrollmentService';

const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPolicies = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get customer's enrollments
        const enrollments = await getMyEnrollments();
        
        // Filter to only approved enrollments that have generated policies
        const approvedEnrollments = enrollments.filter(enrollment => 
          enrollment.enrollmentStatus === 'APPROVED' && 
          enrollment.generatedPolicyNumber
        );
        
        // Convert approved enrollments to policy format for display
        const customerPolicies = approvedEnrollments.map(enrollment => ({
          policyId: enrollment.enrollmentId, // Using enrollment ID as policy ID
          policyNumber: enrollment.generatedPolicyNumber,
          vehicleDetails: enrollment.vehicleDetails,
          coverageType: enrollment.coverageType,
          coverageAmount: enrollment.coverageAmount,
          premiumAmount: enrollment.premiumAmount,
          startDate: enrollment.approvedDate, // Policy starts when approved
          endDate: null, // Could be calculated as 1 year from start date
          policyStatus: 'ACTIVE', // Approved enrollments become active policies
          policyHolderName: enrollment.customerName,
          enrollmentId: enrollment.enrollmentId,
          approvedDate: enrollment.approvedDate
        }));
        
        setPolicies(customerPolicies || []);
      } catch (err) {
        console.error('Error fetching customer policies:', err);
        setError(err.message || 'Failed to fetch your policies');
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPolicies();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2em', textAlign: 'center' }}>
        <h2>Loading Your Policies...</h2>
        <p>Please wait while we fetch your active policies.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2em', textAlign: 'center' }}>
        <h2>Error Loading Your Policies</h2>
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

  return (
    <div className="policy-table">
      <h2>My Active Policies</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Your active insurance policies generated from approved enrollment applications.
      </p>
      
      {Array.isArray(policies) && policies.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>Active Policies</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              {policies.length}
            </p>
          </div>
          <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1565c0' }}>Total Coverage</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1565c0' }}>
              ₹{policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#856404' }}>Total Premium</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#856404' }}>
              ₹{policies.reduce((sum, p) => sum + (p.premiumAmount || 0), 0).toLocaleString('en-IN')}/year
            </p>
          </div>
        </div>
      )}
      
      {Array.isArray(policies) && policies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Active Policies Found</h3>
          <p>You don't have any active policies yet. This happens when:</p>
          <ul style={{ textAlign: 'left', display: 'inline-block', marginBottom: '15px' }}>
            <li>You haven't enrolled in any policies</li>
            <li>Your enrollments are still pending admin approval</li>
            <li>Your enrollments were declined</li>
          </ul>
          <p>Browse our policy templates to enroll in a new policy.</p>
          <button 
            onClick={() => {
              // Navigate to Browse Policies tab
              const event = new CustomEvent('navigateToTab', { detail: 'Browse Policies' });
              window.dispatchEvent(event);
            }}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Browse Policies
          </button>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy Number</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Vehicle Details</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Coverage Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Coverage Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Annual Premium</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy Start</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Enrollment ID</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(policies) && policies.map((p) =>  (
              <tr key={p.policyId} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  <div>
                    <strong>{p.policyNumber}</strong><br/>
                    <small style={{ color: '#666' }}>Generated from enrollment #{p.enrollmentId}</small>
                  </div>
                </td>
                <td style={{ padding: '10px' }}>{p.vehicleDetails || '—'}</td>
                <td style={{ padding: '10px' }}>{p.coverageType}</td>
                <td style={{ padding: '10px' }}>₹{p.coverageAmount?.toLocaleString?.('en-IN') || p.coverageAmount}</td>
                <td style={{ padding: '10px' }}>₹{p.premiumAmount?.toLocaleString?.('en-IN') || p.premiumAmount}</td>
                <td style={{ padding: '10px' }}>
                  {p.startDate ? new Date(p.startDate).toLocaleDateString('en-IN') : '—'}
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#d4edda',
                    color: '#155724'
                  }}>
                    ACTIVE
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                    #{p.enrollmentId}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyPolicies;
