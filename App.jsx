import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import {
  UserPlus,
  Play,
  EyeOff,
  Eye,
  Skull,
  CheckCircle,
  Crown,
  Loader2,
  Users,
  Share2,
  Copy,
  Check,
  RefreshCw,
  X,
  GripVertical,
  Camera,
  Image,
  Trophy,
  Minus,
  Plus,
  Mail,
  LogOut,
  AlertTriangle,
  HelpCircle,
  Clock,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  UserCircle,
  Star
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyD6uuwtRjvJUke5zuWrtn9gRAwqiMaBbfg",
  authDomain: "impostor-b645b.firebaseapp.com",
  projectId: "impostor-b645b",
  storageBucket: "impostor-b645b.appspot.com",
  messagingSenderId: "1052326710248",
  appId: "1:1052326710248:web:fa56e216c58d113a24b25d",
  measurementId: "G-T0DRWK2SDS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'impostor-game-v5';
const googleProvider = new GoogleAuthProvider();

const WORD_CATEGORIES = {
  EASY: [
    { category: 'Animales de granja', words: ['Vaca', 'Cerdo', 'Gallina', 'Caballo', 'Oveja', 'Burro', 'Cabra', 'Pato', 'Ganso', 'Conejo'] },
    { category: 'Animales salvajes', words: ['León', 'Tigre', 'Elefante', 'Jirafa', 'Cebra', 'Mono', 'Oso', 'Lobo', 'Zorro', 'Hipopótamo'] },
    { category: 'Mascotas', words: ['Perro', 'Gato', 'Pez', 'Hámster', 'Tortuga', 'Canario', 'Loro', 'Cobaya', 'Hurón', 'Iguana'] },
    { category: 'Animales del mar', words: ['Delfín', 'Tiburón', 'Ballena', 'Pulpo', 'Estrella de mar', 'Cangrejo', 'Medusa', 'Foca', 'Pingüino', 'Caballito de mar'] },
    { category: 'Insectos', words: ['Mariposa', 'Abeja', 'Hormiga', 'Mariquita', 'Araña', 'Grillo', 'Mosca', 'Libélula', 'Escarabajo', 'Oruga'] },
    { category: 'Frutas', words: ['Manzana', 'Plátano', 'Naranja', 'Fresa', 'Uva', 'Sandía', 'Melón', 'Piña', 'Mango', 'Pera', 'Cereza', 'Kiwi', 'Limón', 'Durazno', 'Coco'] },
    { category: 'Verduras', words: ['Zanahoria', 'Tomate', 'Lechuga', 'Brócoli', 'Papa', 'Cebolla', 'Pepino', 'Espinaca', 'Calabaza', 'Maíz', 'Pimiento', 'Apio', 'Rábano'] },
    { category: 'Comida rápida', words: ['Pizza', 'Hamburguesa', 'Hot dog', 'Papas fritas', 'Tacos', 'Nuggets', 'Helado', 'Dona', 'Sandwich', 'Nachos'] },
    { category: 'Postres', words: ['Pastel', 'Galletas', 'Chocolate', 'Flan', 'Gelatina', 'Paleta', 'Churros', 'Brownie', 'Cupcake', 'Pie'] },
    { category: 'Bebidas', words: ['Agua', 'Jugo', 'Leche', 'Limonada', 'Malteada', 'Chocolate caliente', 'Té', 'Refresco', 'Smoothie', 'Horchata'] },
    { category: 'Útiles escolares', words: ['Lápiz', 'Cuaderno', 'Borrador', 'Tijeras', 'Pegamento', 'Colores', 'Regla', 'Mochila', 'Pluma', 'Sacapuntas', 'Marcadores', 'Compás'] },
    { category: 'Partes del cuerpo', words: ['Mano', 'Pie', 'Cabeza', 'Oreja', 'Nariz', 'Boca', 'Ojo', 'Brazo', 'Pierna', 'Dedo', 'Rodilla', 'Codo', 'Hombro'] },
    { category: 'Ropa', words: ['Camiseta', 'Pantalón', 'Zapatos', 'Calcetines', 'Gorra', 'Chamarra', 'Vestido', 'Falda', 'Shorts', 'Pijama', 'Suéter', 'Bufanda', 'Guantes'] },
    { category: 'Colores', words: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Morado', 'Rosa', 'Negro', 'Blanco', 'Café', 'Gris', 'Dorado', 'Plateado'] },
    { category: 'Números', words: ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Diez', 'Cien', 'Mil', 'Millón', 'Cero', 'Docena', 'Par'] },
    { category: 'Familia', words: ['Mamá', 'Papá', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Primo', 'Bebé', 'Sobrino', 'Padrino'] },
    { category: 'Juguetes', words: ['Pelota', 'Muñeca', 'Carro', 'Rompecabezas', 'Lego', 'Peluche', 'Yoyo', 'Patineta', 'Bicicleta', 'Trompo', 'Canicas', 'Cometa'] },
    { category: 'Lugares de la casa', words: ['Cocina', 'Baño', 'Sala', 'Cuarto', 'Jardín', 'Garaje', 'Comedor', 'Escaleras', 'Sótano', 'Azotea', 'Patio', 'Balcón'] },
    { category: 'Muebles', words: ['Cama', 'Silla', 'Mesa', 'Sofá', 'Escritorio', 'Closet', 'Librero', 'Lámpara', 'Espejo', 'Alfombra', 'Cortinas', 'Televisión'] },
    { category: 'Clima', words: ['Sol', 'Lluvia', 'Nieve', 'Viento', 'Nube', 'Arcoíris', 'Tormenta', 'Granizo', 'Neblina', 'Trueno', 'Relámpago', 'Tornado'] },
    { category: 'Vehículos', words: ['Carro', 'Autobús', 'Avión', 'Barco', 'Tren', 'Bicicleta', 'Moto', 'Helicóptero', 'Camión', 'Ambulancia', 'Taxi', 'Cohete'] },
    { category: 'Instrumentos musicales', words: ['Guitarra', 'Piano', 'Batería', 'Violín', 'Flauta', 'Trompeta', 'Tambor', 'Maracas', 'Xilófono', 'Armónica', 'Triángulo'] },
    { category: 'Deportes básicos', words: ['Fútbol', 'Baloncesto', 'Béisbol', 'Natación', 'Correr', 'Saltar', 'Ciclismo', 'Patinar', 'Bailar', 'Gimnasia', 'Voleibol'] }
  ],
  MEDIUM: [
    { category: 'Tecnología', words: ['Smartphone', 'Laptop', 'Tablet', 'WiFi', 'Bluetooth', 'USB', 'App', 'Selfie', 'Streaming', 'Download', 'Password', 'Screenshot', 'Emoji', 'Hashtag', 'Viral'] },
    { category: 'Redes sociales', words: ['Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Facebook', 'Twitter', 'Snapchat', 'Discord', 'Twitch', 'Pinterest', 'LinkedIn', 'Telegram', 'Reddit'] },
    { category: 'Videojuegos', words: ['Minecraft', 'Fortnite', 'Mario', 'Pokémon', 'FIFA', 'Call of Duty', 'GTA', 'Roblox', 'Among Us', 'League of Legends', 'Zelda', 'Sonic', 'Tetris', 'Candy Crush'] },
    { category: 'Consolas', words: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Game Boy', 'Wii', 'Atari', 'Steam Deck', 'PC Gamer', 'Arcade', 'VR', 'Joystick', 'Control'] },
    { category: 'Profesiones', words: ['Doctor', 'Abogado', 'Ingeniero', 'Maestro', 'Chef', 'Policía', 'Bombero', 'Piloto', 'Veterinario', 'Arquitecto', 'Periodista', 'Dentista', 'Enfermero', 'Contador', 'Diseñador'] },
    { category: 'Trabajos modernos', words: ['Youtuber', 'Influencer', 'Streamer', 'Gamer profesional', 'Community manager', 'Freelancer', 'Desarrollador', 'DJ', 'Fotógrafo', 'Blogger', 'Coach', 'Emprendedor'] },
    { category: 'Deportes', words: ['Fútbol americano', 'Tenis', 'Golf', 'Hockey', 'Rugby', 'Boxeo', 'Artes marciales', 'Surf', 'Esquí', 'Snowboard', 'Skate', 'Parkour', 'Crossfit', 'Yoga', 'MMA'] },
    { category: 'Equipos de fútbol', words: ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Bayern Munich', 'PSG', 'Juventus', 'Chelsea', 'América', 'Chivas', 'Boca Juniors', 'River Plate'] },
    { category: 'Países', words: ['México', 'Estados Unidos', 'España', 'Argentina', 'Colombia', 'Brasil', 'Japón', 'China', 'Francia', 'Italia', 'Alemania', 'Inglaterra', 'Canadá', 'Australia', 'Corea'] },
    { category: 'Ciudades', words: ['Nueva York', 'París', 'Tokio', 'Londres', 'Miami', 'Los Ángeles', 'Madrid', 'Roma', 'Dubái', 'Las Vegas', 'Barcelona', 'Cancún', 'Río de Janeiro', 'Berlín'] },
    { category: 'Comida internacional', words: ['Sushi', 'Ramen', 'Pasta', 'Tacos', 'Burrito', 'Paella', 'Curry', 'Kebab', 'Dim sum', 'Croissant', 'Ceviche', 'Falafel', 'Gyros', 'Pho'] },
    { category: 'Restaurantes', words: ['McDonald\'s', 'Burger King', 'Starbucks', 'KFC', 'Pizza Hut', 'Subway', 'Domino\'s', 'Taco Bell', 'Wendy\'s', 'Chipotle', 'Dunkin', 'Chili\'s'] },
    { category: 'Marcas de ropa', words: ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Louis Vuitton', 'Puma', 'Levi\'s', 'Vans', 'Converse', 'Supreme', 'North Face', 'Under Armour'] },
    { category: 'Superhéroes', words: ['Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Thor', 'Hulk', 'Capitán América', 'Wonder Woman', 'Aquaman', 'Flash', 'Deadpool', 'Wolverine', 'Black Panther'] },
    { category: 'Películas animadas', words: ['Toy Story', 'Frozen', 'Shrek', 'Coco', 'Encanto', 'Moana', 'Los Increíbles', 'Buscando a Nemo', 'Up', 'Ratatouille', 'Cars', 'Madagascar', 'Kung Fu Panda'] },
    { category: 'Series de TV', words: ['Los Simpson', 'Bob Esponja', 'Dragon Ball', 'Naruto', 'One Piece', 'Attack on Titan', 'Stranger Things', 'Breaking Bad', 'Game of Thrones', 'Friends', 'The Office'] },
    { category: 'Música géneros', words: ['Reggaetón', 'Pop', 'Rock', 'Hip hop', 'Trap', 'Corridos', 'Cumbia', 'Salsa', 'Bachata', 'Electrónica', 'K-pop', 'Jazz', 'Country', 'R&B', 'Metal'] },
    { category: 'Artistas musicales', words: ['Bad Bunny', 'Taylor Swift', 'BTS', 'Drake', 'Shakira', 'J Balvin', 'Daddy Yankee', 'Karol G', 'Peso Pluma', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd'] },
    { category: 'Bebidas con alcohol', words: ['Cerveza', 'Vino', 'Tequila', 'Mezcal', 'Whisky', 'Vodka', 'Ron', 'Margarita', 'Piña colada', 'Mojito', 'Sangría', 'Michelada', 'Champagne'] },
    { category: 'Café', words: ['Espresso', 'Americano', 'Capuchino', 'Latte', 'Mocha', 'Frappé', 'Cold brew', 'Macchiato', 'Café con leche', 'Descafeinado', 'Café irlandés'] },
    { category: 'Festividades', words: ['Navidad', 'Año Nuevo', 'Halloween', 'Día de Muertos', 'San Valentín', 'Pascua', 'Independencia', 'Acción de Gracias', 'Carnaval', 'Posadas', 'Reyes Magos'] },
    { category: 'Emociones', words: ['Feliz', 'Triste', 'Enojado', 'Asustado', 'Sorprendido', 'Emocionado', 'Nervioso', 'Aburrido', 'Celoso', 'Orgulloso', 'Confundido', 'Avergonzado', 'Ansioso'] },
    { category: 'Materias escolares', words: ['Matemáticas', 'Español', 'Historia', 'Ciencias', 'Inglés', 'Educación física', 'Arte', 'Música', 'Computación', 'Química', 'Física', 'Biología', 'Geografía'] },
    { category: 'Apps famosas', words: ['Uber', 'Netflix', 'Spotify', 'Amazon', 'Google Maps', 'Shazam', 'Duolingo', 'Zoom', 'Google Meet', 'PayPal', 'Mercado Libre', 'Airbnb', 'Tinder'] }
  ],
  HARD: [
    { category: 'Conceptos económicos', words: ['Inflación', 'Recesión', 'PIB', 'Devaluación', 'Inversión', 'Acciones', 'Criptomoneda', 'Bitcoin', 'Bolsa de valores', 'Impuestos', 'Hipoteca', 'Crédito', 'Interés', 'Monopolio'] },
    { category: 'Política', words: ['Democracia', 'Dictadura', 'Senado', 'Congreso', 'Constitución', 'Elecciones', 'Voto', 'Partido político', 'Presidente', 'Gobernador', 'Reforma', 'Corrupción', 'Campaña'] },
    { category: 'Derecho', words: ['Demanda', 'Juicio', 'Sentencia', 'Abogado defensor', 'Fiscal', 'Juez', 'Testigo', 'Evidencia', 'Amparo', 'Apelación', 'Veredicto', 'Fianza', 'Contrato', 'Divorcio'] },
    { category: 'Medicina', words: ['Cirugía', 'Diagnóstico', 'Síntoma', 'Vacuna', 'Antibiótico', 'Anestesia', 'Biopsia', 'Quimioterapia', 'Radiografía', 'Ultrasonido', 'Transplante', 'Rehabilitación'] },
    { category: 'Enfermedades', words: ['Diabetes', 'Cáncer', 'Alzheimer', 'Parkinson', 'Depresión', 'Ansiedad', 'Insomnio', 'Migraña', 'Artritis', 'Asma', 'Alergia', 'Hipertensión', 'COVID'] },
    { category: 'Ciencia', words: ['Átomo', 'Molécula', 'ADN', 'Célula', 'Fotosíntesis', 'Gravedad', 'Evolución', 'Teoría', 'Hipótesis', 'Experimento', 'Microscopio', 'Laboratorio', 'Fórmula'] },
    { category: 'Espacio', words: ['Galaxia', 'Agujero negro', 'Supernova', 'Asteroide', 'Cometa', 'Meteorito', 'Órbita', 'Satélite', 'Estación espacial', 'Marte', 'Júpiter', 'Vía Láctea', 'NASA', 'SpaceX'] },
    { category: 'Filosofía', words: ['Existencialismo', 'Nihilismo', 'Ética', 'Moral', 'Virtud', 'Consciencia', 'Libre albedrío', 'Utopía', 'Distopía', 'Metafísica', 'Lógica', 'Paradoja', 'Dilema'] },
    { category: 'Psicología', words: ['Subconsciente', 'Ego', 'Trauma', 'Terapia', 'Fobia', 'Paranoia', 'Esquizofrenia', 'Bipolar', 'Narcisismo', 'Empatía', 'Autoestima', 'Psicoanálisis'] },
    { category: 'Historia mundial', words: ['Revolución francesa', 'Guerra mundial', 'Guerra fría', 'Imperio romano', 'Renacimiento', 'Edad media', 'Independencia', 'Colonización', 'Holocausto', 'Muro de Berlín'] },
    { category: 'Personajes históricos', words: ['Napoleón', 'Cleopatra', 'Einstein', 'Da Vinci', 'Shakespeare', 'Mozart', 'Gandhi', 'Mandela', 'Frida Kahlo', 'Che Guevara', 'Julio César', 'Buda'] },
    { category: 'Arte y movimientos', words: ['Renacimiento', 'Barroco', 'Impresionismo', 'Surrealismo', 'Cubismo', 'Arte abstracto', 'Pop art', 'Minimalismo', 'Gótico', 'Art déco', 'Vanguardia'] },
    { category: 'Literatura', words: ['Novela', 'Poesía', 'Ensayo', 'Biografía', 'Ficción', 'Ciencia ficción', 'Fantasía', 'Thriller', 'Suspenso', 'Drama', 'Comedia', 'Tragedia', 'Épica'] },
    { category: 'Cine clásico', words: ['Titanic', 'El Padrino', 'Casablanca', 'Ciudadano Kane', 'Matrix', 'Pulp Fiction', 'Forrest Gump', 'El Resplandor', 'Psicosis', 'Alien', '2001 Odisea'] },
    { category: 'Directores de cine', words: ['Spielberg', 'Tarantino', 'Scorsese', 'Kubrick', 'Hitchcock', 'Nolan', 'Guillermo del Toro', 'Cuarón', 'Iñárritu', 'Tim Burton', 'Ridley Scott'] },
    { category: 'Premios', words: ['Oscar', 'Grammy', 'Emmy', 'Nobel', 'Pulitzer', 'Golden Globe', 'Cannes', 'MTV Awards', 'Billboard', 'Latin Grammy', 'Balón de Oro', 'Goya'] },
    { category: 'Maravillas del mundo', words: ['Pirámides de Egipto', 'Machu Picchu', 'Coliseo Romano', 'Taj Mahal', 'Cristo Redentor', 'Gran Muralla', 'Petra', 'Chichén Itzá', 'Torre Eiffel', 'Estatua de la Libertad'] },
    { category: 'Religiones', words: ['Cristianismo', 'Islam', 'Budismo', 'Hinduismo', 'Judaísmo', 'Ateísmo', 'Agnosticismo', 'Biblia', 'Corán', 'Karma', 'Reencarnación', 'Meditación'] },
    { category: 'Mitología', words: ['Zeus', 'Poseidón', 'Hades', 'Atenea', 'Thor', 'Odin', 'Anubis', 'Ra', 'Quetzalcóatl', 'Medusa', 'Minotauro', 'Pegaso', 'Fénix', 'Dragón', 'Sirena'] },
    { category: 'Astronomía', words: ['Eclipse', 'Equinoccio', 'Solsticio', 'Constelación', 'Nebulosa', 'Púlsar', 'Quásar', 'Materia oscura', 'Expansión', 'Big Bang', 'Exoplaneta', 'Año luz'] },
    { category: 'Tecnología avanzada', words: ['Inteligencia artificial', 'Machine learning', 'Blockchain', 'NFT', 'Metaverso', 'Realidad virtual', 'Realidad aumentada', 'Internet de las cosas', 'Ciberseguridad', '5G', 'Quantum'] },
    { category: 'Redes y programación', words: ['Algoritmo', 'Código', 'Bug', 'Servidor', 'Base de datos', 'API', 'Frontend', 'Backend', 'Cloud', 'Linux', 'Python', 'JavaScript', 'HTML'] },
    { category: 'Negocios', words: ['Startup', 'CEO', 'Franquicia', 'Marketing', 'Branding', 'ROI', 'KPI', 'Outsourcing', 'Crowdfunding', 'Venture capital', 'IPO', 'Fusión', 'Adquisición'] },
    { category: 'Sustentabilidad', words: ['Cambio climático', 'Calentamiento global', 'Reciclaje', 'Energía renovable', 'Solar', 'Eólica', 'Huella de carbono', 'Biodegradable', 'Orgánico', 'Sustentable', 'Contaminación'] }
  ]
};

// 30 avatares predefinidos
const PRESET_AVATARS = [
  '🦊', '🐼', '🦁', '🐯', '🐻', '🐨', '🐸', '🦄', '🐲', '🦋',
  '🦅', '🦉', '🐺', '🦈', '🐙', '🦀', '🐢', '🦩', '🦜', '🐧',
  '👻', '🤖', '👽', '🎃', '💀', '🦸', '🧙', '🧛', '🥷', '🦹'
];

export default function ImpostorGame() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerAge, setPlayerAge] = useState(18);
  const [playerStats, setPlayerStats] = useState({});

  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [gameState, setGameState] = useState('AUTH');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // My local players (on this device)
  const [isMultiplayerLocal, setIsMultiplayerLocal] = useState(() => {
    const saved = localStorage.getItem('impostor_multiplayer_mode');
    return saved === 'true';
  });
  const [myLocalPlayers, setMyLocalPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('impostor_local_players');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [newLocalPlayerName, setNewLocalPlayerName] = useState('');
  const [newLocalPlayerAge, setNewLocalPlayerAge] = useState(18);
  const [showAddLocalPlayer, setShowAddLocalPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');
  const [nameError, setNameError] = useState(''); // Error al editar nombre

  // Turn-based reveal/vote for local players
  const [localTurnIndex, setLocalTurnIndex] = useState(0);
  const [localTurnPhase, setLocalTurnPhase] = useState('none'); // 'none', 'pass', 'ready', 'reveal', 'vote', 'evalExplanation', 'strategyVote'
  const [localVotesDone, setLocalVotesDone] = useState({}); // {playerId: votedForId}
  const [localTurnsInitialized, setLocalTurnsInitialized] = useState(false);

  const [showRole, setShowRole] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState(null);
  const [votedForMap, setVotedForMap] = useState({});
  const [selectedVotes, setSelectedVotes] = useState([]); // Array de IDs seleccionados para votación múltiple
  const [votingAsPlayer, setVotingAsPlayer] = useState(null); // Para que el anfitrión vote en nombre de otro jugador
  const [showPendingVotesModal, setShowPendingVotesModal] = useState(false); // Modal para gestionar votos pendientes
  const [strategyEvaluation, setStrategyEvaluation] = useState(null); // {playerId, playerName, votes: {coherent: 0, incoherent: 0}, votedBy: []}
  const [myStrategyVote, setMyStrategyVote] = useState(null); // 'coherent' o 'incoherent'
  const [shareStatus, setShareStatus] = useState('idle');
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editingLocalPlayerAvatar, setEditingLocalPlayerAvatar] = useState(null); // ID del jugador local editando avatar
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // Índice donde se soltará el jugador
  const [kickedNotification, setKickedNotification] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const draggedPlayerRef = useRef(null); // Ref para drag and drop inmediato

  // Guardar jugadores locales en localStorage
  useEffect(() => {
    localStorage.setItem('impostor_local_players', JSON.stringify(myLocalPlayers));
  }, [myLocalPlayers]);

  useEffect(() => {
    localStorage.setItem('impostor_multiplayer_mode', isMultiplayerLocal.toString());
  }, [isMultiplayerLocal]);

  // Get all my player IDs (main + local) - uses deviceId from roomData for reliability
  const getMyPlayerIds = (data = null) => {
    const roomPlayers = data?.players || roomData?.players || [];
    // Players on this device have deviceId === user.uid
    return roomPlayers.filter(p => p.deviceId === user?.uid).map(p => p.id);
  };

  // Get my players from room data - players on this device
  const getMyPlayersFromRoom = (data = null) => {
    const roomPlayers = data?.players || roomData?.players || [];
    // Players on this device have deviceId === user.uid
    return roomPlayers.filter(p => p.deviceId === user?.uid);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code');

    // Si hay código en URL, tiene prioridad - limpiar sala anterior
    if (codeFromUrl) {
      setJoinCode(codeFromUrl.toUpperCase());
      localStorage.removeItem('impostor_room'); // Limpiar sala anterior para unirse a la nueva
    }

    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        loadPlayerStats(u.uid);
        if (u.displayName && !playerName) setPlayerName(u.displayName);

        // Si hay código en URL, ir al menú para unirse a la nueva sala
        if (codeFromUrl) {
          setGameState('MENU');
          return;
        }

        // Intentar reconectar a sala guardada (solo si no hay código en URL)
        const savedRoom = localStorage.getItem('impostor_room');
        if (savedRoom) {
          try {
            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', savedRoom);
            const snap = await getDoc(roomRef);
            if (snap.exists()) {
              const data = snap.data();
              // Verificar si el usuario está en la sala
              const isInRoom = data.players?.some(p => p.deviceId === u.uid || p.id === u.uid);
              if (isInRoom) {
                setRoomCode(savedRoom);
                setRoomData(data); // Guardar datos de sala para inicializar turnos
                if (data.status === 'lobby') setGameState('LOBBY');
                else if (data.status === 'revealing') setGameState('REVEAL');
                else if (data.status === 'voting') setGameState('VOTING');
                else if (data.status === 'evaluating') setGameState('EVALUATING');
                else if (data.status === 'finished') setGameState('RESULTS');
                else setGameState('LOBBY');
                return;
              }
            }
            // Si no está en la sala o no existe, limpiar
            localStorage.removeItem('impostor_room');
          } catch (e) {
            localStorage.removeItem('impostor_room');
          }
        }
        setGameState('MENU');
      } else {
        setGameState('AUTH');
      }
    });
  }, []);

  const loadPlayerStats = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'stats', uid));
      if (snap.exists()) {
        const data = snap.data();
        setPlayerStats(data);
        if (data.name && !playerName) setPlayerName(data.name);
        if (data.age) setPlayerAge(data.age);
      }
    } catch (e) { console.error(e); }
  };

  const savePlayerProfile = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'stats', user.uid),
        { ...playerStats, name: playerName, age: parseInt(playerAge) || 18 }, { merge: true });
    } catch (e) { console.error(e); }
  };

  // Room listener
  useEffect(() => {
    if (!user || !roomCode || gameState === 'MENU' || gameState === 'AUTH') return;

    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode);

    const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);

        const myIds = getMyPlayerIds(data);
        const stillInRoom = data.players?.some(p => myIds.includes(p.id));
        if (!stillInRoom && gameState !== 'MENU' && gameState !== 'AUTH') {
          setKickedNotification(true);
          return;
        }

        // Auto-finish when all active players voted (exclude waiting players)
        if (data.status === 'voting') {
          const activePlayers = data.players?.filter(p => !p.waitingForNextRound) || [];
          const allVoted = activePlayers.length > 0 && activePlayers.every(p => p.hasVoted);
          if (allVoted && data.hostId === user.uid) {
            await finishGame(); // Usa transacción para leer datos frescos
          }
        }

        if (data.status === 'revealing' && gameState === 'LOBBY') {
          setGameState('REVEAL');
          initLocalTurns('reveal', data);
        }
        if (data.status === 'voting' && gameState !== 'VOTING') {
          setGameState('VOTING');
          initLocalTurns('vote', data);
        }
        if (data.status === 'evaluating' && gameState !== 'EVALUATING') {
          setGameState('EVALUATING');
          // Iniciar sistema de turnos para evaluación de estrategia - mostrar explicación primero
          setLocalTurnPhase('evalExplanation');
          setMyStrategyVote(null);
        }
        if (data.status === 'finished' && gameState !== 'RESULTS') {
          setGameState('RESULTS');
          setLocalTurnPhase('none');
        }
        if (data.status === 'lobby' && gameState !== 'LOBBY') {
          setGameState('LOBBY');
          resetLocalTurns();
        }
      } else {
        setError("Sala no encontrada.");
        setGameState('MENU');
        setRoomData(null);
        setRoomCode('');
        localStorage.removeItem('impostor_room');
      }
    });

    return () => unsubscribe();
  }, [user, roomCode, gameState]);

  // Fallback sync - check periodically if player count differs from server
  useEffect(() => {
    if (!user || !roomCode || gameState === 'MENU' || gameState === 'AUTH') return;

    const checkSync = async () => {
      try {
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode);
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          const serverData = snap.data();
          const serverPlayerCount = serverData.players?.length || 0;
          const localPlayerCount = roomData?.players?.length || 0;

          // If counts differ, force update
          if (serverPlayerCount !== localPlayerCount) {
            console.log('Sync: Player count mismatch, updating...', { server: serverPlayerCount, local: localPlayerCount });
            setRoomData(serverData);
          }
        }
      } catch (e) {
        console.error('Sync check failed:', e);
      }
    };

    // Check every 3 seconds
    const interval = setInterval(checkSync, 3000);

    return () => clearInterval(interval);
  }, [user, roomCode, gameState, roomData?.players?.length]);

  const initLocalTurns = (type, data) => {
    // Use passed data to get players on this device
    const myPlayers = getMyPlayersFromRoom(data);

    console.log('initLocalTurns:', { type, deviceId: user?.uid, myPlayersCount: myPlayers.length, myPlayers: myPlayers.map(p => ({ name: p.name, hasSeenRole: p.hasSeenRole, hasVoted: p.hasVoted })) });

    // Limpiar selecciones de votación múltiple
    setSelectedVotes([]);

    if (myPlayers.length > 1) {
      let firstNotDoneIndex = -1;

      if (type === 'reveal') {
        // Para REVEAL: buscar el primer jugador que NO ha visto su rol
        firstNotDoneIndex = myPlayers.findIndex(p => !p.hasSeenRole && !p.waitingForNextRound);
      } else if (type === 'vote') {
        // Para VOTE: buscar el primer jugador que NO ha votado
        firstNotDoneIndex = myPlayers.findIndex(p => !p.hasVoted && !p.waitingForNextRound);
      }

      if (firstNotDoneIndex === -1) {
        // Todos han completado (visto rol o votado)
        setLocalTurnPhase('none');
      } else {
        setLocalTurnIndex(firstNotDoneIndex);
        setLocalTurnPhase('pass');
      }
      setLocalVotesDone({});
    } else {
      setLocalTurnPhase('none');
      setHasVoted(false);
      setMyVote(null);
    }
  };

  const resetLocalTurns = () => {
    setLocalTurnIndex(0);
    setLocalTurnPhase('none');
    setLocalVotesDone({});
    setHasVoted(false);
    setMyVote(null);
    setVotedForMap({});
    setSelectedVotes([]);
    setShowRole(false);
    setLocalTurnsInitialized(false);
  };

  // Inicializar turnos locales cuando se reconecta después de refresh
  useEffect(() => {
    if (!user || !roomData || localTurnsInitialized) return;

    // Si estamos en REVEAL o VOTING y no se han inicializado los turnos
    if (gameState === 'REVEAL' && roomData.status === 'revealing') {
      initLocalTurns('reveal', roomData);
      setLocalTurnsInitialized(true);
    } else if (gameState === 'VOTING' && roomData.status === 'voting') {
      initLocalTurns('vote', roomData);
      setLocalTurnsInitialized(true);
    } else if (gameState === 'LOBBY') {
      // Reset when back in lobby
      setLocalTurnsInitialized(false);
    }
  }, [user, roomData, gameState, localTurnsInitialized]);

  // Auth handlers
  const handleGoogleLogin = async () => {
    setLoading(true); setError('');
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { setError('Error con Google'); }
    finally { setLoading(false); }
  };

  const handleEmailRegister = async () => {
    if (!email || !password) return setError('Completa los campos');
    if (password.length < 6) return setError('Mínimo 6 caracteres');
    setLoading(true); setError('');
    try { await createUserWithEmailAndPassword(auth, email, password); }
    catch (e) { setError(e.code === 'auth/email-already-in-use' ? 'Correo ya registrado' : 'Error'); }
    finally { setLoading(false); }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return setError('Completa los campos');
    setLoading(true); setError('');
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (e) { setError('Credenciales incorrectas'); }
    finally { setLoading(false); }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true); setError('');
    try { await signInAnonymously(auth); }
    catch (e) { setError('Error'); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); setPlayerName(''); setPlayerStats({}); setGameState('AUTH'); setMyLocalPlayers([]); }
    catch (e) { }
  };

  // Local players management
  const addLocalPlayer = () => {
    if (!newLocalPlayerName.trim()) return;
    const name = newLocalPlayerName.trim();
    if (myLocalPlayers.some(p => p.name.toLowerCase() === name.toLowerCase()) || name.toLowerCase() === playerName.toLowerCase()) {
      setError('Nombre ya existe');
      return;
    }
    // Asignar avatar aleatorio que no esté en uso
    const usedAvatars = [playerStats.avatar, ...myLocalPlayers.map(p => p.avatar)].filter(Boolean);
    const availableAvatars = PRESET_AVATARS.filter(a => !usedAvatars.includes(a));
    const randomAvatar = availableAvatars.length > 0
      ? availableAvatars[Math.floor(Math.random() * availableAvatars.length)]
      : PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];

    setMyLocalPlayers([...myLocalPlayers, { id: `${user.uid}_local_${Date.now()}`, name, age: newLocalPlayerAge, avatar: randomAvatar }]);
    setNewLocalPlayerName('');
    setNewLocalPlayerAge(18);
    setError('');
  };

  const removeLocalPlayer = (id) => {
    setMyLocalPlayers(myLocalPlayers.filter(p => p.id !== id));
  };

  // Add local player directly to room (can be in lobby or during game)
  const addLocalPlayerToRoom = async () => {
    if (!newLocalPlayerName.trim()) return;
    if (!roomData || !roomCode) return;

    const name = newLocalPlayerName.trim();

    // Check if name already exists in room
    if (roomData.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Nombre ya existe en la sala');
      return;
    }

    const isGameInProgress = roomData.status !== 'lobby';

    // Assign random avatar not in use
    const usedAvatars = roomData.players.map(p => p.avatar).filter(Boolean);
    const availableAvatars = PRESET_AVATARS.filter(a => !usedAvatars.includes(a));
    const randomAvatar = availableAvatars.length > 0
      ? availableAvatars[Math.floor(Math.random() * availableAvatars.length)]
      : PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];

    const newPlayerId = `${user.uid}_local_${Date.now()}`;
    const newPlayer = {
      id: newPlayerId,
      name,
      age: parseInt(newLocalPlayerAge) || 18,
      isHost: false,
      votes: 0,
      hasVoted: isGameInProgress ? true : false,
      votedFor: null,
      avatar: randomAvatar,
      points: 0,
      order: roomData.players.length,
      deviceId: user.uid,
      waitingForNextRound: isGameInProgress
    };

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        players: [...roomData.players, newPlayer]
      });
      // Also add to local players state for tracking
      setMyLocalPlayers(prev => [...prev, { id: newPlayerId, name, age: parseInt(newLocalPlayerAge) || 18, avatar: randomAvatar }]);
      setNewLocalPlayerName('');
      setNewLocalPlayerAge(18);
      setError('');
    } catch (e) {
      setError('Error al agregar jugador');
    }
  };

  // Remove local player from room (when in lobby)
  const removeLocalPlayerFromRoom = async (playerId) => {
    if (!roomData || !roomCode) return;

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        players: roomData.players.filter(p => p.id !== playerId)
      });
      // Also remove from local state
      setMyLocalPlayers(prev => prev.filter(p => p.id !== playerId));
    } catch (e) {
      setError('Error al eliminar jugador');
    }
  };

  // Update player name in room
  const updatePlayerNameInRoom = async (playerId, newName) => {
    if (!roomData || !roomCode || !newName.trim()) {
      setNameError('');
      return;
    }

    const name = newName.trim();

    // Check if name already exists (excluding current player)
    if (roomData.players.some(p => p.id !== playerId && p.name.toLowerCase() === name.toLowerCase())) {
      setNameError('Nombre repetido');
      return;
    }

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        players: roomData.players.map(p => p.id === playerId ? { ...p, name } : p)
      });
      // Update local state if it's a local player
      setMyLocalPlayers(prev => prev.map(p => p.id === playerId ? { ...p, name } : p));
      // Update main player name if it's the main player
      if (playerId === user?.uid) {
        setPlayerName(name);
        savePlayerProfile();
      }
      setEditingPlayerId(null);
      setEditingPlayerName('');
      setNameError('');
    } catch (e) {
      setNameError('Error al guardar');
    }
  };

  // Start editing a player name
  const startEditingPlayerName = (player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerName(player.name);
    setNameError('');
  };

  // Cancel editing
  const cancelEditingPlayerName = () => {
    setEditingPlayerId(null);
    setEditingPlayerName('');
    setNameError('');
  };

  // Room functions
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const createRoom = async () => {
    if (!playerName.trim()) return setError("¡Pon tu nombre!");
    setLoading(true);
    await savePlayerProfile();

    const code = generateRoomCode();
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);

    // Add main player + local players (only if multiplayer mode is active)
    // points inician en 0 para cada sala (copas de sesión)
    // historicalPoints se cargan desde playerStats (acumulado de todas las partidas)
    // isRegistered: true si el usuario padre tiene cuenta (no anónimo) - determina si puede tener historial
    const isUserRegistered = !user.isAnonymous;
    const allPlayers = [
      { id: user.uid, name: playerName, age: parseInt(playerAge) || 18, isHost: true, votes: 0, hasVoted: false, votedFor: null, avatar: playerStats.avatar || null, points: 0, historicalPoints: isUserRegistered ? (playerStats.historicalPoints || 0) : 0, order: 0, deviceId: user.uid, isRegistered: isUserRegistered }
    ];
    if (isMultiplayerLocal) {
      myLocalPlayers.forEach((lp, idx) => {
        // Los jugadores locales heredan el estado de registro del usuario padre
        // Su historial se guarda independientemente bajo su propio ID
        allPlayers.push({ id: lp.id, name: lp.name, age: parseInt(lp.age) || 18, isHost: false, votes: 0, hasVoted: false, votedFor: null, avatar: lp.avatar || null, points: 0, historicalPoints: isUserRegistered ? (lp.historicalPoints || 0) : 0, order: idx + 1, deviceId: user.uid, isRegistered: isUserRegistered });
      });
    }

    try {
      await setDoc(roomRef, {
        code, hostId: user.uid, status: 'lobby', players: allPlayers,
        createdAt: serverTimestamp(), secretWord: '', category: '',
        impostorIds: [], impostorCount: 1, showCategoryHint: false, startingPlayerId: null,
        enableInnocentEvaluation: true, // Toggle para votación de inocente
        totalRounds: 2, // Número de rondas configurables
        currentRound: 0 // Ronda actual (0 = no iniciado)
      });
      setRoomCode(code);
      localStorage.setItem('impostor_room', code);
      setGameState('LOBBY');
    } catch (e) { setError("Error al crear."); }
    finally { setLoading(false); }
  };

  // Generar nombre único evitando duplicados
  const getUniqueName = (baseName, existingNames) => {
    const lowerNames = existingNames.map(n => n.toLowerCase());
    if (!lowerNames.includes(baseName.toLowerCase())) {
      return baseName;
    }
    // Buscar el siguiente número disponible
    let num = 2;
    while (lowerNames.includes(`${baseName.toLowerCase()} ${num}`)) {
      num++;
    }
    return `${baseName} ${num}`;
  };

  // Arreglar nombres duplicados en lista de jugadores
  const fixDuplicateNames = (players) => {
    const usedNames = [];
    let hasChanges = false;

    const fixedPlayers = players.map(player => {
      const uniqueName = getUniqueName(player.name, usedNames);
      usedNames.push(uniqueName);

      if (uniqueName !== player.name) {
        hasChanges = true;
        return { ...player, name: uniqueName };
      }
      return player;
    });

    return { players: fixedPlayers, hasChanges };
  };

  const joinRoom = async () => {
    if (!playerName.trim()) return setError("¡Pon tu nombre!");
    if (!joinCode.trim()) return setError("Código inválido");

    setLoading(true);
    await savePlayerProfile();
    const code = joinCode.toUpperCase();
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);

    try {
      const snap = await getDoc(roomRef);
      if (!snap.exists()) { setLoading(false); return setError("Sala no encontrada"); }

      const data = snap.data();
      const isGameInProgress = data.status !== 'lobby';

      const existingIds = data.players.map(p => p.id);
      const alreadyIn = existingIds.includes(user.uid);

      // Lista de nombres existentes (para evitar duplicados)
      const existingNames = data.players.map(p => p.name);

      // Prepare list of new players to add
      // points inician en 0 para cada sala (copas de sesión)
      // Si el juego está en progreso, marcar como waitingForNextRound
      // isRegistered determina si pueden tener historial de copas
      const isUserRegistered = !user.isAnonymous;
      const newPlayers = [];

      // Add main player if not in room
      if (!alreadyIn) {
        const uniqueName = getUniqueName(playerName, existingNames);
        existingNames.push(uniqueName); // Agregar a la lista para evitar duplicados con jugadores locales
        newPlayers.push({
          id: user.uid,
          name: uniqueName,
          age: parseInt(playerAge) || 18,
          isHost: false,
          votes: 0,
          hasVoted: isGameInProgress ? true : false, // Si se une en medio, marcar como que ya votó para no bloquear
          votedFor: null,
          avatar: playerStats.avatar || null,
          points: 0,
          historicalPoints: isUserRegistered ? (playerStats.historicalPoints || 0) : 0,
          order: data.players.length,
          deviceId: user.uid,
          waitingForNextRound: isGameInProgress,
          isRegistered: isUserRegistered
        });
      }

      // Add local players that aren't in room yet (only if multiplayer mode is active)
      if (isMultiplayerLocal) {
        myLocalPlayers.forEach((lp, idx) => {
          if (!existingIds.includes(lp.id)) {
            const uniqueName = getUniqueName(lp.name, existingNames);
            existingNames.push(uniqueName); // Agregar para evitar duplicados con siguientes jugadores
            newPlayers.push({
              id: lp.id,
              name: uniqueName,
              age: parseInt(lp.age) || 18,
              isHost: false,
              votes: 0,
              hasVoted: isGameInProgress ? true : false,
              votedFor: null,
              avatar: lp.avatar || null,
              points: 0,
              historicalPoints: isUserRegistered ? (lp.historicalPoints || 0) : 0,
              order: data.players.length + newPlayers.length,
              deviceId: user.uid,
              waitingForNextRound: isGameInProgress,
              isRegistered: isUserRegistered
            });
          }
        });
      }

      if (newPlayers.length > 0) {
        await updateDoc(roomRef, { players: [...data.players, ...newPlayers] });
      }

      setRoomCode(code);
      localStorage.setItem('impostor_room', code);

      // Establecer el estado del juego según el status de la sala
      if (data.status === 'lobby') setGameState('LOBBY');
      else if (data.status === 'revealing') setGameState('REVEAL');
      else if (data.status === 'voting') setGameState('VOTING');
      else if (data.status === 'evaluating') setGameState('EVALUATING');
      else if (data.status === 'finished') setGameState('RESULTS');
      else setGameState('LOBBY');
    } catch (e) { setError("Error al unirse."); }
    finally { setLoading(false); }
  };

  const updateImpostorCount = async (count) => {
    if (!roomData) return;
    const max = Math.floor(roomData.players.length / 2);
    const newCount = Math.max(1, Math.min(count, max || 1));
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { impostorCount: newCount }); }
    catch (e) { }
  };

  const toggleCategoryHint = async () => {
    if (!roomData) return;
    const currentValue = roomData.showCategoryHint === true; // default false
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { showCategoryHint: !currentValue }); }
    catch (e) { }
  };

  const toggleInnocentEvaluation = async () => {
    if (!roomData) return;
    const currentValue = roomData.enableInnocentEvaluation !== false; // default true
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { enableInnocentEvaluation: !currentValue }); }
    catch (e) { }
  };

  const kickPlayer = async (playerId) => {
    if (!roomData || roomData.hostId !== user.uid) return;
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { players: roomData.players.filter(p => p.id !== playerId) }); }
    catch (e) { }
  };

  // Drag and drop
  const handleDragStart = (e, index) => {
    draggedPlayerRef.current = index; // Ref inmediato
    setDraggedPlayer(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    // Usar ref en lugar de state para obtener valor inmediato
    if (draggedPlayerRef.current !== null && draggedPlayerRef.current !== index) {
      setDropTarget(index);
    }
  };
  const handleDragLeave = () => {
    // No limpiar inmediatamente para evitar parpadeo
  };
  const handleDragEnd = () => {
    draggedPlayerRef.current = null;
    setDraggedPlayer(null);
    setDropTarget(null);
  };
  const handleDrop = async (e, index) => {
    e.preventDefault();
    setDropTarget(null);
    const dragIdx = draggedPlayerRef.current;
    if (dragIdx === null || dragIdx === index || roomData.hostId !== user.uid) {
      draggedPlayerRef.current = null;
      setDraggedPlayer(null);
      return;
    }
    const newPlayers = [...roomData.players];
    const [moved] = newPlayers.splice(dragIdx, 1);
    newPlayers.splice(index, 0, moved);
    const ordered = newPlayers.map((p, i) => ({ ...p, order: i }));
    draggedPlayerRef.current = null;
    setDraggedPlayer(null);
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { players: ordered }); }
    catch (e) { }
  };

  const startGame = async () => {
    if (!roomData) return;
    setLoading(true);

    // Primero arreglar nombres duplicados antes de iniciar
    const { players: fixedPlayers, hasChanges } = fixDuplicateNames(roomData.players);
    let playersToUse = hasChanges ? fixedPlayers : roomData.players;

    // Filtrar solo jugadores activos (no en espera)
    const activePlayers = playersToUse.filter(p => !p.waitingForNextRound);
    if (activePlayers.length < 2) {
      setError('Se necesitan al menos 2 jugadores activos');
      setLoading(false);
      return;
    }

    const ages = activePlayers.map(p => p.age);
    const minAge = Math.min(...ages);
    let difficulty = 'HARD';
    if (minAge <= 10) difficulty = 'EASY';
    else if (minAge <= 16) difficulty = 'MEDIUM';

    const categories = WORD_CATEGORIES[difficulty];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const secretWord = randomCat.words[Math.floor(Math.random() * randomCat.words.length)];

    const randomStartIndex = Math.floor(Math.random() * activePlayers.length);
    const numImpostors = Math.min(roomData.impostorCount || 1, Math.floor(activePlayers.length / 2));

    // Evitar que los impostores anteriores se repitan (si es posible)
    const previousImpostors = roomData.impostorIds || [];
    const eligiblePlayers = activePlayers.filter(p => !previousImpostors.includes(p.id));

    let newImpostorIds = [];
    if (eligiblePlayers.length >= numImpostors) {
      // Hay suficientes jugadores que no fueron impostores antes
      const shuffledEligible = [...eligiblePlayers].sort(() => Math.random() - 0.5);
      newImpostorIds = shuffledEligible.slice(0, numImpostors).map(p => p.id);
    } else {
      // No hay suficientes, usar todos los elegibles + algunos anteriores
      const shuffledAll = [...activePlayers].sort(() => Math.random() - 0.5);
      newImpostorIds = shuffledAll.slice(0, numImpostors).map(p => p.id);
    }

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        status: 'revealing', secretWord, category: randomCat.category, impostorIds: newImpostorIds,
        previousImpostorIds: previousImpostors, // Guardar para referencia
        startingPlayerId: activePlayers[randomStartIndex].id,
        rolesLocked: false, // Los roles aún no están bloqueados
        currentRound: 1, // Iniciar en ronda 1
        players: playersToUse.map(p => ({ ...p, votes: 0, hasVoted: p.waitingForNextRound ? true : false, votedFor: null, hasSeenRole: p.waitingForNextRound ? true : false }))
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Avanzar a la siguiente ronda
  const nextRound = async () => {
    if (!roomData) return;
    setLoading(true);

    const activePlayers = roomData.players.filter(p => !p.waitingForNextRound);
    const newRound = (roomData.currentRound || 1) + 1;

    // Generar nueva palabra secreta
    const ages = activePlayers.map(p => p.age);
    const minAge = Math.min(...ages);
    let difficulty = 'HARD';
    if (minAge <= 10) difficulty = 'EASY';
    else if (minAge <= 16) difficulty = 'MEDIUM';

    const categories = WORD_CATEGORIES[difficulty];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const secretWord = randomCat.words[Math.floor(Math.random() * randomCat.words.length)];

    // Mantener el mismo jugador inicial de la ronda 1
    // NO cambiar startingPlayerId

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        status: 'revealing',
        secretWord,
        category: randomCat.category,
        currentRound: newRound,
        // startingPlayerId se mantiene igual (no lo cambiamos)
        rolesLocked: true, // Ya todos saben sus roles
        players: roomData.players.map(p => ({ ...p, hasSeenRole: true })) // Ya todos vieron
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startVoting = async () => {
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { status: 'voting' }); }
    catch (e) { }
  };

  // Actualizar número de rondas
  const updateTotalRounds = async (newCount) => {
    if (newCount < 1 || newCount > 10) return;
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { totalRounds: newCount }); }
    catch (e) { }
  };

  // Marcar que un jugador ya vio su rol
  const markRoleSeen = async (playerIds) => {
    if (!roomCode) return;
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode);

    try {
      await runTransaction(db, async (transaction) => {
        const roomDoc = await transaction.get(roomRef);
        if (!roomDoc.exists()) return;

        const data = roomDoc.data();
        const idsToMark = Array.isArray(playerIds) ? playerIds : [playerIds];

        // Usar datos FRESCOS de Firebase, no el estado local
        const updatedPlayers = data.players.map(p =>
          idsToMark.includes(p.id) ? { ...p, hasSeenRole: true } : p
        );

        // Verificar si TODOS los jugadores activos han visto su rol
        const activePlayers = updatedPlayers.filter(p => !p.waitingForNextRound);
        const allHaveSeen = activePlayers.every(p => p.hasSeenRole === true);

        // Si todos vieron, auto-bloquear roles
        if (allHaveSeen && !data.rolesLocked) {
          transaction.update(roomRef, {
            players: updatedPlayers,
            rolesLocked: true
          });
        } else {
          transaction.update(roomRef, { players: updatedPlayers });
        }
      });
    } catch (e) { console.error('Error en markRoleSeen transaction:', e); }
  };

  // Bloquear roles (nadie puede ver la palabra después de esto)
  const lockRoles = async () => {
    if (!roomData || !roomCode) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { rolesLocked: true });
    } catch (e) { console.error(e); }
  };

  // Reiniciar hasSeenRole para que todos puedan ver su rol de nuevo (solo host)
  const resetRolesVisibility = async () => {
    if (!roomData || !roomCode) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        rolesLocked: false,
        players: roomData.players.map(p => ({ ...p, hasSeenRole: false }))
      });
      setLocalTurnsInitialized(false); // Reiniciar para volver a mostrar turnos
    } catch (e) { console.error(e); }
  };

  // Cambiar la palabra secreta (misma ronda, mismo impostor)
  const changeWord = async () => {
    if (!roomData || !roomCode) return;
    try {
      const activePlayers = roomData.players.filter(p => !p.waitingForNextRound);
      const ages = activePlayers.map(p => p.age);
      const minAge = Math.min(...ages);
      let difficulty = 'HARD';
      if (minAge <= 10) difficulty = 'EASY';
      else if (minAge <= 16) difficulty = 'MEDIUM';

      const categories = WORD_CATEGORIES[difficulty];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const newWord = randomCat.words[Math.floor(Math.random() * randomCat.words.length)];

      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        secretWord: newWord,
        category: randomCat.category,
        rolesLocked: false,
        players: roomData.players.map(p => ({ ...p, hasSeenRole: false }))
      });
      setLocalTurnsInitialized(false);
    } catch (e) { console.error(e); }
  };

  // Forzar inicio de votación sin esperar a que todos vean su rol (solo host)
  const forceStartVoting = async () => {
    if (!roomData || !roomCode) return;
    try {
      // Marcar todos los roles como vistos y bloquear
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        rolesLocked: true,
        status: 'voting',
        players: roomData.players.map(p => ({ ...p, hasSeenRole: true }))
      });
    } catch (e) { console.error(e); }
  };

  // Toggle selection for multiple impostor voting
  const toggleVoteSelection = (targetId, maxVotes = null) => {
    const limit = maxVotes || roomData?.impostorCount || 1;
    setSelectedVotes(prev => {
      if (prev.includes(targetId)) {
        return prev.filter(id => id !== targetId);
      } else if (prev.length < limit) {
        return [...prev, targetId];
      }
      return prev; // Ya tiene el máximo seleccionado
    });
  };

  const submitVote = async (targetIds, voterId = null) => {
    // targetIds puede ser un solo ID o un array de IDs
    const votes = Array.isArray(targetIds) ? targetIds : [targetIds];
    const myPlayers = getMyPlayersFromRoom();

    if (myPlayers.length > 1 && !voterId) {
      // Multi-player mode - save locally first
      const currentPlayer = myPlayers[localTurnIndex];
      setLocalVotesDone(prev => ({ ...prev, [currentPlayer.id]: votes }));

      if (localTurnIndex < myPlayers.length - 1) {
        setLocalTurnIndex(localTurnIndex + 1);
        setLocalTurnPhase('pass');
        setSelectedVotes([]);
        return;
      }

      // All local players voted - submit all votes at once
      const allLocalVotes = { ...localVotesDone, [currentPlayer.id]: votes };
      await submitVotesToFirebase(allLocalVotes);
      setLocalTurnPhase('none');
      setHasVoted(true);
      setSelectedVotes([]);
    } else {
      // Single player vote (or change vote)
      const vid = voterId || user.uid;
      await submitVotesToFirebase({ [vid]: votes });
      setHasVoted(true);
      setMyVote(votes);
      setSelectedVotes([]);
    }
  };

  const submitVotesToFirebase = async (votesToSubmit) => {
    try {
      // Update each voter's votedFor field (now an array)
      const newPlayers = roomData.players.map(p => {
        let newVotedFor = p.votedFor;
        let newHasVoted = p.hasVoted;

        // If this player is voting, update their votedFor
        if (votesToSubmit[p.id] !== undefined) {
          newVotedFor = votesToSubmit[p.id]; // Array de IDs
          newHasVoted = true;
        }

        return { ...p, votedFor: newVotedFor, hasVoted: newHasVoted };
      });

      // Recalculate all vote counts based on votedFor arrays
      const finalPlayers = newPlayers.map(p => {
        let votesReceived = 0;
        newPlayers.forEach(voter => {
          const voterVotes = Array.isArray(voter.votedFor) ? voter.votedFor : (voter.votedFor ? [voter.votedFor] : []);
          if (voterVotes.includes(p.id)) {
            votesReceived++;
          }
        });
        return { ...p, votes: votesReceived };
      });

      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { players: finalPlayers });
    } catch (e) { console.error(e); }
  };

  // Función para que el anfitrión vote en nombre de otro jugador
  const submitProxyVote = async (targetIds) => {
    if (!votingAsPlayer) return;
    const votes = Array.isArray(targetIds) ? targetIds : [targetIds];
    await submitVotesToFirebase({ [votingAsPlayer.id]: votes });
    setVotingAsPlayer(null);
    setSelectedVotes([]);
  };

  const finishGame = async () => {
    if (!roomCode) return;
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode);

    try {
      await runTransaction(db, async (transaction) => {
        // Leer datos FRESCOS de Firebase
        const roomDoc = await transaction.get(roomRef);
        if (!roomDoc.exists()) return;

        const currentData = roomDoc.data();

        // Evitar procesar si ya terminó
        if (currentData.status === 'finished' || currentData.status === 'evaluating') return;

        const impostorIds = currentData.impostorIds || [];
        const players = currentData.players;

        // Recalcular votos recibidos por cada jugador
        const votesReceivedMap = {};
        players.forEach(p => { votesReceivedMap[p.id] = 0; });
        players.forEach(voter => {
          const voterVotes = Array.isArray(voter.votedFor) ? voter.votedFor : (voter.votedFor ? [voter.votedFor] : []);
          voterVotes.forEach(votedId => {
            if (votesReceivedMap[votedId] !== undefined) {
              votesReceivedMap[votedId]++;
            }
          });
        });

        // Encontrar al más votado
        let mostVotedId = null;
        let maxVotes = 0;
        players.forEach(p => {
          if (votesReceivedMap[p.id] > maxVotes) {
            maxVotes = votesReceivedMap[p.id];
            mostVotedId = p.id;
          }
        });

        const mostVotedIsInnocent = mostVotedId && !impostorIds.includes(mostVotedId);
        const mostVotedPlayer = players.find(p => p.id === mostVotedId);

        const updated = players.map(p => {
          let pts = p.points || 0;

          // Los jugadores en espera no reciben puntos
          if (p.waitingForNextRound) {
            return { ...p, points: pts };
          }

          const playerVotes = Array.isArray(p.votedFor) ? p.votedFor : (p.votedFor ? [p.votedFor] : []);
          const isImpostor = impostorIds.includes(p.id);
          const votesReceived = votesReceivedMap[p.id] || 0;

          if (isImpostor) {
            // IMPOSTOR:
            // +1 punto base (no puede votarse a sí mismo)
            pts += 1;

            // +2 puntos si NADIE votó por él
            if (votesReceived === 0) {
              pts += 2;
            }

            // Si hay múltiples impostores: +2 por cada OTRO impostor adivinado
            if (impostorIds.length > 1) {
              const otherImpostors = impostorIds.filter(id => id !== p.id);
              const correctVotes = playerVotes.filter(voteId => otherImpostors.includes(voteId)).length;
              pts += correctVotes * 2;
            }
          } else {
            // TRIPULANTE:
            // +2 puntos por cada impostor adivinado, 0 si no adivinó
            const correctVotes = playerVotes.filter(voteId => impostorIds.includes(voteId)).length;
            pts += correctVotes * 2;

            // El punto por engañar se decide en la evaluación de estrategia, no aquí
          }

          return { ...p, points: pts };
        });

        // Si el más votado es inocente Y la evaluación está habilitada, iniciar evaluación de estrategia
        if (mostVotedIsInnocent && mostVotedPlayer && currentData.enableInnocentEvaluation !== false) {
          transaction.update(roomRef, {
            status: 'evaluating',
            players: updated,
            strategyEvaluation: {
              playerId: mostVotedId,
              playerName: mostVotedPlayer.name,
              playerAvatar: mostVotedPlayer.avatar,
              votes: { coherent: 0, incoherent: 0 },
              votedBy: [],
              finished: false
            }
          });
        } else {
          transaction.update(roomRef, {
            status: 'finished',
            players: updated,
            strategyEvaluation: null
          });
        }
      });
      // Los puntos se guardan al histórico cuando el jugador sale de la sala (leaveRoom)
    } catch (e) { console.error('Error en finishGame transaction:', e); }
  };

  const endVoting = async () => { await finishGame(); };

  // Función para votar en la evaluación de estrategia (vota UN jugador específico)
  const submitStrategyVote = async (vote, playerId) => {
    if (!roomData || !roomCode || !roomData.strategyEvaluation) return;

    const currentEval = roomData.strategyEvaluation;

    // Verificar que este jugador no haya votado ya
    if (currentEval.votedBy?.includes(playerId)) return;

    try {
      const newVotes = {
        coherent: currentEval.votes?.coherent || 0,
        incoherent: currentEval.votes?.incoherent || 0
      };

      // Un voto por jugador
      if (vote === 'coherent') {
        newVotes.coherent += 1;
      } else {
        newVotes.incoherent += 1;
      }

      const newVotedBy = [...(currentEval.votedBy || []), playerId];

      // Calcular cuántos pueden votar (excluyendo al evaluado y los que esperan)
      const eligibleVoters = roomData.players.filter(p =>
        p.id !== currentEval.playerId && !p.waitingForNextRound
      );
      const allVoted = newVotedBy.length >= eligibleVoters.length;

      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        strategyEvaluation: {
          ...currentEval,
          votes: newVotes,
          votedBy: newVotedBy
        }
      });

      // Auto-finalizar si todos votaron
      if (allVoted) {
        // Pequeño delay para que se actualice el estado antes de finalizar
        setTimeout(() => {
          finishStrategyEvaluationAuto(currentEval, newVotes);
        }, 500);
      }
    } catch (e) { console.error(e); }
  };

  // Versión automática de finalizar evaluación (cuando todos votan)
  const finishStrategyEvaluationAuto = async (eval_, votes) => {
    if (!roomData || !roomCode) return;

    try {
      const coherentVotes = votes?.coherent || 0;
      const incoherentVotes = votes?.incoherent || 0;

      let bonusPoints = 0;
      if (coherentVotes > incoherentVotes) {
        bonusPoints = 1;
      }

      const evaluatedPlayer = roomData.players.find(p => p.id === eval_.playerId);
      const updatedPlayers = roomData.players.map(p => {
        if (p.id === eval_.playerId) {
          return {
            ...p,
            points: (p.points || 0) + bonusPoints,
            // Solo acumular histórico si es usuario registrado
            historicalPoints: p.isRegistered ? ((p.historicalPoints || 0) + bonusPoints) : (p.historicalPoints || 0),
            strategyBonus: bonusPoints
          };
        }
        return p;
      });

      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        players: updatedPlayers,
        strategyEvaluation: { ...eval_, votes, result: bonusPoints, finished: true }
      });

      // Guardar puntos históricos solo si es usuario registrado
      if (bonusPoints > 0 && evaluatedPlayer && evaluatedPlayer.isRegistered) {
        try {
          const statsRef = doc(db, 'artifacts', appId, 'public', 'data', 'stats', evaluatedPlayer.id);
          const statsSnap = await getDoc(statsRef);
          const currentStats = statsSnap.exists() ? statsSnap.data() : {};
          await setDoc(statsRef, {
            ...currentStats,
            historicalPoints: (currentStats.historicalPoints || 0) + bonusPoints
          }, { merge: true });
        } catch (e) { console.error('Error saving historical points:', e); }
      }

      setMyStrategyVote(null);

      setTimeout(async () => {
        try {
          const resetPlayers = updatedPlayers.map(p => ({
            ...p,
            votes: 0,
            hasVoted: false,
            votedFor: null,
            hasSeenRole: false,
            waitingForNextRound: false,
            strategyBonus: null
          }));
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
            status: 'lobby',
            secretWord: '',
            impostorIds: [],
            startingPlayerId: null,
            rolesLocked: false,
            currentRound: 0,
            strategyEvaluation: null,
            players: resetPlayers
          });
        } catch (e) { console.error(e); }
      }, 5000);
    } catch (e) { console.error(e); }
  };

  // Función para finalizar la evaluación de estrategia (solo host)
  const finishStrategyEvaluation = async () => {
    if (!roomData || !roomCode || !roomData.strategyEvaluation) return;

    try {
      const eval_ = roomData.strategyEvaluation;
      const coherentVotes = eval_.votes?.coherent || 0;
      const incoherentVotes = eval_.votes?.incoherent || 0;

      let bonusPoints = 0;
      if (coherentVotes > incoherentVotes) {
        bonusPoints = 1; // Jugó bien, GANA el punto
      }
      // Si incoherente gana o empate, NO gana el punto (0)

      // Actualizar puntos del jugador evaluado (sesión + históricos si es registrado)
      const evaluatedPlayer = roomData.players.find(p => p.id === eval_.playerId);
      const updatedPlayers = roomData.players.map(p => {
        if (p.id === eval_.playerId) {
          return {
            ...p,
            points: (p.points || 0) + bonusPoints,
            // Solo acumular histórico si es usuario registrado
            historicalPoints: p.isRegistered ? ((p.historicalPoints || 0) + bonusPoints) : (p.historicalPoints || 0),
            strategyBonus: bonusPoints
          };
        }
        return p;
      });

      // Mantener en evaluating para mostrar la celebración
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        players: updatedPlayers,
        strategyEvaluation: { ...eval_, result: bonusPoints, finished: true }
      });

      // Guardar puntos históricos en el perfil del jugador (si ganó puntos Y es usuario registrado)
      // Solo los jugadores con isRegistered=true pueden acumular historial
      if (bonusPoints > 0 && evaluatedPlayer && evaluatedPlayer.isRegistered) {
        try {
          const statsRef = doc(db, 'artifacts', appId, 'public', 'data', 'stats', evaluatedPlayer.id);
          const statsSnap = await getDoc(statsRef);
          const currentStats = statsSnap.exists() ? statsSnap.data() : {};
          await setDoc(statsRef, {
            ...currentStats,
            historicalPoints: (currentStats.historicalPoints || 0) + bonusPoints
          }, { merge: true });
        } catch (e) { console.error('Error saving historical points:', e); }
      }

      setMyStrategyVote(null);

      // Después de 5 segundos, ir al lobby automáticamente
      setTimeout(async () => {
        try {
          // Resetear para nueva partida
          const resetPlayers = updatedPlayers.map(p => ({
            ...p,
            votes: 0,
            hasVoted: false,
            votedFor: null,
            hasSeenRole: false,
            waitingForNextRound: false,
            strategyBonus: null
          }));
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
            status: 'lobby',
            secretWord: '',
            impostorIds: [],
            startingPlayerId: null,
            rolesLocked: false,
            currentRound: 0,
            strategyEvaluation: null,
            players: resetPlayers
          });
        } catch (e) { console.error(e); }
      }, 5000);
    } catch (e) { console.error(e); }
  };

  // Saltar evaluación de estrategia (solo host)
  const skipStrategyEvaluation = async () => {
    if (!roomData || !roomCode) return;

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        status: 'finished',
        strategyEvaluation: null
      });
      setMyStrategyVote(null);
    } catch (e) { console.error(e); }
  };

  const backToLobby = async () => {
    try {
      // Resetear estados de jugadores
      const resetPlayers = roomData.players.map(p => ({
        ...p,
        votes: 0,
        hasVoted: false,
        votedFor: null,
        hasSeenRole: false,
        waitingForNextRound: false, // Limpiar flag para la nueva ronda
        strategyBonus: null // Limpiar bonus de estrategia
      }));

      // Verificar y arreglar nombres duplicados
      const { players: fixedPlayers } = fixDuplicateNames(resetPlayers);

      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        status: 'lobby', secretWord: '', impostorIds: [], startingPlayerId: null, rolesLocked: false,
        strategyEvaluation: null, // Limpiar evaluación de estrategia
        players: fixedPlayers
      });
      setMyStrategyVote(null);
    } catch (e) { }
  };

  // Avatar
  const resizeImage = (file, maxSize = 150) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) { if (w > maxSize) { h = Math.round((h * maxSize) / w); w = maxSize; } }
          else { if (h > maxSize) { w = Math.round((w * maxSize) / h); h = maxSize; } }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) { setShowAvatarModal(false); return; }
    if (!file.type.startsWith('image/')) { setError('Selecciona imagen'); setShowAvatarModal(false); return; }
    setUploadingAvatar(true); setError('');
    try {
      const b64 = await resizeImage(file, 150);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'stats', user.uid), { ...playerStats, avatar: b64 }, { merge: true });
      setPlayerStats(prev => ({ ...prev, avatar: b64 }));
      if (roomData && roomCode) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
          players: roomData.players.map(p => p.id === user.uid ? { ...p, avatar: b64 } : p)
        });
      }
      setShowAvatarModal(false);
    } catch (err) { setError('Error'); setShowAvatarModal(false); }
    finally { setUploadingAvatar(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const selectPresetAvatar = async (emoji) => {
    if (!user) return;
    try {
      // Si estamos editando un jugador local
      if (editingLocalPlayerAvatar) {
        setMyLocalPlayers(prev => prev.map(p => p.id === editingLocalPlayerAvatar ? { ...p, avatar: emoji } : p));
        setEditingLocalPlayerAvatar(null);
        setShowAvatarModal(false);
        return;
      }
      // Jugador principal
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'stats', user.uid), { ...playerStats, avatar: emoji }, { merge: true });
      setPlayerStats(prev => ({ ...prev, avatar: emoji }));
      if (roomData && roomCode) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
          players: roomData.players.map(p => p.id === user.uid ? { ...p, avatar: emoji } : p)
        });
      }
      setShowAvatarModal(false);
    } catch (err) { setError('Error al guardar avatar'); }
  };

  const shareLink = async () => {
    const text = `¡Únete a Impostor! Código: ${roomCode}\n${location.href.split('?')[0]}?code=${roomCode}`;
    if (navigator.share) { try { await navigator.share({ title: 'Impostor', text }); return; } catch (e) { } }
    try { await navigator.clipboard.writeText(text); setShareStatus('copied'); setTimeout(() => setShareStatus('idle'), 2000); }
    catch (e) { alert(text); }
  };

  const shareWhatsApp = () => {
    const link = `${location.href.split('?')[0]}?code=${roomCode}`;
    const text = `🎭 *¡Únete a IMPOSTOR!*

👉 ${link}

📋 Código: *${roomCode}*`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(roomCode); setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000); }
    catch (e) { alert(roomCode); }
  };

  const handleKickedClose = () => { setKickedNotification(false); setGameState('MENU'); setRoomData(null); setRoomCode(''); localStorage.removeItem('impostor_room'); };

  // Refresh - fuerza lectura del servidor y arregla nombres duplicados
  const handleRefresh = async () => {
    if (!roomCode || !user) return;
    try {
      const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode);
      const snap = await getDoc(roomRef);
      if (snap.exists()) {
        const data = snap.data();
        const isUserRegistered = !user.isAnonymous;

        // 1. Remover TODOS los jugadores de este dispositivo (para limpiar perfiles anteriores)
        let updatedPlayers = data.players.filter(p => p.deviceId !== user.uid);

        // 2. Obtener lista de nombres existentes (de otros dispositivos)
        const existingNames = updatedPlayers.map(p => p.name);

        // 3. Agregar jugador principal con nombre único
        const uniqueMainName = getUniqueName(playerName, existingNames);
        existingNames.push(uniqueMainName);
        updatedPlayers.push({
          id: user.uid,
          name: uniqueMainName,
          age: parseInt(playerAge) || 18,
          isHost: data.hostId === user.uid,
          votes: 0,
          hasVoted: data.status !== 'lobby',
          votedFor: null,
          avatar: playerStats.avatar || null,
          points: 0,
          historicalPoints: isUserRegistered ? (playerStats.historicalPoints || 0) : 0,
          order: updatedPlayers.length,
          deviceId: user.uid,
          waitingForNextRound: data.status !== 'lobby',
          isRegistered: isUserRegistered
        });

        // 4. Agregar jugadores locales si están activos
        if (isMultiplayerLocal) {
          myLocalPlayers.forEach(lp => {
            const uniqueName = getUniqueName(lp.name, existingNames);
            existingNames.push(uniqueName);
            updatedPlayers.push({
              id: lp.id,
              name: uniqueName,
              age: parseInt(lp.age) || 18,
              isHost: false,
              votes: 0,
              hasVoted: data.status !== 'lobby',
              votedFor: null,
              avatar: lp.avatar || null,
              points: 0,
              historicalPoints: isUserRegistered ? (lp.historicalPoints || 0) : 0,
              order: updatedPlayers.length,
              deviceId: user.uid,
              waitingForNextRound: data.status !== 'lobby',
              isRegistered: isUserRegistered
            });
          });
        }

        // 5. Verificar y arreglar nombres duplicados entre TODOS los jugadores
        const { players: fixedPlayers } = fixDuplicateNames(updatedPlayers);

        // 6. Guardar cambios en Firebase
        await updateDoc(roomRef, { players: fixedPlayers });
        setRoomData({ ...data, players: fixedPlayers });
      }
    } catch (e) {
      console.error('Refresh failed:', e);
    }
  };

  // Salir de la sala manualmente
  // Guardar copas de sesión al histórico (solo usuarios registrados, no anónimos)
  const saveHistoricalTrophies = async () => {
    if (!user || user.isAnonymous || !roomData) return;

    try {
      // Obtener puntos del jugador principal en la sala actual
      const myPlayer = roomData.players.find(p => p.id === user.uid);
      const sessionPoints = myPlayer?.points || 0;

      if (sessionPoints > 0) {
        // Obtener stats actuales para sumar al histórico
        const statsSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'stats', user.uid));
        const currentStats = statsSnap.exists() ? statsSnap.data() : {};
        const currentHistorical = currentStats.historicalPoints || 0;

        // Sumar puntos de sesión al histórico
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'stats', user.uid), {
          ...currentStats,
          historicalPoints: currentHistorical + sessionPoints
        }, { merge: true });

        // Actualizar estado local
        setPlayerStats(prev => ({
          ...prev,
          historicalPoints: (prev.historicalPoints || 0) + sessionPoints
        }));
      }
    } catch (e) { console.error('Error saving historical points:', e); }
  };

  const leaveRoom = async () => {
    if (roomData && user) {
      try {
        // Guardar copas al histórico antes de salir (solo usuarios registrados)
        await saveHistoricalTrophies();

        const myIds = getMyPlayerIds();
        const remainingPlayers = roomData.players.filter(p => !myIds.includes(p.id));

        if (remainingPlayers.length > 0) {
          // Si el host sale, asignar nuevo host
          let updates = { players: remainingPlayers };
          if (roomData.hostId === user.uid) {
            updates.hostId = remainingPlayers[0].id;
            updates.players = remainingPlayers.map((p, i) => i === 0 ? { ...p, isHost: true } : p);
          }
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), updates);
        }
      } catch (e) { console.error(e); }
    }
    setGameState('MENU');
    setRoomData(null);
    setRoomCode('');
    localStorage.removeItem('impostor_room');
  };

  // Helper: Calcular rankings basado en puntos
  const getPlayerRankings = (players) => {
    if (!players || players.length === 0) return {};

    // Obtener puntos únicos ordenados de mayor a menor
    const uniquePoints = [...new Set(players.map(p => p.points || 0))].sort((a, b) => b - a);

    // Crear mapa de rankings
    const rankings = {};
    players.forEach(p => {
      const points = p.points || 0;
      const rank = uniquePoints.indexOf(points) + 1;
      if (rank <= 3 && points > 0) {
        rankings[p.id] = rank;
      }
    });
    return rankings;
  };

  // Components
  const RankMedal = ({ rank }) => {
    if (!rank || rank > 3) return null;
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return <span className="text-sm">{medals[rank]}</span>;
  };

  const ScoreBadge = ({ score, historicalScore, size = 'sm' }) => {
    if ((!score || score <= 0) && (!historicalScore || historicalScore <= 0)) return null;
    const sizes = { sm: 'text-[10px] px-1.5 py-0.5', md: 'text-xs px-2 py-1' };
    return (
      <span className={`inline-flex items-center space-x-1 ${sizes[size]}`}>
        {score > 0 && (
          <span className="inline-flex items-center space-x-0.5 bg-yellow-500/20 text-yellow-500 rounded-full px-1.5 py-0.5 font-bold">
            <Trophy size={10} /><span>{score}</span>
          </span>
        )}
        {historicalScore > 0 && (
          <span className="inline-flex items-center space-x-0.5 bg-blue-500/20 text-blue-400 rounded-full px-1.5 py-0.5 font-bold" title="Puntos históricos">
            <span className="text-[8px]">H</span><Trophy size={8} /><span>{historicalScore}</span>
          </span>
        )}
      </span>
    );
  };

  const Avatar = ({ player, size = 'md', onClick }) => {
    const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-lg', lg: 'w-12 h-12 text-xl' };
    const emojiSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };
    const isEmoji = player.avatar && PRESET_AVATARS.includes(player.avatar);
    const isImage = player.avatar && player.avatar.startsWith('data:');

    return (
      <div onClick={onClick} className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white cursor-pointer overflow-hidden ${player.avatar ? (isEmoji ? 'bg-slate-700' : '') : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
        {isEmoji ? (
          <span className={emojiSizes[size]}>{player.avatar}</span>
        ) : isImage ? (
          <img src={player.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          player.name?.charAt(0).toUpperCase() || '?'
        )}
      </div>
    );
  };

  // Kicked
  if (kickedNotification) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-3xl border-2 border-red-500 max-w-sm w-full text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-red-500 mb-3">¡EXPULSADO!</h2>
          <button onClick={handleKickedClose} className="w-full bg-slate-700 py-4 rounded-xl font-bold">Volver</button>
        </div>
      </div>
    );
  }

  // Auth
  if (gameState === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-black text-red-500 uppercase mb-2">IMPOSTOR</h1>
            <p className="text-slate-400">Inicia sesión</p>
          </div>
          <div className="bg-slate-800 p-8 rounded-3xl space-y-5 border border-slate-700">
            {error && <div className="bg-red-500/20 text-red-200 p-4 rounded-xl text-center text-sm font-bold">{error}</div>}
            {authMode === 'select' && (
              <>
                <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white text-slate-800 font-bold py-4 rounded-xl flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span>Google</span>
                </button>
                <button onClick={() => setAuthMode('email-login')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3">
                  <Mail size={24} /><span>Email</span>
                </button>
                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600"></div></div><div className="relative flex justify-center"><span className="px-4 bg-slate-800 text-slate-400 text-sm">o</span></div></div>
                <button onClick={handleAnonymousLogin} disabled={loading} className="w-full bg-slate-700 py-4 rounded-xl font-bold">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Invitado'}
                </button>
              </>
            )}
            {(authMode === 'email-login' || authMode === 'email-register') && (
              <>
                <button onClick={() => { setAuthMode('select'); setError(''); }} className="text-slate-400 text-sm">← Volver</button>
                <h3 className="text-xl font-bold text-center">{authMode === 'email-login' ? 'Iniciar sesión' : 'Registrarse'}</h3>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 p-4 rounded-xl" placeholder="Correo" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 p-4 rounded-xl" placeholder="Contraseña" />
                <button onClick={authMode === 'email-login' ? handleEmailLogin : handleEmailRegister} disabled={loading} className="w-full bg-blue-600 py-4 rounded-xl font-bold">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : authMode === 'email-login' ? 'Entrar' : 'Registrar'}
                </button>
                <p className="text-center text-slate-400 text-sm">
                  {authMode === 'email-login' ? <>¿Sin cuenta? <button onClick={() => setAuthMode('email-register')} className="text-blue-400">Regístrate</button></> : <>¿Ya tienes? <button onClick={() => setAuthMode('email-login')} className="text-blue-400">Inicia sesión</button></>}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Menu
  if (gameState === 'MENU') {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-black text-red-500 uppercase mb-2">IMPOSTOR</h1>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl space-y-5 border border-slate-700">
            {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl text-center text-sm">{error}</div>}

            {/* Toggle + Logout en la misma línea */}
            <div className="bg-slate-900 p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="flex rounded-xl overflow-hidden flex-1">
                  <button
                    onClick={() => setIsMultiplayerLocal(false)}
                    className={`flex-1 py-2 text-sm font-bold transition-colors ${!isMultiplayerLocal ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    Solo yo
                  </button>
                  <button
                    onClick={() => setIsMultiplayerLocal(true)}
                    className={`flex-1 py-2 text-sm font-bold transition-colors ${isMultiplayerLocal ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    Compartir celular
                  </button>
                </div>
                <button onClick={handleLogout} className="p-2 bg-slate-700 rounded-lg text-slate-400 flex-shrink-0"><LogOut size={18} /></button>
              </div>
            </div>

            {/* Jugadores */}
            <div className="bg-slate-900 p-4 rounded-xl">

              {/* Modo single player - input nombre y edad */}
              {!isMultiplayerLocal && (
                <div className="flex items-center space-x-3">
                  <div onClick={() => setShowAvatarModal(true)} className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-slate-500 flex-shrink-0">
                    {playerStats.avatar ? (
                      PRESET_AVATARS.includes(playerStats.avatar) ? (
                        <span className="text-2xl">{playerStats.avatar}</span>
                      ) : (
                        <img src={playerStats.avatar} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <span className="text-lg font-bold text-slate-400">{playerName?.charAt(0)?.toUpperCase() || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1 flex items-center space-x-2 min-w-0">
                    <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="flex-1 bg-slate-800 p-2 rounded-lg text-sm min-w-0 max-w-[120px]" placeholder="Nombre" />
                    <div className="flex items-center space-x-1 bg-slate-800 rounded-lg px-2 py-2">
                      <input type="number" value={playerAge} onChange={e => setPlayerAge(e.target.value)} onBlur={e => { const val = parseInt(e.target.value); if (isNaN(val) || val < 5) setPlayerAge(5); else if (val > 99) setPlayerAge(99); }} className="w-10 bg-transparent text-sm text-center" min="5" max="99" />
                      <span className="text-xs text-slate-400">años</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modo multiplayer local */}
              {isMultiplayerLocal && (
                <>
                  {/* Jugador principal editable */}
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-slate-500 mb-1">Jugador principal (tú)</p>
                    <div className="flex items-center space-x-3">
                      <div onClick={() => setShowAvatarModal(true)} className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-slate-500 flex-shrink-0">
                        {playerStats.avatar ? (
                          PRESET_AVATARS.includes(playerStats.avatar) ? (
                            <span className="text-2xl">{playerStats.avatar}</span>
                          ) : (
                            <img src={playerStats.avatar} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <span className="text-lg font-bold text-slate-400">{playerName?.charAt(0)?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center space-x-2 min-w-0">
                        <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} className="flex-1 bg-slate-800 p-2 rounded-lg text-sm min-w-0 max-w-[120px]" placeholder="Nombre" />
                        <div className="flex items-center space-x-1 bg-slate-800 rounded-lg px-2 py-2">
                          <input type="number" value={playerAge} onChange={e => setPlayerAge(e.target.value)} onBlur={e => { const val = parseInt(e.target.value); if (isNaN(val) || val < 5) setPlayerAge(5); else if (val > 99) setPlayerAge(99); }} className="w-10 bg-transparent text-sm text-center" min="5" max="99" />
                          <span className="text-xs text-slate-400">años</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agregar más jugadores */}
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <p className="text-xs text-slate-500 mb-2">Agregar jugador</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <input type="text" value={newLocalPlayerName} onChange={e => setNewLocalPlayerName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addLocalPlayer()} className="flex-1 bg-slate-800 p-2 rounded-lg text-sm min-w-0 max-w-[120px]" placeholder="Nombre" />
                      <div className="flex items-center space-x-1 bg-slate-800 rounded-lg px-2 py-2">
                        <input type="number" value={newLocalPlayerAge} onChange={e => setNewLocalPlayerAge(e.target.value)} onBlur={e => { const val = parseInt(e.target.value); if (isNaN(val) || val < 5) setNewLocalPlayerAge(5); else if (val > 99) setNewLocalPlayerAge(99); }} className="w-10 bg-transparent text-sm text-center" min="5" max="99" />
                        <span className="text-xs text-slate-400">años</span>
                      </div>
                      <button onClick={addLocalPlayer} className="bg-green-600 px-3 py-2 rounded-lg flex-shrink-0"><Plus size={18} /></button>
                    </div>
                  </div>

                  {/* Lista de jugadores adicionales */}
                  {myLocalPlayers.length > 0 && (
                    <div className="space-y-2">
                      {myLocalPlayers.map((p, idx) => (
                        <div key={p.id} className="flex items-center text-sm bg-slate-800 p-2 rounded-lg gap-2">
                          <div onClick={() => { setEditingLocalPlayerAvatar(p.id); setShowAvatarModal(true); }} className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-500 flex-shrink-0 cursor-pointer">
                            {p.avatar ? (
                              <span className="text-lg">{p.avatar}</span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400">{p.name?.charAt(0)?.toUpperCase() || '?'}</span>
                            )}
                          </div>
                          <input type="text" value={p.name} onChange={e => setMyLocalPlayers(prev => prev.map(lp => lp.id === p.id ? { ...lp, name: e.target.value } : lp))} className="flex-1 bg-slate-700 p-2 rounded-lg text-sm min-w-0" />
                          <input type="number" value={p.age} onChange={e => setMyLocalPlayers(prev => prev.map(lp => lp.id === p.id ? { ...lp, age: e.target.value } : lp))} onBlur={e => { const val = parseInt(e.target.value); setMyLocalPlayers(prev => prev.map(lp => lp.id === p.id ? { ...lp, age: isNaN(val) || val < 5 ? 5 : val > 99 ? 99 : val } : lp)); }} className="w-11 bg-slate-700 p-2 rounded-lg text-sm text-center flex-shrink-0" min="5" max="99" />
                          <button onClick={() => removeLocalPlayer(p.id)} className="text-red-400 hover:text-red-300 flex-shrink-0"><X size={16} /></button>
                        </div>
                      ))}
                      <p className="text-xs text-slate-500 mt-2">Total: {myLocalPlayers.length + 1} jugadores</p>
                    </div>
                  )}
                  {myLocalPlayers.length === 0 && <p className="text-xs text-yellow-500">Agrega al menos un jugador más para compartir</p>}
                </>
              )}
            </div>

            <button onClick={createRoom} disabled={loading} className="w-full bg-red-600 py-4 rounded-xl font-black flex items-center justify-center space-x-2">
              {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={24} />}
              <span>CREAR SALA</span>
            </button>

            <div className="flex space-x-2">
              <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} className="flex-1 min-w-0 bg-slate-900 text-center p-3 rounded-xl font-mono font-bold uppercase text-sm" placeholder="CÓDIGO" maxLength={12} />
              <button onClick={joinRoom} disabled={loading} className="bg-blue-600 px-5 py-3 rounded-xl font-bold flex-shrink-0">{loading ? '...' : 'UNIRSE'}</button>
            </div>
          </div>
        </div>

        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-center">Elige tu Avatar</h3>

              {/* Avatares predefinidos */}
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPresetAvatar(emoji)}
                    className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${playerStats.avatar === emoji ? 'bg-green-600 ring-2 ring-green-400' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600"></div></div>
                <div className="relative flex justify-center"><span className="px-4 bg-slate-800 text-slate-400 text-sm">o sube tu foto</span></div>
              </div>

              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600">
                <Image size={20} /><span className="text-sm">Subir imagen</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              {uploadingAvatar && <p className="text-center text-slate-400">Subiendo...</p>}
              <button onClick={() => setShowAvatarModal(false)} className="w-full py-3 bg-slate-600 rounded-xl font-bold">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Lobby
  if (gameState === 'LOBBY' && roomData) {
    const isHost = roomData.hostId === user.uid;
    const activePlayers = roomData.players.filter(p => !p.waitingForNextRound);
    const canStart = activePlayers.length >= 2;
    const maxImpostors = Math.max(1, Math.floor(activePlayers.length / 2));
    const myIds = getMyPlayerIds();

    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 pb-24 flex flex-col">
        {/* Header con botones de refresh y salir */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={leaveRoom} className="flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>
          <button onClick={handleRefresh} className="flex items-center space-x-1 text-slate-400 text-sm">
            <RefreshCw size={16} /><span>Actualizar</span>
          </button>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">CÓDIGO</p>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-mono font-black text-blue-400">{roomData.code}</h2>
                <button onClick={copyCode} className="bg-slate-700 p-1.5 rounded-lg">
                  {codeCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Users className="inline-block text-slate-500 mb-1" size={20} />
              <div className="text-xl font-bold">{activePlayers.length}</div>
              {roomData.players.length > activePlayers.length && (
                <div className="text-xs text-yellow-400">+{roomData.players.length - activePlayers.length} esperando</div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={shareWhatsApp} className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>WhatsApp</span>
            </button>
            <button onClick={shareLink} className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-sm ${shareStatus === 'copied' ? 'bg-blue-600' : 'bg-slate-700'}`}>
              {shareStatus === 'copied' ? <CheckCircle size={16} /> : <Share2 size={16} />}
              <span>{shareStatus === 'copied' ? '¡Copiado!' : 'Link'}</span>
            </button>
            <button onClick={() => setShowQRModal(true)} className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13 2h-2v2h2v2h-4v-4h2v-2h-2v-2h4v4zm2-2h2v4h-2v2h-2v-2h2v-4zm-2-2v-2h4v2h-4z"/></svg>
              <span>QR</span>
            </button>
          </div>
        </div>

        {isHost && (
          <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Impostores</p>
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={() => updateImpostorCount((roomData.impostorCount || 1) - 1)} disabled={(roomData.impostorCount || 1) <= 1} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center disabled:opacity-30"><Minus size={16} /></button>
                  <span className="text-2xl font-black text-red-500 w-8 text-center">{roomData.impostorCount || 1}</span>
                  <button onClick={() => updateImpostorCount((roomData.impostorCount || 1) + 1)} disabled={(roomData.impostorCount || 1) >= maxImpostors} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center disabled:opacity-30"><Plus size={16} /></button>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Rondas</p>
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={() => updateTotalRounds((roomData.totalRounds || 2) - 1)} disabled={(roomData.totalRounds || 2) <= 1} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center disabled:opacity-30"><Minus size={16} /></button>
                  <span className="text-2xl font-black text-blue-400 w-8 text-center">{roomData.totalRounds || 2}</span>
                  <button onClick={() => updateTotalRounds((roomData.totalRounds || 2) + 1)} disabled={(roomData.totalRounds || 2) >= 10} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center disabled:opacity-30"><Plus size={16} /></button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"><HelpCircle size={16} className="text-slate-400" /><span className="text-sm text-slate-300">Pista categoría</span></div>
              <button onClick={toggleCategoryHint} className={`w-12 h-6 rounded-full ${roomData.showCategoryHint === true ? 'bg-green-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${roomData.showCategoryHint === true ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy size={16} className="text-purple-400" />
                <div>
                  <span className="text-sm text-slate-300">Puntos inocente</span>
                  <p className="text-xs text-slate-500">Si un inocente es votado, gana puntos extra</p>
                </div>
              </div>
              <button onClick={toggleInnocentEvaluation} className={`w-12 h-6 rounded-full flex-shrink-0 ${roomData.enableInnocentEvaluation !== false ? 'bg-purple-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${roomData.enableInnocentEvaluation !== false ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
          </div>
        )}

        {/* Add local player section */}
        <div className="bg-slate-800 rounded-xl mb-4 border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowAddLocalPlayer(!showAddLocalPlayer)}
            className="w-full p-3 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-2">
              <Smartphone size={18} className="text-green-400" />
              <span className="text-sm font-bold">Agregar jugador a este celular</span>
            </div>
            <Plus size={18} className={`text-slate-400 transition-transform ${showAddLocalPlayer ? 'rotate-45' : ''}`} />
          </button>
          {showAddLocalPlayer && (
            <div className="p-3 pt-0 space-y-3 border-t border-slate-700">
              {error && <div className="bg-red-500/20 text-red-200 p-2 rounded-lg text-center text-xs">{error}</div>}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLocalPlayerName}
                  onChange={e => setNewLocalPlayerName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addLocalPlayerToRoom()}
                  className="flex-1 bg-slate-700 p-2.5 rounded-lg text-sm"
                  placeholder="Nombre del jugador"
                />
                <input
                  type="number"
                  value={newLocalPlayerAge}
                  onChange={e => setNewLocalPlayerAge(e.target.value)}
                  onBlur={e => { const val = parseInt(e.target.value); if (isNaN(val) || val < 5) setNewLocalPlayerAge(5); else if (val > 99) setNewLocalPlayerAge(99); }}
                  className="w-14 bg-slate-700 p-2.5 rounded-lg text-sm text-center"
                  min="5"
                  max="99"
                  placeholder="Edad"
                />
                <button
                  onClick={addLocalPlayerToRoom}
                  className="bg-green-600 hover:bg-green-500 px-4 rounded-lg font-bold text-sm"
                >
                  Añadir
                </button>
              </div>
              {/* Local players on this device that can be removed */}
              {roomData.players.filter(p => p.deviceId === user.uid && p.id !== user.uid).length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500">Jugadores en este celular:</p>
                  {roomData.players.filter(p => p.deviceId === user.uid && p.id !== user.uid).map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{p.avatar || '👤'}</span>
                        <span className="text-sm">{p.name}</span>
                        <span className="text-xs text-slate-500">({p.age} años)</span>
                      </div>
                      <button onClick={() => removeLocalPlayerFromRoom(p.id)} className="text-red-400 hover:text-red-300 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {(() => {
            const rankings = getPlayerRankings(roomData.players);
            return roomData.players.map((p, idx) => (
            <div key={p.id} className="relative">
              {/* Línea verde de indicación de drop - arriba */}
              {dropTarget === idx && draggedPlayer !== null && draggedPlayer > idx && (
                <div className="absolute -top-1 left-0 right-0 h-1 bg-green-500 rounded-full z-10 shadow-lg shadow-green-500/50" />
              )}
              <div
                draggable={isHost}
                onDragStart={(e) => isHost && handleDragStart(e, idx)}
                onDragOver={(e) => isHost && handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, idx)}
                className={`bg-slate-800 p-3 rounded-xl flex items-center justify-between border transition-all ${myIds.includes(p.id) ? 'border-green-500/50' : 'border-slate-700'} ${draggedPlayer === idx ? 'opacity-50 scale-95' : ''} ${dropTarget === idx && draggedPlayer !== null ? 'border-green-500' : ''}`}
              >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {isHost && <GripVertical size={16} className="text-slate-500 cursor-grab flex-shrink-0" />}
                <Avatar player={p} onClick={p.id === user.uid ? () => setShowAvatarModal(true) : undefined} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {editingPlayerId === p.id ? (
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={editingPlayerName}
                            onChange={e => { setEditingPlayerName(e.target.value); setNameError(''); }}
                            onKeyPress={e => e.key === 'Enter' && updatePlayerNameInRoom(p.id, editingPlayerName)}
                            onBlur={() => {
                              if (!nameError && editingPlayerName.trim() && editingPlayerName !== p.name) {
                                updatePlayerNameInRoom(p.id, editingPlayerName);
                              } else if (!nameError) {
                                cancelEditingPlayerName();
                              }
                            }}
                            className={`bg-slate-700 px-2 py-1 rounded text-sm font-bold w-24 ${nameError ? 'border border-red-500' : ''}`}
                            autoFocus
                          />
                          <button onClick={() => updatePlayerNameInRoom(p.id, editingPlayerName)} className="text-green-400 p-1"><Check size={14} /></button>
                          <button onClick={cancelEditingPlayerName} className="text-red-400 p-1"><X size={14} /></button>
                        </div>
                        {nameError && <span className="text-red-400 text-xs mt-0.5">{nameError}</span>}
                      </div>
                    ) : (
                      <span
                        className={`font-bold truncate ${p.waitingForNextRound ? 'text-yellow-400' : ''} ${myIds.includes(p.id) ? 'cursor-pointer hover:text-blue-400' : ''}`}
                        onClick={() => myIds.includes(p.id) && startEditingPlayerName(p)}
                        title={myIds.includes(p.id) ? 'Clic para editar nombre' : ''}
                      >
                        {p.name}
                      </span>
                    )}
                    <ScoreBadge score={p.points} historicalScore={p.historicalPoints} />
                    {myIds.includes(p.id) && <Smartphone size={12} className="text-green-400 flex-shrink-0" />}
                    {p.waitingForNextRound && <Clock size={12} className="text-yellow-400 flex-shrink-0" title="Esperando siguiente ronda" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {p.isHost && <Star size={18} className="text-amber-400 fill-amber-400" title="Anfitrión" />}
                {isHost && !p.isHost && !myIds.includes(p.id) && <button onClick={() => kickPlayer(p.id)} className="p-1.5 bg-red-500/20 rounded-lg text-red-400"><X size={14} /></button>}
                <RankMedal rank={rankings[p.id]} />
              </div>
              </div>
              {/* Línea verde de indicación de drop - abajo */}
              {dropTarget === idx && draggedPlayer !== null && draggedPlayer < idx && (
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-500 rounded-full z-10 shadow-lg shadow-green-500/50" />
              )}
            </div>
          ));
          })()}
        </div>

        {/* Footer fijo con botón INICIAR o mensaje de espera */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700">
          {isHost ? (
            <button onClick={startGame} disabled={!canStart || loading} className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 ${!canStart ? 'bg-slate-700 text-slate-500' : 'bg-green-500'}`}>
              {loading ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" size={20} />}
              <span>{!canStart ? 'ESPERANDO...' : 'INICIAR'}</span>
            </button>
          ) : (
            <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-dashed border-slate-600">
              <p className="text-slate-400 animate-pulse text-lg font-bold">Esperando al anfitrión...</p>
            </div>
          )}
        </div>

        {/* Modal QR Code */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowQRModal(false)}>
            <div className="bg-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-center">Escanea para unirte</h3>
              <div className="bg-white p-4 rounded-xl flex items-center justify-center">
                <QRCodeSVG
                  value={`${window.location.origin}?code=${roomData.code}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Código de sala:</p>
                <p className="text-3xl font-mono font-black text-blue-400">{roomData.code}</p>
              </div>
              <button onClick={() => setShowQRModal(false)} className="w-full py-3 bg-slate-600 rounded-xl font-bold hover:bg-slate-500">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Reveal
  if (gameState === 'REVEAL' && roomData) {
    const myPlayers = getMyPlayersFromRoom();

    // Si todos mis jugadores están esperando la siguiente ronda, mostrar pantalla de espera
    const allMyPlayersWaiting = myPlayers.length > 0 && myPlayers.every(p => p.waitingForNextRound);
    if (allMyPlayersWaiting) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
          <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>
          <Clock size={80} className="text-yellow-500 mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-slate-300 mb-4">Ronda en curso</h2>
          <p className="text-slate-400 text-center mb-4">Te uniste mientras jugaban.</p>
          <p className="text-slate-400 text-center mb-8">Participarás en la siguiente ronda.</p>
          <div className="bg-slate-800 p-4 rounded-xl w-full max-w-sm">
            <p className="text-xs text-slate-500 mb-2">Jugadores en la sala:</p>
            <div className="flex flex-wrap gap-2">
              {roomData.players.map(p => (
                <span key={p.id} className={`px-2 py-1 rounded-full text-xs ${p.waitingForNextRound ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700'}`}>
                  {p.avatar || '👤'} {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const hasMultipleLocal = myPlayers.length > 1;
    const isHost = roomData.hostId === user.uid;
    const startingPlayer = roomData.players.find(p => p.id === roomData.startingPlayerId);
    const allSeenRole = roomData.players.filter(p => !p.waitingForNextRound).every(p => p.hasSeenRole === true);
    const rolesLocked = roomData.rolesLocked === true;
    const myLocalIds = myPlayers.map(p => p.id);
    const myPlayersSeenRole = myPlayers.filter(p => !p.waitingForNextRound).every(p => p.hasSeenRole === true);

    // Multi-local turn handling (solo si no han visto el rol y no está bloqueado)
    if (hasMultipleLocal && localTurnPhase !== 'none' && !myPlayersSeenRole && !rolesLocked) {
      const currentPlayer = myPlayers[localTurnIndex];
      const isImpostor = roomData.impostorIds?.includes(currentPlayer.id);

      if (localTurnPhase === 'pass') {
        return (
          <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
            <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>
            <UserCircle size={80} className="text-blue-400 mb-6" />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Pasa el teléfono a</h2>
            <p className="text-5xl font-black mb-8">{currentPlayer.name}</p>
            <p className="text-slate-500 mb-8">Turno {localTurnIndex + 1} de {myPlayers.length}</p>
            <button onClick={() => setLocalTurnPhase('ready')} className="w-full max-w-md bg-blue-600 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2">
              <span>SOY {currentPlayer.name.toUpperCase()}</span>
              <ArrowRight size={24} />
            </button>
          </div>
        );
      }

      if (localTurnPhase === 'ready') {
        return (
          <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
            <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>
            <EyeOff size={80} className="text-slate-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-300 mb-4">{currentPlayer.name}</h2>
            <p className="text-slate-400 mb-8">Asegúrate que nadie vea</p>
            <button onClick={() => setLocalTurnPhase('reveal')} className="w-full max-w-md bg-yellow-500 text-slate-900 py-4 rounded-2xl font-black text-lg">
              VER MI ROL
            </button>
          </div>
        );
      }

      if (localTurnPhase === 'reveal') {
        // Buscar el siguiente jugador que NO ha visto su rol
        const remainingPlayers = myPlayers.slice(localTurnIndex + 1);
        const nextNotSeenPlayer = remainingPlayers.find(p => !p.hasSeenRole && !p.waitingForNextRound);
        const isLastPlayer = !nextNotSeenPlayer;
        return (
          <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
            <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>
            <div className="p-10 rounded-3xl border-4 bg-slate-800 border-slate-600 mb-8 w-full max-w-md">
              <Eye size={60} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-4xl font-black uppercase text-center mb-2">{isImpostor ? 'IMPOSTOR' : 'TRIPULANTE'}</h3>
              <p className="text-slate-300 text-center mb-4">{isImpostor ? 'Finge saber' : 'Palabra secreta:'}</p>
              <div className="bg-slate-900 p-4 rounded-xl text-center">
                {isImpostor ? (
                  (roomData.showCategoryHint === true || currentPlayer.age < 8) ? <p className="font-bold text-2xl">{roomData.category}</p> : <p className="text-slate-400">Sin pista</p>
                ) : (
                  <p className="text-3xl font-black uppercase">{roomData.secretWord}</p>
                )}
              </div>
            </div>
            <p className="text-red-400 text-sm mb-4 font-bold">¡Memoriza tu palabra! No podrás verla de nuevo</p>
            <button onClick={async () => {
              // Marcar el rol de ESTE jugador como visto inmediatamente
              await markRoleSeen(currentPlayer.id);

              if (isLastPlayer) {
                setLocalTurnPhase('none');
              } else {
                // Buscar el siguiente jugador que NO ha visto su rol
                const remainingPlayers = myPlayers.slice(localTurnIndex + 1);
                const nextNotSeenIndex = remainingPlayers.findIndex(p => !p.hasSeenRole && !p.waitingForNextRound);

                if (nextNotSeenIndex === -1) {
                  // No hay más jugadores que ver
                  setLocalTurnPhase('none');
                } else {
                  setLocalTurnIndex(localTurnIndex + 1 + nextNotSeenIndex);
                  setLocalTurnPhase('pass');
                }
              }
            }} className="w-full max-w-md bg-green-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2">
              <Smartphone size={20} />
              <span>{nextNotSeenPlayer ? `PASAR A ${nextNotSeenPlayer.name.toUpperCase()}` : 'LISTO'}</span>
              {nextNotSeenPlayer && <ArrowRight size={20} />}
            </button>
          </div>
        );
      }
    }

    // Single player: mostrar pantalla para ver rol solo si no lo ha visto y no está bloqueado
    const myPlayer = roomData.players.find(p => p.id === user.uid);
    const isImpostor = roomData.impostorIds?.includes(user.uid);
    const iHaveSeenRole = myPlayer?.hasSeenRole === true;

    // Si no ha visto el rol y no está bloqueado, mostrar pantalla de ver rol
    if (!iHaveSeenRole && !rolesLocked && !hasMultipleLocal) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center select-none relative">
          <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>
          <div className="text-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-8 text-slate-300">Tu Identidad Secreta</h2>
            <div
              className="cursor-pointer mb-6"
              onTouchStart={() => setShowRole(true)}
              onTouchEnd={() => setShowRole(false)}
              onMouseDown={() => setShowRole(true)}
              onMouseUp={() => setShowRole(false)}
              onMouseLeave={() => setShowRole(false)}
            >
              {showRole ? (
                <div className="p-10 rounded-3xl border-4 bg-slate-800 border-slate-600">
                  <Eye size={80} className="mx-auto text-slate-400 mb-6" />
                  <h3 className="text-4xl font-black uppercase mb-2">{isImpostor ? 'IMPOSTOR' : 'TRIPULANTE'}</h3>
                  <p className="text-slate-300 mb-4">{isImpostor ? 'Finge saber' : 'Palabra:'}</p>
                  <div className="bg-slate-900 p-4 rounded-xl">
                    {isImpostor ? (
                      (roomData.showCategoryHint === true || myPlayer?.age < 8) ? <p className="font-bold text-2xl">{roomData.category}</p> : <p className="text-slate-400">Sin pista</p>
                    ) : <p className="text-3xl font-black uppercase">{roomData.secretWord}</p>}
                  </div>
                </div>
              ) : (
                <div className="h-96 w-full rounded-3xl bg-slate-800 border-4 border-slate-600 border-dashed flex flex-col items-center justify-center">
                  <EyeOff size={64} className="text-slate-500 mb-6" />
                  <span className="text-slate-400 font-bold text-xl uppercase">MANTÉN PRESIONADO</span>
                </div>
              )}
            </div>
            <p className="text-red-400 text-sm mb-4 font-bold">¡Memoriza tu palabra! No podrás verla de nuevo</p>
            <button onClick={() => markRoleSeen(user.uid)} className="w-full bg-green-500 py-4 rounded-xl font-black uppercase">
              YA VI MI ROL
            </button>
          </div>
        </div>
      );
    }

    // Pantalla de espera (ya vieron el rol o está bloqueado)
    const playersNotSeen = roomData.players.filter(p => !p.hasSeenRole);

    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center select-none relative">
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          <button onClick={handleRefresh} className="flex items-center space-x-1 text-slate-400 text-sm">
            <RefreshCw size={16} /><span>Actualizar</span>
          </button>
          <button onClick={leaveRoom} className="flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>
        </div>

        <div className="text-center w-full max-w-md">
          {/* Indicador de ronda */}
          <div className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded-xl p-3">
            <p className="text-blue-400 text-lg font-black">
              RONDA {roomData.currentRound || 1} / {roomData.totalRounds || 2}
            </p>
          </div>

          {startingPlayer && (
            <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-3">
              <p className="text-yellow-500 text-sm font-bold flex items-center justify-center space-x-2">
                <Crown size={16} /><span>Empieza: {startingPlayer.name}</span>
              </p>
            </div>
          )}

          {/* Solo mostrar sección de roles en ronda 1 */}
          {(roomData.currentRound || 1) === 1 && (
            <>
              <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                <Eye size={40} className="mx-auto text-green-400 mb-2" />
                <p className="text-green-400 font-bold">Ya viste tu rol</p>
                <p className="text-slate-400 text-sm mt-1">Recuerda tu palabra</p>
              </div>

              {!allSeenRole && !rolesLocked && (
                <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock size={16} className="text-yellow-500" />
                    <span className="text-sm font-bold text-slate-400">Esperando que vean su rol:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {playersNotSeen.filter(p => !p.waitingForNextRound).map(p => (
                      <span key={p.id} className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full font-bold">{p.name}</span>
                    ))}
                  </div>
                  {isHost && (
                    <div className="space-y-2 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-2">Opciones de anfitrión (si hay problemas):</p>
                      <button onClick={resetRolesVisibility} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2">
                        <RefreshCw size={14} />
                        <span>Ver roles de nuevo (misma palabra)</span>
                      </button>
                      <button onClick={changeWord} className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2">
                        <RefreshCw size={14} />
                        <span>Cambiar palabra (muy difícil)</span>
                      </button>
                      <button onClick={forceStartVoting} className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2">
                        <AlertTriangle size={14} />
                        <span>Forzar inicio (saltar)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isHost && allSeenRole && !rolesLocked && (
                <button onClick={lockRoles} className="w-full bg-green-500 py-4 rounded-xl font-black uppercase mb-4">
                  ¡INICIAR PARTIDA!
                </button>
              )}
            </>
          )}

          {/* Botones de control de ronda (host) */}
          {isHost && rolesLocked && (
            (roomData.currentRound || 1) >= (roomData.totalRounds || 2) ? (
              <button onClick={startVoting} className="w-full bg-yellow-500 text-slate-900 py-4 rounded-xl font-black uppercase">
                INICIAR VOTACIÓN
              </button>
            ) : (
              <button onClick={nextRound} disabled={loading} className="w-full bg-blue-500 py-4 rounded-xl font-black uppercase flex items-center justify-center space-x-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                <span>RONDA {(roomData.currentRound || 1) + 1}</span>
              </button>
            )
          )}

          {!isHost && (
            <div className="text-yellow-500 font-bold animate-pulse bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/20">
              {rolesLocked
                ? ((roomData.currentRound || 1) >= (roomData.totalRounds || 2)
                    ? 'Esperando votación...'
                    : 'Ronda en curso...')
                : 'Esperando al anfitrión...'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Voting
  if (gameState === 'VOTING' && roomData) {
    // Verificación de seguridad: si el status ya cambió a 'evaluating', forzar transición
    if (roomData.status === 'evaluating' && roomData.strategyEvaluation) {
      setGameState('EVALUATING');
      setLocalTurnPhase('evalExplanation');
      setMyStrategyVote(null);
      return null;
    }
    // Si ya terminó, ir a resultados
    if (roomData.status === 'finished') {
      setGameState('RESULTS');
      setLocalTurnPhase('none');
      return null;
    }

    const myPlayers = getMyPlayersFromRoom();

    // Si todos mis jugadores están esperando la siguiente ronda, mostrar pantalla de espera
    const allMyPlayersWaiting = myPlayers.length > 0 && myPlayers.every(p => p.waitingForNextRound);
    if (allMyPlayersWaiting) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
          <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>
          <Clock size={80} className="text-yellow-500 mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-slate-300 mb-4">Votación en curso</h2>
          <p className="text-slate-400 text-center mb-4">Te uniste mientras jugaban.</p>
          <p className="text-slate-400 text-center mb-8">Participarás en la siguiente ronda.</p>
          <div className="bg-slate-800 p-4 rounded-xl w-full max-w-sm">
            <p className="text-xs text-slate-500 mb-2">Estado de votación:</p>
            <div className="flex flex-wrap gap-2">
              {roomData.players.filter(p => !p.waitingForNextRound).map(p => (
                <span key={p.id} className={`px-2 py-1 rounded-full text-xs ${p.hasVoted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700'}`}>
                  {p.avatar || '👤'} {p.name} {p.hasVoted ? '✓' : '...'}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const hasMultipleLocal = myPlayers.length > 1;
    const isHost = roomData.hostId === user.uid;
    const playersNotVoted = roomData.players.filter(p => !p.hasVoted && !p.waitingForNextRound);
    const allMyVoted = myPlayers.every(p => p.hasVoted);

    // Multi-local voting
    if (hasMultipleLocal && !allMyVoted && localTurnPhase !== 'none') {
      const currentPlayer = myPlayers[localTurnIndex];
      if (currentPlayer.hasVoted || localVotesDone[currentPlayer.id]) {
        // Skip already voted
        if (localTurnIndex < myPlayers.length - 1) {
          setLocalTurnIndex(localTurnIndex + 1);
          return null;
        }
      }

      if (localTurnPhase === 'pass') {
        return (
          <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
            <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>
            <UserCircle size={80} className="text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Pasa el teléfono a</h2>
            <p className="text-5xl font-black mb-8">{currentPlayer.name}</p>
            <p className="text-slate-500 mb-8">Votación: {localTurnIndex + 1} de {myPlayers.length}</p>
            <button onClick={() => setLocalTurnPhase('vote')} className="w-full max-w-md bg-red-600 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2">
              <span>SOY {currentPlayer.name.toUpperCase()}</span>
              <ArrowRight size={24} />
            </button>
          </div>
        );
      }

      if (localTurnPhase === 'vote') {
        const numImpostors = roomData.impostorCount || 1;
        const currentIsImpostor = roomData.impostorIds?.includes(currentPlayer.id);
        // Si soy impostor con múltiples impostores, solo puedo votar por los OTROS impostores (numImpostors - 1)
        const votesRequired = (currentIsImpostor && numImpostors > 1) ? numImpostors - 1 : numImpostors;
        const isMultiVote = votesRequired > 1;

        return (
          <div className="min-h-screen bg-slate-900 text-white p-4 pb-24 flex flex-col">
            <div className="flex justify-end mb-2">
              <button onClick={leaveRoom} className="flex items-center space-x-1 text-slate-400 text-sm">
                <X size={16} /><span>Salir</span>
              </button>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black">{currentPlayer.name}</h2>
              <p className="text-slate-400 text-sm">
                {votesRequired > 1 ? 'Selecciona a los impostores' : '¿Quién es el impostor?'}
              </p>
            </div>
            {/* Contador flotante fijo */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center bg-slate-800/95 border-2 border-blue-500 rounded-xl px-4 py-2 shadow-lg shadow-blue-500/20">
              <span className="text-2xl font-black text-white">{selectedVotes.length}</span>
              <span className="text-lg text-slate-500 mx-1">/</span>
              <span className="text-2xl font-black text-blue-400">{votesRequired}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto content-start">
              {roomData.players.filter(p => p.id !== currentPlayer.id).map(p => {
                const isSelected = selectedVotes.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleVoteSelection(p.id, votesRequired)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center aspect-square active:scale-95 ${isSelected ? 'border-green-500 bg-green-500/20' : 'border-slate-700 bg-slate-800 hover:border-red-500'}`}
                  >
                    <Avatar player={p} size="lg" />
                    <span className="font-bold mt-2">{p.name}</span>
                    <ScoreBadge score={p.points} historicalScore={p.historicalPoints} />
                    {isSelected && <span className="text-green-400 text-xs mt-1 font-bold">✓ Seleccionado</span>}
                  </button>
                );
              })}
            </div>
            {/* Footer fijo con botón de confirmar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700">
              <button
                onClick={() => submitVote(selectedVotes)}
                disabled={selectedVotes.length !== votesRequired}
                className={`w-full py-4 rounded-xl font-black uppercase ${selectedVotes.length === votesRequired ? 'bg-green-600 active:bg-green-700' : 'bg-slate-700 text-slate-500'}`}
              >
                {selectedVotes.length === votesRequired
                  ? `Confirmar ${votesRequired === 1 ? 'voto' : `${votesRequired} votos`}`
                  : `Selecciona ${votesRequired - selectedVotes.length} más`
                }
              </button>
            </div>
          </div>
        );
      }
    }

    // Host voting on behalf of another player (proxy vote)
    if (votingAsPlayer && isHost) {
      const numImpostors = roomData.impostorCount || 1;
      const proxyIsImpostor = roomData.impostorIds?.includes(votingAsPlayer.id);
      const votesRequired = (proxyIsImpostor && numImpostors > 1) ? numImpostors - 1 : numImpostors;

      return (
        <div className="min-h-screen bg-slate-900 text-white p-4 pb-24 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => { setVotingAsPlayer(null); setSelectedVotes([]); }} className="flex items-center space-x-1 text-slate-400 text-sm">
              <ArrowLeft size={16} /><span>Cancelar</span>
            </button>
          </div>

          <div className="text-center mb-4">
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-3 mb-3">
              <p className="text-orange-400 text-xs font-bold uppercase">Votando como</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Avatar player={votingAsPlayer} size="md" />
                <span className="text-xl font-black">{votingAsPlayer.name}</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              {votesRequired > 1 ? 'Selecciona a los impostores' : `¿A quién vota ${votingAsPlayer.name}?`}
            </p>
          </div>
          {/* Contador flotante fijo */}
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center bg-slate-800/95 border-2 border-orange-500 rounded-xl px-4 py-2 shadow-lg shadow-orange-500/20">
            <span className="text-2xl font-black text-white">{selectedVotes.length}</span>
            <span className="text-lg text-slate-500 mx-1">/</span>
            <span className="text-2xl font-black text-orange-400">{votesRequired}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto content-start">
            {roomData.players.filter(p => p.id !== votingAsPlayer.id).map(p => {
              const isSelected = selectedVotes.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleVoteSelection(p.id, votesRequired)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center aspect-square active:scale-95 ${isSelected ? 'border-green-500 bg-green-500/20' : 'border-slate-700 bg-slate-800 hover:border-orange-500'}`}
                >
                  <Avatar player={p} size="lg" />
                  <span className="font-bold mt-2">{p.name}</span>
                  <ScoreBadge score={p.points} historicalScore={p.historicalPoints} />
                  {isSelected && <span className="text-green-400 text-xs mt-1 font-bold">✓ Seleccionado</span>}
                </button>
              );
            })}
          </div>

          {/* Footer fijo con botón de confirmar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700">
            <button
              onClick={() => submitProxyVote(selectedVotes)}
              disabled={selectedVotes.length !== votesRequired}
              className={`w-full py-4 rounded-xl font-black uppercase ${selectedVotes.length === votesRequired ? 'bg-orange-600 active:bg-orange-700' : 'bg-slate-700 text-slate-500'}`}
            >
              {selectedVotes.length === votesRequired
                ? `Confirmar voto de ${votingAsPlayer.name}`
                : `Selecciona ${votesRequired - selectedVotes.length} más`
              }
            </button>
          </div>
        </div>
      );
    }

    // Single player voting (can change vote)
    if (!hasMultipleLocal) {
      // Find who the current user voted for
      const myPlayerData = roomData.players.find(p => p.id === user.uid);
      const myCurrentVotes = Array.isArray(myPlayerData?.votedFor) ? myPlayerData.votedFor : (myPlayerData?.votedFor ? [myPlayerData.votedFor] : []);
      const numImpostors = roomData.impostorCount || 1;
      const iAmImpostor = roomData.impostorIds?.includes(user.uid);
      // Si soy impostor con múltiples impostores, solo puedo votar por los OTROS impostores (numImpostors - 1)
      const votesRequired = (iAmImpostor && numImpostors > 1) ? numImpostors - 1 : numImpostors;
      const hasAlreadyVoted = myCurrentVotes.length > 0;

      return (
        <div className="min-h-screen bg-slate-900 text-white p-4 pb-24 flex flex-col">
          {/* Botones refresh y salir */}
          <div className="flex justify-end space-x-3 mb-2">
            <button onClick={handleRefresh} className="flex items-center space-x-1 text-slate-400 text-sm">
              <RefreshCw size={16} /><span>Actualizar</span>
            </button>
            <button onClick={leaveRoom} className="flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-3xl font-black uppercase">Votación</h2>
            <p className="text-slate-400 text-sm">
              {hasAlreadyVoted
                ? 'Puedes cambiar tu voto'
                : votesRequired > 1
                  ? 'Selecciona a los impostores'
                  : '¿Quién es el impostor?'
              }
            </p>
          </div>
          {/* Contador flotante fijo */}
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center bg-slate-800/95 border-2 border-red-500 rounded-xl px-4 py-2 shadow-lg shadow-red-500/20">
            <span className="text-2xl font-black text-white">{selectedVotes.length}</span>
            <span className="text-lg text-slate-500 mx-1">/</span>
            <span className="text-2xl font-black text-red-400">{votesRequired}</span>
          </div>

          {/* Botón para ver jugadores que faltan por votar */}
          {playersNotVoted.length > 0 && (
            <button
              onClick={() => isHost ? setShowPendingVotesModal(true) : null}
              className={`w-full rounded-xl p-3 mb-4 border flex items-center justify-between ${isHost ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20' : 'bg-slate-800 border-slate-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-yellow-500" />
                <span className={`font-bold ${isHost ? 'text-orange-400' : 'text-slate-400'}`}>
                  Faltan por votar: {playersNotVoted.length}
                </span>
              </div>
              {isHost && <ArrowRight size={18} className="text-orange-400" />}
            </button>
          )}

          {/* Modal para gestionar votos pendientes (solo host) */}
          {showPendingVotesModal && isHost && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Votos Pendientes</h3>
                    <button onClick={() => setShowPendingVotesModal(false)} className="text-slate-400 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">Selecciona un jugador para emitir su voto</p>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]">
                  {playersNotVoted.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setVotingAsPlayer(p);
                        setShowPendingVotesModal(false);
                      }}
                      className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{p.avatar || '👤'}</span>
                        <div className="text-left">
                          <p className="font-bold">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.age} años</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-orange-400">
                        <span className="text-sm font-bold">Votar</span>
                        <ArrowRight size={18} />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-700 space-y-3">
                  <p className="text-xs text-slate-500 text-center">
                    Si no puedes contactar a los jugadores faltantes, puedes omitir sus votos
                  </p>
                  <button
                    onClick={() => {
                      setShowPendingVotesModal(false);
                      endVoting();
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-black uppercase flex items-center justify-center space-x-2"
                  >
                    <AlertTriangle size={20} />
                    <span>Omitir votos y ver resultados</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto content-start">
            {roomData.players.filter(p => p.id !== user.uid).map(p => {
              const isSelected = selectedVotes.includes(p.id);
              const wasMyVote = myCurrentVotes.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleVoteSelection(p.id, votesRequired)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center aspect-square active:scale-95 ${isSelected ? 'border-green-500 bg-green-500/20' : wasMyVote ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800 hover:border-red-500'}`}
                >
                  <Avatar player={p} size="lg" />
                  <span className="font-bold mt-2">{p.name}</span>
                  <ScoreBadge score={p.points} historicalScore={p.historicalPoints} />
                  {isSelected && <span className="text-green-400 text-xs mt-1 font-bold">✓ Seleccionado</span>}
                  {!isSelected && wasMyVote && <span className="text-blue-400 text-xs mt-1 font-bold">Tu voto actual</span>}
                </button>
              );
            })}
          </div>

          {/* Footer fijo con botones de confirmar y revelar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700 space-y-2">
            <button
              onClick={() => submitVote(selectedVotes)}
              disabled={selectedVotes.length !== votesRequired}
              className={`w-full py-4 rounded-xl font-black uppercase ${selectedVotes.length === votesRequired ? 'bg-green-600 active:bg-green-700' : 'bg-slate-700 text-slate-500'}`}
            >
              {selectedVotes.length === votesRequired
                ? (hasAlreadyVoted ? 'Cambiar voto' : `Confirmar ${votesRequired === 1 ? 'voto' : `${votesRequired} votos`}`)
                : `Selecciona ${votesRequired - selectedVotes.length} más`
              }
            </button>
            {isHost && playersNotVoted.length === 0 && (
              <button onClick={endVoting} className="w-full bg-yellow-500 text-slate-900 py-3 rounded-xl font-black uppercase">
                Revelar Resultados
              </button>
            )}
          </div>
        </div>
      );
    }

    // Multiple local players - all voted, waiting
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col">
        <div className="flex justify-end mb-2">
          <button onClick={leaveRoom} className="flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-3xl font-black uppercase">Votación</h2>
        </div>

        {/* Botón para ver jugadores que faltan por votar */}
        {playersNotVoted.length > 0 && (
          <button
            onClick={() => isHost ? setShowPendingVotesModal(true) : null}
            className={`w-full rounded-xl p-3 mb-4 border flex items-center justify-between ${isHost ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20' : 'bg-slate-800 border-slate-700'}`}
          >
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-yellow-500" />
              <span className={`font-bold ${isHost ? 'text-orange-400' : 'text-slate-400'}`}>
                Faltan por votar: {playersNotVoted.length}
              </span>
            </div>
            {isHost && <ArrowRight size={18} className="text-orange-400" />}
          </button>
        )}

        {/* Modal para gestionar votos pendientes (solo host) */}
        {showPendingVotesModal && isHost && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">Votos Pendientes</h3>
                  <button onClick={() => setShowPendingVotesModal(false)} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mt-1">Selecciona un jugador para emitir su voto</p>
              </div>

              <div className="p-4 space-y-2 overflow-y-auto max-h-[50vh]">
                {playersNotVoted.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setVotingAsPlayer(p);
                      setShowPendingVotesModal(false);
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{p.avatar || '👤'}</span>
                      <div className="text-left">
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.age} años</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-orange-400">
                      <span className="text-sm font-bold">Votar</span>
                      <ArrowRight size={18} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-slate-700 space-y-3">
                <p className="text-xs text-slate-500 text-center">
                  Si no puedes contactar a los jugadores faltantes, puedes omitir sus votos
                </p>
                <button
                  onClick={() => {
                    setShowPendingVotesModal(false);
                    endVoting();
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-black uppercase flex items-center justify-center space-x-2"
                >
                  <AlertTriangle size={20} />
                  <span>Omitir votos y ver resultados</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-300">Votos enviados</p>
            <p className="text-slate-500">{playersNotVoted.length === 0 ? 'Mostrando resultados...' : `Esperando ${playersNotVoted.length}...`}</p>
          </div>
        </div>

        {isHost && playersNotVoted.length === 0 && (
          <button onClick={endVoting} className="w-full bg-green-600 py-4 rounded-xl font-black uppercase">
            Revelar Resultados
          </button>
        )}
      </div>
    );
  }

  // Strategy Evaluation - Evaluar si el inocente más votado jugó bien
  if (gameState === 'EVALUATING' && roomData && roomData.strategyEvaluation) {
    const isHost = roomData.hostId === user.uid;
    const eval_ = roomData.strategyEvaluation;
    const myPlayers = getMyPlayersFromRoom();
    const myIds = myPlayers.map(p => p.id);

    // Pantalla de celebración cuando la evaluación ha terminado
    if (eval_.finished) {
      const result = eval_.result || 0;
      const isWin = result > 0;

      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-md">
            {/* Celebración o No ganó */}
            <div className={`mb-8 p-8 rounded-3xl border-4 ${isWin ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
              <div className="text-8xl mb-4 animate-bounce">
                {isWin ? '🎉' : '😢'}
              </div>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-4xl">{eval_.playerAvatar || '👤'}</span>
                <span className="text-2xl font-bold">{eval_.playerName}</span>
              </div>
              <h2 className={`text-3xl font-black mb-2 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                {isWin ? '¡GANÓ EL PUNTO!' : 'NO GANÓ EL PUNTO'}
              </h2>
              <div className={`text-lg ${isWin ? 'text-green-300' : 'text-red-300'}`}>
                {isWin ? 'La mayoría votó que jugó coherentemente' : 'La mayoría votó que no fue coherente'}
              </div>
            </div>

            {/* Resultado de votación */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
              <p className="text-slate-400 text-sm mb-3">Resultado de la votación:</p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className={`text-3xl font-black ${(eval_.votes?.coherent || 0) > (eval_.votes?.incoherent || 0) ? 'text-green-400' : 'text-slate-500'}`}>
                    {eval_.votes?.coherent || 0}
                  </div>
                  <div className="text-xs text-slate-500">Coherente</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-black ${(eval_.votes?.incoherent || 0) > (eval_.votes?.coherent || 0) ? 'text-red-400' : 'text-slate-500'}`}>
                    {eval_.votes?.incoherent || 0}
                  </div>
                  <div className="text-xs text-slate-500">Incoherente</div>
                </div>
              </div>
            </div>

            {/* Contador */}
            <div className="text-slate-500 animate-pulse">
              <Loader2 className="animate-spin inline-block mr-2" size={16} />
              Volviendo al lobby en 5 segundos...
            </div>
          </div>
        </div>
      );
    }

    // Mis jugadores que pueden votar (excluyendo al evaluado y los que esperan)
    const myEligiblePlayers = myPlayers.filter(p => p.id !== eval_.playerId && !p.waitingForNextRound);

    // Jugadores elegibles que AÚN no han votado
    const myPendingPlayers = myEligiblePlayers.filter(p => !eval_.votedBy?.includes(p.id));
    const hasMultipleLocal = myEligiblePlayers.length > 1;
    const allMyVoted = myPendingPlayers.length === 0;

    // Si TODOS mis jugadores son el evaluado o están esperando, no puedo votar
    const allMyPlayersExcluded = myEligiblePlayers.length === 0;

    // Calcular cuántos pueden votar (excluyendo al evaluado y los que esperan)
    const eligibleVoters = roomData.players.filter(p => p.id !== eval_.playerId && !p.waitingForNextRound);
    const totalEligible = eligibleVoters.length;
    const totalVoted = (eval_.votes?.coherent || 0) + (eval_.votes?.incoherent || 0);

    // Pantalla de explicación ANTES de la votación de evaluación
    if (localTurnPhase === 'evalExplanation') {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
          <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
            <X size={16} /><span>Salir</span>
          </button>

          <div className="w-full max-w-md text-center">
            {/* Icono de alerta */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-red-500/20 border-4 border-red-500 rounded-full flex items-center justify-center">
                <span className="text-5xl">⚠️</span>
              </div>
            </div>

            {/* Título principal */}
            <h1 className="text-3xl font-black text-red-400 mb-4">
              ¡ERA INOCENTE!
            </h1>

            {/* Jugador más votado */}
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mb-6">
              <p className="text-slate-400 text-sm mb-3">El jugador más votado fue:</p>
              <div className="flex items-center justify-center space-x-3 mb-3">
                <span className="text-5xl">{eval_.playerAvatar || '👤'}</span>
                <span className="text-3xl font-black">{eval_.playerName}</span>
              </div>
              <p className="text-red-400 font-bold">Y no era el impostor</p>
            </div>

            {/* Explicación */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-8">
              <h3 className="text-lg font-bold text-purple-400 mb-2">📊 Evaluación de estrategia</h3>
              <p className="text-slate-300 text-sm">
                Ahora cada jugador votará si <span className="font-bold text-white">{eval_.playerName}</span> jugó
                de manera coherente o solo confundía a propósito.
              </p>
              <p className="text-slate-400 text-xs mt-2">
                Si la mayoría vota que jugó bien, ganará +1 punto. Si no, perderá -1 punto.
              </p>
            </div>

            {/* Botón continuar */}
            <button
              onClick={() => setLocalTurnPhase(hasMultipleLocal ? 'pass' : 'strategyVote')}
              className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2"
            >
              <span>COMENZAR EVALUACIÓN</span>
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      );
    }

    // Multi-local: Sistema de turnos para evaluación de estrategia
    if (hasMultipleLocal && !allMyVoted && localTurnPhase !== 'none') {
      // Encontrar el primer jugador pendiente
      const currentPlayerIndex = myEligiblePlayers.findIndex(p => !eval_.votedBy?.includes(p.id));
      if (currentPlayerIndex === -1) {
        setLocalTurnPhase('none');
        return null;
      }
      const currentPlayer = myEligiblePlayers[currentPlayerIndex];
      const remainingCount = myPendingPlayers.length;

      if (localTurnPhase === 'pass') {
        return (
          <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative">
            <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>
            <UserCircle size={80} className="text-purple-400 mb-6" />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Pasa el teléfono a</h2>
            <p className="text-5xl font-black mb-8">{currentPlayer.name}</p>
            <p className="text-slate-500 mb-8">Evaluación: {myEligiblePlayers.length - remainingCount + 1} de {myEligiblePlayers.length}</p>
            <button onClick={() => setLocalTurnPhase('strategyVote')} className="w-full max-w-md bg-purple-600 py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-2">
              <span>SOY {currentPlayer.name.toUpperCase()}</span>
              <ArrowRight size={24} />
            </button>
          </div>
        );
      }

      if (localTurnPhase === 'strategyVote') {
        return (
          <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center text-center relative">
            <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
              <X size={16} /><span>Salir</span>
            </button>

            <div className="w-full max-w-md">
              {/* Quién está votando */}
              <div className="mb-4 bg-purple-500/20 border border-purple-500/50 rounded-xl p-3">
                <p className="text-purple-400 font-black text-lg">{currentPlayer.name} vota</p>
              </div>

              {/* Header */}
              <div className="mb-6">
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-400 text-xs font-bold uppercase mb-2">El más votado era INOCENTE</p>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl">{eval_.playerAvatar || '👤'}</span>
                    <span className="text-2xl font-black">{eval_.playerName}</span>
                  </div>
                </div>
              </div>

              {/* Pregunta */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
                <h2 className="text-lg font-black mb-2">¿{eval_.playerName} jugó bien?</h2>
                <p className="text-slate-400 text-sm mb-4">¿Sus palabras tenían coherencia o solo confundía?</p>

                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      await submitStrategyVote('coherent', currentPlayer.id);
                      // Pasar al siguiente o terminar
                      const nextPending = myEligiblePlayers.find(p => !eval_.votedBy?.includes(p.id) && p.id !== currentPlayer.id);
                      if (nextPending) {
                        setLocalTurnPhase('pass');
                      } else {
                        setLocalTurnPhase('none');
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                  >
                    <CheckCircle size={20} />
                    <span>Jugó bien (+1 punto)</span>
                  </button>

                  <button
                    onClick={async () => {
                      await submitStrategyVote('incoherent', currentPlayer.id);
                      const nextPending = myEligiblePlayers.find(p => !eval_.votedBy?.includes(p.id) && p.id !== currentPlayer.id);
                      if (nextPending) {
                        setLocalTurnPhase('pass');
                      } else {
                        setLocalTurnPhase('none');
                      }
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                  >
                    <X size={20} />
                    <span>Solo confundía (-1 punto)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    // Jugador único o todos votaron - Vista normal
    const singlePlayer = myEligiblePlayers.length === 1 ? myEligiblePlayers[0] : null;
    const singlePlayerVoted = singlePlayer && eval_.votedBy?.includes(singlePlayer.id);

    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center text-center relative">
        <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
          <X size={16} /><span>Salir</span>
        </button>

        <div className="w-full max-w-md">
          {/* Quién está votando (solo si hay un jugador) */}
          {singlePlayer && !singlePlayerVoted && (
            <div className="mb-4 bg-purple-500/20 border border-purple-500/50 rounded-xl p-3">
              <p className="text-purple-400 font-black text-lg">{singlePlayer.name} vota</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-xs font-bold uppercase mb-2">El más votado era INOCENTE</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-4xl">{eval_.playerAvatar || '👤'}</span>
                <span className="text-3xl font-black">{eval_.playerName}</span>
              </div>
              <p className="text-green-400 font-bold mt-2">+1 punto por engañar</p>
            </div>
          </div>

          {/* Pregunta de evaluación */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-xl font-black mb-2">Evaluación de Estrategia</h2>
            <p className="text-slate-400 text-sm mb-4">
              ¿{eval_.playerName} jugó siguiendo las reglas? ¿Sus palabras tenían coherencia o solo confundía?
            </p>

            {allMyPlayersExcluded ? (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                <p className="text-yellow-400 font-bold">{myIds.includes(eval_.playerId) ? 'Eres el jugador evaluado' : 'Esperando votación'}</p>
                <p className="text-slate-400 text-sm">Espera mientras los demás votan</p>
              </div>
            ) : allMyVoted || singlePlayerVoted ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                <p className="text-green-400 font-bold">Voto{myEligiblePlayers.length > 1 ? 's' : ''} enviado{myEligiblePlayers.length > 1 ? 's' : ''}</p>
                <p className="text-slate-400 text-sm">Esperando a los demás...</p>
              </div>
            ) : singlePlayer ? (
              <div className="space-y-3">
                <button
                  onClick={() => submitStrategyVote('coherent', singlePlayer.id)}
                  className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Jugó bien (+1 punto)</span>
                </button>
                <p className="text-xs text-slate-500">Sus palabras tenían sentido y coherencia</p>

                <button
                  onClick={() => submitStrategyVote('incoherent', singlePlayer.id)}
                  className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <X size={20} />
                  <span>Solo confundía (-1 punto)</span>
                </button>
                <p className="text-xs text-slate-500">Decía cosas sin sentido para engañar</p>
              </div>
            ) : (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                <p className="text-green-400 font-bold">Todos votaron</p>
              </div>
            )}
          </div>

          {/* Estado de votación */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Votos:</span>
              <span className="font-bold">{totalVoted} / {totalEligible}</span>
            </div>
            <div className="flex space-x-4 justify-center">
              <div className="text-center">
                <div className="text-2xl font-black text-green-400">{eval_.votes?.coherent || 0}</div>
                <div className="text-xs text-slate-500">Coherente</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-red-400">{eval_.votes?.incoherent || 0}</div>
                <div className="text-xs text-slate-500">Incoherente</div>
              </div>
            </div>
          </div>

          {/* Botones de host */}
          {isHost && (
            <div className="space-y-2">
              <button
                onClick={finishStrategyEvaluation}
                className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase"
              >
                Finalizar Evaluación
              </button>
              <button
                onClick={skipStrategyEvaluation}
                className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold text-slate-400"
              >
                Saltar (sin puntos extra)
              </button>
            </div>
          )}

          {!isHost && (
            <p className="text-slate-500 animate-pulse">Esperando al anfitrión...</p>
          )}
        </div>
      </div>
    );
  }

  // Results
  if (gameState === 'RESULTS' && roomData) {
    const isHost = roomData.hostId === user.uid;
    const sorted = [...roomData.players].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const byPoints = [...roomData.players].sort((a, b) => (b.points || 0) - (a.points || 0));
    const mostVoted = sorted[0];
    const wasImpostor = roomData.impostorIds?.includes(mostVoted.id);
    const impostorNames = roomData.players.filter(p => roomData.impostorIds?.includes(p.id)).map(p => p.name).join(', ');

    // Calcular cuántos impostores adivinó cada jugador
    const numImpostors = roomData.impostorCount || 1;
    const playersWithGuesses = roomData.players
      .filter(p => !roomData.impostorIds?.includes(p.id)) // Excluir impostores
      .map(p => {
        const playerVotes = Array.isArray(p.votedFor) ? p.votedFor : (p.votedFor ? [p.votedFor] : []);
        const correctGuesses = playerVotes.filter(voteId => roomData.impostorIds?.includes(voteId)).length;
        return { ...p, correctGuesses };
      })
      .filter(p => p.correctGuesses > 0); // Solo los que adivinaron al menos uno

    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center text-center relative">
        <button onClick={leaveRoom} className="absolute top-4 right-4 flex items-center space-x-1 text-slate-400 text-sm">
          <X size={16} /><span>Salir</span>
        </button>
        <div className="mb-6 w-full max-w-sm">
          <h2 className="text-xs text-slate-500 uppercase font-bold mb-4">Más votado</h2>
          <div className="text-5xl font-black mb-6">{mostVoted.name}</div>

          <div className={`inline-flex items-center space-x-2 px-8 py-3 rounded-full font-black text-lg uppercase ${wasImpostor ? 'bg-green-500 text-slate-900' : 'bg-red-500'}`}>
            {wasImpostor ? <CheckCircle size={24} /> : <Skull size={24} />}
            <span>{wasImpostor ? "ERA IMPOSTOR" : "INOCENTE"}</span>
          </div>
        </div>

        {/* Puntos ganados esta ronda */}
        <div className="bg-slate-800 p-4 rounded-2xl w-full max-w-sm mb-4 border border-slate-700">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Puntos esta ronda</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-red-400">Impostor{numImpostors > 1 ? 'es' : ''} ({impostorNames})</span>
              <span className="text-red-400 font-bold">+1 pt c/u</span>
            </div>
            {playersWithGuesses.length > 0 ? (
              <div className="space-y-1">
                {playersWithGuesses.map(p => (
                  <div key={p.id} className="flex justify-between items-center">
                    <span className="text-green-400">{p.name} ({p.correctGuesses}/{numImpostors})</span>
                    <span className="text-green-400 font-bold">+{p.correctGuesses * 2} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs">Nadie adivinó al impostor</p>
            )}
            {/* Mostrar bonus de inocente más votado */}
            {!wasImpostor && roomData.enableInnocentEvaluation !== false && (
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">{mostVoted.name} (engañó a todos)</span>
                  <span className="text-purple-400 font-bold">+1 pt</span>
                </div>
                {/* Mostrar resultado de evaluación de estrategia */}
                {roomData.strategyEvaluation?.finished && (
                  <div className="flex justify-between items-center mt-1">
                    <span className={roomData.strategyEvaluation.result > 0 ? 'text-green-400' : roomData.strategyEvaluation.result < 0 ? 'text-red-400' : 'text-slate-400'}>
                      {mostVoted.name} (estrategia)
                    </span>
                    <span className={`font-bold ${roomData.strategyEvaluation.result > 0 ? 'text-green-400' : roomData.strategyEvaluation.result < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {roomData.strategyEvaluation.result > 0 ? '+1 pt' : roomData.strategyEvaluation.result < 0 ? '-1 pt' : '0 pts'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl w-full max-w-sm mb-4 border border-slate-700">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <span className="text-slate-400">Impostor</span>
              <span className="font-bold text-red-400 text-lg">{impostorNames}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Palabra</span>
              <span className="font-bold text-blue-400 text-lg">{roomData.secretWord}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl w-full max-w-sm mb-6 border border-slate-700">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center justify-center space-x-2">
            <Trophy size={16} className="text-yellow-500" /><span>Puntuaciones</span>
          </h3>
          <div className="space-y-2">
            {byPoints.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-5 font-bold ${idx === 0 ? 'text-yellow-500' : 'text-slate-500'}`}>{idx + 1}.</span>
                  <Avatar player={p} size="sm" />
                  <span>{p.name}</span>
                </div>
                <span className="font-black text-yellow-500">{p.points || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button onClick={backToLobby} className="w-full max-w-sm bg-blue-600 py-4 rounded-xl font-black flex items-center justify-center space-x-2">
            <RefreshCw size={18} /><span>Otra vez</span>
          </button>
        ) : <div className="text-slate-500 animate-pulse">Esperando...</div>}
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold animate-pulse">Cargando...</div>;
}
