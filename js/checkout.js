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

                <p><strong>Size:</strong> ${item.size || 'Regular'}</p>
                <p><strong>Temperature:</strong> ${item.temperature}</p>
                <p><strong>Sugar:</strong> ${item.sugar}</p>
                <p><strong>Ice:</strong> ${item.ice}</p>

                ${item.milk ? `
                    <p><strong>Milk:</strong> ${item.milk}</p>
                ` : ''}

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

    try {

        await db.collection('orders').add({
            test: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Firebase connection successful!');

    } catch (error) {

        console.error(error);

        alert('Firebase connection failed.');

    }

});