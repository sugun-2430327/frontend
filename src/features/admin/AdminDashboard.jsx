import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardDataProvider } from "./context/DashboardDataContext";
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import Enrollments from './pages/Enrollments';
import Claims from './pages/Claims';
import Payments from './pages/Payments';
import Support from './pages/Support';
import Users from './pages/Users';
import '../../shared/styles/Dashboard.css';

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Policies':
        return <Policies />;
      case 'Enrollments':
        return <Enrollments />;
      case 'Claims':
        return <Claims />;
      case 'Payments':
        return <Payments />;
      case 'Support':
        return <Support />;
      case 'Users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardDataProvider>
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Admin Panel</h3>
          <ul>
            {['Dashboard', 'Policies', 'Enrollments', 'Claims', 'Payments', 'Support', 'Users'].map((tab) => (
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
    </DashboardDataProvider>
  );
}

export default AdminDashboard;
