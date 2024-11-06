const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post('/users/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.imageUrl = `/uploads/${req.file.filename}`;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users', async (req, res) => {

  // chiffrement du mot de passe

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ ...req.body, password: hashedPassword });

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ email, password }, 'secret');
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users/logout', async (req, res) => {
  try {
    token = '';
    res.status(200).send('Logged out');
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route pour mettre à jour le profil de l'utilisateur connecté
router.put('/users/me', auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      req.body,
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/check-email', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    res.json(!!user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;