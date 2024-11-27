import { Trophy, Swords, Target, Award } from "lucide-react";

type StatsProps = {
    totalGames: number;
    winRate: number;
    highestScore: number;
    rank: number;
};

export default function StatsCards({ totalGames, winRate, highestScore, rank }: StatsProps) {
    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const stats = [
        {
            title: "Total Games",
            value: formatNumber(totalGames || 0),
            icon: Swords,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
        },
        {
            title: "Win Rate",
            value: `${Math.round(winRate || 0)}%`,
            icon: Target,
            color: "text-green-400",
            bgColor: "bg-green-400/10",
        },
        {
            title: "Highest Score",
            value: formatNumber(highestScore || 0),
            icon: Trophy,
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
        },
        {
            title: "Current Rank",
            value: `#${rank || '-'}`,
            icon: Award,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={stat.title}
                        className="bg-[#222222] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{stat.title}</p>
                                <p className={`text-2xl font-semibold ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}