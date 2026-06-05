// Mock data for insecurity reports in Cúcuta, Colombia
export const INITIAL_INCIDENTS = [
  {
    id: "inc-1",
    type: "Robo",
    description: "Hurto de celular por dos sujetos en motocicleta de mediano cilindraje. Huyeron con dirección al puente.",
    lat: 7.9015,
    lng: -72.4980,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    upvotes: 14,
    downvotes: 1,
    severity: "Alta",
    neighborhood: "El Malecón"
  },
  {
    id: "inc-2",
    type: "Robo",
    description: "Robo de billetera bajo modalidad de cosquilleo en zona peatonal muy concurrida.",
    lat: 7.8892,
    lng: -72.5062,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    upvotes: 8,
    downvotes: 0,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    id: "inc-3",
    type: "Intento de robo",
    description: "Intentaron jalar una cadena de oro a un transeúnte. La comunidad reaccionó y el delincuente huyó hacia el canal.",
    lat: 7.8925,
    lng: -72.5025,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    upvotes: 21,
    downvotes: 2,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    id: "inc-4",
    type: "Consumo de drogas",
    description: "Grupo de jóvenes consumiendo sustancias psicoactivas debajo del puente peatonal, intimidando a estudiantes.",
    lat: 7.9065,
    lng: -72.4905,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    upvotes: 5,
    downvotes: 0,
    severity: "Baja",
    neighborhood: "La Riviera / UFPS"
  },
  {
    id: "inc-5",
    type: "Riñas",
    description: "Fuerte riña entre jóvenes con objetos contundentes. La policía tardó más de 20 minutos en llegar.",
    lat: 7.8835,
    lng: -72.4935,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    upvotes: 18,
    downvotes: 1,
    severity: "Alta",
    neighborhood: "San Luis"
  },
  {
    id: "inc-6",
    type: "Zonas peligrosas",
    description: "Sector extremadamente oscuro por luminarias dañadas. Constante presencia de personas en actitud sospechosa vigilando residencias.",
    lat: 7.9042,
    lng: -72.5320,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    upvotes: 45,
    downvotes: 3,
    severity: "Alta",
    neighborhood: "Atalaya"
  },
  {
    id: "inc-7",
    type: "Consumo de drogas",
    description: "Consumo constante de alucinógenos en zonas verdes del parque infantil durante las tardes.",
    lat: 7.8955,
    lng: -72.5085,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    upvotes: 7,
    downvotes: 2,
    severity: "Baja",
    neighborhood: "Centro (Parque 300 Años)"
  },
  {
    id: "inc-8",
    type: "Robo",
    description: "Asalto a mano armada a un minimarket. Dos hombres armados intimidaron al cajero y se llevaron el producido del día.",
    lat: 7.8765,
    lng: -72.4820,
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    upvotes: 32,
    downvotes: 0,
    severity: "Alta",
    neighborhood: "La Libertad"
  },
  {
    id: "inc-9",
    type: "Intento de robo",
    description: "Sujeto con herramienta sospechosa merodeando y probando manijas de autos estacionados.",
    lat: 7.8948,
    lng: -72.5032,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    upvotes: 4,
    downvotes: 0,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    id: "inc-10",
    type: "Riñas",
    description: "Pelea física entre conductores por disputa de pasajeros y parqueo. Obstrucción vial temporal.",
    lat: 7.8995,
    lng: -72.5098,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    upvotes: 9,
    downvotes: 4,
    severity: "Media",
    neighborhood: "Terminal"
  },
  {
    id: "inc-11",
    type: "Robo",
    description: "Arrebataron bolso y laptop a un estudiante universitario mientras esperaba transporte público.",
    lat: 7.9080,
    lng: -72.4920,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    upvotes: 19,
    downvotes: 0,
    severity: "Alta",
    neighborhood: "Quinta Oriental"
  },
  {
    id: "inc-12",
    type: "Consumo de drogas",
    description: "Consumo abierto de estupefacientes e indigencia obstaculizando el sendero peatonal en las noches.",
    lat: 7.9085,
    lng: -72.4950,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    upvotes: 11,
    downvotes: 1,
    severity: "Baja",
    neighborhood: "El Malecón"
  }
];

