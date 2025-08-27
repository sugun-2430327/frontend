import React, { useEffect, useState } from 'react';
import PolicyTemplateCard from './PolicyTemplateCard';
import EnrollmentModal from './EnrollmentModal';
import { getPublicPolicyTemplates } from '../../policies/services/policyService';
import { enrollInPolicyTemplate, checkEnrollmentEligibility, validateEnrollmentForm } from '../../policies/services/enrollmentService';

const BrowsePolicies = () => {
  const [policyTemplates, setPolicyTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await getPublicPolicyTemplates();
        setPolicyTemplates(templates);
      } catch (error) {
        console.error('Error fetching policy templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEnrollClick = async (template) => {
    setSelectedTemplate(template);
    setEnrollmentMessage('');
    
    // Check eligibility before showing form
    try {
      const templateId = template.policyId;
      if (!templateId) {
        setEnrollmentMessage('Error: Policy template ID not found.');
        return;
      }
      
      const eligibility = await checkEnrollmentEligibility(templateId);
      if (!eligibility.canEnroll) {
        setEnrollmentMessage(`Cannot enroll: ${eligibility.reason}`);
        return;
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setEnrollmentMessage('Error checking enrollment eligibility. Please try again.');
      return;
    }
    
    setShowEnrollmentForm(true);
  };

  const handleEnrollmentSubmit = async (policyTemplateId, vehicleDetails) => {
    setEnrollmentLoading(true);
    setEnrollmentMessage('');
    
    try {
      // Validate vehicle details before submission
      const validation = validateEnrollmentForm(vehicleDetails);
      if (!validation.isValid) {
        setEnrollmentMessage(`❌ Validation Error: ${validation.errors.join(', ')}`);
        setEnrollmentLoading(false);
        return;
      }

      console.log('📝 Submitting enrollment with vehicle details:', vehicleDetails);
      const enrollment = await enrollInPolicyTemplate(policyTemplateId, vehicleDetails);
      setEnrollmentMessage(`✅ Enrollment submitted successfully! Your enrollment ID is ${enrollment.enrollmentId}. Status: ${enrollment.enrollmentStatus}`);
      setShowEnrollmentForm(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Enrollment failed:', error);
      
      // Handle duplicate vehicle errors (database constraint or backend validation)
      const isDuplicateError = error.message.includes('duplicate') || 
                              error.message.includes('constraint') || 
                              error.message.includes('unique') ||
                              error.message.includes('already enrolled');
      
      if (isDuplicateError) {
        const duplicateMessage = '❌ Vehicle Already Enrolled: This vehicle is already enrolled in the insurance system. Each vehicle can only be enrolled once.';
        
        // Show immediate alert dialog for user attention
        window.alert('⚠️ Duplicate Vehicle Detected\n\n' + 
                    'This vehicle is already enrolled in the insurance system.\n\n' +
                    'Each vehicle can only be enrolled once. Please check your existing policies or contact support if you need assistance.');
        
        // Also set the message in the UI
        setEnrollmentMessage(duplicateMessage);
      } else {
        // Show alert for other enrollment errors too
        window.alert('❌ Enrollment Failed\n\n' + error.message);
        setEnrollmentMessage(`❌ Enrollment failed: ${error.message}`);
      }
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleEnrollmentCancel = () => {
    setShowEnrollmentForm(false);
    setSelectedTemplate(null);
    setEnrollmentMessage('');
  };

  if (loading) {
    return (
      <div style={{ padding: '2em', textAlign: 'center' }}>
        <h2>Loading Policy Templates...</h2>
        <p>Please wait while we fetch available policies.</p>
      </div>
    );
  }

  return (
    <div className="browse-policies">
      <div>
        <h2>Browse Policy Templates</h2>
        <p>Choose from our comprehensive range of insurance policies:</p>

        {Array.isArray(policyTemplates) && policyTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
            <h3>No Policy Templates Available</h3>
            <p>Policy templates are currently not available. Please check back later.</p>
          </div>
        ) : (
          <div
            className="policy-templates-grid"
            style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              marginTop: '20px',
            }}
          >
            {policyTemplates.map((template, index) => (
              <PolicyTemplateCard
                key={template.policyId || index}
                template={template}
                onEnroll={() => handleEnrollClick(template)}
              />
            ))}
          </div>
        )}

        {/* Enrollment Message */}
        {enrollmentMessage && (
          <div 
            style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: enrollmentMessage.startsWith('✅') ? '#d4edda' : '#f8d7da',
              color: enrollmentMessage.startsWith('✅') ? '#155724' : '#721c24',
              border: `1px solid ${enrollmentMessage.startsWith('✅') ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            {enrollmentMessage}
          </div>
        )}

        {/* Enrollment Modal */}
        <EnrollmentModal 
          isOpen={showEnrollmentForm}
          onClose={handleEnrollmentCancel}
          selectedTemplate={selectedTemplate}
          onSubmit={handleEnrollmentSubmit}
          loading={enrollmentLoading}
        />
      </div>
    </div>
  );
};

export default BrowsePolicies;
