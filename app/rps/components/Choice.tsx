import { Hand, Scroll, Scissors } from "lucide-react";
import type { Choice } from '@/app/utils/RpsGameLogic';

type ChoiceButtonProps = {
    choice: Choice;
    onClick: (choice: Choice) => void;
    disabled?: boolean;
    isSelected?: boolean;
};

const choiceConfig = {
    rock: {
        icon: Hand,
        color: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
        selectedColor: "bg-red-500/40 text-red-300"
    },
    paper: {
        icon: Scroll,
        color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
        selectedColor: "bg-blue-500/40 text-blue-300"
    },
    scissors: {
        icon: Scissors,
        color: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30",
        selectedColor: "bg-yellow-500/40 text-yellow-300"
    }
};

export default function ChoiceButton({ 
    choice, 
    onClick, 
    disabled = false,
    isSelected = false 
}: ChoiceButtonProps) {
    const Icon = choiceConfig[choice].icon;
    const baseColor = isSelected 
        ? choiceConfig[choice].selectedColor 
        : choiceConfig[choice].color;

    return (
        <button
            onClick={() => onClick(choice)}
            disabled={disabled}
            className={`
                ${baseColor}
                w-24 h-24 rounded-lg p-6
                transition-all duration-200 transform
                ${isSelected ? 'scale-110 ring-2 ring-gray-400' : 'hover:scale-105'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                flex items-center justify-center
            `}
        >
            <Icon className="w-full h-full" />
        </button>
    );
}