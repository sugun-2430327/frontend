import React, { createContext, useState, useEffect } from "react";
import { getAllPolicies } from "../../policies/services/policyService";
import { getAllClaims, formatClaimForDisplay } from "../../claims/services/claimsService";
import { getAllEnrollments } from "../../policies/services/enrollmentService";
import { getAllTickets, formatTicketForDisplay } from '../services/supportService';
import { getAllUsersDetailed, formatUserForDisplay } from '../services/userService';

export const DashboardDataContext = createContext();

export const DashboardDataProvider = ({ children }) => {
  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    inactivePolicies: 0,
    totalClaims: 0,
    openClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0,
    declinedEnrollments: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    totalUsers: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalPayments: 0 // This might need a separate API if available
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setError('');
      setLoading(true);
      
      
      // Fetch all data concurrently
      const [
        policiesResponse,
        claimsResponse,
        enrollmentsResponse,
        ticketsResponse,
        usersResponse
      ] = await Promise.allSettled([
        getAllPolicies(),
        getAllClaims(),
        getAllEnrollments(),
        getAllTickets(),
        getAllUsersDetailed()
      ]);
      
      // Process policies data
      let policies = [];
      if (policiesResponse.status === 'fulfilled') {
        policies = policiesResponse.value || [];
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
      
      // Process users data with formatting
      let users = [];
      if (usersResponse.status === 'fulfilled') {
        const rawUsers = usersResponse.value || [];
        users = rawUsers.map(formatUserForDisplay);
      }
      
      // Calculate dashboard statistics
      const newDashboardData = {
        // Policies
        totalPolicies: policies.length,
        activePolicies: policies.filter(p => p.policyStatus === 'ACTIVE').length,
        inactivePolicies: policies.filter(p => p.policyStatus === 'INACTIVE').length,
        
        // Claims
        totalClaims: claims.length,
        openClaims: claims.filter(c => ['OPEN', 'SUBMITTED', 'PENDING'].includes(c.status)).length,
        approvedClaims: claims.filter(c => c.status === 'APPROVED').length,
        rejectedClaims: claims.filter(c => c.status === 'REJECTED').length,
        
        // Enrollments
        totalEnrollments: enrollments.length,
        pendingEnrollments: enrollments.filter(e => e.enrollmentStatus === 'PENDING').length,
        approvedEnrollments: enrollments.filter(e => e.enrollmentStatus === 'APPROVED').length,
        declinedEnrollments: enrollments.filter(e => e.enrollmentStatus === 'DECLINED').length,
        
        // Support Tickets
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => ['OPEN', 'IN_PROGRESS'].includes(t.status)).length,
        resolvedTickets: tickets.filter(t => t.status === 'RESOLVED').length,
        
        // Users
        totalUsers: users.length,
        totalCustomers: users.filter(u => u.role === 'CUSTOMER').length,
        totalAdmins: users.filter(u => u.role === 'ADMIN').length,
        
        // Payments (placeholder - would need separate API)
        totalPayments: 0
      };
      
      setDashboardData(newDashboardData);
      setLastUpdated(new Date());
      
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-refresh data every 5 minutes
  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Manual refresh function
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  return (
    <DashboardDataContext.Provider
      value={{
        // Data
        ...dashboardData,
        
        // Legacy compatibility (for existing components)
        totalPolicies: dashboardData.totalPolicies,
        totalClaims: dashboardData.approvedClaims, // Changed to approved claims for legacy compat
        pendingClaims: dashboardData.openClaims, // Changed to open claims for legacy compat
        totalPayments: dashboardData.totalPayments,
        
        // State
        loading,
        error,
        lastUpdated,
        
        // Actions
        refreshDashboard,
        fetchDashboardData,
        
        // Legacy compatibility (deprecated - use auto-refresh instead)
        setTotalPolicies: () => console.warn('setTotalPolicies is deprecated - dashboard now auto-refreshes'),
        setTotalClaims: () => console.warn('setTotalClaims is deprecated - dashboard now auto-refreshes'),
        setPendingClaims: () => console.warn('setPendingClaims is deprecated - dashboard now auto-refreshes'),
        setTotalPayments: () => console.warn('setTotalPayments is deprecated - dashboard now auto-refreshes')
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};
