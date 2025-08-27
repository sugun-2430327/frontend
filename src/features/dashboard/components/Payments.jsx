import React from 'react';

const Payments = () => {
  return (
    <div className="payments-section">
      <h2>Payments & Billing</h2>
      
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {/* Payment History */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f9f9f9' 
        }}>
          <h3>Payment History</h3>
          <p style={{ color: '#666' }}>Your recent premium payments and transaction history.</p>
          <div style={{ marginTop: '15px' }}>
            <p>No payment history available.</p>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f9f9f9' 
        }}>
          <h3>Upcoming Payments</h3>
          <p style={{ color: '#666' }}>View and manage your upcoming premium payments.</p>
          <div style={{ marginTop: '15px' }}>
            <p>No upcoming payments.</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f9f9f9' 
        }}>
          <h3>Payment Methods</h3>
          <p style={{ color: '#666' }}>Manage your saved payment methods and preferences.</p>
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Add Payment Method
            </button>
            <button style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Pay Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
