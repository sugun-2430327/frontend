import React, { useState } from 'react';

const EnrollmentForm = ({ 
  selectedTemplate, 
  onSubmit, 
  onCancel,
  loading = false
}) => {
  const [vehicleDetails, setVehicleDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (onSubmit) {
      const templateId = selectedTemplate.policyId;
      await onSubmit(templateId, vehicleDetails);
    }
  };

  return (
    <div className="enrollment-form">
      <h2>Enroll in {selectedTemplate.policyNumber || selectedTemplate.name}</h2>
      <div style={{background: '#f0f8ff', padding: '15px', borderRadius: '6px', marginBottom: '20px'}}>
        <h3>{selectedTemplate.policyNumber || selectedTemplate.name}</h3>
        <p>{selectedTemplate.description || 'Policy template enrollment'}</p>
        <p><strong>Coverage Amount:</strong> Rs.{selectedTemplate.coverageAmount || 'N/A'}</p>
        <p><strong>Annual Premium:</strong> Rs.{selectedTemplate.premiumAmount || selectedTemplate.basePrice || 'N/A'}</p>
        <p><strong>Coverage Type:</strong> {selectedTemplate.coverageType || 'N/A'}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Vehicle Details *</label>
          <input
            type="text"
            placeholder="Required: 2023 Honda Civic, License: ABC123, VIN: 1234567"
            value={vehicleDetails}
            onChange={(e) => setVehicleDetails(e.target.value)}
            required
            style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
          />
          <small style={{color: '#666', fontSize: '12px', marginTop: '5px', display: 'block'}}>
            <strong style={{color: '#e74c3c'}}>Required:</strong> Provide vehicle make, model, year, and license plate.
            <br />Example: "2023 Honda Civic, License: ABC123, VIN: 1234567"
            <br /><em style={{color: '#666'}}>Note: Each vehicle can only be enrolled once per policy type.</em>
          </small>
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Coverage Amount</label>
          <input
            type="text"
            value={`${selectedTemplate.coverageAmount || 'N/A'}`}
            readOnly
            style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5'}}
          />
        </div>
        
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Annual Premium</label>
          <input
            type="text"
            value={`${selectedTemplate.premiumAmount || selectedTemplate.basePrice || 'N/A'}`}
            readOnly
            style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5'}}
          />
        </div>
        
        <div style={{backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', marginBottom: '20px'}}>
          <h4 style={{margin: '0 0 10px 0', color: '#1976d2'}}>📋 Next Steps</h4>
          <ul style={{margin: 0, paddingLeft: '20px', color: '#1565c0'}}>
            <li>Your enrollment will be submitted with <strong>PENDING</strong> status</li>
            <li>Admin will review and approve/decline your application</li>
            <li>Upon approval, you'll receive a policy number and activation details</li>
            <li>Policy dates and final terms will be set during approval</li>
          </ul>
        </div>
        
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            type="submit"
            disabled={loading || !vehicleDetails.trim()}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: loading || !vehicleDetails.trim() ? '#95a5a6' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !vehicleDetails.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Submitting Enrollment...' : 'Submit Enrollment'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: loading ? '#bdc3c7' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Templates
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollmentForm;
