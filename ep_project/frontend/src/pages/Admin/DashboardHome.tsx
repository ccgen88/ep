import React from 'react';


<div className="bg-red-500 text-white p-4">
    If you see RED background, Tailwind is working!
</div>

const DashboardHome: React.FC = () => {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">Overview</h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-2xl font-bold mt-1">0</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Exams</p>
                            <p className="text-2xl font-bold mt-1">0</p>
                        </div>
                        <div className="text-4xl">📝</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Students</p>
                            <p className="text-2xl font-bold mt-1">0</p>
                        </div>
                        <div className="text-4xl">🎓</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Examiners</p>
                            <p className="text-2xl font-bold mt-1">0</p>
                        </div>
                        <div className="text-4xl">👨‍🏫</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                        <span className="text-2xl mb-2 block">➕</span>
                        <span className="font-medium">Add New User</span>
                    </button>
                    <button className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                        <span className="text-2xl mb-2 block">📝</span>
                        <span className="font-medium">Create Exam</span>
                    </button>
                    <button className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                        <span className="text-2xl mb-2 block">📊</span>
                        <span className="font-medium">View Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;