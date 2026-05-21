var PRODUCTS = [
    { id: 1, name: 'NEURAL-VOID OVERSIZE HOODIE', cat: 'tops', price: 85, img: 'https://ae01.alicdn.com/kf/S60746a9386b346b88c3059a4e8d5b638p.jpg', desc: 'A study in urban decay and digital silence. Shipping: 7-14 days.' },
    { id: 2, name: 'CYBER-SHELTER TECH CARGOS', cat: 'bottoms', price: 110, img: 'https://ae01.alicdn.com/kf/S18864a9386b346b88c3059a4e8d5b639p.jpg', desc: 'Engineered for the urban jungle. Shipping: 7-14 days.' },
    { id: 3, name: 'GLITCH-CORE GRAPHIC TEE', cat: 'tops', price: 55, img: 'https://ae01.alicdn.com/kf/S20864a9386b346b88c3059a4e8d5b640p.jpg', desc: 'High-density print on premium cotton. Shipping: 7-14 days.' },
    { id: 4, name: 'STATIC-SHIFT CARGO PANTS', cat: 'bottoms', price: 95, img: 'https://ae01.alicdn.com/kf/S78946a9386b346b88c3059a4e8d5b641p.jpg', desc: 'Refined tactical geometry. Shipping: 7-14 days.' },
    { id: 5, name: 'VOID-WALKER TECH VEST', cat: 'tops', price: 75, img: 'https://ae01.alicdn.com/kf/S90864a9386b346b88c3059a4e8d5b642p.jpg', desc: 'The ultimate layer for urban exploration. Shipping: 7-14 days.' }
];

var cart = JSON.parse(localStorage.getItem('magical_cart')) || [];

function init() {
    renderProducts('all');
    updateCartUI();
    initCursor();
    setTimeout(openModal, 3000);
}

function renderProducts(filter) {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    var filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(function(p) { return p.cat === filter; });
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var p = filtered[i];
        html += '<div class="product-card">';
        html += '<div class="product-img" style="background-image: url(' + p.img + '); background-size: cover; background-position: center; font-size: 0;"></div>';
        html += '<div class="product-card-details">';
        html += '<div class="product-cat">' + p.cat + '</div>';
        html += '<div class="product-name">' + p.name + '</div>';
        html += '<div class="product-price">£' + p.price + '</div>';
        html += '<button class="add-to-cart-btn" onclick="addToCart(' + p.id + ')">ADD TO CART</button>';
        html += '</div></div>';
    }
    grid.innerHTML = html;
}

function applyFilters(filter) {
    var btns = document.querySelectorAll('.filter-btn');
    for(var i=0; i<btns.length; i++) {
        btns[i].classList.toggle('active', btns[i].textContent.toLowerCase() === filter || (filter === 'all' && btns[i].textContent === 'All'));
    }
    renderProducts(filter);
}

function addToCart(id) {
    var product = PRODUCTS.find(function(p) { return p.id === id; });
    cart.push(product);
    saveCart();
    updateCartUI();
    showToast('Added ' + product.name + ' to cart!');
}

function removeFromCart(id) {
    var index = cart.findIndex(function(p) { return p.id === id; });
    if (index > -1) cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('magical_cart', JSON.stringify(cart));
}

function updateCartUI() {
    var countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
    
    var container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 2rem; color:var(--muted); font-family:Barlow Condensed; text-transform:uppercase;">Your cart is empty</div>';
    } else {
        var html = '';
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            html += '<div class="cart-item">';
            html += '<div class="cart-item-img" style="background-image: url(' + item.img + '); background-size: cover; background-position: center;"></div>';
            html += '<div class="cart-item-details">';
            html += '<div class="cart-item-name">' + item.name + '</div>';
            html += '<div class="cart-item-price">£' + item.price + '</div>';
            html += '</div>';
            html += '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">✕</button>';
            html += '</div>';
        }
        container.innerHTML = html;
    }

    var total = 0;
    for(var i=0; i<cart.length; i++) { total += cart[i].price; }
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.innerText = '£' + total;
}

async function checkout() {
    showToast('Generating secure session...');
    try {
        var response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        var data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Session failed');
        }
    } catch (err) {
        showToast('Checkout error: ' + err.message);
    }
}

function openCart() {
    document.getElementById('cartPanel').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
}

function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 3000);
}

function initCursor() {
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    window.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    var targets = document.querySelectorAll('a, button');
    for(var i=0; i<targets.length; i++) {
        targets[i].addEventListener('mouseenter', function() { cursor.style.transform = 'scale(4)'; });
        targets[i].addEventListener('mouseleave', function() { cursor.style.transform = 'scale(1)'; });
    }
}

function openModal() {
    var modal = document.getElementById('dropModal');
    if (modal) modal.classList.add('open');
}

function closeModal() {
    var modal = document.getElementById('dropModal');
    if (modal) modal.classList.remove('open');
}

function submitDrop() {
    var email = document.getElementById('dropEmail').value;
    if(!email) return showToast('Please enter a valid email');
    showToast('Access Granted. Watch your inbox.');
    closeModal();
}

window.onload = init;