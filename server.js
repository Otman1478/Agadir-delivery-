const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key'; // Replace with a secure key in production

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// SQLite Database Connection
const db = new sqlite3.Database('database.db', (err) => {
    if (err) console.error('Database error:', err);
    else console.log('Connected to SQLite database');
});

// Initialize Database Tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        city TEXT,
        neighborhood TEXT,
        postalCode TEXT,
        verificationCode TEXT,
        resetCode TEXT,
        signinCode TEXT
    )`, (err) => { if (err) console.error('Error creating users table:', err); });

    db.run('ALTER TABLE users ADD COLUMN signinCode TEXT', (err) => {
        if (err && err.message.includes('duplicate column name')) {
            console.log('signinCode column already exists');
        } else if (err) console.error('Error adding signinCode column:', err);
    });

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        discount REAL DEFAULT 0,
        category TEXT,
        images TEXT,
        description TEXT
    )`, (err) => { if (err) console.error('Error creating products table:', err); });

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        location TEXT,
        items TEXT,
        total REAL,
        language TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => { if (err) console.error('Error creating orders table:', err); });

    db.run(`CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
    )`, (err) => { if (err) console.error('Error creating ratings table:', err); });

    // Insert Sample Products
    db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) console.error('Error checking products count:', err);
        else if (row.count === 0) {
            console.log('Inserting sample products...');
            const sampleProducts = [
                { name: JSON.stringify({ en: 'Apples', fr: 'Pommes', ar: 'تفاح' }), price: 25, discount: 0, category: 'grocery', images: JSON.stringify(['/uploads/apples.jpg']), description: 'Fresh red apples.' },
                { name: JSON.stringify({ en: 'Pizza', fr: 'Pizza', ar: 'بيتزا' }), price: 45, discount: 0, category: 'food', images: JSON.stringify(['/uploads/pizza.jpg']), description: 'Delicious pizza.' },
                { name: JSON.stringify({ en: 'T-Shirt', fr: 'T-shirt', ar: 'تي شيرت' }), price: 150, discount: 0, category: 'clothes', images: JSON.stringify(['/uploads/tshirt.jpg']), description: 'Cotton T-shirt.' },
                { name: JSON.stringify({ en: 'Beef Steak', fr: 'Steak de Boeuf', ar: 'ستيك لحم بقري' }), price: 120, discount: 10, category: 'meats', images: JSON.stringify(['/uploads/beef.jpg']), description: 'Juicy beef steak.' },
                { name: JSON.stringify({ en: 'Football', fr: 'Ballon de Foot', ar: 'كرة قدم' }), price: 80, discount: 0, category: 'sports', images: JSON.stringify(['/uploads/football.jpg']), description: 'Standard football.' },
                { name: JSON.stringify({ en: 'Cola', fr: 'Cola', ar: 'كولا' }), price: 15, discount: 5, category: 'drinks', images: JSON.stringify(['/uploads/cola.jpg']), description: 'Refreshing cola drink.' }
            ];
            sampleProducts.forEach(product => {
                db.run('INSERT INTO products (name, price, discount, category, images, description) VALUES (?, ?, ?, ?, ?, ?)',
                    [product.name, product.price, product.discount, product.category, product.images, product.description],
                    (err) => { if (err) console.error('Error inserting sample product:', err); });
            });
        }
    });
});

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohamadsafari18k8@gmail.com', // Replace with your Gmail address
        pass: 'bkxvshnmjuyhpivb'        // Replace with your App Password
    },
    debug: true,
    logger: true
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Category Translations (mirrored from client-side)
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

// Helper Function to Get Category Key from Slug
function getCategoryKeyFromSlug(slug) {
    for (const lang in categoryTranslations) {
        const categoryMap = categoryTranslations[lang];
        for (const key in categoryMap) {
            if (categoryMap[key] === slug) {
                return key; // Return English key (e.g., "grocery")
            }
        }
    }
    return null;
}

// User Sign-Up
app.post('/api/users/signup', async (req, res) => {
    const { name, email, password, city, neighborhood, postalCode, phone } = req.body;
    if (!name || !email || !password || !city || !neighborhood || !postalCode || !phone) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
            if (row) return res.status(400).json({ success: false, error: 'Email already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            db.run(
                'INSERT INTO users (name, email, password, phone, city, neighborhood, postalCode, verificationCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, email, hashedPassword, phone, city, neighborhood, postalCode, verificationCode],
                (err) => {
                    if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });

                    const mailOptions = {
                        from: 'mohamadsafari18k8@gmail.com',
                        to: email,
                        subject: 'Verify Your Email - Agadir Delivery',
                        text: `Welcome to Agadir Delivery!\n\nYour verification code is: ${verificationCode}\n\nEnter this code to complete your sign-up.`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending signup email:', error);
                            return res.status(500).json({ success: false, error: 'Failed to send verification email' });
                        }
                        console.log('Signup verification email sent:', info.response);
                        res.json({ success: true });
                    });
                }
            );
        });
    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Verify Sign-Up
