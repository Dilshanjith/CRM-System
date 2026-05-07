const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email.toLowerCase()).get();

    if (!snapshot.empty) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to Firestore
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: 'user',
      createdAt: new Date()
    };

    const docRef = await usersRef.add(newUser);

    // Generate JWT token
    const payload = {
      user: {
        id: docRef.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, user: payload.user });
      }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email.toLowerCase()).get();

    let userDoc;
    let userData;

    if (snapshot.empty) {
      // Auto-seed the demo user if they don't exist yet
      if (email === 'admin@example.com' && password === 'password123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const newUser = {
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Demo Admin',
          role: 'admin',
          createdAt: new Date()
        };
        const newDocRef = await usersRef.add(newUser);
        userDoc = { id: newDocRef.id };
        userData = newUser;
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      userDoc = snapshot.docs[0];
      userData = userDoc.data();

      // Compare passwords
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Generate JWT token
    const payload = {
      user: {
        id: userDoc.id,
        email: userData.email,
        role: userData.role,
        name: userData.name
      }
    };

    // Optional: Log the login activity
    await db.collection('login_history').add({
      userId: userDoc.id,
      email: userData.email,
      loginTime: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress
    });

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
        console.log("Login jwt key", token);
      }
    );

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', require('../middleware/auth.middleware'), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
