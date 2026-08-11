const menuGrid = document.getElementById('menu-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

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

                <button onclick="addToCart(${product.id})">
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

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    alert(`${product.name} added to cart!`);
}

displayProducts();