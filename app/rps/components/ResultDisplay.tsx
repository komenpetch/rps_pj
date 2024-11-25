import { Card, CardContent } from "@/components/ui/card"
import ChoiceButton from './Choice'
import { Choice, GameResult } from "@/app/utils/RpsGameLogic";

type ResultDisplayProps = {
    playerChoice: Choice;
    computerChoice: Choice;
    result: GameResult;
    points: number;
};

export default function ResultDisplay({ 
    playerChoice, 
    computerChoice, 
    result, 
    points 
}: ResultDisplayProps) {
    const resultMessages = {
        win: "You Win! 🎉",
        lose: "You Lose! 😢",
        draw: "It's a Draw! 🤝"
    };

    const resultColors = {
        win: "text-green-400",
        lose: "text-red-400",
        draw: "text-yellow-400"
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6 space-y-6">
                <div className="flex justify-between items-center gap-8">
                    <div className="text-center space-y-4">
                        <p className="text-gray-400">Your Choice</p>
                        <ChoiceButton 
                            choice={playerChoice} 
                            onClick={() => {}} 
                            disabled={true}
                            isSelected={true}
                        />
                    </div>
                    <div className="text-center space-y-4">
                        <p className="text-gray-400">Computer's Choice</p>
                        <ChoiceButton 
                            choice={computerChoice} 
                            onClick={() => {}} 
                            disabled={true}
                            isSelected={true}
                        />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className={`text-2xl font-bold ${resultColors[result]}`}>
                        {resultMessages[result]}
                    </h3>
                    <p className="text-gray-400">
                        Points earned: <span className="text-white font-bold">+{points}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}