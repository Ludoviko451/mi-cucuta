import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  FileText, 
  ShoppingBag
} from 'lucide-react';

export default function Sidebar({ currentModule, onModuleChange }) {
  const modules = [
    {
      id: 'services',
      name: 'M1: Reportes Públicos',
      fullName: 'Módulo 1: Reportes de Servicios Públicos',
      icon: <FileText size={18} />,
      active: currentModule === 'services',
      locked: false,
    },
    {
      id: 'insecurity',
      name: 'M2: Mapa Inseguridad',
      fullName: 'Módulo 2: Mapa de Inseguridad de Cúcuta',
      icon: <ShieldAlert size={18} />,
      active: currentModule === 'insecurity',
      locked: false,
    },
    {
      id: 'routes',
      name: 'M3: Rutas de Buseta',
      fullName: 'Módulo 3: Rutas de Buseta y Senderos Seguros',
      icon: <Map size={18} />,
      active: currentModule === 'routes',
      locked: false,
    },
    {
      id: 'market',
      name: 'M4: Mercado Campesino',
      fullName: 'Módulo 4: Mercado Campesino de Cúcuta',
      icon: <ShoppingBag size={18} />,
      active: currentModule === 'market',
      locked: false,
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand / Logo Section */}
      <div className="brand-section">
        <div className="cucuta-flag-badge" aria-label="Bandera de Cúcuta">
          <div className="flag-black"></div>
          <div className="flag-red"></div>
        </div>
        <div>
          <h1 className="brand-title">MiCúcuta</h1>
          <div className="brand-tagline">Municipio Conectado</div>
        </div>
      </div>

      {/* Module Navigation */}
      <nav className="modules-list" aria-label="Módulos de la aplicación">
        {modules.map((mod) => (
          <button
            key={mod.id}
            className={`module-item ${mod.active ? 'active' : ''} ${mod.locked ? 'locked' : ''}`}
            title={mod.fullName}
            onClick={() => !mod.locked && onModuleChange(mod.id)}
            style={{ background: 'none', border: 'none', width: 'calc(100% - 0px)', textAlign: 'left', display: 'flex', alignItems: 'center' }}
            role="tab"
            aria-selected={mod.active}
          >
            {mod.icon}
            <span style={{ marginLeft: '12px' }}>{mod.name}</span>
            {mod.locked && <span className="module-badge-locked">Pronto</span>}
          </button>
        ))}
      </nav>

      {/* User Information */}
      <div className="user-profile">
        <div className="avatar">UC</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Usuario Cúcuta
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
            Vecino Verificado
          </span>
        </div>
      </div>
    </aside>
  );
}
