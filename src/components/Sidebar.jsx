import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  PhoneCall, 
  FileText, 
  Settings, 
  User, 
  HelpCircle 
} from 'lucide-react';

export default function Sidebar() {
  const modules = [
    {
      id: 'mod-1',
      name: 'Módulo 1: Reportes Públicos',
      icon: <FileText size={18} />,
      active: false,
      locked: true,
    },
    {
      id: 'mod-2',
      name: 'Módulo 2: Mapa Inseguridad',
      icon: <ShieldAlert size={18} />,
      active: true,
      locked: false,
    },
    {
      id: 'mod-3',
      name: 'Módulo 3: Ruta Segura',
      icon: <Map size={18} />,
      active: false,
      locked: true,
    },
    {
      id: 'mod-4',
      name: 'Módulo 4: Botón de Pánico',
      icon: <PhoneCall size={18} />,
      active: false,
      locked: true,
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
          <div className="brand-tagline">Seguridad Ciudadana</div>
        </div>
      </div>

      {/* Module Navigation */}
      <nav className="modules-list" aria-label="Módulos de la aplicación">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`module-item ${mod.active ? 'active' : ''} ${mod.locked ? 'locked' : ''}`}
            title={mod.locked ? 'Este módulo estará disponible pronto' : mod.name}
          >
            {mod.icon}
            <span>{mod.name.replace('Módulo ', 'M')}</span>
            {mod.locked && <span className="module-badge-locked">Pronto</span>}
          </div>
        ))}
      </nav>

      {/* User Information */}
      <div className="user-profile">
        <div className="avatar">UC</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Usuario Cúcuta
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Vecino Verificado
          </span>
        </div>
      </div>
    </aside>
  );
}
