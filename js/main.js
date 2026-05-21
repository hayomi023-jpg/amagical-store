const PRODUCTS = [
    { 
        id: 1, 
        name: 'NEURAL-VOID OVERSIZE HOODIE', 
        cat: 'tops', 
        price: 85, 
        img: 'https://ae01.alicdn.com/kf/S60746a9386b346b88c3059a4e8d5b638p.jpg', 
        desc: 'A study in urban decay and digital silence. Heavyweight construction with a silhouette that defies convention. Shipping: 7-14 days.' 
    },
    { 
        id: 2, 
        name: 'CYBER-SHELTER TECH CARGOS', 
        cat: 'bottoms', 
        price: 110, 
        img: 'https://ae01.alicdn.com/kf/S18864a9386b346b88c3059a4e8d5b639p.jpg', 
        desc: 'Engineered for the urban jungle. High-utility multi-pocket system with a tapered tactical fit. Shipping: 7-14 days.' 
    },
    { 
        id: 3, 
        name: 'GLITCH-CORE GRAPHIC TEE', 
        cat: 'tops', 
        price: 55, 
        img: 'https://ae01.alicdn.com/kf/S20864a9386b346b88c3059a4e8d5b640p.jpg', 
        desc: 'High-density print on premium heavy cotton. A visual manifestation of digital error. Shipping: 7-14 days.' 
    },
    { 
        id: 4, 
        name: 'STATIC-SHIFT CARGO PANTS', 
        cat: 'bottoms', 
        price: 95, 
        img: 'https://ae01.alicdn.com/kf/S78946a9386b346b88c3059a4e8d5b641p.jpg', 
        desc: 'Refined tactical geometry. Water-resistant shell with adjustable hems for a variable silhouette. Shipping: 7-14 days.' 
    },
    { 
        id: 5, 
        name: 'VOID-WALKER TECH VEST', 
        cat: 'tops', 
        price: 75, 
        img: 'https://ae01.alicdn.com/kf/S90864a9386b346b88c3059a4e8d5b642p.jpg', 
        desc: 'The ultimate layer for urban exploration. Lightweight mesh and strategic utility webbing. Shipping: 7-14 days.' 
    }
];

let cart = JSON.parse(localStorage.getItem('magical_cart')) || [];

function init() {
    renderProducts('all');
    updateCartUI();
    initCursor();
    setTimeout(openModal, 3000);
}

function renderProducts(filter) {
    const grid = document.getElementById('product-grid');
    const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
    
    grid.innerHTML = filtered.map(p => 
        <div class="product-card">
            <div class="product-img" style="background-image: url('\'); background-size: cover; background-position: center; font-size: 0;"></div>
            <div class="product-card-details">
                <div class="product-cat">\</div>
                <div class="product-name">\</div>
                <div class="product-price">£\</div>
                <button class="add-to-cart-btn" onclick="addToCart(\)">ADD TO CART</button>
            </div>
        </div>
    ).join('');
}

function applyFilters(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === filter || (filter === 'all' && btn.textContent === 'All'));
    });
    renderProducts(filter);
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    cart.push(product);
    saveCart();
    updateCartUI();
    showToast(\Added \ to cart!\);
}

function removeFromCart(id) {
    const index = cart.findIndex(p => p.id === id);
    if (index > -1) cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('magical_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = cart.length;
    document.getElementById('cartCount').textContent = count;
    
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 2rem; color:var(--muted); font-family:Barlow Condensed; text-transform:uppercase;">Your cart is empty</div>';
    } else {
        container.innerHTML = cart.map((item, idx) => 
            <div class="cart-item">
                <div class="cart-item-img" style="background-image: url('\'); background-size: cover; background-position: center;"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">\</div>
                    <div class="cart-item-price">£\</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(\)">✕</button>
            </div>
        ).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').textContent = '£' + total;
}

async function checkout() {
    showToast('Generating secure session...');
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Session failed');
        }
    } catch (err) {
        showToast('Checkout error: ' + err.message);
        console.error(err);
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
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(4)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });
}

function openModal() {
    document.getElementById('dropModal').classList.add('open');
}

function closeModal() {
    document.getElementById('dropModal').classList.remove('open');
}

function submitDrop() {
    const email = document.getElementById('dropEmail').value;
    if(!email) return showToast('Please enter a valid email');
    showToast('Access Granted. Watch your inbox.');
    closeModal();
}

window.onload = init;