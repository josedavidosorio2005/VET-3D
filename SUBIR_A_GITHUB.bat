@echo off
echo ========================================
echo   VET-3D: SUBIDA AUTOMATICA A GITHUB
echo ========================================
echo.
echo [1/4] Configurando identidad de Git...
git config user.email "josedavid@ejemplo.com"
git config user.name "Jose David"

echo [2/4] Registrando archivos...
git add .

echo [3/4] Creando commit...
git commit -m "Initial commit: Photorealistic Canine Anatomy with Cinematic Lighting"

echo [4/4] Subiendo a la rama principal...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Hubo un error. Asegurate de que el repositorio existe y tienes conexion.
) else (
    echo.
    echo [OK] !Subida completada con exito!
)
echo.
pause
