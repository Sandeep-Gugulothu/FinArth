import React, { useState, useEffect } from 'react';
import MarketDataService from '../services/MarketDataService';

interface MarketInsight {
  id: string;
  type: 'surge' | 'drop' | 'news' | 'alert';
  symbol: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: number;
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

const AlertTriangle = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const Info = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MarketInsightsWidget: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiUsage, setApiUsage] = useState({ used: 0, limit: 100, remaining: 100 });

  useEffect(() => {
    loadMarketInsights();
  }, []);

  const loadMarketInsights = async () => {
    try {
      setLoading(true);
      const marketService = MarketDataService.getInstance();
      const portfolioSymbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'];
      
      const marketData = await marketService.getMarketData(portfolioSymbols);
      setInsights(marketData.insights);
      setApiUsage(marketService.getApiUsage());
    } catch (error) {
      console.error('Failed to load market insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'surge': return <TrendingUp size={16} />;
      case 'drop': return <TrendingDown size={16} />;
      case 'alert': return <AlertTriangle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getInsightColor = (type: string, severity: string) => {
    if (type === 'surge') return 'text-green-600 bg-green-50 border-green-200';
    if (type === 'drop') return 'text-red-600 bg-red-50 border-red-200';
    if (severity === 'high') return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 border-l-4 border-stone-600 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-stone-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 border-l-4 border-stone-600 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-900">Market Insights</h3>
        <div className="text-xs text-stone-500">
          API: {apiUsage.used}/{apiUsage.limit}
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8 text-stone-500">
          <Info size={24} className="mx-auto mb-2 opacity-50" />
          <p>No market insights available</p>
          <button 
            onClick={loadMarketInsights}
            className="mt-2 text-sm text-stone-600 hover:text-stone-900 underline"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.slice(0, 5).map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 rounded-lg border ${getInsightColor(insight.type, insight.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{insight.title}</h4>
                    <span className="text-xs opacity-75 whitespace-nowrap ml-2">
                      {formatTime(insight.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {insights.length > 5 && (
            <div className="text-center pt-2">
              <span className="text-xs text-stone-500">
                +{insights.length - 5} more insights available
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-stone-200">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Last updated: {formatTime(Date.now())}</span>
          <button 
            onClick={loadMarketInsights}
            className="text-stone-600 hover:text-stone-900 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketInsightsWidget;