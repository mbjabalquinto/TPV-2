// Global variables
let products = [];
let currentInvoice = [];
let invoiceHistory = [];
let editingProductId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadInvoiceHistory();
});

// Tab management
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Refresh data when switching tabs
    if (tabName === 'products') {
        loadProducts();
    } else if (tabName === 'invoice') {
        loadInvoiceProducts();
    } else if (tabName === 'history') {
        loadInvoiceHistory();
    }
}

// Product management
async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        if (response.ok) {
            products = await response.json();
            displayProducts();
        } else {
            showAlert('Error al cargar productos', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay productos registrados</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-name="${product.name.toLowerCase()}" data-type="${product.type}">
            <div class="product-header">
                <div>
                    <div class="product-type ${product.type}">${product.type === 'service' ? 'Servicio' : 'Producto'}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${product.price.toFixed(2)}€</div>
                    <div class="product-iva">IVA: ${product.iva_rate}%</div>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-warning btn-small" onclick="editProduct(${product.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const productCards = document.querySelectorAll('#productsContainer .product-card');
    
    productCards.forEach(card => {
        const name = card.getAttribute('data-name');
        const type = card.getAttribute('data-type');
        const typeText = type === 'service' ? 'servicio' : 'producto';
        
        if (name.includes(searchTerm) || typeText.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const type = document.getElementById('productType').value;
    const ivaRate = parseFloat(document.getElementById('productIva').value);
    
    if (!name || !price || price <= 0) {
        showAlert('Por favor, completa todos los campos correctamente', 'error');
        return;
    }
    
    try {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                price: price,
                type: type,
                iva_rate: ivaRate
            })
        });
        
        if (response.ok) {
            showAlert('Producto añadido correctamente', 'success');
            clearProductForm();
            loadProducts();
        } else {
            const error = await response.json();
            showAlert('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductType').value = product.type;
    document.getElementById('editProductIva').value = product.iva_rate;
    
    document.getElementById('editModal').style.display = 'block';
}

async function saveProductEdit() {
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const type = document.getElementById('editProductType').value;
    const ivaRate = parseFloat(document.getElementById('editProductIva').value);
    
    if (!name || !price || price <= 0) {
        showAlert('Por favor, completa todos los campos correctamente', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${editingProductId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                price: price,
                type: type,
                iva_rate: ivaRate
            })
        });
        
        if (response.ok) {
            showAlert('Producto actualizado correctamente', 'success');
            closeEditModal();
            loadProducts();
            loadInvoiceProducts(); // Refresh invoice products if needed
        } else {
            const error = await response.json();
            showAlert('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingProductId = null;
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: "DELETE"
        });
        
        if (response.ok) {
            showAlert('Producto eliminado correctamente', 'success');
            loadProducts();
            loadInvoiceProducts(); // Refresh invoice products
        } else {
            const error = await response.json();
            showAlert('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

function clearProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productType').value = 'service';
    document.getElementById('productIva').value = '21';
}

// Invoice management
async function loadInvoiceProducts() {
    try {
        const response = await fetch("/api/products");
        if (response.ok) {
            products = await response.json();
            displayInvoiceProducts();
        }
    } catch (error) {
        showAlert('Error al cargar productos: ' + error.message, 'error');
    }
}

function displayInvoiceProducts() {
    const container = document.getElementById('invoiceProductsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay productos disponibles</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-name="${product.name.toLowerCase()}" data-type="${product.type}">
            <div class="product-type ${product.type}">${product.type === 'service' ? 'Servicio' : 'Producto'}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toFixed(2)}€</div>
            <div class="product-iva">IVA: ${product.iva_rate}%</div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="addToInvoice(${product.id})">
                    ➕ Añadir
                </button>
            </div>
        </div>
    `).join('');
}

function filterInvoiceProducts() {
    const searchTerm = document.getElementById('invoiceProductSearch').value.toLowerCase();
    const productCards = document.querySelectorAll('#invoiceProductsContainer .product-card');
    
    productCards.forEach(card => {
        const name = card.getAttribute('data-name');
        const type = card.getAttribute('data-type');
        const typeText = type === 'service' ? 'servicio' : 'producto';
        
        if (name.includes(searchTerm) || typeText.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function addToInvoice(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = currentInvoice.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentInvoice.push({
            id: product.id,
            name: product.name,
            price: product.price,
            iva_rate: product.iva_rate,
            quantity: 1
        });
    }
    
    updateInvoiceDisplay();
}

function removeFromInvoice(productId) {
    currentInvoice = currentInvoice.filter(item => item.id !== productId);
    updateInvoiceDisplay();
}

function updateQuantity(productId, quantity) {
    const item = currentInvoice.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        updateInvoiceDisplay();
    }
}

function updateInvoiceDisplay() {
    const container = document.getElementById('currentInvoiceItems');
    const totalsContainer = document.getElementById('invoiceTotals');
    
    if (currentInvoice.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Selecciona productos para añadir a la factura</p>';
        totalsContainer.style.display = 'none';
        return;
    }
    
    container.innerHTML = currentInvoice.map(item => `
        <div class="invoice-item">
            <div class="invoice-item-info">
                <div class="invoice-item-name">${item.name}</div>
                <div class="invoice-item-price">${item.price.toFixed(2)}€ (IVA: ${item.iva_rate}%)</div>
            </div>
            <div class="invoice-item-quantity">
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       min="1" onchange="updateQuantity(${item.id}, this.value)">
            </div>
            <button class="btn btn-danger btn-small" onclick="removeFromInvoice(${item.id})">
                ❌
            </button>
        </div>
    `).join('');
    
    // Calculate totals
    let subtotal = 0;
    let totalIva = 0;
    
    currentInvoice.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        const itemIva = itemSubtotal * (item.iva_rate / 100);
        subtotal += itemSubtotal;
        totalIva += itemIva;
    });
    
    const total = subtotal + totalIva;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + '€';
    document.getElementById('ivaAmount').textContent = totalIva.toFixed(2) + '€';
    document.getElementById('totalAmount').textContent = total.toFixed(2) + '€';
    
    totalsContainer.style.display = 'block';
}

    try {
        const response = await fetch("/api/invoices", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: currentInvoice.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('Factura generada correctamente: ' + result.invoice_number, 'success');
            currentInvoice = [];
            updateInvoiceDisplay();
            loadInvoiceHistory();
        } else {
            const error = await response.json();
            showAlert('Error: ' + error.error, 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

// Invoice history management
async function loadInvoiceHistory() {
    try {
        const response = await fetch("/api/invoices");
        if (response.ok) {
            invoiceHistory = await response.json();
            displayInvoiceHistory();
        }
    } catch (error) {
        showAlert('Error al cargar historial: ' + error.message, 'error');
    }
}

function displayInvoiceHistory() {
    const container = document.getElementById('historyContainer');
    
    if (invoiceHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay facturas registradas</p>';
        return;
    }
    
    container.innerHTML = invoiceHistory.map(invoice => `
        <div class="invoice-history-item" data-number="${invoice.invoice_number.toLowerCase()}" data-date="${invoice.date}">
            <div class="invoice-header">
                <div class="invoice-number">${invoice.invoice_number}</div>
                <div class="invoice-total">${invoice.total_amount.toFixed(2)}€</div>
            </div>
            <div class="invoice-date">Fecha: ${new Date(invoice.date).toLocaleDateString('es-ES')}</div>
            <div class="invoice-products-list">
                <strong>Productos/Servicios:</strong>
                <ul>
                    ${invoice.items.map(item => `
                        <li>${item.product_name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€</li>
                    `).join('')}
                </ul>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn btn-primary btn-small" onclick="downloadInvoicePDF('${invoice.invoice_number}')">
                    📄 Descargar PDF
                </button>
            </div>
        </div>
    `).join('');
}

function filterHistory() {
    const searchTerm = document.getElementById('historySearch').value.toLowerCase();
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const invoiceItems = document.querySelectorAll('#historyContainer .invoice-history-item');
    
    invoiceItems.forEach(item => {
        const number = item.getAttribute('data-number');
        const date = item.getAttribute('data-date');
        
        let showItem = true;
        
        // Filter by search term
        if (searchTerm && !number.includes(searchTerm)) {
            showItem = false;
        }
        
        // Filter by date range
        if (dateFrom && date < dateFrom) {
            showItem = false;
        }
        
        if (dateTo && date > dateTo) {
            showItem = false;
        }
        
        item.style.display = showItem ? 'block' : 'none';
    });
}

async function downloadInvoicePDF(invoiceNumber) {
    try {
        const response = await fetch(`/invoices/${invoiceNumber}/pdf`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `ticket_${invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showAlert('Error al descargar el PDF', 'error');
        }
    } catch (error) {
        showAlert('Error de conexión: ' + error.message, 'error');
    }
}

// Utility functions
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert at the top of the active tab content
    const activeTab = document.querySelector('.tab-content.active');
    activeTab.insertBefore(alertDiv, activeTab.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Modal event handlers
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditModal();
    }
});

