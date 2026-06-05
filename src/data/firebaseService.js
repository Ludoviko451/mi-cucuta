import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  increment,
  getDocs
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { INITIAL_INCIDENTS, filterIncidents } from './mockIncidents';

// Local backup state when Firebase is not configured
let localIncidents = [...INITIAL_INCIDENTS];
const localListeners = new Set();

const notifyLocalListeners = () => {
  localListeners.forEach(listener => listener([...localIncidents]));
};

// Helper to pre-populate Firebase if it's empty
async function populateDatabaseIfEmpty() {
  if (!isFirebaseConfigured || !db) return;
  try {
    const q = collection(db, 'incidents');
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("Firestore collection 'incidents' is empty. Pre-populating with Cúcuta mock data...");
      for (const incident of INITIAL_INCIDENTS) {
        await addDoc(collection(db, 'incidents'), {
          type: incident.type,
          description: incident.description,
          lat: incident.lat,
          lng: incident.lng,
          timestamp: incident.timestamp,
          upvotes: incident.upvotes,
          downvotes: incident.downvotes,
          severity: incident.severity,
          neighborhood: incident.neighborhood
        });
      }
      console.log("Pre-population completed successfully.");
    }
  } catch (error) {
    console.error("Error pre-populating database:", error);
  }
}

// 1. Subscribe to real-time incident reports
export function subscribeIncidents(callback) {
  if (!isFirebaseConfigured || !db) {
    // Return mock data subscription for testing / fallback
    localListeners.add(callback);
    callback([...localIncidents]);
    return () => {
      localListeners.delete(callback);
    };
  }

  // Pre-populate if collection is empty
  populateDatabaseIfEmpty();

  const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const incidentsList = [];
    snapshot.forEach((docSnap) => {
      incidentsList.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    callback(incidentsList);
  }, (error) => {
    console.error("Firestore onSnapshot error:", error);
    // On subscription failure, fallback to mock data
    callback([...localIncidents]);
  });
}

// 2. Publish a new report online or locally
export async function saveIncident(reportData) {
  const newReport = {
    type: reportData.type,
    description: reportData.description,
    lat: Number(reportData.lat),
    lng: Number(reportData.lng),
    timestamp: new Date().toISOString(),
    upvotes: 1,
    downvotes: 0,
    severity: reportData.severity,
    neighborhood: reportData.neighborhood
  };

  if (!isFirebaseConfigured || !db) {
    // Save to local fallback state
    const created = { id: `inc-${Date.now()}`, ...newReport };
    localIncidents = [created, ...localIncidents];
    notifyLocalListeners();
    return created;
  }

  try {
    const docRef = await addDoc(collection(db, 'incidents'), newReport);
    return { id: docRef.id, ...newReport };
  } catch (error) {
    console.error("Error writing document to Firestore:", error);
    throw error;
  }
}

// 3. Register a vote (upvote / downvote)
export async function voteIncident(id, voteType) {
  if (!isFirebaseConfigured || !db) {
    // Update local fallback state
    localIncidents = localIncidents.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          upvotes: voteType === 'up' ? inc.upvotes + 1 : inc.upvotes,
          downvotes: voteType === 'down' ? inc.downvotes + 1 : inc.downvotes
        };
      }
      return inc;
    });
    notifyLocalListeners();
    return;
  }

  try {
    const docRef = doc(db, 'incidents', id);
    const incrementField = voteType === 'up' ? 'upvotes' : 'downvotes';
    await updateDoc(docRef, {
      [incrementField]: increment(1)
    });
  } catch (error) {
    console.error(`Error voting ${voteType} on document ${id}:`, error);
    throw error;
  }
}
