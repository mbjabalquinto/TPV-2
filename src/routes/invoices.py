from flask import Blueprint, request, jsonify, send_file
from src.models.invoice import Invoice
from src.models.product import Product
from src.models.user import db
from src.utils.verifactu import VeriFactuGenerator
from src.utils.pdf_generator import TicketPDFGenerator
from datetime import datetime
import os

invoices_bp = Blueprint('invoices', __name__)

@invoices_bp.route('/invoices', methods=['GET'])
def get_invoices():
    """Get all invoices"""
    try:
        invoices = Invoice.query.order_by(Invoice.created_at.desc()).all()
        return jsonify([invoice.to_dict() for invoice in invoices])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@invoices_bp.route('/invoices', methods=['POST'])
def create_invoice():
    """Create a new invoice"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('items') or not isinstance(data['items'], list):
            return jsonify({'error': 'Items list is required'}), 400
        
        # Calculate totals
        subtotal = 0
        iva_amount = 0
        invoice_items = []
        
        for item_data in data['items']:
            product = Product.query.get(item_data['product_id'])
            if not product:
                return jsonify({'error': f'Product with ID {item_data["product_id"]} not found'}), 404
            
            quantity = int(item_data['quantity'])
            item_total = product.price * quantity
            item_iva = item_total * (product.iva_rate / 100)
            
            invoice_items.append({
                'product_id': product.id,
                'name': product.name,
                'price': product.price,
                'quantity': quantity,
                'iva_rate': product.iva_rate,
                'total': item_total
            })
            
            subtotal += item_total
            iva_amount += item_iva
        
        total = subtotal + iva_amount
        
        # Generate invoice number
        invoice_count = Invoice.query.count() + 1
        invoice_number = f"FAC-{datetime.now().strftime('%Y%m%d')}-{invoice_count:04d}"
        
        # Create invoice
        invoice = Invoice(
            invoice_number=invoice_number,
            date=datetime.now(),
            subtotal=subtotal,
            iva_amount=iva_amount,
            total=total
        )
        invoice.set_items(invoice_items)
        
        # Generate VeriFactu XML
        verifactu_gen = VeriFactuGenerator()
        xml_data = verifactu_gen.generate_xml({
            'invoice_number': invoice_number,
            'date': invoice.date,
            'subtotal': subtotal,
            'iva_amount': iva_amount,
            'total': total,
            'items': invoice_items
        })
        invoice.verifactu_xml = xml_data
        
        # Generate QR code
        qr_path = verifactu_gen.generate_qr_code(xml_data, invoice_number)
        invoice.qr_code_path = qr_path
        
        # Save invoice to database
        db.session.add(invoice)
        db.session.commit()
        
        return jsonify(invoice.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@invoices_bp.route('/invoices/<int:invoice_id>/pdf', methods=['GET'])
def generate_invoice_pdf(invoice_id):
    """Generate and download PDF for an invoice"""
    try:
        invoice = Invoice.query.get_or_404(invoice_id)
        
        # Generate QR code as base64
        verifactu_gen = VeriFactuGenerator()
        qr_base64 = verifactu_gen.generate_qr_base64(invoice.verifactu_xml, invoice.invoice_number)
        
        # Generate PDF
        pdf_generator = TicketPDFGenerator()
        pdf_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'pdfs')
        os.makedirs(pdf_dir, exist_ok=True)
        pdf_path = os.path.join(pdf_dir, f"ticket_{invoice.invoice_number}.pdf")
        
        pdf_generator.generate_ticket_pdf({
            'invoice_number': invoice.invoice_number,
            'date': invoice.date,
            'items': invoice.get_items(),
            'subtotal': invoice.subtotal,
            'iva_amount': invoice.iva_amount,
            'total': invoice.total
        }, qr_base64, pdf_path)
        
        # Update invoice with PDF path
        invoice.pdf_path = pdf_path
        db.session.commit()
        
        return send_file(pdf_path, as_attachment=True, download_name=f"ticket_{invoice.invoice_number}.pdf")
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@invoices_bp.route('/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    """Get a specific invoice"""
    try:
        invoice = Invoice.query.get_or_404(invoice_id)
        return jsonify(invoice.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

