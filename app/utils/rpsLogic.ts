export const RPS_CHOICES = ['rock', 'paper', 'scissors'] as const;
export type RpsChoice = typeof RPS_CHOICES[number];

export function determineWinner(playerChoice: RpsChoice, computerChoice: RpsChoice): 'win' | 'lose' | 'draw' {
    if (playerChoice === computerChoice) return 'draw';

    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }

    return 'lose';
}
