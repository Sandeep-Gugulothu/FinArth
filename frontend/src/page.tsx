import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import OnboardingPage from './onboarding.tsx';

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
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify(data.user));
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

  const handleQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-stone-800 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-stone-50 font-bold text-xl">F</span>
            </div>
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

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-stone-200"></div>
            <span className="px-4 text-sm text-stone-500">or</span>
            <div className="flex-1 border-t border-stone-200"></div>
          </div>

          <button
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Loading...' : 'Quick Demo Login'}
          </button>

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
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userId', data.userId.toString());
        localStorage.setItem('userEmail', email);
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
            <div className="h-12 w-12 bg-stone-800 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-stone-50 font-bold text-xl">F</span>
            </div>
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

// Dashboard Component
const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  type Message = {
    id: number;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot' as const,
      content: "Hello! I'm your AI financial advisor. I can help you with investment planning, goal setting, and portfolio optimization. What would you like to discuss today?",
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/dashboard/')) {
      const tab = path.split('/dashboard/')[1] || 'overview';
      setActiveTab(tab);
    } else if (path === '/dashboard') {
      setActiveTab('overview');
    }
  }, [location]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/dashboard/${tabId}`);
  };



  const Home = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const TrendingUp = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const User = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const Send = ({ size = 20 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'agent', label: 'AI Agent', icon: Bot },
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call ReAct agent API
      const response = await fetch('http://localhost:8000/api/agent/generate-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentInput })
      });

      const data = await response.json();
      
      if (data.success) {
        // Add reasoning steps as separate messages
        const stepMessages: Message[] = data.data.steps.map((step: any, index: number) => ({
          id: messages.length + 2 + index,
          type: 'bot' as const,
          content: `**Step ${index + 1}**\n\n**Thought:** ${step.thought}${step.action ? `\n\n**Action:** ${step.action}` : ''}${step.observation ? `\n\n**Observation:** ${step.observation}` : ''}`,
          timestamp: new Date()
        }));

        // Add final answer
        const finalMessage: Message = {
          id: messages.length + 2 + data.data.steps.length,
          type: 'bot' as const,
          content: `**Final Answer:**\n\n${data.data.finalAnswer}`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, ...stepMessages, finalMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error calling ReAct agent:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsTyping(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderOverview = () => {
    const stats = [
      { label: 'Total Portfolio', value: '₹12,45,000', change: '+8.2%', positive: true },
      { label: 'Monthly SIP', value: '₹25,000', change: 'Active', positive: true },
      { label: 'Goals Progress', value: '3/5', change: 'On Track', positive: true },
      { label: 'Expected Returns', value: '12.4%', change: '+0.8%', positive: true },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 border-l-4 border-stone-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">{stat.label}</p>
                <span className={`text-xs px-2 py-1 font-mono ${
                  stat.positive ? 'bg-stone-100 text-stone-700' : 'bg-stone-100 text-stone-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-stone-900 font-mono">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-stone-200 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900 mb-4 border-b border-stone-200 pb-2">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'SIP Investment', fund: 'HDFC Top 100', amount: '₹8,333', time: '2 hours ago' },
                { action: 'Goal Updated', fund: 'House Purchase', amount: '₹50L target', time: '1 day ago' },
                { action: 'Portfolio Rebalanced', fund: 'Auto-adjustment', amount: '+2.1%', time: '3 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-stone-900">{activity.action}</p>
                    <p className="text-sm text-stone-600">{activity.fund}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-stone-900">{activity.amount}</p>
                    <p className="text-xs text-stone-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 border border-stone-200 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900 mb-4 border-b border-stone-200 pb-2">Goal Progress</h3>
            <div className="space-y-4">
              {[
                { goal: 'House Purchase', current: 12.5, target: 50, progress: 25 },
                { goal: 'Emergency Fund', current: 3.2, target: 6, progress: 53 },
                { goal: 'Retirement', current: 8.7, target: 100, progress: 9 },
              ].map((goal, i) => (
                <div key={i} className="space-y-2 pb-4 border-b border-stone-100 last:border-b-0">
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-900">{goal.goal}</span>
                    <span className="text-sm text-stone-600 font-mono">₹{goal.current}L / ₹{goal.target}L</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2">
                    <div 
                      className="bg-stone-700 h-2 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-500 font-mono">{goal.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAgent = () => (
    <div className="bg-white border border-stone-200 shadow-sm h-[600px] flex flex-col">
      <div className="p-6 border-b border-stone-200 bg-stone-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-stone-800 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">FinArth AI Agent</h3>
              <p className="text-sm text-stone-600 flex items-center gap-1">
                <span className="h-2 w-2 bg-stone-600 rounded-full"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const query = "What are key risks in this project plan?";
              setInputMessage(query);
              setTimeout(() => sendMessage(), 100);
            }}
            className="px-4 py-2 bg-stone-800 text-stone-50 text-sm rounded-lg hover:bg-stone-900 transition-colors"
          >
            Analyze Risks
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-25">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] border ${
              message.type === 'user' 
                ? 'bg-stone-800 text-stone-50 border-stone-700' 
                : 'bg-white text-stone-900 border-stone-200'
            } px-4 py-3`}>
              <div className="text-sm whitespace-pre-wrap">
                {message.content.split('**').map((part, index) => 
                  index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                )}
              </div>
              <p className={`text-xs mt-1 font-mono ${
                message.type === 'user' ? 'text-stone-300' : 'text-stone-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 px-4 py-3">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-stone-400 animate-bounce"></div>
                <div className="h-2 w-2 bg-stone-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-2 w-2 bg-stone-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-stone-200 bg-stone-50">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
            placeholder="Ask me about your investments, goals, or financial planning..."
            className="flex-1 px-4 py-3 border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-3 bg-stone-800 text-stone-50 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-2 font-mono">
          AI responses are for educational purposes only. Always consult with qualified financial advisors.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'agent':
        return renderAgent();
      default:
        return <div className="bg-white p-8 border border-stone-200 shadow-sm"><h2 className="text-xl font-semibold text-stone-900 border-b border-stone-200 pb-2 mb-4">Coming Soon</h2><p className="text-stone-600">This feature is under development.</p></div>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-stone-100 flex">
      <div className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="p-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-stone-800 rounded-lg flex items-center justify-center">
              <span className="text-stone-50 font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-stone-900">FinArth</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-stone-100 text-stone-900 border border-stone-200'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-stone-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 mb-3">
            <div className="h-8 w-8 bg-stone-300 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">John Doe</p>
              <p className="text-xs text-stone-500">Premium Plan</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'portfolio' && 'Portfolio Management'}
              {activeTab === 'goals' && 'Financial Goals'}
              {activeTab === 'agent' && 'AI Financial Agent'}
            </h1>
            <p className="text-stone-600">
              {activeTab === 'overview' && 'Monitor your financial progress and portfolio performance'}
              {activeTab === 'portfolio' && 'Manage your investment portfolio and asset allocation'}
              {activeTab === 'goals' && 'Track and plan your financial goals'}
              {activeTab === 'agent' && 'Chat with your AI financial advisor for personalized guidance'}
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
    </>
  );
};



// Simple icon components
const Shield = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Target = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </svg>
);

const Calculator = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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





const LogOut = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CheckCircle = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Navbar = ({ onGetStarted, isConnecting }: { onGetStarted: () => void; isConnecting: boolean }) => (
  <nav className="fixed top-0 left-0 right-0 w-full z-50 border-b border-stone-300/20 bg-stone-50/90 backdrop-blur-md overflow-hidden">
    {/* Navbar design elements */}
    <div className="absolute top-2 right-20 w-4 h-4 border border-stone-400/20 rotate-45 animate-pulse" />
    <div className="absolute top-3 left-32 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
    
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-stone-800 rounded-lg flex items-center justify-center">
          <span className="text-stone-50 font-bold text-xl">F</span>
        </div>
        <span className="text-xl font-bold text-stone-900">
          FinArth
        </span>
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
  <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden perspective-1000">
    <div 
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-stone-200/30 rounded-full blur-[120px] -z-10 transition-transform duration-1000 ease-out"
      style={{
        transform: `translate(-50%, ${mousePos.y * 0.02}px) rotateX(${mousePos.y * 0.01}deg) rotateY(${mousePos.x * 0.01}deg)`
      }}
    />
    
    {/* Hero design elements */}
    <div className="absolute top-40 left-16 w-20 h-20 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
    <div className="absolute top-60 right-20 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-green-400/20 rotate-45 animate-pulse" />
    <div className="absolute bottom-32 left-1/4 w-12 h-12 border border-dashed border-orange-400/30 animate-bounce" />
    <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }} />

    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-200/50 border border-stone-300/30 text-stone-700 text-sm font-medium mb-8 scroll-animate">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-600 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-700"></span>
        </span>
        AI-Powered Financial Planning
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 scroll-animate">
        Financial Confidence <br />
        <span className="text-stone-700">
          Engine
        </span>
      </h1>

      <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed scroll-animate">
        Convert your life goals into safe, automated, and understandable financial action. 
        No fear, no confusion, just confident progress toward what matters to you.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 scroll-animate">
        <button 
          onClick={onGetStarted}
          disabled={isConnecting}
          className="w-full md:w-auto px-8 py-4 rounded-lg bg-stone-900 text-stone-50 font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {isConnecting ? 'Loading...' : 'Start Planning'} <ArrowRight size={18} />
        </button>
        <button 
          className="w-full md:w-auto px-8 py-4 rounded-lg bg-stone-100 text-stone-900 font-medium hover:bg-stone-200 border border-stone-300 transition-all flex items-center justify-center gap-2"
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
           See Example Plan
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-12 flex flex-col items-center gap-4 scroll-animate">
        <p className="text-sm text-stone-500">Trusted by 10,000+ investors</p>
        <div className="flex items-center gap-6 text-stone-400">
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span className="text-xs">Bank-level Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span className="text-xs">SEBI Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={16} />
            <span className="text-xs">AI-Powered</span>
          </div>
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
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-blue-100/30 to-transparent opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
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
          className="p-8 rounded-3xl bg-white border border-stone-200 hover:border-green-400/50 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-green-400/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 2 ? 'rotateX(2deg) rotateY(2deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-700 mb-6 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-300">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">The Automated Partner</h3>
          <p className="text-stone-600 text-sm">
            Handles complex calculations, monitors progress continuously, and automates execution.
          </p>
        </div>

        <div 
          className="p-8 rounded-3xl bg-white border border-stone-200 hover:border-orange-400/50 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-400/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 3 ? 'rotateX(-2deg) rotateY(-2deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-800 mb-6 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-300">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">The Trust Builder</h3>
          <p className="text-stone-600 text-sm">
            No black-box recommendations. Every calculation cross-checked and explained.
          </p>
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
  <section className="py-24 bg-stone-100 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Half - Scroll-Responsive Confusion Geometry */}
        <div className="space-y-8">
          <div className="relative h-96 flex items-center justify-center">
            {/* Confusion spiral - rotates with scroll */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-64 h-64 border-4 border-dashed border-stone-400/40 rounded-full" 
                style={{ transform: `rotate(${scrollY * 0.3}deg)` }} 
              />
              <div 
                className="absolute w-48 h-48 border-2 border-stone-500/30 rounded-full" 
                style={{ transform: `rotate(${-scrollY * 0.2}deg)` }} 
              />
              <div 
                className="absolute w-32 h-32 border border-stone-600/30 rounded-full" 
                style={{ transform: `rotate(${scrollY * 0.4}deg)` }} 
              />
            </div>
            
            {/* Question marks - move with scroll */}
            <div 
              className="absolute top-8 left-8 text-6xl text-stone-400/60" 
              style={{ transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px)` }}
            >?</div>
            <div 
              className="absolute top-16 right-12 text-5xl text-stone-500/60" 
              style={{ transform: `translateY(${Math.cos(scrollY * 0.015) * 15}px)` }}
            >?</div>
            <div 
              className="absolute bottom-12 left-16 text-4xl text-stone-600/60" 
              style={{ transform: `translateY(${Math.sin(scrollY * 0.02) * 8}px)` }}
            >?</div>
            <div 
              className="absolute bottom-8 right-8 text-3xl text-stone-500/60" 
              style={{ transform: `translateY(${Math.cos(scrollY * 0.012) * 12}px)` }}
            >?</div>
            
            {/* Central confusion symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-8xl text-stone-400/30" 
                style={{ transform: `rotate(${scrollY * 0.1}deg) scale(${1 + Math.sin(scrollY * 0.005) * 0.1})` }}
              >?</div>
            </div>
          </div>
        </div>

        {/* Right Half - Enhanced Problem Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">The Problem We Solve</h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              People want to grow their money safely toward real-life goals, but they are unable to translate intent into confident action.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-stone-900 border-b-2 border-stone-800 pb-2 inline-block">Core Problems</h3>
            
            <div className="border-l-4 border-stone-600 pl-6 py-2">
              <h4 className="text-stone-900 font-bold mb-2">What You Want:</h4>
              <p className="text-stone-700">"I want to buy a house, need money to grow reliably, don't want to gamble my future."</p>
            </div>
            
            <div className="border-l-4 border-stone-700 pl-6 py-2">
              <h4 className="text-stone-900 font-bold mb-2">The Reality:</h4>
              <p className="text-stone-700">"Terrified of losing money, confused by options, need automation, don't trust advice."</p>
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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
  <section id="how-it-works" className="py-24 bg-stone-100 relative overflow-hidden">
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
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-stone-600 to-stone-300 hidden md:block" />
        
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
          <div className="absolute top-24 right-24 w-4 h-4 bg-blue-500/60 rounded-full animate-ping" 
               style={{ transform: `translate(${Math.cos(scrollY * 0.01) * 10}px, ${Math.sin(scrollY * 0.01) * 10}px)` }} />
          <div className="absolute top-40 right-40 w-3 h-3 bg-purple-500/60 rounded-full animate-ping" 
               style={{ 
                 animationDelay: '1s',
                 transform: `translate(${Math.cos(scrollY * 0.015 + 1) * 15}px, ${Math.sin(scrollY * 0.015 + 1) * 15}px)`
               }} />
          <div className="absolute top-56 right-20 w-2 h-2 bg-green-500/60 rounded-full animate-ping" 
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

        <div className="space-y-12">
          {[
            {
              title: "Share Your Goal",
              desc: "Tell us your current savings, target amount, and timeline in plain English.",
              icon: <Target size={20} />,
              color: "text-stone-600"
            },
            {
              title: "AI Analysis",
              desc: "Our AI calculates required returns, assigns your personality, and validates for safety.",
              icon: <Calculator size={20} />,
              color: "text-stone-700"
            },
            {
              title: "Get Your Plan",
              desc: "Receive specific investment allocations with clear explanations and next steps.",
              icon: <CheckCircle size={20} />,
              color: "text-stone-800"
            }
          ].map((step, i) => (
            <div 
              key={i} 
              className="relative flex gap-8 items-start scroll-animate transform-gpu hover:scale-105 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div 
                className="hidden md:flex h-16 w-16 bg-white border border-stone-300 rounded-2xl items-center justify-center z-10 shrink-0 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-500"
                style={{
                  transform: activeStep === i ? 'scale(1.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                  boxShadow: activeStep === i ? '0 20px 40px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <div className={`${step.color}`}>{step.icon}</div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-stone-900 mb-2 flex items-center gap-3 transform-gpu hover:translate-x-2 transition-all duration-300">
                  <span className="md:hidden p-2 bg-white rounded-lg border border-stone-300">{step.icon}</span>
                  {step.title}
                </h3>
                <p className="text-stone-600 max-w-xl">{step.desc}</p>
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
          <div className="h-6 w-6 bg-stone-800 rounded flex items-center justify-center text-xs text-white font-bold">F</div>
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
      `}</style>
      <Navbar onGetStarted={handleGetStarted} isConnecting={connecting} />
      <Hero onGetStarted={handleGetStarted} isConnecting={connecting} />
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
      <Route path="/dashboard/:tab" element={<Dashboard onLogout={handleLogout} />} />
    </Routes>
  );
}