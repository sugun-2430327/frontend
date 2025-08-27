import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentForm from './EnrollmentForm';

// Optional: you can install date-fns via npm/yarn for simple date formatting
// import { format } from 'date-fns';

const PolicyTemplateCard = ({ template, onEnroll }) => {
  if (!template) return null;

  // Simple date formatting helper (you can swap in date-fns or moment)
  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}/${
      (d.getMonth() + 1).toString().padStart(2, '0')
    }/${d.getFullYear()}`;
  };

   

  return (
    <div
      className="policy-template-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '320px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '10px',
        }}
      >
        <h3 style={{ margin: 0, color: '#2c3e50' }}>
          {template.policyNumber || 'Unnamed Policy'}
        </h3>
        <span
          style={{
            background: template.policyStatus === 'ACTIVE' ? '#27ae60' : '#e74c3c',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {template.policyStatus || 'Unknown Status'}
        </span>
      </div>

      {/* Description */}
      {/* <p style={{ color: '#666', marginBottom: '15px' }}>
        {template.description || 'No description available.'}
      </p> */}

      {/* Key Attributes */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Policy Details</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
          <li>
            Coverage Type: {template.coverageType || 'N/A'}
          </li>
          <li>
            Vehicle Type: {template.vehicleType || template.vehicleDetails || 'N/A'}
          </li>
          <li>
            Start Date: {formatDate(template.startDate)}
          </li>
          <li>
            End Date: {formatDate(template.endDate)}
          </li>
        </ul>
      </div>

      {/* Features (if any) */}
      {/* <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Key Features</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {Array.isArray(template.features) && template.features.length > 0 ? (
            template.features.map((feature, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {feature}
              </li>
            ))
          ) : (
            <li style={{ color: '#999' }}>No features listed.</li>
          )}
        </ul>
      </div> */}

      {/* Coverage & Premium */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Coverage Amount
          </div>
          <div style={{ fontWeight: 'bold', color: '#27ae60' }}>
            {template.coverageAmount != null ? template.coverageAmount : 'N/A'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Premium (Annual)
          </div>
          <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>
            {template.premiumAmount != null ? template.premiumAmount : 'N/A'}
          </div>
        </div>
      </div>

      {/* Enroll Button */}
      <button
        onClick={() => onEnroll(template)}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Enroll in This Policy
      </button>
    </div>
  );
};

PolicyTemplateCard.propTypes = {
  template: PropTypes.shape({
    policyNumber: PropTypes.string,
    description: PropTypes.string,
    policyStatus: PropTypes.string,
    coverageType: PropTypes.string,
    vehicleType: PropTypes.string, // New field
    vehicleDetails: PropTypes.string, // Kept for backwards compatibility
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    coverageAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    premiumAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onEnroll: PropTypes.func.isRequired,
};

export default PolicyTemplateCard;
