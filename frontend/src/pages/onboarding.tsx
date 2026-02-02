import React, { useState } from 'react';

const Shield = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TrendingUp = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Target = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </svg>
);

const Calculator = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const Bot = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowRight = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CheckCircle = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-stone-600">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const OnboardingPage = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [userAge, setUserAge] = useState('');
  const [riskPreference, setRiskPreference] = useState('');
  const [familiarInvestments, setFamiliarInvestments] = useState<string[]>([]);
  const [returnEstimate, setReturnEstimate] = useState('');
  
  const options = [
    { id: 'strategy', text: 'Strengthen my financial strategy', icon: Shield },
    { id: 'returns', text: 'Maximize risk-adjusted returns', icon: TrendingUp },
    { id: 'protection', text: 'Enhance downside protection', icon: Shield },
    { id: 'recommendations', text: 'Receive tailored recommendations', icon: Target },
    { id: 'optimization', text: 'Minimize taxes and fees', icon: Calculator },
    { id: 'tracking', text: 'Monitor my net worth', icon: TrendingUp },
    { id: 'insights', text: 'Access AI investment insights', icon: Bot },
    { id: 'other', text: 'Explore other options', icon: ArrowRight }
  ];

  const toggleInvestment = (investmentId: string) => {
    setFamiliarInvestments(prev => 
      prev.includes(investmentId) 
        ? prev.filter(id => id !== investmentId)
        : [...prev, investmentId]
    );
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 shadow-xl max-w-lg w-full p-10">
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-stone-600 mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
              {/* Colony map background */}
              <div className="absolute inset-0 bg-stone-700">
                <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
                  {/* Territory boundaries */}
                  <polygon points="10,10 35,8 45,25 30,40 8,35" fill="#57534e" stroke="#44403c" strokeWidth="0.5" />
                  <polygon points="45,25 70,20 75,45 50,50 45,25" fill="#6b7280" stroke="#4b5563" strokeWidth="0.5" />
                  <polygon points="30,40 50,50 45,70 20,65 30,40" fill="#78716c" stroke="#57534e" strokeWidth="0.5" />
                  <polygon points="8,35 30,40 20,65 5,60 8,35" fill="#6b7280" stroke="#4b5563" strokeWidth="0.5" />
                  
                  {/* Settlement points */}
                  <circle cx="22" cy="20" r="1.5" fill="#f5f5f4" />
                  <circle cx="58" cy="32" r="1.5" fill="#f5f5f4" />
                  <circle cx="38" cy="55" r="1.5" fill="#f5f5f4" />
                  <circle cx="15" cy="50" r="1" fill="#e7e5e4" />
                  
                  {/* Trade routes */}
                  <path d="M22,20 Q40,15 58,32" stroke="#f5f5f4" strokeWidth="0.8" fill="none" />
                  <path d="M58,32 Q48,43 38,55" stroke="#f5f5f4" strokeWidth="0.8" fill="none" />
                  <path d="M38,55 Q26,52 15,50" stroke="#e7e5e4" strokeWidth="0.6" fill="none" strokeDasharray="1,1" />
                  <path d="M15,50 Q18,35 22,20" stroke="#e7e5e4" strokeWidth="0.6" fill="none" strokeDasharray="1,1" />
                </svg>
              </div>
              
              {/* Main navigation overlay */}
              <svg className="w-12 h-12 relative z-10" viewBox="0 0 48 48" fill="none">
                <circle cx="12" cy="12" r="2" fill="#f5f5f4" />
                <circle cx="36" cy="16" r="2" fill="#f5f5f4" />
                <circle cx="24" cy="36" r="2" fill="#f5f5f4" />
                <circle cx="8" cy="32" r="1.5" fill="#e7e5e4" />
                <circle cx="40" cy="32" r="1.5" fill="#e7e5e4" />
                <path d="M12,12 Q20,8 36,16" stroke="#f5f5f4" strokeWidth="1" fill="none" />
                <path d="M36,16 Q32,26 24,36" stroke="#f5f5f4" strokeWidth="1" fill="none" />
                <path d="M24,36 Q16,34 8,32" stroke="#f5f5f4" strokeWidth="1" fill="none" />
                <path d="M8,32 Q10,22 12,12" stroke="#e7e5e4" strokeWidth="1" fill="none" strokeDasharray="2,2" />
                <path d="M36,16 Q38,24 40,32" stroke="#e7e5e4" strokeWidth="1" fill="none" strokeDasharray="2,2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-4">Take full control of your finances</h1>
            <p className="text-stone-600 leading-relaxed text-lg">
              No hidden fees. No biased salespeople. Just simple, powerful tools and personalized investment guidance.
            </p>
          </div>
          
          <button
            onClick={() => setStep(2)}
            className="w-full px-8 py-4 bg-stone-800 text-stone-50 font-semibold hover:bg-stone-900 transition-colors text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white border border-stone-200 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Important Disclosures & Terms</h2>
          
          <div className="space-y-6 text-xs text-stone-700 mb-8 leading-tight">
            <div className="border-l-4 border-stone-600 pl-4">
              <h3 className="font-bold text-stone-900 mb-2 text-sm">Risk Disclosure Statement</h3>
              <p className="text-xs leading-none">The Company hereby provides notice that all investment products and services offered through this platform involve inherent market risks, including but not limited to market volatility, economic downturns, interest rate fluctuations, currency exchange variations, inflation risks, deflation risks, credit risks, liquidity risks, operational risks, regulatory risks, political risks, geopolitical risks, systemic risks, counterparty risks, settlement risks, technology risks, cybersecurity risks, and other systematic and unsystematic risks that may result in partial or total loss of invested capital. Past performance data, historical returns, backtested results, simulated performance, hypothetical scenarios, and projected outcomes do not constitute a guarantee of future performance and should not be construed as an indication of future results. The value of investments may fluctuate significantly and investors may receive back less than their original investment amount. Market conditions can change rapidly and unpredictably, and there can be no assurance that any investment strategy will be successful in achieving its objectives. Diversification does not guarantee against loss. All investments carry risk of loss, including the potential for total loss of principal. Economic factors, market sentiment, regulatory changes, and unforeseen events may adversely impact investment performance. Furthermore, the Company disclaims any responsibility for losses arising from market conditions, economic factors, or external events beyond its control, and users acknowledge that investment decisions are made at their own risk and discretion.</p>
            </div>
            
            <div className="border-l-4 border-stone-600 pl-4">
              <h3 className="font-bold text-stone-900 mb-2 text-sm">Educational Services Disclaimer</h3>
              <p className="text-xs leading-none">FinArth Technologies Private Limited ("Company") provides educational content, analytical tools, informational resources, research materials, market commentary, and general financial information for general educational purposes only. The information, analysis, recommendations, opinions, research, data, content, materials, and services provided through this platform do not constitute investment advice, financial planning advice, tax advice, legal advice, accounting advice, insurance advice, estate planning advice, or any other form of professional advice. Users acknowledge and agree that the Company does not provide personalized investment recommendations, individualized financial planning services, or customized investment strategies, and that all content is of a general nature and not tailored to any specific individual's financial situation, investment objectives, risk tolerance, or personal circumstances. Users are strongly advised and encouraged to consult with qualified financial advisors, registered investment advisors, certified financial planners, tax professionals, attorneys, accountants, and other licensed professionals before making any investment decisions, financial commitments, or implementing any financial strategies. The Company makes no representations or warranties regarding the accuracy, completeness, timeliness, or reliability of any information provided. Users further acknowledge that the Company shall not be held liable for any investment decisions made based on the information provided through this platform, and that all investment decisions are made solely at the user's own risk and discretion.</p>
            </div>
            
            <div className="border-l-4 border-stone-600 pl-4">
              <h3 className="font-bold text-stone-900 mb-2 text-sm">Artificial Intelligence System Limitations</h3>
              <p className="text-xs leading-none">The artificial intelligence algorithms, machine learning models, automated systems, algorithmic trading systems, robo-advisory services, and computational tools employed by the Company are designed to provide general guidance and educational information based on mathematical models, statistical analysis, historical data analysis, pattern recognition, and algorithmic processing. These systems have inherent limitations, biases, and constraints and may not account for all market conditions, economic factors, personal circumstances, individual risk factors, behavioral considerations, emotional factors, or external variables that could materially affect investment outcomes and financial decisions. The AI systems, algorithms, and automated tools are not a substitute for professional financial planning, personalized investment advice, human judgment, professional expertise, or individualized analysis. Users acknowledge and understand that algorithmic recommendations, AI-generated content, automated suggestions, and system outputs may contain errors, inaccuracies, biases, limitations, technical glitches, or computational mistakes and should not be relied upon as the sole basis for investment decisions or financial planning. The Company disclaims all liability for any losses, damages, or adverse outcomes resulting from reliance on AI-generated recommendations or automated system outputs. Users further acknowledge that AI systems may not perform as expected under all market conditions and that the Company makes no guarantees regarding the accuracy or reliability of AI-generated content or recommendations.</p>
            </div>
            
            <div className="border-l-4 border-stone-600 pl-4">
              <h3 className="font-bold text-stone-900 mb-2 text-sm">Terms of Service and Privacy Agreement</h3>
              <p className="text-xs leading-none">By accessing, using, or registering for this platform, users hereby agree to be bound by the Company's Terms of Service, Privacy Policy, User Agreement, Acceptable Use Policy, Cookie Policy, Data Processing Agreement, and all applicable terms, conditions, rules, policies, and guidelines as may be amended, modified, updated, or supplemented from time to time at the Company's sole discretion. Users acknowledge that they have read, understood, reviewed, and agree to comply with all terms, conditions, and policies governing the use of this platform, including but not limited to user conduct, prohibited activities, intellectual property rights, data usage, privacy practices, and dispute resolution procedures. Users consent to the collection, processing, storage, use, sharing, and transfer of their personal data, financial information, usage data, and other information in accordance with the Company's Privacy Policy and applicable data protection laws. The Company reserves the right to modify, update, change, suspend, or terminate these terms, conditions, services, or access to the platform at any time without prior notice, and continued use of the platform constitutes acceptance of such modifications. Users acknowledge all risks, limitations, disclaimers, and liability exclusions described herein and agree to hold the Company, its affiliates, subsidiaries, officers, directors, employees, agents, and representatives harmless from any and all losses, damages, claims, liabilities, costs, expenses, or adverse outcomes arising from or related to the use of this platform, services, or information provided. Users further agree to indemnify and hold harmless the Company from any claims, damages, or losses arising from their use of the platform or violation of these terms and conditions.</p>
            </div>
          </div>
          
          <label className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300"
            />
            <span className="text-sm text-stone-700">
              I acknowledge that I have read and understood the risks, limitations, and terms described above.
            </span>
          </label>
          
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!acceptedTerms}
              className="flex-1 px-6 py-3 bg-stone-800 text-stone-50 font-semibold hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 shadow-xl p-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              What should we call you
            </h2>
            <p className="text-stone-600">
              Mr. Handsome or Miss. Beautiful or Mrs. Beautiful?
            </p>
          </div>
          
          <div className="mb-8">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-center text-lg"
              autoFocus
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!userName.trim()}
              className="flex-1 px-6 py-3 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 shadow-xl p-8 text-center">
          <div className="mb-8">

            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              Which country are you from?
            </h2>
            <p className="text-stone-600">
              This helps us provide relevant financial guidance
            </p>
          </div>
          
          <div className="mb-8">
            <input
              type="text"
              value={userCountry}
              onChange={(e) => setUserCountry(e.target.value)}
              placeholder="Enter your country"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-center text-lg"
              autoFocus
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(3)}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!userCountry.trim()}
              className="flex-1 px-6 py-3 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
          
          <p className="text-xs text-stone-500 text-center mt-4 pt-4 border-t border-stone-200">
            Your choice affects how we run simulations, score your portfolio, and give recommendations.
          </p>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 shadow-xl p-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              What's your age?
            </h2>
            <p className="text-stone-600">
              This helps us tailor investment strategies for your life stage
            </p>
          </div>
          
          <div className="mb-8">
            <input
              type="number"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none text-center text-lg"
              autoFocus
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(4)}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(6)}
              disabled={!userAge.trim()}
              className="flex-1 px-6 py-3 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
          
          <p className="text-xs text-stone-500 text-center mt-4 pt-4 border-t border-stone-200">
            Your choice affects how we run simulations, score your portfolio, and give recommendations.
          </p>
        </div>
      </div>
    );
  }

  if (step === 6) {
    const riskOptions = [
      { id: 'conservative', label: 'Conservative', desc: 'Prefer stable returns with minimal risk' },
      { id: 'moderate', label: 'Moderate', desc: 'Balance between growth and stability' },
      { id: 'aggressive', label: 'Aggressive', desc: 'Willing to take higher risks for potential higher returns' }
    ];

    const investmentOptions = [
      'Fixed Deposits', 'Mutual Funds', 'Stocks', 'Bonds', 'Real Estate', 'Gold', 'Crypto', 'PPF/EPF'
    ];

    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white border border-stone-200 shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Investment Profile</h2>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">What's your risk preference?</h3>
            <div className="space-y-3">
              {riskOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRiskPreference(option.id)}
                  className={`w-full p-4 border text-left transition-all hover:bg-stone-50 ${
                    riskPreference === option.id
                      ? 'border-stone-600 bg-stone-50 shadow-sm'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="font-medium text-stone-900">{option.label}</div>
                  <div className="text-sm text-stone-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">What kinds of securities would you like to see recommendations for? or invested in?</h3>
            <div className="grid grid-cols-2 gap-3">
              {investmentOptions.map((investment) => (
                <button
                  key={investment}
                  onClick={() => toggleInvestment(investment)}
                  className={`p-3 border text-center transition-all hover:bg-stone-50 ${
                    familiarInvestments.includes(investment)
                      ? 'border-stone-600 bg-stone-50 shadow-sm'
                      : 'border-stone-200'
                  }`}
                >
                  <span className="text-stone-900 font-medium">{investment}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(5)}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(7)}
              disabled={!riskPreference}
              className="flex-1 px-6 py-3 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
          
          <p className="text-xs text-stone-500 text-center mt-4 pt-4 border-t border-stone-200">
            Your choice affects how we run simulations, score your portfolio, and give recommendations.
          </p>
        </div>
      </div>
    );
  }

  if (step === 7) {
    const returnOptions = [
      { 
        id: 'ai', 
        label: 'PortfolioPilot AI forecasts', 
        desc: 'We use our own tested AI models based on economic data to estimate returns',
        badge: 'Recommended'
      },
      { 
        id: 'blend', 
        label: 'Blend of AI and market forecasts', 
        desc: 'A mix of our AI forecasts and standard market return estimates',
        badge: null
      },
      { 
        id: 'market', 
        label: 'Market expected returns', 
        desc: 'Use standard market assumptions',
        badge: null
      }
    ];

    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white border border-stone-200 shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">What expected return estimates would you like us to use?</h2>
            <p className="text-stone-600">You can always change this later</p>
            <p className="text-xs text-stone-500 mt-2">
              Your choice affects how we run simulations, score your portfolio, and give recommendations.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="space-y-3">
              {returnOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setReturnEstimate(option.id)}
                  className={`w-full p-4 border text-left transition-all hover:bg-stone-50 relative ${
                    returnEstimate === option.id
                      ? 'border-stone-600 bg-stone-50 shadow-sm'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-stone-900">{option.label}</div>
                      <div className="text-sm text-stone-600 mt-1">{option.desc}</div>
                    </div>
                    {option.badge && (
                      <span className="ml-3 px-2 py-1 bg-stone-800 text-stone-50 text-xs rounded">
                        {option.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(6)}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(8)}
              disabled={!returnEstimate}
              className="flex-1 px-6 py-3 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 shadow-xl max-w-4xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">How can we help you today?</h1>
          <p className="text-stone-600 text-lg">Select all financial objectives that matter to you</p>
          <p className="text-xs text-stone-500 mt-2">
            Your choice affects how we run simulations, score your portfolio, and give recommendations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`flex items-center gap-4 p-6 border text-left transition-all hover:bg-stone-50 ${
                selectedOptions.includes(option.id)
                  ? 'border-stone-600 bg-stone-50 shadow-sm'
                  : 'border-stone-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                selectedOptions.includes(option.id) 
                  ? 'bg-stone-800 text-stone-50' 
                  : 'bg-stone-100 text-stone-600'
              }`}>
                <option.icon size={20} />
              </div>
              <div className="flex-1">
                <span className="text-stone-900 font-medium">{option.text}</span>
              </div>
              {selectedOptions.includes(option.id) && (
                <CheckCircle size={20} />
              )}
            </button>
          ))}
        </div>
        
        <div className="text-center mb-6">
          <p className="text-sm text-stone-500">
            Selected {selectedOptions.length} of {options.length} objectives
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setStep(7)}
            className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={async () => {
              const userId = localStorage.getItem('userId');
              const userData = {
                userId: parseInt(userId || '0'),
                name: userName,
                country: userCountry,
                age: parseInt(userAge),
                riskPreference,
                familiarInvestments,
                returnEstimate,
                selectedOptions
              };
              
              try {
                const response = await fetch('http://localhost:8000/api/users/onboarding', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
                });
                
                if (response.ok) {
                  const result = await response.json();
                  console.log('Onboarding success:', result);
                  localStorage.setItem('onboardingCompleted', 'true');
                  onComplete();
                } else {
                  const error = await response.json();
                  console.error('Failed to complete onboarding:', error);
                  alert('Failed to save data: ' + (error.error || 'Unknown error'));
                  onComplete();
                }
              } catch (error) {
                console.error('Failed to save user data:', error);
                alert('Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
                onComplete();
              }
            }}
            disabled={selectedOptions.length === 0}
            className="flex-1 px-8 py-4 bg-stone-800 text-stone-50 font-semibold hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;