import type { Choice } from '@/app/utils/RpsGameLogic';
import ChoiceButton from './Choice';

type ResultDisplayProps = {
    playerChoice: Choice;
    computerChoice: Choice;
    result: 'win' | 'lose' | 'draw';
    points: number;
};

export default function ResultDisplay({
    playerChoice,
    computerChoice,
    result,
    points
}: ResultDisplayProps) {
    const resultConfig = {
        win: { text: "You Win!", color: "text-green-400", bg: "bg-green-500/10" },
        lose: { text: "You Lose!", color: "text-red-400", bg: "bg-red-500/10" },
        draw: { text: "It's a Draw!", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    };

    return (
        <div className="space-y-6">
            {/* Choices Display */}
            <div className="flex justify-center items-center gap-8">
                <div className="text-center space-y-4">
                    <p className="text-gray-400">Your Choice</p>
                    <ChoiceButton 
                        choice={playerChoice} 
                        onClick={() => {}} 
                        disabled={true}
                        isSelected={true}
                    />
                </div>

                <div className="text-gray-400 text-3xl font-bold">VS</div>

                <div className="text-center space-y-4">
                    <p className="text-gray-400">Bot Choice</p>
                    <ChoiceButton 
                        choice={computerChoice} 
                        onClick={() => {}} 
                        disabled={true}
                        isSelected={true}
                    />
                </div>
            </div>

            {/* Result Display */}
            <div className={`${resultConfig[result].bg} rounded-lg p-6 text-center space-y-2`}>
                <h3 className={`text-2xl font-bold ${resultConfig[result].color}`}>
                    {resultConfig[result].text}
                </h3>
                <p className="text-gray-400">
                    Points earned: <span className="text-white font-bold">+{points}</span>
                </p>
            </div>
        </div>
    );
}