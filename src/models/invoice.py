from src.models.user import db
from datetime import datetime
import json

class Invoice(db.Model):
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), nullable=False, unique=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.Column(db.Text, nullable=False)  # JSON string with invoice items
    subtotal = db.Column(db.Float, nullable=False)
    iva_amount = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    verifactu_xml = db.Column(db.Text)  # VeriFactu XML data
    qr_code_path = db.Column(db.String(255))  # Path to QR code image
    pdf_path = db.Column(db.String(255))  # Path to PDF ticket
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_items(self):
        """Parse items JSON string to Python object"""
        return json.loads(self.items) if self.items else []
    
    def set_items(self, items_list):
        """Convert items list to JSON string"""
        self.items = json.dumps(items_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'invoice_number': self.invoice_number,
            'date': self.date.isoformat() if self.date else None,
            'items': self.get_items(),
            'subtotal': self.subtotal,
            'iva_amount': self.iva_amount,
            'total': self.total,
            'qr_code_path': self.qr_code_path,
            'pdf_path': self.pdf_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

