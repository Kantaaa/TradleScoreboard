import { Score } from './../types';

export const assignRanks = (scores: Score[]): Score[] => {
  const sortedScores = [...scores].sort((a, b) => a.attempts - b.attempts || a.name.localeCompare(b.name));

  let currentRank = 0;
  let previousAttempts: number | null = null;
  let nextRank = 1; // Initialize nextRank to 2

  for (let i = 0; i < sortedScores.length; i++) {
    const score = sortedScores[i];

    if (score.attempts === previousAttempts) {
      score.rank = currentRank; // Keep the same rank as the previous score
    } else {
      currentRank = nextRank; // Update the rank to nextRank
      score.rank = currentRank;
      nextRank++; // Increment nextRank for the next unique score
    }

    previousAttempts = score.attempts; // Update previousAttempts for the next iteration
  }

  return sortedScores;
};





