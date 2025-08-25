let cart = [];
let currentLang = 'en'; // Default language
let allProducts = [];
let currentPage = 'home';
let currentProduct = null;
let currentImageIndex = 0;
let isLoggedIn = false;
let currentUser = null;
let previousCategoryPage = 'home';

const translations = {
    en: {
        title: "OTM Delivery",
        home: "Home",
        grocery: "Grocery",
        food: "Food",
        clothes: "Clothes",
        cart: "Cart",
        "home-title": "Welcome to OTM Delivery",
        "home-desc": "Fast delivery of groceries, food, and clothes right to your door!",
        "buy": "Buy",
        "buy-notification": "added to cart",
        "remove-from-cart": "Remove",
        total: "Total:",
        name: "Your Name",
        phone: "Phone Number",
        location: "Delivery Location",
        "use-location": "Use My Location",
        "place-order": "Place Order",
        footer: "© 2025 OTM Delivery. All rights reserved.",
        "order-success": "Order Placed Successfully!",
        "order-close": "Close",
        "search-placeholder": "Search products...",
        "back-to-shopping": "Back to Shopping",
        "fast-delivery": "Fast Delivery",
        "wide-selection": "Wide Selection",
        "affordable-prices": "Affordable Prices",
        "special-offers": "Special Offers",
        "animals": "Animals",
        "accessories": "Accessories",
        "electronics": "Electronics",
        "special-events": "Special Events",
        "make-up": "Make-up",
        "babies": "Babies",
        "toys": "Toys",
        "kids-clothing": "Kids Clothing",
        "meats": "Meats",
        "sports": "Sports",
        "drinks": "Drinks",
        "follow-contact-us": "Follow and Contact Us",
        "contact-us": "Contact Us",
        "sign-in": "Sign In",
        "sign-in-btn": "Sign In",
        "sign-up": "Sign Up",
        "no-account-sign-up": "No account? Sign Up",
        "forgot-password": "Forgot Password?",
        "email": "Email",
        "password": "Password",
        "next": "Next",
        "verify-email": "Verify Your Email",
        "verification-code": "Verification Code",
        "verify": "Verify",
        "reset-password": "Reset Password",
        "new-password": "New Password",
        "reset": "Reset",
        "settings": "Settings",
        "update-info": "Update Info",
        "change-password": "Change Password",
        "logout": "Logout",
        "city": "City",
        "neighborhood": "Neighborhood",
        "postal-code": "Postal Code",
        "sign-in-success": "Signed in successfully!",
        "sign-up-success": "Signed up successfully! Check your email for the verification code.",
        "password-reset-success": "Password reset successfully!",
        "verify-sign-in": "Verify Sign-In",
        "rate-product": "Rate Product",
        "your-rating": "Your Rating",
        "add-comment": "Add a comment (max 30 chars)",
        "submit-rating": "Submit Rating",
        "customer-reviews": "Customer Reviews",
        "no-comments": "No comments yet",
        "rating-submitted": "Rating submitted successfully!",
        "buy-now": "Buy Now",
        "similar-products": "Similar Products",
        "back-to-category": "Back to Category",
        "average-rating": "Average Rating",
        "price": "Price",
        "product-name": "Product Name",
        "product-description": "Description"
    },
    fr: {
        title: "Livraison OTM",
        home: "Accueil",
        grocery: "Épicerie",
        food: "Nourriture",
        clothes: "Vêtements",
        cart: "Panier",
        "home-title": "Bienvenue chez Livraison OTM",
        "home-desc": "Livraison rapide de produits d'épicerie, de nourriture et de vêtements directement à votre porte !",
        "buy": "Acheter",
        "buy-notification": "ajouté au panier",
        "remove-from-cart": "Supprimer",
        total: "Total :",
        name: "Votre nom",
        phone: "Numéro de téléphone",
        location: "Lieu de livraison",
        "use-location": "Utiliser ma position",
        "place-order": "Passer la commande",
        footer: "© 2025 Livraison OTM. Tous droits réservés.",
        "order-success": "Commande passée avec succès !",
        "order-close": "Fermer",
        "search-placeholder": "Rechercher des produits...",
        "back-to-shopping": "Retour aux achats",
        "fast-delivery": "Livraison Rapide",
        "wide-selection": "Large Sélection",
        "affordable-prices": "Prix Abordables",
        "special-offers": "Offres Spéciales",
        "animals": "Animaux",
        "accessories": "Accessoires",
        "electronics": "Électronique",
        "special-events": "Événements Spéciaux",
        "make-up": "Maquillage",
        "babies": "Bébés",
        "toys": "Jouets",
        "kids-clothing": "Vêtements pour Enfants",
        "meats": "Viandes",
        "sports": "Sports",
        "drinks": "Boissons",
        "follow-contact-us": "Suivre et Nous Contacter",
        "contact-us": "Nous Contacter",
        "sign-in": "Connexion",
        "sign-in-btn": "Se connecter",
        "sign-up": "Inscription",
        "no-account-sign-up": "Pas de compte ? Inscrivez-vous",
        "forgot-password": "Mot de passe oublié ?",
        "email": "Email",
        "password": "Mot de passe",
        "next": "Suivant",
        "verify-email": "Vérifiez votre email",
        "verification-code": "Code de vérification",
        "verify": "Vérifier",
        "reset-password": "Réinitialiser le mot de passe",
        "new-password": "Nouveau mot de passe",
        "reset": "Réinitialiser",
        "settings": "Paramètres",
        "update-info": "Mettre à jour les informations",
        "change-password": "Changer le mot de passe",
        "logout": "Déconnexion",
        "city": "Ville",
        "neighborhood": "Quartier",
        "postal-code": "Code postal",
        "sign-in-success": "Connexion réussie !",
        "sign-up-success": "Inscription réussie ! Vérifiez votre email pour le code de vérification.",
        "password-reset-success": "Mot de passe réinitialisé avec succès !",
        "verify-sign-in": "Vérifier la connexion",
        "rate-product": "Évaluer le produit",
        "your-rating": "Votre note",
        "add-comment": "Ajouter un commentaire (max 30 car)",
        "submit-rating": "Soumettre l'évaluation",
        "customer-reviews": "Avis des clients",
        "no-comments": "Aucun commentaire pour le moment",
        "rating-submitted": "Évaluation soumise avec succès !",
        "buy-now": "Acheter Maintenant",
        "similar-products": "Produits Similaires",
        "back-to-category": "Retour à la Catégorie",
        "average-rating": "Note Moyenne",
        "price": "Prix",
        "product-name": "Nom du Produit",
        "product-description": "Description"
    },
    ar: {
        title: "توصيل OTM",
        home: "الرئيسية",
        grocery: "بقالة",
        food: "طعام",
        clothes: "ملابس",
        cart: "سلة التسوق",
        "home-title": "مرحبا بكم في توصيل OTM",
        "home-desc": "توصيل سريع للبقالة والطعام والملابس إلى باب منزلك",
        "buy": "شراء",
        "buy-notification": "تمت الإضافة إلى السلة",
        "remove-from-cart": "إزالة",
        total: "المجموع:",
        name: "اسمك",
        phone: "رقم الهاتف",
        location: "موقع التوصيل",
        "use-location": "استخدام موقعي",
        "place-order": "تقديم الطلب",
        footer: "© 2025 توصيل OTM. جميع الحقوق محفوظة.",
        "order-success": "تم تقديم الطلب بنجاح!",
        "order-close": "إغلاق",
        "search-placeholder": "ابحث عن المنتجات...",
        "back-to-shopping": "العودة للتسوق",
        "fast-delivery": "توصيل سريع",
        "wide-selection": "تشكيلة واسعة",
        "affordable-prices": "أسعار معقولة",
        "special-offers": "عروض خاصة",
        "animals": "حيوانات",
        "accessories": "إكسسوارات",
        "electronics": "إلكترونيات",
        "special-events": "مناسبات خاصة",
        "make-up": "مكياج",
        "babies": "أطفال رضع",
        "toys": "ألعاب",
        "kids-clothing": "ملابس الأطفال",
        "meats": "لحوم",
        "sports": "رياضة",
        "drinks": "مشروبات",
        "follow-contact-us": "تابعنا واتصل بنا",
        "contact-us": "اتصل بنا",
        "sign-in": "تسجيل الدخول",
        "sign-in-btn": "تسجيل الدخول",
        "sign-up": "إنشاء حساب",
        "no-account-sign-up": "ليس لديك حساب؟ سجل الآن",
        "forgot-password": "نسيت كلمة المرور؟",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "next": "التالي",
        "verify-email": "تحقق من بريدك الإلكتروني",
        "verification-code": "رمز التحقق",
        "verify": "تحقق",
        "reset-password": "إعادة تعيين كلمة المرور",
        "new-password": "كلمة المرور الجديدة",
        "reset": "إعادة تعيين",
        "settings": "الإعدادات",
        "update-info": "تحديث المعلومات",
        "change-password": "تغيير كلمة المرور",
        "logout": "تسجيل الخروج",
        "city": "المدينة",
        "neighborhood": "الحي",
        "postal-code": "الرمز البريدي",
        "sign-in-success": "تم تسجيل الدخول بنجاح!",
        "sign-up-success": "تم التسجيل بنجاح! تحقق من بريدك الإلكتروني للحصول على رمز التحقق.",
        "password-reset-success": "تم إعادة تعيين كلمة المرور بنجاح!",
        "verify-sign-in": "تحقق من تسجيل الدخول",
        "rate-product": "قيّم هذا المنتج",
        "your-rating": "تقييمك",
        "add-comment": "أضف تعليقًا (حد أقصى 30 حرفًا)",
        "submit-rating": "إرسال التقييم",
        "customer-reviews": "آراء العملاء",
        "no-comments": "لا توجد تعليقات بعد",
        "rating-submitted": "تم إرسال التقييم بنجاح!",
        "buy-now": "اشتر الآن",
        "similar-products": "منتجات مشابهة",
        "back-to-category": "العودة إلى الفئة",
        "average-rating": "التقييم المتوسط",
        "price": "السعر",
        "product-name": "اسم المنتج",
        "product-description": "الوصف"
    }
};

