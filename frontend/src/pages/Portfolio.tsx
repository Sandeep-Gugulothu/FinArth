import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api.ts';

interface PortfolioProps {
  holdings: any[];
  onRefresh: () => void;
  marketData: any;
  cryptoAnalysisProp?: Record<number, any>;
}

const CryptoTracker = ({ symbol, date, entryPrice }: { symbol: string; date: string, entryPrice?: number }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await apiCall('/api/market/weex/analysis', {
          method: 'POST',
          body: JSON.stringify({ symbol, date, entryPrice })
        });
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (symbol && date) fetchAnalysis();
  }, [symbol, date, entryPrice]);

  if (loading) return <span className="text-[10px] text-stone-400 animate-pulse">Fetching WEEX data...</span>;
  if (!data || data.error) return <span className="text-[10px] text-stone-400">Symbol not found on WEEX</span>;

  return (
    <div className="flex gap-3 mt-1.5 items-center bg-stone-50 px-2.5 py-1.5 rounded-md border border-stone-200 w-fit shadow-sm">
      <div className="flex flex-col">
        {data.growth_percentage !== null ? (
          <span className={`text-[11px] font-bold uppercase tracking-wider ${data.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.growth_percentage >= 0 ? '+' : ''}{data.growth_percentage}% ROI
          </span>
        ) : (
          <span className="text-[11px] font-bold text-stone-400 italic">HODL</span>
        )}
      </div>
      <div className="w-[1px] h-3 bg-stone-300" />
      <span className="text-[11px] font-bold text-stone-600 font-mono">
        NOW: ${data.current_price.toLocaleString()}
      </span>
      <div className="w-[1px] h-3 bg-stone-300" />
      <span className={`text-[11px] font-bold ${data.price_change_24h_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        24h: {data.price_change_24h_pct >= 0 ? '↑' : '↓'} {Math.abs(data.price_change_24h_pct).toFixed(2)}%
      </span>
    </div>
  );
};

const Portfolio: React.FC<PortfolioProps> = ({ holdings, onRefresh, marketData, cryptoAnalysisProp = {} }) => {
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const [cryptoAnalysis, setCryptoAnalysis] = useState<Record<number, any>>(cryptoAnalysisProp);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(true);

  // Fetch crypto analysis when component mounts or holdings change
  useEffect(() => {
    const fetchCryptoAnalysis = async () => {
      setIsAnalysisLoading(true);
      const cryptoHoldings = holdings.filter(h => h.category === 'Crypto' && h.symbol && h.date);

      if (cryptoHoldings.length === 0) {
        setIsAnalysisLoading(false);
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
      setIsAnalysisLoading(false);
    };

    if (holdings.length > 0) {
      fetchCryptoAnalysis();
    } else {
      setIsAnalysisLoading(false);
    }
  }, [holdings]);

  // Calculate dynamic portfolio data based on actual holdings
  const calculatePortfolioData = () => {
    const categoryCurrentValues: Record<string, number> = {};
    const totalInvested = holdings.reduce((sum, holding: any) => sum + (holding.amount || 0), 0);

    // Calculate current value based on real-time and estimated growth
    const currentValue = holdings.reduce((sum, holding: any) => {
      let growth = 0;
      if (holding.category === 'Crypto') {
        const analysis = cryptoAnalysis[holding.id];
        growth = analysis ? (analysis.growth_percentage || 0) : 0;
      } else {
        // Fallback to category estimates if no real-time data
        growth = {
          'Stocks': 0.8,
          'Mutual Funds': 0.5,
          'Real Estate': 0.1,
          'Fixed Deposits': 0.02,
          'Gold ETFs': marketData?.top_coins?.find((c: any) => c.symbol === 'xau' || c.id === 'pax-gold')?.price_change_percentage_24h || 0.3,
          'Bonds': 0.01,
          'Others': 0.1
        }[holding.category as string] || 0;
      }
      const val = holding.amount * (1 + growth / 100);
      categoryCurrentValues[holding.category] = (categoryCurrentValues[holding.category] || 0) + val;
      return sum + val;
    }, 0);



    const categoryTotals = holdings.reduce((acc, holding: any) => {
      acc[holding.category] = (acc[holding.category] || 0) + (holding.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    const allocations = Object.entries(categoryTotals).reduce((acc, [category, amount]) => {
      acc[category] = totalInvested > 0 ? Math.round(((amount as number) / totalInvested) * 100) : 0;
      return acc;
    }, {} as Record<string, number>);


    // Dynamically derive growth data for heatmap and indicators
    const cryptoHoldings = holdings.filter(h => h.category === 'Crypto');
    let weightedCryptoROI = marketData?.global?.market_cap_change_percentage_24h_usd || -1.2;

    if (cryptoHoldings.length > 0) {
      let totalAmountInCrypto = 0;
      let totalWeightedROI = 0;
      let validROIFound = false;

      cryptoHoldings.forEach(h => {
        const analysis = cryptoAnalysis[h.id];
        if (analysis && analysis.growth_percentage !== null) {
          totalWeightedROI += (analysis.growth_percentage * h.amount);
          totalAmountInCrypto += h.amount;
          validROIFound = true;
        }
      });

      if (validROIFound && totalAmountInCrypto > 0) {
        weightedCryptoROI = totalWeightedROI / totalAmountInCrypto;
      }
    }

    const totalProfit = currentValue - totalInvested;

    return {
      totalInvested,
      currentValue,
      totalProfit,
      categoryCurrentValues,
      allocations,
      monthlyGrowth: {
        'Stocks': 0.8,
        'Mutual Funds': 0.5,
        'Real Estate': 0.1,
        'Fixed Deposits': 0.02,
        'Gold ETFs': marketData?.top_coins?.find((c: any) => c.symbol === 'xau' || c.id === 'pax-gold')?.price_change_percentage_24h || 0.3,
        'Bonds': 0.01,
        'Crypto': weightedCryptoROI,
        'Others': 0.1
      }
    };
  };

  const portfolioData = calculatePortfolioData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingHolding, setEditingHolding] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHolding, setNewHolding] = useState({ name: '', category: 'Stocks', amount: '', date: '', symbol: '' });

  const categories = ['Stocks', 'Mutual Funds', 'Real Estate', 'Fixed Deposits', 'Gold ETFs', 'Bonds', 'Crypto', 'Others'];

  const saveHolding = async (holding: any) => {
    try {
      const method = editingHolding ? 'PUT' : 'POST';
      const endpoint = editingHolding
        ? `/api/portfolio/holdings/${editingHolding.id}`
        : '/api/portfolio/holdings';

      await apiCall(endpoint, {
        method,
        body: JSON.stringify({
          ...holding,
          amount: parseInt(holding.amount)
        })
      });

      setShowAddForm(false);
      setEditingHolding(null);
      setNewHolding({ name: '', category: 'Stocks', amount: '', date: '', symbol: '' });
      onRefresh();
    } catch (err: any) {
      alert('Failed to save holding: ' + err.message);
    }
  };

  const deleteHolding = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) return;
    try {
      await apiCall(`/api/portfolio/holdings/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err: any) {
      alert('Failed to delete holding');
    }
  };

  const startEdit = (holding: any) => {
    setEditingHolding(holding);
    setNewHolding({
      name: holding.name,
      category: holding.category,
      amount: holding.amount.toString(),
      date: holding.date,
      symbol: holding.symbol || ''
    });
    setShowAddForm(true);
  };

  const openChart = (symbol: string) => {
    if (symbol) {
      const chartUrl = `https://in.tradingview.com/chart/?symbol=${symbol}`;
      window.open(chartUrl, '_blank');
    }
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

  const totalGrowth = Object.entries(portfolioData.monthlyGrowth)
    .reduce((sum, [category, growth]) => {
      const allocation = portfolioData.allocations[category as keyof typeof portfolioData.allocations] || 0;
      return sum + (growth * allocation / 100);
    }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-50 to-stone-100 p-8 rounded-xl border border-stone-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-2">Portfolio Overview</h2>
            <p className="text-stone-600">Track your investments with real-time insights</p>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end gap-1 mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Current Value</span>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-stone-900 font-mono tracking-tight">
                  {formatCurrency(portfolioData.currentValue)}
                </div>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setShowAddForm(false);
                    setEditingHolding(null);
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium"
                >
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
                <span>Invested: {formatCurrency(portfolioData.totalInvested)}</span>
                <span className="text-stone-300">|</span>
                {isAnalysisLoading ? (
                  <span className="text-stone-400 animate-pulse">Calculating profit...</span>
                ) : (
                  <span className={getGrowthColor(portfolioData.totalProfit)}>
                    {portfolioData.totalProfit >= 0 ? '+' : ''}{formatCurrency(portfolioData.totalProfit)} Profit
                  </span>
                )}
              </div>
              <div className={`text-base font-bold ${getGrowthColor(totalGrowth)} flex items-center gap-2 mt-1`}>
                <span>{totalGrowth >= 0 ? '↗' : '↘'}</span>
                {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(2)}% Performance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-stone-900 mb-2">Asset Allocation Heatmap</h3>
          <p className="text-stone-600">Click on any asset to explore detailed holdings</p>
        </div>

        <div className="relative w-full h-96 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
          {treemapData.map(([category, percentage], index) => {
            const positions = [
              { left: '1%', top: '1%', width: '40%', height: '62%' },
              { left: '42%', top: '1%', width: '31%', height: '43%' },
              { left: '42%', top: '45%', width: '31%', height: '18%' },
              { left: '74%', top: '1%', width: '25%', height: '33%' },
              { left: '74%', top: '35%', width: '25%', height: '28%' },
              { left: '1%', top: '64%', width: '26%', height: '35%' },
              { left: '28%', top: '64%', width: '20%', height: '35%' },
              { left: '49%', top: '64%', width: '50%', height: '35%' },
            ];

            const position = positions[index] || { left: '0%', top: '0%', width: '10%', height: '10%' };
            const growth = portfolioData.monthlyGrowth[category as keyof typeof portfolioData.monthlyGrowth];
            const isHovered = hoveredAsset === category;

            return (
              <div
                key={category}
                className="absolute border border-stone-300 flex flex-col justify-center items-center text-stone-900 font-semibold cursor-pointer transition-all duration-300 hover:z-20 hover:shadow-lg rounded"
                style={{
                  left: position.left,
                  top: position.top,
                  width: position.width,
                  height: position.height,
                  backgroundColor: getColor(category),
                  transform: isHovered ? 'scale(1.05) rotate(2deg)' : 'scale(1)',
                  zIndex: isHovered ? 20 : 1
                }}
                onMouseEnter={() => setHoveredAsset(category)}
                onMouseLeave={() => setHoveredAsset(null)}
                onClick={() => setExpandedAsset(expandedAsset === category ? null : category)}
              >
                <div className="text-center p-2">
                  <div className="text-sm font-bold mb-1">{category}</div>
                  <div className="text-xs font-mono mb-1">
                    {formatCurrency(portfolioData.categoryCurrentValues[category] || 0)}
                  </div>
                  <div className={`text-xs font-bold ${getGrowthColor(growth)}`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-white p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-stone-900">Holdings</h3>
          {isEditing && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200 font-medium"
            >
              Add New
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isEditing && showAddForm && (
          <div className="bg-stone-50 p-4 rounded-lg mb-6 border border-stone-200">
            <h4 className="font-semibold text-stone-900 mb-3">{editingHolding ? 'Edit Holding' : 'Add New Holding'}</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Investment name"
                value={newHolding.name}
                onChange={(e) => setNewHolding(prev => ({ ...prev, name: e.target.value }))}
                className="p-2 border border-stone-300 rounded"
              />
              <select
                value={newHolding.category}
                onChange={(e) => setNewHolding(prev => ({ ...prev, category: e.target.value }))}
                className="p-2 border border-stone-300 rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newHolding.amount}
                onChange={(e) => setNewHolding(prev => ({ ...prev, amount: e.target.value }))}
                className="p-2 border border-stone-300 rounded"
              />
              <input
                type="date"
                value={newHolding.date}
                onChange={(e) => setNewHolding(prev => ({ ...prev, date: e.target.value }))}
                className="p-2 border border-stone-300 rounded"
              />
              <input
                type="text"
                placeholder={newHolding.category === 'Crypto' ? "e.g. btcusdt" : "e.g. RELIANCE"}
                value={newHolding.symbol}
                autoComplete="off"
                onChange={(e) => {
                  const val = e.target.value;
                  setNewHolding(prev => ({
                    ...prev,
                    symbol: prev.category === 'Crypto' ? val.toLowerCase() : val.toUpperCase()
                  }));
                }}
                className="p-2 border border-stone-300 rounded"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => saveHolding(newHolding)}
                disabled={!newHolding.name || !newHolding.amount || !newHolding.date}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {editingHolding ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingHolding(null);
                  setNewHolding({ name: '', category: 'Stocks', amount: '', date: '', symbol: '' });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Holdings by Category */}
        <div className="space-y-3">
          {treemapData.map(([category, percentage]) => {
            const growth = portfolioData.monthlyGrowth[category as keyof typeof portfolioData.monthlyGrowth];
            const isExpanded = expandedAsset === category;
            const categoryHoldings = holdings.filter((h: any) => h.category === category);

            return (
              <div key={category} className="border border-stone-200 rounded overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-50"
                  onClick={() => setExpandedAsset(isExpanded ? null : category)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-stone-900">{category}</span>
                    <div className={`text-sm font-semibold ${getGrowthColor(growth)}`}>
                      {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-stone-900 font-mono">
                        {formatCurrency(portfolioData.categoryCurrentValues[category] || 0)}
                      </div>
                      <div className="text-xs text-stone-500">{percentage}%</div>
                    </div>
                    <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      ↓
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-stone-200 bg-stone-50">
                    {categoryHoldings.length > 0 ? (
                      <div className="p-4 space-y-3">
                        {categoryHoldings.map((holding: any) => (
                          <div key={holding.id} className="flex flex-col bg-white p-4 rounded-lg border border-stone-200 hover:border-stone-300 transition-all shadow-sm">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm md:text-base font-bold text-stone-900">{holding.name}</span>
                                {holding.symbol && (
                                  <button
                                    onClick={() => openChart(holding.symbol)}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline font-medium w-fit"
                                  >
                                    Open TradingView Chart
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-col items-end min-w-[140px] gap-1">
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="text-base font-bold text-stone-900 font-mono">
                                      {formatCurrency(holding.amount)}
                                    </div>
                                    <div className="text-xs text-stone-500 font-medium">{holding.date}</div>
                                  </div>
                                  {isEditing && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => startEdit(holding)}
                                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => deleteHolding(holding.id)}
                                        className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {holding.category === 'Crypto' && holding.symbol && (
                                  <CryptoTracker
                                    symbol={holding.symbol}
                                    date={holding.date}
                                    entryPrice={holding.entry_price}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-stone-500 italic">
                        No holdings discovered in this category yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;