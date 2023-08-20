import { Score } from './../types';

export const assignRanks = (scores: Score[]): Score[] => {
    // Sort scores by attempts in ascending order
    const sortedScores = [...scores].sort((a, b) => a.attempts - b.attempts);
  
    let rank = 1;
    for (let i = 0; i < sortedScores.length; i++) {
      if (i > 0 && sortedScores[i].attempts !== sortedScores[i - 1].attempts) {
        rank++;
      }
      sortedScores[i].rank = rank;
    }
  
    return sortedScores;
  };
  
