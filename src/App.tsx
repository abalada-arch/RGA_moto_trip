import React, { useState } from 'react';
import Layout from './components/Layout';
import ItineraryModule from './components/ItineraryModule';
import CoordinationModule from './components/CoordinationModule';
import OrganizationModule from './components/OrganizationModule';

function App() {
  const [activeTab, setActiveTab] = useState('itinerary');

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'itinerary':
        return <ItineraryModule />;
      case 'coordination':
        return <CoordinationModule />;
      case 'organization':
        return <OrganizationModule />;
      default:
        return <ItineraryModule />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveModule()}
    </Layout>
  );
}

export default App;