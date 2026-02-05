// API Configuration
const API_CONFIG = {
  development: 'http://localhost:5000',
  production: process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app'
};

export const API_BASE_URL = API_CONFIG[process.env.NODE_ENV as keyof typeof API_CONFIG] || API_CONFIG.development;

// API Helper functions
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_BASE_URL;