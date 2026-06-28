const Product = require('../models/Product');

// ── @GET /api/products ── (public, with filter/search/sort/pagination)
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, featured } = req.query;

    const query = {};
    if (category)  query.category  = category;
    if (featured)  query.isFeatured = true;
    if (search)    query.name = { $regex: search, $options: 'i' };

    const sortMap = {
      'price-asc':   { price: 1 },
      'price-desc':  { price: -1 },
      'rating-desc': { ratings: -1 },
      'newest':      { createdAt: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @GET /api/products/:id ──
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/products ── (admin only)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created!', product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── @PUT /api/products/:id ── (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product updated!', product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── @DELETE /api/products/:id ── (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @POST /api/products/:id/review ── (logged in users)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.calcAverageRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added!', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
