const ordersContainer = document.getElementById('orders-container');
const totalOrders = document.getElementById('total-orders');
const newOrders = document.getElementById('new-orders');

db.collection('orders')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {

        ordersContainer.innerHTML = '';

        totalOrders.textContent = snapshot.size;

        let newCount = 0;

        snapshot.forEach(doc => {

            const order = doc.data();

            if (order.status === 'New') {
                newCount++;
            }

            const card = document.createElement('div');
            card.className = 'order-card';

            card.innerHTML = `
                <div class="order-header">
                    <h3>${order.orderNumber || 'Order'}</h3>
                    <select
                        class="status-select"
                        data-id="${doc.id}"
                    >
                        <option value="New" ${order.status === 'New' ? 'selected' : ''}>New</option>
                        <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="Ready" ${order.status === 'Ready' ? 'selected' : ''}>Ready</option>
                        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>

                <p><strong>Customer:</strong> ${order.customerName || '-'}</p>
                <p><strong>Phone:</strong> ${order.phone || '-'}</p>
                <p><strong>Order Type:</strong> ${order.orderType || '-'}</p>

                <hr>

                <div class="order-items">
                    ${(order.items || []).map(item => `
                        <div class="order-item">
                            <strong>${item.name} × ${item.quantity}</strong>
                            <p>
                                ${item.size || 'Regular'} •
                                ${item.temperature || ''} •
                                ${item.sugar || ''} •
                                ${item.ice || ''}
                                ${item.milk ? `• ${item.milk}` : ''}
                            </p>
                        </div>
                    `).join('')}
                </div>

                <hr>

                <p><strong>Total:</strong>
                    Rp ${(order.total || 0).toLocaleString('id-ID')}
                </p>

                <p><strong>Pickup:</strong>
                    ${order.pickupTime || '-'}
                </p>

                <p><strong>Notes:</strong>
                    ${order.notes || '-'}
                </p>

                ${order.status === 'Completed' ? `
                    <button
                        class="archive-btn"
                        onclick="archiveOrder('${doc.id}')"
                    >
                        Archive Order
                    </button>
                ` : ''}
                `;

            ordersContainer.appendChild(card);

        });

        newOrders.textContent = newCount;

    });

    document.addEventListener('change', async (e) => {

    if (!e.target.classList.contains('status-select')) return;

    const orderId = e.target.dataset.id;
    const newStatus = e.target.value;

    try {

        await db.collection('orders')
            .doc(orderId)
            .update({
                status: newStatus
            });

    } catch (error) {

        console.error(error);

        alert('Failed to update status.');

    }

});

document.addEventListener('change', async (e) => {

    // status update code

});

async function archiveOrder(orderId) {

    const confirmArchive = confirm(
        'Archive this completed order?'
    );

    if (!confirmArchive) return;

    try {

        const orderRef = db.collection('orders').doc(orderId);

        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) return;

        const orderData = orderDoc.data();

        await db.collection('order_history').add({
            ...orderData,
            archivedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await orderRef.delete();

        alert('Order archived successfully.');

    } catch (error) {

        console.error(error);

        alert('Failed to archive order.');

    }

}