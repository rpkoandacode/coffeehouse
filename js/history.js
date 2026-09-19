const historyContainer = document.getElementById('history-container');
const historyCount = document.getElementById('history-count');
const historyRevenue = document.getElementById('history-revenue');

let archivedOrders = [];

db.collection('order_history')
    .orderBy('archivedAt', 'desc')
    .onSnapshot(snapshot => {

        archivedOrders = [];

        snapshot.forEach(doc => {
            archivedOrders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderHistory(archivedOrders);

    });

function renderHistory(orders) {

    historyCount.textContent = orders.length;

    const revenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
    );

    historyRevenue.textContent =
        `Rp ${revenue.toLocaleString('id-ID')}`;

    historyContainer.innerHTML = orders.map(order => `
        <div class="order-card">

            <div class="order-header">
                <h3>Order #${order.orderNumber || '----'}</h3>
                <span class="status-badge">
                    Completed
                </span>
            </div>

            <p><strong>Customer:</strong>
                ${order.customerName}
            </p>

            <p><strong>Phone:</strong>
                ${order.phone}
            </p>

            <hr>

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

            <hr>

            <p><strong>Total:</strong>
                Rp ${(order.total || 0).toLocaleString('id-ID')}
            </p>

        </div>
    `).join('');

}