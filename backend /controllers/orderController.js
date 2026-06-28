const Order = require('../models/Order');
const Cart  = require('../models/Cart');

const PROMO_CODES = { SHOP10: 500, SAVE200: 200 };

// ── @POST /api/orders ── (place order)
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, promoCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    const itemsPrice    = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryPrice = itemsPrice > 499 ? 0 : 99;
    const discount      = promoCode ? (PROMO_CODES[promoCode.toUpperCase()] || 0) : 0;
    const totalPrice    = itemsPrice + deliveryPrice - discount;

    const order = await Order.create({
      user: req.user._id,
      orderItems: cart.items.map((i) => ({
        product: i.product,
        name:    i.name,
        emoji:   i.emoji,
        price:   i.price,
        qty:     i.qty,
      })),
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      deliveryPrice,
      discount,
      totalPrice,
    });

    // Clear cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, message: '🎉 Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/orders/my ── (my orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/orders/:id ── (order detail)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    // Users can only see their own orders
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/orders ── (admin: all orders)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
    res.json({ success: true, count: orders.length, totalRevenue, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/orders/:id/status ── (admin: update status)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        ...(orderStatus === 'delivered' ? { deliveredAt: Date.now(), paymentStatus: 'paid' } : {}),
      },
      { new: true }
    );
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, message: 'Order status updated!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
