import express from 'express';
import jwt from 'jsonwebtoken';
import Feedback from '../models/feedback.js';
import User from '../models/user.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Submit feedback
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ message: 'Message cannot exceed 1000 characters' });
    }

    const feedback = new Feedback({
      name,
      email,
      message,
      userId: req.user._id
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        message: feedback.message,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get user's feedback history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('name email message createdAt');

    res.json({ feedbacks });
  } catch (error) {
    console.error('Feedback history error:', error);
    res.status(500).json({ message: 'Error fetching feedback history' });
  }
});

export default router;