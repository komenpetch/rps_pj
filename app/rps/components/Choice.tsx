import { Choice } from "@/app/utils/RpsGameLogic";
import { Button } from "@/components/ui/button"
import { Hand, Scroll, Scissors } from "lucide-react"

type ChoiceProps = {
    choice: Choice;
    onClick: (choice: Choice) => void;
    disabled?: boolean;
    isSelected?: boolean;
};

const choiceIcons = {
    rock: Hand,
    paper: Scroll,
    scissors: Scissors,
};

const choiceColors = {
    rock: "bg-red-500 hover:bg-red-600",
    paper: "bg-blue-500 hover:bg-blue-600",
    scissors: "bg-yellow-500 hover:bg-yellow-600",
};

export default function ChoiceButton({ choice, onClick, disabled, isSelected }: ChoiceProps) {
    const Icon = choiceIcons[choice];
    const colorClass = choiceColors[choice];

    return (
        <Button
            onClick={() => onClick(choice)}
            disabled={disabled}
            className={`
                ${colorClass}
                w-24 h-24 rounded-full p-6 transition-all duration-200
                ${isSelected ? 'scale-110 ring-4 ring-white' : 'hover:scale-105'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            <Icon className="w-full h-full text-white" />
        </Button>
    );
}