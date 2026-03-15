const express = require('express');
const router = express.Router();
const { store, uuidv4 } = require('../store');
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  const requests = store.maintenance.filter(m => m.userId === req.user.id);
  res.json(requests);
});

router.post('/', protect, (req, res) => {
  const { rentalId, issue, description } = req.body;
  const request = {
    id: uuidv4(), userId: req.user.id, rentalId,
    issue, description, status: 'open',
    createdAt: new Date(), scheduledDate: null, feedback: null
  };
  store.maintenance.push(request);
  res.status(201).json(request);
});

router.post('/:id/feedback', protect, (req, res) => {
  const request = store.maintenance.find(m => m.id === req.params.id && m.userId === req.user.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  request.feedback = req.body.feedback;
  request.rating = req.body.rating;
  res.json(request);
});

module.exports = router;
