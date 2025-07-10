# Changelog - TPV VeriFactu

## Versión 2.0 - Mejoras de Usabilidad (2025-01-07)

### ✅ Nuevas Funcionalidades

#### 1. Visualización de Códigos QR en PDFs
- **Corregido**: Los códigos QR ahora se muestran correctamente en los tickets PDF
- **Mejora**: Integración completa entre generación de QR y PDF
- **Beneficio**: Cumplimiento completo con VeriFactu

#### 2. Edición de Productos y Servicios
- **Nuevo**: Botón "Editar" en cada producto/servicio
- **Nuevo**: Modal de edición con formulario completo
- **Funcionalidad**: Modificar nombre, precio, tipo e IVA
- **Beneficio**: Mayor flexibilidad en la gestión del catálogo

#### 3. Sistema de Búsqueda y Filtros
- **Nuevo**: Buscador en gestión de productos/servicios
- **Nuevo**: Buscador al seleccionar productos para facturas
- **Nuevo**: Buscador en historial de facturas
- **Nuevo**: Filtro por rango de fechas en historial
- **Beneficio**: Navegación rápida y eficiente

#### 4. Mejoras de Interfaz
- **Nuevo**: Scroll vertical en contenedores largos
- **Optimizado**: Tamaño reducido de elementos para mejor presentación
- **Mejorado**: Diseño responsive para móviles y tablets
- **Nuevo**: Botones de acción más compactos y organizados

### 🔧 Mejoras Técnicas

#### Backend
- **Actualizado**: Ruta PUT para edición de productos
- **Mejorado**: Generador de PDF con soporte para QR
- **Corregido**: Integración de códigos QR en tickets

#### Frontend
- **Nuevo**: JavaScript modular con funciones de filtrado
- **Mejorado**: Gestión de estado de la aplicación
- **Nuevo**: Modal de edición con validación
- **Optimizado**: Rendimiento en listas largas

### 📱 Experiencia de Usuario

#### Navegación
- **Mejorado**: Búsqueda en tiempo real
- **Nuevo**: Filtros por fecha en historial
- **Optimizado**: Scroll suave en contenedores
- **Mejorado**: Feedback visual en todas las acciones

#### Gestión de Productos
- **Simplificado**: Proceso de edición en modal
- **Mejorado**: Validación de formularios
- **Nuevo**: Confirmación antes de eliminar
- **Optimizado**: Actualización automática de listas

#### Facturación
- **Mejorado**: Búsqueda rápida de productos
- **Optimizado**: Selección y gestión de cantidades
- **Mejorado**: Cálculos automáticos en tiempo real
- **Nuevo**: Códigos QR visibles en PDFs

### 🛡️ Cumplimiento VeriFactu

#### Documentos
- **Corregido**: Códigos QR en tickets PDF
- **Mantenido**: XML VeriFactu conforme
- **Mantenido**: Numeración única de facturas
- **Mantenido**: Inalterabilidad de registros

### 📋 Archivos Modificados

#### Nuevos Archivos
- `src/static/index_mejorado.html` - Interfaz mejorada
- `src/static/app_mejorado.js` - JavaScript con nuevas funcionalidades
- `CHANGELOG.md` - Este archivo de cambios

#### Archivos Actualizados
- `src/utils/pdf_generator.py` - Soporte para QR en PDFs
- `src/routes/products.py` - Ruta PUT para edición
- `src/main.py` - Configuración para nueva interfaz

### 🚀 Instrucciones de Actualización

1. **Reemplazar archivos**: Los nuevos archivos incluyen todas las mejoras
2. **Reiniciar aplicación**: Usar `iniciar_tpv.sh` o `iniciar_tpv.bat`
3. **Probar funcionalidades**: Verificar edición, búsqueda y PDFs
4. **Configurar datos**: Actualizar `config.py` si es necesario

### 📞 Soporte

- **Documentación**: Ver `README.md` actualizado
- **Instalación**: Ver `INSTALACION_RAPIDA.md`
- **Configuración**: Editar `config.py`

---

## Versión 1.0 - Lanzamiento Inicial (2025-01-07)

### ✅ Funcionalidades Base
- Gestión de productos y servicios
- Generación de facturas simplificadas
- Cumplimiento con VeriFactu
- Generación de PDFs y códigos QR
- Historial de facturas
- Interfaz web responsive

### 🛡️ Cumplimiento VeriFactu
- XML conforme a especificaciones AEAT
- Códigos QR con información requerida
- Numeración única de facturas
- Inalterabilidad de registros
- Datos fiscales completos

