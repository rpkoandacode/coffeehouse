function getCart() {
    return JSON.parse(localStorage.getItem('coffeehouse-cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('coffeehouse-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll('.cart-link').forEach(link => {
        link.textContent = `Cart (${totalItems})`;
    });
}

function generateCartItemId(productId, options) {
    return `${productId}-${options.temperature}-${options.sugar}-${options.ice}-${options.milk || 'none'}`;
}

function addToCart(productId, options = {}) {

    const cart = getCart();
    const product = products.find(item => item.id === productId);

    const cartItemId = generateCartItemId(productId, options);

    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            temperature: options.temperature,
            sugar: options.sugar,
            ice: options.ice,
            milk: options.milk
        });

    }

    saveCart(cart);
    updateCartCount();
    renderCart();
}

function changeQuantity(cartItemId, amount) {

    const cart = getCart();

    const item = cart.find(item => item.cartItemId === cartItemId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        const index = cart.findIndex(item => item.cartItemId === cartItemId);
        cart.splice(index, 1);
    }

    saveCart(cart);
    updateCartCount();
    renderCart();
}

function removeItem(cartItemId) {

    let cart = getCart();

    cart = cart.filter(item => item.cartItemId !== cartItemId);

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

    const subtotal = cart.reduce(
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

                        <div class="cart-details">

                            <p>
                                <strong>Temperature:</strong>
                                ${item.temperature}
                            </p>

                            <p>
                                <strong>Sugar:</strong>
                                ${item.sugar}
                            </p>

                            <p>
                                <strong>Ice:</strong>
                                ${item.ice}
                            </p>

                            ${item.milk ? `
                                <p>
                                    <strong>Milk:</strong>
                                    ${item.milk}
                                </p>
                            ` : ''}

                        </div>

                        <p class="cart-price">
                            Rp ${item.price.toLocaleString('id-ID')}
                        </p>

                    </div>

                    <div class="cart-actions">

                        <button onclick="changeQuantity('${item.cartItemId}', -1)">-</button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity('${item.cartItemId}', 1)">+</button>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeItem('${item.cartItemId}')"
                    >
                        Remove
                    </button>

                </div>
            `).join('')}

            <div class="cart-total">

                <div>
                    <p>Subtotal</p>
                    <h3>
                        Rp ${subtotal.toLocaleString('id-ID')}
                    </h3>
                </div>

                <a href="checkout.html" class="btn">
                    Proceed to Checkout
                </a>

            </div>

        </div>
    `;
}

updateCartCount();
renderCart();