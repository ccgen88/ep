import React from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b-2 border-indigo-600">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Administration Dashboard
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Sample College
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Integrated Campus</p>
                            <p className="text-xs text-indigo-600 font-semibold">
                                Engineering • Pharmacy • MBA
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
