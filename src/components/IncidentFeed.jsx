import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Skull, 
  ShieldAlert, 
  Flame, 
  AlertTriangle,
  Frown,
  ThumbsUp, 
  ThumbsDown,
  BarChart3,
  List
} from 'lucide-react';
import { filterIncidents } from '../data/mockIncidents';

// Formatter for relative timestamps
function formatTimeAgo(isoString) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Hace unos momentos';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return `Hace ${diffDays} d`;
}

export default function IncidentFeed({
  incidents,
  onFocusIncident,
  focusedIncidentId,
  onOpenReportModal,
  onUpvote,
  onDownvote,
  activeTab,
  setActiveTab
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [votedIncidents, setVotedIncidents] = useState({}); // { [incId]: 'up' | 'down' }

  // Apply filters
  const filtered = filterIncidents(incidents, {
    search,
    type: typeFilter,
    timeRange: timeFilter
  });

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'Robo':
        return <Skull size={14} style={{ color: 'var(--color-robo)' }} />;
      case 'Intento de robo':
        return <ShieldAlert size={14} style={{ color: 'var(--color-intento)' }} />;
      case 'Consumo de drogas':
        return <Frown size={14} style={{ color: 'var(--color-drogas)' }} />;
      case 'Riñas':
        return <Flame size={14} style={{ color: 'var(--color-rinas)' }} />;
      case 'Zonas peligrosas':
        return <AlertTriangle size={14} style={{ color: 'var(--color-zonas)' }} />;
      default:
        return <ShieldAlert size={14} />;
    }
  };

  const getIncidentIconBg = (type) => {
    switch (type) {
      case 'Robo': return 'rgba(239, 68, 68, 0.15)';
      case 'Intento de robo': return 'rgba(249, 115, 22, 0.15)';
      case 'Consumo de drogas': return 'rgba(168, 85, 247, 0.15)';
      case 'Riñas': return 'rgba(234, 179, 8, 0.15)';
      case 'Zonas peligrosas': return 'rgba(236, 72, 153, 0.15)';
      default: return 'rgba(229, 62, 62, 0.15)';
    }
  };

  const handleVote = (e, incId, voteType) => {
    e.stopPropagation(); // Avoid triggering card focus
    
    // Check if already voted
    if (votedIncidents[incId]) return;

    if (voteType === 'up') {
      onUpvote(incId);
      setVotedIncidents(prev => ({ ...prev, [incId]: 'up' }));
    } else {
      onDownvote(incId);
      setVotedIncidents(prev => ({ ...prev, [incId]: 'down' }));
    }
  };

  return (
    <aside className="feed-panel">
      {/* Header section with buttons */}
      <div className="feed-header">
        <div className="feed-title-row">
          <h2 className="feed-title">Reportes Ciudadanos</h2>
          <span className="incident-badge-count" aria-label={`${filtered.length} reportes activos`}>
            {filtered.length} Activos
          </span>
        </div>
        
        <button 
          className="btn-report" 
          onClick={onOpenReportModal}
          aria-label="Reportar nuevo incidente de inseguridad"
        >
          <Plus size={16} />
          Reportar Incidente
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="dashboard-controls" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'feed'}
          className={`btn-tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <List size={14} />
          Feed en vivo
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'stats'}
          className={`btn-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={14} />
          Estadísticas
        </button>
      </div>

      {activeTab === 'feed' && (
        <>
          {/* Search and Filters Bar */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--border-light)' }}>
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Buscar por barrio o descripción..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar incidentes"
              />
            </div>
            <div className="filters-row">
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filtrar por tipo"
              >
                <option value="All">Todos los Tipos</option>
                <option value="Robo">Robo</option>
                <option value="Intento de robo">Intento de robo</option>
                <option value="Consumo de drogas">Consumo de drogas</option>
                <option value="Riñas">Riñas</option>
                <option value="Zonas peligrosas">Zona Peligrosa</option>
              </select>

              <select
                className="filter-select"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                aria-label="Filtrar por antigüedad"
              >
                <option value="All">Cualquier fecha</option>
                <option value="24h">Últimas 24 horas</option>
                <option value="7d">Últimos 7 días</option>
              </select>
            </div>
          </div>

          {/* List Scroll Section */}
          <div className="feed-content">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <AlertTriangle size={32} />
                <p>No se encontraron reportes con los filtros aplicados en Cúcuta.</p>
              </div>
            ) : (
              filtered.map((inc) => {
                const iconBg = getIncidentIconBg(inc.type);
                const isFocused = inc.id === focusedIncidentId;
                const userVote = votedIncidents[inc.id];

                return (
                  <div
                    key={inc.id}
                    className={`incident-card fade-in ${isFocused ? 'focused' : ''}`}
                    onClick={() => onFocusIncident(inc)}
                  >
                    {/* Header */}
                    <div className="card-header">
                      <div className="card-type-group">
                        <div className="card-icon" style={{ backgroundColor: iconBg }}>
                          {getIncidentIcon(inc.type)}
                        </div>
                        <span className="card-type-title">{inc.type}</span>
                      </div>
                      <span 
                        className="severity-pill"
                        style={{
                          backgroundColor: inc.severity === 'Alta' ? 'rgba(239, 68, 68, 0.12)' : inc.severity === 'Media' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          color: inc.severity === 'Alta' ? 'var(--color-alta)' : inc.severity === 'Media' ? 'var(--color-media)' : 'var(--color-baja)',
                          border: `1px solid ${inc.severity === 'Alta' ? 'rgba(239, 68, 68, 0.25)' : inc.severity === 'Media' ? 'rgba(249, 115, 22, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
                        }}
                      >
                        {inc.severity}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="card-desc">{inc.description}</p>

                    {/* Meta */}
                    <div className="card-meta">
                      <span className="card-neighborhood">
                        <MapPin size={12} style={{ color: 'var(--cucuta-red)' }} />
                        {inc.neighborhood}
                      </span>
                      <span>{formatTimeAgo(inc.timestamp)}</span>
                    </div>

                    {/* Waze Verification Block */}
                    <div className="waze-verify-bar">
                      <span className="verify-question">
                        {inc.upvotes > 5 ? `✅ Confirmado por ${inc.upvotes} vecinos` : '¿Sigue ocurriendo esto ahora?'}
                      </span>
                      <div className="verify-actions">
                        <button
                          className={`btn-vote-yes ${userVote === 'up' ? 'voted' : ''}`}
                          onClick={(e) => handleVote(e, inc.id, 'up')}
                          disabled={!!userVote}
                          aria-label="Confirmar que sigue ocurriendo"
                        >
                          <ThumbsUp size={14} />
                          Sí, sigue ahí ({inc.upvotes})
                        </button>
                        <button
                          className={`btn-vote-no ${userVote === 'down' ? 'voted' : ''}`}
                          onClick={(e) => handleVote(e, inc.id, 'down')}
                          disabled={!!userVote}
                          aria-label="Informar que ya no está ocurriendo"
                        >
                          <ThumbsDown size={14} />
                          No, ya no está ({inc.downvotes})
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </aside>
  );
}
