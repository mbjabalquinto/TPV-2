# 🚀 Instalación Rápida - TPV VeriFactu

## ⚡ Inicio Rápido (5 minutos)

### 1. Configurar Datos de tu Empresa

**📝 OBLIGATORIO**: Edita el archivo `config.py` con tus datos reales:

```python
# Cambia estos datos por los de tu peluquería
COMPANY_NAME = "Tu Peluquería"
COMPANY_NIF = "TU_NIF_REAL"  # ⚠️ MUY IMPORTANTE
COMPANY_ADDRESS = "Tu dirección completa"
COMPANY_PHONE = "Tu teléfono"
```

### 2. Iniciar la Aplicación

**En Linux/macOS:**
```bash
./iniciar_tpv.sh
```

**En Windows:**
```
Doble clic en: iniciar_tpv.bat
```

### 3. Abrir en el Navegador

Ir a: `http://localhost:5001`

---

## ✅ Verificación Rápida

### Paso 1: Añadir un Producto
1. Pestaña "Productos y Servicios"
2. Añadir: "Corte de pelo" - 25€ - Servicio

### Paso 2: Crear Factura
1. Pestaña "Nueva Factura"
2. Añadir el producto
3. Generar factura

### Paso 3: Verificar PDF
1. Pestaña "Historial"
2. Descargar PDF
3. Verificar que aparecen tus datos

---

## 🔧 Configuración Avanzada

### Personalizar IVA
```python
DEFAULT_IVA_RATE = 21.0  # Cambiar si usas otro tipo de IVA
```

### Personalizar Mensajes
```python
TICKET_FOOTER_MESSAGE = "Tu mensaje personalizado"
```

### Cambiar Puerto
```python
SERVER_PORT = 8080  # Si el puerto 5001 está ocupado
```

---

## 🆘 Problemas Comunes

### "No se encuentra src/main.py"
- Ejecuta el script desde la carpeta `tpv_verifactu`

### "Error al generar PDF"
- Verifica que tienes permisos de escritura
- Comprueba que existe la carpeta `src/static/pdfs/`

### "Puerto ocupado"
- Cambia `SERVER_PORT` en `config.py`
- O cierra otras aplicaciones que usen el puerto 5001

---

## 📞 Soporte

1. **Revisa el archivo `README.md`** para documentación completa
2. **Consulta con tu asesor fiscal** sobre VeriFactu
3. **Verifica la configuración** en `config.py`

---

## ⚠️ RECORDATORIO IMPORTANTE

**ANTES DE USAR EN PRODUCCIÓN:**
1. ✅ Configura tu NIF real en `config.py`
2. ✅ Verifica los datos de tu empresa
3. ✅ Haz una factura de prueba
4. ✅ Consulta con tu asesor fiscal
5. ✅ Configura backups automáticos

**El sistema genera XML VeriFactu pero NO los envía automáticamente a la AEAT. Consulta con tu asesor sobre el procedimiento de envío.**

