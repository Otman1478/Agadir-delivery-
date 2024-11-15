let cart = [];
let currentCategory = 'groceries';

// Product data for each category
const productsData = {
    groceries: [
        { name: 'Milk', price: 10, image: 'images/groceries/milk.jpg' },
        { name: 'Bread', price: 5, image: 'images/groceries/bread.jpg' }
    ],
    clothing: [
        { name: "Men's Shirt", price: 50, image: 'images/clothing/men-shirt.jpg' },
        { name: "Women's Shirt", price: 45, image: 'images/clothing/women-shirt.jpg' }
    ],
    kids: [
        { name: 'Kids Shirt', price: 30, image: 'images/kids/kid-shirt.jpg' },
        { name: 'Kids Pants', price: 25, image: 'images/kids/kid-pants.jpg' }
    ],
    fastfood: [
        { name: 'Pizza', price: 40, image: 'images/fastfood/pizza.jpg' },
        { name: 'Burger', price: 20, image: 'images/fastfood/burger.jpg' }
    ]
};

// Show the products for a specific category
function showCategory(category) {
    currentCategory = category;
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = ''; // Clear previous content
    productsSection.style.display = 'flex';
    document.getElementById('cart-section').style.display = 'none';

    const products = productsData[category];
    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} MAD</p>
            <button class="add-to-cart" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        `;
        productsSection.appendChild(productDiv);
    });
}

// Add a product to the cart
function addToCart(product) {
    cart.push(product);
    alert(`${product.name} has been added to the cart.`);
    updateCart();
}

// Remove a product from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Update cart display
function updateCart() {
    const cartSection = document.getElementById('cart');
    cartSection.innerHTML = ''; // Clear previous content
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px;">
            ${item.name} - ${item.price} MAD
            <button class="remove-from-cart" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartSection.appendChild(cartItem);
        total += item.price;
    });

    document.getElementById('total-price').innerText = `Total: ${total} MAD`;
}

// View the cart
function viewCart() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('cart-section').style.display = 'block';
}

// Checkout functionality
function checkout() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let total = 0;
    let yPosition = 20;

    cart.forEach(item => {
        doc.text(`${item.name} - ${item.price} MAD`, 10, yPosition);
        yPosition += 10;
        total += item.price;
    });

    doc.text(`Total: ${total} MAD`, 10, yPosition + 10);
    doc.save('order-summary.pdf');

    // Redirect to WhatsApp for order confirmation
    const message = `I would like to complete my order with the following products:\n${cart.map(item => `${item.name}: ${item.price} MAD`).join("\n")}`;
    const whatsappURL = `https://wa.me/+212607120585?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}

// Search products by name
function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = ''; // Clear previous content

    const products = productsData[currentCategory].filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );

    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} MAD</p>
            <button class="add-to-cart" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        `;
        productsSection.appendChild(productDiv);
    });
}

// Initial load of "Groceries" products
showCategory('groceries');