const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing FinArth API Endpoints');
  console.log('=================================\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.data);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    try {
      const register = await axios.post(`${BASE_URL}/users/register`, {
        email: testEmail,
        password: testPassword
      });
      console.log('✅ Registration successful:', register.data);
      
      const userId = register.data.userId;

      // Test user login
      console.log('\n3. Testing user login...');
      const login = await axios.post(`${BASE_URL}/users/login`, {
        email: testEmail,
        password: testPassword
      });
      console.log('✅ Login successful:', login.data);

      // Test onboarding
      console.log('\n4. Testing onboarding...');
      const onboarding = await axios.post(`${BASE_URL}/users/onboarding`, {
        userId: userId,
        name: 'Test User',
        country: 'India',
        age: 25,
        riskPreference: 'moderate',
        familiarInvestments: ['Mutual Funds', 'Stocks'],
        returnEstimate: 'ai',
        selectedOptions: ['strategy', 'returns']
      });
      console.log('✅ Onboarding successful:', onboarding.data);

      // Test getting user data
      console.log('\n5. Testing get user data...');
      const userData = await axios.get(`${BASE_URL}/users/${userId}`);
      console.log('✅ User data retrieved:', userData.data);

    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  User already exists, testing login with existing user...');
        
        // Try login with existing user
        const login = await axios.post(`${BASE_URL}/users/login`, {
          email: 'sandeepgugulothu.iitg@gmail.com',
          password: 'password123' // You'll need to know the actual password
        });
        console.log('✅ Login with existing user:', login.data);
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAPI();