// Global variables
let products = [];
let currentInvoiceItems = [];

// API base URL
const API_BASE = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadInvoices();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Product form
    document.getElementById('product-form').addEventListener('submit', handleAddProduct);
    
    // Generate invoice button
    document.getElementById('generate-invoice').addEventListener('click', handleGenerateInvoice);
}

// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
    
    // Reload data if needed
    if (tabName === 'history') {
        loadInvoices();
    } else if (tabName === 'invoice') {
        loadProductsForInvoice();
    }
}

// Product management
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        
        if (response.ok) {
            products = data;
            renderProducts();
        } else {
            showAlert('Error al cargar productos: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

function renderProducts() {
    const container = document.getElementById('products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay productos registrados</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="type">${product.type === 'service' ? 'Servicio' : 'Producto'}</div>
            <h3>${product.name}</h3>
            <div class="price">${product.price.toFixed(2)}€</div>
            <p>IVA: ${product.iva_rate}%</p>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                Eliminar
            </button>
        </div>
    `).join('');
}

async function handleAddProduct(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        type: document.getElementById('product-type').value,
        iva_rate: parseFloat(document.getElementById('product-iva').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Producto añadido correctamente', 'success');
            document.getElementById('product-form').reset();
            loadProducts();
        } else {
            showAlert('Error al añadir producto: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Producto eliminado correctamente', 'success');
            loadProducts();
        } else {
            showAlert('Error al eliminar producto: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

// Invoice management
function loadProductsForInvoice() {
    const container = document.getElementById('invoice-products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay productos disponibles</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" style="cursor: pointer;" onclick="addToInvoice(${product.id})">
            <div class="type">${product.type === 'service' ? 'Servicio' : 'Producto'}</div>
            <h3>${product.name}</h3>
            <div class="price">${product.price.toFixed(2)}€</div>
            <p>IVA: ${product.iva_rate}%</p>
            <button class="btn" onclick="event.stopPropagation(); addToInvoice(${product.id})">
                Añadir a Factura
            </button>
        </div>
    `).join('');
}

function addToInvoice(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already exists in invoice
    const existingItem = currentInvoiceItems.find(item => item.product_id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentInvoiceItems.push({
            product_id: productId,
            name: product.name,
            price: product.price,
            iva_rate: product.iva_rate,
            quantity: 1
        });
    }
    
    renderInvoiceItems();
    calculateInvoiceTotal();
}

function removeFromInvoice(productId) {
    currentInvoiceItems = currentInvoiceItems.filter(item => item.product_id !== productId);
    renderInvoiceItems();
    calculateInvoiceTotal();
}

function updateQuantity(productId, quantity) {
    const item = currentInvoiceItems.find(item => item.product_id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        renderInvoiceItems();
        calculateInvoiceTotal();
    }
}

function renderInvoiceItems() {
    const container = document.getElementById('invoice-items');
    
    if (currentInvoiceItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Selecciona productos para añadir a la factura</p>';
        document.getElementById('invoice-total').style.display = 'none';
        return;
    }
    
    container.innerHTML = currentInvoiceItems.map(item => `
        <div class="invoice-item">
            <div class="item-info">
                <strong>${item.name}</strong><br>
                <small>${item.price.toFixed(2)}€ (IVA: ${item.iva_rate}%)</small>
            </div>
            <div class="item-controls">
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity(${item.product_id}, this.value)">
                <button class="btn btn-danger" onclick="removeFromInvoice(${item.product_id})">
                    ✕
                </button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('invoice-total').style.display = 'block';
}

function calculateInvoiceTotal() {
    let subtotal = 0;
    let ivaAmount = 0;
    
    currentInvoiceItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        ivaAmount += itemTotal * (item.iva_rate / 100);
    });
    
    const total = subtotal + ivaAmount;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('iva-amount').textContent = ivaAmount.toFixed(2) + '€';
    document.getElementById('total-amount').textContent = total.toFixed(2) + '€';
}

async function handleGenerateInvoice() {
    if (currentInvoiceItems.length === 0) {
        showAlert('Añade al menos un producto a la factura', 'error');
        return;
    }
    
    const invoiceData = {
        items: currentInvoiceItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }))
    };
    
    try {
        const response = await fetch(`${API_BASE}/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Factura generada correctamente', 'success');
            
            // Clear current invoice
            currentInvoiceItems = [];
            renderInvoiceItems();
            
            // Download PDF
            downloadInvoicePDF(data.id);
            
            // Reload invoices list
            loadInvoices();
        } else {
            showAlert('Error al generar factura: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

async function downloadInvoicePDF(invoiceId) {
    try {
        const response = await fetch(`${API_BASE}/invoices/${invoiceId}/pdf`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `factura_${invoiceId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showAlert('Error al descargar el PDF', 'error');
        }
    } catch (error) {
        showAlert('Error al descargar el PDF: ' + error.message, 'error');
    }
}

// Invoice history
async function loadInvoices() {
    try {
        const response = await fetch(`${API_BASE}/invoices`);
        const data = await response.json();
        
        if (response.ok) {
            renderInvoices(data);
        } else {
            showAlert('Error al cargar facturas: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

function renderInvoices(invoices) {
    const container = document.getElementById('invoices-list');
    
    if (invoices.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay facturas registradas</p>';
        return;
    }
    
    container.innerHTML = invoices.map(invoice => `
        <div class="invoice-card">
            <div class="invoice-header">
                <div>
                    <div class="invoice-number">${invoice.invoice_number}</div>
                    <div class="invoice-date">${new Date(invoice.date).toLocaleString('es-ES')}</div>
                </div>
                <div class="invoice-total-amount">${invoice.total.toFixed(2)}€</div>
            </div>
            <div style="margin-top: 15px;">
                <strong>Productos:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                    ${invoice.items.map(item => `
                        <li>${item.name} x${item.quantity} - ${item.total.toFixed(2)}€</li>
                    `).join('')}
                </ul>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn" onclick="downloadInvoicePDF(${invoice.id})">
                    📄 Descargar PDF
                </button>
            </div>
        </div>
    `).join('');
}

// Utility functions
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

