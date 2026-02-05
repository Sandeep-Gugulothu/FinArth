from typing import List, Dict, Any
from collections import defaultdict

class PortfolioAnalyzer:
    """
    Deterministic engine for analyzing portfolio data before AI processing.
    """
    
    @staticmethod
    def analyze_holdings(holdings: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates core metrics from a list of holdings.
        """
        if not holdings:
            return {
                "total_value": 0,
                "allocation": {},
                "risk_score": 0,
                "diversity_score": 0,
                "top_holdings": []
            }

        total_value = sum(h.get('amount', 0) for h in holdings)
        
        # Category Allocation
        allocation = defaultdict(float)
        assets = []
        
        for h in holdings:
            amount = h.get('amount', 0)
            category = h.get('category', 'Uncategorized')
            allocation[category] += amount
            
            assets.append({
                "symbol": h.get("symbol", "N/A"),
                "name": h.get("name", "Unknown"),
                "value": amount,
                "weight": (amount / total_value) if total_value > 0 else 0
            })

        # Calculate percentages
        allocation_pct = {k: (v / total_value) if total_value > 0 else 0 for k, v in allocation.items()}
        
        # Basic Risk Score (Heuristic based on categories)
        # 1-10 Scale: Crypto=9, Tech=7, Bonds=3, Cash=1
        risk_map = {
            "Crypto": 9,
            "Cryptocurrency": 9,
            "Stock": 7,
            "Equity": 7,
            "Technology": 8,
            "ETF": 5,
            "Bond": 3,
            "Real Estate": 4,
            "Cash": 1
        }
        
        weighted_risk = 0
        for cat, weight in allocation_pct.items():
            # Default to medium risk (5) if unknown
            # Simple keyword matching
            score = 5
            for key, val in risk_map.items():
                if key.lower() in cat.lower():
                    score = val
                    break
            weighted_risk += score * weight

        # Sort top holdings
        assets.sort(key=lambda x: x['value'], reverse=True)

        return {
            "total_value": total_value,
            "allocation": allocation_pct,
            "risk_metric": round(weighted_risk, 2),
            "holdings_count": len(holdings),
            "top_3_assets": assets[:3]
        }
