const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  const rentals = store.rentals.filter(r => r.userId === req.user.id);
  res.json(rentals);
});

router.get('/active', protect, (req, res) => {
  const rentals = store.rentals.filter(r => r.userId === req.user.id && r.status === 'active');
  res.json(rentals);
});

router.get('/history', protect, (req, res) => {
  const rentals = store.rentals.filter(r => r.userId === req.user.id && r.status !== 'active');
  res.json(rentals);
});

router.post('/create', protect, (req, res) => {
  try {
    const { deliveryAddress, deliveryDate, items } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items' });
    const orderId = uuidv4();
    const newRentals = items.map(item => {
      const product = store.products.find(p => p.id === item.productId);
      const priceKey = `price${item.tenure}`;
      const monthlyPrice = product ? product[priceKey] : 0;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + parseInt(item.tenure));
      return {
        id: uuidv4(), orderId, userId: req.user.id,
        productId: item.productId, product,
        tenure: item.tenure, monthlyPrice,
        totalPrice: monthlyPrice * item.tenure,
        status: 'active', startDate, endDate,
        deliveryAddress, deliveryDate,
        createdAt: new Date()
      };
    });
    store.rentals.push(...newRentals);
    // Create order
    const order = {
      id: orderId, userId: req.user.id,
      items: newRentals, deliveryAddress, deliveryDate,
      totalAmount: newRentals.reduce((s, r) => s + r.totalPrice, 0),
      status: 'confirmed', createdAt: new Date()
    };
    store.orders.push(order);
    // Clear cart
    store.carts[req.user.id] = [];
    res.status(201).json({ order, rentals: newRentals });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/extend', protect, (req, res) => {
  const rental = store.rentals.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!rental) return res.status(404).json({ message: 'Rental not found' });
  const { months } = req.body;
  const end = new Date(rental.endDate);
  end.setMonth(end.getMonth() + parseInt(months));
  rental.endDate = end;
  rental.tenure = parseInt(rental.tenure) + parseInt(months);
  res.json(rental);
});

router.post('/:id/schedule-pickup', protect, (req, res) => {
  const rental = store.rentals.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!rental) return res.status(404).json({ message: 'Rental not found' });
  rental.pickupDate = req.body.pickupDate;
  rental.status = 'pickup_scheduled';
  res.json(rental);
});

module.exports = router;
