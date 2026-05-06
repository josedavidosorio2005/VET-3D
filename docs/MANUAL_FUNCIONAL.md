# Manual funcional breve

## Exploracion

- Arrastra sobre el visor para rotar el atlas.
- Usa la rueda del mouse o gesto de pinch para acercar y alejar.
- Selecciona un hotspot o una mesh nombrada del GLB para abrir su ficha clinica.

## Paneles

- La barra lateral cambia el sistema anatomico activo.
- El buscador filtra por estructura, region, funcion, signo clinico o patologia.
- La ficha clinica muestra nombre comun, latin, ubicacion, funcion, importancia clinica y patologias frecuentes.

## Datos

- Si la API esta activa, la ficha se consulta en `GET /api/anatomy/:partId`.
- Si la API no responde en desarrollo, el frontend conserva datos locales de respaldo.

## Entrega

Para validar antes de entregar:

```bash
npm test
npm run test:visual:install
npm run test:visual
npm run build
npm audit
```
