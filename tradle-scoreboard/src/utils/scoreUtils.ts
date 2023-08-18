import { Score } from './../types';

export const assignRanks = (scores: Score[]): Score[] => {
  let currentRank = 1;
  let prevAttempts = scores[0].attempts;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].attempts !== prevAttempts) {
      currentRank = i + 1;
      prevAttempts = scores[i].attempts;
    }
    scores[i].rank = currentRank;
  }
  return scores;
};
