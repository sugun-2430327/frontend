import React, { createContext, useState, useEffect } from "react";
import { getPublicPolicyTemplates } from "../../policies/services/policyService";
import { getAllClaims, formatClaimForDisplay } from "../../claims/services/claimsService";
import { getMyEnrollments } from "../../policies/services/enrollmentService";
import { getAllTickets, formatTicketForDisplay } from '../../admin/services/supportService';
import { getCurrentUserProfile, formatUserForDisplay } from '../../admin/services/userService';

export const CustomerDataContext = createContext();

export const CustomerDataProvider = ({ children }) => {
  // Customer Dashboard Data State
  const [customerData, setCustomerData] = useState({
    // Policy Templates
    totalPolicyTemplates: 0,
    availablePolicies: [],
    
    // Claims
    totalClaims: 0,
    openClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    claims: [],
    
    // Enrollments 
    totalEnrollments: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0,
    declinedEnrollments: 0,
    enrollments: [],
    activePolicies: 0, // Approved enrollments = active policies
    
    // Support Tickets
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    tickets: [],
    
    // User Profile
    profile: null
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all customer dashboard data
  const fetchCustomerData = async () => {
    try {
      setError('');
      setLoading(true);
      
      
      // Fetch all data concurrently
      const [
        policyTemplatesResponse,
        claimsResponse,
        enrollmentsResponse,
        ticketsResponse,
        profileResponse
      ] = await Promise.allSettled([
        getPublicPolicyTemplates(),
        getAllClaims(),
        getMyEnrollments(),
        getAllTickets(),
        getCurrentUserProfile()
      ]);
      
      // Process policy templates data
      let policyTemplates = [];
      if (policyTemplatesResponse.status === 'fulfilled') {
        policyTemplates = policyTemplatesResponse.value || [];
      }
      
      // Process claims data with formatting
      let claims = [];
      if (claimsResponse.status === 'fulfilled') {
        const rawClaims = claimsResponse.value || [];
        claims = rawClaims.map(formatClaimForDisplay);
      }
      
      // Process enrollments data
      let enrollments = [];
      if (enrollmentsResponse.status === 'fulfilled') {
        enrollments = enrollmentsResponse.value || [];
      }
      
      // Process tickets data with formatting
      let tickets = [];
      if (ticketsResponse.status === 'fulfilled') {
        const rawTickets = ticketsResponse.value || [];
        tickets = rawTickets.map(formatTicketForDisplay);
      }
      
      // Process user profile data
      let profile = null;
      if (profileResponse.status === 'fulfilled') {
        const rawProfile = profileResponse.value;
        profile = rawProfile ? formatUserForDisplay(rawProfile) : null;
      }
      
      // Transform policy templates for UI
      const transformedTemplates = policyTemplates.map(policy => ({
        id: policy.policyId,
        policyId: policy.policyId,
        name: `${policy.coverageType} Template`,
        coverageType: policy.coverageType,
        description: `${policy.coverageType} policy template with comprehensive coverage.`,
        features: getFeaturesByCoverageType(policy.coverageType),
        basePrice: `₹${policy.premiumAmount?.toLocaleString('en-IN') || '0'}`,
        coverageAmount: `₹${policy.coverageAmount?.toLocaleString('en-IN') || '0'}`,
        category: getCategoryByCoverageType(policy.coverageType),
        policyNumber: policy.policyNumber,
        vehicleDetails: policy.vehicleDetails,
        premiumAmount: policy.premiumAmount,
        startDate: policy.startDate,
        endDate: policy.endDate
      }));
      
      // Calculate customer dashboard statistics
      const newCustomerData = {
        // Policy Templates
        totalPolicyTemplates: transformedTemplates.length,
        availablePolicies: transformedTemplates,
        
        // Claims
        totalClaims: claims.length,
        openClaims: claims.filter(c => ['OPEN', 'SUBMITTED', 'PENDING'].includes(c.status)).length,
        approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
        rejectedClaims: claims.filter(c => c.status === 'REJECTED').length,
        claims: claims,
        
        // Enrollments
        totalEnrollments: enrollments.length,
        pendingEnrollments: enrollments.filter(e => e.enrollmentStatus === 'PENDING').length,
        approvedEnrollments: enrollments.filter(e => e.enrollmentStatus === 'APPROVED').length,
        declinedEnrollments: enrollments.filter(e => e.enrollmentStatus === 'DECLINED').length,
        enrollments: enrollments,
        activePolicies: enrollments.filter(e => e.enrollmentStatus === 'APPROVED').length,
        
        // Support Tickets
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length,
        resolvedTickets: tickets.filter(t => t.status === 'RESOLVED').length,
        tickets: tickets,
        
        // User Profile
        profile: profile
      };
      
      setCustomerData(newCustomerData);
      setLastUpdated(new Date());
      
      
    } catch (err) {
      console.error('Error fetching customer dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions for template transformation
  const getFeaturesByCoverageType = (coverageType) => {
    const featureMap = {
      'Comprehensive': ['Own Damage Cover', 'Third Party Liability', 'Theft Protection', 'Natural Disasters'],
      'Third Party': ['Third Party Liability', 'Legal Compliance', 'Bodily Injury Cover', 'Property Damage'],
      'Zero Depreciation': ['Zero Depreciation', 'Complete Part Replacement', 'Higher Claim Amount'],
      'Own Damage': ['Own Damage Cover', 'Accidental Damage', 'Natural Calamities'],
      'Personal Accident': ['Accidental Death', 'Disability Benefits', 'Medical Expenses']
    };
    return featureMap[coverageType] || ['Standard Coverage', 'Legal Protection'];
  };

  const getCategoryByCoverageType = (coverageType) => {
    if (coverageType?.toLowerCase().includes('bike')) return 'Bike';
    if (coverageType?.toLowerCase().includes('commercial')) return 'Commercial';
    if (coverageType?.toLowerCase().includes('personal')) return 'Personal';
    return 'Car';
  };
  
  // Auto-refresh data every 5 minutes
  useEffect(() => {
    fetchCustomerData();
    
    const interval = setInterval(() => {
      fetchCustomerData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Manual refresh function
  const refreshDashboard = () => {
    fetchCustomerData();
  };

  return (
    <CustomerDataContext.Provider
      value={{
        // Data
        ...customerData,
        
        // State
        loading,
        error,
        lastUpdated,
        
        // Actions
        refreshDashboard,
        fetchCustomerData
      }}
    >
      {children}
    </CustomerDataContext.Provider>
  );
};
