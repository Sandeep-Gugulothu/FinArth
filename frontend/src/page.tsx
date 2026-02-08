import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import OnboardingPage from './pages/onboarding.tsx';
import AiAgent from './pages/AiAgent.tsx';
import Dashboard from './pages/Dashboard.tsx';
import GoalPage from './pages/GoalPage.tsx';
import API_BASE_URL from './utils/api.ts';

// Login Component
const Login = ({ onLogin }: {
  onLogin: () => void;
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const ArrowRight = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const Eye = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOff = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  const Mail = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-stone-400">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const Lock = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-stone-400">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', data.user.id.toString());
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('onboardingCompleted', data.needsOnboarding ? 'false' : 'true');
        onLogin();
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }

    setIsLoading(false);
  };



  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="FinArth" className="h-12 w-12" />
            <span className="text-2xl font-bold text-stone-900">FinArth</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-stone-600">Sign in to your financial dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300 rounded"
                />
                <span className="ml-2 text-sm text-stone-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-stone-700 hover:text-stone-900 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 text-stone-50 font-semibold rounded-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-stone-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={18} /></>
              )}
            </button>
          </form>


          <p className="mt-6 text-center text-sm text-stone-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Signup Component
const Signup = ({ onSignup }: {
  onSignup: () => void;
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const ArrowRight = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const Eye = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOff = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  const Mail = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-stone-400">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const Lock = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-stone-400">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', data.userId.toString());
        localStorage.setItem('userEmail', email);
        localStorage.setItem('authToken', data.token); // Crucial for live environment
        onSignup();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="FinArth" className="h-12 w-12" />
            <span className="text-2xl font-bold text-stone-900">FinArth</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-600">Sign up for your financial dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 text-stone-50 font-semibold rounded-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-stone-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard component has been moved to src/pages/Dashboard.tsx



// Simple icon components
const Target = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </svg>
);

const ArrowRight = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Bot = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TrendingUp = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);



const Navbar = ({ onGetStarted, isConnecting }: { onGetStarted: () => void; isConnecting: boolean }) => (
  <nav className="fixed top-0 left-0 right-0 w-full z-50 border-b border-stone-300/20 bg-stone-50/90 backdrop-blur-md overflow-hidden">
    {/* Navbar design elements */}
    <div className="absolute top-2 right-20 w-4 h-4 border border-stone-400/20 rotate-45 animate-pulse" />
    <div className="absolute top-3 left-32 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />

    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="FinArth" className="h-8 w-8" />
        <span className="text-xl font-bold text-stone-900">FinArth</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
        <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it Works</a>
      </div>

      <button
        onClick={onGetStarted}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 shadow-sm transition-all text-sm font-medium text-stone-50 disabled:opacity-50"
      >
        <span>{isConnecting ? 'Loading...' : 'Get Started'}</span>
      </button>
    </div>
  </nav>
);

const PoweredBy = () => (
  <div className="bg-stone-50 py-12 border-y border-stone-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
      <span className="text-[10px] font-bold text-stone-800 uppercase tracking-[0.3em] opacity-100">Powered by</span>
    </div>
    <div className="flex w-max animate-marquee whitespace-nowrap items-center hover:[animation-play-state:paused]">
      {/* Set 1 */}
      <div className="flex items-center gap-24 md:gap-40 px-12 md:px-20">
        <img src="/CGAPI_logo.png" alt="CoinGecko" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform" />
        <img src="/WEEX_logo.png" alt="Weexs" className="h-[24px] md:h-[32px] object-contain hover:scale-110 transition-transform" />
        <img src="/open_router.png" alt="OpenRouter" className="h-12 md:h-16 object-contain scale-125 hover:scale-[1.35] transition-transform" />
        <img src="/opik-logo.png" alt="Opik" className="h-[22px] md:h-[26px] object-contain hover:scale-110 transition-transform" />
      </div>
      {/* Set 2 */}
      <div className="flex items-center gap-24 md:gap-40 px-12 md:px-20">
        <img src="/CGAPI_logo.png" alt="CoinGecko" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform" />
        <img src="/WEEX_logo.png" alt="Weexs" className="h-[24px] md:h-[32px] object-contain hover:scale-110 transition-transform" />
        <img src="/open_router.png" alt="OpenRouter" className="h-12 md:h-16 object-contain scale-125 hover:scale-[1.35] transition-transform" />
        <img src="/opik-logo.png" alt="Opik" className="h-[22px] md:h-[26px] object-contain hover:scale-110 transition-transform" />
      </div>
      {/* Set 3 */}
      <div className="flex items-center gap-24 md:gap-40 px-12 md:px-20">
        <img src="/CGAPI_logo.png" alt="CoinGecko" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform" />
        <img src="/WEEX_logo.png" alt="Weexs" className="h-[24px] md:h-[32px] object-contain hover:scale-110 transition-transform" />
        <img src="/open_router.png" alt="OpenRouter" className="h-12 md:h-16 object-contain scale-125 hover:scale-[1.35] transition-transform" />
        <img src="/opik-logo.png" alt="Opik" className="h-[22px] md:h-[26px] object-contain hover:scale-110 transition-transform" />
      </div>
    </div>
  </div>
);

