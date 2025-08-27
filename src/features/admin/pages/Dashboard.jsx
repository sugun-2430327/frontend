import React, { useContext } from "react";
import { DashboardDataContext } from "../context/DashboardDataContext";

function Dashboard() {
  const {
    // All dashboard data from context
    totalPolicies,
    activePolicies,
    inactivePolicies,
    totalClaims,
    openClaims,
    approvedClaims,
    rejectedClaims,
    totalEnrollments,
    pendingEnrollments,
    approvedEnrollments,
    declinedEnrollments,
    totalTickets,
    openTickets,
    resolvedTickets,
    totalUsers,
    totalCustomers,
    totalAdmins,
    totalPayments,
    loading,
    error,
    lastUpdated,
    refreshDashboard
  } = useContext(DashboardDataContext);

  const cardStyle = {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    border: "1px solid #e1e5e9"
  };

  const primaryCardStyle = {
    ...cardStyle,
    color: "black"
  };

  const successCardStyle = {
    ...cardStyle,
    color: "black"
  };

  const warningCardStyle = {
    ...cardStyle,
    color: "black"
  };

  const infoCardStyle = {
    ...cardStyle,
    color: "black"
  };

  if (loading) {
    return (
      <div className="page" style={{ padding: "2em" }}>
        <div style={{ textAlign: "center", padding: "4em" }}>
          <h2>Loading Dashboard Data...</h2>
          <p style={{ color: "#666" }}>Fetching real-time statistics from all systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" style={{ padding: "2em" }}>
        <div style={{ textAlign: "center", padding: "2em" }}>
          <h2 style={{ color: "#d32f2f" }}>Dashboard Error</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>{error}</p>
          <button
            onClick={refreshDashboard}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Retry Loading Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ padding: "2em" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2em" }}>
        <div>
          <h1 style={{ margin: "0 0 5px 0" }}>Admin Dashboard</h1>
        </div>
        {/* <button
          onClick={refreshDashboard}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          Refresh Data
        </button> */}
      </div>

      {/* Main Statistics Grid */}
      <div style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        marginBottom: "30px"
      }}>
        
        {/* Policies Section */}
        <div style={primaryCardStyle}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color:'#1796d2' }}>Policy Templates</h3>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
            {totalPolicies.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.9 }}>
            <span>Active: {activePolicies}</span>
            <span>Inactive: {inactivePolicies}</span>
          </div>
        </div>

        {/* Claims Section */}
        <div style={successCardStyle}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color:'#1796d2' }}>Insurance Claims</h3>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
            {totalClaims.toLocaleString()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", fontSize: "12px", opacity: 0.9 }}>
            <span>Open: {openClaims}</span>
            <span>Approved: {approvedClaims}</span>
            <span>Rejected: {rejectedClaims}</span>
          </div>
        </div>

        {/* Enrollments Section */}
        <div style={infoCardStyle}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color:'#1796d2' }}>Enrollments</h3>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
            {totalEnrollments.toLocaleString()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", fontSize: "12px", opacity: 0.9 }}>
            <span>Pending: {pendingEnrollments}</span>
            <span>Approved: {approvedEnrollments}</span>
            <span>Declined: {declinedEnrollments}</span>
          </div>
        </div>

        {/* Users Section */}
        <div style={warningCardStyle}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color:'#1796d2' }}>User Management</h3>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
            {totalUsers.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.9 }}>
            <span>Customers: {totalCustomers}</span>
            <span>Admins: {totalAdmins}</span>
          </div>
        </div>
      </div>

      {/* Secondary Statistics */}
      <div style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
      }}>
        
        {/* Support Tickets */}
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 15px 0", color: "#1976d2" }}>Support Tickets</h4>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px", color: "#333" }}>
            {totalTickets.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
            <span>Open: {openTickets}</span>
            <span>Resolved: {resolvedTickets}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 15px 0", color: "#1976d2" }}>Urgent Actions</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: pendingEnrollments > 0 ? "#d32f2f" : "#666" }}>
              {pendingEnrollments} enrollments need approval
            </div>
            <div style={{ fontSize: "13px", color: openClaims > 0 ? "#d32f2f" : "#666" }}>
              {openClaims} claims need review
            </div>
            <div style={{ fontSize: "13px", color: openTickets > 0 ? "#d32f2f" : "#666" }}>
              {openTickets} support tickets open
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Dashboard;
