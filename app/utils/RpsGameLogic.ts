export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw';

export const choices: Choice[] = ['rock', 'paper', 'scissors'];

export const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
};

export const determineWinner = (playerChoice: Choice, computerChoice: Choice): GameResult => {
    if (playerChoice === computerChoice) return 'draw';

    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }

    return 'lose';
};

export const calculatePoints = (result: GameResult): number => {
    switch (result) {
        case 'win':
            return 3;
        case 'draw':
            return 1;
        default:
            return 0;
    }
};