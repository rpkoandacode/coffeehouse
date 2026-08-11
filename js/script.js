const featuredGrid = document.getElementById('featured-grid');

function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
}

function displayFeaturedProducts() {

    // Show first 3 products
    const featuredProducts = products.slice(0, 3);

    featuredGrid.innerHTML = featuredProducts.map(product => `
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

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    alert(`${product.name} added to cart!`);
}

displayFeaturedProducts();