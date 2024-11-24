import { Input } from "@/components/ui/input"

type FormInputProps = {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: string;
    error?: string[];
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    showPassword?: boolean;
};

export default function FormInput({
    type,
    placeholder,
    value,
    onChange,
    icon,
    error,
    showPasswordToggle,
    onTogglePassword,
    showPassword
}: FormInputProps) {
    return (
        <div className="space-y-2">
            <div className="relative">
                <i className={`fas ${icon} absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10`} />
                <Input
                    type={showPassword ? 'text' : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`pl-10 bg-transparent border-gray-500 focus:border-white ${
                        error ? 'border-red-500' : ''
                    }`}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                )}
            </div>
            {error?.map((err, index) => (
                <p key={index} className="text-red-500 text-sm">{err}</p>
            ))}
        </div>
    );
}