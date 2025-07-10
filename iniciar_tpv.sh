#!/bin/bash

# Script de inicio para TPV VeriFactu
# Para Linux y macOS

echo "==================================="
echo "  TPV Peluquería - Sistema VeriFactu"
echo "==================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "src/main.py" ]; then
    echo "❌ Error: No se encuentra src/main.py"
    echo "   Asegúrate de ejecutar este script desde el directorio tpv_verifactu"
    exit 1
fi

# Verificar que existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "❌ Error: No se encuentra el entorno virtual"
    echo "   Asegúrate de que la carpeta 'venv' existe"
    exit 1
fi

# Verificar configuración
if [ ! -f "config.py" ]; then
    echo "⚠️  Advertencia: No se encuentra config.py"
    echo "   Se usarán los valores por defecto"
    echo "   Recomendamos crear config.py con tus datos"
    echo ""
fi

echo "🔧 Activando entorno virtual..."
source venv/bin/activate

echo "🚀 Iniciando servidor TPV..."
echo ""
echo "📱 La aplicación estará disponible en:"
echo "   http://localhost:5001"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Configura tus datos en config.py antes del primer uso"
echo "   - Mantén esta ventana abierta mientras uses el TPV"
echo "   - Presiona Ctrl+C para detener el servidor"
echo ""
echo "🔄 Iniciando..."

# Iniciar la aplicación
python src/main.py