app.post('/api/users/verify', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, error: 'Missing email or code' });

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row || row.verificationCode !== code) return res.status(400).json({ success: false, error: 'Invalid verification code' });

        const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' });
        db.run('UPDATE users SET verificationCode = NULL WHERE email = ?', [email], (updateErr) => {
            if (updateErr) return res.status(500).json({ success: false, error: 'Database error: ' + updateErr.message });
            res.json({
                success: true,
                user: { id: row.id, name: row.name, email: row.email, phone: row.phone, city: row.city, neighborhood: row.neighborhood, postalCode: row.postalCode },
                token
            });
        });
    });
});

// User Sign-In with 2FA
app.post('/api/users/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Missing email or password' });

    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
            if (!row || !(await bcrypt.compare(password, row.password))) return res.status(400).json({ success: false, error: 'Invalid credentials' });
            if (row.verificationCode) return res.status(400).json({ success: false, error: 'Email not verified' });

            const signinCode = Math.floor(100000 + Math.random() * 900000).toString();
            db.run('UPDATE users SET signinCode = ? WHERE email = ?', [signinCode, email], (updateErr) => {
                if (updateErr) return res.status(500).json({ success: false, error: 'Database error: ' + updateErr.message });

                const mailOptions = {
                    from: 'mohamadsafari18k8@gmail.com',
                    to: email,
                    subject: 'Sign-In Verification - Agadir Delivery',
                    text: `Hello ${row.name},\n\nYour sign-in verification code is: ${signinCode}\n\nEnter this code to complete your sign-in.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending sign-in email:', error);
                        return res.status(500).json({ success: false, error: 'Failed to send verification email' });
                    }
                    console.log('Sign-in verification email sent:', info.response);
                    res.json({ success: true, requiresVerification: true });
                });
            });
        });
    } catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Verify Sign-In
app.post('/api/users/verify-signin', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, error: 'Missing email or code' });

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row || row.signinCode !== code) return res.status(400).json({ success: false, error: 'Invalid verification code' });

        const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' });
        db.run('UPDATE users SET signinCode = NULL WHERE email = ?', [email], (updateErr) => {
            if (updateErr) return res.status(500).json({ success: false, error: 'Database error: ' + updateErr.message });
            res.json({
                success: true,
                user: { id: row.id, name: row.name, email: row.email, phone: row.phone, city: row.city, neighborhood: row.neighborhood, postalCode: row.postalCode },
                token
            });
        });
    });
});

// Forgot Password
app.post('/api/users/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Missing email' });

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row) return res.status(400).json({ success: false, error: 'User not found' });

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        db.run('UPDATE users SET resetCode = ? WHERE email = ?', [resetCode, email], (updateErr) => {
            if (updateErr) return res.status(500).json({ success: false, error: 'Database error: ' + updateErr.message });

            const mailOptions = {
                from: 'mohamadsafari18k8@gmail.com',
                to: email,
                subject: 'Password Reset Code - Agadir Delivery',
                text: `Hello ${row.name},\n\nYour password reset code is: ${resetCode}\n\nUse this code to reset your password.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending reset email:', error);
                    return res.status(500).json({ success: false, error: 'Failed to send reset email' });
                }
                console.log('Reset email sent:', info.response);
                res.json({ success: true });
            });
        });
    });
});

// Verify Forgot Password Code
app.post('/api/users/verify-forgot', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, error: 'Missing email or code' });

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row || row.resetCode !== code) return res.status(400).json({ success: false, error: 'Invalid reset code' });
        res.json({ success: true });
    });
});

// Reset Password
app.post('/api/users/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ success: false, error: 'Missing email or new password' });

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row || !row.resetCode) return res.status(400).json({ success: false, error: 'Reset not initiated or code already used' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password = ?, resetCode = NULL WHERE email = ?', [hashedPassword, email], (updateErr) => {
            if (updateErr) return res.status(500).json({ success: false, error: 'Database error: ' + updateErr.message });
            res.json({ success: true });
        });
    });
});

// Update User Info
app.put('/api/users/update', authenticateToken, async (req, res) => {
    const { name, email, phone, city, neighborhood, postalCode } = req.body;
    const userId = req.user.id;

    if (!name || !email || !phone || !city || !neighborhood || !postalCode) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    db.run(
        'UPDATE users SET name = ?, email = ?, phone = ?, city = ?, neighborhood = ?, postalCode = ? WHERE id = ?',
        [name, email, phone, city, neighborhood, postalCode, userId],
        (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
                res.json({
                    success: true,
                    user: { id: row.id, name: row.name, email: row.email, phone: row.phone, city: row.city, neighborhood: row.neighborhood, postalCode: row.postalCode }
                });
            });
        }
    );
});

