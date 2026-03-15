const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  const cart = store.carts[req.user.id] || [];
  const enriched = cart.map(item => {
    const product = store.products.find(p => p.id === item.productId);
    return { ...item, product };
  });
  res.json(enriched);
});

router.post('/add', protect, (req, res) => {
  const { productId, tenure } = req.body;
  if (!productId || !tenure) return res.status(400).json({ message: 'productId and tenure required' });
  if (!store.carts[req.user.id]) store.carts[req.user.id] = [];
  const existing = store.carts[req.user.id].find(i => i.productId === productId);
  if (existing) { existing.tenure = tenure; }
  else { store.carts[req.user.id].push({ id: uuidv4(), productId, tenure, qty: 1 }); }
  res.json({ message: 'Added to cart' });
});

router.put('/update/:itemId', protect, (req, res) => {
  const cart = store.carts[req.user.id] || [];
  const item = cart.find(i => i.id === req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  Object.assign(item, req.body);
  res.json({ message: 'Updated' });
});

router.delete('/remove/:itemId', protect, (req, res) => {
  if (!store.carts[req.user.id]) return res.status(404).json({ message: 'Cart empty' });
  store.carts[req.user.id] = store.carts[req.user.id].filter(i => i.id !== req.params.itemId);
  res.json({ message: 'Removed' });
});

router.delete('/clear', protect, (req, res) => {
  store.carts[req.user.id] = [];
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
