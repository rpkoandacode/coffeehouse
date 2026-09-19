const cart = getCart();

function renderCheckout() {

    const itemsContainer = document.getElementById('checkout-items');
    const totalContainer = document.getElementById('checkout-total');

    if (cart.length === 0) {

        itemsContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        document.getElementById('place-order-btn').disabled = true;

        return;

    }

    let total = 0;

    itemsContainer.innerHTML = cart.map(item => {

        total += item.price * item.quantity;

        return `
            <div class="checkout-item">

                <h3>${item.name} × ${item.quantity}</h3>

                ${
                    item.category !== 'Food'
                    ? `
                        ${item.size ? `
                            <p><strong>Size:</strong> ${item.size}</p>
                        ` : ''}

                        ${item.temperature ? `
                            <p><strong>Temperature:</strong> ${item.temperature}</p>
                        ` : ''}

                        ${item.sugar ? `
                            <p><strong>Sugar:</strong> ${item.sugar}</p>
                        ` : ''}

                        ${item.ice ? `
                            <p><strong>Ice:</strong> ${item.ice}</p>
                        ` : ''}

                        ${item.milk ? `
                            <p><strong>Milk:</strong> ${item.milk}</p>
                        ` : ''}
                    `
                    : ''
                }

                <p class="checkout-price">
                    Rp ${(item.price * item.quantity).toLocaleString('id-ID')}
                </p>

            </div>
        `;

    }).join('');

    totalContainer.innerHTML = `
        <div class="checkout-total-row">
            <span>Subtotal</span>
            <span>Rp ${total.toLocaleString('id-ID')}</span>
        </div>

        <div class="checkout-total-row final">
            <span>Total</span>
            <span>Rp ${total.toLocaleString('id-ID')}</span>
        </div>
    `;

}

renderCheckout();

document.getElementById('place-order-btn').addEventListener('click', async () => {

    const customerName = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();

    if (!customerName || !phone) {
        alert('Please enter your name and phone number.');
        return;
    }

    const order = {
        orderNumber: `CH${Date.now().toString().slice(-6)}`,
        customerName,
        phone,
        orderType: document.getElementById('order-type').value,
        pickupTime: document.getElementById('pickup-time').value,
        notes: document.getElementById('order-notes').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'New',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {

        await db.collection('orders').add(order);

        localStorage.setItem('last-order', JSON.stringify(order));

        localStorage.removeItem('coffeehouse-cart');

        window.location.href = 'success.html';

    } catch (error) {

    console.error('Order error:', error);

    alert('Failed to place order: ' + error.message);

}

});