import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }
    
    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const endpoint = isSignup ? '/api/users/register' : '/api/users/login';
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isSignup) {
          localStorage.setItem('userId', data.userId.toString());
          localStorage.setItem('userEmail', email);
        } else {
          localStorage.setItem('userId', data.user.id.toString());
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('onboardingCompleted', data.needsOnboarding ? 'false' : 'true');
        }
        onLogin();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = () => {
    localStorage.setItem('userData', JSON.stringify({
      id: 999,
      email: 'demo@finarth.com',
      name: 'Demo User'
    }));
    localStorage.setItem('onboardingCompleted', 'true');
    onLogin();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#fafaf9' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ height: '48px', width: '48px', background: '#1c1917', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
              <span style={{ color: '#fafaf9', fontWeight: 'bold', fontSize: '20px' }}>F</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1c1917' }}>FinArth</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1c1917', marginBottom: '8px' }}>
            {isSignup ? 'Create Account' : 'Welcome back'}
          </h1>
          <p style={{ color: '#57534e' }}>
            {isSignup ? 'Sign up for your financial dashboard' : 'Sign in to your financial dashboard'}
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e7e5e4', padding: '32px' }}>
          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '14px' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#44403c', marginBottom: '8px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '12px', border: '1px solid #d6d3d1', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'all 0.2s' }}
                placeholder="Enter your email"
                required
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#78716c'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d6d3d1'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#44403c', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '12px', border: '1px solid #d6d3d1', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'all 0.2s' }}
                placeholder="Enter your password"
                required
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#78716c'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d6d3d1'}
              />
            </div>

            {isSignup && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#44403c', marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ display: 'block', width: '100%', padding: '12px', border: '1px solid #d6d3d1', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'all 0.2s' }}
                  placeholder="Confirm your password"
                  required
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#78716c'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#d6d3d1'}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', padding: '12px 16px', background: '#1c1917', color: '#fafaf9', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: isLoading ? 0.5 : 1, transition: 'all 0.2s' }}
              onMouseOver={(e) => !isLoading && ((e.target as HTMLButtonElement).style.background = '#292524')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.background = '#1c1917')}
            >
              {isLoading ? 'Loading...' : (isSignup ? 'Sign up' : 'Sign in')}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, borderTop: '1px solid #e7e5e4' }}></div>
            <span style={{ padding: '0 16px', fontSize: '14px', color: '#78716c' }}>or</span>
            <div style={{ flex: 1, borderTop: '1px solid #e7e5e4' }}></div>
          </div>

          <button
            onClick={handleQuickLogin}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #d6d3d1', color: '#44403c', fontWeight: '500', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}
            onMouseOver={(e) => ((e.target as HTMLButtonElement).style.background = '#fafaf9')}
            onMouseOut={(e) => ((e.target as HTMLButtonElement).style.background = 'white')}
          >
            Quick Demo Login
          </button>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#57534e' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                console.log('Toggle button clicked!');
                setIsSignup(!isSignup);
                setError('');
                setPassword('');
                setConfirmPassword('');
              }}
              style={{ color: '#44403c', fontWeight: '500', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.color = '#1c1917')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.color = '#44403c')}
            >
              {isSignup ? 'Sign in' : 'Sign up for free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;