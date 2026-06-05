import React, { useState } from 'react';
import { 
  Map, 
  Navigation, 
  Bus, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { BUSETA_ROUTES, PEDESTRIAN_PATHS } from '../data/busetaRoutes';

export default function RoutesPlanner({
  selectedRouteId,
  onSelectRoute,
  onClearRoute
}) {
  const [routeType, setRouteType] = useState('buseta'); // 'buseta' | 'pedestrian'

  const handleSelect = (route) => {
    if (selectedRouteId === route.id) {
      onClearRoute();
    } else {
      onSelectRoute(route);
    }
  };

  return (
    <aside className="feed-panel" aria-label="Planificador de rutas seguras y transporte">
      {/* Header */}
      <div className="feed-header">
        <h2 className="feed-title">Planificador de Rutas</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
          Consulta recorridos de transporte público o senderos peatonales vigilados en Cúcuta.
        </p>
      </div>

      {/* Tabs for Route Type */}
      <div className="dashboard-controls" role="tablist">
        <button
          role="tab"
          aria-selected={routeType === 'buseta'}
          className={`btn-tab ${routeType === 'buseta' ? 'active' : ''}`}
          onClick={() => {
            setRouteType('buseta');
            onClearRoute();
          }}
        >
          <Bus size={14} />
          Líneas de Buseta
        </button>
        <button
          role="tab"
          aria-selected={routeType === 'pedestrian'}
          className={`btn-tab ${routeType === 'pedestrian' ? 'active' : ''}`}
          onClick={() => {
            setRouteType('pedestrian');
            onClearRoute();
          }}
        >
          <Navigation size={14} />
          Senderos Seguros
        </button>
      </div>

      {/* Routes list scroll area */}
      <div className="feed-content" style={{ padding: '16px', gap: '16px' }}>
        
        {routeType === 'buseta' ? (
          // A. BUSETA ROUTES
          BUSETA_ROUTES.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <div
                key={route.id}
                className={`incident-card fade-in ${isSelected ? 'focused' : ''}`}
                onClick={() => handleSelect(route)}
                style={{ cursor: 'pointer' }}
              >
                {/* Header */}
                <div className="card-header" style={{ alignItems: 'flex-start' }}>
                  <div className="card-type-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: route.color,
                          display: 'inline-block',
                          border: '1.5px solid #000000'
                        }}
                      ></span>
                      <span className="card-type-title" style={{ fontSize: '15px' }}>{route.name.replace('Ruta ', '')}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                      Empresa: {route.operator}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="card-desc" style={{ fontSize: '13px' }}>{route.description}</p>

                {/* Meta details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700' }}>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>~{route.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700' }}>
                    <DollarSign size={14} style={{ color: 'var(--color-baja)' }} />
                    <span>{route.cost} Pasaje</span>
                  </div>
                </div>

                {/* Stops Timeline */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Paradas Principales:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
                    {route.stops.map((stop, idx) => (
                      <React.Fragment key={stop.name}>
                        <span 
                          style={{
                            fontSize: '11px',
                            background: '#e5e7eb',
                            color: '#1f2937',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: '700',
                            border: '1px solid #d1d5db'
                          }}
                        >
                          {stop.name}
                        </span>
                        {idx < route.stops.length - 1 && <ChevronRight size={12} style={{ color: '#9ca3af' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Selected Status Indicator */}
                <button
                  type="button"
                  className="btn-pick-map"
                  style={{
                    marginTop: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    borderColor: isSelected ? 'var(--cucuta-red)' : '#4b5563',
                    backgroundColor: isSelected ? '#fee2e2' : '#ffffff',
                    color: isSelected ? 'var(--cucuta-red)' : '#111827'
                  }}
                >
                  <Map size={14} />
                  {isSelected ? "Ocultar Ruta en Mapa" : "Trazar Recorrido en Mapa"}
                </button>
              </div>
            );
          })
        ) : (
          // B. PEDESTRIAN PATHS
          PEDESTRIAN_PATHS.map((path) => {
            const isSelected = selectedRouteId === path.id;
            return (
              <div
                key={path.id}
                className={`incident-card fade-in ${isSelected ? 'focused' : ''}`}
                onClick={() => handleSelect(path)}
                style={{ cursor: 'pointer' }}
              >
                {/* Header */}
                <div className="card-header">
                  <span className="card-type-title" style={{ fontSize: '15px' }}>{path.name.replace('Sendero Seguro: ', '')}</span>
                </div>

                <p className="card-desc" style={{ fontSize: '13px' }}>{path.description}</p>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f9fafb', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12px', fontWeight: '700' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={13} style={{ color: 'var(--cucuta-red)' }} />
                    <span>{path.distance}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>~{path.duration} a pie</span>
                  </div>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#15803d',
                    marginTop: '4px'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Seguridad: {path.safetyScore}</span>
                </div>

                <button
                  type="button"
                  className="btn-pick-map"
                  style={{
                    marginTop: '4px',
                    padding: '8px',
                    fontSize: '12px',
                    borderColor: isSelected ? 'var(--cucuta-red)' : '#4b5563',
                    backgroundColor: isSelected ? '#fee2e2' : '#ffffff',
                    color: isSelected ? 'var(--cucuta-red)' : '#111827'
                  }}
                >
                  <Map size={14} />
                  {isSelected ? "Ocultar Sendero en Mapa" : "Trazar Sendero en Mapa"}
                </button>
              </div>
            );
          })
        )}

        {/* Small warning info box */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            backgroundColor: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#1e3a8a',
            fontWeight: '600'
          }}
        >
          <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>
            Las rutas peatonales seguras están calculadas para pasar por avenidas principales de Cúcuta y evitar los puntos de calor de delincuencia registrados recientemente.
          </span>
        </div>
      </div>
    </aside>
  );
}