const Hero = ({ onGetStarted, isConnecting }: { onGetStarted: () => void; isConnecting: boolean }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-stone-50/50 selection:bg-stone-200 perspective-1000">
      {/* Background: Dot Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#a8a29e 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }} />

      {/* Dynamic Background Blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-stone-200/40 via-blue-50/30 to-purple-50/30 rounded-full blur-[100px] -z-10 transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * 0.02}px), ${mousePos.y * 0.02}px)`
        }}
      />

      {/* House Goal Card - Left Floating Visual (Positioned below heading level) */}
      <div
        className="absolute top-1/2 left-4 lg:left-10 -z-5 transform -rotate-6 hidden xl:block transition-transform duration-1000 ease-out hover:scale-105 hover:z-20 transition-all cursor-default"
        style={{ transform: `translate(-${mousePos.x * 0.01}px, calc(-50% - ${mousePos.y * 0.01}px)) rotate(-6deg)` }}
      >
        <div className="bg-white p-6 border border-stone-200 rounded-[2rem] shadow-xl w-[320px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
            <Target size={100} />
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h4 className="font-extrabold text-stone-900 text-2xl tracking-tight">House</h4>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 bg-stone-100 border border-stone-200 rounded text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  10 Year Mission
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Progress Bar Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Blueprint Progress</span>
                <span className="text-sm font-bold text-stone-900 font-mono">5%</span>
              </div>
              <div className="w-full h-2 bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                <div className="bg-stone-900 h-full w-[5%] rounded-full" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 leading-none">Savings</p>
                <p className="text-sm font-bold text-stone-800 font-mono tracking-tight leading-none">₹20,000,000</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 leading-none">Target</p>
                <p className="text-sm font-bold text-stone-800 font-mono tracking-tight leading-none">₹8,954,238</p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="pt-4 border-t border-stone-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-stone-400" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Automated Monitoring</span>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-stone-400 uppercase mb-1">Monthly Draft</p>
                <p className="text-xs font-black text-stone-900 font-mono">₹31,751</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-sm text-stone-600 text-sm font-medium mb-8 animate-fade-in-up hover:shadow-md transition-shadow cursor-default">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
          </span>
          Autonomous Financial Planning
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 mb-8 scroll-animate">
          Financial Confidence <br />
          <span className="relative inline-block">
            <span className="relative z-10">Engine</span>
            <div className="absolute -bottom-2 md:-bottom-4 left-0 right-0 h-4 md:h-6 bg-stone-200/50 -rotate-1 -z-10 rounded-full blur-sm transform scale-x-110"></div>
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed scroll-animate">
          Convert your life goals into safe, automated, and understandable financial action.
          No fear, no confusion, just confident progress toward what matters to you.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 scroll-animate">
          <button
            onClick={onGetStarted}
            disabled={isConnecting}
            className="w-full md:w-auto px-8 py-4 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isConnecting ? 'Loading...' : 'Start Planning'} <ArrowRight size={18} />
          </button>
          <button
            className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-50 border border-stone-200 transition-all transform hover:-translate-y-1 hover:shadow-md flex items-center justify-center gap-2 group"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Why Choose FinArth?
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Trust indicators - Enhanced */}
        <div className="mt-16 flex flex-col items-center gap-4 scroll-animate opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 10}&backgroundColor=e5e5e5`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600 shadow-sm">
              10k+
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-sm font-semibold text-stone-600">Trusted by multiple investors</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureBento = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 bg-stone-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-stone-100/50 to-stone-50" />

      {/* FeatureBento design elements */}
      <div className="absolute top-16 left-20 w-32 h-32 border-2 border-indigo-400/25 rotate-12 animate-spin" style={{ animationDuration: '18s' }} />
      <div className="absolute top-40 right-24 w-24 h-24 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-full animate-pulse" />
      <div className="absolute bottom-28 left-1/5 w-16 h-16 border border-dashed border-rose-400/40 rotate-45 animate-bounce" />
      <div className="absolute top-1/4 right-1/3 w-18 h-18 bg-amber-400/25 animate-ping" style={{ animationDelay: '2s', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 transform-gpu hover:scale-105 transition-all duration-300">Why Choose FinArth?</h2>
          <p className="text-stone-600">Our Financial Confidence Engine solves real problems with four core components.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="md:col-span-2 p-8 rounded-3xl bg-white border border-stone-200 hover:border-blue-400/50 transition-all group relative overflow-hidden transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-400/10 scroll-animate"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 0 ? 'rotateX(2deg) rotateY(-2deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative z-10">
              <div className="h-12 w-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-600 mb-6 transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Bot size={24} />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">The Conversational Guide</h3>
              <p className="text-stone-600 max-w-md">
                Explains finance in plain language, answers "Should I?" questions, and understands your unique situation.
              </p>
            </div>
            {/* Animated Chat Simulation */}
            <div className="absolute right-4 bottom-4 w-64 space-y-3 opacity-40 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 group-hover:scale-105">
              <div className="bg-stone-50 rounded-2xl rounded-bl-none p-3 text-[11px] text-stone-600 border border-stone-200 shadow-sm max-w-[200px]">
                "How is my portfolio doing ?"
              </div>
              <div className="bg-stone-800 text-stone-50 rounded-2xl rounded-br-none p-3 text-[11px] shadow-md max-w-[200px] ml-auto">
                "Your portfolio is currently up 2.90% (BTC) and 4.42% (ADA), High Risk Exposure: Your 100% crypto allocation ..."
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-72 h-72 bg-gradient-to-tl from-blue-100/20 to-transparent -z-10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div
            className="md:row-span-2 p-8 rounded-3xl bg-white border border-stone-200 hover:border-purple-400/50 transition-all group transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-400/10 scroll-animate"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 1 ? 'rotateX(-2deg) rotateY(2deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="h-12 w-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-700 mb-6 transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">The Goal Architect</h3>
            <p className="text-stone-600 mb-6">
              Converts dreams into executable plans with risk-tailored strategies and multiple achievement pathways.
            </p>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 transform-gpu group-hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-stone-400 to-stone-600 animate-pulse" />
                <div>
                  <div className="text-sm font-bold text-stone-900">House Goal</div>
                  <div className="text-xs text-stone-500">₹50L • 7 Years • Frontier</div>
                </div>
              </div>
              <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-stone-600 animate-pulse" />
              </div>
            </div>
          </div>

          <div
            className="p-8 rounded-3xl bg-white border border-stone-200 hover:border-green-400/50 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-green-400/10 scroll-animate group overflow-hidden relative"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 2 ? 'rotateX(2deg) rotateY(2deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
              transformStyle: 'preserve-3d'
            }}
          >
            <h3 className="text-xl font-bold text-stone-900 mb-2">The Automated Partner</h3>
            <p className="text-stone-600 text-sm mb-6">
              Handles complex calculations, monitors progress continuously, and automates execution.
            </p>

            {/* Data Stream / Computation Visual */}
            <div className="space-y-3 mt-auto">
              <div className="flex items-center gap-2">
                <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-stone-300 group-hover:bg-stone-500 transition-all duration-700" />
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-400">MATH</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-stone-200 group-hover:bg-stone-400 transition-all duration-700 delay-75" />
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-300">DATA</span>
              </div>
            </div>
          </div>

          <div
            className="p-8 rounded-3xl bg-white border border-stone-200 hover:border-orange-400/50 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-400/10 scroll-animate group overflow-hidden relative"
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === 3 ? 'rotateX(-2deg) rotateY(-2deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
              transformStyle: 'preserve-3d'
            }}
          >
            <h3 className="text-xl font-bold text-stone-900 mb-2">The Trust Builder</h3>
            <p className="text-stone-600 text-sm mb-6">
              No black-box recommendations. Every calculation cross-checked and explained.
            </p>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 transform group-hover:translate-y-[-4px] transition-all duration-500">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Logic Verification</span>
                <div className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[8px] font-bold text-green-400">VERIFIED</div>
              </div>
              <div className="font-mono text-[9px] text-stone-400 leading-tight">
                const ROI = ((currentPrice - entryPrice) / entryPrice) * 100;<br />
                // Cross-checked via WEEX & CoinGecko
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-20 bg-stone-50 relative overflow-hidden">
      {/* Background Texture - Light Mesh */}
      <div className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Half - Scroll-Responsive Confusion Geometry & Heading */}
          <div className="space-y-12 sticky top-32">
            <div className="pl-4 max-w-lg">
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">The Execution Gap</h2>
              <p className="text-lg text-stone-600 leading-relaxed font-medium">
                Most people know what they want. The problem is bridging the gap between intention and action.
              </p>
            </div>

            <div className="relative h-80 flex items-center justify-center">
              {/* Confusion spiral - rotates with scroll */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-56 h-56 border-4 border-dashed border-blue-400/20 rounded-full"
                  style={{ transform: `rotate(${scrollY * 0.3}deg)` }}
                />
                <div
                  className="absolute w-40 h-40 border-2 border-purple-500/20 rounded-full"
                  style={{ transform: `rotate(${-scrollY * 0.2}deg)` }}
                />
                <div
                  className="absolute w-28 h-28 border border-amber-600/20 rounded-full"
                  style={{ transform: `rotate(${scrollY * 0.4}deg)` }}
                />
              </div>

              {/* Question marks - move with scroll */}
              <div
                className="absolute top-8 left-12 text-5xl text-blue-500/30 font-bold"
                style={{ transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px)` }}
              >?</div>
              <div
                className="absolute top-16 right-16 text-4xl text-purple-500/30 font-bold"
                style={{ transform: `translateY(${Math.cos(scrollY * 0.015) * 15}px)` }}
              >?</div>

              {/* Central confusion symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="text-7xl text-stone-500/20 font-bold"
                  style={{ transform: `rotate(${scrollY * 0.1}deg) scale(${1 + Math.sin(scrollY * 0.005) * 0.1})` }}
                >?</div>
              </div>
            </div>
          </div>

          {/* Right Half - Interactive Problem/Solution Cards */}
          <div className="space-y-5">
            {/* Problem 1: Financial Paralysis */}
            <div className="group relative bg-white border border-stone-200 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 overflow-hidden cursor-default h-[260px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-stone-50 rounded-bl-[3rem] -mr-6 -mt-6 transition-all duration-500 group-hover:scale-[2.5] group-hover:bg-blue-50/50" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-end items-start">
                  <span className="text-[10px] font-bold px-3 py-1 bg-stone-100 text-stone-500 rounded-full group-hover:bg-white group-hover:text-blue-600 transition-colors uppercase tracking-widest border border-stone-200 group-hover:border-blue-100">
                    Problem 01
                  </span>
                </div>

                <div className="relative flex-1 mt-4">
                  {/* Problem State */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-4">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Financial Paralysis</h3>
                    <p className="text-stone-600 text-[15px] leading-relaxed">
                      "I don't know where to start."<br />
                      Overwhelmed by thousands of options, conflicting advice, and fear of making the wrong move.
                    </p>
                  </div>

                  {/* Solution State - Engine UI */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col justify-center">
                    <div className="space-y-3">
                      <div className="mb-1">
                        <h3 className="text-base font-bold text-stone-900">Goal-to-Action Engine</h3>
                      </div>

                      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-2">
                        <div className="flex justify-between items-center text-sm border-b border-stone-100 pb-2">
                          <span className="text-stone-500 text-xs">Monthly SIP</span>
                          <span className="font-mono font-bold text-stone-900">₹25,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stone-500 text-xs">Feasibility</span>
                          <span className="font-mono font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">85% Achievable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem 2: Investment Blindness */}
            <div className="group relative bg-white border border-stone-200 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 overflow-hidden cursor-default h-[260px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-stone-50 rounded-bl-[3rem] -mr-6 -mt-6 transition-all duration-500 group-hover:scale-[2.5] group-hover:bg-purple-50/50" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-end items-start">
                  <span className="text-[10px] font-bold px-3 py-1 bg-stone-100 text-stone-500 rounded-full group-hover:bg-white group-hover:text-purple-600 transition-colors uppercase tracking-widest border border-stone-200 group-hover:border-purple-100">
                    Problem 02
                  </span>
                </div>

                <div className="relative flex-1 mt-4">
                  {/* Problem State */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-4">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Investment Blindness</h3>
                    <p className="text-stone-600 text-[15px] leading-relaxed">
                      "Is my money growing or dying?"<br />
                      No unified view. Scattered investments. Cannot track real ROI or catch underperforming assets in time.
                    </p>
                  </div>

                  {/* Solution State - Dashboard UI */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col justify-center">
                    <div className="space-y-3">
                      <div className="mb-1">
                        <h3 className="text-base font-bold text-stone-900">Portfolio Intelligence</h3>
                      </div>

                      <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-sm space-y-2">
                        <div className="flex justify-between items-end border-b border-stone-100 pb-2">
                          <div>
                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Total Portfolio</p>
                            <p className="text-sm font-bold text-stone-900">₹12.5L</p>
                          </div>
                          <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">+5.2% Today</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] items-center">
                            <span className="text-stone-600">Crypto (BTC)</span>
                            <span className="font-mono font-bold text-stone-700">+12.4%</span>
                          </div>
                          <div className="flex justify-between text-[10px] items-center">
                            <span className="text-stone-600">Eq (Nifty)</span>
                            <span className="font-mono font-bold text-stone-700">+1.2%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem 3: Financial Loneliness */}
            <div className="group relative bg-white border border-stone-200 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 overflow-hidden cursor-default h-[260px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-stone-50 rounded-bl-[3rem] -mr-6 -mt-6 transition-all duration-500 group-hover:scale-[2.5] group-hover:bg-green-50/50" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-end items-start">
                  <span className="text-[10px] font-bold px-3 py-1 bg-stone-100 text-stone-500 rounded-full group-hover:bg-white group-hover:text-green-600 transition-colors uppercase tracking-widest border border-stone-200 group-hover:border-green-100">
                    Problem 03
                  </span>
                </div>

                <div className="relative flex-1 mt-4">
                  {/* Problem State */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-100 translate-y-0 group-hover:opacity-0 group-hover:-translate-y-4">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Financial Loneliness</h3>
                    <p className="text-stone-600 text-[15px] leading-relaxed">
                      "I need expert advice but can't afford it."<br />
                      Generic robo-advisors don't listen. Human advisors are expensive. Decisions are made in isolation.
                    </p>
                  </div>

                  {/* Solution State - Chat UI */}
                  <div className="absolute inset-0 transition-all duration-500 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col justify-center">
                    <div className="space-y-3">
                      <div className="mb-1">
                        <h3 className="text-base font-bold text-stone-900">AI Financial Partner</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-stone-100 rounded-lg rounded-tl-none p-3 text-[11px] text-stone-600 border border-stone-200">
                          Should I invest in Bitcoin now?
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg rounded-tr-none p-3 text-[11px] shadow-sm">
                          Considering your 30% risk appetite, limit exposure to 5%. Here's why...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Start filling line when section enters viewport
        // Adjust offset to match the timing of the reveal
        const startOffset = viewportHeight * 0.4;
        const relativeY = startOffset - rect.top;

        if (relativeY > 0) {
          setLineHeight(relativeY);
        } else {
          setLineHeight(0);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 bg-stone-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-100 via-stone-50/30 to-stone-100" />

      {/* HowItWorks design elements */}
      <div className="absolute top-20 left-16 w-28 h-28 border-2 border-stone-400/25 rotate-45 animate-spin" style={{ animationDuration: '25s' }} />
      <div className="absolute top-48 right-20 w-20 h-20 bg-gradient-to-br from-stone-400/30 to-stone-500/30 rounded-full animate-pulse" />
      <div className="absolute bottom-32 left-1/3 w-10 h-10 border border-dashed border-stone-500/40 animate-bounce" />
      <div className="absolute top-1/3 right-1/5 w-14 h-14 bg-stone-400/20 animate-ping" style={{ animationDelay: '1.5s', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 scroll-animate">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 transform-gpu hover:scale-105 transition-all duration-300">How FinArth Works</h2>
          <p className="text-stone-600">Simple steps to financial confidence</p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-stone-300 to-stone-200 hidden md:block" />

          {/* Crazy design element on the right - Scroll responsive */}
          <div className="absolute right-0 top-0 w-80 h-96 hidden lg:block overflow-hidden"
            style={{ transform: `rotate(${scrollY * 0.05}deg) scale(${1 + scrollY * 0.0001})` }}>
            {/* Morphing blob */}
            <div className="absolute top-16 right-16 w-32 h-32 bg-gradient-to-br from-stone-400/20 to-stone-600/20 rounded-full animate-pulse transform rotate-45"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                transform: `rotate(${45 + scrollY * 0.1}deg) scale(${1 + Math.sin(scrollY * 0.01) * 0.1})`
              }} />

            {/* Floating geometric shapes */}
            <div className="absolute top-8 right-32 w-16 h-16 border-2 border-stone-500/30 rotate-12 animate-spin"
              style={{
                animationDuration: '8s',
                transform: `rotate(${12 + scrollY * 0.2}deg)`
              }} />
            <div className="absolute top-32 right-8 w-12 h-12 bg-gradient-to-r from-stone-500/40 to-stone-600/40 transform rotate-45 animate-bounce"
              style={{
                animationDelay: '1s',
                transform: `rotate(${45 + scrollY * 0.15}deg) translateY(${Math.sin(scrollY * 0.02) * 10}px)`
              }} />

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 384"
              style={{ transform: `rotate(${scrollY * 0.03}deg)` }}>
              <path d="M50 50 Q150 100 250 50 T350 150" stroke="url(#gradient1)" strokeWidth="2" fill="none" className="animate-pulse" />
              <path d="M100 200 Q200 150 300 200 T400 300" stroke="url(#gradient2)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78716c" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#57534e" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4b5563" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            {/* Orbiting particles */}
            <div className="absolute top-24 right-24 w-4 h-4 bg-stone-500/40 rounded-full animate-ping"
              style={{ transform: `translate(${Math.cos(scrollY * 0.01) * 10}px, ${Math.sin(scrollY * 0.01) * 10}px)` }} />
            <div className="absolute top-40 right-40 w-3 h-3 bg-stone-400/40 rounded-full animate-ping"
              style={{
                animationDelay: '1s',
                transform: `translate(${Math.cos(scrollY * 0.015 + 1) * 15}px, ${Math.sin(scrollY * 0.015 + 1) * 15}px)`
              }} />
            <div className="absolute top-56 right-20 w-2 h-2 bg-stone-300/40 rounded-full animate-ping"
              style={{
                animationDelay: '2s',
                transform: `translate(${Math.cos(scrollY * 0.02 + 2) * 8}px, ${Math.sin(scrollY * 0.02 + 2) * 8}px)`
              }} />

            {/* Abstract mesh pattern */}
            <div className="absolute bottom-16 right-12 w-24 h-24 opacity-30">
              <div className="grid grid-cols-4 gap-1 h-full">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`bg-gradient-to-br from-stone-400 to-stone-600 animate-pulse`}
                    style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>

            {/* Floating rings */}
            <div className="absolute top-12 right-56 w-20 h-20 border border-dashed border-indigo-400/40 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
            <div className="absolute bottom-20 right-48 w-14 h-14 border-2 border-pink-400/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          </div>

          <div className="space-y-12 relative pl-12 md:pl-24 pb-8">
            {/* Background Line */}
            <div className="absolute left-8 top-6 bottom-6 w-[1px] bg-stone-200 hidden md:block" />

            {/* Anchor dots */}
            <div className="absolute left-8 top-6 bottom-6 w-[1px] hidden md:block">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-stone-200 transition-all duration-300 ${activeStep === i ? 'bg-stone-800 scale-125' : 'bg-white'}`}
                  style={{ top: `${i * 50}%` }}
                />
              ))}
            </div>

            {/* Traveling Progress Line - Fixed Start */}
            <div
              className="absolute left-8 w-[1px] bg-stone-800 hidden md:block transition-all duration-100 ease-out"
              style={{
                top: '1.5rem',
                height: `${Math.max(0, lineHeight - 100)}px`,
                maxHeight: 'calc(100% - 3rem)'
              }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-800 rounded-full border border-white shadow-sm" />
            </div>

            {[
              {
                title: "Share Your Goal",
                desc: "Tell us your current savings, target amount, and timeline in plain English."
              },
              {
                title: "AI Analysis",
                desc: "Our AI calculates required returns, assigns your personality, and validates for safety."
              },
              {
                title: "Continuous Risk Monitoring",
                desc: "Stay protected with 24/7 oversight. We track market volatility and auto-adjust your strategy to keep you on the fastest path to wealth."
              }
            ].map((step, i) => (
              <div
                key={i}
                className="relative py-4 transition-all duration-300 cursor-default group"
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div className={`max-w-xl transition-all duration-300 ${activeStep === i ? 'translate-x-4' : 'translate-x-0'}`}>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-stone-900">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-stone-100 border-t border-stone-300 py-12 relative overflow-hidden">
    {/* Footer design elements */}
    <div className="absolute top-8 left-24 w-16 h-16 border border-stone-400/20 rotate-45 animate-pulse" />
    <div className="absolute top-6 right-32 w-12 h-12 bg-stone-300/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-8 left-1/3 w-8 h-8 border-2 border-stone-400/25 animate-bounce" />
    <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-stone-200/40 rotate-12 animate-pulse" />
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="FinArth" className="h-6 w-6" />
          <span className="text-lg font-bold text-stone-900">FinArth</span>
        </div>
        <p className="text-stone-600 text-sm max-w-xs">
          Financial Confidence Engine for the modern investor.
        </p>
      </div>

      <div>
        <h4 className="text-stone-900 font-bold mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-stone-600">
          <li><button className="hover:text-stone-800 text-left">Dashboard</button></li>
          <li><button className="hover:text-stone-800 text-left">Planning</button></li>
          <li><button className="hover:text-stone-800 text-left">Analytics</button></li>
        </ul>
      </div>

      <div>
        <h4 className="text-stone-900 font-bold mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-stone-600">
          <li><button className="hover:text-stone-800 text-left">About</button></li>
          <li><button className="hover:text-stone-800 text-left">Blog</button></li>
          <li><button className="hover:text-stone-800 text-left">Contact</button></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-stone-300 text-center md:text-left text-xs text-stone-500">
      © 2024 FinArth. All rights reserved. We are not financial advisors. This platform is for educational purposes only. Please do your own research (DYOR) and consult with qualified financial professionals before making investment decisions.
    </div>
  </footer>
);

export default function Page() {
  const navigate = useNavigate();
  const [connecting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in-up');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    const userData = localStorage.getItem('userData');
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted') === 'true';
    const userId = localStorage.getItem('userId');

    if (userData && hasCompletedOnboarding) {
      navigate('/dashboard');
    } else if (userId) {
      navigate('/onboarding');
    } else {
      navigate('/onboarding');
    }
  };

  const handleSignup = () => {
    navigate('/onboarding');
  };

  const handleLogout = () => {
    navigate('/');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  };

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  // Landing Page Component
  const LandingPage = () => (
    <main className="min-h-screen bg-stone-50 selection:bg-stone-300/30 overflow-x-hidden relative">
      {/* Glitter particles */}
      <div className="glitter" style={{ left: '10%', animationDelay: '0s' }} />
      <div className="glitter" style={{ left: '20%', animationDelay: '0.5s' }} />
      <div className="glitter" style={{ left: '30%', animationDelay: '1s' }} />
      <div className="glitter" style={{ left: '40%', animationDelay: '1.5s' }} />
      <div className="glitter" style={{ left: '50%', animationDelay: '2s' }} />
      <div className="glitter" style={{ left: '60%', animationDelay: '2.5s' }} />
      <div className="glitter" style={{ left: '70%', animationDelay: '0.3s' }} />
      <div className="glitter" style={{ left: '80%', animationDelay: '0.8s' }} />
      <div className="glitter" style={{ left: '90%', animationDelay: '1.3s' }} />
      <div className="glitter" style={{ left: '15%', animationDelay: '1.8s' }} />
      <div className="glitter" style={{ left: '25%', animationDelay: '2.3s' }} />
      <div className="glitter" style={{ left: '35%', animationDelay: '0.7s' }} />
      <div className="glitter" style={{ left: '45%', animationDelay: '1.2s' }} />
      <div className="glitter" style={{ left: '55%', animationDelay: '1.7s' }} />
      <div className="glitter" style={{ left: '65%', animationDelay: '2.2s' }} />
      <div className="glitter" style={{ left: '75%', animationDelay: '0.4s' }} />
      <div className="glitter" style={{ left: '85%', animationDelay: '0.9s' }} />
      <div className="glitter" style={{ left: '95%', animationDelay: '1.4s' }} />

      {/* Global floating elements - Enhanced */}
      <div className="fixed top-1/4 right-8 w-6 h-6 border-2 border-blue-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="fixed top-1/2 left-8 w-8 h-8 border border-purple-400/30 rotate-45 animate-float" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-1/4 right-1/4 w-4 h-4 bg-green-400/30 animate-float" style={{ animationDelay: '4s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      <div className="fixed top-1/3 left-1/4 w-5 h-5 bg-orange-400/25 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-1/3 right-1/5 w-7 h-7 border border-dashed border-pink-400/30 animate-float" style={{ animationDelay: '3s' }} />
      <style>{`
        body {
          padding-top: 64px;
        }
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glitter {
          position: fixed;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706);
          border-radius: 50%;
          pointer-events: none;
          animation: glitter 3s linear infinite;
          z-index: 1000;
        }
        .glitter:nth-child(2n) {
          background: linear-gradient(45deg, #60a5fa, #3b82f6, #2563eb);
          animation-delay: -1s;
        }
        .glitter:nth-child(3n) {
          background: linear-gradient(45deg, #a78bfa, #8b5cf6, #7c3aed);
          animation-delay: -2s;
        }
        @keyframes glitter {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          10% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-100vh) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0);
          }
        }
        @keyframes morph {
          0%, 100% {
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          }
          25% {
            clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
          }
          50% {
            clip-path: polygon(40% 0%, 60% 0%, 100% 40%, 100% 60%, 60% 100%, 40% 100%, 0% 60%, 0% 40%);
          }
          75% {
            clip-path: polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
      `}</style>
      <Navbar onGetStarted={handleGetStarted} isConnecting={connecting} />
      <Hero onGetStarted={handleGetStarted} isConnecting={connecting} />
      <PoweredBy />
      <UseCases />
      <HowItWorks />
      <FeatureBento />
      <Footer />
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
      <Route path="/onboarding" element={<OnboardingPage onComplete={handleOnboardingComplete} />} />
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/dashboard/goals" element={<GoalPage />} />
      <Route path="/dashboard/:tab" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/pgas/ai-agent" element={<AiAgent />} />
    </Routes>
  );
}