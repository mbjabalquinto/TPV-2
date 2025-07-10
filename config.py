# Configuración de la Empresa para VeriFactu
# Modifica estos datos con la información real de tu peluquería

# Datos de la empresa
COMPANY_NAME = "Peluquería Ejemplo"
COMPANY_NIF = "12345678A"  # ⚠️ IMPORTANTE: Cambiar por tu NIF real
COMPANY_ADDRESS = "Calle Ejemplo, 123, 28001 Madrid"
COMPANY_PHONE = "123-456-789"
COMPANY_EMAIL = "info@peluqueriaejemplo.com"

# Configuración de IVA
DEFAULT_IVA_RATE = 21.0  # Porcentaje de IVA por defecto

# Configuración de numeración de facturas
INVOICE_PREFIX = "FAC"  # Prefijo para las facturas

# Configuración del servidor
SERVER_HOST = "0.0.0.0"
SERVER_PORT = 5001
DEBUG_MODE = True  # Cambiar a False en producción

# Configuración de archivos
PDF_DIRECTORY = "src/static/pdfs"
QR_DIRECTORY = "src/static/qr_codes"
DATABASE_PATH = "src/database/app.db"

# Configuración de tickets
TICKET_WIDTH_MM = 80  # Ancho del ticket en milímetros
TICKET_HEIGHT_MM = 200  # Alto del ticket en milímetros

# Mensajes personalizables
TICKET_FOOTER_MESSAGE = "Gracias por su visita"
VERIFACTU_MESSAGE = "Factura verificable según normativa VeriFactu"

# INSTRUCCIONES:
# 1. Modifica COMPANY_NIF con tu NIF real (OBLIGATORIO)
# 2. Actualiza COMPANY_NAME con el nombre de tu peluquería
# 3. Cambia COMPANY_ADDRESS por tu dirección completa
# 4. Actualiza COMPANY_PHONE y COMPANY_EMAIL
# 5. Guarda el archivo y reinicia la aplicación

