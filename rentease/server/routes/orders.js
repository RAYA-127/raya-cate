const express = require('express');
const router = express.Router();
const { store } = require('../store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  const orders = store.orders.filter(o => o.userId === req.user.id);
  res.json(orders);
});

router.get('/:id', protect, (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

router.post('/:id/cancel', protect, (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'cancelled';
  store.rentals.filter(r => r.orderId === req.params.id).forEach(r => r.status = 'cancelled');
  res.json(order);
});

module.exports = router;
