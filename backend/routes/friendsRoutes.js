const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Envoyer une demande d'ami
router.post('/friends/request', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const friendRequest = new FriendRequest({
      requester: req.user._id,
      recipient: recipientId
    });
    await friendRequest.save();
    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accepter une demande d'ami
router.post('/friends/accept', auth, async (req, res) => {
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
router.post('/friends/reject', auth, async (req, res) => {
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
router.get('/friends/requests', auth, async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ recipient: req.user._id, status: 'pending' }).populate('requester', 'name email');
    res.status(200).json(friendRequests);
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

module.exports = router;