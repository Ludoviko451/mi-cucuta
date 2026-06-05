import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, Eye, Flame } from 'lucide-react';

// Distinct professional colors for Cúcuta's 10 communes
const getCommuneColor = (comunaNum) => {
  const colors = {
    1: '#1e3a8a',  // Dark Blue
    2: '#0d9488',  // Teal
    3: '#0891b2',  // Cyan
    4: '#15803d',  // Green
    5: '#b45309',  // Dark Orange
    6: '#c2410c',  // Rust
    7: '#c53030',  // Cúcuta Red
    8: '#6b21a8',  // Deep Purple
    9: '#9d174d',  // Magenta/Pink
    10: '#475569'  // Slate/Grey
  };
  return colors[comunaNum] || '#718096';
};

export default function MapSection({
  incidents,
  onLocationPick,
  isPickingLocation,
  pickedLocation,
  focusedIncident,
  showHeatmap,
  setShowHeatmap,
  showMarkers,
  setShowMarkers,
  showComunas,
  setShowComunas,
  selectedCommune,
  setSelectedCommune
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const pickedMarkerRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isLoadingComunas, setIsLoadingComunas] = useState(false);
  
  const isPickingLocationRef = useRef(isPickingLocation);

  // Sync ref to avoid re-binding click listener on map
  useEffect(() => {
    isPickingLocationRef.current = isPickingLocation;
  }, [isPickingLocation]);

  // 1. Initialize Map
  useEffect(() => {
    if (!window.L || mapInstanceRef.current) return;

    // Cúcuta, Colombia center coordinates
    const map = window.L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([7.8939, -72.5078], 13.5);

    // CartoDB Positron (Light/Clean Style)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Create a LayerGroup for markers
    const markersGroup = window.L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Set up click handler for report geolocations
    map.on('click', (e) => {
      if (isPickingLocationRef.current) {
        onLocationPick({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationPick]);

  // 2. Render Incident Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup || !window.L) return;

    // Clear previous markers
    markersGroup.clearLayers();

    if (!showMarkers) return;

    // Color definitions per incident type
    const getMarkerColor = (type) => {
      switch (type) {
        case 'Robo': return 'var(--color-robo)';
        case 'Intento de robo': return 'var(--color-intento)';
        case 'Consumo de drogas': return 'var(--color-drogas)';
        case 'Riñas': return 'var(--color-rinas)';
        case 'Zonas peligrosas': return 'var(--color-zonas)';
        default: return 'var(--cucuta-red)';
      }
    };

    // Severity badges in popups
    const getSeverityBadgeClass = (severity) => {
      switch (severity) {
        case 'Alta': return 'var(--color-alta)';
        case 'Media': return 'var(--color-media)';
        case 'Baja': return 'var(--color-baja)';
        default: return 'var(--text-muted)';
      }
    };

    incidents.forEach((inc) => {
      const color = getMarkerColor(inc.type);
      const sevColor = getSeverityBadgeClass(inc.severity);

      // Create Custom HTML DivIcon (Pulsing node style)
      const icon = window.L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="pulse-marker" style="--marker-color: ${color}">
            <div class="pulse-ring"></div>
            <div class="pulse-center"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // HTML contents inside the popup card
      const popupHtml = `
        <div class="popup-container">
          <div class="popup-header">
            <span class="popup-badge" style="background-color: ${color}33; color: ${color}; border: 1px solid ${color}66">${inc.type}</span>
            <span class="popup-neighborhood">${inc.neighborhood}</span>
          </div>
          <div class="popup-desc">${inc.description}</div>
          <div class="popup-footer">
            <span style="display:inline-flex; align-items:center; gap:3px;">
              ⚠️ Gravedad: <strong style="color: ${sevColor}">${inc.severity}</strong>
            </span>
            <span>✅ Verificado: ${inc.upvotes}</span>
          </div>
        </div>
      `;

      const marker = window.L.marker([inc.lat, inc.lng], { icon })
        .bindPopup(popupHtml, { closeButton: false });
      
      markersGroup.addLayer(marker);
    });
  }, [incidents, showMarkers, showComunas, selectedCommune]);

  // 3. Render Heatmap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    // Remove existing heatmap layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!showHeatmap) return;

    // Format incident coordinates for Leaflet.heat
    // Format: [lat, lng, intensity]
    const heatPoints = incidents.map((inc) => {
      let intensity = 0.5;
      if (inc.severity === 'Alta') intensity = 0.85;
      if (inc.severity === 'Baja') intensity = 0.25;

      // Amplify intensity slightly with confirmation votes
      const voteBonus = Math.min(0.15, (inc.upvotes || 0) * 0.01);
      return [inc.lat, inc.lng, intensity + voteBonus];
    });

    if (heatPoints.length > 0 && window.L.heatLayer) {
      // Initialize heatLayer with customized gradient and blur
      const heatLayer = window.L.heatLayer(heatPoints, {
        radius: 28,
        blur: 18,
        maxZoom: 16,
        gradient: {
          0.2: 'blue',
          0.4: 'cyan',
          0.6: 'lime',
          0.8: 'yellow',
          1.0: '#e53e3e' // Cúcuta Red highlight
        }
      });
      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    }
  }, [incidents, showHeatmap]);

  // 4. Update Click Location Selection Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    // Clear previous selection marker
    if (pickedMarkerRef.current) {
      map.removeLayer(pickedMarkerRef.current);
      pickedMarkerRef.current = null;
    }

    // Add selected spot marker if picking coordinates
    if (pickedLocation) {
      const pickIcon = window.L.divIcon({
        className: 'custom-pick-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            border: 3px solid #111827;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          ">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--cucuta-red);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = window.L.marker([pickedLocation.lat, pickedLocation.lng], { icon: pickIcon })
        .addTo(map);
      pickedMarkerRef.current = marker;
      map.panTo([pickedLocation.lat, pickedLocation.lng]);
    }
  }, [pickedLocation]);

  // 5. Fetch GeoJSON Comunas dynamically (lazy loading)
  useEffect(() => {
    if (showComunas && !geoJsonData && !isLoadingComunas) {
      setIsLoadingComunas(true);
      fetch('/comunas.json')
        .then((res) => {
          if (!res.ok) throw new Error("Error loading GeoJSON from public folder");
          return res.json();
        })
        .then((data) => {
          setGeoJsonData(data);
          setIsLoadingComunas(false);
        })
        .catch((err) => {
          console.error("Failed to load Cúcuta GeoJSON:", err);
          setIsLoadingComunas(false);
        });
    }
  }, [showComunas, geoJsonData, isLoadingComunas]);

  // 6. Draw GeoJSON Commune Boundaries
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (!showComunas || !geoJsonData) return;

    const geoJsonLayer = window.L.geoJSON(geoJsonData, {
      style: (feature) => {
        const comunaNum = Number(feature.properties.comuna);
        const isHighlighted = selectedCommune === 'All' || String(feature.properties.comuna) === String(selectedCommune);
        const color = getCommuneColor(comunaNum);
        return {
          color: isHighlighted ? color : '#cbd5e1',
          weight: isHighlighted ? 2.5 : 1.0,
          fillColor: isHighlighted ? color : '#f1f5f9',
          fillOpacity: isHighlighted ? 0.18 : 0.02
        };
      },
      onEachFeature: (feature, layer) => {
        const comunaNum = Number(feature.properties.comuna);
        const color = getCommuneColor(comunaNum);
        layer.bindPopup(`
          <div class="popup-container" style="font-family: var(--font-sans); padding: 2px;">
            <div style="font-size: 14px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">
              Barrio: ${feature.properties.barrio_ver}
            </div>
            <div style="font-size: 12px; font-weight: 750; color: ${color};">
              Comuna ${feature.properties.comuna}
            </div>
          </div>
        `, { closeButton: false });
      }
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;
  }, [showComunas, geoJsonData, selectedCommune]);

  // 7. Handle Incident Focus / Flight
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedIncident) return;

    map.flyTo([focusedIncident.lat, focusedIncident.lng], 16, {
      animate: true,
      duration: 1.5
    });
  }, [focusedIncident]);

  return (
    <section className="map-workspace" aria-label="Mapa de incidentes">
      {/* Floating Map Layers / Filters */}
      <div className="map-floating-panel">
        <h3 className="floating-title">
          <Layers size={16} />
          Filtros de Capa
        </h3>
        <div className="toggle-container">
          <div className="toggle-row">
            <span className="toggle-label">
              <Flame size={14} style={{ color: 'var(--cucuta-red)' }} />
              Mapa de Calor (Densidad)
            </span>
            <label className="switch" aria-label="Toggle Mapa de Calor">
              <input 
                type="checkbox" 
                checked={showHeatmap} 
                onChange={(e) => setShowHeatmap(e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-row">
            <span className="toggle-label">
              <MapPin size={14} style={{ color: 'var(--color-intento)' }} />
              Pines de Reportes
            </span>
            <label className="switch" aria-label="Toggle Pines de Reportes">
              <input 
                type="checkbox" 
                checked={showMarkers} 
                onChange={(e) => setShowMarkers(e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="toggle-row">
            <span className="toggle-label">
              <Eye size={14} style={{ color: 'var(--color-drogas)' }} />
              Ver Comunas y Barrios
            </span>
            <label className="switch" aria-label="Toggle Límites de Comunas">
              <input 
                type="checkbox" 
                checked={showComunas} 
                onChange={(e) => setShowComunas(e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          {showComunas && (
            <div className="toggle-row" style={{ flexDirection: 'column', gap: '6px', alignItems: 'stretch', marginTop: '4px', borderTop: '1.5px solid var(--border-light)', paddingTop: '10px' }}>
              <label htmlFor="select-highlight-comuna" className="toggle-label" style={{ marginBottom: '2px', fontSize: '12px' }}>
                Resaltar Comuna:
              </label>
              {isLoadingComunas ? (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Cargando barrios (7MB)...</span>
              ) : (
                <select
                  id="select-highlight-comuna"
                  className="filter-select"
                  style={{ width: '100%', padding: '8px', fontSize: '13px', fontWeight: '700', backgroundColor: '#ffffff', border: '2px solid #4b5563', borderRadius: '6px' }}
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                >
                  <option value="All">Todas las Comunas</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={String(num)}>Comuna {num}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Click Instructions when in selector mode */}
      {isPickingLocation && (
        <div className="map-click-helper">
          <MapPin size={16} />
          Haz clic en el mapa para marcar la ubicación del incidente
        </div>
      )}

      {/* Map container DOM element */}
      <div className="map-container-wrapper">
        <div id="map" ref={mapContainerRef}></div>
      </div>
    </section>
  );
}
