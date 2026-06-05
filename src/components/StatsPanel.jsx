import React from 'react';
import { 
  BarChart3, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon 
} from 'lucide-react';
import { calculateIncidentStats } from '../data/mockIncidents';

export default function StatsPanel({ incidents }) {
  const stats = calculateIncidentStats(incidents);

  // Helper to calculate percentages
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const getIncidentColor = (type) => {
    switch (type) {
      case 'Robo': return 'var(--color-robo)';
      case 'Intento de robo': return 'var(--color-intento)';
      case 'Consumo de drogas': return 'var(--color-drogas)';
      case 'Riñas': return 'var(--color-rinas)';
      case 'Zonas peligrosas': return 'var(--color-zonas)';
      default: return 'var(--cucuta-red)';
    }
  };

  const getTimeIcon = (timeRange) => {
    switch (timeRange) {
      case 'Madrugada (00-06)':
        return <Moon size={16} style={{ color: 'var(--color-drogas)' }} />;
      case 'Mañana (06-12)':
        return <Sunrise size={16} style={{ color: 'var(--color-rinas)' }} />;
      case 'Tarde (12-18)':
        return <Sun size={16} style={{ color: 'var(--color-intento)' }} />;
      case 'Noche (18-00)':
        return <Sunset size={16} style={{ color: 'var(--color-robo)' }} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="stats-panel-content fade-in" aria-label="Panel de estadísticas de inseguridad">
      {/* 1. Counter cards grid */}
      <div className="stats-card">
        <h3 className="stats-card-title">
          <ShieldAlert size={16} style={{ color: 'var(--cucuta-red)' }} />
          Resumen de Seguridad
        </h3>
        <div className="stat-grid-3">
          <div className="mini-stat-card" aria-label={`Total de reportes: ${stats.total}`}>
            <div className="mini-stat-val">{stats.total}</div>
            <div className="mini-stat-label">Reportes</div>
          </div>
          <div className="mini-stat-card" aria-label={`Riesgo alto: ${stats.bySeverity['Alta']}`}>
            <div className="mini-stat-val" style={{ color: 'var(--color-alta)' }}>{stats.bySeverity['Alta']}</div>
            <div className="mini-stat-label">Riesgo Alto</div>
          </div>
          <div className="mini-stat-card" aria-label={`Verificados en total`}>
            <div className="mini-stat-val" style={{ color: 'var(--color-baja)' }}>
              {incidents.reduce((acc, curr) => acc + curr.upvotes, 0)}
            </div>
            <div className="mini-stat-label">Verificaciones</div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal progress bars for Incident Types */}
      <div className="stats-card">
        <h3 className="stats-card-title">
          <BarChart3 size={16} style={{ color: 'var(--color-intento)' }} />
          Reportes por Tipología
        </h3>
        <div className="stat-bar-container">
          {Object.entries(stats.byType).map(([type, count]) => {
            const pct = getPercentage(count, stats.total);
            const color = getIncidentColor(type);
            return (
              <div key={type} className="stat-bar-row" aria-label={`${type}: ${count} reportes (${pct}%)`}>
                <div className="stat-bar-labels">
                  <span className="stat-bar-name">{type}</span>
                  <span className="stat-bar-value">{count} ({pct}%)</span>
                </div>
                <div className="stat-bar-track">
                  <div 
                    className="stat-bar-fill" 
                    style={{ 
                      width: `${pct}%`,
                      backgroundColor: color,
                      '--fill-color': color 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Distribution by Time of Day */}
      <div className="stats-card">
        <h3 className="stats-card-title">
          <Clock size={16} style={{ color: 'var(--color-drogas)' }} />
          Horas de Mayor Frecuencia
        </h3>
        <div className="time-grid">
          {Object.entries(stats.byTimeOfDay).map(([label, count]) => {
            const pct = getPercentage(count, stats.total);
            return (
              <div key={label} className="time-box" aria-label={`${label}: ${count} reportes`}>
                {getTimeIcon(label)}
                <div className="time-box-details">
                  <span className="time-box-name">{label.split(' ')[0]}</span>
                  <span className="time-box-count">{count} rep. ({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Top 5 Dangerous Neighborhoods in Cúcuta */}
      <div className="stats-card">
        <h3 className="stats-card-title">
          <MapPin size={16} style={{ color: 'var(--color-rinas)' }} />
          Sectores Más Afectados
        </h3>
        <div className="ranking-list">
          {stats.mostDangerousNeighborhoods.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
              No hay datos suficientes de barrios.
            </div>
          ) : (
            stats.mostDangerousNeighborhoods.map((nh, idx) => (
              <div key={nh.name} className="ranking-item" aria-label={`Puesto ${idx+1}: ${nh.name} con ${nh.count} reportes`}>
                <span className="ranking-num">#{idx + 1}</span>
                <span className="ranking-name">{nh.name}</span>
                <span className="ranking-count">{nh.count} alertas</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
