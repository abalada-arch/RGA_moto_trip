import React, { useState } from 'react';
import Layout from './components/Layout';
import ItineraryModule from './components/ItineraryModule';
import CoordinationModule from './components/CoordinationModule';
import OrganizationModule from './components/OrganizationModule';
import SettingsModule from './components/SettingsModule';
import DrivingInterface from './components/DrivingInterface';

function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isDrivingMode, setIsDrivingMode] = useState(false);

  const renderActiveModule = () => {
    if (isDrivingMode) {
      return <DrivingInterface activeTab={activeTab} onTabChange={setActiveTab} />;
    }

    switch (activeTab) {
      case 'itinerary':
        return <ItineraryModule />;
      case 'coordination':
        return <CoordinationModule />;
      case 'organization':
        return <OrganizationModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <ItineraryModule />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      isDrivingMode={isDrivingMode}
      onModeChange={setIsDrivingMode}
    >
      {renderActiveModule()}
    </Layout>
  );
}

export default App;