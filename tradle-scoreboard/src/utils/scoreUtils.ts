import { Score } from './../types';

export const assignRanks = (scores: Score[]): Score[] => {
  if (!scores || scores.length === 0) {
      return [];
  }

  let currentRank = 1;
  let prevAttempts = scores[0].attempts;

  for (let i = 0; i < scores.length; i++) {
      if (!scores[i] || typeof scores[i].attempts !== 'number') {
          console.error("Invalid score at index", i, scores[i]);
          continue;
      }

      if (scores[i].attempts !== prevAttempts) {
          currentRank++;
          prevAttempts = scores[i].attempts;
      }
      scores[i].rank = currentRank;
  }
  return scores;
};