const categoryTranslations = {
    en: {
        grocery: "grocery",
        food: "food",
        clothes: "clothes",
        "special-offers": "special-offers",
        animals: "animals",
        accessories: "accessories",
        electronics: "electronics",
        "special-events": "special-events",
        "make-up": "make-up",
        babies: "babies",
        toys: "toys",
        "kids-clothing": "kids-clothing",
        meats: "meats",
        sports: "sports",
        drinks: "drinks"
    },
    fr: {
        grocery: "épicerie",
        food: "nourriture",
        clothes: "vêtements",
        "special-offers": "offres-spéciales",
        animals: "animaux",
        accessories: "accessoires",
        electronics: "électronique",
        "special-events": "événements-spéciaux",
        "make-up": "maquillage",
        babies: "bébés",
        toys: "jouets",
        "kids-clothing": "vêtements-pour-enfants",
        meats: "viandes",
        sports: "sports",
        drinks: "boissons"
    },
    ar: {
        grocery: "بقالة",
        food: "طعام",
        clothes: "ملابس",
        "special-offers": "عروض-خاصة",
        animals: "حيوانات",
        accessories: "إكسسوارات",
        electronics: "إلكترونيات",
        "special-events": "مناسبات-خاصة",
        "make-up": "مكياج",
        babies: "أطفال-رضع",
        toys: "ألعاب",
        "kids-clothing": "ملابس-الأطفال",
        meats: "لحوم",
        sports: "رياضة",
        drinks: "مشروبات"
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.body.classList.toggle('rtl', lang === 'ar');
    
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    document.querySelectorAll('[data-lang-placeholder]').forEach(input => {
        const key = input.getAttribute('data-lang-placeholder');
        input.placeholder = translations[lang][key];
    });
    
    if (currentPage === 'cart') {
        updateCart();
    } else if (currentPage === 'settings' && isLoggedIn) {
        populateSettingsForm();
    } else if (currentPage === 'product-page' && currentProduct) {
        showProductPage(currentProduct.id, true);
    } else if (currentPage === 'search-results') {
        searchProducts();
    } else {
        loadProducts();
        updateURLForCategory(currentPage);
    }
}

function updateURLForCategory(pageId) {
    if (['grocery', 'food', 'clothes', 'special-offers', 'animals', 'accessories', 'electronics', 'special-events', 'make-up', 'babies', 'toys', 'kids-clothing', 'meats', 'sports', 'drinks'].includes(pageId)) {
        const categoryName = categoryTranslations[currentLang][pageId];
        window.history.replaceState({ page: pageId }, '', `/${categoryName}`);
    }
}

function showPage(pageId, updateURL = true) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`nav ul li a[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = pageId;

        if (pageId !== 'search-results') {
            const searchBar = document.getElementById('search-bar');
            searchBar.value = '';
            hideSearchResults();
        }

        if (updateURL) {
            if (pageId === 'home') {
                window.history.replaceState({ page: 'home' }, '', '/');
            } else if (['cart', 'settings'].includes(pageId)) {
                window.history.replaceState({ page: pageId }, '', `/${pageId}`);
            } else if (['grocery', 'food', 'clothes', 'special-offers', 'animals', 'accessories', 'electronics', 'special-events', 'make-up', 'babies', 'toys', 'kids-clothing', 'meats', 'sports', 'drinks'].includes(pageId)) {
                previousCategoryPage = pageId;
                updateURLForCategory(pageId);
            }
        }

        if (pageId === 'cart') {
            updateCart();
        } else if (pageId === 'settings' && isLoggedIn) {
            populateSettingsForm();
        } else if (['grocery', 'food', 'clothes', 'special-offers', 'animals', 'accessories', 'electronics', 'special-events', 'make-up', 'babies', 'toys', 'kids-clothing', 'meats', 'sports', 'drinks'].includes(pageId)) {
            loadProducts();
        }
    }
    const slideBar = document.getElementById('category-slide-bar');
    if (slideBar) slideBar.classList.remove('active');
}

function addToCart(name, price, img) {
    if (!name || !price || !img) {
        showNotification('Error: Missing product details.', 'error');
        return;
    }
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    updateCartCount();
    saveCartToLocalStorage();
    if (isLoggedIn) syncCartWithServer();
    showNotification(`${name} ${translations[currentLang]['buy-notification']}`);
}

function addToCartFromProductPage() {
    if (!currentProduct) return;
    const productName = typeof currentProduct.name === 'object' ? currentProduct.name[currentLang] : currentProduct.name;
    addToCart(productName, currentProduct.discountedPrice || currentProduct.price, currentProduct.images[0]);
}

function addToCartFromSimilar(button) {
    const similarProductDiv = button.closest('.similar-product');
    const productId = similarProductDiv.getAttribute('data-product-id');
    const product = allProducts.find(p => p.id === parseInt(productId));
    if (!product) return;
    const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
    addToCart(productName, product.discountedPrice || product.price, product.images[0]);
}

function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
        updateCartCount();
        updateCart();
        saveCartToLocalStorage();
        if (isLoggedIn) syncCartWithServer();
        showNotification(`${name} ${translations[currentLang]['remove-from-cart']}`);
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name} (x${item.quantity})</span>
            <span>${itemTotal} DH</span>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">${translations[currentLang]['remove-from-cart']}</button>
        `;
        cartItems.appendChild(div);
    });
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 2500);
}

