const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let products = store.products;
  if (category) products = products.filter(p => p.category === category);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  res.json(products);
});

router.get('/featured', (req, res) => res.json(store.products.filter(p => p.featured)));

router.get('/categories', (req, res) => {
  const cats = [...new Set(store.products.map(p => p.category))];
  res.json(cats);
});

router.get('/:id', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', protect, adminOnly, (req, res) => {
  const product = { id: uuidv4(), ...req.body, available: true, featured: false, rating: 0, reviews: 0 };
  store.products.push(product);
  res.status(201).json(product);
});

router.put('/:id', protect, adminOnly, (req, res) => {
  const idx = store.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  store.products[idx] = { ...store.products[idx], ...req.body };
  res.json(store.products[idx]);
});

router.delete('/:id', protect, adminOnly, (req, res) => {
  const idx = store.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  store.products.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
