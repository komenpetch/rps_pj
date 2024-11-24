'use client';

import { determineWinner, RPS_CHOICES, RpsChoice } from '@/app/utils/RpsLogic';
import { useState } from 'react';

export default function RpsGame() {
    const [playerChoice, setPlayerChoice] = useState<RpsChoice | null>(null);
    const [computerChoice, setComputerChoice] = useState<RpsChoice | null>(null);
    const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);

    const handleChoice = async (choice: RpsChoice) => {
        const computerRandomChoice = RPS_CHOICES[Math.floor(Math.random() * RPS_CHOICES.length)];
        const gameResult = determineWinner(choice, computerRandomChoice);

        setPlayerChoice(choice);
        setComputerChoice(computerRandomChoice);
        setResult(gameResult);

        if (gameResult === 'win') {
            await fetch('/api/scores/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points: 1 }),
            });
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6">Rock Paper Scissors</h1>

            <div className="flex gap-4 mb-6">
                {RPS_CHOICES.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => handleChoice(choice)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white"
                    >
                        {choice.charAt(0).toUpperCase() + choice.slice(1)}
                    </button>
                ))}
            </div>

            {playerChoice && computerChoice && (
                <div className="text-center mt-6">
                    <p>You chose: {playerChoice}</p>
                    <p>Computer chose: {computerChoice}</p>
                    <p className="text-xl font-bold mt-4">
                        {result === 'win' ? 'You Win!' : result === 'lose' ? 'You Lose!' : 'It\'s a Draw!'}
                    </p>
                </div>
            )}
        </div>
    );
}
