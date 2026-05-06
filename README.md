# VET-3D Clinical Atlas

Atlas 3D interactivo de anatomia canina con frontend React/Three.js y API REST en Express para fichas clinicas por estructura.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- Modelo final opcional en `public/models/modelo_perro_draco.glb`

## Ejecucion local

Instala dependencias:

```bash
npm install
```

Levanta la API en una terminal:

```bash
npm run dev:api
```

Levanta el frontend en otra terminal:

```bash
npm run dev
```

Abre `http://localhost:5173`. Vite enruta `/api` hacia `http://localhost:8787`.

## Variables de entorno

Frontend:

```bash
VITE_API_BASE_URL=https://tu-api.example.com
VITE_DOG_MODEL_URL=/models/modelo_perro_draco.glb
```

Backend:

```bash
PORT=8787
FRONTEND_ORIGIN=https://tu-frontend.vercel.app
```

`FRONTEND_ORIGIN` acepta multiples origenes separados por coma.

## API

```http
GET /api/health
GET /api/anatomy
GET /api/anatomy/:partId
```

Ejemplo:

```bash
curl http://localhost:8787/api/anatomy/scapula
```

La respuesta incluye `id`, `name`, `latinName`, `location`, `function`, `clinical`, `pathology`, `tags` y `system`.

## Assets 3D

El visor ya trae un modelo procedural de respaldo. Para usar un GLB exportado desde Blender:

1. Nombra cada mesh con el `id`, nombre normalizado o nombre latino de la ficha clinica. Ejemplos: `scapula`, `escapula`, `os_scapulae`.
2. Exporta `public/models/modelo_perro.glb`.
3. Ejecuta:

```bash
npm run asset:draco
```

4. Define:

```bash
VITE_DOG_MODEL_URL=/models/modelo_perro_draco.glb
```

El loader usa Draco y Meshopt desde `@react-three/drei`.

## QA

```bash
npm test
npm run test:visual:install
npm run test:visual
npm run build
npm audit
```

`npm test` valida salud de API, respuesta clinica de `scapula`, 404 y bloqueo CORS. `npm run test:visual:install` instala Chromium para Playwright la primera vez. `npm run test:visual` requiere que el frontend este corriendo y genera capturas en `artifacts/`.

## Despliegue

- Frontend: Vercel con `npm run build`.
- Backend: servicio Node compatible con Express.
- En Vercel configura `VITE_API_BASE_URL` apuntando al backend.
- En backend configura `FRONTEND_ORIGIN` con el dominio exacto del frontend.
