# 🚀 Nexus App - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- Git

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/nexus-app?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5000
```

### 3. MongoDB Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and replace in `.env`

### 4. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Feedback
- `POST /api/feedback/submit` - Submit feedback (requires auth)
- `GET /api/feedback/history` - Get user's feedback history (requires auth)

## Features
✅ User Registration & Login
✅ JWT Authentication
✅ Feedback System
✅ Dark/Light Theme
✅ Responsive Design
✅ Modern UI with Glassmorphism
✅ MongoDB Integration
✅ Rate Limiting
✅ Security Headers

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Check your connection string and IP whitelist
2. **CORS Error**: Ensure FRONTEND_URL is set correctly
3. **JWT Error**: Make sure JWT_SECRET is set
4. **Port Already in Use**: Change PORT in .env file

### Development Tips
- Use `npm run dev` for development with auto-restart
- Check browser console for frontend errors
- Check terminal for backend errors
- Use Postman or similar tool to test API endpoints

## Project Structure
```
full stack/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── index.html      # Main HTML file
├── package.json        # Dependencies
└── .env               # Environment variables
```
