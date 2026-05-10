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
    Plus,
    MessageSquare,
    Trash2,
    History,
    ThumbsUp,
    ThumbsDown,
    CheckCircle,
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

const SUGGESTED_PROMPTS = [
    { icon: '📊', label: 'Portfolio health check', prompt: 'Give me a complete health check of my portfolio.' },
    { icon: '📈', label: 'Top performing funds', prompt: 'Which of my funds are performing the best right now?' },
    { icon: '🎯', label: 'Goal optimisation', prompt: 'How can I optimise my SIPs to hit my goals faster?' },
    { icon: '⚠️', label: 'Risk analysis', prompt: 'Analyse the risk level of my current portfolio.' },
];

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
    const [isEmptyState, setIsEmptyState] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const stages = [
        "Analysing portfolio metrics…",
        "Evaluating risk exposure…",
        "Correlating market data…",
        "Finalising strategy…"
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
        setIsEmptyState(true);
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
        setIsEmptyState(false);
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
        setMessages([]);
        setIsEmptyState(true);
        setIsHistoryVisible(false);
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
        setMessages(prev => prev.map(msg =>
            msg.id === message.id ? { ...msg, feedback } : msg
        ));
        try {
            await fetch('http://localhost:5000/api/agent/message-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId: message.dbMessageId, feedback })
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const sendMessage = async (overrideInput?: string) => {
        const text = (overrideInput ?? inputMessage).trim();
        if (!text) return;

        setIsEmptyState(false);
        const userMsgLocalId = Date.now();
        const userMessage: Message = {
            id: userMsgLocalId,
            type: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
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
                body: JSON.stringify({ query: text, userId: userIdNum, sessionId: currentSessionId })
            });
            const data = await response.json();
            if (data.success) {
                if (!currentSessionId && data.data.sessionId) {
                    setCurrentSessionId(data.data.sessionId);
                    loadSessions();
                }
                setMessages(prev => [...prev, {
                    id: Date.now() + 1000,
                    dbMessageId: data.data.messageId,
                    type: 'bot',
                    content: data.data.finalAnswer,
                    timestamp: new Date()
                }]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error calling AI agent:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 2000,
                type: 'bot',
                content: "I'm having trouble connecting right now. Please try again in a moment.",
                timestamp: new Date()
            }]);
        } finally {
            clearInterval(stageInterval);
            setIsTyping(false);
            setAnalysisStage(0);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isTyping) sendMessage();
        }
    };

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
    };

    const currentSessionTitle = currentSessionId
        ? sessions.find(s => s.id === currentSessionId)?.title
        : null;

    return (
        <div className="min-h-screen bg-[#F7F6F3] flex overflow-hidden font-sans">
            <Sidebar
                isSidebarVisible={isSidebarVisible}
                setIsSidebarVisible={setIsSidebarVisible}
                userName={userName}
                onLogout={handleLogout}
            />

            {/* Main content */}
            <main className="flex-1 flex overflow-hidden min-w-0">

                {/* Chat area */}
                <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">

                    {/* Top bar */}
                    <header className="flex-shrink-0 h-14 bg-white border-b border-stone-200/80 px-5 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3 min-w-0">
                            {!isSidebarVisible && (
                                <button
                                    onClick={() => setIsSidebarVisible(true)}
                                    className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-500 flex-shrink-0"
                                    aria-label="Open sidebar"
                                >
                                    <PanelLeftOpen size={18} />
                                </button>
                            )}
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-stone-900 rounded-md flex items-center justify-center flex-shrink-0">
                                        <Brain size={11} className="text-white" />
                                    </div>
                                    <h1 className="text-sm font-semibold text-stone-900 truncate">
                                        {currentSessionTitle ?? 'FinArth Intelligence'}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-1.5 ml-7">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-medium text-stone-400 tracking-wide">Autonomous Advisor Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={startNewChat}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                            >
                                <Plus size={13} />
                                New chat
                            </button>
                            <button
                                onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                                title="Chat History"
                                className={`p-2 rounded-lg transition-colors ${isHistoryVisible
                                    ? 'bg-stone-900 text-white'
                                    : 'text-stone-500 hover:bg-stone-100'}`}
                            >
                                <History size={16} />
                            </button>
                        </div>
                    </header>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isHistoryLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                                    <p className="text-xs font-medium text-stone-400 tracking-widest uppercase">Loading history…</p>
                                </div>
                            </div>
                        ) : isEmptyState ? (
                            /* Empty / welcome state */
                            <div className="flex flex-col items-center justify-center h-full px-6 pb-32 pt-12 text-center">
                                <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                                    <Brain size={26} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-stone-900 mb-2 text-balance">
                                    Good {getGreeting()}, {userName}
                                </h2>
                                <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-8">
                                    Your AI wealth advisor is ready. Ask anything about your portfolio, goals, or investment strategy.
                                </p>

                                {/* Suggested prompts */}
                                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                                    {SUGGESTED_PROMPTS.map((p) => (
                                        <button
                                            key={p.label}
                                            onClick={() => sendMessage(p.prompt)}
                                            className="flex flex-col items-start gap-1.5 p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition-all text-left group"
                                        >
                                            <span className="text-lg">{p.icon}</span>
                                            <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900 leading-snug text-balance">{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto w-full px-5 py-8 space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 animate-message-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 ${message.type === 'user'
                                            ? 'bg-stone-200'
                                            : 'bg-stone-900'
                                            }`}>
                                            {message.type === 'user'
                                                ? <User size={13} className="text-stone-600" />
                                                : <Brain size={13} className="text-white" />}
                                        </div>

                                        {/* Bubble + meta */}
                                        <div className={`group flex flex-col gap-1.5 max-w-[82%] min-w-0 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.type === 'user'
                                                ? 'bg-stone-900 text-stone-50 rounded-tr-sm'
                                                : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm'
                                                }`}>
                                                {message.type === 'bot' ? (
                                                    <div className="prose-agent">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <p>{message.content}</p>
                                                )}
                                            </div>

                                            {/* Timestamp + feedback */}
                                            <div className={`flex items-center gap-2 px-0.5 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <span className="text-[10px] text-stone-400 font-medium">
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {message.type === 'bot' && (
                                                    <CheckCircle size={9} className="text-emerald-500" />
                                                )}
                                                {message.type === 'bot' && message.id !== 'welcome' && (
                                                    <div className={`flex items-center gap-1 transition-opacity duration-150 ${message.feedback ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <button
                                                            onClick={() => handleFeedback(message, 'up')}
                                                            className={`p-1 rounded-md transition-colors ${message.feedback === 'up'
                                                                ? 'text-emerald-600 bg-emerald-50'
                                                                : 'text-stone-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                                                        >
                                                            <ThumbsUp size={11} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFeedback(message, 'down')}
                                                            className={`p-1 rounded-md transition-colors ${message.feedback === 'down'
                                                                ? 'text-red-600 bg-red-50'
                                                                : 'text-stone-300 hover:text-red-500 hover:bg-red-50'}`}
                                                        >
                                                            <ThumbsDown size={11} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex gap-3 animate-message-in">
                                        <div className="w-7 h-7 rounded-lg bg-stone-900 flex-shrink-0 flex items-center justify-center mt-0.5">
                                            <Brain size={13} className="text-white" />
                                        </div>
                                        <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3.5 max-w-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                                <p className="text-[10px] font-medium text-stone-400 tracking-wide uppercase">{stages[analysisStage]}</p>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="mt-2.5 h-0.5 bg-stone-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-stone-800 rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${((analysisStage + 1) / stages.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Input bar */}
                    <div className="flex-shrink-0 px-5 pb-5 pt-3 bg-[#F7F6F3]">
                        <div className="max-w-3xl mx-auto">
                            <div className="relative bg-white border border-stone-200 rounded-2xl shadow-sm focus-within:border-stone-400 focus-within:shadow-md transition-all">
                                <textarea
                                    ref={inputRef}
                                    rows={1}
                                    value={inputMessage}
                                    onChange={autoResize}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask your AI wealth advisor anything…"
                                    disabled={isTyping}
                                    className="w-full resize-none bg-transparent text-sm text-stone-900 placeholder-stone-400 font-medium px-4 pt-3.5 pb-3 pr-14 focus:outline-none leading-relaxed disabled:opacity-50 max-h-40 custom-scrollbar"
                                    style={{ height: 'auto' }}
                                />
                                <div className="absolute right-2.5 bottom-2.5">
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="w-9 h-9 bg-stone-900 text-white rounded-xl hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                        aria-label="Send message"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-stone-400 mt-2 font-medium">
                                Press <kbd className="font-mono bg-stone-100 px-1 py-0.5 rounded text-[9px]">Enter</kbd> to send &middot; <kbd className="font-mono bg-stone-100 px-1 py-0.5 rounded text-[9px]">Shift+Enter</kbd> for new line
                            </p>
                        </div>
                    </div>
                </div>

                {/* History sidebar */}
                <aside className={`flex-shrink-0 flex flex-col h-screen bg-white border-l border-stone-200 transition-all duration-300 ease-in-out overflow-hidden ${isHistoryVisible ? 'w-72' : 'w-0'}`}>
                    <div className="flex-shrink-0 px-5 h-14 border-b border-stone-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History size={14} className="text-stone-500" />
                            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Chat History</span>
                        </div>
                        <button
                            onClick={() => setIsHistoryVisible(false)}
                            className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-400"
                            aria-label="Close history"
                        >
                            <Plus size={14} className="rotate-45" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {/* New chat button */}
                        <button
                            onClick={startNewChat}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors text-stone-500 hover:text-stone-900 border border-dashed border-stone-200 hover:border-stone-300 mb-3"
                        >
                            <Plus size={13} />
                            <span className="text-xs font-semibold">New conversation</span>
                        </button>

                        {sessions.length === 0 ? (
                            <div className="py-16 flex flex-col items-center gap-3 text-center px-4">
                                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
                                    <MessageSquare size={18} className="text-stone-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-stone-600">No conversations yet</p>
                                    <p className="text-[11px] text-stone-400 mt-1">Start a chat and it will appear here.</p>
                                </div>
                            </div>
                        ) : (
                            sessions.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => loadSessionMessages(s.id)}
                                    className={`group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${currentSessionId === s.id
                                        ? 'bg-stone-900 text-white'
                                        : 'hover:bg-stone-50 text-stone-700'
                                        }`}
                                >
                                    <MessageSquare size={13} className={`flex-shrink-0 mt-0.5 ${currentSessionId === s.id ? 'text-stone-300' : 'text-stone-400'}`} />
                                    <div className="flex-1 min-w-0 pr-6">
                                        <p className={`text-xs font-semibold truncate ${currentSessionId === s.id ? 'text-white' : 'text-stone-800'}`}>
                                            {s.title}
                                        </p>
                                        <p className={`text-[10px] font-medium mt-0.5 ${currentSessionId === s.id ? 'text-stone-400' : 'text-stone-400'}`}>
                                            {new Date(s.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteSession(e, s.id)}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${currentSessionId === s.id
                                            ? 'hover:bg-stone-700 text-stone-400 hover:text-red-400'
                                            : 'hover:bg-red-50 text-stone-400 hover:text-red-500'
                                            }`}
                                        aria-label="Delete session"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </main>

            <style>{`
                @keyframes message-in {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-message-in {
                    animation: message-in 0.25s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 10px; }

                /* Prose styles for markdown */
                .prose-agent { font-size: 0.875rem; line-height: 1.6; color: #292524; }
                .prose-agent h1, .prose-agent h2, .prose-agent h3 {
                    font-weight: 700;
                    color: #1c1917;
                    margin: 0.75rem 0 0.35rem;
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                }
                .prose-agent h1 { font-size: 1rem; }
                .prose-agent h2 { font-size: 0.9375rem; }
                .prose-agent h3 { font-size: 0.875rem; }
                .prose-agent p { margin: 0.4rem 0; }
                .prose-agent ul, .prose-agent ol { padding-left: 1.2rem; margin: 0.4rem 0; }
                .prose-agent li { margin-bottom: 0.2rem; }
                .prose-agent strong { font-weight: 700; color: #1c1917; }
                .prose-agent code {
                    background: #f5f5f4;
                    border: 1px solid #e7e5e4;
                    border-radius: 4px;
                    padding: 0.1em 0.35em;
                    font-size: 0.8em;
                    font-family: ui-monospace, monospace;
                }
                .prose-agent pre {
                    background: #1c1917;
                    border-radius: 10px;
                    padding: 12px 14px;
                    overflow-x: auto;
                    margin: 0.6rem 0;
                }
                .prose-agent pre code {
                    background: transparent;
                    border: none;
                    padding: 0;
                    color: #d6d3d1;
                    font-size: 0.8rem;
                }
                .prose-agent table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.8rem;
                    margin: 0.75rem 0;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #e7e5e4;
                }
                .prose-agent th {
                    background: #fafaf9;
                    padding: 7px 10px;
                    text-align: left;
                    color: #78716c;
                    font-weight: 600;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .prose-agent td {
                    padding: 7px 10px;
                    border-top: 1px solid #f5f5f4;
                    color: #292524;
                }
                .prose-agent blockquote {
                    border-left: 3px solid #e7e5e4;
                    padding-left: 12px;
                    margin: 0.5rem 0;
                    color: #78716c;
                    font-style: italic;
                }
                .prose-agent a { color: #1c1917; text-decoration: underline; text-underline-offset: 2px; }
                .prose-agent hr { border: none; border-top: 1px solid #f5f5f4; margin: 0.75rem 0; }
            `}</style>
        </div>
    );
};

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

export default AiAgent;
