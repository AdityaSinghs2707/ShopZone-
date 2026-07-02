const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// ── @GET /api/cart ──
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/cart/add ──
const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.stock < qty)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: product._id, name: product.name, emoji: product.emoji, price: product.price, qty }],
      });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.items.push({ product: product._id, name: product.name, emoji: product.emoji, price: product.price, qty });
      }
      await cart.save();
    }

    res.json({ success: true, message: `${product.name} added to cart!`, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/cart/update ──
const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.qty = qty;
    }

    await cart.save();
    res.json({ success: true, message: 'Cart updated!', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/cart/remove/:productId ──
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ success: true, message: 'Item removed!', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/cart/clear ──
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) { cart.items = []; await cart.save(); }
    res.json({ success: true, message: 'Cart cleared!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
