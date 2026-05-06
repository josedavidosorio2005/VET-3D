# Pipeline de assets 3D

## Convencion de nombres

Cada mesh exportado desde Blender debe mapear a una ficha clinica. El visor detecta:

- `part.id`: `scapula`, `radius-ulna`, `heart`
- nombre comun normalizado: `escapula`, `radio_ulna`, `corazon`
- nombre latino normalizado: `os_scapulae`, `cor`, `os_coxae`

Para mayor control, usa nombres exactos y sin sufijos genericos de Blender.

## Blender

1. Aplica transformaciones antes de exportar.
2. Reduce materiales repetidos y conserva PBR solo cuando aporte valor visual.
3. Bakea mapas complejos cuando varias piezas compartan el mismo acabado.
4. Exporta un unico `modelo_perro.glb` en `public/models/`.

## Compresion Draco

El proyecto incluye `gltf-pipeline`.

```bash
npm run asset:draco
```

Equivale a:

```bash
gltf-pipeline -i public/models/modelo_perro.glb -o public/models/modelo_perro_draco.glb -d
```

## Conexion con el visor

Define:

```bash
VITE_DOG_MODEL_URL=/models/modelo_perro_draco.glb
```

Si la variable no existe, el visor usa el modelo procedural de respaldo para que QA y desarrollo no queden bloqueados.
