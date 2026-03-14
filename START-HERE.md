# Impostor Game - Punto de Partida

## Metadata

| Campo | Valor |
|-------|-------|
| **Proyecto** | Impostor Game |
| **Puerto** | 5173 (Vite default) |
| **Base de Datos** | Firestore (Firebase) |
| **Stack** | React + Vite + Tailwind CSS + Firebase |
| **Version** | 1.0.0 (ver package.json) |
| **Repositorio** | GitHub (usar `bash C:/Users/cisra/scripts/git-push.sh`) |

## Descripcion

Juego web multijugador tipo "Impostor" (estilo Among Us) desarrollado con React y Vite. Los participantes deben identificar al impostor en la partida. Deploy en Firebase con Firestore como base de datos.

---

## Arranque

```bash
# Desarrollo
npm run dev

# Build de produccion
npm run build

# Preview del build
npm run preview
```

**URL desarrollo**: http://localhost:5173

---

## Arquitectura

```
[Browser] --> [Vite Dev Server :5173]
                  |
          [React SPA] --> [Firebase/Firestore]
```

---

## Estructura de Archivos Clave

| Archivo | Descripcion |
|---------|-------------|
| `src/AppRouter.jsx` | Router principal de la aplicacion |
| `src/components/` | Componentes React |
| `src/pages/` | Paginas de la app |
| `src/services/` | Servicios (Firebase, etc.) |
| `src/engine/` | Logica del juego |
| `src/games/` | Definiciones de juegos |
| `src/config/` | Configuracion |
| `firebase.json` | Configuracion Firebase |
| `firestore.rules` | Reglas de seguridad Firestore |
| `vite.config.js` | Configuracion Vite |
| `tailwind.config.js` | Configuracion Tailwind |

### Documentos de Referencia
| Archivo | Descripcion |
|---------|-------------|
| `INSTRUCTIVO_JUEGO.md` | Instrucciones del juego |
| `MANUAL.md` | Manual de uso |
| `Guia_Para_Publicar.md` | Guia de deploy/publicacion |

---

## Respaldo de Base de Datos

- **Tipo**: Firestore (Firebase - cloud)
- **Frecuencia**: Gestionado por Firebase
- **Nota**: No aplica backup local

---

## Documentacion de Seguimiento

| Archivo | Proposito |
|---------|-----------|
| `version.json` | Changelog (si existe) |

### Proceso al recibir instruccion:
1. Registrar en `Instrucciones.md` (texto literal) - crear si no existe
2. Registrar en `Pendientes.md` (plan de accion + estado) - crear si no existe
3. Implementar cambios
4. Actualizar version en `package.json`
5. Marcar como completada en `Pendientes.md`

### Archivo historico:
Consultar en: http://localhost:4000/doc-archive.html

---

## Comandos de Referencia

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build |
