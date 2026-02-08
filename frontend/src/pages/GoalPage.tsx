import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    TrendingUp,
    Info,
    ChevronRight,
    Trash2
} from '../components/Icons.tsx';
import Sidebar from '../components/Sidebar.tsx';
import { apiCall } from '../utils/api.ts';

const GoalPage = () => {
    const navigate = useNavigate();
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [userName, setUserName] = useState('User');
    const [isLive, setIsLive] = useState(true);

    const [newGoal, setNewGoal] = useState({
        name: '',
        target_amount: 5000000,
        current_amount: 500000,
        timeline_years: 10,
        risk_profile: 'Moderate',
        adjust_inflation: true
    });

    const riskRates: Record<string, number> = {
        'Conservative': 8,
        'Moderate': 12,
        'Aggressive': 15
    };

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await apiCall('/api/plans/goals');
            if (response && response.goals && response.goals.length > 0) {
                setGoals(response.goals);
                setIsLive(true);
            } else {
                throw new Error("No goals found");
            }
        } catch (err) {
            console.warn('Using mock goals due to connection failure');
            setIsLive(false);
            setGoals([
                { id: 1, name: 'House Downpayment', target_amount: 5000000, current_amount: 1500000, progress: 30, monthly_required: 45000, timeline_years: 5, updated_at: new Date().toISOString() },
                { id: 2, name: 'Retirement Fund', target_amount: 50000000, current_amount: 5000000, progress: 10, monthly_required: 25000, timeline_years: 25, updated_at: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.name || user.email?.split('@')[0] || 'User');
        }
        fetchGoals();
    }, []);

    const calculateSmartSIP = () => {
        const rate = riskRates[newGoal.risk_profile] / 100;
        const inflation = newGoal.adjust_inflation ? 0.06 : 0;
        const months = newGoal.timeline_years * 12;
        const monthlyRate = rate / 12;
        const adjustedTarget = newGoal.target_amount * Math.pow(1 + inflation, newGoal.timeline_years);
        const amountFromExisting = newGoal.current_amount * Math.pow(1 + monthlyRate, months);
        const remainingTarget = adjustedTarget - amountFromExisting;
        if (remainingTarget <= 0) return { sip: 0, adjustedTarget: Math.round(adjustedTarget) };
        const sip = (remainingTarget * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
        return { sip: Math.round(sip), adjustedTarget: Math.round(adjustedTarget) };
    };

    const smartData = calculateSmartSIP();

    const getFeasibility = () => {
        const { sip } = smartData;
        if (!newGoal.target_amount || newGoal.timeline_years === 0) return { score: 0, label: 'Calculating...', color: 'text-stone-400' };

        // Base score starts at 85
        let score = 85;

        // 1. Timeline Factor (Compound interest needs time)
        if (newGoal.timeline_years < 3) score -= 25;
        else if (newGoal.timeline_years < 7) score -= 10;
        else if (newGoal.timeline_years > 15) score += 10;

        // 2. SIP Stress Factor (Heuristic: ₹1L is high effort for average users)
        if (sip > 100000) score -= 40;
        else if (sip > 50000) score -= 20;
        else if (sip > 20000) score -= 10;

        // 3. Corpus Ratio Factor (How much headstart do you have?)
        const corpusRatio = newGoal.current_amount / newGoal.target_amount;
        if (corpusRatio < 0.05) score -= 15;
        else if (corpusRatio > 0.2) score += 10;

        // 4. Risk Volatility Factor
        if (newGoal.risk_profile === 'Aggressive') score -= 8;
        if (newGoal.risk_profile === 'Conservative') score += 5;

        // Clamp score
        score = Math.max(5, Math.min(98, score));

        if (score >= 80) return { score, label: 'Highly Feasible', color: 'text-green-500' };
        if (score >= 60) return { score, label: 'Likely Success', color: 'text-emerald-500' };
        if (score >= 40) return { score, label: 'Ambitious Plan', color: 'text-amber-500' };
        return { score, label: 'High Effort Required', color: 'text-rose-500' };
    };

    const feasibility = getFeasibility();

    const handleSaveGoal = async () => {
        if (!newGoal.name) {
            alert('Please name your goal first');
            return;
        }
        setIsSubmitting(true);
        try {
            await apiCall('/api/plans/goals', {
                method: 'POST',
                body: JSON.stringify({
                    ...newGoal,
                    monthly_required: smartData.sip,
                    target_amount: smartData.adjustedTarget,
                    return_rate: riskRates[newGoal.risk_profile]
                })
            });
            setNewGoal({ name: '', target_amount: 5000000, current_amount: 500000, timeline_years: 10, risk_profile: 'Moderate', adjust_inflation: true });
            fetchGoals();
            const element = document.getElementById('active-goals');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            alert('Failed to save goal');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteGoal = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;
        try {
            await apiCall(`/api/plans/goals/${id}`, { method: 'DELETE' });
            fetchGoals();
        } catch (err) {
            alert('Failed to delete goal');
        }
    };

    return (
        <div className="h-screen bg-stone-50 flex overflow-hidden selection:bg-stone-200">
            <Sidebar
                isSidebarVisible={isSidebarVisible}
                setIsSidebarVisible={setIsSidebarVisible}
                userName={userName}
                onLogout={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    navigate('/login');
                }}
            />

            <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Fixed Top Nav inside Main */}
                <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-40">
                    <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {!isSidebarVisible && (
                                <button onClick={() => setIsSidebarVisible(true)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
                                    <ChevronRight size={20} />
                                </button>
                            )}
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-stone-900 tracking-tight">FinArth Goal Architect</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                {isLive ? 'Live Blueprint' : 'Simulated Environment'}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-10 py-12">
                    {/* Active Goals Section (Now on Top) */}
                    <div id="active-goals" className="mb-24 animate-in fade-in duration-1000">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h3 className="text-4xl font-black text-stone-900 tracking-tighter mb-2">Deployed Projections.</h3>
                                <p className="text-stone-500 font-medium font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                                    {goals.length} Active Targets Being Monitored
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm">
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">Total Monthly SIP</p>
                                    <p className="text-xl font-black font-mono text-stone-900 leading-none">₹{goals.reduce((a, c) => a + (c.monthly_required || 0), 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-24">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {goals.map((goal, idx) => (
                                    <div key={goal.id} className="bg-white p-8 border border-stone-200 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                            <Target size={100} />
                                        </div>

                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div>
                                                <h4 className="font-extrabold text-stone-900 text-xl tracking-tight">{goal.name}</h4>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-[9px] font-bold text-stone-500 uppercase tracking-wider">
                                                        {goal.timeline_years} Year Mission
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                className="p-2 text-stone-200 hover:text-rose-500 transition-colors bg-stone-50 rounded-xl"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Blueprint Progress</span>
                                                    <span className="text-sm font-bold text-stone-900 font-mono">{goal.progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${goal.progress >= 100 ? 'bg-green-500' : 'bg-stone-900'}`}
                                                        style={{ width: `${goal.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 leading-none">Savings</p>
                                                    <p className="text-md font-bold text-stone-800 font-mono tracking-tight leading-none">₹{goal.current_amount.toLocaleString()}</p>
                                                </div>
                                                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1 leading-none">Target</p>
                                                    <p className="text-md font-bold text-stone-800 font-mono tracking-tight leading-none">₹{goal.target_amount.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-stone-50 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp size={14} className="text-stone-400" />
                                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Automated Monitoring</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-stone-400 uppercase mb-1">Monthly Draft</p>
                                                    <p className="text-xs font-black text-stone-900 font-mono">₹{goal.monthly_required?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {goals.length === 0 && (
                                    <div className="md:col-span-2 lg:col-span-3 py-32 text-center bg-white border border-dashed border-stone-300 rounded-[3rem]">
                                        <div className="mb-6 flex justify-center text-stone-200">
                                            <Target size={64} />
                                        </div>
                                        <h4 className="text-xl font-bold text-stone-800 mb-2">No active architectures yet.</h4>
                                        <p className="text-stone-500 font-medium text-sm mb-8">Deploy your first financial blueprint using the architect below.</p>
                                    </div>
                                )}
                            </div>
                        )}


                    </div>

                    {/* Architect Interface Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 pt-24 border-t border-stone-200">

                        {/* Left: Configuration Form */}
                        <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
                            <div>
                                <h2 className="text-3xl font-black text-stone-900 mb-2 tracking-tighter">Plan your next milestone.</h2>
                                <p className="text-stone-500 font-medium tracking-tight">Build a data-backed strategy for your financial future.</p>
                            </div>

                            <div className="space-y-8 bg-white p-10 border border-stone-200 shadow-sm rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <Target size={120} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Goal Name</label>
                                        <input
                                            type="text"
                                            value={newGoal.name}
                                            onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                            className="w-full text-xl font-bold text-stone-900 bg-transparent border-b-2 border-stone-100 focus:border-stone-800 outline-none pb-2 transition-all placeholder:text-stone-200"
                                            placeholder="e.g. Dream House"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Timeline (Years)</label>
                                        <div className="flex items-center gap-4 pt-2">
                                            <input
                                                type="range" min="1" max="30"
                                                value={newGoal.timeline_years}
                                                onChange={e => setNewGoal({ ...newGoal, timeline_years: parseInt(e.target.value) })}
                                                className="flex-1 accent-stone-800"
                                            />
                                            <span className="text-2xl font-black font-mono text-stone-900 w-16">{newGoal.timeline_years}y</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Target Amount (Base ₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-0 top-0 text-xl font-bold text-stone-300">₹</span>
                                            <input
                                                type="number"
                                                value={newGoal.target_amount}
                                                onChange={e => setNewGoal({ ...newGoal, target_amount: parseInt(e.target.value) || 0 })}
                                                className="w-full pl-6 text-2xl font-black font-mono text-stone-900 bg-transparent border-b-2 border-stone-100 focus:border-stone-800 outline-none pb-2 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Initial Corpus (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-0 top-0 text-xl font-bold text-stone-300">₹</span>
                                            <input
                                                type="number"
                                                value={newGoal.current_amount}
                                                onChange={e => setNewGoal({ ...newGoal, current_amount: parseInt(e.target.value) || 0 })}
                                                className="w-full pl-6 text-2xl font-black font-mono text-stone-800 bg-transparent border-b-2 border-stone-100 focus:border-stone-800 outline-none pb-2 transition-all opacity-80"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-stone-100 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Risk Appetite</h4>
                                            <p className="text-[10px] text-stone-400 font-medium">Determines the expected ROI on your investments.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {Object.entries(riskRates).map(([profile, rate]) => (
                                            <button
                                                key={profile}
                                                type="button"
                                                onClick={() => setNewGoal({ ...newGoal, risk_profile: profile })}
                                                className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left group ${newGoal.risk_profile === profile
                                                    ? 'border-stone-900 bg-stone-900 text-white shadow-xl'
                                                    : 'border-stone-100 bg-stone-50 hover:border-stone-300'
                                                    }`}
                                            >
                                                <p className={`text-[9px] font-extrabold uppercase tracking-[0.15em] ${newGoal.risk_profile === profile ? 'text-stone-400' : 'text-stone-500'}`}>{profile}</p>
                                                <p className="text-xl font-black font-mono mt-1">{rate}%<span className="text-[9px] font-bold ml-1">ROI</span></p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-stone-100">
                                    <label className="flex items-center gap-4 cursor-pointer group bg-stone-50 p-5 rounded-2xl border border-stone-200/50 hover:bg-stone-100 transition-all">
                                        <div className={`w-12 h-6 rounded-full relative transition-all ${newGoal.adjust_inflation ? 'bg-stone-800' : 'bg-stone-300'}`}>
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={newGoal.adjust_inflation}
                                                onChange={e => setNewGoal({ ...newGoal, adjust_inflation: e.target.checked })}
                                            />
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${newGoal.adjust_inflation ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                                Adjust for Inflation (6%)
                                                <Info size={12} className="text-stone-400" />
                                            </span>
                                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Protect your purchasing power</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right: AI Output Display */}
                        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="bg-stone-800 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-stone-700/50 rounded-full blur-3xl -mr-32 -mt-32" />

                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-center">
                                        <div className="px-4 py-1.5 bg-stone-700 border border-stone-600 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                            Live Structural Projection
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-stone-500 uppercase tracking-[0.2em]">Required Investment</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-black font-mono tracking-tighter text-white">₹{smartData.sip.toLocaleString()}</span>
                                            <span className="text-stone-500 font-bold text-xl uppercase tracking-tighter">/mo</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-stone-700">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Target @ Horizon</p>
                                            <p className="text-2xl font-bold font-mono text-stone-200">₹{smartData.adjustedTarget.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Return Profile</p>
                                            <p className="text-2xl font-bold font-mono text-stone-200">{riskRates[newGoal.risk_profile]}%</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 pt-10 border-t border-stone-700">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-1">Feasibility Score</p>
                                                <p className={`text-2xl font-black uppercase tracking-tight ${feasibility.color}`}>{feasibility.label}</p>
                                            </div>
                                            <span className={`text-3xl font-black font-mono ${feasibility.color}`}>{feasibility.score}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden p-0.5 border border-stone-600">
                                            <div
                                                className={`h-full transition-all duration-1000 rounded-full ${feasibility.score < 40 ? 'bg-rose-500' : feasibility.score < 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                style={{ width: `${feasibility.score}%` }}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveGoal}
                                            disabled={isSubmitting}
                                            className="w-full mt-6 px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                    Architecting...
                                                </>
                                            ) : (
                                                <>
                                                    Deploy Plan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #d6d3d1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #a8a29e;
                    }
                `}</style>
            </main>
        </div>
    );
};

export default GoalPage;
