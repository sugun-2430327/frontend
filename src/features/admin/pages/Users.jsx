import React, { useState, useEffect } from 'react';
import { 
  getAllUsersDetailed, 
  getAllCustomersDetailed, 
  getUserDetailsById,
  formatUserForDisplay, 
  getUserRoleBadge, 
  formatIncome, 
  getIdProofFileIcon, 
  getIdProofFilename,
  getUserDisplayName,
  getUserAvatarPlaceholder,
  isAdmin,
  isCustomer
} from '../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError('');
      setLoading(true);
      const response = filterRole === 'customers' ? await getAllCustomersDetailed() : await getAllUsersDetailed();
      const formattedUsers = response.map(formatUserForDisplay);
      setUsers(formattedUsers);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
    fetchUsers();
  };

  const openUserDetails = async (user) => {
    try {
      const detailedUser = await getUserDetailsById(user.userId);
      setSelectedUser(formatUserForDisplay(detailedUser));
      setShowUserDetails(true);
    } catch (err) {
      setError(`Failed to load user details: ${err.message}`);
      console.error('Error fetching user details:', err);
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' || 
      (filterRole === 'customers' && isCustomer(user)) ||
      (filterRole === 'admins' && isAdmin(user));
    
    return matchesSearch && matchesRole;
  });

  // Get user counts for summary
  const userCounts = {
    total: users.length,
    customers: users.filter(isCustomer).length,
    admins: users.filter(isAdmin).length
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      {/* Filter Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {['all', 'customers', 'admins'].map((role) => (
          <button
            key={role}
            onClick={() => handleFilterChange(role)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: filterRole === role ? '#007bff' : 'transparent',
              color: filterRole === role ? 'white' : '#007bff',
              borderBottom: filterRole === role ? '2px solid #007bff' : 'none',
              cursor: 'pointer',
              marginRight: '10px',
              textTransform: 'capitalize'
            }}
          >
            {role === 'all' ? `All Users (${userCounts.total})` : 
             role === 'customers' ? `Customers (${userCounts.customers})` :
             role === 'admins' ? `Admins (${userCounts.admins})` :
             `${role} (0)`}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {filterRole === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#007bff', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>Total Users</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userCounts.total}
            </p>
          </div>
          <div style={{ backgroundColor: '#17a2b8', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>Customers</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userCounts.customers}
            </p>
          </div>
          <div style={{ backgroundColor: '#dc3545', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>Admins</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {userCounts.admins}
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search users by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '4px',
          margin: '20px 0',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchUsers}
            style={{
              marginLeft: '10px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>Loading Users...</h3>
          <p>Please wait while we fetch the user data.</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>No Users Found</h3>
          <p>
            {searchTerm 
              ? `No users found matching "${searchTerm}".` 
              : filterRole === 'all' 
                ? 'No users have been registered yet.' 
                : `No users with ${filterRole} role found.`
            }
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                {/* <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Income</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID Proof</th> */}
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}>
                        {getUserAvatarPlaceholder(user)}
                      </div> */}
                      <div>
                        <strong>{getUserDisplayName(user)}</strong>
                        <div style={{ fontSize: '11px', color: '#666' }}>ID: {user.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={getUserRoleBadge(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  {/* <td style={{ padding: '10px' }}>{formatIncome(user.incomePerAnnum)}</td> */}
                  {/* <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>{getIdProofFileIcon(user.idProofFilePath)}</span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {getIdProofFilename(user.idProofFilePath)}
                      </span>
                    </div>
                  </td> */}
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => openUserDetails(user)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>User Details</h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '24px'
                }}>
                  {getUserAvatarPlaceholder(selectedUser)}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{getUserDisplayName(selectedUser)}</h4>
                  <span style={getUserRoleBadge(selectedUser.role)}>{selectedUser.role}</span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>User ID:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{selectedUser.userId}</p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>First Name:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{selectedUser.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>Last Name:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{selectedUser.lastName || 'Not provided'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>Username:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{selectedUser.username}</p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>Email:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{selectedUser.email}</p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>Role:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{selectedUser.role}</p>
                </div>
                {/* <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>Annual Income:</label>
                  <p style={{ margin: '5px 0 0 0' }}>{formatIncome(selectedUser.incomePerAnnum)}</p>
                </div> */}
                {/* <div>
                  <label style={{ fontWeight: 'bold', color: '#333' }}>ID Proof:</label>
                  <p style={{ margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>{getIdProofFileIcon(selectedUser.idProofFilePath)}</span>
                    {getIdProofFilename(selectedUser.idProofFilePath)}
                  </p>
                  {selectedUser.idProofFilePath && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                      Path: {selectedUser.idProofFilePath}
                    </p>
                  )}
                </div> */}
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setShowUserDetails(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
