import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { runAsync, getAsync } from '../db.js';

const INITIAL_BALANCE = 1000;

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await runAsync(
      `INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, INITIAL_BALANCE]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.id, username, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.id,
        username,
        email,
        balance: INITIAL_BALANCE
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await getAsync(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUserProfile(req, res) {
  try {
    const user = await getAsync(
      `SELECT id, username, email, balance, created_at FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
