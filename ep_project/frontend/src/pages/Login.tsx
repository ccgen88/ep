import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });

            // Redirect based on role
            if (response.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.user.role === 'student') {
                navigate('/student/dashboard');
            } else if (response.user.role === 'examiner') {
                navigate('/examiner/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
            style={{
                backgroundImage: 'url("/nnrg-campus.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}>
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-200">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/nnrg-logo.png"
                            alt="NNRG Logo"
                            className="h-20 w-auto"
                            onError={(e) => {
                                // Fallback if image doesn't load
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Examination Portal</h1>
                    <p className="text-gray-600 mt-2">SAMPLE Institutions</p>
                    <p className="text-sm text-gray-500 mt-1">
                        SAMPLE Group of Institutions
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 font-semibold transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Engineering • Pharmacy • MBA
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        © 2024 SAMPLE Institutions. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;