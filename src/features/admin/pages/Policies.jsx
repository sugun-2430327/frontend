import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { DashboardDataContext } from "../context/DashboardDataContext";
import { getAllPolicies, createPolicy, updatePolicy, deletePolicy } from "../../policies/services/policyService";

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPolicyId, setExpandedPolicyId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  // Dashboard context now auto-manages all data - no manual updates needed
  
  const [policyForm, setPolicyForm] = useState({
    policyNumber: '',
    vehicleType: '',
    coverageType: '',
    coverageAmount: '',
    premiumAmount: '',
    startDate: '',
    endDate: '',
    policyStatus: 'ACTIVE'
  });

  // Fetch policies from API
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllPolicies();
      setPolicies(data);
      // Dashboard context now auto-fetches and updates policy counts
    } catch (error) {
      setError(error.message);
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Handle form submission for create/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const policyData = {
        policyNumber: policyForm.policyNumber,
        vehicleType: policyForm.vehicleType,
        coverageType: policyForm.coverageType,
        coverageAmount: parseFloat(policyForm.coverageAmount),
        premiumAmount: parseFloat(policyForm.premiumAmount),
        startDate: policyForm.startDate,
        endDate: policyForm.endDate,
        policyStatus: policyForm.policyStatus
      };

      if (editingPolicy) {
        await updatePolicy(editingPolicy.policyId, policyData);
      } else {
        await createPolicy(policyData);
      }
      
      // Refresh policies list
      await fetchPolicies();
      
      // Reset form
      setPolicyForm({
        policyNumber: '',
        vehicleType: '',
        coverageType: '',
        coverageAmount: '',
        premiumAmount: '',
        startDate: '',
        endDate: '',
        policyStatus: 'ACTIVE'
      });
      setShowCreateForm(false);
      setEditingPolicy(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle policy deletion
  const handleDeletePolicy = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await deletePolicy(policyId);
        await fetchPolicies();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Handle edit policy
  const handleEditPolicy = (policy) => {
    setPolicyForm({
      policyNumber: policy.policyNumber,
      vehicleType: policy.vehicleType || policy.vehicleDetails, // Backwards compatibility
      coverageType: policy.coverageType,
      coverageAmount: policy.coverageAmount?.toString() || '',
      premiumAmount: policy.premiumAmount?.toString() || '',
      startDate: policy.startDate,
      endDate: policy.endDate,
      policyStatus: policy.policyStatus
    });
    setEditingPolicy(policy);
    setShowCreateForm(true);
  };

  const toggleView = (policyId) => {
    setExpandedPolicyId(expandedPolicyId === policyId ? null : policyId);
  };

  const activePolicies = policies.filter((p) => p.policyStatus === "ACTIVE");
  const inactivePolicies = policies.filter((p) => p.policyStatus === "INACTIVE");

  if (loading) {
    return (
      <div style={{ padding: "2em", textAlign: "center" }}>
        <h2>Policy Management</h2>
        <p>Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="admin-policies" style={{ padding: "2em" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2em' }}>
        <h2>Policy Management</h2>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingPolicy(null);
            setPolicyForm({
              policyNumber: '',
              vehicleDetails: '',
              coverageType: '',
              coverageAmount: '',
              premiumAmount: '',
              startDate: '',
              endDate: '',
              policyStatus: 'ACTIVE'
            });
          }}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Create New Policy Template
        </button>
      </div>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3>{editingPolicy ? 'Edit Policy Template' : 'Create New Policy Template'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Policy Number *</label>
                <input
                  type="text"
                  value={policyForm.policyNumber}
                  onChange={(e) => setPolicyForm({...policyForm, policyNumber: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Coverage Type *</label>
                <select
                  value={policyForm.coverageType}
                  onChange={(e) => setPolicyForm({...policyForm, coverageType: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select Coverage Type</option>
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Third Party">Third Party</option>
                  <option value="Zero Depreciation">Zero Depreciation</option>
                  <option value="Own Damage">Own Damage</option>
                  <option value="Personal Accident">Personal Accident</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vehicle Type *</label>
              <select
                value={policyForm.vehicleType}
                onChange={(e) => setPolicyForm({...policyForm, vehicleType: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select vehicle type...</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="truck">Truck</option>
                <option value="bus">Bus</option>
                <option value="van">Van</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Coverage Amount *</label>
                <input
                  type="number"
                  value={policyForm.coverageAmount}
                  onChange={(e) => setPolicyForm({...policyForm, coverageAmount: e.target.value})}
                  min="1"
                  step="0.01"
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Premium Amount *</label>
                <input
                  type="number"
                  value={policyForm.premiumAmount}
                  onChange={(e) => setPolicyForm({...policyForm, premiumAmount: e.target.value})}
                  min="1"
                  step="0.01"
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Date *</label>
                <input
                  type="date"
                  value={policyForm.startDate}
                  onChange={(e) => setPolicyForm({...policyForm, startDate: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>End Date *</label>
                <input
                  type="date"
                  value={policyForm.endDate}
                  onChange={(e) => setPolicyForm({...policyForm, endDate: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status *</label>
                <select
                  value={policyForm.policyStatus}
                  onChange={(e) => setPolicyForm({...policyForm, policyStatus: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingPolicy ? 'Update Policy' : 'Create Policy'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPolicy(null);
                }}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3>Policy Templates ({policies.length})</h3>
        {policies.length === 0 ? (
          <p style={{ color: 'gray' }}>No policy templates found. Create your first template above.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Policy Number</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Vehicle Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Coverage Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Coverage Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Premium</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.policyId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{policy.policyId}</td>
                  <td style={{ padding: '10px' }}>{policy.policyNumber}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      textTransform: 'capitalize'
                    }}>
                      {policy.vehicleType || policy.vehicleDetails || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{policy.coverageType}</td>
                  <td style={{ padding: '10px' }}>₹{policy.coverageAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px' }}>₹{policy.premiumAmount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: policy.policyStatus === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                      color: policy.policyStatus === 'ACTIVE' ? '#155724' : '#721c24'
                    }}>
                      {policy.policyStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        style={{
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.policyId)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPolicies;
