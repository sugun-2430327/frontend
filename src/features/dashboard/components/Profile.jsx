import React, { useState, useEffect } from 'react';
import { 
  getCurrentUserProfile,
  formatUserForDisplay,
  getUserRoleBadge,
  formatIncome,
  getIdProofFileIcon,
  getIdProofFilename,
  getUserDisplayName,
  getUserAvatarPlaceholder
} from '../../admin/services/userService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await getCurrentUserProfile();
      const formattedProfile = formatUserForDisplay(response);
      setProfile(formattedProfile);
    } catch (err) {
      setError('Failed to load your profile. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>My Profile</h2>
      
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
            onClick={fetchProfile}
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
          <h3>Loading Your Profile...</h3>
          <p>Please wait while we fetch your information.</p>
        </div>
      ) : !profile ? (
        <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
          <h3>Profile Not Found</h3>
          <p>Unable to load your profile information.</p>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Profile Header */}
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '32px'
              }}>
                {getUserAvatarPlaceholder(profile)}
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{getUserDisplayName(profile)}</h3>
                <span style={getUserRoleBadge(profile.role)}>{profile.role}</span>
                <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  User ID
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {profile.userId}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  First Name
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {profile.firstName || 'Not provided'}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  Last Name
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {profile.lastName || 'Not provided'}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  Username
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {profile.username}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  Email Address
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {profile.email}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  Account Role
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {profile.role}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {/* <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>Additional Information</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  Annual Income
                </label>
                <p style={{ margin: 0, padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  {formatIncome(profile.incomePerAnnum)}
                </p>
                <small style={{ color: '#666', fontSize: '12px' }}>
                  This information helps us provide better insurance recommendations.
                </small>
              </div>

              <div>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                  ID Proof Document
                </label>
                <div style={{ 
                  padding: '8px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '20px' }}>{getIdProofFileIcon(profile.idProofFilePath)}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>
                      {getIdProofFilename(profile.idProofFilePath)}
                    </p>
                    {profile.idProofFilePath && (
                      <small style={{ color: '#666', fontSize: '11px' }}>
                        Uploaded and verified
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Profile Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Profile Actions</h4>
            <p style={{ margin: '0 0 20px 0', color: '#666' }}>
              Need to update your profile information? Contact our support team.
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={() => navigate('/contact')}
              >
                 Contact Support
              </button>
              
              <button
                onClick={fetchProfile}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Refresh Profile
              </button>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
                <strong>💡 Tip:</strong> Keep your profile information up to date to ensure you receive 
                the best insurance recommendations and important account notifications.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
