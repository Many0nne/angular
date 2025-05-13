const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const userRoutes = require('../../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

jest.mock('../../middleware/auth', () => (req, res, next) => {
  req.user = { _id: 'mockUserId', email: 'test@example.com' };
  next();
});

describe('User Routes', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/angular', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/api/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.email).toBe('john@example.com');
    });

    it('should return 400 if user data is invalid', async () => {
      const res = await request(app).post('/api/users').send({
        email: 'invalid-email',
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('should log in a user and return a token', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const res = await request(app).post('/api/users/login').send({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 404 if user is not found', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 if password is incorrect', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const res = await request(app).post('/api/users/login').send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/users/me', () => {
    it('should return the authenticated user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      const res = await request(app).get('/api/users/me');

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 404 if user is not found', async () => {
      const res = await request(app).get('/api/users/me');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update the authenticated user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      const res = await request(app).put('/api/users/me').send({
        name: 'Updated Name',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });

    it('should return 404 if user is not found', async () => {
      const res = await request(app).put('/api/users/me').send({
        name: 'Updated Name',
      });

      expect(res.statusCode).toBe(404);
    });
  });
});