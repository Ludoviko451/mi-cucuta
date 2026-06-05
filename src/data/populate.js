import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQ4i2CpNRqX1fVGmiX6aPhAIsjZdOnkKc",
  authDomain: "mi-cucuta.firebaseapp.com",
  projectId: "mi-cucuta",
  storageBucket: "mi-cucuta.firebasestorage.app",
  messagingSenderId: "583367620945",
  appId: "1:583367620945:web:f581bff62b71ff6d38fb70",
  measurementId: "G-KRM5DVVGM6"
};

const INITIAL_INCIDENTS = [
  {
    type: "Robo",
    description: "Hurto de celular por dos sujetos en motocicleta de mediano cilindraje. Huyeron con dirección al puente.",
    lat: 7.9015,
    lng: -72.4980,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvotes: 14,
    downvotes: 1,
    severity: "Alta",
    neighborhood: "El Malecón"
  },
  {
    type: "Robo",
    description: "Robo de billetera bajo modalidad de cosquilleo en zona peatonal muy concurrida.",
    lat: 7.8892,
    lng: -72.5062,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    upvotes: 8,
    downvotes: 0,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    type: "Intento de robo",
    description: "Intentaron jalar una cadena de oro a un transeúnte. La comunidad reaccionó y el delincuente huyó hacia el canal.",
    lat: 7.8925,
    lng: -72.5025,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    upvotes: 21,
    downvotes: 2,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    type: "Consumo de drogas",
    description: "Grupo de jóvenes consumiendo sustancias psicoactivas debajo del puente peatonal, intimidando a estudiantes.",
    lat: 7.9065,
    lng: -72.4905,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    upvotes: 5,
    downvotes: 0,
    severity: "Baja",
    neighborhood: "La Riviera / UFPS"
  },
  {
    type: "Riñas",
    description: "Fuerte riña entre jóvenes con objetos contundentes. La policía tardó más de 20 minutos en llegar.",
    lat: 7.8835,
    lng: -72.4935,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 18,
    downvotes: 1,
    severity: "Alta",
    neighborhood: "San Luis"
  },
  {
    type: "Zonas peligrosas",
    description: "Sector extremadamente oscuro por luminarias dañadas. Constante presencia de personas en actitud sospechosa vigilando residencias.",
    lat: 7.9042,
    lng: -72.5320,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    upvotes: 45,
    downvotes: 3,
    severity: "Alta",
    neighborhood: "Atalaya"
  },
  {
    type: "Consumo de drogas",
    description: "Consumo constante de alucinógenos en zonas verdes del parque infantil durante las tardes.",
    lat: 7.8955,
    lng: -72.5085,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    upvotes: 7,
    downvotes: 2,
    severity: "Baja",
    neighborhood: "Centro (Parque 300 Años)"
  },
  {
    type: "Robo",
    description: "Asalto a mano armada a un minimarket. Dos hombres armados intimidaron al cajero y se llevaron el producido del día.",
    lat: 7.8765,
    lng: -72.4820,
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    upvotes: 32,
    downvotes: 0,
    severity: "Alta",
    neighborhood: "La Libertad"
  },
  {
    type: "Intento de robo",
    description: "Sujeto con herramienta sospechosa merodeando y probando manijas de autos estacionados.",
    lat: 7.8948,
    lng: -72.5032,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    upvotes: 4,
    downvotes: 0,
    severity: "Media",
    neighborhood: "Centro"
  },
  {
    type: "Riñas",
    description: "Pelea física entre conductores por disputa de pasajeros y parqueo. Obstrucción vial temporal.",
    lat: 7.8995,
    lng: -72.5098,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 9,
    downvotes: 4,
    severity: "Media",
    neighborhood: "Terminal"
  },
  {
    type: "Robo",
    description: "Arrebataron bolso y laptop a un estudiante universitario mientras esperaba transporte público.",
    lat: 7.9080,
    lng: -72.4920,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    upvotes: 19,
    downvotes: 0,
    severity: "Alta",
    neighborhood: "Quinta Oriental"
  },
  {
    type: "Consumo de drogas",
    description: "Consumo abierto de estupefacientes e indigencia obstaculizando el sendero peatonal en las noches.",
    lat: 7.9085,
    lng: -72.4950,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    upvotes: 11,
    downvotes: 1,
    severity: "Baja",
    neighborhood: "El Malecón"
  }
];

async function run() {
  console.log("Connecting to Firebase...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const colRef = collection(db, 'incidents');
  console.log("Checking if collection is empty...");
  
  try {
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      console.log(`Database already has ${snap.size} incidents. Skipping populating.`);
      process.exit(0);
    }
    
    console.log("Database is empty. Starting upload of 12 mock incidents in Cúcuta...");
    for (let i = 0; i < INITIAL_INCIDENTS.length; i++) {
      const docRef = await addDoc(colRef, INITIAL_INCIDENTS[i]);
      console.log(`[${i+1}/12] Added incident with ID: ${docRef.id}`);
    }
    console.log("All test data uploaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error executing database population:", error);
    process.exit(1);
  }
}

run();
