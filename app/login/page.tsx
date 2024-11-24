'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, registerSchema } from '@/app/utils/valid';

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

    const validateForm = () => {
        try {
            if (isSignUpMode) {
                registerSchema.parse(formData);
            } else {
                loginSchema.parse(formData);
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

        if (!validateForm()) return;

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
                router.push('/dashboard');
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
            <Card className="w-full max-w-md bg-[#222222] text-gray-200 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-zinc-400">
                        {isSignUpMode ? 'Create an Account' : 'Welcome Back'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {apiError && (
                        <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900">
                            <AlertDescription>{apiError}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="mb-4 bg-green-900/20 border-green-900">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <div className="relative">
                                <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={`w-full bg-transparent border-b ${
                                        errors.username ? 'border-red-500' : 'border-gray-500'
                                    } pl-10 py-2 focus:outline-none focus:border-white placeholder-gray-500`}
                                />
                            </div>
                            {errors.username?.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm">{error}</p>
                            ))}
                        </div>

                        {/* Email Field (SignUp only) */}
                        {isSignUpMode && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full bg-transparent border-b ${
                                            errors.email ? 'border-red-500' : 'border-gray-500'
                                        } pl-10 py-2 focus:outline-none focus:border-white placeholder-gray-500`}
                                    />
                                </div>
                                {errors.email?.map((error, index) => (
                                    <p key={index} className="text-red-500 text-sm">{error}</p>
                                ))}
                            </div>
                        )}

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="relative">
                                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full bg-transparent border-b ${
                                        errors.password ? 'border-red-500' : 'border-gray-500'
                                    } pl-10 py-2 focus:outline-none focus:border-white placeholder-gray-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </button>
                            </div>
                            {errors.password?.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm">{error}</p>
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
                                    <i className="fas fa-spinner fa-spin mr-2" />
                                    {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                                </span>
                            ) : (
                                isSignUpMode ? 'Sign Up' : 'Sign In'
                            )}
                        </button>

                        {/* Mode Toggle */}
                        <p className="text-center text-gray-400 text-sm mt-4">
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
                </CardContent>
            </Card>
        </div>
    );
}