'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/app/utils/valid';
import { useAuth } from '../contexts/AuthContext';

type FormData = {
    username: string;
    email: string;
    password: string;
};

type ValidationError = {
    [K in keyof FormData]?: string[];
};

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({ 
        username: '', 
        email: '', 
        password: '' 
    });
    const [errors, setErrors] = useState<ValidationError>({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = (data: FormData) => {
        try {
            if (isSignUpMode) {
                registerSchema.parse(data);
            } else {
                loginSchema.parse(data);
            }
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: ValidationError = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        const field = err.path[0].toString() as keyof FormData;
                        if (!newErrors[field]) {
                            newErrors[field] = [];
                        }
                        newErrors[field]?.push(err.message);
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        if (!validateForm(formData)) return;

        setIsLoading(true);
        try {
            const endpoint = isSignUpMode ? '/api/auth/register' : '/api/auth/login';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setApiError(data.error || 'An error occurred');
                return;
            }

            if (isSignUpMode) {
                setSuccess('Account created successfully! You can now sign in.');
                setTimeout(() => setIsSignUpMode(false), 2000);
            } else {
                localStorage.setItem('session', JSON.stringify(data.session));
                setUser(data.session); // Update auth context
                router.push('/');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        setFormData({ username: '', email: '', password: '' });
        setErrors({});
        setApiError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#333333] px-4">
            <div className="bg-[#222222] text-gray-200 rounded-lg p-8 w-full max-w-sm shadow-2xl shadow-black">
                <h2 className="text-2xl font-bold text-center mb-6 text-zinc-400">
                    {isSignUpMode ? 'Create an Account' : 'Welcome Back'}
                </h2>

                {apiError && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-6">
                        {apiError}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-md mb-6">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div className="relative">
                        <div className="relative">
                            <i className="fas fa-user absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className={`w-full bg-transparent border-b ${
                                    errors.username ? 'border-red-500' : 'border-gray-500'
                                } pl-8 py-2 focus:outline-none focus:border-white placeholder-gray-500`}
                            />
                        </div>
                        {errors.username?.map((error, index) => (
                            <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                        ))}
                    </div>

                    {/* Email (SignUp) */}
                    {isSignUpMode && (
                        <div className="relative">
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className={`w-full bg-transparent border-b ${
                                        errors.email ? 'border-red-500' : 'border-gray-500'
                                    } pl-8 py-2 focus:outline-none focus:border-white placeholder-gray-500`}
                                />
                            </div>
                            {errors.email?.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Password */}
                    <div className="relative">
                        <div className="relative">
                            <i className="fas fa-lock absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className={`w-full bg-transparent border-b ${
                                    errors.password ? 'border-red-500' : 'border-gray-500'
                                } pl-8 py-2 focus:outline-none focus:border-white placeholder-gray-500`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all"
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.password?.map((error, index) => (
                            <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#444444] text-white py-2 rounded-md hover:bg-gray-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                            </span>
                        ) : (
                            isSignUpMode ? 'Sign Up' : 'Sign In'
                        )}
                    </button>

                    {/* Toggle */}
                    <p className="text-center text-gray-400 text-sm">
                        {isSignUpMode ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-white hover:underline"
                                >
                                    Sign in
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-white hover:underline"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
}