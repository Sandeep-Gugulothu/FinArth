import React, { useState, useEffect } from 'react';

interface RealTimeStock {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

interface MarketGainer {
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
}

const TrendingUp = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDown = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H21m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const BarChart = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Fire = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14l4-4 3 3m-3-3l-3-3-3 3" />
  </svg>
);

const RealTimeStockInsights: React.FC = () => {
  const [portfolioStocks, setPortfolioStocks] = useState<RealTimeStock[]>([]);
  const [marketGainers, setMarketGainers] = useState<MarketGainer[]>([]);
  const [marketLosers, setMarketLosers] = useState<MarketGainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // User's portfolio symbols - in a real app, this would come from user data
  const userPortfolio = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN'];

  useEffect(() => {
    fetchRealTimeData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchRealTimeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: Replace 'demo' with your actual API key from financialmodelingprep.com
      // Free tier allows 250 requests per day
      const API_KEY = 'demo'; // Get free API key from https://financialmodelingprep.com/developer/docs
      
      // Fetch portfolio stocks data
      const portfolioPromises = userPortfolio.map(symbol =>
        fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`)
          .then(res => res.json())
          .then(data => data[0])
          .catch(() => null)
      );

      // Fetch market gainers and losers
      const gainersPromise = fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`)
        .then(res => res.json())
        .catch(() => []);

      const losersPromise = fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${API_KEY}`)
        .then(res => res.json())
        .catch(() => []);

      const [portfolioResults, gainersData, losersData] = await Promise.all([
        Promise.all(portfolioPromises),
        gainersPromise,
        losersPromise
      ]);

      // Filter out null results and set data
      const validPortfolioStocks = portfolioResults.filter(stock => stock !== null);
      setPortfolioStocks(validPortfolioStocks);
      setMarketGainers(gainersData.slice(0, 5)); // Top 5 gainers
      setMarketLosers(losersData.slice(0, 5)); // Top 5 losers
      setLastUpdated(new Date());

    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError('Failed to fetch real-time market data. Using demo data.');
      
      // Fallback to demo data
      setPortfolioStocks([
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 175.43,
          changesPercentage: 1.24,
          change: 2.15,
          dayLow: 173.12,
          dayHigh: 176.89,
          yearHigh: 198.23,
          yearLow: 124.17,
          marketCap: 2800000000000,
          priceAvg50: 168.45,
          priceAvg200: 155.32,
          volume: 45678900,
          avgVolume: 52000000,
          exchange: 'NASDAQ',
          open: 174.28,
          previousClose: 173.28,
          eps: 6.15,
          pe: 28.5,
          earningsAnnouncement: '2024-02-01T16:30:00.000Z',
          sharesOutstanding: 15943000000,
          timestamp: Date.now()
        }
      ]);
      
      setMarketGainers([
        { symbol: 'NVDA', name: 'NVIDIA Corporation', change: 15.23, price: 421.13, changesPercentage: 3.75 },
        { symbol: 'AMD', name: 'Advanced Micro Devices', change: 4.87, price: 142.56, changesPercentage: 3.54 },
      ]);
      
      setMarketLosers([
        { symbol: 'INTC', name: 'Intel Corporation', change: -2.34, price: 43.21, changesPercentage: -5.14 },
      ]);
      
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getStockInsight = (stock: RealTimeStock) => {
    const { price, yearHigh, yearLow, priceAvg50, priceAvg200, changesPercentage, pe } = stock;
    
    // Near 52-week high (within 5%)
    if (price >= yearHigh * 0.95) {
      return { text: "Near 52W High", color: "text-green-600", bg: "bg-green-50", icon: <TrendingUp size={14} /> };
    }
    
    // Near 52-week low (within 10%)
    if (price <= yearLow * 1.1) {
      return { text: "Near 52W Low", color: "text-red-600", bg: "bg-red-50", icon: <TrendingDown size={14} /> };
    }
    
    // Above both moving averages with strong momentum
    if (price > priceAvg50 && price > priceAvg200 && changesPercentage > 2) {
      return { text: "Strong Momentum", color: "text-blue-600", bg: "bg-blue-50", icon: <Fire size={14} /> };
    }
    
    // Attractive valuation
    if (pe && pe < 20 && pe > 0) {
      return { text: "Attractive P/E", color: "text-purple-600", bg: "bg-purple-50", icon: <BarChart size={14} /> };
    }
    
    // Above 50-day MA
    if (price > priceAvg50) {
      return { text: "Above 50-day MA", color: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp size={14} /> };
    }
    
    return { text: "Stable", color: "text-gray-600", bg: "bg-gray-50", icon: <BarChart size={14} /> };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with last updated time */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Real-Time Market Insights</h2>
          {lastUpdated && (
            <p className="text-sm text-slate-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button 
          onClick={fetchRealTimeData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Updating...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Portfolio Stocks */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Your Portfolio Holdings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioStocks.map((stock) => {
            const insight = getStockInsight(stock);
            return (
              <div key={stock.symbol} className="p-4 border border-slate-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{stock.symbol}</h4>
                    <p className="text-xs text-slate-600 truncate">{stock.name}</p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(stock.price)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="font-medium text-sm">
                        {formatCurrency(Math.abs(stock.change))}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${
                      stock.changesPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changesPercentage >= 0 ? '+' : ''}{stock.changesPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <div className="flex justify-between">
                    <span>Day Range</span>
                    <span>{formatCurrency(stock.dayLow)} - {formatCurrency(stock.dayHigh)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume</span>
                    <span>{formatVolume(stock.volume)}</span>
                  </div>
                  {stock.pe && (
                    <div className="flex justify-between">
                      <span>P/E Ratio</span>
                      <span>{stock.pe.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${insight.bg} ${insight.color}`}>
                    {insight.icon}
                    {insight.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Top Market Gainers
          </h3>
          <div className="space-y-3">
            {marketGainers.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{stock.symbol}</p>
                  <p className="text-xs text-slate-600 truncate">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(stock.price)}</p>
                  <p className="text-sm text-green-600 font-medium">
                    +{stock.changesPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingDown size={20} className="text-red-600" />
            Top Market Losers
          </h3>
          <div className="space-y-3">
            {marketLosers.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{stock.symbol}</p>
                  <p className="text-xs text-slate-600 truncate">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(stock.price)}</p>
                  <p className="text-sm text-red-600 font-medium">
                    {stock.changesPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      {portfolioStocks.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(portfolioStocks.reduce((sum, stock) => sum + stock.price, 0))}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700 font-medium">Gainers</p>
              <p className="text-2xl font-bold text-green-900">
                {portfolioStocks.filter(s => s.changesPercentage > 0).length}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-700 font-medium">Losers</p>
              <p className="text-2xl font-bold text-red-900">
                {portfolioStocks.filter(s => s.changesPercentage < 0).length}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-700 font-medium">Avg P/E</p>
              <p className="text-2xl font-bold text-purple-900">
                {(portfolioStocks.filter(s => s.pe).reduce((sum, s) => sum + s.pe, 0) / 
                  portfolioStocks.filter(s => s.pe).length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeStockInsights;