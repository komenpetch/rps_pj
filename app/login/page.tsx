'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginSchema, registerSchema } from '@/app/utils/valid';
import AuthForm from './components/AuthForm';

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
    const [errors, setErrors] = useState<ValidationError>({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (formData: FormData) => {
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
                router.push('/dashboard');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#333333] px-4">
            <Card className="w-full max-w-sm bg-[#222222] text-gray-200 shadow-2xl">
                <CardHeader>
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

                    <AuthForm
                        isSignUpMode={isSignUpMode}
                        onSubmit={handleSubmit}
                        errors={errors}
                        isLoading={isLoading}
                    />

                    <p className="text-center text-gray-400 text-sm mt-6">
                        {isSignUpMode ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    className="text-white hover:underline"
                                    onClick={() => setIsSignUpMode(false)}
                                >
                                    Sign in
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    className="text-white hover:underline"
                                    onClick={() => setIsSignUpMode(true)}
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}