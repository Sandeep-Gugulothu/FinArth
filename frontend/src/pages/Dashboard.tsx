import React, { useState } from 'react';
import PortfolioHeatmap from '../components/PortfolioHeatmap.tsx';

// Icons
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

const Target = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Bot = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Settings = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FinArth" className="h-8 w-8" />
          <span className="text-xl font-bold text-slate-900">FinArth</span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="h-8 w-8 bg-slate-300 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewTab = () => {
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
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'SIP Investment', fund: 'HDFC Top 100', amount: '₹8,333', time: '2 hours ago' },
              { action: 'Goal Updated', fund: 'House Purchase', amount: '₹50L target', time: '1 day ago' },
              { action: 'Portfolio Rebalanced', fund: 'Auto-adjustment', amount: '+2.1%', time: '3 days ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-600">{activity.fund}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{activity.amount}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Goal Progress</h3>
          <div className="space-y-4">
            {[
              { goal: 'House Purchase', current: 12.5, target: 50, progress: 25 },
              { goal: 'Emergency Fund', current: 3.2, target: 6, progress: 53 },
              { goal: 'Retirement', current: 8.7, target: 100, progress: 9 },
            ].map((goal, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">{goal.goal}</span>
                  <span className="text-sm text-slate-600">₹{goal.current}L / ₹{goal.target}L</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{goal.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioTab = () => {
  const portfolioData = [
    { name: 'Equity Funds', value: 65, amount: '₹8,09,250', color: 'bg-blue-500' },
    { name: 'Debt Funds', value: 25, amount: '₹3,11,250', color: 'bg-green-500' },
    { name: 'Gold ETF', value: 10, amount: '₹1,24,500', color: 'bg-yellow-500' },
  ];

  const holdings = [
    { fund: 'HDFC Top 100 Fund', category: 'Large Cap', amount: '₹2,45,000', returns: '+12.4%', positive: true },
    { fund: 'Axis Bluechip Fund', category: 'Large Cap', amount: '₹1,89,500', returns: '+8.7%', positive: true },
    { fund: 'SBI Small Cap Fund', category: 'Small Cap', amount: '₹1,74,750', returns: '+15.2%', positive: true },
    { fund: 'HDFC Corporate Bond', category: 'Debt', amount: '₹1,56,000', returns: '+6.8%', positive: true },
    { fund: 'ICICI Prudential Gold ETF', category: 'Gold', amount: '₹1,24,500', returns: '+4.2%', positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Heatmap */}
      <PortfolioHeatmap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Asset Allocation</h3>
          <div className="space-y-4">
            {portfolioData.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">{item.name}</span>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900">{item.value}%</span>
                    <p className="text-sm text-slate-600">{item.amount}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Returns</p>
                <p className="text-2xl font-bold text-green-800">+₹1,45,000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Overall Gain</p>
                <p className="text-lg font-semibold text-green-800">+13.2%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">1Y Returns</p>
                <p className="text-lg font-semibold text-slate-900">+12.4%</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">3Y Returns</p>
                <p className="text-lg font-semibold text-slate-900">+14.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Investment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Returns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {holdings.map((holding, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{holding.fund}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {holding.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{holding.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${holding.positive ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {holding.returns}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const GoalsTab = () => {
  const goals = [
    {
      id: 1,
      name: 'House Purchase',
      target: 5000000,
      current: 1250000,
      timeline: '7 years',
      monthlyRequired: 25000,
      progress: 25,
      status: 'on-track'
    },
    {
      id: 2,
      name: 'Emergency Fund',
      target: 600000,
      current: 320000,
      timeline: '1 year',
      monthlyRequired: 23333,
      progress: 53,
      status: 'ahead'
    },
    {
      id: 3,
      name: 'Child Education',
      target: 2500000,
      current: 180000,
      timeline: '12 years',
      monthlyRequired: 8500,
      progress: 7,
      status: 'behind'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Goals</h2>
          <p className="text-slate-600">Track your progress towards your financial objectives</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          Add New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-slate-900">{goal.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(goal.status)
                }`}>
                {goal.status.replace('-', ' ')}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Target</span>
                <span className="font-medium text-slate-900">{formatCurrency(goal.target)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Current</span>
                <span className="font-medium text-slate-900">{formatCurrency(goal.current)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Timeline</span>
                <span className="font-medium text-slate-900">{goal.timeline}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Progress</span>
                <span className="font-medium text-slate-900">{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Monthly Required</span>
                <span className="font-semibold text-slate-900">{formatCurrency(goal.monthlyRequired)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Goal Planning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Start Early</h4>
            <p className="text-sm text-blue-700">The power of compounding works best when you start investing early. Even small amounts can grow significantly over time.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <h4 className="font-medium text-green-900 mb-2">Stay Consistent</h4>
            <p className="text-sm text-green-700">Regular investments through SIPs help you benefit from rupee cost averaging and build discipline.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-medium text-purple-900 mb-2">Review Regularly</h4>
            <p className="text-sm text-purple-700">Review your goals annually and adjust your investments based on life changes and market conditions.</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <h4 className="font-medium text-orange-900 mb-2">Diversify Wisely</h4>
            <p className="text-sm text-orange-700">Spread your investments across different asset classes to reduce risk and optimize returns.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// AgentTab removed

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'goals':
        return <GoalsTab />;
      case 'settings':
        return <div className="bg-white p-8 rounded-2xl border border-slate-200"><h2 className="text-xl font-semibold">Settings</h2><p className="text-slate-600 mt-2">Coming soon...</p></div>;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'portfolio' && 'Portfolio Management'}
              {activeTab === 'goals' && 'Financial Goals'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-slate-600">
              {activeTab === 'overview' && 'Monitor your financial progress and portfolio performance'}
              {activeTab === 'portfolio' && 'Manage your investment portfolio and asset allocation'}
              {activeTab === 'goals' && 'Track and plan your financial goals'}
              {activeTab === 'settings' && 'Manage your account and preferences'}
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;