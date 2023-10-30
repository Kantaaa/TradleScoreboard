import { Score } from './../types';


export function calculatePoints(attempts: number): number {
  const scoreMap: {[key: number]: number} = {
    1: 7,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 0 // Assuming 7 means "no luck"
  };
  return scoreMap[attempts] || 0;
}


export const assignRanks = (scores: Score[]): Score[] => {
  // Step 1: Calculate the new score for each entry
  scores.forEach(score => {
    score.point = calculatePoints(score.attempts);
  });

  // Step 2: Sort by the new score and then by name if scores are equal
  const sortedScores = [...scores].sort((a, b) => (b.point ?? 0) - (a.point ?? 0) || a.name.localeCompare(b.name));
  let currentRank = 0;
  let nextRank = 1;

  // Step 3: Assign ranks based on the new score
  for (let i = 0, previousScore: number | null = null; i < sortedScores.length; i++) {
    const score = sortedScores[i];

    if (score.point === previousScore) {
      score.rank = currentRank;
    } else {
      currentRank = nextRank;
      score.rank = currentRank;
      nextRank++;
    }

    previousScore = score.point ?? null;
  }

  return sortedScores;
};