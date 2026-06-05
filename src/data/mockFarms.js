// Mock data for Cúcuta peasant farms (Mercado Campesino)
export const INITIAL_FARMS = [
  {
    id: "farm-1",
    name: "Finca La Esperanza",
    owner: "Don Pedro Alarcón",
    lat: 7.9425,
    lng: -72.4810, // San Faustino direction (North Rural)
    contact: "3124567890",
    sector: "San Faustino",
    description: "Cultivos tradicionales de pancoger con abonos orgánicos.",
    products: [
      { name: "Yuca", price: "$1.500 / kg" },
      { name: "Plátano Hartón", price: "$2.000 / kg" },
      { name: "Aguacate Lorena", price: "$3.000 / Unidad" }
    ]
  },
  {
    id: "farm-2",
    name: "Finca El Paraíso",
    owner: "Doña Carmen Rodríguez",
    lat: 7.9150,
    lng: -72.5550, // El Zulia direction (West Rural)
    contact: "3159876543",
    sector: "El Zulia",
    description: "Especializados en cítricos frescos y cacao de aroma fino.",
    products: [
      { name: "Limón Mandarino", price: "$2.500 / kg" },
      { name: "Naranja Valencia", price: "$1.800 / kg" },
      { name: "Cacao en Grano", price: "$9.000 / lb" }
    ]
  },
  {
    id: "farm-3",
    name: "Finca San Isidro",
    owner: "Don José Manuel Ramos",
    lat: 7.8420,
    lng: -72.5120, // Sur rural - Villa del Rosario direction
    contact: "3201122334",
    sector: "Villa del Rosario",
    description: "Caficultores tradicionales de la zona de ladera.",
    products: [
      { name: "Café Especial Molido", price: "$8.000 / lb" },
      { name: "Maíz Amarillo Desgranado", price: "$2.000 / kg" },
      { name: "Tomate Chonto", price: "$3.000 / kg" }
    ]
  },
  {
    id: "farm-4",
    name: "Huerta Orgánica El Salado",
    owner: "Familia Gómez",
    lat: 7.9260,
    lng: -72.5190, // Peri-urban El Salado sector
    contact: "3007788990",
    sector: "El Salado",
    description: "Hortalizas de hoja limpia cultivadas bajo invernadero.",
    products: [
      { name: "Cilantro fresco", price: "$1.000 / manojo" },
      { name: "Cebolla Junca", price: "$2.200 / atado" },
      { name: "Lechuga Crespa", price: "$1.500 / Unidad" }
    ]
  }
];

// Helper to filter farms by product name or farm name
export function filterFarms(farms, searchQuery) {
  if (!searchQuery) return farms;
  
  const q = searchQuery.toLowerCase();
  
  return farms.filter(farm => {
    // 1. Match farm name
    if (farm.name.toLowerCase().includes(q) || farm.sector.toLowerCase().includes(q)) {
      return true;
    }
    
    // 2. Match product name
    const matchesProduct = farm.products.some(p => p.name.toLowerCase().includes(q));
    return matchesProduct;
  });
}