function showOrderConfirmation(name, phone) {
    const confirmation = document.getElementById('order-confirmation');
    confirmation.innerHTML = `
        <p>${translations[currentLang]['order-success']}</p>
        <p>${translations[currentLang].name}: ${name}</p>
        <p>${translations[currentLang].phone}: ${phone}</p>
        <button onclick="document.getElementById('order-confirmation').style.display='none'">${translations[currentLang]['order-close']}</button>
    `;
    confirmation.style.display = 'block';
}

function getUserLocation() {
    const locationBtn = document.getElementById('location-btn');
    locationBtn.classList.add('loading');
    locationBtn.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        let specificAddress = '';
                        if (data.address) {
                            const road = data.address.road || '';
                            const neighbourhood = data.address.neighbourhood || '';
                            const city = data.address.city || data.address.town || 'Unknown City';
                            const postcode = data.address.postcode || '';
                            specificAddress = [road, neighbourhood, city, postcode]
                                .filter(part => part)
                                .join(', ') || 'Unknown Location';
                        } else {
                            specificAddress = 'Unable to determine exact address';
                        }
                        document.getElementById('location').value = specificAddress;
                        showNotification(`Location set to: ${specificAddress}`);
                        locationBtn.classList.remove('loading');
                        locationBtn.disabled = false;
                    })
                    .catch(() => {
                        showNotification('Unable to fetch detailed address. Please enter manually.', 'error');
                        document.getElementById('location').value = `${latitude}, ${longitude}`;
                        locationBtn.classList.remove('loading');
                        locationBtn.disabled = false;
                    });
            },
            (error) => {
                let errorMessage = 'Location access denied. Please enter manually.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permission denied. Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location unavailable. Check your connection or device settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Try again.';
                        break;
                }
                showNotification(errorMessage, 'error');
                locationBtn.classList.remove('loading');
                locationBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showNotification('Geolocation not supported by your browser.', 'error');
        locationBtn.classList.remove('loading');
        locationBtn.disabled = false;
    }
}

