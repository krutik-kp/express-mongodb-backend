const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post('/', auth, async (req, res) => {
  const category = new Category({ name: req.body.name });
  await category.save();
  res.json(category);
});

module.exports = router;
