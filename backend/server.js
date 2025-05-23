const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Message = require('./models/Message');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const PrivateMessage = require('./models/privateMessage');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const port = 3000;

app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:4200', 'https://angular-terry-barillon.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static('uploads'));

// Tableau pour stocker les utilisateurs connectés
let connectedUsers = []; // { socketId: string, username: string }

// Socket.io pour la messagerie publique
io.on('connection', async (socket) => {

  // Lorsqu'un utilisateur se connecte, on lui attribue un nom et on l'ajoute à la liste
  socket.on('user-connected', (username) => {
    connectedUsers.push({ socketId: socket.id, username });
    console.log(`${username} connected, ${connectedUsers[0]}`);
    io.emit('update-user-list', connectedUsers); // Envoie la liste des utilisateurs connectés à tous les clients
  });

  // Lorsqu'un utilisateur envoie un message
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    socket.emit('previousMessages', messages);
  } catch (err) {
    console.error(err);
  }

  socket.on('sendMessage', async (message) => {
    const newMessage = new Message({ content: message.content, sender: message.sender });
    try {
      await newMessage.save();
      io.emit('receiveMessage', newMessage);
    } catch (err) {
      console.error(err);
    }
  });

  // Lorsqu'un utilisateur se déconnecte, on le retire de la liste
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    connectedUsers = connectedUsers.filter(user => user.socketId !== socket.id);
    io.emit('update-user-list', connectedUsers); // Mise à jour de la liste des utilisateurs
  });
});

// Socket.io pour les messages privés
io.of('/private').on('connection', async (socket) => {
  console.log('New client connected to private chat');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  socket.on('sendPrivateMessage', async (message) => {
    const newPrivateMessage = new PrivateMessage({
      content: message.content,
      sender: message.sender,
      receiver: message.receiver
    });
    try {
      await newPrivateMessage.save();
      io.of('/private').to(message.room).emit('receivePrivateMessage', newPrivateMessage);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from private chat');
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
