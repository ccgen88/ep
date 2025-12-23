import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'User Management', icon: '👥' },
        { path: '/admin/exams', label: 'Exams', icon: '📝' },
        { path: '/admin/results', label: 'Results', icon: '📈' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col">
            {/* Logo/Header */}
            <div className="p-6 border-b border-indigo-800">
                <h1 className="text-2xl font-bold">Exam Portal</h1>
                <p className="text-sm text-indigo-300 mt-1">Admin Panel</p>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-indigo-800">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                    </div>
                    <div>
                        <p className="font-medium">{user?.full_name}</p>
                        <p className="text-xs text-indigo-300 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-indigo-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;