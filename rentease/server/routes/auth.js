const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { store, uuidv4 } = require('../store');
const { protect } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'rentease_secret_2024';

const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, name: user.name },
  JWT_SECRET,
  { expiresIn: '30d' }
);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
    if (store.users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name, email, password: hashed, phone: phone || '', address: address || '', role: 'user' };
    store.users.push(user);
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, name, email, role: user.role, phone: user.phone, address: user.address } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = store.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get current user
router.get('/me', protect, (req, res) => {
  const user = store.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address });
});

module.exports = router;
