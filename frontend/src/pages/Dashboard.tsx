import React, { useState, useEffect } from 'react';
import {
  Globe
} from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { apiCall } from '../utils/api.ts';
import { Activity } from '../components/Icons.tsx';
import Sidebar from '../components/Sidebar.tsx';
import Portfolio from './Portfolio.tsx';

const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  if (!data || data.length === 0) return <div className="h-[30px] w-20 flex items-center justify-center text-[10px] text-stone-300 italic">loading...</div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d - min) / (range || 1)) * 100
  }));

  const pathContent = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="80" height="30" viewBox="0 0 100 100" className="opacity-80">
      <path
        d={pathContent}
        fill="none"
        stroke={positive ? '#166534' : '#991b1b'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const OverviewTab = ({ marketData, loading, error, userName, goals, holdings, isLive }: { marketData: any; loading: boolean; error: string | null; userName: string; goals: any[]; holdings: any[]; isLive: boolean }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
        <p className="text-stone-500 font-medium">Loading financial dashboard...</p>
      </div>
    );
  }

  if (error || !marketData) {
    return (
      <div className="bg-white border border-stone-200 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
        <h3 className="text-lg font-bold text-stone-900 mb-2">Connection Issue</h3>
        <p className="text-stone-600 mb-4">{error || "Unable to reach the market service. Check your connection."}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-stone-800 text-white rounded hover:bg-stone-900 transition-colors">Retry</button>
      </div>
    );
  }

  const global = marketData.global || {};

  const completedGoals = goals.filter(g => g.progress >= 100).length;

  // Calculate dynamic portfolio data
  const totalInvested = holdings.reduce((sum, h) => sum + (h.amount || 0), 0);

  const totalPortfolioValue = holdings.reduce((sum, h) => {
    let growth = 0;
    if (h.category === 'Crypto') {
      const analysis = marketData.cryptoAnalysis?.[h.id];
      growth = analysis ? (analysis.growth_percentage || 0) : 0;
    } else {
      growth = {
        'Stocks': 0.8,
        'Mutual Funds': 0.5,
        'Real Estate': 0.1,
        'Fixed Deposits': 0.02,
        'Gold ETFs': marketData?.top_coins?.find((c: any) => c.symbol === 'xau' || c.id === 'pax-gold')?.price_change_percentage_24h || 0.3,
        'Bonds': 0.01,
        'Others': 0.1
      }[h.category as string] || 0;
    }
    return sum + (h.amount * (1 + growth / 100));
  }, 0);

  const totalProfit = totalPortfolioValue - totalInvested;
  const totalGrowthPct = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const totalMonthlySIP = goals.reduce((sum, g) => sum + (g.monthly_required || 0), 0);

  const stats = [
    { label: 'Total Portfolio', value: `₹${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: `+${totalGrowthPct.toFixed(1)}%`, positive: totalGrowthPct >= 0 },
    { label: 'Total Profit', value: `₹${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: totalProfit >= 0 ? 'Profit' : 'Loss', positive: totalProfit >= 0 },
    { label: 'Monthly SIP', value: `₹${totalMonthlySIP.toLocaleString()}`, change: totalMonthlySIP > 0 ? 'Active' : 'Add Goals', positive: true },
    { label: 'Goals Progress', value: `${completedGoals}/${goals.length}`, change: goals.length > 0 ? 'On Track' : 'No Goals', positive: true },
  ];


  // Derive recent activity from goals and holdings
  const combinedActivity = [
    ...goals.map(g => ({ type: 'GOAL', name: g.name, sub: 'Financial Goal', date: new Date(g.updated_at || g.created_at) })),
    ...holdings.map(h => ({ type: 'PORTFOLIO', name: h.name, sub: h.category, date: new Date(h.updated_at || h.created_at) }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);

  const recentActivity = combinedActivity.map(act => ({
    action: act.type === 'GOAL' ? 'Goal Updated' : 'Investment Added',
    fund: act.name,
    amount: act.sub,
    time: act.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : act.date.toLocaleDateString()
  }));

  // Fallback if no activity
  if (recentActivity.length === 0) {
    recentActivity.push(
      { action: 'Getting Started', fund: 'Add your first goal', amount: 'Finance', time: 'Now' },
      { action: 'Portfolio Clean', fund: 'No holdings yet', amount: 'Assets', time: 'Welcome' }
    );
  }

  const goalProgress = goals.map(g => ({
    goal: g.name,
    current: g.current_amount / 100000,
    target: g.target_amount / 100000,
    progress: g.progress
  })).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-0 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 mb-2">Welcome Back</h2>
          <p className="text-stone-600">Monitor your financial progress and portfolio performance</p>
        </div>
        <div className={`mt-2 flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isLive ? 'Live Portfolio' : 'Simulated Environment'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 border-l-4 border-stone-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">{stat.label}</p>
              <span className={`text-[10px] px-2 py-0.5 font-mono font-bold bg-stone-50 text-stone-600 border border-stone-100 rounded`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-900 font-mono tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-6 border-b border-stone-100 pb-2">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-b-0">
                <div>
                  <p className="font-bold text-stone-900 text-sm">{activity.action}</p>
                  <p className="text-xs text-stone-500">{activity.fund}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900 text-sm font-mono">{activity.amount}</p>
                  <p className="text-[10px] text-stone-400 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-6 border-b border-stone-100 pb-2">Goal Progress</h3>
          <div className="space-y-6">
            {goalProgress.map((goal, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-stone-900 text-sm">{goal.goal}</span>
                  <span className="text-[11px] text-stone-600 font-mono font-bold">₹{goal.current}L / ₹{goal.target}L</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-sm overflow-hidden border border-stone-200/50">
                  <div
                    className="bg-stone-800 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{goal.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-stone-200">
        <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <Globe size={20} className="text-stone-800" />
          Market Intelligence
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-stone-50 p-4 border border-stone-200">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Total Market Cap</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-stone-900 font-mono">
                {global.total_market_cap?.usd ? `$${(global.total_market_cap.usd / 1e12).toFixed(2)}T` : '---'}
              </p>
              <span className={`text-[10px] font-mono ${global.market_cap_change_percentage_24h_usd > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {global.market_cap_change_percentage_24h_usd ? `${global.market_cap_change_percentage_24h_usd.toFixed(1)}%` : ''}
              </span>
            </div>
          </div>
          <div className="bg-stone-50 p-4 border border-stone-200">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">24h Volume</p>
            <p className="text-lg font-bold text-stone-900 font-mono">
              {global.total_volume?.usd ? `$${(global.total_volume.usd / 1e9).toFixed(1)}B` : '---'}
            </p>
          </div>
          <div className="bg-stone-50 p-4 border border-stone-200">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">BTC Dominance</p>
            <p className="text-lg font-bold text-stone-900 font-mono">
              {global.market_cap_percentage?.btc ? `${global.market_cap_percentage.btc.toFixed(1)}%` : '---'}
            </p>
          </div>
          <div className="bg-stone-50 p-4 border border-stone-200">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Active Coins</p>
            <p className="text-lg font-bold text-stone-900 font-mono">
              {global.active_cryptocurrencies ? global.active_cryptocurrencies.toLocaleString() : '---'}
            </p>
          </div>
        </div>

        <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h4 className="font-bold text-stone-900 text-sm">Market Movers</h4>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Live Updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] border-b border-stone-100">
                  <th className="px-6 py-4">Asset</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">24h Change</th>
                  <th className="py-4">7d Trend</th>
                  <th className="px-6 py-4 text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {marketData.top_coins?.slice(0, 6).map((coin: any) => (
                  <tr key={coin.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full opacity-80" />
                        <div>
                          <p className="text-sm font-bold text-stone-900 tracking-tight">{coin.name}</p>
                          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-bold text-stone-900 font-mono">
                      ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4">
                      <span className={`text-[11px] font-bold font-mono ${coin.price_change_percentage_24h > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4">
                      <Sparkline data={coin.sparkline_in_7d?.price} positive={coin.price_change_percentage_24h > 0} />
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-stone-700 font-mono">
                      ${(coin.market_cap / 1e9).toFixed(1)}B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [userName, setUserName] = useState('User');
  const [goals, setGoals] = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [cryptoAnalysis, setCryptoAnalysis] = useState<Record<number, any>>({});
  const [isLive, setIsLive] = useState(true);

  // Fetch crypto analysis when holdings change
  useEffect(() => {
    const fetchCryptoAnalysis = async () => {
      const cryptoHoldings = holdings.filter(h => h.category === 'Crypto' && h.symbol && h.date);
      if (cryptoHoldings.length === 0) {
        setCryptoAnalysis({});
        return;
      }

      const analysisResults: Record<number, any> = {};
      await Promise.all(
        cryptoHoldings.map(async (holding) => {
          try {
            const res = await apiCall('/api/market/weex/analysis', {
              method: 'POST',
              body: JSON.stringify({
                symbol: holding.symbol,
                date: holding.date,
                entryPrice: holding.entry_price
              })
            });
            if (res && !res.error) {
              analysisResults[holding.id] = res;
            }
          } catch (e) {
            console.error(`Failed to fetch analysis for ${holding.symbol}:`, e);
          }
        })
      );
      setCryptoAnalysis(analysisResults);
    };

    if (holdings.length > 0) {
      fetchCryptoAnalysis();
    } else {
      setCryptoAnalysis({});
    }
  }, [holdings]);


  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/api/market/dashboard');
      if (!data || data.error) throw new Error("Backend unavailable");
      setMarketData(data);
      setIsLive(true);
    } catch (err: any) {
      console.warn('Using mock market data due to connection failure');
      setIsLive(false);
      setMarketData({
        global: {
          total_market_cap: { usd: 2450000000000 },
          market_cap_change_percentage_24h_usd: 1.2,
          total_volume: { usd: 85000000000 },
          market_cap_percentage: { btc: 52.1 },
          active_cryptocurrencies: 12450
        },
        top_coins: [
          { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 64230.50, price_change_percentage_24h: 1.5, market_cap: 1200000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', sparkline_in_7d: { price: [60000, 61000, 60500, 62000, 63000, 64000, 64230] } },
          { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3450.20, price_change_percentage_24h: -0.5, market_cap: 400000000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', sparkline_in_7d: { price: [3500, 3400, 3450, 3550, 3500, 3450, 3450] } },
          { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 145.80, price_change_percentage_24h: 4.2, market_cap: 65000000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', sparkline_in_7d: { price: [130, 135, 140, 138, 142, 145, 145] } }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGoalsWithFallback = async () => {
    try {
      const response = await apiCall('/api/plans/goals');
      if (response && response.goals && response.goals.length > 0) {
        setGoals(response.goals);
      } else {
        throw new Error("No goals");
      }
    } catch (err) {
      setIsLive(false);
      setGoals([
        { id: 1, name: 'House Downpayment', target_amount: 5000000, current_amount: 1500000, progress: 30, monthly_required: 45000, timeline_years: 5, updated_at: new Date().toISOString() },
        { id: 2, name: 'Retirement Fund', target_amount: 50000000, current_amount: 5000000, progress: 10, monthly_required: 25000, timeline_years: 25, updated_at: new Date().toISOString() }
      ]);
    }
  };

  const fetchHoldingsWithFallback = async () => {
    try {
      const response = await apiCall('/api/portfolio/holdings');
      if (response && response.holdings && response.holdings.length > 0) {
        setHoldings(response.holdings);
      } else {
        throw new Error("No holdings");
      }
    } catch (err) {
      setIsLive(false);
      setHoldings([
        { id: 1, name: 'Bitcoin', symbol: 'BTC', category: 'Crypto', amount: 0.5 * 64000, units: 0.5, entry_price: 45000, created_at: new Date().toISOString() },
        { id: 2, name: 'Nifty 50 Index', symbol: 'NIFTY50', category: 'Stocks', amount: 250000, created_at: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else if (location.pathname === '/dashboard') {
      setActiveTab('overview');
    }
  }, [tab, location.pathname]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name || user.email?.split('@')[0] || 'User');
    }

    fetchMarketData();
    fetchGoalsWithFallback();
    fetchHoldingsWithFallback();
  }, []);

  const renderContent = () => {
    const marketDataWithAnalysis = { ...marketData, cryptoAnalysis };
    switch (activeTab) {
      case 'overview': return <OverviewTab marketData={marketDataWithAnalysis} loading={loading} error={null} userName={userName} goals={goals} holdings={holdings} isLive={isLive} />;
      case 'portfolio': return <Portfolio holdings={holdings} onRefresh={fetchHoldingsWithFallback} marketData={marketData} cryptoAnalysisProp={cryptoAnalysis} />;
      default: return <OverviewTab marketData={marketDataWithAnalysis} loading={loading} error={null} userName={userName} goals={goals} holdings={holdings} isLive={isLive} />;
    }
  };

  return (
    <div className="h-screen bg-stone-50 flex overflow-hidden selection:bg-stone-200">
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        userName={userName}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {!isSidebarVisible && (
          <button
            onClick={() => setIsSidebarVisible(true)}
            className="fixed top-8 left-8 p-2 bg-white border border-stone-200 rounded shadow-sm z-50 hover:bg-stone-50 transition-all text-stone-600"
          >
            <Activity size={18} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a29e;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;