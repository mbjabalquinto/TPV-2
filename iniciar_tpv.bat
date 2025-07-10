@echo off
REM Script de inicio para TPV VeriFactu
REM Para Windows

echo ===================================
echo   TPV Peluqueria - Sistema VeriFactu
echo ===================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "src\main.py" (
    echo ❌ Error: No se encuentra src\main.py
    echo    Asegurate de ejecutar este script desde el directorio tpv_verifactu
    pause
    exit /b 1
)

REM Verificar que existe el entorno virtual
if not exist "venv" (
    echo ❌ Error: No se encuentra el entorno virtual
    echo    Asegurate de que la carpeta 'venv' existe
    pause
    exit /b 1
)

REM Verificar configuración
if not exist "config.py" (
    echo ⚠️  Advertencia: No se encuentra config.py
    echo    Se usaran los valores por defecto
    echo    Recomendamos crear config.py con tus datos
    echo.
)

echo 🔧 Activando entorno virtual...
call venv\Scripts\activate.bat

echo 🚀 Iniciando servidor TPV...
echo.
echo 📱 La aplicacion estara disponible en:
echo    http://localhost:5001
echo.
echo ⚠️  IMPORTANTE:
echo    - Configura tus datos en config.py antes del primer uso
echo    - Manten esta ventana abierta mientras uses el TPV
echo    - Presiona Ctrl+C para detener el servidor
echo.
echo 🔄 Iniciando...

REM Iniciar la aplicación
python src\main.py

pause

