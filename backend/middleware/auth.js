const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'secret'); // Utilisez la même clé secrète que celle utilisée pour signer le jeton
    const user = await User.findOne({ email: decoded.email }).select('-password');
    if (!user) {
      return res.status(401).send({ error: 'User not found. Authorization denied.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

module.exports = auth;