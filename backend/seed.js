/**
 * Seed Script — Run once to populate DB with ShopZone products
 * Usage: node seed.js
 */
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User    = require('./models/User');

const products = [
  { name: 'Pro Headphones X1',    description: 'Premium noise-cancelling headphones with 40hr battery, Hi-Res audio, memory foam cushions.', price: 8999,  originalPrice: 12999, category: 'electronics', emoji: '🎧', badge: 'New', stock: 50, ratings: 4.9, numReviews: 284, isFeatured: true },
  { name: 'Air Max Pro 2026',     description: 'Lightweight running shoes with air-cushion sole. Perfect for daily training.', price: 4299,  originalPrice: 6499,  category: 'footwear',    emoji: '👟', badge: 'Sale', stock: 35, ratings: 4.2, numReviews: 156, isFeatured: true },
  { name: 'Smart Watch Ultra',    description: 'Fitness tracker with AMOLED display, SpO2, 14-day battery life.', price: 15999, originalPrice: 19999, category: 'accessories', emoji: '⌚', badge: '',   stock: 20, ratings: 4.8, numReviews: 421, isFeatured: true },
  { name: 'Premium Cotton Tee',   description: '100% organic cotton, pre-shrunk, ultra-soft everyday essential.', price: 1299,  originalPrice: 1999,  category: 'fashion',     emoji: '👕', badge: 'New', stock: 100, ratings: 4.1, numReviews: 98,  isFeatured: false },
  { name: 'Ultra Smartphone 15',  description: '6.7" AMOLED, 200MP camera, Snapdragon 8 Gen 3, 5000mAh battery.', price: 62999, originalPrice: 74999, category: 'electronics', emoji: '📱', badge: '',   stock: 15, ratings: 4.7, numReviews: 732, isFeatured: true },
  { name: 'Leather Tote Bag',     description: 'Genuine leather, spacious interior, magnetic clasp, multiple pockets.', price: 3499,  originalPrice: 5999,  category: 'fashion',     emoji: '👜', badge: 'Sale', stock: 25, ratings: 4.3, numReviews: 67,  isFeatured: false },
  { name: 'Heels Classic Edition',description: 'Stiletto heels with cushioned insole, available in 6 colors.', price: 2799,  originalPrice: 3999,  category: 'footwear',    emoji: '👠', badge: '',   stock: 30, ratings: 4.6, numReviews: 203, isFeatured: false },
  { name: 'Polarized Sunglasses', description: 'UV400 protection, polarized lenses, lightweight TR90 frame.', price: 1899,  originalPrice: 2999,  category: 'accessories', emoji: '🕶️', badge: 'New', stock: 60, ratings: 4.2, numReviews: 145, isFeatured: false },
  { name: 'Wireless Earbuds Pro', description: 'True wireless, ANC, 30hr total battery, IPX5 water resistant.', price: 5499,  originalPrice: 7999,  category: 'electronics', emoji: '🎵', badge: 'Hot', stock: 40, ratings: 4.5, numReviews: 312, isFeatured: true },
  { name: 'Sports Sneakers X',    description: 'Mesh upper, responsive foam midsole, anti-slip rubber outsole.', price: 3299,  originalPrice: 4999,  category: 'footwear',    emoji: '👞', badge: '',   stock: 45, ratings: 4.0, numReviews: 89,  isFeatured: false },
];

const adminUser = {
  name: 'Admin ShopZone',
  email: 'admin@shopzone.com',
  password: 'admin123',
  role: 'admin',
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany();
    await User.deleteMany({ role: 'admin' });

    await Product.insertMany(products);
    await User.create(adminUser);

    console.log(`✅ ${products.length} products seeded!`);
    console.log('✅ Admin user created → admin@shopzone.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
