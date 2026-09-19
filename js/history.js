const historyContainer = document.getElementById('history-container');
const historyCount = document.getElementById('history-count');
const historyRevenue = document.getElementById('history-revenue');

let archivedOrders = [];


// Wait for Firebase Authentication
firebase.auth().onAuthStateChanged(user => {

    if (!user) {

        console.log('No authenticated user.');

        historyContainer.innerHTML = `
            <div class="empty-history">
                <h3>Admin login required</h3>
                <p>Please log in to view order history.</p>
            </div>
        `;

        return;
    }

    console.log('Authenticated user:', user.email);

    loadOrderHistory();

});


// Load archived orders
function loadOrderHistory() {

    db.collection('order_history')
        .onSnapshot(snapshot => {

            archivedOrders = [];

            snapshot.forEach(doc => {

                archivedOrders.push({
                    id: doc.id,
                    ...doc.data()
                });

            });


            // Sort newest orders first
            archivedOrders.sort((a, b) => {

                const dateA = getArchivedDate(a);
                const dateB = getArchivedDate(b);

                return dateB - dateA;

            });


            console.log(
                'Archived orders found:',
                archivedOrders.length
            );


            renderHistory(archivedOrders);

        }, error => {

            console.error(
                'Error loading order history:',
                error
            );

            historyContainer.innerHTML = `
                <div class="empty-history">
                    <h3>Unable to load order history</h3>
                    <p>${error.message || 'Unknown Firebase error'}</p>
                </div>
            `;

        });

}


// Get archived date safely
function getArchivedDate(order) {

    if (!order.archivedAt) {
        return new Date(0);
    }

    if (order.archivedAt.toDate) {
        return order.archivedAt.toDate();
    }

    return new Date(order.archivedAt);

}


// Render history
function renderHistory(orders) {

    historyCount.textContent = orders.length;


    // Calculate revenue
    const revenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
    );


    historyRevenue.textContent =
        `Rp ${revenue.toLocaleString('id-ID')}`;


    // No orders
    if (orders.length === 0) {

        historyContainer.innerHTML = `
            <div class="empty-history">
                <h3>No archived orders</h3>
                <p>There are currently no completed orders in the history.</p>
            </div>
        `;

        return;
    }


    // Display orders
    historyContainer.innerHTML = orders.map(order => `

        <div class="order-card">

            <div class="order-header">

                <h3>
                    Order #${order.orderNumber || '----'}
                </h3>

                <span class="status-badge">
                    Completed
                </span>

            </div>


            <p>
                <strong>Customer:</strong>
                ${order.customerName || 'Unknown'}
            </p>


            <p>
                <strong>Phone:</strong>
                ${order.phone || 'N/A'}
            </p>


            <hr>


            ${(order.items || []).map(item => `

                <div class="order-item">

                    <strong>
                        ${item.name} × ${item.quantity}
                    </strong>

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


            <div class="order-footer">

                <p>
                    <strong>Total:</strong>
                    Rp ${(order.total || 0).toLocaleString('id-ID')}
                </p>


                <button
                    class="delete-history-btn"
                    onclick="deleteArchivedOrder('${order.id}')"
                >
                    Delete
                </button>

            </div>

        </div>

    `).join('');

}


// Delete archived order
function deleteArchivedOrder(orderId) {

    const confirmed = confirm(
        'Are you sure you want to delete this archived order? This cannot be undone.'
    );


    if (!confirmed) {
        return;
    }


    db.collection('order_history')
        .doc(orderId)
        .delete()
        .then(() => {

            console.log(
                'Archived order deleted:',
                orderId
            );

        })
        .catch(error => {

            console.error(
                'Error deleting archived order:',
                error
            );

            alert(
                'Failed to delete the order. Please try again.'
            );

        });

}