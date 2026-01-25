import React, { useState } from 'react';

const Portfolio: React.FC = () => {
  const [portfolioData] = useState({
    totalAmount: 10000000,
    allocations: {
      'Stocks': 25,
      'Mutual Funds': 20,
      'Real Estate': 15,
      'Fixed Deposits': 12,
      'Gold ETFs': 10,
      'Bonds': 8,
      'Crypto': 5,
      'Others': 5
    },
    monthlyGrowth: {
      'Stocks': 8.2,
      'Mutual Funds': 5.7,
      'Real Estate': 12.3,
      'Fixed Deposits': 0.8,
      'Gold ETFs': -2.1,
      'Bonds': 1.2,
      'Crypto': -15.4,
      'Others': 0.5
    }
  });

  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<{holdingIdx: number, categoryIdx: number} | null>(null);

  const updateInvestmentDate = (categoryIdx: number, holdingIdx: number, newDate: string) => {
    // Update logic would go here
    setEditingDate(null);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  const getColor = (category: string) => {
    const growth = portfolioData.monthlyGrowth[category as keyof typeof portfolioData.monthlyGrowth];
    return growth >= 0 ? '#86efac' : '#fca5a5';
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const treemapData = Object.entries(portfolioData.allocations)
    .filter(([, percentage]) => percentage > 0)
    .sort(([, a], [, b]) => b - a);

  const getAssetDetails = (category: string) => {
    const details = {
      'Stocks': { 
        description: 'Equity investments in public companies', 
        risk: 'High', 
        liquidity: 'High',
        holdings: [
          { name: 'Reliance', amount: 625000, source: 'Zerodha API', symbol: 'RELIANCE', dateInvested: '2024-01-15' },
          { name: 'Tata Motors', amount: 500000, source: 'Zerodha API', symbol: 'TATAMOTORS', dateInvested: '2024-02-10' },
          { name: 'Apple', amount: 450000, source: 'Binance API', symbol: 'AAPL', dateInvested: '2024-01-20' },
          { name: 'Microsoft', amount: 425000, source: 'Binance API', symbol: 'MSFT', dateInvested: '2024-03-05' },
          { name: 'Oracle', amount: 500000, source: 'Manual Entry', symbol: 'ORCL', dateInvested: '2024-02-28' }
        ]
      },
      'Mutual Funds': { 
        description: 'Diversified investment funds', 
        risk: 'Medium', 
        liquidity: 'Medium',
        holdings: [
          { name: 'SBI Bluechip Fund', amount: 1200000, source: 'Manual Entry', symbol: 'SBI-BC', dateInvested: '2024-01-10' },
          { name: 'HDFC Top 100', amount: 800000, source: 'Manual Entry', symbol: 'HDFC-T100', dateInvested: '2024-02-15' }
        ]
      },
      'Real Estate': { 
        description: 'Property and real estate investments', 
        risk: 'Medium', 
        liquidity: 'Low',
        holdings: [
          { name: 'Mumbai Property', amount: 1500000, source: 'Manual Entry', symbol: 'RE-MUM', dateInvested: '2024-01-05' }
        ]
      },
      'Fixed Deposits': { 
        description: 'Bank fixed deposits and CDs', 
        risk: 'Low', 
        liquidity: 'Medium',
        holdings: [
          { name: 'SBI FD', amount: 600000, source: 'Manual Entry', symbol: 'SBI-FD', dateInvested: '2024-01-01' },
          { name: 'HDFC FD', amount: 600000, source: 'Manual Entry', symbol: 'HDFC-FD', dateInvested: '2024-02-01' }
        ]
      },
      'Gold ETFs': { 
        description: 'Gold exchange-traded funds', 
        risk: 'Low', 
        liquidity: 'High',
        holdings: [
          { name: 'Gold ETF', amount: 600000, source: 'Zerodha API', symbol: 'GOLDBEES', dateInvested: '2024-01-25' },
          { name: 'Physical Gold', amount: 400000, source: 'Manual Entry', symbol: 'GOLD', dateInvested: '2024-02-20' }
        ]
      },
      'Bonds': { 
        description: 'Government and corporate bonds', 
        risk: 'Low', 
        liquidity: 'Medium',
        holdings: [
          { name: 'Govt Bond 2029', amount: 500000, source: 'Manual Entry', symbol: 'GB2029', dateInvested: '2024-01-05' },
          { name: 'Corporate Bond', amount: 300000, source: 'Manual Entry', symbol: 'CB-AAA', dateInvested: '2024-03-01' }
        ]
      },
      'Crypto': { 
        description: 'Cryptocurrency investments', 
        risk: 'Very High', 
        liquidity: 'High',
        holdings: [
          { name: 'Bitcoin', amount: 300000, source: 'Binance API', symbol: 'BTC', dateInvested: '2024-02-01' },
          { name: 'Ethereum', amount: 200000, source: 'Binance API', symbol: 'ETH', dateInvested: '2024-02-15' }
        ]
      },
      'Others': { 
        description: 'Alternative investments', 
        risk: 'Medium', 
        liquidity: 'Medium',
        holdings: [
          { name: 'Commodities', amount: 500000, source: 'Manual Entry', symbol: 'COMM', dateInvested: '2024-01-30' }
        ]
      }
    };
    return details[category as keyof typeof details] || { description: 'Investment details', risk: 'Medium', liquidity: 'Medium', holdings: [] };
  };

  const openChart = (symbol: string) => {
    const chartUrl = `https://in.tradingview.com/chart/?symbol=${symbol}`;
    window.open(chartUrl, '_blank');
  };

  const totalGrowth = Object.entries(portfolioData.monthlyGrowth)
    .reduce((sum, [category, growth]) => {
      const allocation = portfolioData.allocations[category as keyof typeof portfolioData.allocations];
      return sum + (growth * allocation / 100);
    }, 0);

  return (
    <div>
      <div className="bg-white p-6 border border-stone-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-stone-900">Portfolio Overview</h2>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-2xl font-bold text-stone-900 font-mono">
                {formatCurrency(portfolioData.totalAmount)}
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className={`text-sm font-medium ${getGrowthColor(totalGrowth)}`}>
              {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(2)}% this month
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-stone-200 shadow-sm mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-stone-900 mb-2">Asset Allocation</h3>
        </div>

        <div className="relative w-full h-80 bg-stone-900 overflow-hidden cursor-pointer">
          {treemapData.map(([category, percentage], index) => {
            const positions = [
              { left: '0%', top: '0%', width: '42%', height: '65%' },
              { left: '42%', top: '0%', width: '33%', height: '45%' },
              { left: '42%', top: '45%', width: '33%', height: '20%' },
              { left: '75%', top: '0%', width: '25%', height: '35%' },
              { left: '75%', top: '35%', width: '25%', height: '30%' },
              { left: '0%', top: '65%', width: '28%', height: '35%' },
              { left: '28%', top: '65%', width: '22%', height: '35%' },
              { left: '50%', top: '65%', width: '50%', height: '35%' },
            ];
            
            const position = positions[index] || { left: '0%', top: '0%', width: '10%', height: '10%' };
            const growth = portfolioData.monthlyGrowth[category as keyof typeof portfolioData.monthlyGrowth];
            const isHovered = hoveredAsset === category;
            
            return (
              <div
                key={category}
                className="absolute border border-stone-800 flex flex-col justify-center items-center text-stone-900 font-medium cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-lg"
                style={{
                  left: position.left,
                  top: position.top,
                  width: position.width,
                  height: position.height,
                  backgroundColor: getColor(category),
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  zIndex: isHovered ? 10 : 1
                }}
                onMouseEnter={() => setHoveredAsset(category)}
                onMouseLeave={() => setHoveredAsset(null)}
                onClick={() => setExpandedAsset(expandedAsset === category ? null : category)}
              >
                <div className="text-center p-1">
                  <div className="text-xs font-semibold mb-1">{category}</div>
                  <div className="text-xs font-mono mb-1">
                    {formatCurrency((portfolioData.totalAmount * percentage) / 100)}
                  </div>
                  <div className={`text-xs font-bold ${getGrowthColor(growth)}`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </div>
                </div>
                {isHovered && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 border border-stone-200 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Holdings</h3>
        <div className="space-y-2">
          {treemapData.map(([category, percentage]) => {
            const growth = portfolioData.monthlyGrowth[category as keyof typeof portfolioData.monthlyGrowth];
            const isExpanded = expandedAsset === category;
            const details = getAssetDetails(category);
            
            return (
              <div key={category} className="border border-stone-100 rounded overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50"
                  onClick={() => setExpandedAsset(isExpanded ? null : category)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-stone-900">{category}</span>
                    <div className={`text-sm font-semibold ${getGrowthColor(growth)}`}>
                      {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-stone-900">
                      {formatCurrency((portfolioData.totalAmount * percentage) / 100)}
                    </div>
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-6 pb-4 bg-stone-50 border-t border-stone-100 animate-fadeIn">
                    <div className="grid grid-cols-3 gap-4 mt-3 mb-4">
                      <div>
                        <div className="text-xs text-stone-600 mb-1">Description</div>
                        <div className="text-sm text-stone-900">{details.description}</div>
                      </div>
                      <div>
                        <div className="text-xs text-stone-600 mb-1">Risk Level</div>
                        <div className="text-sm text-stone-900">{details.risk}</div>
                      </div>
                      <div>
                        <div className="text-xs text-stone-600 mb-1">Liquidity</div>
                        <div className="text-sm text-stone-900">{details.liquidity}</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-stone-200 pt-4">
                      <div className="text-sm font-medium text-stone-900 mb-3">Holdings</div>
                      <div className="space-y-2">
                        {details.holdings?.map((holding, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-stone-100">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => openChart(holding.symbol)}
                                  className="text-sm font-medium text-stone-900 hover:text-blue-600"
                                >
                                  {holding.name}
                                </button>
                                <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded">
                                  {holding.source}
                                </span>
                              </div>
                              <div className="text-xs text-stone-500 mt-1">
                                <input 
                                  type="date" 
                                  value={holding.dateInvested}
                                  onChange={(e) => updateInvestmentDate(treemapData.findIndex(([cat]) => cat === category), idx, e.target.value)}
                                  className="bg-transparent border-none text-xs text-stone-500 cursor-pointer hover:text-stone-700"
                                />
                              </div>
                            </div>
                            <div className="text-sm font-mono text-stone-900">
                              {formatCurrency(holding.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600">
                        Investment dates editable for better analysis
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;