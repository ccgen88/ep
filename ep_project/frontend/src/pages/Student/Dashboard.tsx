import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Student Portal</h1>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2">Welcome, {user?.full_name}!</h2>
                    <p className="text-gray-600">Student Dashboard - Coming Soon</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">My Exams</h3>
                        <p className="text-3xl font-bold text-indigo-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">Completed</h3>
                        <p className="text-3xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
                        <p className="text-3xl font-bold text-orange-600">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;