import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  MessageSquare,
  ShoppingBag,
  Info,
  AlertTriangle
} from 'lucide-react';
import { filterFarms } from '../data/mockFarms';

export default function MarketFeed({
  farms,
  onFocusFarm,
  focusedFarmId
}) {
  const [search, setSearch] = useState('');

  const filtered = filterFarms(farms, search);

  // Helper to build a WhatsApp API link with custom message
  const getWhatsAppLink = (phone, farmName, ownerName) => {
    const text = encodeURIComponent(
      `Hola ${ownerName}, vi tu finca "${farmName}" a través del Mercado Campesino de la aplicación MiCúcuta. Me gustaría obtener información sobre la disponibilidad de tus productos frescos. ¡Muchas gracias!`
    );
    return `https://wa.me/57${phone}?text=${text}`;
  };

  return (
    <aside className="feed-panel" aria-label="Catálogo del Mercado Campesino">
      {/* Header */}
      <div className="feed-header">
        <div className="feed-title-row">
          <h2 className="feed-title">Mercado Campesino</h2>
          <span className="incident-badge-count" style={{ backgroundColor: '#f0fdf4', borderColor: '#16a34a', color: '#16a34a' }}>
            {filtered.length} Fincas
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
          Compra productos frescos directamente a campesinos locales de los corregimientos de Cúcuta.
        </p>
      </div>

      {/* Search by Product or Farm */}
      <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--border-light)' }}>
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar yuca, aguacate, café, fincas..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar productos agrícolas"
          />
        </div>
      </div>

      {/* List of Farms */}
      <div className="feed-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={32} />
            <p>No se encontraron fincas o productos con la búsqueda "{search}" en Cúcuta.</p>
          </div>
        ) : (
          filtered.map((farm) => {
            const isFocused = farm.id === focusedFarmId;
            return (
              <div
                key={farm.id}
                className={`incident-card fade-in ${isFocused ? 'focused' : ''}`}
                onClick={() => onFocusFarm(farm)}
              >
                {/* Header */}
                <div className="card-header" style={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="card-type-title" style={{ fontSize: '16px', color: 'var(--color-baja)' }}>
                      {farm.name}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '750', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} />
                      Productor: {farm.owner}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="card-desc" style={{ fontSize: '13px' }}>{farm.description}</p>

                {/* Catalog of products */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShoppingBag size={12} style={{ color: 'var(--color-baja)' }} />
                    Productos Disponibles:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {farm.products.map((prod) => (
                      <div
                        key={prod.name}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          background: '#f8fafc',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}
                      >
                        <span style={{ color: '#1e293b' }}>{prod.name}</span>
                        <span style={{ color: 'var(--color-baja)' }}>{prod.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="card-meta">
                  <span className="card-neighborhood" style={{ fontSize: '12px' }}>
                    <MapPin size={12} style={{ color: 'var(--color-baja)' }} />
                    Corregimiento: {farm.sector}
                  </span>
                </div>

                {/* Contact Action */}
                <a
                  href={getWhatsAppLink(farm.contact, farm.name, farm.owner)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-vote-yes"
                  onClick={(e) => e.stopPropagation()} // Avoid map focus trigger
                  style={{
                    backgroundColor: '#22c55e', // Green WhatsApp color
                    borderColor: '#16a34a',
                    color: '#ffffff',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '800',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                  }}
                  aria-label={`Contactar a ${farm.owner} por WhatsApp`}
                >
                  <MessageSquare size={14} />
                  Contactar Productor (WhatsApp)
                </a>
              </div>
            );
          })
        )}

        {/* Info farmer cooperative block */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            backgroundColor: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#15803d',
            fontWeight: '600'
          }}
        >
          <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>
            Esta sección busca apoyar la economía rural local. Contacta y compra directamente sin intermediarios, apoyando a los campesinos de la región del Catatumbo y áreas metropolitanas.
          </span>
        </div>
      </div>
    </aside>
  );
}