function loadProducts() {
    return fetch('/api/products')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(products => {
            allProducts = products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount || 0,
                discountedPrice: product.discountedPrice || (product.discount ? product.price * (1 - product.discount / 100) : product.price),
                images: product.images,
                category: product.category,
                description: product.description || 'No description available',
                avgRating: product.avgRating || 0,
                ratingsCount: product.ratingsCount || 0
            }));
            console.log('Loaded Products:', allProducts);
            const containers = {
                'grocery': 'grocery-products',
                'food': 'food-products',
                'clothes': 'clothes-products',
                'special-offers': 'special-offers-products',
                'animals': 'animals-products',
                'accessories': 'accessories-products',
                'electronics': 'electronics-products',
                'special-events': 'special-events-products',
                'make-up': 'make-up-products',
                'babies': 'babies-products',
                'toys': 'toys-products',
                'kids-clothing': 'kids-clothing-products',
                'meats': 'meats-products',
                'sports': 'sports-products',
                'drinks': 'drinks-products'
            };
            Object.keys(containers).forEach(category => {
                const container = document.getElementById(containers[category]);
                if (container) {
                    container.innerHTML = '';
                    products.filter(p => p.category === category).forEach(product => {
                        const div = document.createElement('div');
                        div.className = 'product';
                        div.setAttribute('data-product-id', product.id);
                        const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
                        const hasDiscount = product.discount > 0;
                        const priceDisplay = hasDiscount
                            ? `<p class="original-price">${product.price} DH</p><p class="discounted-price">${product.discountedPrice} DH <span class="discount-icon"><i class="fas fa-tag"></i> -${product.discount}%</span></p>`
                            : `<p>${product.price} DH</p>`;
                        const ratingStars = generateRatingStars(product.avgRating);
                        div.innerHTML = `
                            <img src="${product.images[0]}" alt="${productName}" class="product-image">
                            <h3 class="product-name" onclick="showProductPage(${product.id})">${productName}</h3>
                            ${priceDisplay}
                            <div class="rating-stars" onclick="openRatingModal(${product.id})">${ratingStars}</div>
                            <button onclick="addToCart('${productName}', ${product.discountedPrice || product.price}, '${product.images[0]}')" data-lang="buy">${translations[currentLang]['buy']}</button>
                        `;
                        container.appendChild(div);
                    });
                }
            });

            document.querySelectorAll('.product-image').forEach(img => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = img.closest('.product').getAttribute('data-product-id');
                    openProductModal(productId);
                });
            });

            if (currentPage === 'product-page' && currentProduct) {
                showProductPage(currentProduct.id, false);
            }
        })
        .catch(error => console.error('Error loading products:', error));
}

function generateRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'filled' : ''}"></i>`;
    }
    return stars;
}

function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-');
}