// Get Current User
app.get('/api/users/me', authenticateToken, (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({
            success: true,
            user: { id: row.id, name: row.name, email: row.email, phone: row.phone, city: row.city, neighborhood: row.neighborhood, postalCode: row.postalCode }
        });
    });
});

// Sync Cart with Server
app.post('/api/users/cart', authenticateToken, (req, res) => {
    const { cart } = req.body;
    if (!Array.isArray(cart)) return res.status(400).json({ success: false, error: 'Cart must be an array' });
    res.json({ success: true });
});

// Get All Products with Ratings
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });

        const products = rows.map(row => processProduct(row));
        db.all('SELECT productId, AVG(rating) as avgRating, COUNT(*) as ratingsCount FROM ratings GROUP BY productId', [], (ratingErr, ratingRows) => {
            if (ratingErr) return res.status(500).json({ success: false, error: 'Database error fetching ratings: ' + ratingErr.message });

            const ratingsMap = ratingRows.reduce((map, r) => {
                map[r.productId] = { avgRating: parseFloat(r.avgRating.toFixed(1)), ratingsCount: r.ratingsCount };
                return map;
            }, {});

            const productsWithRatings = products.map(product => ({
                ...product,
                avgRating: ratingsMap[product.id]?.avgRating || 0,
                ratingsCount: ratingsMap[product.id]?.ratingsCount || 0
            }));

            res.json(productsWithRatings);
        });
    });
});

// Get Products by Category
app.get('/api/products/category/:category', (req, res) => {
    const { category } = req.params;
    db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });

        const products = rows.map(row => processProduct(row));
        db.all('SELECT productId, AVG(rating) as avgRating, COUNT(*) as ratingsCount FROM ratings GROUP BY productId', [], (ratingErr, ratingRows) => {
            if (ratingErr) return res.status(500).json({ success: false, error: 'Database error fetching ratings: ' + ratingErr.message });

            const ratingsMap = ratingRows.reduce((map, r) => {
                map[r.productId] = { avgRating: parseFloat(r.avgRating.toFixed(1)), ratingsCount: r.ratingsCount };
                return map;
            }, {});

            const productsWithRatings = products.map(product => ({
                ...product,
                avgRating: ratingsMap[product.id]?.avgRating || 0,
                ratingsCount: ratingsMap[product.id]?.ratingsCount || 0
            }));

            res.json(productsWithRatings);
        });
    });
});

// Get Single Product by ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row) return res.status(404).json({ success: false, error: 'Product not found' });

        const product = processProduct(row);
        db.get('SELECT AVG(rating) as avgRating, COUNT(*) as ratingsCount FROM ratings WHERE productId = ?', [id], (ratingErr, ratingRow) => {
            if (ratingErr) return res.status(500).json({ success: false, error: 'Database error fetching ratings: ' + ratingErr.message });

            product.avgRating = ratingRow.avgRating ? parseFloat(ratingRow.avgRating.toFixed(1)) : 0;
            product.ratingsCount = ratingRow.ratingsCount || 0;

            db.all('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 5', [product.category, id], (similarErr, similarRows) => {
                if (similarErr) return res.status(500).json({ success: false, error: 'Database error fetching similar products: ' + similarErr.message });

                const similarProducts = similarRows.map(row => processProduct(row));
                res.json({ success: true, product, similarProducts });
            });
        });
    });
});

// Search Products
app.get('/api/products/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Search query is required' });

    db.all('SELECT * FROM products WHERE name LIKE ?', [`%${q}%`], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });

        const products = rows.map(row => processProduct(row));
        db.all('SELECT productId, AVG(rating) as avgRating, COUNT(*) as ratingsCount FROM ratings GROUP BY productId', [], (ratingErr, ratingRows) => {
            if (ratingErr) return res.status(500).json({ success: false, error: 'Database error fetching ratings: ' + ratingErr.message });

            const ratingsMap = ratingRows.reduce((map, r) => {
                map[r.productId] = { avgRating: parseFloat(r.avgRating.toFixed(1)), ratingsCount: r.ratingsCount };
                return map;
            }, {});

            const productsWithRatings = products.map(product => ({
                ...product,
                avgRating: ratingsMap[product.id]?.avgRating || 0,
                ratingsCount: ratingsMap[product.id]?.ratingsCount || 0
            }));

            res.json(productsWithRatings);
        });
    });
});

