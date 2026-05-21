const PRODUCTS = [
    { id: 1, name: 'VOID TEE', cat: 'tops', price: 45, emoji: '👕', desc: 'Oversized heavy cotton, minimal drop shoulder. Shipping: 7-14 days.' },
    { id: 2, name: 'PHANTOM CARGO', cat: 'bottoms', price: 85, emoji: '👖', desc: 'Technical fabric with multi-pocket utility. Shipping: 7-14 days.' },
    { id: 3, name: 'NEON BEANIE', cat: 'acc', price: 25, emoji: '🧶', desc: 'Acid green contrast knit. Shipping: 5-10 days.' },
    { id: 4, name: 'GHOST HOODIE', cat: 'tops', price: 110, emoji: '🧥', desc: 'Double-layered fleece, heavy weight. Shipping: 7-14 days.' },
    { id: 5, name: 'CYBER RUNNERS', cat: 'acc', price: 160, emoji: '👟', desc: 'Futuristic silhouette, high-grip sole. Shipping: 10-20 days.' },
    { id: 6, name: 'SKELETON BELT', cat: 'acc', price: 30, emoji: '🎗️', desc: 'Industrial nylon with steel buckle. Shipping: 5-10 days.' },
];

let cart = JSON.parse(localStorage.getItem('magical_cart')) || [];

function init() {
    renderProducts('all');
    updateCartUI();
    startDropTimer();
    initCursor();
    setTimeout(openModal, 3000);
}

function renderProducts(filter) {
    const grid = document.getElementById('product-grid');
    const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
    
    grid.innerHTML = filtered.map(p => 
        <div class="product-card">
            <div class="product-img"></div>
            <div class="product-card-details">
                <div class="product-cat"></div>
                <div class="product-name"></div>
                <div class="product-price">£</div>
                <button class="add-to-cart-btn" onclick="addToCart()">ADD TO CART</button>
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
    showToast(Added  to cart!);
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
                <div class="cart-item-img"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name"></div>
                    <div class="cart-item-price">£</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart()">✕</button>
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

function startDropTimer() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('drop-timer').textContent = ${days}d : h : m : s;
    }, 1000);
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