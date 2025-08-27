import React, { useContext } from 'react';
import { CustomerDataContext } from '../context/CustomerDataContext';

const DashboardSummary = () => {
  const {
    // Policy Templates
    totalPolicyTemplates,
    
    // Claims
    totalClaims,
    openClaims,
    approvedClaims,
    rejectedClaims,
    
    // Enrollments & Active Policies
    totalEnrollments,
    pendingEnrollments,
    approvedEnrollments,
    declinedEnrollments,
    activePolicies,
    
    // Support Tickets
    totalTickets,
    openTickets,
    resolvedTickets,
    
    // Profile
    profile,
    
    // State
    loading,
    error,
    lastUpdated,
    refreshDashboard
  } = useContext(CustomerDataContext);
  
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Dashboard...</h2>
        <p style={{ color: '#666' }}>Fetching your latest information...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#d32f2f' }}>Dashboard Error</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={refreshDashboard}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Retry Loading
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px' }}>
      {/* Header with Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>Welcome back, {profile?.username || 'Customer'}!</h2>
          {/* <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </p> */}
        </div>
        {/* <button
          onClick={refreshDashboard}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
           Refresh
        </button> */}
      </div>
      
      {/* Primary Summary Cards */}
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        marginBottom: '30px'
      }}>
        {/* Active Policies Card */}
        <div style={{
          padding: '25px',
          color: 'black',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            fontSize: '18px',
            opacity: 0.9,
            color: '#1976d2'
          }}>
            Active Policies
          </h3>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            marginBottom: '10px'
          }}>
            {activePolicies}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {activePolicies > 0 ? 'You\'re protected!' : 'No active coverage yet'}
          </div>
        </div>

        {/* Claims Card */}
        <div style={{
          padding: '25px',
          color: 'black',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            fontSize: '18px',
            opacity: 0.9,
            color: '#1976d2'
          }}>
            My Claims
          </h3>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            marginBottom: '10px'
          }}>
            {totalClaims}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            fontSize: '12px',
            opacity: 0.9
          }}>
            <span>Open: {openClaims}</span>
            <span>Approved: {approvedClaims}</span>
            <span>Rejected: {rejectedClaims}</span>
          </div>
        </div>

        {/* Enrollments Card */}
        <div style={{
          padding: '25px',
          color: 'black',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            fontSize: '18px',
            opacity: 0.9,
            color: '#1976d2'
          }}>
            Enrollments
          </h3>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            marginBottom: '10px'
          }}>
            {totalEnrollments}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            fontSize: '12px',
            opacity: 0.9
          }}>
            <span>Pending: {pendingEnrollments}</span>
            <span>Approved: {approvedEnrollments}</span>
            <span>Declined: {declinedEnrollments}</span>
          </div>
        </div>
      </div>

      {/* Secondary Information Cards */}
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        
        {/* Support Tickets */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e1e5e9'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>Support Tickets</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            {totalTickets}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
            <span>Open: {openTickets}</span>
            <span>Resolved: {resolvedTickets}</span>
          </div>
        </div>

        {/* Available Templates */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e1e5e9'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>Available Policies</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            {totalPolicyTemplates}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Policy templates ready for enrollment
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e1e5e9'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>Quick Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: pendingEnrollments > 0 ? '#f57c00' : '#666' 
            }}>
               {pendingEnrollments} enrollment(s) pending
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: openClaims > 0 ? '#d32f2f' : '#666' 
            }}>
              {openClaims} claim(s) in progress
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: openTickets > 0 ? '#1976d2' : '#666' 
            }}>
              {openTickets} support ticket(s) open
            </div>
          </div>
        </div>

        {/* Account Status */}
        {/* <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e1e5e9'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}> Account Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', color: '#28a745' }}>
              ✅ Account active
            </div>
            <div style={{ fontSize: '13px', color: '#28a745' }}>
              ✅ Real-time sync enabled
            </div>
            <div style={{ fontSize: '13px', color: activePolicies > 0 ? '#28a745' : '#f57c00' }}>
              {activePolicies > 0 ? '✅' : '⚠️'} {activePolicies > 0 ? 'Protected' : 'No active coverage'}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardSummary;
