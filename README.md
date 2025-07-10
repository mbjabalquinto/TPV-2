# TPV Peluquería - Sencillo con Simulación VeriFactu

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-brightgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-blue.svg)](https://www.sqlite.org/index.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sistema de Punto de Venta (TPV) sencillo y local, diseñado para pequeños negocios como peluquerías. La aplicación permite gestionar un catálogo de productos/servicios y generar tickets de venta (facturas simplificadas) que simulan los requisitos de la normativa **VeriFactu** del Ministerio de Hacienda español.

## Características Principales

### ✅ Cumplimiento VeriFactu (Simulado)

- **Encadenamiento de Registros**: Cada factura se "encadena" con la anterior mediante un hash SHA-256, asegurando la inalterabilidad de la cadena de facturación.
- **Código QR Identificativo**: Cada ticket incluye un código QR con los datos de la factura para una supuesta verificación en la sede de la AEAT, cumpliendo con el formato visual de VeriFactu.
- **Numeración Secuencial**: Sistema de numeración de facturas simple, correlativo y sin saltos.
- **Inalterabilidad**: Una vez generada una factura, esta no puede ser modificada ni eliminada, simulando el requisito de integridad de datos.

### 🏪 Gestión de Negocio

- **Gestión de Productos y Servicios**: Interfaz para crear, leer, editar y eliminar (CRUD) los artículos del catálogo.
- **Buscadores Integrados**: Filtros rápidos para encontrar productos en el TPV y en la sección de gestión, así como para buscar facturas en el historial.
- **Creación Rápida de Tickets**: Interfaz de TPV de doble panel para añadir productos al ticket actual de forma ágil.
- **Historial Completo**: Registro de todas las facturas emitidas, con su hash correspondiente.

### 🖥️ Interfaz de Usuario

- **Sencilla y Ligera**: Creada con HTML, CSS y JavaScript puro (Vanilla JS), sin necesidad de frameworks complejos, para máxima velocidad y facilidad de uso.
- **Navegación por Pestañas**: Acceso rápido a las tres áreas principales: TPV, Gestión de Productos e Historial de Facturas.
- **Impresión de Tickets**: Formato de impresión optimizado para impresoras de tickets térmicas estándar (58mm / 80mm).

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite (almacenamiento en un único archivo local `peluqueria.db`)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Criptografía**: Módulo `crypto` de Node.js para hashing SHA-256.
- **Códigos QR**: `qrcode-generator` en el lado del cliente.

## Instalación

### 1. Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada), que incluye `npm` (Node Package Manager).

### 2. Clonar el Repositorio (Opcional)

Si lo subes a GitHub, puedes clonarlo. Si no, simplemente crea los archivos como se indica en esta guía.

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
Use code with caution.
Markdown
3. Instalar Dependencias
En la raíz del proyecto, ejecuta el siguiente comando. Esto descargará todas las librerías necesarias (express, sqlite3, cors) en una carpeta node_modules.
Generated bash
npm install express sqlite3 cors
Use code with caution.
Bash
Uso de la Aplicación
1. Iniciar el Servidor Backend
Abre una terminal en la carpeta del proyecto y ejecuta:
Generated bash
node server.js
Use code with caution.
Bash
Verás un mensaje confirmando que el servidor está funcionando:
Generated code
Conectado a la base de datos SQLite.
Servidor escuchando en http://localhost:3000
Use code with caution.
Importante: Debes mantener esta terminal abierta mientras usas la aplicación.
2. Abrir la Aplicación Frontend
La aplicación no se accede visitando http://localhost:3000. En su lugar, debes abrir el archivo index.html directamente en tu navegador web (Chrome, Firefox, etc.).
Ve a la carpeta del proyecto.
Haz doble clic en index.html.
La interfaz del TPV se cargará y se comunicará automáticamente con el servidor que dejaste corriendo en la terminal.
⚠️ Limitaciones y Advertencia Legal
MUY IMPORTANTE: Este software es un prototipo funcional que SIMULA los requisitos técnicos de un sistema VeriFactu. NO constituye una solución certificada ni autorizada por la Agencia Tributaria (AEAT). Su uso para la facturación real de un negocio sin la debida certificación puede acarrear sanciones. Consulta siempre a un asesor fiscal.
Generated code
---

### Pasos Finales

Una vez que tengas los 5 archivos en tu carpeta `tpv-peluqueria`, solo te queda:

1.  Abrir una terminal en esa carpeta.
2.  Ejecutar el comando para instalar las dependencias: `npm install express sqlite3 cors`
3.  Iniciar el servidor: `node server.js`
4.  Abrir el archivo `index.html` en tu navegador.

¡Y listo! Ya tienes el proyecto completo y funcionando.
```
