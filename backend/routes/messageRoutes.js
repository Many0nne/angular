const express = require('express');
const router = express.Router();
const PrivateMessage = require('../models/privateMessage');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Route pour récupérer les utilisateurs
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('email name');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route pour récupérer tous les messages privés
router.get('/private-messages', auth, async (req, res) => {
    try {
      const messages = await PrivateMessage.find().sort({ timestamp: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// Route pour récupérer les messages privés
router.get('/private-messages/:userId', auth, async (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.user._id;
  console.log(`utilisation de la route /private-messages/:${userId} par l'utilisateur ${currentUserId}`);
  console.log(`userId = ${currentUserId}`);

  try {
    const messages = await PrivateMessage.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route pour envoyer un message privé
router.post('/send', auth, async (req, res) => {
  const { receiver, content } = req.body;
  const sender = req.user._id;

  try {
    const receiverUser = await User.findOne({ email: receiver });
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new PrivateMessage({ sender, receiver: receiverUser._id, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;