function showProductPage(productId, updateURL = true) {
    const product = allProducts.find(p => p.id === parseInt(productId));
    if (!product) {
        console.error('Product not found for ID:', productId);
        return;
    }

    currentProduct = product;
    currentImageIndex = 0;

    const loadingOverlay = document.getElementById('product-loading');
    loadingOverlay.style.display = 'block';

    const searchBar = document.getElementById('search-bar');
    searchBar.value = '';
    hideSearchResults();

    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        showPage('product-page', false);

        const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
        const description = product.description;

        if (updateURL) {
            const categoryName = categoryTranslations[currentLang][product.category];
            const sanitizedProductName = slugify(productName);
            window.history.replaceState(
                { page: 'product-page', productId: product.id },
                '',
                `/${categoryName}/${sanitizedProductName}`
            );
            console.log('Updated URL:', `/${categoryName}/${sanitizedProductName}`);
        }

        const imagesContainer = document.getElementById('product-images');
        imagesContainer.innerHTML = '';
        product.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = `${productName} ${index + 1}`;
            img.className = index === 0 ? 'active' : '';
            imagesContainer.appendChild(img);
        });

        document.getElementById('product-page-name').textContent = productName;
        document.getElementById('product-page-description').textContent = description;

        const priceElement = document.getElementById('product-page-price');
        const discountedPriceElement = document.getElementById('product-page-discounted-price');
        const discountElement = document.getElementById('product-page-discount');
        if (product.discount > 0) {
            priceElement.textContent = `${product.price} DH`;
            priceElement.classList.add('original-price');
            discountedPriceElement.textContent = `${product.discountedPrice} DH`;
            discountElement.textContent = `-${product.discount}%`;
            discountElement.style.display = 'inline';
        } else {
            priceElement.textContent = `${product.price} DH`;
            priceElement.classList.remove('original-price');
            discountedPriceElement.textContent = '';
            discountElement.textContent = '';
            discountElement.style.display = 'none';
        }

        const starsContainer = document.getElementById('product-page-stars');
        starsContainer.innerHTML = generateRatingStars(product.avgRating);
        starsContainer.onclick = () => openRatingModal(product.id);
        document.getElementById('product-page-rating-count').textContent = `(${product.ratingsCount} reviews)`;

        loadSimilarProducts(product);
    }, 500);
}

function prevProductImage() {
    if (!currentProduct) return;
    const images = document.querySelectorAll('#product-images img');
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
    images[currentImageIndex].classList.add('active');
}

function nextProductImage() {
    if (!currentProduct) return;
    const images = document.querySelectorAll('#product-images img');
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
    images[currentImageIndex].classList.add('active');
}

function loadSimilarProducts(product) {
    const similarProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id);
    const scroller = document.getElementById('similar-products-scroller');
    scroller.innerHTML = '';
    similarProducts.forEach(similar => {
        const div = document.createElement('div');
        div.className = 'similar-product';
        div.setAttribute('data-product-id', similar.id);
        const similarName = typeof similar.name === 'object' ? similar.name[currentLang] : similar.name;
        const hasDiscount = similar.discount > 0;
        const priceDisplay = hasDiscount
            ? `<p class="original-price">${similar.price} DH</p><p class="discounted-price">${similar.discountedPrice} DH</p>`
            : `<p>${similar.price} DH</p>`;
        const ratingStars = generateRatingStars(similar.avgRating);
        div.innerHTML = `
            <img src="${similar.images[0]}" alt="${similarName}">
            <h4 onclick="showProductPage(${similar.id})">${similarName}</h4>
            ${priceDisplay}
            <div class="rating-stars" onclick="openRatingModal(${similar.id})">${ratingStars}</div>
            <button class="similar-buy-btn" onclick="addToCartFromSimilar(this)" data-lang="buy-now">${translations[currentLang]['buy-now']}</button>
        `;
        scroller.appendChild(div);
    });
}

function backToCategory() {
    showPage(previousCategoryPage);
    currentProduct = null;
    currentImageIndex = 0;
}

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === parseInt(productId));
    if (!product) return;

    currentProduct = product;
    currentImageIndex = 0;

    const modal = document.getElementById('product-modal');
    const mainImage = document.getElementById('modal-main-image');
    const thumbnails = document.getElementById('carousel-thumbnails');
    const description = document.getElementById('modal-description');

    const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
    mainImage.src = product.images[0];
    mainImage.alt = productName;
    thumbnails.innerHTML = '';
    product.images.forEach((image, index) => {
        const thumb = document.createElement('img');
        thumb.src = image;
        thumb.alt = `${productName} ${index + 1}`;
        thumb.className = index === 0 ? 'thumbnail active' : 'thumbnail';
        thumb.onclick = () => setMainImage(index);
        thumbnails.appendChild(thumb);
    });
    description.textContent = product.description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setMainImage(index) {
    if (!currentProduct) return;
    currentImageIndex = index;
    document.getElementById('modal-main-image').src = currentProduct.images[index];
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.className = i === index ? 'thumbnail active' : 'thumbnail';
    });
}

function prevImage() {
    if (!currentProduct) return;
    currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
    setMainImage(currentImageIndex);
}

function nextImage() {
    if (!currentProduct) return;
    currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
    setMainImage(currentImageIndex);
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
    currentImageIndex = 0;
}

