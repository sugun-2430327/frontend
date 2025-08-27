import React from 'react';
import EnrollmentForm from './EnrollmentForm';

const EnrollmentModal = ({ 
  isOpen, 
  onClose, 
  selectedTemplate, 
  onSubmit, 
  loading = false 
}) => {
  if (!isOpen || !selectedTemplate) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            zIndex: 1001,
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          title="Close"
        >
          ×
        </button>

        {/* Modal Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              Policy Enrollment
            </h2>
            <p style={{ color: '#666', margin: 0 }}>
              Complete your enrollment for: <strong>{selectedTemplate.policyNumber}</strong>
            </p>
          </div>
          
          <EnrollmentForm 
            selectedTemplate={selectedTemplate}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
