from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib import colors
from datetime import datetime
import os
import base64
from io import BytesIO
import sys
from PIL import Image as PILImage

# Añadir el directorio raíz al path para importar config
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
try:
    from config import (COMPANY_NAME, COMPANY_NIF, COMPANY_ADDRESS, COMPANY_PHONE, 
                       TICKET_WIDTH_MM, TICKET_HEIGHT_MM, TICKET_FOOTER_MESSAGE)
except ImportError:
    # Valores por defecto si no existe config.py
    COMPANY_NAME = "Peluquería Ejemplo"
    COMPANY_NIF = "12345678A"
    COMPANY_ADDRESS = "Calle Ejemplo, 123"
    COMPANY_PHONE = "123-456-789"
    TICKET_WIDTH_MM = 80
    TICKET_HEIGHT_MM = 200
    TICKET_FOOTER_MESSAGE = "Gracias por su visita"

class TicketPDFGenerator:
    def __init__(self, company_name=COMPANY_NAME, company_nif=COMPANY_NIF, 
                 company_address=COMPANY_ADDRESS, company_phone=COMPANY_PHONE):
        self.company_name = company_name
        self.company_nif = company_nif
        self.company_address = company_address
        self.company_phone = company_phone
        self.styles = getSampleStyleSheet()
        
        # Custom styles for ticket
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            alignment=TA_CENTER
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=9,
            spaceAfter=3
        )
        
        self.total_style = ParagraphStyle(
            'CustomTotal',
            parent=self.styles['Normal'],
            fontSize=11,
            fontName='Helvetica-Bold',
            spaceAfter=6
        )
    
    def generate_ticket_pdf(self, invoice_data, qr_base64, output_path):
        """Generate a ticket-style PDF for the invoice"""
        # Create PDF document with custom page size (ticket width)
        doc = SimpleDocTemplate(
            output_path,
            pagesize=(80*mm, 200*mm),  # Ticket width x height
            rightMargin=5*mm,
            leftMargin=5*mm,
            topMargin=5*mm,
            bottomMargin=5*mm
        )
        
        story = []
        
        # Company header
        story.append(Paragraph(self.company_name, self.title_style))
        story.append(Paragraph(f"NIF: {self.company_nif}", self.header_style))
        story.append(Paragraph(self.company_address, self.header_style))
        story.append(Paragraph(self.company_phone, self.header_style))
        story.append(Spacer(1, 6*mm))
        
        # Invoice info
        story.append(Paragraph("FACTURA SIMPLIFICADA", self.title_style))
        story.append(Paragraph(f"Nº: {invoice_data['invoice_number']}", self.normal_style))
        story.append(Paragraph(f"Fecha: {invoice_data['date'].strftime('%d/%m/%Y %H:%M')}", self.normal_style))
        story.append(Spacer(1, 4*mm))
        
        # Items table
        items_data = [['Concepto', 'Cant.', 'Precio', 'Total']]
        for item in invoice_data['items']:
            items_data.append([
                item['name'][:15] + '...' if len(item['name']) > 15 else item['name'],
                str(item['quantity']),
                f"{item['price']:.2f}€",
                f"{item['total']:.2f}€"
            ])
        
        items_table = Table(items_data, colWidths=[30*mm, 10*mm, 15*mm, 15*mm])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(items_table)
        story.append(Spacer(1, 4*mm))
        
        # Totals
        totals_data = [
            ['Subtotal:', f"{invoice_data['subtotal']:.2f}€"],
            ['IVA (21%):', f"{invoice_data['iva_amount']:.2f}€"],
            ['TOTAL:', f"{invoice_data['total']:.2f}€"]
        ]
        
        totals_table = Table(totals_data, colWidths=[40*mm, 30*mm])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        
        story.append(totals_table)
        story.append(Spacer(1, 6*mm))
        
        # VeriFactu info
        story.append(Paragraph("VERI*FACTU", self.title_style))
        story.append(Paragraph("Factura verificable", self.header_style))
        story.append(Spacer(1, 3*mm))
        
        # QR Code placeholder (simplified for now)
        story.append(Paragraph("Código QR VeriFactu", self.header_style))
        
        # QR Code
        if qr_base64:
            try:
                # Decode base64 QR code
                qr_data = base64.b64decode(qr_base64)
                qr_image = PILImage.open(BytesIO(qr_data))
                
                # Save temporarily
                temp_qr_path = f"/tmp/temp_qr_{invoice_data['invoice_number']}.png"
                qr_image.save(temp_qr_path)
                
                # Add to PDF
                qr_img = Image(temp_qr_path, width=30*mm, height=30*mm)
                story.append(qr_img)
                
                # Clean up temp file
                os.remove(temp_qr_path)
            except Exception as e:
                story.append(Paragraph(f"Error al generar QR: {str(e)}", self.normal_style))
        else:
            # Fallback text if no QR available
            story.append(Paragraph(f"NIF: {self.company_nif}", self.normal_style))
            story.append(Paragraph(f"Factura: {invoice_data['invoice_number']}", self.normal_style))
            story.append(Paragraph(f"Fecha: {invoice_data['date'].strftime('%Y%m%d')}", self.normal_style))
        
        story.append(Spacer(1, 3*mm))
        story.append(Paragraph(TICKET_FOOTER_MESSAGE, self.header_style))
        
        # Build PDF
        doc.build(story)
        return output_path

