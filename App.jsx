import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import {
  UserPlus,
  Play,
  EyeOff,
  Skull,
  CheckCircle,
  Crown,
  Loader2,
  Users,
  Info,
  Share2,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyD6uuwtRjvJUke5zuWrtn9gRAwqiMaBbfg",
  authDomain: "impostor-b645b.firebaseapp.com",
  projectId: "impostor-b645b",
  storageBucket: "impostor-b645b.firebasestorage.app",
  messagingSenderId: "1052326710248",
  appId: "1:1052326710248:web:fa56e216c58d113a24b25d",
  measurementId: "G-T0DRWK2SDS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'impostor-game-v1';

// --- PALABRAS ---
const WORD_CATEGORIES = {
  EASY: [
    { category: 'Animales', words: ['Perro', 'Gato', 'Elefante', 'León', 'Mono', 'Vaca'] },
    { category: 'Comida', words: ['Pizza', 'Helado', 'Manzana', 'Pan', 'Leche'] },
    { category: 'Escuela', words: ['Lápiz', 'Maestra', 'Libro', 'Mochila', 'Recreo'] }
  ],
  MEDIUM: [
    { category: 'Tecnología', words: ['Instagram', 'WiFi', 'iPhone', 'Audífonos', 'Videojuego'] },
    { category: 'Deportes', words: ['Fútbol', 'Natación', 'Gimnasio', 'Árbitro', 'Medalla'] },
    { category: 'Profesiones', words: ['Doctor', 'Bombero', 'Youtuber', 'Abogado', 'Chef'] }
  ],
  HARD: [
    { category: 'Conceptos', words: ['Inflación', 'Democracia', 'Hipoteca', 'Estrés', 'Jubilación'] },
    { category: 'Lugares', words: ['Chernobyl', 'Triángulo de las Bermudas', 'Muralla China', 'Las Vegas'] },
    { category: 'Cine', words: ['Titanic', 'Star Wars', 'Harry Potter', 'El Padrino', 'Marvel'] }
  ]
};

export default function ImpostorGame() {
  const [user, setUser] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerAge, setPlayerAge] = useState(18);
  const [roomCode, setRoomCode] = useState('');
  const [gameState, setGameState] = useState('MENU');
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [shareStatus, setShareStatus] = useState('idle');
  const [codeCopied, setCodeCopied] = useState(false);

  // 1. Auth & URL Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code');
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase());
    }

    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth error", err);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 2. Room Listener
  useEffect(() => {
    if (!user || !roomCode || gameState === 'MENU') return;

    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);

        if (data.status === 'revealing' && gameState === 'LOBBY') setGameState('REVEAL');
        if (data.status === 'playing' && gameState === 'REVEAL') setGameState('PLAYING');
        if (data.status === 'voting' && gameState !== 'VOTING') setGameState('VOTING');
        if (data.status === 'finished' && gameState !== 'RESULTS') setGameState('RESULTS');
        if (data.status === 'lobby' && gameState !== 'LOBBY') {
           setGameState('LOBBY');
           setHasVoted(false);
           setShowRole(false);
        }
      } else {
        setError("Sala no encontrada o cerrada.");
        setGameState('MENU');
        setRoomData(null);
      }
    }, (err) => {
      console.error(err);
      setError("Error de conexión.");
    });

    return () => unsubscribe();
  }, [user, roomCode, gameState]);

  // --- ACTIONS ---

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const createRoom = async () => {
    if (!playerName.trim()) return setError("¡Pon tu nombre!");
    setLoading(true);

    const code = generateRoomCode();
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);

    const playerData = {
      id: user.uid,
      name: playerName,
      age: parseInt(playerAge) || 18,
      isHost: true,
      votes: 0
    };

    try {
      await setDoc(roomRef, {
        code,
        hostId: user.uid,
        status: 'lobby',
        players: [playerData],
        createdAt: serverTimestamp(),
        secretWord: '',
        category: '',
        impostorId: ''
      });
      setRoomCode(code);
      setGameState('LOBBY');
    } catch (e) {
      setError("Error al crear. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim()) return setError("¡Pon tu nombre!");
    if (!roomCode.trim() || roomCode.length !== 4) return setError("Código inválido");

    setLoading(true);
    const code = roomCode.toUpperCase();
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', code);

    try {
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        setLoading(false);
        return setError("Sala no encontrada");
      }

      const data = snap.data();
      if (data.status !== 'lobby') {
        setLoading(false);
        return setError("Ya están jugando");
      }

      const isAlreadyIn = data.players.some(p => p.id === user.uid);

      if (isAlreadyIn) {
        setRoomCode(code);
        setGameState('LOBBY');
      } else {
        const myPlayerData = {
          id: user.uid,
          name: playerName,
          age: parseInt(playerAge) || 18,
          isHost: false,
          votes: 0
        };

        await updateDoc(roomRef, {
          players: arrayUnion(myPlayerData)
        });

        setRoomCode(code);
        setGameState('LOBBY');
      }
    } catch (e) {
      console.error(e);
      setError("Error al unirse.");
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    if (!roomData) return;
    setLoading(true);

    const ages = roomData.players.map(p => p.age);
    const minAge = Math.min(...ages);
    let difficulty = 'HARD';
    if (minAge <= 10) difficulty = 'EASY';
    else if (minAge <= 16) difficulty = 'MEDIUM';

    const categories = WORD_CATEGORIES[difficulty];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const secretWord = randomCat.words[Math.floor(Math.random() * randomCat.words.length)];

    const impostorIndex = Math.floor(Math.random() * roomData.players.length);
    const impostorId = roomData.players[impostorIndex].id;

    const playersReset = roomData.players.map(p => ({ ...p, votes: 0 }));

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        status: 'revealing',
        secretWord,
        category: randomCat.category,
        impostorId,
        players: playersReset
      });
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const startVoting = async () => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { status: 'voting' });
    } catch(e) {}
  };

  const submitVote = async (targetId) => {
    if (hasVoted) return;
    setHasVoted(true);

    const newPlayers = roomData.players.map(p => {
      if (p.id === targetId) return { ...p, votes: (p.votes || 0) + 1 };
      return p;
    });

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { players: newPlayers });
    } catch (e) { setHasVoted(false); }
  };

  const endVoting = async () => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), { status: 'finished' });
    } catch(e) {}
  };

  const backToLobby = async () => {
     try {
       await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomCode), {
        status: 'lobby',
        secretWord: '',
        impostorId: ''
      });
     } catch(e) {}
  };

  // --- SHARE FUNCTION ---
  const shareLink = async () => {
    const baseUrl = window.location.href.split('?')[0];
    const shareUrl = `${baseUrl}?code=${roomCode}`;
    const shareText = `¡Únete a mi partida de Impostor! Código: ${roomCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Juego Impostor',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) { console.log(err); }
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShareStatus('copied_link');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch (err) { console.error(err); }
      document.body.removeChild(textArea);
    }
  };

  const copyCodeOnly = () => {
    const textArea = document.createElement("textarea");
    textArea.value = roomCode;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) { console.error(err); }
    document.body.removeChild(textArea);
  };

  // --- VISTAS ---

  if (gameState === 'MENU') {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-black text-red-500 tracking-tighter uppercase drop-shadow-lg mb-2">IMPOSTOR</h1>
            <p className="text-slate-400 font-medium">Detecta al espía</p>
          </div>

          <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 space-y-5">
            {error && <div className="bg-red-500/20 text-red-200 p-4 rounded-xl text-center text-sm font-bold border border-red-500/50">{error}</div>}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tu Nombre</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-900 text-white p-4 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-lg"
                placeholder="Ej. Juan"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tu Edad</label>
              <input
                type="number"
                value={playerAge}
                onChange={(e) => setPlayerAge(e.target.value)}
                className="w-full bg-slate-900 text-white p-4 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-lg"
              />
              <p className="text-[10px] text-slate-500 px-1 pt-1">Solo para determinar dificultad, nadie la verá.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              <button
                onClick={createRoom}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={24} />}
                <span>CREAR SALA</span>
              </button>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-slate-900 text-center text-white p-4 rounded-xl font-mono font-black tracking-widest uppercase text-xl w-32 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ABCD"
                  maxLength={4}
                />
                <button
                  onClick={joinRoom}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  {loading ? '...' : 'UNIRSE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'LOBBY' && roomData) {
    const isHost = roomData.hostId === user.uid;
    const canStart = roomData.players.length >= 2;

    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col font-sans">

        {/* ENCABEZADO DE SALA */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-4 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10 mb-4">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">CÓDIGO DE SALA</p>
              <div className="flex items-center space-x-3">
                <h2 className="text-5xl font-mono font-black text-blue-400 tracking-tighter">{roomData.code}</h2>
                <button
                  onClick={copyCodeOnly}
                  className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors text-slate-300"
                  title="Copiar solo el código"
                >
                  {codeCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            <div className="text-right">
               <Users className="inline-block text-slate-500 mb-1" />
               <div className="text-2xl font-bold">{roomData.players.length}</div>
            </div>
          </div>

          <button
            onClick={shareLink}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all ${shareStatus === 'copied_link' ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
          >
            {shareStatus === 'copied_link' ? <CheckCircle size={18} /> : <Share2 size={18} />}
            <span>{shareStatus === 'copied_link' ? '¡ENLACE COPIADO!' : 'INVITAR AMIGOS'}</span>
          </button>
        </div>

        {/* LISTA DE JUGADORES */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6 px-1">
          {roomData.players.map((p, idx) => (
            <div key={idx} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-inner">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="font-bold text-lg leading-tight">{p.name}</div>
              </div>
              {p.isHost && <Crown size={20} className="text-yellow-500" />}
            </div>
          ))}
        </div>

        {isHost ? (
          <button
            onClick={startGame}
            disabled={!canStart || loading}
            className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-2 shadow-xl transition-all ${
              !canStart
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-400 active:scale-95'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
            <span>{!canStart ? 'ESPERANDO JUGADOR...' : 'INICIAR PARTIDA'}</span>
          </button>
        ) : (
          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-600">
            <p className="text-slate-400 animate-pulse font-medium">Esperando al anfitrión...</p>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'REVEAL' || gameState === 'PLAYING') {
    const isImpostor = roomData.impostorId === user.uid;
    const isHost = roomData.hostId === user.uid;

    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center font-sans">
        {gameState === 'REVEAL' && (
          <div className="text-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-8 text-slate-300">Tu Identidad Secreta</h2>

            <div
              className={`cursor-pointer transition-all duration-300 transform ${showRole ? 'scale-100' : 'hover:scale-105 active:scale-95'} mb-10`}
              onClick={() => setShowRole(!showRole)}
            >
              {showRole ? (
                <div className={`p-10 rounded-3xl border-4 shadow-2xl relative overflow-hidden ${isImpostor ? 'bg-red-900/90 border-red-500' : 'bg-blue-900/90 border-blue-500'}`}>
                   {isImpostor ? (
                     <>
                      <Skull size={80} className="mx-auto text-red-500 mb-6 drop-shadow-lg" />
                      <h3 className="text-4xl font-black text-red-500 uppercase mb-2 tracking-tighter">IMPOSTOR</h3>
                      <p className="text-red-100 font-medium text-lg">Tu misión: Fingir.</p>
                      <div className="mt-4 bg-red-950/50 p-3 rounded-lg border border-red-500/30">
                        <p className="text-xs text-red-300 uppercase font-bold">Categoría</p>
                        <p className="font-bold text-xl">{roomData.category}</p>
                      </div>
                     </>
                   ) : (
                     <>
                      <CheckCircle size={80} className="mx-auto text-blue-400 mb-6 drop-shadow-lg" />
                      <h3 className="text-4xl font-black text-blue-400 uppercase mb-2 tracking-tighter">TRIPULANTE</h3>
                      <p className="text-blue-100 font-medium text-lg">La palabra secreta es:</p>
                      <div className="mt-6 bg-white text-slate-900 p-4 rounded-xl shadow-lg transform rotate-1">
                        <div className="text-4xl font-black uppercase tracking-wide">{roomData.secretWord}</div>
                      </div>
                     </>
                   )}
                </div>
              ) : (
                <div className="h-96 w-full rounded-3xl bg-slate-800 border-4 border-slate-600 border-dashed shadow-xl flex flex-col items-center justify-center group">
                  <EyeOff size={64} className="text-slate-500 mb-6 group-hover:text-slate-300 transition-colors" />
                  <span className="text-slate-400 font-bold text-2xl uppercase tracking-widest group-hover:text-white transition-colors">Toca para ver</span>
                </div>
              )}
            </div>

            {isHost ? (
              <button
                onClick={startVoting}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide"
              >
                Iniciar Votación
              </button>
            ) : (
              <div className="text-yellow-500 font-bold animate-pulse bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/20">
                Esperando al anfitrión...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'VOTING') {
    const isHost = roomData.hostId === user.uid;
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col font-sans">
        <div className="text-center mb-6 mt-4">
          <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">Votación</h2>
          <p className="text-slate-400 text-sm font-medium">Toca a quien quieres expulsar</p>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto content-start pb-4">
          {roomData.players.map((p) => {
             return (
              <button
                key={p.id}
                disabled={hasVoted}
                onClick={() => submitVote(p.id)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all aspect-square ${
                  hasVoted
                    ? 'border-slate-800 bg-slate-800/50 opacity-40 cursor-not-allowed'
                    : 'border-slate-700 bg-slate-800 hover:border-red-500 hover:bg-slate-750 active:scale-95 active:border-red-500 active:bg-red-900/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-3 ${hasVoted ? 'bg-slate-700' : 'bg-blue-600'}`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold truncate w-full text-center text-lg">{p.name}</span>
                {hasVoted && <CheckCircle size={16} className="text-green-500 mt-2" />}
              </button>
             );
          })}
        </div>

        {hasVoted && (
          <div className="p-4 bg-slate-800 rounded-xl text-center border border-slate-700 mb-4 animate-pulse">
            <span className="text-slate-300 font-bold">Voto enviado. Esperando resultados...</span>
          </div>
        )}

        {isHost && (
          <div className="mt-2">
             <button
              onClick={endVoting}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase"
            >
              Revelar Resultados
            </button>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'RESULTS') {
    const isHost = roomData.hostId === user.uid;
    const sortedPlayers = [...roomData.players].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const mostVoted = sortedPlayers[0];
    const wasImpostor = mostVoted.id === roomData.impostorId;
    const impostorData = roomData.players.find(p => p.id === roomData.impostorId);

    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center font-sans text-center">
        <div className="mb-10 w-full">
          <h2 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">El expulsado fue</h2>
          <div className="text-5xl font-black text-white mb-6 drop-shadow-xl">{mostVoted.name}</div>

          <div className={`inline-flex items-center space-x-2 px-8 py-3 rounded-full font-black text-lg uppercase shadow-lg ${wasImpostor ? 'bg-green-500 text-slate-900' : 'bg-red-500 text-white'}`}>
             {wasImpostor ? <CheckCircle size={24} /> : <Skull size={24} />}
             <span>{wasImpostor ? "ERA EL IMPOSTOR" : "INOCENTE"}</span>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl w-full max-w-sm mb-6 border border-slate-700 shadow-xl">
           <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-slate-700 pb-3">
               <span className="text-slate-400 font-medium">Impostor Real</span>
               <span className="font-bold text-red-400 text-xl">{impostorData?.name || 'Desconocido'}</span>
             </div>
             <div className="flex justify-between items-center pt-1">
               <span className="text-slate-400 font-medium">Palabra Secreta</span>
               <span className="font-bold text-blue-400 text-xl">{roomData.secretWord}</span>
             </div>
           </div>
        </div>

        {isHost ? (
          <button
             onClick={backToLobby}
             className="w-full max-w-sm bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase"
           >
             <RefreshCw className="inline mr-2"/>
             Jugar otra vez
           </button>
        ) : (
          <div className="text-slate-500 font-medium animate-pulse">Esperando al anfitrión...</div>
        )}
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold animate-pulse">Cargando aplicación...</div>;
}
