import { useState } from 'react';
import { Button } from "@/components/ui/button"
import FormInput from './FormInput';

type FormData = {
    username: string;
    email: string;
    password: string;
};

type ValidationError = {
    [K in keyof FormData]?: string[];
};

type AuthFormProps = {
    isSignUpMode: boolean;
    onSubmit: (data: FormData) => Promise<void>;
    errors: ValidationError;
    isLoading: boolean;
};

export default function AuthForm({ 
    isSignUpMode, 
    onSubmit, 
    errors,
    isLoading 
}: AuthFormProps) {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                icon="fa-user"
                error={errors.username}
            />

            {isSignUpMode && (
                <FormInput
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon="fa-envelope"
                    error={errors.email}
                />
            )}

            <FormInput
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon="fa-lock"
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#444444] hover:bg-gray-700"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2" />
                        {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                    </span>
                ) : (
                    isSignUpMode ? 'Sign Up' : 'Sign In'
                )}
            </Button>
        </form>
    );
}