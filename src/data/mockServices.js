// Mock data for public services incidents in Cúcuta, Colombia
export const INITIAL_SERVICES = [
  {
    id: "srv-1",
    type: "Luminaria dañada",
    description: "Farola del alumbrado público apagada hace más de dos semanas, dejando el sector muy oscuro.",
    lat: 7.9030,
    lng: -72.4975,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "Pendiente",
    neighborhood: "El Malecón"
  },
  {
    id: "srv-2",
    type: "Hueco en la vía",
    description: "Crater de gran tamaño en la calzada derecha. Varios motorizados ya han sufrido accidentes.",
    lat: 7.8932,
    lng: -72.5042,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "En revisión",
    neighborhood: "Centro"
  },
  {
    id: "srv-3",
    type: "Fuga de agua",
    description: "Tubo matriz roto desperdiciando agua potable sobre el andén peatonal.",
    lat: 7.9075,
    lng: -72.4930,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    status: "Solucionado",
    neighborhood: "Quinta Oriental"
  },
  {
    id: "srv-4",
    type: "Acumulación de basura",
    description: "Escombros y bolsas de basura acumuladas en la esquina del puente peatonal, produciendo malos olores.",
    lat: 7.9058,
    lng: -72.5315,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    status: "Pendiente",
    neighborhood: "Atalaya"
  },
  {
    id: "srv-5",
    type: "Hueco en la vía",
    description: "Hundimiento de la capa asfáltica en la intersección semafórica principal.",
    lat: 7.8845,
    lng: -72.4950,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: "En revisión",
    neighborhood: "San Luis"
  },
  {
    id: "srv-6",
    type: "Luminaria dañada",
    description: "Farolas intermitentes en la subida del puente de los cuatro vientos.",
    lat: 7.8760,
    lng: -72.4815,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: "Solucionado",
    neighborhood: "La Libertad"
  }
];

// Filters helper for services
export function filterServices(services, { search = '', type = 'All' }) {
  return services.filter(srv => {
    const matchesSearch = !search ||
      srv.description.toLowerCase().includes(search.toLowerCase()) ||
      srv.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      srv.type.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    const matchesType = type === 'All' || srv.type === type;
    return matchesType;
  });
}

// Add a new service report
export function addServiceReport(services, report) {
  const newReport = {
    id: `srv-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: "Pendiente",
    ...report
  };
  return [newReport, ...services];
}
