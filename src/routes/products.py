from flask import Blueprint, request, jsonify
from src.models.product import Product
from src.models.user import db

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products and services"""
    try:
        products = Product.query.all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products', methods=['POST'])
def create_product():
    """Create a new product or service"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('price') or not data.get('type'):
            return jsonify({'error': 'Name, price, and type are required'}), 400
        
        if data['type'] not in ['product', 'service']:
            return jsonify({'error': 'Type must be either "product" or "service"'}), 400
        
        product = Product(
            name=data['name'],
            price=float(data['price']),
            type=data['type'],
            iva_rate=float(data.get('iva_rate', 21.0))
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update an existing product or service"""
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        if 'name' in data:
            product.name = data['name']
        if 'price' in data:
            product.price = float(data['price'])
        if 'type' in data:
            if data['type'] not in ['product', 'service']:
                return jsonify({'error': 'Type must be either "product" or "service"'}), 400
            product.type = data['type']
        if 'iva_rate' in data:
            product.iva_rate = float(data['iva_rate'])
        
        db.session.commit()
        return jsonify(product.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product or service"""
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

