Cómo crear un Link Público para tu juego (Gratis)

Para que tus amigos puedan unirse desde sus celulares, necesitas poner este código en internet y conectarlo a tu propia base de datos (para que los celulares se hablen entre sí).

Paso 1: Configura tu "Cerebro" (Base de datos Firebase)

Ve a console.firebase.google.com e inicia sesión con tu cuenta de Google.

Dale a "Agregar proyecto" (ponle nombre, ej: "JuegoImpostor").

Desactiva Google Analytics (no hace falta) y dale a "Crear".

Cuando cargue, en el menú lateral busca "Compilación" -> "Firestore Database".

Dale a "Crear base de datos".

Elige "Comenzar en modo de prueba" (Importante para que funcione sin configurar seguridad complicada).

Dale "Siguiente" y "Habilitar".

En el menú lateral busca "Compilación" -> "Authentication".

Dale a "Comenzar".

En "Proveedores de acceso", elige "Anónimo" y actívalo. Guardar.

Paso 2: Obtén tus llaves

En tu proyecto de Firebase, dale clic al engranaje ⚙️ (al lado de "Descripción general") -> Configuración del proyecto.

Baja hasta el final donde dice "Tus apps".

Dale al icono de web (</>).

Ponle un apodo a la app (ej: "juego") y dale a "Registrar app".

Aparecerá un código con const firebaseConfig = { ... }. Copia todo lo que está entre las llaves { ... }.

Paso 3: Publica el Juego

Ve a StackBlitz.com (es un editor de código en línea).

En el dashboard, selecciona "React JavaScript" (o busca un botón que diga "New Project" -> "React").

En el archivo App.js (o App.tsx), borra todo el código que viene por defecto.

Copia el código de la App que te generé aquí en el chat y pégalo ahí.

IMPORTANTE - EL CAMBIO FINAL:

Busca al principio del código donde dice const firebaseConfig = JSON.parse(__firebase_config);.

Bórralo y reemplázalo por lo que copiaste en el Paso 2. Debería verse así:

// REEMPLAZA ESTA PARTE
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
// EL RESTO DEL CÓDIGO SIGUE IGUAL...


En la parte izquierda de StackBlitz, verás una sección de "Dependencies". Escribe firebase y dale enter. Luego escribe lucide-react y dale enter.

¡Listo!

Arriba en la ventana de "Preview" de StackBlitz verás una URL (algo como https://react-xyz.stackblitz.io). Ese es el link que puedes mandar por WhatsApp a tus amigos.