import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Target, Bot, UserIcon, LogoutIcon, PanelLeftClose } from './Icons.tsx';

interface SidebarProps {
    isSidebarVisible: boolean;
    setIsSidebarVisible: (visible: boolean) => void;
    userName: string;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isSidebarVisible,
    setIsSidebarVisible,
    userName,
    onLogout
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
        { id: 'portfolio', label: 'Portfolio', icon: TrendingUp, path: '/dashboard/portfolio' },
        { id: 'goals', label: 'Goals', icon: Target, path: '/dashboard/goals' },
        { id: 'agent', label: 'AI Agent', icon: Bot, path: '/pgas/ai-agent' },
    ];

    const isPathActive = (path: string) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div
            className={`${isSidebarVisible ? 'w-64' : 'w-0'
                } bg-white border-r border-stone-200 flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden flex-shrink-0 z-20`}
        >
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="FinArth" className="h-8 w-8" />
                    <span className="text-xl font-bold text-stone-900">FinArth</span>
                </div>
                <button
                    onClick={() => setIsSidebarVisible(false)}
                    className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-900 transition-colors"
                >
                    <PanelLeftClose size={18} />
                </button>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${isPathActive(item.path)
                                    ? 'bg-stone-100 text-stone-900 border border-stone-200'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-stone-200">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 mb-3">
                    <div className="h-8 w-8 bg-stone-300 rounded-full flex items-center justify-center overflow-hidden">
                        <UserIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{userName}</p>
                        <p className="text-xs text-stone-500">Premium Plan</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                >
                    <LogoutIcon size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
