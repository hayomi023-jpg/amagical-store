const PRODUCTS = [
    { id: 1, name: 'NEURAL-VOID OVERSIZE HOODIE', cat: 'tops', price: 85, img: 'https://ae01.alicdn.com/kf/S60746a9386b346b88c3059a4e8d5b638p.jpg' },
    { id: 2, name: 'CYBER-SHELTER TECH CARGOS', cat: 'bottoms', price: 110, img: 'https://ae01.alicdn.com/kf/S18864a9386b346b88c3059a4e8d5b639p.jpg' },
    { id: 3, name: 'GLITCH-CORE GRAPHIC TEE', cat: 'tops', price: 55, img: 'https://ae01.alicdn.com/kf/S20864a9386b346b88c3059a4e8d5b640p.jpg' },
    { id: 4, name: 'STATIC-SHIFT CARGO PANTS', cat: 'bottoms', price: 95, img: 'https://ae01.alicdn.com/kf/S78946a9386b346b88c3059a4e8d5b641p.jpg' },
    { id: 5, name: 'VOID-WALKER TECH VEST', cat: 'tops', price: 75, img: 'https://ae01.alicdn.com/kf/S90864a9386b346b88c305yee4e8d5b642p.jpg' }
];
let cart = [];
function init() { renderProducts(); }
function renderProducts() { 
    const grid = document.getElementById('product-grid');
    grid.innerHTML = PRODUCTS.map(p => 
        <div class='product-card'>
            <div class='product-img' style='background-image: url(\\\); background-size: cover;'></div>
            <div class='product-card-details'>
                <div class='product-name'>\</div>
                <div class='product-price'>£\</div>
                <button class='add-to-cart-btn' onclick='addToCart(\)'>ADD</button>
            </div>
        </div>
    ).join(''); 
}
function addToCart(id) { 
    const p = PRODUCTS.find(x => x.id === id); 
    cart.push(p); 
    alert('Added ' + p.name);
    updateCart();
}
function updateCart() {
    document.getElementById('cartCount').innerText = cart.length;
}
window.onload = init;

