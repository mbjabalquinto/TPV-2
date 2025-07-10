import xml.etree.ElementTree as ET
from datetime import datetime
import qrcode
import os
from io import BytesIO
import base64
import sys

# Añadir el directorio raíz al path para importar config
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
try:
    from config import COMPANY_NIF, COMPANY_NAME
except ImportError:
    # Valores por defecto si no existe config.py
    COMPANY_NIF = "12345678A"
    COMPANY_NAME = "Peluquería Ejemplo"

class VeriFactuGenerator:
    def __init__(self, company_nif=COMPANY_NIF, company_name=COMPANY_NAME):
        self.company_nif = company_nif
        self.company_name = company_name
    
    def generate_xml(self, invoice_data):
        """Generate VeriFactu XML for an invoice"""
        # Create root element
        root = ET.Element("RegistroFacturacion")
        root.set("xmlns", "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/ssii/fact/ws/SuministroInformacion.xsd")
        
        # Cabecera (Header)
        cabecera = ET.SubElement(root, "Cabecera")
        
        # IDVersionSii
        id_version = ET.SubElement(cabecera, "IDVersionSii")
        id_version.text = "1.1"
        
        # Titular (Company info)
        titular = ET.SubElement(cabecera, "Titular")
        nif_titular = ET.SubElement(titular, "NIF")
        nif_titular.text = self.company_nif
        nombre_razon = ET.SubElement(titular, "NombreRazon")
        nombre_razon.text = self.company_name
        
        # TipoSuministro
        tipo_suministro = ET.SubElement(cabecera, "TipoSuministro")
        tipo_suministro.text = "A0"  # Alta de facturas
        
        # RegistroLRFacturasEmitidas
        registro_lr = ET.SubElement(root, "RegistroLRFacturasEmitidas")
        
        # PeriodoImpositivo
        periodo = ET.SubElement(registro_lr, "PeriodoImpositivo")
        ejercicio = ET.SubElement(periodo, "Ejercicio")
        ejercicio.text = str(invoice_data['date'].year)
        periodo_elem = ET.SubElement(periodo, "Periodo")
        periodo_elem.text = f"{invoice_data['date'].month:02d}"
        
        # IDFactura
        id_factura = ET.SubElement(registro_lr, "IDFactura")
        id_emisor = ET.SubElement(id_factura, "IDEmisorFactura")
        nif_emisor = ET.SubElement(id_emisor, "NIF")
        nif_emisor.text = self.company_nif
        
        num_serie = ET.SubElement(id_factura, "NumSerieFacturaEmisor")
        num_serie.text = invoice_data['invoice_number']
        
        fecha_expedicion = ET.SubElement(id_factura, "FechaExpedicionFacturaEmisor")
        fecha_expedicion.text = invoice_data['date'].strftime("%d-%m-%Y")
        
        # FacturaExpedida
        factura_expedida = ET.SubElement(registro_lr, "FacturaExpedida")
        
        # TipoFactura
        tipo_factura = ET.SubElement(factura_expedida, "TipoFactura")
        tipo_factura.text = "F1"  # Factura
        
        # ClaveRegimenEspecialOTrascendencia
        clave_regimen = ET.SubElement(factura_expedida, "ClaveRegimenEspecialOTrascendencia")
        clave_regimen.text = "01"  # Operación de régimen general
        
        # ImporteTotal
        importe_total = ET.SubElement(factura_expedida, "ImporteTotal")
        importe_total.text = f"{invoice_data['total']:.2f}"
        
        # BaseImponible
        base_imponible = ET.SubElement(factura_expedida, "BaseImponible")
        base_imponible.text = f"{invoice_data['subtotal']:.2f}"
        
        # TipoImpositivo
        tipo_impositivo = ET.SubElement(factura_expedida, "TipoImpositivo")
        tipo_impositivo.text = "21.00"  # IVA general
        
        # CuotaRepercutida
        cuota_repercutida = ET.SubElement(factura_expedida, "CuotaRepercutida")
        cuota_repercutida.text = f"{invoice_data['iva_amount']:.2f}"
        
        # Convert to string
        xml_str = ET.tostring(root, encoding='unicode')
        return xml_str
    
    def generate_qr_code(self, xml_data, invoice_number):
        """Generate QR code from VeriFactu XML data"""
        # For simplicity, we'll encode the invoice number and basic data
        # In a real implementation, this should follow VeriFactu QR specifications
        qr_data = f"VERIFACTU:{self.company_nif}:{invoice_number}:{datetime.now().strftime('%Y%m%d')}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to file
        qr_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'qr_codes')
        os.makedirs(qr_dir, exist_ok=True)
        qr_path = os.path.join(qr_dir, f"qr_{invoice_number}.png")
        img.save(qr_path)
        
        return qr_path
    
    def generate_qr_base64(self, xml_data, invoice_number):
        """Generate QR code as base64 string for embedding in PDF"""
        qr_data = f"VERIFACTU:{self.company_nif}:{invoice_number}:{datetime.now().strftime('%Y%m%d')}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return img_str

