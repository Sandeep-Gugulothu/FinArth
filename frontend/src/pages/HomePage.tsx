import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="w-full z-50 border-b border-stone-300/20 bg-stone-50/90 backdrop-blur-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-stone-800 rounded-lg flex items-center justify-center">
              <span className="text-stone-50 font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-stone-900">FinArth</span>
          </div>
          
          <button 
            onClick={handleGetStarted}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 shadow-sm transition-all text-sm font-medium text-stone-50"
          >
            <span>Get Started</span>
          </button>
        </div>
      </nav>

      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6">
            Financial Confidence <br />
            <span className="text-stone-700">Engine</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Convert your life goals into safe, automated, and understandable financial action. 
            No fear, no confusion, just confident progress toward what matters to you.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleGetStarted}
              className="w-full md:w-auto px-8 py-4 rounded-lg bg-stone-900 text-stone-50 font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Start Planning
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;