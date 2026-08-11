const menuGrid = document.getElementById('menu-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

const modal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');

let selectedProduct = null;

const noMilkDrinks = ['Espresso', 'Americano'];

function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
}

function displayProducts(category = 'All') {

    const filteredProducts = category === 'All'
        ? products
        : products.filter(product => product.category === category);

    menuGrid.innerHTML = filteredProducts.map(product => `
        <div class="drink-card">

            <img
                src="${product.image}"
                alt="${product.name}"
                class="drink-image"
            >

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="drink-bottom">

                <span class="price">
                    ${formatPrice(product.price)}
                </span>

                <button onclick="openProductModal(${product.id})">
                    Add
                </button>

            </div>

        </div>
    `).join('');
}

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        filterButtons.forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');

        displayProducts(button.dataset.category);

    });

});

// =========================
// Option Buttons
// =========================

document.addEventListener('click', function(e) {

    if (!e.target.classList.contains('option-btn')) return;

    const group = e.target.parentElement;

    group.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    e.target.classList.add('active');

});

function getSelectedOption(groupName) {

    const active = document.querySelector(
        `[data-option="${groupName}"] .option-btn.active`
    );

    return active ? active.dataset.value : null;

}

// =========================
// Product Modal
// =========================

function openProductModal(productId) {

    selectedProduct = products.find(p => p.id === productId);

    document.getElementById('modal-title').textContent =
        selectedProduct.name;

    const milkSection = document.getElementById('milk-section');

    if (
        selectedProduct.category === 'Coffee' &&
        !noMilkDrinks.includes(selectedProduct.name)
    ) {
        milkSection.style.display = 'block';
    } else {
        milkSection.style.display = 'none';
    }

    modal.classList.add('show');
}

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

document.getElementById('confirm-add').addEventListener('click', () => {

    const options = {
        temperature: getSelectedOption('temperature'),
        sugar: getSelectedOption('sugar'),
        ice: getSelectedOption('ice'),
        milk: document.getElementById('milk-section').style.display === 'none'
            ? null
            : getSelectedOption('milk')
    };

    addToCart(selectedProduct.id, options);

    modal.classList.remove('show');
});

displayProducts();