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
        { name: 'Kids Shirt', price: 30, image: 'images/kidsclothing/kid-shirt.jpg' },
        { name: 'Kids Pants', price: 25, image: 'images/kidsclothing/kid-pants.jpg' }
    ],
    fastfood: [
        { name: 'Pizza', price: 40, image: 'images/fastfood/pizza.jpg' },
        { name: 'Burger', price: 20, image: 'images/fastfood/burger.jpg' },
        { name: 'Dessert', price: 22, image: 'images/fastfood/dessert.jpg' }
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
    if (products.length === 0) {
        productsSection.innerHTML = "<p>No products available in this category.</p>";
    } else {
        products.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} MAD</p>
                <button class="add-to-cart" onclick='addToCart(${index})'>Add to Cart</button>
            `;
            productsSection.appendChild(productDiv);
        });
    }
}

// Add a product to the cart
function addToCart(productIndex) {
    const product = productsData[currentCategory][productIndex];
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if the product already exists
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
    }

    const message = document.getElementById('confirmation-message');
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
    updateCart();
}

// Remove a product from the cart
function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1; // Decrease quantity if greater than 1
    } else {
        cart.splice(index, 1); // Remove product if quantity is 1
    }
    updateCart();
}

// Update cart display
function updateCart() {
    const cartSection = document.getElementById('cart');
    cartSection.innerHTML = ''; // Clear previous content
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name} ×${item.quantity}</span>
            </div>
            <div class="cart-item-price">
                ${item.price * item.quantity} MAD
                <button class="remove-from-cart" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartSection.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    const totalPrice = document.createElement('p');
    totalPrice.id = 'total-price';
    totalPrice.innerHTML = `<strong>Total: ${total} MAD</strong>`;
    cartSection.appendChild(totalPrice);
}

// View the cart
function viewCart() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('cart-section').style.display = 'block';
}

// Checkout functionality
async function checkout() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPosition = 20;
    let total = 0;

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    for (const item of cart) {
        const img = new Image();
        img.src = item.image;

        // Wait for image to load
        await new Promise((resolve) => {
            img.onload = () => {
                doc.addImage(img, 'JPEG', 10, yPosition, 15, 15); // Add product image
                doc.text(`${item.name} ×${item.quantity} - ${item.price * item.quantity} MAD`, 30, yPosition + 10);
                yPosition += 20;
                resolve();
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${item.image}`);
                resolve(); // Resolve even if the image fails to load
            };
        });

        total += item.price * item.quantity;
    }

    doc.text(`Total: ${total} MAD`, 10, yPosition + 10);
    doc.save('order-summary.pdf');

    // WhatsApp integration
    const message = `I would like to complete my order:\n${cart.map(item => `${item.name} ×${item.quantity}: ${item.price * item.quantity} MAD`).join("\n")}`;
    const whatsappURL = `https://wa.me/+212607120585?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
}

// Initial load of "Groceries" products
showCategory('groceries');