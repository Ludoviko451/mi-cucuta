import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Skull, 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  Frown, 
  Info,
  Lightbulb,
  Droplet,
  Trash2,
  Wrench
} from 'lucide-react';

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  isPickingLocation,
  setIsPickingLocation,
  pickedLocation,
  clearPickedLocation,
  currentModule = 'insecurity'
}) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [severity, setSeverity] = useState('Media');

  const isServices = currentModule === 'services';

  // Reset type if we switch modules or modal opens
  useEffect(() => {
    setType('');
  }, [currentModule, isOpen]);

  if (!isOpen) return null;

  const incidentTypes = [
    {
      name: 'Robo',
      icon: <Skull size={18} />,
      color: 'var(--color-robo)',
      bg: 'rgba(239, 68, 68, 0.15)',
      glow: 'rgba(239, 68, 68, 0.25)'
    },
    {
      name: 'Intento de robo',
      icon: <ShieldAlert size={18} />,
      color: 'var(--color-intento)',
      bg: 'rgba(249, 115, 22, 0.15)',
      glow: 'rgba(249, 115, 22, 0.25)'
    },
    {
      name: 'Consumo de drogas',
      icon: <Frown size={18} />,
      color: 'var(--color-drogas)',
      bg: 'rgba(168, 85, 247, 0.15)',
      glow: 'rgba(168, 85, 247, 0.25)'
    },
    {
      name: 'Riñas',
      icon: <Flame size={18} />,
      color: 'var(--color-rinas)',
      bg: 'rgba(234, 179, 8, 0.15)',
      glow: 'rgba(234, 179, 8, 0.25)'
    },
    {
      name: 'Zonas peligrosas',
      icon: <AlertTriangle size={18} />,
      color: 'var(--color-zonas)',
      bg: 'rgba(236, 72, 153, 0.15)',
      glow: 'rgba(236, 72, 153, 0.25)'
    }
  ];

  const serviceTypes = [
    {
      name: 'Luminaria dañada',
      icon: <Lightbulb size={18} />,
      color: 'var(--color-rinas)', // Yellow/Orange
      bg: 'rgba(234, 179, 8, 0.15)',
      glow: 'rgba(234, 179, 8, 0.25)'
    },
    {
      name: 'Hueco en la vía',
      icon: <Wrench size={18} />,
      color: 'var(--color-intento)', // Orange
      bg: 'rgba(249, 115, 22, 0.15)',
      glow: 'rgba(249, 115, 22, 0.25)'
    },
    {
      name: 'Fuga de agua',
      icon: <Droplet size={18} />,
      color: 'var(--color-drogas)', // Purple/Cyan
      bg: 'rgba(168, 85, 247, 0.15)',
      glow: 'rgba(168, 85, 247, 0.25)'
    },
    {
      name: 'Acumulación de basura',
      icon: <Trash2 size={18} />,
      color: 'var(--color-robo)', // Red
      bg: 'rgba(239, 68, 68, 0.15)',
      glow: 'rgba(239, 68, 68, 0.25)'
    }
  ];

  const currentTypes = isServices ? serviceTypes : incidentTypes;

  const handleStartPicking = () => {
    setIsPickingLocation(true);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!type || !description || !neighborhood || !pickedLocation) return;

    onSubmit({
      type,
      description,
      neighborhood,
      severity: isServices ? undefined : severity, // Services doesn't require severity
      lat: pickedLocation.lat,
      lng: pickedLocation.lng
    });

    // Reset form states
    setType('');
    setDescription('');
    setNeighborhood('');
    setSeverity('Media');
    clearPickedLocation();
    onClose();
  };

  const severities = [
    { name: 'Baja', color: 'var(--color-baja)', bg: 'var(--color-baja)', glow: 'transparent' },
    { name: 'Media', color: 'var(--color-media)', bg: 'var(--color-media)', glow: 'transparent' },
    { name: 'Alta', color: 'var(--color-alta)', bg: 'var(--color-alta)', glow: 'transparent' }
  ];

  // We hide the modal when the user is picking the location so they can see the map clearly
  if (isPickingLocation) return null;

  const isFormValid = type && description.trim() && neighborhood.trim() && pickedLocation;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isServices ? (
              <Wrench size={20} style={{ color: 'var(--color-baja)' }} />
            ) : (
              <ShieldAlert size={20} style={{ color: 'var(--cucuta-red)' }} />
            )}
            {isServices ? 'Reportar Daño / Avería de Servicios' : 'Reportar Incidente en Cúcuta'}
          </h2>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitReport}>
          <div className="modal-body">
            
            {/* 1. Category selector grid */}
            <div className="form-group">
              <label className="form-label">
                {isServices ? 'Tipo de Avería o Daño *' : 'Tipo de Incidente *'}
              </label>
              <div className="incident-selector-grid" role="radiogroup" aria-label="Selecciona tipo de reporte">
                {currentTypes.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    role="radio"
                    aria-checked={type === item.name}
                    className={`selector-btn ${type === item.name ? 'selected' : ''}`}
                    style={{
                      '--selector-color': item.color,
                      '--selector-bg': item.bg,
                      '--selector-glow': item.glow
                    }}
                    onClick={() => setType(item.name)}
                  >
                    <span style={{ color: item.color }}>{item.icon}</span>
                    <span className="selector-text">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Location Picker trigger */}
            <div className="form-group">
              <label className="form-label">Ubicación en el Mapa *</label>
              {pickedLocation ? (
                <div className="location-picker-status picked">
                  <MapPin size={16} style={{ color: 'var(--color-baja)' }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>Ubicación marcada</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Lat: {pickedLocation.lat.toFixed(5)}, Lng: {pickedLocation.lng.toFixed(5)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-cancel"
                    style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: '1.5px solid #111827' }}
                    onClick={clearPickedLocation}
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <div className="location-picker-status">
                  <Info size={16} style={{ color: 'var(--cucuta-red)' }} />
                  <span>Es necesario marcar el punto geográfico en el mapa.</span>
                </div>
              )}
              
              {!pickedLocation && (
                <button
                  type="button"
                  className="btn-pick-map"
                  onClick={handleStartPicking}
                >
                  <MapPin size={16} />
                  Seleccionar Punto en el Mapa
                </button>
              )}
            </div>

            {/* 3. Description details */}
            <div className="form-group">
              <label htmlFor="input-description" className="form-label">
                {isServices ? 'Descripción del Daño *' : '¿Qué sucedió? *'}
              </label>
              <textarea
                id="input-description"
                placeholder={
                  isServices 
                    ? "Describe los detalles de la avería o daño público (ej. poste apagado, calle rota, fuga de agua, basura acumulada)..."
                    : "Describe los detalles del incidente (apariencia de sospechosos, dirección de escape, etc.)..."
                }
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                required
              />
            </div>

            {/* 4. Neighborhood / Barrio */}
            <div className="form-group">
              <label htmlFor="input-neighborhood" className="form-label">Barrio / Sector *</label>
              <input
                id="input-neighborhood"
                type="text"
                placeholder="Ej. El Malecón, San Luis, Atalaya..."
                className="form-input"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
              />
            </div>

            {/* 5. Severity level (Only for insecurity) */}
            {!isServices && (
              <div className="form-group">
                <label className="form-label">Nivel de Riesgo / Gravedad</label>
                <div className="severity-selector" role="radiogroup" aria-label="Nivel de gravedad">
                  {severities.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      role="radio"
                      aria-checked={severity === item.name}
                      className={`severity-btn ${severity === item.name ? 'active' : ''}`}
                      style={{
                        '--sev-color': item.color,
                        '--sev-bg': item.bg,
                        '--sev-glow': item.glow
                      }}
                      onClick={() => setSeverity(item.name)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer actions */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={!isFormValid}
            >
              {isServices ? 'Publicar Reporte' : 'Publicar Alerta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
