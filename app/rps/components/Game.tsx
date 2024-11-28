import { useState } from 'react';
import { Gamepad2, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
    type Choice, 
    choices,
    getComputerChoice,
    determineWinner,
    calculatePoints 
} from '@/app/utils/RpsGameLogic';
import ChoiceButton from './Choice';
import ResultDisplay from './ResultDisplay';

type GameState = {
    playerChoice: Choice | null;
    computerChoice: Choice | null;
    result: 'win' | 'lose' | 'draw' | null;
    points: number;
    isPlaying: boolean;
};

async function updateGameStats(result: 'win' | 'lose' | 'draw', points: number) {
    const response = await fetch('/api/games/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result, points })
    });

    if (!response.ok) {
        throw new Error('Failed to save game result');
    }
}

export default function Game() {
    const [gameState, setGameState] = useState<GameState>({
        playerChoice: null,
        computerChoice: null,
        result: null,
        points: 0,
        isPlaying: false
    });
    const { toast } = useToast();

    const handleChoice = async (choice: Choice) => {
        setGameState(prev => ({ ...prev, isPlaying: true }));

        try {
            const computerChoice = getComputerChoice();
            const result = determineWinner(choice, computerChoice);
            const points = calculatePoints(result);

            // Save game result
            await updateGameStats(result, points);

            // Update game state
            setGameState({
                playerChoice: choice,
                computerChoice,
                result,
                points,
                isPlaying: false
            });

            // Show toast notification
            toast({
                title: result === 'win' ? '🎉 Victory!' : result === 'lose' ? '😔 Defeat!' : '🤝 Draw!',
                description: `You earned ${points} points`,
                duration: 3000,
            });

        } catch (error) {
            console.error('Game error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save game result",
            });
            setGameState(prev => ({ ...prev, isPlaying: false }));
        }
    };

    const resetGame = () => {
        setGameState({
            playerChoice: null,
            computerChoice: null,
            result: null,
            points: 0,
            isPlaying: false
        });
    };

    return (
        <div className="bg-[#222222] rounded-lg shadow-xl border border-gray-700 p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-zinc-400 flex items-center justify-center gap-2">
                    <Gamepad2 className="w-6 h-6" />
                    Rock Paper Scissors
                </h1>
            </div>

            <div className="space-y-8">
                {gameState.result ? (
                    <div className="space-y-6">
                        <ResultDisplay 
                            playerChoice={gameState.playerChoice!}
                            computerChoice={gameState.computerChoice!}
                            result={gameState.result}
                            points={gameState.points}
                        />

                        <div className="text-center">
                            <button
                                onClick={resetGame}
                                disabled={gameState.isPlaying}
                                className="bg-[#444444] text-white px-6 py-3 rounded-md hover:bg-gray-700 
                                         transition-colors flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Play Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <p className="text-center text-gray-400 text-lg">
                            Make your choice:
                        </p>
                        <div className="flex justify-center gap-6">
                            {choices.map((choice) => (
                                <ChoiceButton
                                    key={choice}
                                    choice={choice}
                                    onClick={handleChoice}
                                    disabled={gameState.isPlaying}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}