function openRatingModal(productId) {
    const product = allProducts.find(p => p.id === parseInt(productId));
    if (!product) return;

    currentProduct = product;
    const modal = document.getElementById('rating-modal');
    const productNameElement = document.getElementById('rating-product-name');
    const ratingStarsInput = document.querySelector('.rating-stars-input');
    const commentInput = document.getElementById('rating-comment');
    const commentsList = document.getElementById('comments-list');

    const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
    productNameElement.textContent = productName;
    ratingStarsInput.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        star.dataset.rating = i;
        star.addEventListener('click', () => setRating(i));
        ratingStarsInput.appendChild(star);
    }
    commentInput.value = '';

    fetch(`/api/ratings/${productId}`)
        .then(response => response.json())
        .then(data => {
            commentsList.innerHTML = '';
            if (data.success && data.ratings && data.ratings.length > 0) {
                data.ratings.forEach(rating => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    const stars = generateRatingStars(rating.rating);
                    commentDiv.innerHTML = `
                        <div class="rating-display">${stars}</div>
                        <p>${rating.comment || 'No comment'}</p>
                    `;
                    commentsList.appendChild(commentDiv);
                });
            } else {
                commentsList.innerHTML = `<p>${translations[currentLang]['no-comments']}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching ratings:', error);
            commentsList.innerHTML = '<p>Error loading comments</p>';
        });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setRating(rating) {
    const stars = document.querySelectorAll('.rating-stars-input i');
    stars.forEach(star => {
        star.classList.toggle('filled', parseInt(star.dataset.rating) <= rating);
    });
}

function closeRatingModal() {
    const modal = document.getElementById('rating-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Removed: currentProduct = null;
}

function submitRating() {
    if (!currentProduct) return;

    const stars = document.querySelectorAll('.rating-stars-input i.filled');
    const rating = stars.length;
    const comment = document.getElementById('rating-comment').value.trim();
    const productId = currentProduct.id;

    if (rating === 0) {
        showNotification('Please select a rating.', 'error');
        return;
    }

    if (comment.length > 30) {
        showNotification('Comment must be 30 characters or less.', 'error');
        return;
    }

    const headers = {
        'Content-Type': 'application/json'
    };
    if (isLoggedIn) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }

    fetch('/api/ratings', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            productId: productId,
            rating,
            comment
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(translations[currentLang]['rating-submitted']);
            closeRatingModal();
            loadProducts().then(() => {
                if (currentPage === 'product-page') {
                    showProductPage(productId, false);
                }
            });
        } else {
            showNotification(data.error || 'Failed to submit rating', 'error');
        }
    })
    .catch(error => showNotification('Error submitting rating: ' + error.message, 'error'));
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    if (!searchTerm) {
        hideSearchResults();
        return;
    }
    const filteredProducts = allProducts.filter(product => {
        const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
        return productName.toLowerCase().includes(searchTerm);
    });
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<p>No products found.</p>';
    } else {
        searchResults.style.display = 'block';
        const productsContainer = document.createElement('div');
        productsContainer.className = 'products';
        filteredProducts.forEach(product => {
            const productName = typeof product.name === 'object' ? product.name[currentLang] : product.name;
            const hasDiscount = product.discount > 0;
            const priceDisplay = hasDiscount
                ? `<p class="original-price">${product.price} DH</p><p class="discounted-price">${product.discountedPrice} DH <span class="discount-icon"><i class="fas fa-tag"></i> -${product.discount}%</span></p>`
                : `<p>${product.price} DH</p>`;
            const ratingStars = generateRatingStars(product.avgRating);
            const div = document.createElement('div');
            div.className = 'product search-product';
            div.setAttribute('data-product-id', product.id);
            div.innerHTML = `
                <img src="${product.images[0]}" alt="${productName}" class="product-image">
                <h3 class="product-name" onclick="showProductPage(${product.id})">${productName}</h3>
                ${priceDisplay}
                <div class="rating-stars" onclick="openRatingModal(${product.id})">${ratingStars}</div>
                <button onclick="addToCart('${productName}', ${product.discountedPrice || product.price}, '${product.images[0]}')" data-lang="buy">${translations[currentLang]['buy']}</button>
            `;
            productsContainer.appendChild(div);
        });
        searchResults.appendChild(productsContainer);

        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById('search-results').classList.add('active');
        currentPage = 'search-results';

        document.querySelectorAll('.search-product .product-image').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = img.closest('.product').getAttribute('data-product-id');
                openProductModal(productId);
            });
        });

        window.history.replaceState({ page: 'search-results', searchTerm }, '', `/search?q=${encodeURIComponent(searchTerm)}`);
    }
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
    const searchBar = document.getElementById('search-bar');
    searchBar.value = '';
}

function toggleDarkMode() {
    const body = document.body;
    const toggleButton = document.getElementById('dark-mode-toggle');
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    toggleButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function toggleSlideBar() {
    const slideBar = document.getElementById('category-slide-bar');
    slideBar.classList.toggle('active');
}

function openAuthModal(pageId = 'sign-in') {
    const modal = document.getElementById('auth-modal');
    document.querySelectorAll('.auth-page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.querySelectorAll('.auth-page form').forEach(form => form.reset());
}

function toggleProfileIcon() {
    const profileToggle = document.getElementById('profile-toggle');
    profileToggle.innerHTML = isLoggedIn ? '<i class="fas fa-cog"></i>' : '<i class="fas fa-user"></i>';
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCart();
    }
}

function syncCartWithServer() {
    if (!isLoggedIn) return;
    fetch('/api/users/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cart })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) console.error('Failed to sync cart:', data.error);
    })
    .catch(error => console.error('Error syncing cart:', error));
}

function populateSettingsForm() {
    if (!currentUser) return;
    document.getElementById('update-name').value = currentUser.name;
    document.getElementById('update-email').value = currentUser.email;
    document.getElementById('update-phone').value = currentUser.phone;
    document.getElementById('update-city').value = currentUser.city;
    document.getElementById('update-neighborhood').value = currentUser.neighborhood;
    document.getElementById('update-postal-code').value = currentUser.postalCode;
}

function getCategoryKeyFromSlug(slug) {
    for (const lang in categoryTranslations) {
        const categoryMap = categoryTranslations[lang];
        for (const key in categoryMap) {
            if (categoryMap[key] === slug) {
                return key; // Return the English key (e.g., "grocery")
            }
        }
    }
    return null;
}

function findProductBySlug(categoryKey, productSlug) {
    console.log('Searching for product with slug:', productSlug, 'in category:', categoryKey);
    const product = allProducts.find(p => {
        if (p.category !== categoryKey) return false;
        const names = typeof p.name === 'object' ? Object.values(p.name) : [p.name];
        return names.some(name => slugify(name) === productSlug);
    });
    return product;
}

function handleURL() {
    const path = window.location.pathname.split('/').filter(Boolean);
    const query = new URLSearchParams(window.location.search);

    console.log('Handling URL:', path, 'Current Language:', currentLang, 'Products Loaded:', allProducts.length);

    if (path.length === 0) {
        console.log('Showing home page');
        showPage('home', false);
        return;
    }

    const firstSegment = path[0];
    if (path.length === 1) {
        if (firstSegment === 'cart') {
            console.log('Showing cart page');
            showPage('cart', false);
            return;
        } else if (firstSegment === 'settings') {
            if (isLoggedIn) {
                console.log('Showing settings page');
                showPage('settings', false);
            } else {
                console.log('User not logged in, redirecting to home');
                showPage('home', false);
            }
            return;
        } else if (firstSegment === 'search' && query.has('q')) {
            const searchTerm = query.get('q');
            console.log('Showing search results for:', searchTerm);
            document.getElementById('search-bar').value = searchTerm;
            searchProducts();
            return;
        } else {
            const categoryKey = getCategoryKeyFromSlug(firstSegment);
            if (categoryKey) {
                console.log('Found category:', categoryKey);
                previousCategoryPage = categoryKey;
                showPage(categoryKey, false);
                return;
            }
        }
    } else if (path.length === 2) {
        const categorySlug = path[0];
        const productSlug = path[1];
        const categoryKey = getCategoryKeyFromSlug(categorySlug);

        console.log('Category Slug:', categorySlug, 'Product Slug:', productSlug, 'Mapped Category Key:', categoryKey);

        if (categoryKey) {
            previousCategoryPage = categoryKey;
            const product = findProductBySlug(categoryKey, productSlug);
            console.log('Product Found:', product);
            if (product) {
                console.log('Showing product page for ID:', product.id);
                showProductPage(product.id, false);
                return;
            } else {
                console.warn('Product not found, falling back to category:', categoryKey);
                showPage(categoryKey, false);
                return;
            }
        }
    }

    console.warn('No match found, falling back to home');
    showPage('home', false);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Set language synchronously before any other initialization
    const savedLang = localStorage.getItem('language') || 'en';
    console.log('Setting language to:', savedLang);
    currentLang = savedLang;
    document.getElementById('language-switcher').value = savedLang;
    changeLanguage(savedLang);

    loadCartFromLocalStorage();

    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${savedToken}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                isLoggedIn = true;
                currentUser = data.user;
                toggleProfileIcon();
                syncCartWithServer();
            } else {
                localStorage.removeItem('token');
            }
        })
        .catch(() => localStorage.removeItem('token'));
    }

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    window.addEventListener('popstate', () => {
        console.log('Popstate event triggered');
        handleURL();
    });

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });

    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('toggle-slide-bar').addEventListener('click', toggleSlideBar);
    document.querySelectorAll('.slide-bar-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            showPage(pageId);
        });
    });

    document.getElementById('profile-toggle').addEventListener('click', () => {
        if (isLoggedIn) {
            showPage('settings');
        } else {
            openAuthModal('sign-in');
        }
    });

    document.getElementById('sign-in-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        fetch('/api/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.requiresVerification) {
                    openAuthModal('signin-verification');
                } else {
                    isLoggedIn = true;
                    currentUser = data.user;
                    localStorage.setItem('token', data.token);
                    toggleProfileIcon();
                    closeAuthModal();
                    showNotification(translations[currentLang]['sign-in-success']);
                    syncCartWithServer();
                }
            } else {
                showNotification(data.error || 'Sign in failed', 'error');
            }
        })
        .catch(error => showNotification('Error signing in: ' + error.message, 'error'));
    });

    document.getElementById('signin-verification-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('signin-code').value;
        const email = document.getElementById('signin-email').value;
        fetch('/api/users/verify-signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                isLoggedIn = true;
                currentUser = data.user;
                localStorage.setItem('token', data.token);
                toggleProfileIcon();
                closeAuthModal();
                showNotification(translations[currentLang]['sign-in-success']);
                syncCartWithServer();
            } else {
                showNotification(data.error || 'Verification failed', 'error');
            }
        })
        .catch(error => showNotification('Error verifying sign-in: ' + error.message, 'error'));
    });

    document.getElementById('to-sign-up').addEventListener('click', () => openAuthModal('sign-up'));
    document.getElementById('to-forgot-password').addEventListener('click', () => openAuthModal('forgot-password'));

    document.getElementById('sign-up-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            password: document.getElementById('signup-password').value,
            city: document.getElementById('signup-city').value,
            neighborhood: document.getElementById('signup-neighborhood').value,
            postalCode: document.getElementById('signup-postal-code').value,
            phone: document.getElementById('signup-phone').value
        };
        fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(translations[currentLang]['sign-up-success']);
                openAuthModal('signup-verification');
            } else {
                showNotification(data.error || 'Sign up failed', 'error');
            }
        })
        .catch(error => showNotification('Error signing up: ' + error.message, 'error'));
    });

    document.getElementById('signup-verification-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('signup-code').value;
        const email = document.getElementById('signup-email').value;
        fetch('/api/users/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                isLoggedIn = true;
                currentUser = data.user;
                localStorage.setItem('token', data.token);
                toggleProfileIcon();
                closeAuthModal();
                showNotification(translations[currentLang]['sign-up-success']);
                syncCartWithServer();
            } else {
                showNotification(data.error || 'Verification failed', 'error');
            }
        })
        .catch(error => showNotification('Error verifying: ' + error.message, 'error'));
    });

    document.getElementById('forgot-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        fetch('/api/users/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Reset code sent to your email.');
                openAuthModal('forgot-verification');
            } else {
                showNotification(data.error || 'Failed to send code', 'error');
            }
        })
        .catch(error => showNotification('Error sending code: ' + error.message, 'error'));
    });

    document.getElementById('forgot-verification-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('forgot-code').value;
        const email = document.getElementById('forgot-email').value;
        fetch('/api/users/verify-forgot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                openAuthModal('reset-password');
            } else {
                showNotification(data.error || 'Verification failed', 'error');
            }
        })
        .catch(error => showNotification('Error verifying: ' + error.message, 'error'));
    });

    document.getElementById('reset-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const email = document.getElementById('forgot-email').value;
        fetch('/api/users/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeAuthModal();
                showNotification(translations[currentLang]['password-reset-success']);
            } else {
                showNotification(data.error || 'Reset failed', 'error');
            }
        })
        .catch(error => showNotification('Error resetting password: ' + error.message, 'error'));
    });

    document.getElementById('update-info-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedData = {
            name: document.getElementById('update-name').value,
            email: document.getElementById('update-email').value,
            phone: document.getElementById('update-phone').value,
            city: document.getElementById('update-city').value,
            neighborhood: document.getElementById('update-neighborhood').value,
            postalCode: document.getElementById('update-postal-code').value
        };
        fetch('/api/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                showNotification('Info updated successfully');
            } else {
                showNotification(data.error || 'Update failed', 'error');
            }
        })
        .catch(error => showNotification('Error updating info: ' + error.message, 'error'));
    });

    document.getElementById('change-password-btn').addEventListener('click', () => {
        showNotification('Change password feature coming soon');
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('token');
        toggleProfileIcon();
        showPage('home');
        showNotification('Logged out successfully');
    });

    document.getElementById('search-bar').addEventListener('input', searchProducts);
    document.getElementById('contact-btn').addEventListener('click', openContactModal);

    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const location = document.getElementById('location').value.trim();

        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        if (!name || !phone || !location) {
            showNotification('Please fill in all required fields: Name, Phone, and Location.', 'error');
            return;
        }

        const order = {
            name: name,
            phone: phone,
            location: location,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                img: item.img,
                quantity: item.quantity
            })),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            language: currentLang
        };

        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(isLoggedIn && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showOrderConfirmation(name, phone);
                cart = [];
                updateCartCount();
                updateCart();
                saveCartToLocalStorage();
                if (isLoggedIn) syncCartWithServer();
                this.reset();
            } else {
                showNotification(`Error submitting order: ${data.error || 'Unknown error'}`, 'error');
            }
        })
        .catch(error => showNotification(`Error submitting order: ${error.message}`, 'error'));
    });

    document.getElementById('rating-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitRating();
    });

    // Load products and then handle URL
    console.log('Loading products...');
    loadProducts().then(() => {
        console.log('Products loaded, handling URL');
        handleURL();
    });
});