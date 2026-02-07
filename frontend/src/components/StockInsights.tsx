import React, { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
}

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  time_published: string;
  source: string;
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

const Activity = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const StockInsights: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Portfolio stocks - these would typically come from user's actual holdings
  const portfolioStocks = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'];

  useEffect(() => {
    fetchStockData();
    fetchMarketNews();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      
      // Using a free API that doesn't require API key for demo
      // In production, you'd use Alpha Vantage, Yahoo Finance, or similar
      const mockData: StockData[] = [
        {
          symbol: 'AAPL',
          price: 175.43,
          change: 2.15,
          changePercent: 1.24,
          volume: 45678900,
          marketCap: 2800000000000,
          pe: 28.5,
          high52Week: 198.23,
          low52Week: 124.17
        },
        {
          symbol: 'MSFT',
          price: 338.11,
          change: -1.87,
          changePercent: -0.55,
          volume: 23456789,
          marketCap: 2500000000000,
          pe: 32.1,
          high52Week: 384.30,
          low52Week: 213.43
        },
        {
          symbol: 'GOOGL',
          price: 125.68,
          change: 0.95,
          changePercent: 0.76,
          volume: 34567890,
          marketCap: 1600000000000,
          pe: 25.4,
          high52Week: 151.55,
          low52Week: 83.34
        },
        {
          symbol: 'TSLA',
          price: 248.42,
          change: 8.73,
          changePercent: 3.64,
          volume: 67890123,
          marketCap: 790000000000,
          pe: 65.2,
          high52Week: 299.29,
          low52Week: 101.81
        },
        {
          symbol: 'NVDA',
          price: 421.13,
          change: -5.22,
          changePercent: -1.22,
          volume: 45123678,
          marketCap: 1040000000000,
          pe: 58.7,
          high52Week: 502.66,
          low52Week: 108.13
        }
      ];

      setStockData(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketNews = async () => {
    try {
      // Mock news data - in production, use Alpha Vantage News API or similar
      const mockNews: NewsItem[] = [
        {
          title: "Tech Stocks Rally on AI Optimism",
          summary: "Major technology companies see gains as investors remain bullish on artificial intelligence developments and their potential impact on future earnings.",
          url: "#",
          time_published: "2024-01-15T14:30:00Z",
          source: "MarketWatch"
        },
        {
          title: "Federal Reserve Signals Potential Rate Cuts",
          summary: "Recent economic data suggests the Fed may consider lowering interest rates in the coming months, potentially boosting equity markets.",
          url: "#",
          time_published: "2024-01-15T12:15:00Z",
          source: "Reuters"
        },
        {
          title: "Electric Vehicle Sales Surge in Q4",
          summary: "EV manufacturers report strong quarterly sales figures, with Tesla and other major players exceeding analyst expectations.",
          url: "#",
          time_published: "2024-01-15T10:45:00Z",
          source: "Bloomberg"
        }
      ];

      setNews(mockNews);
    } catch (err) {
      console.error('Error fetching news:', err);
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
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getPerformanceInsight = (stock: StockData) => {
    const currentPrice = stock.price;
    const high52Week = stock.high52Week || 0;
    const low52Week = stock.low52Week || 0;
    
    const distanceFromHigh = ((high52Week - currentPrice) / high52Week) * 100;
    const distanceFromLow = ((currentPrice - low52Week) / low52Week) * 100;

    if (distanceFromHigh < 5) {
      return { text: "Near 52W High", color: "text-green-600", bg: "bg-green-50" };
    } else if (distanceFromLow < 10) {
      return { text: "Near 52W Low", color: "text-red-600", bg: "bg-red-50" };
    } else if (stock.changePercent > 3) {
      return { text: "Strong Momentum", color: "text-blue-600", bg: "bg-blue-50" };
    } else if (stock.pe && stock.pe < 20) {
      return { text: "Attractive P/E", color: "text-purple-600", bg: "bg-purple-50" };
    }
    return { text: "Stable", color: "text-gray-600", bg: "bg-gray-50" };
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchStockData}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Activity size={20} />
            Portfolio Stock Insights
          </h3>
          <button 
            onClick={fetchStockData}
            className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockData.map((stock) => {
            const insight = getPerformanceInsight(stock);
            return (
              <div key={stock.symbol} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{stock.symbol}</h4>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(stock.price)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="font-medium">
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Volume</span>
                    <span className="font-medium">{formatVolume(stock.volume)}</span>
                  </div>
                  {stock.marketCap && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Market Cap</span>
                      <span className="font-medium">{formatMarketCap(stock.marketCap)}</span>
                    </div>
                  )}
                  {stock.pe && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">P/E Ratio</span>
                      <span className="font-medium">{stock.pe.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${insight.bg} ${insight.color}`}>
                    {insight.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market News */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Market News & Insights</h3>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-900 flex-1 pr-4">{item.title}</h4>
                <span className="text-xs text-slate-500 whitespace-nowrap">{item.source}</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">{item.summary}</p>
              <p className="text-xs text-slate-500">
                {new Date(item.time_published).toLocaleDateString()} at {new Date(item.time_published).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Portfolio Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-xl">
            <h4 className="font-medium text-green-900 mb-1">Top Performer</h4>
            <p className="text-2xl font-bold text-green-800">
              {stockData.reduce((prev, current) => 
                (prev.changePercent > current.changePercent) ? prev : current
              ).symbol}
            </p>
            <p className="text-sm text-green-700">
              +{stockData.reduce((prev, current) => 
                (prev.changePercent > current.changePercent) ? prev : current
              ).changePercent.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-1">Highest Volume</h4>
            <p className="text-2xl font-bold text-blue-800">
              {stockData.reduce((prev, current) => 
                (prev.volume > current.volume) ? prev : current
              ).symbol}
            </p>
            <p className="text-sm text-blue-700">
              {formatVolume(stockData.reduce((prev, current) => 
                (prev.volume > current.volume) ? prev : current
              ).volume)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-medium text-purple-900 mb-1">Best Value</h4>
            <p className="text-2xl font-bold text-purple-800">
              {stockData.filter(s => s.pe).reduce((prev, current) => 
                (prev.pe! < current.pe!) ? prev : current
              ).symbol}
            </p>
            <p className="text-sm text-purple-700">
              P/E: {stockData.filter(s => s.pe).reduce((prev, current) => 
                (prev.pe! < current.pe!) ? prev : current
              ).pe?.toFixed(1)}
            </p>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl">
            <h4 className="font-medium text-orange-900 mb-1">Portfolio Value</h4>
            <p className="text-2xl font-bold text-orange-800">
              {formatCurrency(stockData.reduce((sum, stock) => sum + stock.price, 0))}
            </p>
            <p className="text-sm text-orange-700">Total Holdings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInsights;