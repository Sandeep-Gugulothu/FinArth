import React, { useState, useEffect, useRef } from 'react';

const useCountUp = (end: number, duration: number = 2000, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);
  
  return count;
};

const useIntersectionObserver = (ref: React.RefObject<Element>) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  
  return isVisible;
};

// Simple icon components
const Shield = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Target = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
  </svg>
);

const Calculator = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ArrowRight = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const MessageCircle = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Bot = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TrendingUp = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DollarSign = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const CheckCircle = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Navbar = ({ onGetStarted, isConnecting }: { onGetStarted: () => void; isConnecting: boolean }) => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          FinArth
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
      </div>

      <button 
        onClick={onGetStarted}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all text-sm font-medium text-white disabled:opacity-50"
      >
        <span>{isConnecting ? 'Loading...' : 'Get Started'}</span>
      </button>
    </div>
  </nav>
);

const Hero = ({ onGetStarted, isConnecting }: { onGetStarted: () => void; isConnecting: boolean }) => {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isStatsVisible = useIntersectionObserver(statsRef);
  
  const plansGenerated = useCountUp(15420, 2000, isStatsVisible);
  const moneyManaged = useCountUp(2500000, 2500, isStatsVisible);
  const successRate = useCountUp(94, 1500, isStatsVisible);
  const avgReturn = useCountUp(12, 2200, isStatsVisible);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
  <section ref={heroRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden perspective-1000">
    <div 
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 transition-transform duration-1000 ease-out"
      style={{
        transform: `translate(-50%, ${mousePos.y * 0.02}px) rotateX(${mousePos.y * 0.01}deg) rotateY(${mousePos.x * 0.01}deg)`
      }}
    />
    <div 
      className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 transition-transform duration-1000 ease-out"
      style={{
        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * -0.02}px) rotateX(${mousePos.y * -0.01}deg) rotateY(${mousePos.x * -0.01}deg)`
      }}
    />

    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 scroll-animate transform-gpu hover:scale-105 transition-all duration-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        AI-Powered Financial Planning
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 scroll-animate transform-gpu hover:scale-105 transition-all duration-500">
        Financial Confidence <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-x">
          Engine
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed scroll-animate">
        Convert your life goals into safe, automated, and understandable financial action. 
        No fear, no confusion, just confident progress toward what matters to you.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 scroll-animate">
        <button 
          onClick={onGetStarted}
          disabled={isConnecting}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform-gpu hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
        >
          {isConnecting ? 'Loading...' : 'Start Planning'} <ArrowRight size={18} />
        </button>
        <button 
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition-all transform-gpu hover:scale-105 hover:shadow-xl hover:shadow-slate-700/50 flex items-center justify-center gap-2"
        >
           See Example Plan
        </button>
      </div>
    </div>
  </section>
  );
};

const FeatureBento = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
  <section id="features" className="py-24 bg-slate-950 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16 scroll-animate">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform-gpu hover:scale-105 transition-all duration-300">Why Choose FinArth?</h2>
        <p className="text-slate-400">Traditional advice fails. We solve the real problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="md:col-span-2 p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden transform-gpu hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 0 ? 'rotateX(5deg) rotateY(-5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="relative z-10">
            <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Shield size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Safety-First Validation</h3>
            <p className="text-slate-400 max-w-md">
              Every recommendation is cross-checked by AI and validated for compliance. No black-box advice, just transparent, safe guidance.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-blue-600/20 to-transparent opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
        </div>

        <div 
          className="md:row-span-2 p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-purple-500/30 transition-all group transform-gpu hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 1 ? 'rotateX(-5deg) rotateY(5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Target size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Goal-Based Planning</h3>
          <p className="text-slate-400 mb-8">
            Tell us "I want ₹50 lakhs for a house in 7 years" and get exact calculations, personality matching, and specific investment allocations.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5 transform-gpu group-hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 animate-pulse" />
              <div>
                <div className="text-sm font-bold text-white">House Goal</div>
                <div className="text-xs text-slate-500">₹50L • 7 Years • Frontier</div>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div 
          className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-green-500/30 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 2 ? 'rotateX(5deg) rotateY(5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mb-6 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-300">
            <Calculator size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Personalized Math</h3>
          <p className="text-slate-400 text-sm">
            Exact calculations based on YOUR numbers. No generic advice - just clear math that makes sense.
          </p>
        </div>

        <div 
          className="p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-orange-500/30 transition-all transform-gpu hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 scroll-animate"
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            transform: hoveredCard === 3 ? 'rotateX(-5deg) rotateY(-5deg) scale(1.02)' : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-6 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-300">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Clear Action Steps</h3>
          <p className="text-slate-400 text-sm">
            Not just "invest in mutual funds" but "Buy these 3 specific funds, invest ₹25,000 each, here's why."
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};

const UseCases = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
  <section className="py-24 bg-slate-900 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16 scroll-animate">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform-gpu hover:scale-105 transition-all duration-300">Problem We Are Solving</h2>
        <p className="text-slate-400">People want to grow their money safely toward real-life goals, but they are unable to translate intent into confident action.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="p-8 rounded-3xl bg-slate-950 border border-white/5 scroll-animate">
          <h3 className="text-2xl font-bold text-white mb-4">Core User Problem</h3>
          <p className="text-slate-400 mb-6">
            At the center is a single conflict: "I know I should invest, but I don't know how to do it safely, confidently, and consistently without constant effort."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">What Users Say:</h4>
              <ul className="space-y-2 text-slate-400">
                <li>• "I want to buy a house"</li>
                <li>• "I need this money to grow reliably"</li>
                <li>• "I don't want to gamble my future"</li>
                <li>• "I am too busy to actively manage trades"</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">The Reality:</h4>
              <ul className="space-y-2 text-slate-400">
                <li>• "I am terrified of losing my goal money"</li>
                <li>• "I am confused by thousands of options"</li>
                <li>• "I need my money to work automatically"</li>
                <li>• "I don't trust advice"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-950 border border-white/5 scroll-animate">
          <h3 className="text-2xl font-bold text-white mb-4">Our Solution: Financial Confidence Engine</h3>
          <p className="text-slate-400 mb-6">
            Not just an investment tool, but a decision-support system that helps users move from uncertain intent → clear action → sustained progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Bot size={20} className="text-blue-400" />
                The Conversational Guide
              </h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>• Explains finance in plain language</li>
                <li>• Answers "Should I?" questions</li>
                <li>• Understands your unique situation</li>
                <li>• Adapts when life changes</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Target size={20} className="text-purple-400" />
                The Goal Architect
              </h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>• Converts dreams into executable plans</li>
                <li>• Risk-tailored strategies</li>
                <li>• Multiple achievement pathways</li>
                <li>• Transparent trade-offs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                The Automated Partner
              </h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>• Handles complex calculations</li>
                <li>• Monitors progress continuously</li>
                <li>• Automates execution</li>
                <li>• Celebrates milestones</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Shield size={20} className="text-orange-400" />
                The Trust Builder
              </h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>• No black-box recommendations</li>
                <li>• Every calculation cross-checked</li>
                <li>• Explains the "why" behind suggestions</li>
                <li>• Safety nets prevent harmful advice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
  <section id="how-it-works" className="py-24 bg-slate-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="mb-16 scroll-animate">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform-gpu hover:scale-105 transition-all duration-300">How FinArth Works</h2>
        <p className="text-slate-400">Simple steps to financial confidence</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-slate-800 hidden md:block animate-pulse" />

        <div className="space-y-12">
          {[
            {
              title: "Share Your Goal",
              desc: "Tell us your current savings, target amount, and timeline in plain English.",
              icon: <Target size={20} />,
              color: "text-blue-400"
            },
            {
              title: "AI Analysis",
              desc: "Our AI calculates required returns, assigns your personality, and validates for safety.",
              icon: <Calculator size={20} />,
              color: "text-purple-400"
            },
            {
              title: "Get Your Plan",
              desc: "Receive specific investment allocations with clear explanations and next steps.",
              icon: <CheckCircle size={20} />,
              color: "text-green-400"
            }
          ].map((step, i) => (
            <div 
              key={i} 
              className="relative flex gap-8 items-start scroll-animate transform-gpu hover:scale-105 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div 
                className="hidden md:flex h-16 w-16 bg-slate-900 border border-slate-800 rounded-2xl items-center justify-center z-10 shrink-0 transform-gpu hover:scale-110 hover:rotate-12 transition-all duration-500"
                style={{
                  transform: activeStep === i ? 'scale(1.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                  boxShadow: activeStep === i ? '0 20px 40px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                <div className={`${step.color} animate-pulse`}>{step.icon}</div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3 transform-gpu hover:translate-x-2 transition-all duration-300">
                  <span className="md:hidden p-2 bg-slate-900 rounded-lg border border-slate-800 animate-pulse">{step.icon}</span>
                  {step.title}
                </h3>
                <p className="text-slate-400 max-w-xl">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-bold">F</div>
          <span className="text-lg font-bold text-white">FinArth</span>
        </div>
        <p className="text-slate-500 text-sm max-w-xs">
          Financial Confidence Engine for the modern investor.
        </p>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="#" className="hover:text-blue-400">Dashboard</a></li>
          <li><a href="#" className="hover:text-blue-400">Planning</a></li>
          <li><a href="#" className="hover:text-blue-400">Analytics</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="#" className="hover:text-blue-400">About</a></li>
          <li><a href="#" className="hover:text-blue-400">Blog</a></li>
          <li><a href="#" className="hover:text-blue-400">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-slate-600">
      © 2024 FinArth. All rights reserved. We are not financial advisors. This platform is for educational purposes only. Please do your own research (DYOR) and consult with qualified financial professionals before making investment decisions.
    </div>
  </footer>
);

export default function Page() {
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in-up');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    setConnecting(true);
    // TODO: Navigate to dashboard or signup
    setTimeout(() => setConnecting(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 selection:bg-blue-500/30 overflow-x-hidden">
      <style>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <Navbar onGetStarted={handleGetStarted} isConnecting={connecting} />
      <Hero onGetStarted={handleGetStarted} isConnecting={connecting} />
      <UseCases />
      <HowItWorks />
      <FeatureBento />
      
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-12 text-center border border-blue-500/20 relative overflow-hidden transform-gpu hover:scale-[1.02] transition-all duration-500 scroll-animate">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-gradient-x bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">Ready to Build Financial Confidence?</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">
              Join thousands who've transformed their financial anxiety into confident action.
            </p>
            <button 
              onClick={handleGetStarted}
              disabled={connecting}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-blue-50 transition-all shadow-lg shadow-white/10 disabled:opacity-50 transform-gpu hover:scale-110 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
            >
              {connecting ? 'Loading...' : 'Start Your Financial Journey'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse" />
        </div>
      </section>

      <Footer />
  
    </main>
  );
}