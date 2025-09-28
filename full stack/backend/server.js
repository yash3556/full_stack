import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

// MongoDB Connection with better error handling
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Check your MONGODB_URI in .env file');
        console.log('2. Verify your Atlas cluster is running');
        console.log('3. Check if your IP is whitelisted in Atlas');
        console.log('4. Verify database username/password');
        process.exit(1);
    }
};

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Start server only after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📱 Frontend: http://localhost:${PORT}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
});