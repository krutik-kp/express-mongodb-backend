const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// router.get('/', auth, async (req, res) => {
//   const products = await Product.find().populate('category');
//   res.json(products);
// });

router.post('/', auth, async (req, res) => {
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  await product.save();
  res.json(product);
});



router.get('/', auth, async (req, res) => {
  const { category, minPrice, maxPrice, search, sortBy, page = 1, limit = 5 } = req.query;

  const query = {};

  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$text = { $search: search };
  }

  const sort = {};
  if (sortBy === 'price_asc') sort.price = 1;
  else if (sortBy === 'price_desc') sort.price = -1;

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .populate('category') // Join with category
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.json({ total, products });
});

module.exports = router;
