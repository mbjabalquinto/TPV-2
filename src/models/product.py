from src.models.user import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'product' or 'service'
    iva_rate = db.Column(db.Float, nullable=False, default=21.0)  # IVA percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'type': self.type,
            'iva_rate': self.iva_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

