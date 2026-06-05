import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  AlertTriangle,
  Lightbulb,
  Droplet,
  Trash2,
  Wrench
} from 'lucide-react';
import { filterServices } from '../data/mockServices';

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

export default function ServicesFeed({
  services,
  onFocusService,
  focusedServiceId,
  onOpenReportModal
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = filterServices(services, {
    search,
    type: typeFilter
  });

  const getServiceIcon = (type) => {
    switch (type) {
      case 'Luminaria dañada':
        return <Lightbulb size={16} style={{ color: 'var(--color-rinas)' }} />;
      case 'Hueco en la vía':
        return <Wrench size={16} style={{ color: 'var(--color-intento)' }} />;
      case 'Fuga de agua':
        return <Droplet size={16} style={{ color: 'var(--color-drogas)' }} />;
      case 'Acumulación de basura':
        return <Trash2 size={16} style={{ color: 'var(--color-robo)' }} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const getServiceIconBg = (type) => {
    switch (type) {
      case 'Luminaria dañada': return '#fef3c7'; // Light yellow
      case 'Hueco en la vía': return '#ffedd5'; // Light orange
      case 'Fuga de agua': return '#f3e8ff'; // Light purple
      case 'Acumulación de basura': return '#fee2e2'; // Light red
      default: return '#f3f4f6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'var(--color-alta)';
      case 'En revisión': return 'var(--color-media)';
      case 'Solucionado': return 'var(--color-baja)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Pendiente': return '#fef2f2';
      case 'En revisión': return '#fff7ed';
      case 'Solucionado': return '#f0fdf4';
      default: return '#f3f4f6';
    }
  };

  return (
    <aside className="feed-panel">
      {/* Header */}
      <div className="feed-header">
        <div className="feed-title-row">
          <h2 className="feed-title">Servicios Públicos</h2>
          <span className="incident-badge-count" style={{ backgroundColor: '#e0f2fe', borderColor: '#0284c7', color: '#0284c7' }}>
            {filtered.length} Reportados
          </span>
        </div>
        
        <button 
          className="btn-report" 
          onClick={onOpenReportModal}
          aria-label="Reportar daño de servicios públicos"
        >
          <Plus size={16} />
          Reportar Daño / Avería
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '2px solid var(--border-light)' }}>
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar por barrio o tipo de avería..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar daños"
          />
        </div>
        <div className="filters-row">
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filtrar por avería"
            style={{ width: '100%' }}
          >
            <option value="All">Todas las Averías</option>
            <option value="Luminaria dañada">Luminaria Dañada</option>
            <option value="Hueco en la vía">Hueco en la Vía</option>
            <option value="Fuga de agua">Fuga de Agua</option>
            <option value="Acumulación de basura">Acumulación de Basura</option>
          </select>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="feed-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={32} />
            <p>No se encontraron reportes de daños públicos en Cúcuta.</p>
          </div>
        ) : (
          filtered.map((srv) => {
            const iconBg = getServiceIconBg(srv.type);
            const isFocused = srv.id === focusedServiceId;
            const statusColor = getStatusColor(srv.status);
            const statusBg = getStatusBg(srv.status);

            return (
              <div
                key={srv.id}
                className={`incident-card fade-in ${isFocused ? 'focused' : ''}`}
                onClick={() => onFocusService(srv)}
              >
                {/* Header */}
                <div className="card-header">
                  <div className="card-type-group">
                    <div className="card-icon" style={{ backgroundColor: iconBg }}>
                      {getServiceIcon(srv.type)}
                    </div>
                    <span className="card-type-title">{srv.type}</span>
                  </div>
                  
                  <span 
                    className="severity-pill"
                    style={{
                      backgroundColor: statusBg,
                      color: statusColor,
                      border: `1.5px solid ${statusColor}44`
                    }}
                  >
                    {srv.status}
                  </span>
                </div>

                {/* Description */}
                <p className="card-desc">{srv.description}</p>

                {/* Meta */}
                <div className="card-meta">
                  <span className="card-neighborhood">
                    <MapPin size={12} style={{ color: 'var(--cucuta-red)' }} />
                    {srv.neighborhood}
                  </span>
                  <span>{formatTimeAgo(srv.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
