const express = require('express');
const router = express.Router();
const { store } = require('../store');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', (req, res) => {
  const totalRevenue = store.rentals.reduce((s, r) => s + (r.totalPrice || 0), 0);
  res.json({
    totalUsers: store.users.filter(u => u.role !== 'admin').length,
    totalProducts: store.products.length,
    totalOrders: store.orders.length,
    totalRentals: store.rentals.length,
    activeRentals: store.rentals.filter(r => r.status === 'active').length,
    pendingMaintenance: store.maintenance.filter(m => m.status === 'open').length,
    totalRevenue
  });
});

router.get('/users', (req, res) => {
  res.json(store.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone })));
});

router.get('/orders', (req, res) => res.json(store.orders));
router.get('/rentals', (req, res) => res.json(store.rentals));
router.get('/maintenance', (req, res) => res.json(store.maintenance));

router.put('/orders/:id/status', (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = req.body.status;
  res.json(order);
});

router.put('/rentals/:id/status', (req, res) => {
  const rental = store.rentals.find(r => r.id === req.params.id);
  if (!rental) return res.status(404).json({ message: 'Not found' });
  rental.status = req.body.status;
  res.json(rental);
});

router.put('/maintenance/:id/status', (req, res) => {
  const req2 = store.maintenance.find(m => m.id === req.params.id);
  if (!req2) return res.status(404).json({ message: 'Not found' });
  req2.status = req.body.status;
  if (req.body.scheduledDate) req2.scheduledDate = req.body.scheduledDate;
  res.json(req2);
});

module.exports = router;