// Submit Rating
app.post('/api/ratings', (req, res) => {
    const { productId, rating, comment } = req.body;
    let userId = null;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            // Ignore invalid token; proceed as anonymous
        }
    }

    if (!productId || !rating) return res.status(400).json({ success: false, error: 'Missing productId or rating' });
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    if (comment && comment.length > 30) return res.status(400).json({ success: false, error: 'Comment must be 30 characters or less' });

    db.get('SELECT id FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        if (userId) {
            db.get('SELECT id FROM ratings WHERE userId = ? AND productId = ?', [userId, productId], (err, existingRating) => {
                if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
                if (existingRating) return res.status(400).json({ success: false, error: 'You have already rated this product' });

                insertRating(userId, productId, rating, comment, res);
            });
        } else {
            insertRating(null, productId, rating, comment, res);
        }
    });
});

function insertRating(userId, productId, rating, comment, res) {
    db.run('INSERT INTO ratings (userId, productId, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, productId, rating, comment || ''],
        (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
            res.json({ success: true });
        });
}

// Get Ratings for a Product
app.get('/api/ratings/:productId', (req, res) => {
    const { productId } = req.params;
    db.all('SELECT rating, comment, timestamp FROM ratings WHERE productId = ?', [productId], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        res.json({ success: true, ratings: rows });
    });
});

// Place Order
app.post('/api/orders', (req, res) => {
    const { name, phone, location, items, total, language } = req.body;
    const timestamp = new Date().toISOString();
    if (!name || !phone || !location || !items || !total || !language) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Items must be a non-empty array' });
    }
    db.run('INSERT INTO orders (name, phone, location, items, total, language, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, phone, location, JSON.stringify(items), total, language, timestamp],
        (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
            res.json({ success: true });
        });
});

// Admin Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/admin/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        const products = rows.map(row => processProduct(row));
        res.json(products);
    });
});

app.post('/api/admin/products', upload.array('images', 5), (req, res) => {
    const { name_en, name_fr, name_ar, price, category, discount, description } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);
    if (!name_en || !name_fr || !name_ar || !price || !category || images.length === 0) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const name = JSON.stringify({ en: name_en, fr: name_fr, ar: name_ar });
    const discountValue = discount ? parseFloat(discount) : 0;
    db.run('INSERT INTO products (name, price, discount, category, images, description) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, discountValue, category, JSON.stringify(images), description || ''],
        (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
            res.json({ success: true });
        });
});

app.put('/api/admin/products/:id', upload.array('images', 5), (req, res) => {
    const { id } = req.params;
    const { name_en, name_fr, name_ar, price, discount, category, description } = req.body;
    const images = req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`) : null;

    if (!name_en || !name_fr || !name_ar || !price || !category) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    db.get('SELECT images FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        if (!row) return res.status(404).json({ success: false, error: 'Product not found' });

        const updatedImages = images || JSON.parse(row.images);
        const name = JSON.stringify({ en: name_en, fr: name_fr, ar: name_ar });
        const discountValue = discount ? parseFloat(discount) : 0;

        db.run(
            'UPDATE products SET name = ?, price = ?, discount = ?, category = ?, images = ?, description = ? WHERE id = ?',
            [name, price, discountValue, category, JSON.stringify(updatedImages), description || '', id],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ success: false, error: 'Database error: ' + updateErr.message });
                res.json({ success: true });
            }
        );
    });
});

app.delete('/api/admin/products/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        res.json({ success: true });
    });
});

app.get('/api/admin/orders', (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        const orders = rows.map(row => ({ ...row, items: JSON.parse(row.items) }));
        res.json(orders);
    });
});

app.delete('/api/admin/orders/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM orders WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error: ' + err.message });
        res.json({ success: true });
    });
});

// SPA Routing with Category and Product Support
app.get('/:category', (req, res, next) => {
    const { category } = req.params;
    const categoryKey = getCategoryKeyFromSlug(category);
    if (categoryKey) {
        // Valid category URL, serve index.html and let client handle it
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next(); // Pass to next middleware (catch-all or API routes)
    }
});

app.get('/:category/:product', (req, res, next) => {
    const { category } = req.params;
    const categoryKey = getCategoryKeyFromSlug(category);
    if (categoryKey) {
        // Valid category with product slug, serve index.html
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

// Catch-All Route (moved after specific routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Helper Function to Process Product Data
function processProduct(row) {
    const originalPrice = row.price;
    const discount = row.discount || 0;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
    return {
        ...row,
        name: JSON.parse(row.name),
        images: JSON.parse(row.images),
        price: originalPrice,
        discount: discount,
        discountedPrice: parseFloat(discountedPrice.toFixed(2))
    };
}