// Helper to filter incidents by search term, type, and age
export function filterIncidents(incidents, { search = '', type = 'All', timeRange = 'All' }) {
  return incidents.filter(inc => {
    // 1. Filter by Search Query (Description, neighborhood or type)
    const matchesSearch = !search || 
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      inc.type.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Filter by Incident Type
    const matchesType = type === 'All' || inc.type === type;
    if (!matchesType) return false;

    // 3. Filter by Time Range
    if (timeRange === 'All') return true;
    
    const incTime = new Date(inc.timestamp).getTime();
    const now = Date.now();
    const diffHours = (now - incTime) / (1000 * 60 * 60);

    if (timeRange === '24h') {
      return diffHours <= 24;
    } else if (timeRange === '7d') {
      return diffHours <= 24 * 7;
    }
    
    return true;
  });
}

// Calculate crime statistics based on filtered or all incidents
export function calculateIncidentStats(incidents) {
  const stats = {
    total: incidents.length,
    byType: {
      "Robo": 0,
      "Intento de robo": 0,
      "Consumo de drogas": 0,
      "Riñas": 0,
      "Zonas peligrosas": 0
    },
    bySeverity: {
      "Alta": 0,
      "Media": 0,
      "Baja": 0
    },
    byTimeOfDay: {
      "Madrugada (00-06)": 0,
      "Mañana (06-12)": 0,
      "Tarde (12-18)": 0,
      "Noche (18-00)": 0
    },
    mostDangerousNeighborhoods: [] // [{ name: '', count: X }]
  };

  const neighborhoodCounts = {};

  incidents.forEach(inc => {
    // 1. Increment Type count
    if (stats.byType[inc.type] !== undefined) {
      stats.byType[inc.type]++;
    }

    // 2. Increment Severity count
    if (stats.bySeverity[inc.severity] !== undefined) {
      stats.bySeverity[inc.severity]++;
    }

    // 3. Time of day grouping
    const date = new Date(inc.timestamp);
    const hour = date.getHours();
    if (hour >= 0 && hour < 6) {
      stats.byTimeOfDay["Madrugada (00-06)"]++;
    } else if (hour >= 6 && hour < 12) {
      stats.byTimeOfDay["Mañana (06-12)"]++;
    } else if (hour >= 12 && hour < 18) {
      stats.byTimeOfDay["Tarde (12-18)"]++;
    } else {
      stats.byTimeOfDay["Noche (18-00)"]++;
    }

    // 4. Neighborhood accumulation
    const nh = inc.neighborhood || 'Desconocido';
    neighborhoodCounts[nh] = (neighborhoodCounts[nh] || 0) + 1;
  });

  // Convert neighborhood counts to list and sort
  stats.mostDangerousNeighborhoods = Object.entries(neighborhoodCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 neighborhoods

  return stats;
}

// Logic to upvote/verify an incident
export function upvoteIncident(incidents, id) {
  return incidents.map(inc => {
    if (inc.id === id) {
      return { ...inc, upvotes: inc.upvotes + 1 };
    }
    return inc;
  });
}

// Logic to downvote/mark fake
export function downvoteIncident(incidents, id) {
  return incidents.map(inc => {
    if (inc.id === id) {
      return { ...inc, downvotes: inc.downvotes + 1 };
    }
    return inc;
  });
}

// Logic to add a new report
export function addIncident(incidents, newReport) {
  const newIncident = {
    id: `inc-${Date.now()}`,
    timestamp: new Date().toISOString(),
    upvotes: 1,
    downvotes: 0,
    ...newReport
  };
  return [newIncident, ...incidents];
}
