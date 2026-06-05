// Local buseta routes and safe paths in Cúcuta, Colombia

export const BUSETA_ROUTES = [
  {
    id: "route-coomicro",
    name: "Ruta Coomicro (Libertad - Centro - Terminal)",
    operator: "Coomicro Ltda",
    color: "#ea580c", // Naranja
    description: "Conecta la zona oriental (La Libertad) cruzando el puente de San Luis, el centro comercial Ventura Plaza y finaliza en la Terminal de Transportes.",
    duration: "25 min",
    cost: "$2.800",
    // Polyline coordinates for Leaflet
    path: [
      [7.8765, -72.4820], // La Libertad (Inicio)
      [7.8790, -72.4880], // Vía principal
      [7.8835, -72.4935], // San Luis (Iglesia)
      [7.8872, -72.4990], // Av. Demetrio Mendoza
      [7.8925, -72.5025], // Centro (Ventura Plaza)
      [7.8960, -72.5050], // Calle 10 Centro
      [7.8995, -72.5098]  // Terminal de Transportes (Fin)
    ],
    stops: [
      { name: "La Libertad (Salida)", lat: 7.8765, lng: -72.4820 },
      { name: "San Luis (Iglesia)", lat: 7.8835, lng: -72.4935 },
      { name: "Ventura Plaza", lat: 7.8925, lng: -72.5025 },
      { name: "Terminal Cúcuta", lat: 7.8995, lng: -72.5098 }
    ]
  },
  {
    id: "route-trasan",
    name: "Ruta Trasan / Transontiveros (Atalaya - UFPS)",
    operator: "Trasan S.A. / Transontiveros",
    color: "#0284c7", // Azul
    description: "Recorrido de gran afluencia. Inicia en Atalaya, pasa por la Terminal, sube por el centro histórico y conecta con el Malecón y la Universidad UFPS.",
    duration: "35 min",
    cost: "$2.800",
    path: [
      [7.9042, -72.5320], // Atalaya (Intercambiador)
      [7.9015, -72.5200], // Autopista Atalaya
      [7.8995, -72.5098], // Terminal de Transportes
      [7.8892, -72.5062], // Centro (Parque Santander)
      [7.8948, -72.5032], // Av. Cero
      [7.9015, -72.4980], // El Malecón (Zona restaurantes)
      [7.9065, -72.4905]  // UFPS / Entrada principal (Fin)
    ],
    stops: [
      { name: "Atalaya (Salida)", lat: 7.9042, lng: -72.5320 },
      { name: "Terminal Cúcuta", lat: 7.8995, lng: -72.5098 },
      { name: "Parque Santander", lat: 7.8892, lng: -72.5062 },
      { name: "El Malecón", lat: 7.9015, lng: -72.4980 },
      { name: "UFPS (Llegada)", lat: 7.9065, lng: -72.4905 }
    ]
  }
];

// Safe pedestrian paths avoiding crime hotspots
export const PEDESTRIAN_PATHS = [
  {
    id: "path-1",
    name: "Sendero Seguro: Parque Santander ➔ Ventura Plaza",
    description: "Caminata céntrica y patrullada. Evita el canal de la Diagonal Santander.",
    distance: "600 m",
    duration: "8 min",
    safetyScore: "95% (Patrullaje Activo)",
    path: [
      [7.8892, -72.5062], // Parque Santander
      [7.8902, -72.5048], // Calle 10 con Av. 5
      [7.8914, -72.5035], // Calle 10 con Av. 2
      [7.8925, -72.5025]  // Ventura Plaza
    ]
  },
  {
    id: "path-2",
    name: "Sendero Seguro: Ventura Plaza ➔ UFPS",
    description: "Ruta universitaria recomendada. Transita por avenidas con buena iluminación y comercio.",
    distance: "1.8 km",
    duration: "20 min",
    safetyScore: "90% (Iluminación Completa)",
    path: [
      [7.8925, -72.5025], // Ventura Plaza
      [7.8942, -72.5008], // Av. Cero con Calle 8
      [7.8985, -72.5020], // Av. Libertadores
      [7.9015, -72.4980], // El Malecón
      [7.9045, -72.4935], // Calle 2N Quinta Oriental
      [7.9065, -72.4905]  // UFPS
    ]
  }
];
