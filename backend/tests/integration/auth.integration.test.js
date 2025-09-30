const request = require('supertest');
const app = require('../../server');
const { sequelize, User } = require('../../models');

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    try {
      // Use test database and sync
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
    } catch (error) {
      console.warn('Database not available for integration tests, skipping...');
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/v1/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered');
      expect(response.body.data.user).toMatchObject({
        name: userData.name,
        email: userData.email,
      });
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.stats).toMatchObject({
        recipesCount: 0,
        favoritesCount: 0,
        followersCount: 0,
        followingCount: 0,
      });

      // Verify user was created in database
      const dbUser = await User.findOne({ where: { email: userData.email } });
      expect(dbUser).toBeDefined();
      expect(dbUser.name).toBe(userData.name);
      expect(dbUser.password).not.toBe(userData.password); // Should be hashed
    });

    test('should return 409 if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // Register first time
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Try to register again with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already in use');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const userData = {
      name: 'Test User',
      email: 'login@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      // Register a user before each login test
      await request(app).post('/api/v1/auth/register').send(userData);
    });

    test('should login user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    test('should return 401 with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userData.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    test('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    test('should logout user successfully with valid token', async () => {
      // Register and get token
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'logout@example.com',
          password: 'password123',
        });

      const token = registerResponse.body.data.token;

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out');
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/current', () => {
    test('should return current user with valid token', async () => {
      // Register user
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Current User',
          email: 'current@example.com',
          password: 'password123',
        });

      const token = registerResponse.body.data.token;

      const response = await request(app)
        .get('/api/v1/auth/current')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('current@example.com');
      expect(response.body.data.user.name).toBe('Current User');
      expect(response.body.data.user.stats).toBeDefined();
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/current')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/current')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});