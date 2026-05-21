var PRODUCTS = [
    { id: 1, name: 'NEURAL-VOID OVERSIZE HOODIE', cat: 'tops', price: 85, img: 'https://ae01.alicdn.com/kf/S60746a9386b346b88c3059a4e8d5b638p.jpg' },
    { id: 2, name: 'CYBER-SHELTER TECH CARGOS', cat: 'bottoms', price: 110, img: 'https://ae01.alicdn.com/kf/S18864a9386b346b88c3059a4e8d5b639p.jpg' },
    { id: 3, name: 'GLITCH-CORE GRAPHIC TEE', cat: 'tops', price: 55, img: 'https://ae01.alicdn.com/kf/S20864a9386b346b88c3059a4e8d5b640p.jpg' },
    { id: 4, name: 'STATIC-SHIFT CARGO PANTS', cat: 'bottoms', price: 95, img: 'https://ae01.alicdn.com/kf/S78946a9386b346b88c3059a4e8d5b641p.jpg' },
    { id: 5, name: 'VOID-WALKER TECH VEST', cat: 'tops', price: 75, img: 'https://ae01.alicdn.com/kf/S90864a9386b346b88c3059a4e8d5b642p.jpg' }
];

var cart = [];

function init() {
    renderProducts();
}

function renderProducts() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    var html = '';
    for (var i = 0; i < PRODUCTS.length; i++) {
        var p = PRODUCTS[i];
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

function addToCart(id) {
    var product = PRODUCTS.find(function(p) { return p.id === id; });
    cart.push(product);
    updateCart();
    alert('Added ' + product.name + ' to cart!');
}

function updateCart() {
    var countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
}

window.onload = init;