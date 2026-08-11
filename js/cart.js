function getCart() {
    return JSON.parse(localStorage.getItem('coffeehouse-cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('coffeehouse-cart', JSON.stringify(cart));
}

function addToCart(productId) {

    const cart = getCart();

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {

        const product = products.find(item => item.id === productId);

        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();

    alert('Added to cart!');
}

function updateCartCount() {

    const cart = getCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll('.cart-link').forEach(link => {
        link.textContent = `Cart (${totalItems})`;
    });
}

updateCartCount();

function changeQuantity(productId, amount) {

    const cart = getCart();

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        const index = cart.findIndex(item => item.id === productId);
        cart.splice(index, 1);
    }

    saveCart(cart);
    updateCartCount();
    renderCart();
}

function removeItem(productId) {

    let cart = getCart();

    cart = cart.filter(item => item.id !== productId);

    saveCart(cart);
    updateCartCount();
    renderCart();
}

function renderCart() {

    const container = document.getElementById('cart-container');

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Browse our menu and add your favorite drinks.</p>
                <a href="menu.html" class="btn">Go to Menu</a>
            </div>
        `;

        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    container.innerHTML = `
        <div class="cart-list">

            ${cart.map(item => `
                <div class="cart-item">

                    <img
                        src="${item.image}"
                        class="cart-image"
                        alt="${item.name}"
                    >

                    <div class="cart-info">
                        <h3>${item.name}</h3>
                        <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>

                    <div class="cart-actions">

                        <button onclick="changeQuantity(${item.id}, -1)">-</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">+</button>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeItem(${item.id})"
                    >
                        Remove
                    </button>

                </div>
            `).join('')}

            <div class="cart-total">

                <h3>
                    Total:
                    Rp ${total.toLocaleString('id-ID')}
                </h3>

                <a href="checkout.html" class="btn">
                    Proceed to Checkout
                </a>

            </div>

        </div>
    `;
}

renderCart();