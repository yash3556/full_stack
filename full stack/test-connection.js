// Simple test script to verify backend connection
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testConnection() {
    console.log('🧪 Testing Backend Connection...\n');
    
    try {
        // Test if server is running
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword'
            })
        });
        
        if (response.status === 400) {
            console.log('✅ Backend is running! (Expected 400 for invalid credentials)');
            console.log('✅ API endpoints are accessible');
        } else {
            console.log(`⚠️  Unexpected response: ${response.status}`);
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend is not running. Please start it with: npm start');
        } else {
            console.log('❌ Connection error:', error.message);
        }
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Make sure MongoDB is connected');
    console.log('2. Check your .env file configuration');
    console.log('3. Test registration and login in the browser');
}

testConnection();

