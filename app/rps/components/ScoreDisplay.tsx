import { Trophy, Flame } from 'lucide-react';

type ScoreDisplayProps = {
    score: number;
    streak: number;
};

export default function ScoreDisplay({ score, streak }: ScoreDisplayProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Total Score</p>
                    <p className="text-2xl font-bold text-white">{score}</p>
                </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/10">
                    <Flame className="w-6 h-6 text-red-400" />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Win Streak</p>
                    <p className={`text-2xl font-bold text-white ${streak > 2 ? 'animate-pulse' : ''}`}>
                        {streak}
                    </p>
                </div>
            </div>
        </div>
    );
}