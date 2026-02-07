interface MarketInsight {
  id: string;
  type: 'surge' | 'drop' | 'news' | 'alert';
  symbol: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: number;
}

interface MarketData {
  insights: MarketInsight[];
  prices: Record<string, number>;
  changes: Record<string, number>;
}

interface ApiUsage {
  used: number;
  limit: number;
  remaining: number;
}

class MarketDataService {
  private static instance: MarketDataService;
  private apiUsage: ApiUsage = { used: 0, limit: 100, remaining: 100 };

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  async getMarketData(symbols: string[]): Promise<MarketData> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.apiUsage.used += 1;
    this.apiUsage.remaining = this.apiUsage.limit - this.apiUsage.used;

    // Mock data
    const insights: MarketInsight[] = [
      {
        id: '1',
        type: 'surge',
        symbol: 'AAPL',
        title: 'Apple Stock Surges',
        message: 'AAPL up 3.2% on strong earnings report',
        severity: 'medium',
        timestamp: Date.now() - 300000
      },
      {
        id: '2',
        type: 'drop',
        symbol: 'TSLA',
        title: 'Tesla Dips',
        message: 'TSLA down 2.1% on production concerns',
        severity: 'low',
        timestamp: Date.now() - 600000
      },
      {
        id: '3',
        type: 'news',
        symbol: 'NVDA',
        title: 'NVIDIA AI Partnership',
        message: 'New AI chip partnership announced',
        severity: 'high',
        timestamp: Date.now() - 900000
      }
    ];

    const prices: Record<string, number> = {
      'AAPL': 175.50,
      'MSFT': 420.25,
      'GOOGL': 140.80,
      'TSLA': 245.30,
      'NVDA': 875.60
    };

    const changes: Record<string, number> = {
      'AAPL': 3.2,
      'MSFT': 1.8,
      'GOOGL': -0.5,
      'TSLA': -2.1,
      'NVDA': 4.5
    };

    return { insights, prices, changes };
  }

  getApiUsage(): ApiUsage {
    return { ...this.apiUsage };
  }
}

export default MarketDataService;