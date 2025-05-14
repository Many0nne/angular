// filepath: c:\wamp64\www\angular\backend\scripts\init-db.js
const mongoose = require('mongoose');
const User = require('../models/User'); // Assurez-vous que le chemin est correct
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/angular';

async function initializeDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Supprimez les données existantes si nécessaire
    await User.deleteMany();

    // Ajoutez des utilisateurs de test
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    ];

    await User.insertMany(users);
    console.log('Database initialized with test data');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();