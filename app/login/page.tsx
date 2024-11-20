'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        setFormData({ username: '', email: '', password: '' });
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#333333]">
            <div className="bg-[#333333] text-gray-200 rounded-lg p-8 w-full max-w-sm shadow-2xl shadow-black">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isSignUpMode ? 'Sign up' : 'Sign in'}
                </h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

                <form className="space-y-6">
                    {/* Username */}
                    <div className="relative">
                        <i className="fas fa-user absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            className="w-full bg-transparent border-b border-gray-500 pl-8 py-2 focus:outline-none focus:border-blue-400 placeholder-gray-500"
                        />
                    </div>

                    {/* Email (SignUp)*/}
                    {isSignUpMode && (
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full bg-transparent border-b border-gray-500 pl-8 py-2 focus:outline-none focus:border-blue-400 placeholder-gray-500"
                            />
                        </div>
                    )}

                    {/* Password */}
                    <div className="relative">
                        <i className="fas fa-lock absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="w-full bg-transparent border-b border-gray-500 pl-8 py-2 focus:outline-none focus:border-blue-400 placeholder-gray-500"
                        />
                    </div>

                    {/* Forgot Password */}
                    {!isSignUpMode && (
                        <div className="text-right">
                            <a
                                href="/forgot-password"
                                className="text-sm text-blue-400 hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
                    >
                        {isSignUpMode ? 'Sign up' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    {isSignUpMode ? (
                        <>
                            Already have an account?{' '}
                            <button
                                className="text-blue-400 hover:underline"
                                onClick={toggleMode}
                            >
                                Sign in
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <button
                                className="text-blue-400 hover:underline"
                                onClick={toggleMode}
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
