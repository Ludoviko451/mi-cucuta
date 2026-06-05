import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapSection from './components/MapSection';
import IncidentFeed from './components/IncidentFeed';
import ReportModal from './components/ReportModal';
import StatsPanel from './components/StatsPanel';
import { useEffect } from 'react';
import { subscribeIncidents, saveIncident, voteIncident } from './data/firebaseService';

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [focusedIncident, setFocusedIncident] = useState(null);
  
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

  // Coordinates Picking Handler
  const handleLocationPick = (coords) => {
    setPickedLocation(coords);
    setIsPickingLocation(false);
    setIsReportModalOpen(true); // Re-open form with picked coordinate
  };

  // Submit New Report
  const handleCreateReport = async (reportData) => {
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
  };

  // Focus incident from Feed list item
  const handleFocusIncident = (inc) => {
    setFocusedIncident(inc);
    // Ensure markers layer is active
    setShowMarkers(true);
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
      <Sidebar />

      {/* 2. Main Area */}
      <main className="app-content">
        
        {/* Map Workspace */}
        <MapSection
          incidents={incidents}
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
        {activeTab === 'feed' ? (
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
      />
    </div>
  );
}
