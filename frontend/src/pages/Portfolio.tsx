import React, { useState } from 'react';

const Portfolio: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState({
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
  const [userHoldings, setUserHoldings] = useState([
    { id: 1, name: 'HDFC Bank', category: 'Stocks', amount: 2500000, date: '2024-01-15', source: 'Zerodha API' },
    { id: 2, name: 'SBI Bluechip Fund', category: 'Mutual Funds', amount: 2000000, date: '2024-02-10', source: 'Manual Entry' },
    { id: 3, name: 'Prestige Estates', category: 'Real Estate', amount: 1500000, date: '2024-03-05', source: 'Manual Entry' },
    { id: 4, name: 'HDFC FD', category: 'Fixed Deposits', amount: 1200000, date: '2024-01-20', source: 'Manual Entry' },
    { id: 5, name: 'Gold ETF', category: 'Gold ETFs', amount: 1000000, date: '2024-02-15', source: 'Alpha Vantage API' },
    { id: 6, name: 'Government Bonds', category: 'Bonds', amount: 800000, date: '2024-03-01', source: 'Manual Entry' },
    { id: 7, name: 'Bitcoin', category: 'Crypto', amount: 500000, date: '2024-02-20', source: 'Binance API' },
    { id: 8, name: 'PPF', category: 'Others', amount: 500000, date: '2024-01-10', source: 'Manual Entry' }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHolding, setEditingHolding] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHolding, setNewHolding] = useState({ name: '', category: 'Stocks', amount: '', date: '' });

  const categories = ['Stocks', 'Mutual Funds', 'Real Estate', 'Fixed Deposits', 'Gold ETFs', 'Bonds', 'Crypto', 'Others'];

  const saveHolding = (holding: any) => {
    if (editingHolding) {
      setUserHoldings(prev => prev.map(h => h.id === editingHolding.id ? { ...holding, id: editingHolding.id, amount: parseInt(holding.amount) } : h));
      setEditingHolding(null);
    } else {
      setUserHoldings(prev => [...prev, { ...holding, id: Date.now(), amount: parseInt(holding.amount), source: 'Manual Entry' }]);
      setShowAddForm(false);
    }
    setNewHolding({ name: '', category: 'Stocks', amount: '', date: '' });
  };

  const deleteHolding = (id: number) => {
    setUserHoldings(prev => prev.filter(h => h.id !== id));
  };

  const startEdit = (holding: any) => {
    setEditingHolding(holding);
    setNewHolding({ name: holding.name, category: holding.category, amount: holding.amount.toString(), date: holding.date });
    setShowAddForm(true);
  };

  const getSourceTooltip = (source: string) => {
    const tooltips = {
      'Zerodha API': 'Fetched from Zerodha API',
      'Alpha Vantage API': 'Fetched from Alpha Vantage API', 
      'Binance API': 'Fetched from Binance API',
      'Manual Entry': 'Manually entered data'
    };
    return tooltips[source as keyof typeof tooltips] || 'Data source';
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
      const allocation = portfolioData.allocations[category as keyof typeof portfolioData.allocations];
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
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl font-bold text-stone-900 font-mono tracking-tight">
                {formatCurrency(portfolioData.totalAmount)}
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
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-stone-500 mt-1">Live</span>
              </div>
            </div>
            <div className={`text-lg font-semibold ${getGrowthColor(totalGrowth)} flex items-center gap-2`}>
              <span>{totalGrowth >= 0 ? '↗' : '↘'}</span>
              {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(2)}% this month
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
                    {formatCurrency((portfolioData.totalAmount * percentage) / 100)}
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
                  setNewHolding({ name: '', category: 'Stocks', amount: '', date: '' });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Holdings List */}
        <div className="space-y-3">
          {userHoldings.map((holding) => (
            <div key={holding.id} className="border border-stone-200 rounded p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-stone-900">{holding.name}</span>
                  <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded">{holding.category}</span>
                  <span className="text-xs text-stone-400" title={getSourceTooltip(holding.source)}>
                    {holding.source}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-stone-900 font-mono">
                      {formatCurrency(holding.amount)}
                    </div>
                    <div className="text-xs text-stone-500">{holding.date}</div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;