const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest.js');
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

// route pour télécharger une image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
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

// route pour créer un utilisateur
router.post('/', async (req, res) => {

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


// route pour afficher la liste des utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// route pour se connecter
router.post('/login', async (req, res) => {
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

// route pour se déconnecter
router.post('/logout', async (req, res) => {
  try {
    token = '';
    res.status(200).send('Logged out');
  } catch (error) {
    res.status(500).send(error);
  }
});

// route pour trouver un utilisateur avec son id
router.get('/me', auth, async (req, res) => {
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
router.put('/me', auth, async (req, res) => {
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

router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    res.json(!!user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Afficher la liste des amis
router.get('/me/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email');
    res.status(200).json(user.friends);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Envoyer une demande d'ami
router.post('/me/friends/request', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    console.log(recipientId);
    const friendRequest = new FriendRequest({
      requester: req.user._id,
      recipient: recipientId
    });
    // Check si la demande d'ami existe déjà
    const existingRequest = await FriendRequest.findOne({ requester: req.user._id, recipient: recipientId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }
    await friendRequest.save();
    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
});

// Accepter une demande d'ami
router.post('/me/friends/accept', auth, async (req, res) => {
  try {
    const { requestId } = req.body;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Ajouter les amis dans les listes d'amis des utilisateurs
    await User.findByIdAndUpdate(friendRequest.requester, { $push: { friends: friendRequest.recipient } });
    await User.findByIdAndUpdate(friendRequest.recipient, { $push: { friends: friendRequest.requester } });

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Refuser une demande d'ami
router.post('/me/friends/reject', auth, async (req, res) => {
  try {
    const { requestId } = req.body;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    friendRequest.status = 'rejected';
    await friendRequest.save();
    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Afficher les demandes d'amis
router.get('/me/friends/requests', auth, async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ recipient: req.user._id, status: 'pending' }).populate('requester', 'name email');
    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;