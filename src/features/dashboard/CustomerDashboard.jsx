// import React from 'react';

// function CustomerDashboard({ user }) {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Customer Dashboard</h2>
//       <p>Welcome back, {user.name}!</p>
//       {/* Add more customer-specific components here */}
//     </div>
//   );
// }

// export default CustomerDashboard;


import React, { useState, useEffect } from 'react';
import { CustomerDataProvider } from './context/CustomerDataContext';
import DashboardSummary from './components/DashboardSummary';
import MyPolicies from './components/MyPolicies';
import MyEnrollments from './components/MyEnrollments';
import BrowsePolicies from './components/BrowsePolicies';
import Claims from './components/Claims';
import Payments from './components/Payments';
import Support from './components/Support';
import Profile from './components/Profile';
import '../../shared/styles/Dashboard.css';

const availableCoverageTypes = [
  'Comprehensive Insurance',
  'Commercial Vehicle Insurance',
  'Third Party Insurance',
  'Third-Party Liabilities',
  'Zero Depreciation',
  'Roadside Assistance Cover',
  'Own Damage Insurance',
  'Personal Accident Cover',
  'Bike Insurance',
];

// Will be replaced by API data

function CustomerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToTab = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('navigateToTab', handleNavigateToTab);
    
    return () => {
      window.removeEventListener('navigateToTab', handleNavigateToTab);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardSummary />;
      case 'My Policies':
        return <MyPolicies />;
      case 'My Enrollments':
        return <MyEnrollments />;
      case 'Claims':
        return <Claims />;
      case 'Payments':
        return <Payments />;
      case 'Support':
        return <Support />;
      case 'Browse Policies':
        return <BrowsePolicies />;
      case 'Profile':
        return <Profile />;
      default:
        return <DashboardSummary />;
    }
  };



   
  // const [showProfile, setShowProfile] = useState(false);
  return (
    <CustomerDataProvider>
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Customer Panel</h3>
          <ul>
            {['Dashboard', 'My Policies', 'My Enrollments', 'Claims', 'Payments', 'Support', 'Browse Policies', 'Profile'].map((tab) => (
              <li
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </CustomerDataProvider>
  );
}

export default CustomerDashboard;
