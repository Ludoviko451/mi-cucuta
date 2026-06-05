import { describe, it, expect } from 'vitest';
import { 
  filterIncidents, 
  calculateIncidentStats, 
  upvoteIncident, 
  downvoteIncident, 
  addIncident 
} from './mockIncidents';

// Sample mock data for isolated tests
const TEST_INCIDENTS = [
  {
    id: "t-1",
    type: "Robo",
    description: "Robo de celular en El Malecón",
    lat: 7.9015,
    lng: -72.4980,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    upvotes: 5,
    downvotes: 0,
    severity: "Alta",
    neighborhood: "El Malecón"
  },
  {
    id: "t-2",
    type: "Intento de robo",
    description: "Sujeto sospechoso merodeando vehículos",
    lat: 7.8925,
    lng: -72.5025,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    upvotes: 2,
    downvotes: 1,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    id: "t-3",
    type: "Consumo de drogas",
    description: "Consumo de alucinógenos en el parque",
    lat: 7.9065,
    lng: -72.4905,
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago (old)
    upvotes: 1,
    downvotes: 0,
    severity: "Baja",
    neighborhood: "Atalaya"
  },
  {
    id: "t-4",
    type: "Robo",
    description: "Hurto en residencia sector residencial",
    lat: 7.8835,
    lng: -72.4935,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    upvotes: 10,
    downvotes: 2,
    severity: "Alta",
    neighborhood: "El Malecón"
  }
];

describe('Insecurity Map Incident Data Utilities', () => {

  describe('filterIncidents', () => {
    it('should return all incidents when filters are empty', () => {
      const result = filterIncidents(TEST_INCIDENTS, { search: '', type: 'All', timeRange: 'All' });
      expect(result).toHaveLength(4);
    });

    it('should filter incidents by search term matching description', () => {
      const result = filterIncidents(TEST_INCIDENTS, { search: 'celular', type: 'All', timeRange: 'All' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('t-1');
    });

    it('should filter incidents by search term matching neighborhood', () => {
      const result = filterIncidents(TEST_INCIDENTS, { search: 'El Malecón', type: 'All', timeRange: 'All' });
      expect(result).toHaveLength(2);
      expect(result.map(i => i.id)).toContain('t-1');
      expect(result.map(i => i.id)).toContain('t-4');
    });

    it('should filter incidents by type', () => {
      const result = filterIncidents(TEST_INCIDENTS, { search: '', type: 'Robo', timeRange: 'All' });
      expect(result).toHaveLength(2);
      expect(result.every(i => i.type === 'Robo')).toBe(true);
    });

    it('should filter incidents within the last 24 hours', () => {
      const result = filterIncidents(TEST_INCIDENTS, { search: '', type: 'All', timeRange: '24h' });
      expect(result).toHaveLength(2); // t-1 (1h ago) and t-2 (5h ago)
      expect(result.map(i => i.id)).toContain('t-1');
      expect(result.map(i => i.id)).toContain('t-2');
    });

    it('should filter incidents within the last 7 days', () => {
      const result = filterIncidents(TEST_INCIDENTS, { search: '', type: 'All', timeRange: '7d' });
      expect(result).toHaveLength(3); // t-1 (1h), t-2 (5h), t-4 (2d). Excludes t-3 (30d)
      expect(result.map(i => i.id)).not.toContain('t-3');
    });
  });

  describe('calculateIncidentStats', () => {
    it('should return aggregated stats correctly', () => {
      const stats = calculateIncidentStats(TEST_INCIDENTS);
      
      expect(stats.total).toBe(4);
      expect(stats.byType['Robo']).toBe(2);
      expect(stats.byType['Intento de robo']).toBe(1);
      expect(stats.bySeverity['Alta']).toBe(2);
      expect(stats.bySeverity['Baja']).toBe(1);

      // Verify neighborhood rankings
      // El Malecón has 2, Centro has 1, Atalaya has 1
      expect(stats.mostDangerousNeighborhoods[0].name).toBe('El Malecón');
      expect(stats.mostDangerousNeighborhoods[0].count).toBe(2);
    });
  });

  describe('upvoteIncident', () => {
    it('should increment upvotes of specified incident by 1', () => {
      const targetId = 't-2';
      const updated = upvoteIncident(TEST_INCIDENTS, targetId);
      
      const originalItem = TEST_INCIDENTS.find(i => i.id === targetId);
      const updatedItem = updated.find(i => i.id === targetId);
      
      expect(updatedItem.upvotes).toBe(originalItem.upvotes + 1);
      
      // Ensure other fields and items remain unchanged
      expect(updatedItem.description).toBe(originalItem.description);
      const unchangedItem = updated.find(i => i.id === 't-1');
      expect(unchangedItem.upvotes).toBe(5);
    });
  });

  describe('downvoteIncident', () => {
    it('should increment downvotes of specified incident by 1', () => {
      const targetId = 't-2';
      const updated = downvoteIncident(TEST_INCIDENTS, targetId);
      
      const originalItem = TEST_INCIDENTS.find(i => i.id === targetId);
      const updatedItem = updated.find(i => i.id === targetId);
      
      expect(updatedItem.downvotes).toBe(originalItem.downvotes + 1);
      expect(updatedItem.upvotes).toBe(originalItem.upvotes); // Upvotes shouldn't change
    });
  });

  describe('addIncident', () => {
    it('should add a new incident to the top of the list', () => {
      const newReport = {
        type: 'Riñas',
        description: 'Pelea en calle peatonal',
        lat: 7.8999,
        lng: -72.5011,
        severity: 'Media',
        neighborhood: 'Centro'
      };

      const updatedList = addIncident(TEST_INCIDENTS, newReport);
      
      expect(updatedList).toHaveLength(5);
      const createdItem = updatedList[0];
      
      // Verify properties
      expect(createdItem.id).toContain('inc-');
      expect(createdItem.type).toBe('Riñas');
      expect(createdItem.description).toBe('Pelea en calle peatonal');
      expect(createdItem.upvotes).toBe(1); // Defaults to 1 upvote on create
      expect(createdItem.downvotes).toBe(0);
      expect(createdItem.timestamp).toBeDefined();
      
      // Check coordinates
      expect(createdItem.lat).toBe(7.8999);
      expect(createdItem.lng).toBe(-72.5011);
    });
  });
});
