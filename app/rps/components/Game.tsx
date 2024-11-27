'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Undo2 } from "lucide-react"
import { 
    type Choice, 
    type GameResult,
    choices,
    getComputerChoice,
    determineWinner,
    calculatePoints
} from '@/app/utils/RpsGameLogic';
import ChoiceButton from './Choice'
import ResultDisplay from './ResultDisplay'

type GameState = {
    playerChoice: Choice | null;
    computerChoice: Choice | null;
    result: GameResult | null;
    points: number;
    isPlaying: boolean;
};

async function updateGameStats(result: GameResult, points: number) {
    try {
        const response = await fetch('/api/games/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                result,
                points
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save game result');
        }
    } catch (error) {
        console.error('Error saving game result:', error);
        throw error;
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

            await updateGameStats(result, points);

            setGameState({
                playerChoice: choice,
                computerChoice,
                result,
                points,
                isPlaying: false
            });

            toast({
                title: result === 'win' ? 'Victory!' : result === 'lose' ? 'Defeat!' : 'Draw!',
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
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-200">
                    Rock Paper Scissors
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {gameState.result ? (
                    <>
                        <ResultDisplay 
                            playerChoice={gameState.playerChoice!}
                            computerChoice={gameState.computerChoice!}
                            result={gameState.result}
                            points={gameState.points}
                        />
                        <div className="text-center">
                            <Button
                                onClick={resetGame}
                                variant="outline"
                                className="border-gray-600 text-gray-200 hover:bg-gray-700"
                                disabled={gameState.isPlaying}
                            >
                                <Undo2 className="mr-2 h-4 w-4" />
                                Play Again
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-center text-gray-400">
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
                    </>
                )}
            </CardContent>
        </Card>
    );
}