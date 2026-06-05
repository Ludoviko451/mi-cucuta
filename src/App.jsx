import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapSection from './components/MapSection';
import IncidentFeed from './components/IncidentFeed';
import ReportModal from './components/ReportModal';
import StatsPanel from './components/StatsPanel';
import ServicesFeed from './components/ServicesFeed';
import RoutesPlanner from './components/RoutesPlanner';
import MarketFeed from './components/MarketFeed';
import { useEffect } from 'react';
import { subscribeIncidents, saveIncident, voteIncident } from './data/firebaseService';
import { INITIAL_SERVICES, addServiceReport } from './data/mockServices';
import { INITIAL_FARMS } from './data/mockFarms';

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [focusedIncident, setFocusedIncident] = useState(null);
  
  // Multi-module states
  const [currentModule, setCurrentModule] = useState('insecurity');
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Modal & Picking States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);
  
  // Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  // Commune Toggles
  const [showComunas, setShowComunas] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState('All');

  // Tab View ('feed' | 'stats')
  const [activeTab, setActiveTab] = useState('feed');

  // Real-time Database Subscription
  useEffect(() => {
    const unsubscribe = subscribeIncidents((data) => {
      setIncidents(data);
    });
    return () => unsubscribe();
  }, []);

  // Waze-style Verification Handlers
  const handleUpvote = (id) => {
    voteIncident(id, 'up');
  };

  const handleDownvote = (id) => {
    voteIncident(id, 'down');
  };

  // Module switcher handler (clears specific module filters/selections)
  const handleModuleChange = (moduleId) => {
    setCurrentModule(moduleId);
    setSelectedRoute(null);
    setFocusedIncident(null);
  };

  // Coordinates Picking Handler
  const handleLocationPick = (coords) => {
    setPickedLocation(coords);
    setIsPickingLocation(false);
    setIsReportModalOpen(true); // Re-open form with picked coordinate
  };

  // Submit New Report
  const handleCreateReport = async (reportData) => {
    if (currentModule === 'services') {
      const updated = addServiceReport(services, reportData);
      setServices(updated);
      // Focus on the newly created service report
      setFocusedIncident(updated[0]);
    } else {
      try {
        const newlyCreated = await saveIncident(reportData);
        setFocusedIncident(newlyCreated);
      } catch (error) {
        console.error("Error creating report:", error);
      }
      // Toggle layer configurations to make sure the user sees their pin
      setShowMarkers(true);
      // Switch to feed view
      setActiveTab('feed');
    }
  };

  // Focus incident from Feed list item
  const handleFocusIncident = (inc) => {
    setFocusedIncident(inc);
    // Ensure markers layer is active
    setShowMarkers(true);
  };

  const handleFocusService = (srv) => {
    setFocusedIncident(srv);
  };

  const handleFocusFarm = (farm) => {
    setFocusedIncident(farm);
  };

  const handleOpenReportModal = () => {
    setPickedLocation(null);
    setIsPickingLocation(false);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setIsPickingLocation(false);
    setPickedLocation(null);
  };

  return (
    <div id="root">
      {/* 1. Left Navigation Menu */}
      <Sidebar currentModule={currentModule} onModuleChange={handleModuleChange} />

      {/* 2. Main Area */}
      <main className="app-content">
        
        {/* Map Workspace */}
        <MapSection
          currentModule={currentModule}
          incidents={incidents}
          services={services}
          farms={farms}
          selectedRoute={selectedRoute}
          onLocationPick={handleLocationPick}
          isPickingLocation={isPickingLocation}
          pickedLocation={pickedLocation}
          focusedIncident={focusedIncident}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          showMarkers={showMarkers}
          setShowMarkers={setShowMarkers}
          showComunas={showComunas}
          setShowComunas={setShowComunas}
          selectedCommune={selectedCommune}
          setSelectedCommune={setSelectedCommune}
        />

        {/* 3. Right Control Panel (Feed/Filters/Stats) */}
        {currentModule === 'insecurity' && (
          activeTab === 'feed' ? (
            <IncidentFeed
              incidents={incidents}
              onFocusIncident={handleFocusIncident}
              focusedIncidentId={focusedIncident ? focusedIncident.id : null}
              onOpenReportModal={handleOpenReportModal}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="feed-panel">
              <div className="feed-header">
                <h2 className="feed-title">Análisis de Incidentes</h2>
                <button 
                  className="btn-report" 
                  onClick={handleOpenReportModal}
                  aria-label="Reportar nuevo incidente de inseguridad"
                >
                  + Reportar Incidente
                </button>
              </div>
              {/* Same Tab Control Bar in Stats panel */}
              <div className="dashboard-controls" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'feed'}
                  className={`btn-tab ${activeTab === 'feed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('feed')}
                >
                  Feed en vivo
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'stats'}
                  className={`btn-tab ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  Estadísticas
                </button>
              </div>
              <StatsPanel incidents={incidents} />
            </div>
          )
        )}

        {currentModule === 'services' && (
          <ServicesFeed
            services={services}
            onFocusService={handleFocusService}
            focusedServiceId={focusedIncident ? focusedIncident.id : null}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {currentModule === 'routes' && (
          <RoutesPlanner
            selectedRouteId={selectedRoute ? selectedRoute.id : null}
            onSelectRoute={setSelectedRoute}
            onClearRoute={() => setSelectedRoute(null)}
          />
        )}

        {currentModule === 'market' && (
          <MarketFeed
            farms={farms}
            onFocusFarm={handleFocusFarm}
            focusedFarmId={focusedIncident ? focusedIncident.id : null}
          />
        )}

      </main>

      {/* 4. Report Form Overlay */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onSubmit={handleCreateReport}
        isPickingLocation={isPickingLocation}
        setIsPickingLocation={setIsPickingLocation}
        pickedLocation={pickedLocation}
        clearPickedLocation={() => setPickedLocation(null)}
        currentModule={currentModule}
      />
    </div>
  );
}
