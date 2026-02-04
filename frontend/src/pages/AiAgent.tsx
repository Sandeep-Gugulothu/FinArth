import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '../components/Sidebar.tsx';
import {
    Brain,
    UserIcon as User,
    Send,
    PanelLeftOpen,
    Sparkles,
    TrendingUp,
    Target,
    CheckCircle,
    Plus,
    MessageSquare,
    Trash2,
    History,
    ThumbsUp,
    ThumbsDown
} from '../components/Icons.tsx';

type Message = {
    id: string | number;
    dbMessageId?: number;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
    feedback?: 'up' | 'down';
};

type Session = {
    id: string;
    title: string;
    updated_at: string;
};

const AiAgent: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userName, setUserName] = useState('User');
    const [analysisStage, setAnalysisStage] = useState<number>(0);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const stages = [
        "Analyzing metrics...",
        "Evaluating risk...",
        "Correlating data...",
        "Finalizing strategy..."
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        let currentUserName = 'User';
        if (userData) {
            const user = JSON.parse(userData);
            currentUserName = user.name || user.email?.split('@')[0] || 'User';
            setUserName(currentUserName);
        }
        loadSessions();
        startNewChat();
    }, []);

    const loadSessions = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:5000/api/agent/sessions?userId=${userId}`);
            const data = await response.json();
            if (data.success) {
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    };

    const loadSessionMessages = async (sessionId: string) => {
        setIsHistoryLoading(true);
        setCurrentSessionId(sessionId);
        try {
            const response = await fetch(`http://localhost:5000/api/agent/sessions/${sessionId}`);
            const data = await response.json();
            if (data.success) {
                const formattedMessages: Message[] = data.messages.map((m: any) => ({
                    id: m.id,
                    dbMessageId: m.id,
                    type: m.role as 'bot' | 'user',
                    content: m.content,
                    timestamp: new Date(m.timestamp),
                    feedback: m.feedback
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error loading session messages:', error);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([{
            id: 'welcome',
            type: 'bot',
            content: `Hi ${userName}! Ready to optimize your wealth today? Ask me anything about your portfolio.`,
            timestamp: new Date(),
        }]);
    };

    const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        try {
            await fetch(`http://localhost:5000/api/agent/sessions/${sessionId}`, { method: 'DELETE' });
            loadSessions();
            if (currentSessionId === sessionId) startNewChat();
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const handleFeedback = async (message: Message, feedback: 'up' | 'down') => {
        if (!message.dbMessageId) return;

        // Optimistic update
        setMessages(prev => prev.map(msg =>
            msg.id === message.id ? { ...msg, feedback } : msg
        ));

        try {
            await fetch('http://localhost:5000/api/agent/message-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: message.dbMessageId,
                    feedback: feedback
                })
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMsgLocalId = Date.now();
        const userMessage: Message = {
            id: userMsgLocalId,
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsTyping(true);
        setAnalysisStage(0);

        const stageInterval = setInterval(() => {
            setAnalysisStage(prev => (prev < 3 ? prev + 1 : prev));
        }, 1200);

        try {
            const userId = localStorage.getItem('userId');
            const userIdNum = userId ? parseInt(userId) : null;

            const response = await fetch('http://localhost:5000/api/agent/generate-insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: currentInput,
                    userId: userIdNum,
                    sessionId: currentSessionId
                })
            });

            const data = await response.json();

            if (data.success) {
                if (!currentSessionId && data.data.sessionId) {
                    setCurrentSessionId(data.data.sessionId);
                    loadSessions();
                }
                const finalMessage: Message = {
                    id: Date.now() + 1000,
                    dbMessageId: data.data.messageId,
                    type: 'bot',
                    content: data.data.finalAnswer,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, finalMessage]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error calling AI agent:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 2000,
                type: 'bot',
                content: "I'm having some trouble connecting. Let's try that again in a moment.",
                timestamp: new Date()
            }]);
        } finally {
            clearInterval(stageInterval);
            setIsTyping(false);
            setAnalysisStage(0);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex overflow-hidden font-sans">
            <Sidebar
                isSidebarVisible={isSidebarVisible}
                setIsSidebarVisible={setIsSidebarVisible}
                userName={userName}
                onLogout={handleLogout}
            />

            <main className="flex-1 flex overflow-hidden relative">
                <div className="absolute inset-0 bg-white" />

                <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            {!isSidebarVisible && (
                                <button
                                    onClick={() => setIsSidebarVisible(true)}
                                    className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
                                >
                                    <PanelLeftOpen size={18} />
                                </button>
                            )}
                            <div className="flex flex-col">
                                <h1 className="text-sm font-bold text-stone-900 tracking-tight">
                                    {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : 'FinArth Intelligence'}
                                </h1>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Autonomous Advisor Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={startNewChat}
                                className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 text-stone-50 rounded-lg hover:bg-stone-800 transition-all font-bold text-[10px] uppercase tracking-wider shadow-sm"
                            >
                                <Plus size={14} />
                                <span>New Chat</span>
                            </button>
                            <button
                                onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                                className={`p-2 rounded-lg transition-all ${isHistoryVisible ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:bg-stone-50'}`}
                                title="Chat History"
                            >
                                <History size={20} />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 max-w-4xl mx-auto w-full custom-scrollbar">
                        {isHistoryLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Retrieving History...</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    <div className={`flex gap-3 max-w-[90%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${message.type === 'user' ? 'bg-stone-50 border border-stone-200' : 'bg-stone-900'
                                            }`}>
                                            {message.type === 'user' ? <User size={14} className="text-stone-500" /> : <Brain size={14} className="text-stone-50" />}
                                        </div>

                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="group relative">
                                                <div className={`px-5 py-3.5 rounded-2xl ${message.type === 'user'
                                                        ? 'bg-stone-100 text-stone-800 rounded-tr-none'
                                                        : 'bg-white border border-stone-50 text-stone-900 rounded-tl-none shadow-sm'
                                                    }`}>
                                                    <div className={`prose prose-stone max-w-none prose-sm leading-relaxed ${message.type === 'user' ? 'text-stone-800' : 'text-stone-800'
                                                        }`}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>

                                                {message.type === 'bot' && message.id !== 'welcome' && (
                                                    <div className={`absolute -right-12 top-0 flex flex-col gap-1 transition-opacity duration-200 ${message.feedback ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <button
                                                            onClick={() => handleFeedback(message, 'up')}
                                                            className={`p-1.5 rounded-md transition-all hover:bg-emerald-50 ${message.feedback === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-stone-300 hover:text-emerald-500'}`}
                                                        >
                                                            <ThumbsUp size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFeedback(message, 'down')}
                                                            className={`p-1.5 rounded-md transition-all hover:bg-red-50 ${message.feedback === 'down' ? 'text-red-600 bg-red-50' : 'text-stone-300 hover:text-red-500'}`}
                                                        >
                                                            <ThumbsDown size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`flex items-center gap-2 px-1 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                {message.type === 'bot' && (
                                                    <CheckCircle size={8} className="text-emerald-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isTyping && (
                            <div className="flex flex-col items-start gap-3 animate-fade-in">
                                <div className="flex gap-3 w-full max-w-lg">
                                    <div className="w-8 h-8 rounded-lg bg-stone-900 flex-shrink-0 flex items-center justify-center">
                                        <Brain size={14} className="text-stone-50" />
                                    </div>
                                    <div className="flex-1 space-y-2.5 py-1">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                                                {stages[analysisStage]}
                                            </p>
                                            <span className="text-[9px] font-mono text-stone-900">{Math.round(((analysisStage + 1) / stages.length) * 100)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-stone-900 rounded-full transition-all duration-700 ease-out"
                                                style={{ width: `${((analysisStage + 1) / stages.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 sm:p-6 bg-transparent sticky bottom-0">
                        <div className="max-w-3xl mx-auto">
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent -z-10 pointer-events-none" />

                            <div className="relative group p-1.5 bg-stone-100/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl focus-within:shadow-2xl focus-within:bg-white transition-all">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                                    placeholder="Consult your AI wealth advisor..."
                                    className="w-full pl-5 pr-14 py-3.5 bg-transparent border-none focus:ring-0 text-stone-900 text-sm placeholder-stone-400 font-medium"
                                    disabled={isTyping}
                                />
                                <div className="absolute right-2 top-2 bottom-2">
                                    <button
                                        onClick={sendMessage}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="h-full w-11 bg-stone-900 text-stone-50 rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center shadow-lg"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out border-l border-stone-200 bg-stone-50 relative z-20 flex flex-col h-full shadow-2xl ${isHistoryVisible ? 'w-80' : 'w-0 overflow-hidden'}`}>
                    <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
                        <p className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">Chat History</p>
                        <button
                            onClick={() => setIsHistoryVisible(false)}
                            className="p-1 hover:bg-stone-100 rounded-md transition-colors text-stone-400"
                        >
                            <Plus size={18} className="rotate-45" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {sessions.length === 0 ? (
                            <div className="py-20 text-center px-6">
                                <History size={32} className="text-stone-200 mx-auto mb-4" />
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">No history yet</p>
                                <p className="text-[10px] text-stone-400 mt-1">Start a conversation to save it here.</p>
                            </div>
                        ) : (
                            sessions.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => loadSessionMessages(s.id)}
                                    className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${currentSessionId === s.id
                                            ? 'bg-white border-stone-200 shadow-sm ring-1 ring-stone-900/5'
                                            : 'hover:bg-stone-200/50 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <MessageSquare size={14} className={currentSessionId === s.id ? 'text-stone-900' : 'text-stone-400'} />
                                        <div className="flex-1 min-w-0 pr-6">
                                            <p className={`text-xs font-bold truncate ${currentSessionId === s.id ? 'text-stone-900' : 'text-stone-600'}`}>
                                                {s.title}
                                            </p>
                                            <p className="text-[9px] text-stone-400 font-medium mt-0.5">
                                                {new Date(s.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => deleteSession(e, s.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-md transition-all text-stone-400"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e7e5e4;
                    border-radius: 10px;
                }

                .prose h1, .prose h2, .prose h3 {
                    color: #1c1917;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    margin-top: 1rem;
                    margin-bottom: 0.4rem;
                }
                .prose p { margin: 0.5rem 0; line-height: 1.6; }
                .prose table {
                    width: 100%;
                    margin: 1rem 0;
                    border: 1px solid #f5f5f4;
                    border-radius: 8px;
                    border-collapse: collapse;
                    font-size: 0.8rem;
                }
                .prose th { background: #fafaf9; padding: 8px; text-align: left; color: #78716c; font-weight: 600; text-transform: uppercase; font-size: 0.6rem; }
                .prose td { padding: 8px; border-top: 1px solid #f5f5f4; }
                .prose ul { padding-left: 1.1rem; margin: 0.5rem 0; }
                .prose li { margin-bottom: 0.2rem; }
            `}</style>
        </div>
    );
};

export default AiAgent;
